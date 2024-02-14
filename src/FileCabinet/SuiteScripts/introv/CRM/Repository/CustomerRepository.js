/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */

define([
    'N/record',
    'N/search',
    './RewardActions/RewardActionFactory',
    '../DAO/CustomerDAO',
    '../DAO/EarnedRewardsDAO',
    '../DAO/RewardSchemeDAO',
    '../DAO/MembershipTypeDAO',
    '../DAO/ItemCategoryDAO',
    '../DAO/ItemDAO',
    '../DAO/RedemptionVendorDAO',
    '../DAO/SubsidiaryDAO',
    '../DAO/IntegrationMappingDAO',
    '../DAO/LocationDAO',
    '../DAO/ChannelDAO',
    '../DAO/SalesOrderDAO',
    '../DAO/InventoryNumberDAO',
    '../DAO/RedeemCodeMasterDAO',
    '../DAO/TemporaryCustomerDAO',
    '../Services/ChinaDBServices',
    '../Services/ShopifyServices',
    '../../lib/Time/moment-timezone',
    '../../lib/lodash',
    '../../utils/DateUtils',
    '../../utils/TypeChecker',
    '../../utils/EncryptUtils',
    '../../utils/EmailNotification',
    '../Constants/Constants',
    '../DAO/InvoiceDAO',
    '../Constants/Constants',
], (
    record,
    search,
    RewardActionFactory,
    CustomerDAO,
    EarnedRewardsDAO,
    RewardSchemeDAO,
    MembershipTypeDAO,
    ItemCategoryDAO,
    ItemDAO,
    RedemptionVendorDAO,
    SubsidiaryDAO,
    IntegrationMappingDAO,
    LocationDAO,
    ChannelDAO,
    SalesOrderDAO,
    InventoryNumberDAO,
    RedeemCodeMasterDAO,
    TemporaryCustomerDAO,
    ChinaDBServices,
    ShopifyServices,
    moment,
    _,
    DateUtils,
    TypeChecker,
    EncryptUtils,
    EmailNotification,
    Constant,
    InvoiceDAO,
    constants
) => {
    class CustomerRepository {
        constructor() {}

        findCustomerByKey(searchParams) {
            const { CUSTOMER_ID, EMAIL, PHONE } = searchParams
            log.debug('before findByKey')
            const Customer = new CustomerDAO().findByKey({ id: CUSTOMER_ID, email: EMAIL, phone: PHONE })
            log.debug('1', Customer)
            if (_.isEmpty(Customer)) {
                log.debug('1111')
                return null
            }

            const customerId = Customer.CUSTOMER_ID

            // const POINT_BALANCE = this._getPointSummaryByCustomerId(customerId)
            const POINT_SUMMARY = new EarnedRewardsDAO().findPointSummaryByExpiryDate(customerId, {
                startDate: null,
                endDate: null,
            })
            const POINT_BALANCE = Object.values(POINT_SUMMARY).reduce(
                (accumulator, value) => accumulator + (value || 0),
                0
            )

            const dateUtils = new DateUtils()
            const oldestTransactionDate = new SalesOrderDAO().findTierProgressDeadlineByCustomerId(customerId)
            log.debug('oldestTransactionDate', oldestTransactionDate)
            const TIER_PROGRESS_DEADLINE = dateUtils.transformDate(
                dateUtils.transformDate(
                    oldestTransactionDate,
                    { value: 1, unit: 'years' },
                    { inputFormat: 'DD/MM/YYYY', outputFormat: 'YYYY-MM-DD' }
                ),
                { value: -1, unit: 'days' },
                { inputFormat: 'YYYY-MM-DD', outputFormat: 'YYYY-MM-DD' }
            )

            const { SPENDING_TO, AVAILABLE_TIER, NEXT_TIER, CUMULATIVE_SPENDING_PERIOD, TIER_ID, MAINTAIN, TOP_TIER } =
                new MembershipTypeDAO().findByTier(Customer.MEMBER_TYPE.EN)
            let nextTierDetails = NEXT_TIER ? new MembershipTypeDAO().findByTier(NEXT_TIER) : null
            const { START_DATE, END_DATE } = this._getStartEndDateForFindingAccumulativeAmt(
                Number(nextTierDetails?.CUMULATIVE_SPENDING_PERIOD || CUMULATIVE_SPENDING_PERIOD),
                Customer.EFFECTIVE_TO,
                MAINTAIN
            )

            let CUMULATIVE_AMT = new SalesOrderDAO().findAccumulativeAmt(customerId, {
                startDate: START_DATE,
                endDate: END_DATE,
            })
            var FIXED_SPENDING_TO
            if (!SPENDING_TO) FIXED_SPENDING_TO = new MembershipTypeDAO().findByTier('Platinum').SPENDING_TO

            var SHOWING_SPENDING_TO, SHOWING_NEXT_TIER, SHOWING_TIER_PROGRESS_DEADLINE
            if ((MAINTAIN && CUMULATIVE_AMT === 0) || TOP_TIER) {
                SHOWING_SPENDING_TO = ''
                SHOWING_NEXT_TIER = ''
                SHOWING_TIER_PROGRESS_DEADLINE = ''
            } else {
                SHOWING_SPENDING_TO = SPENDING_TO || ''
                SHOWING_NEXT_TIER = nextTierDetails ? nextTierDetails.TIER_ID : ''
                SHOWING_TIER_PROGRESS_DEADLINE = TIER_PROGRESS_DEADLINE
            }

            const interestedProductNames = new ItemCategoryDAO()
                .findByInternalIds(Customer.INTERESTED_PRODUCT.split(','))
                .map((item) => item.NAME)
            log.debug('interestedProductNames', JSON.stringify(interestedProductNames))

            return {
                ...Customer,
                INTERESTED_PRODUCT: interestedProductNames,
                POINT_BALANCE: POINT_BALANCE || 0,
                POINT_SUMMARY: POINT_SUMMARY || {},
                CUMULATIVE_AMT,
                AVAILABLE_TIER,
                SPENDING_TO: SHOWING_SPENDING_TO,
                NEXT_TIER: SHOWING_NEXT_TIER,
                TIER_PROGRESS_DEADLINE: oldestTransactionDate ? SHOWING_TIER_PROGRESS_DEADLINE : '',
                TIER_ID,
            }
        }

        findChinaCustomerByKey(searchParams, findInactive) {
            const { CUSTOMER_ID, EMAIL, PHONE } = searchParams
            let response, nsCustomerObj
            const customerKey = { phone: PHONE, email: EMAIL }

            customerKey.customerId =
                findInactive === 'findInactive'
                    ? this.findCustomerByPhoneOrEmailBasic(PHONE, EMAIL).CUSTOMER_ID
                    : new CustomerDAO().findByKey({ id: CUSTOMER_ID || null, email: EMAIL, phone: PHONE }).CUSTOMER_ID

            try {
                // throw new Error('test')
                response = new ChinaDBServices().findCustomerByKey(customerKey)
            } catch (e) {
                log.error('Error ChinaDBServices', e)
                nsCustomerObj = { FIRST_NAME: 'Customer', LAST_NAME: '' }
            }

            let Customer =
                CUSTOMER_ID || EMAIL || (PHONE && response?.body) ? JSON.parse(response.body).result[0] : null

            Customer = Object.assign({}, nsCustomerObj, Customer)
            if (_.isEmpty(Customer)) {
                Customer = new CustomerDAO().findByKeyOnStaging({ id: CUSTOMER_ID, email: EMAIL, phone: PHONE })
            }
            nsCustomerObj = new CustomerDAO().findByKey({ id: CUSTOMER_ID, email: EMAIL, phone: PHONE })
            if (_.isEmpty(Customer)) return null

            const customerId = Customer.CUSTOMER_ID

            // const POINT_BALANCE = this._getPointSummaryByCustomerId(customerId)
            const POINT_SUMMARY = new EarnedRewardsDAO().findPointSummaryByExpiryDate(customerId, {
                startDate: null,
                endDate: null,
            })
            const POINT_BALANCE = Object.values(POINT_SUMMARY).reduce(
                (accumulator, value) => accumulator + (value || 0),
                0
            )
            const dateUtils = new DateUtils()
            const oldestTransactionDate = new SalesOrderDAO().findTierProgressDeadlineByCustomerId(customerId)
            const TIER_PROGRESS_DEADLINE = dateUtils.transformDate(
                dateUtils.transformDate(
                    oldestTransactionDate,
                    { value: 1, unit: 'years' },
                    { inputFormat: 'DD/MM/YYYY', outputFormat: 'YYYY-MM-DD' }
                ),
                { value: -1, unit: 'days' },
                { inputFormat: 'YYYY-MM-DD', outputFormat: 'YYYY-MM-DD' }
            )

            Customer.MEMBER_TYPE = nsCustomerObj ? nsCustomerObj.MEMBER_TYPE : null
            log.debug('MemType', Customer)
            var nextTierDetails
            if (Customer.MEMBER_TYPE) {
                const {
                    SPENDING_TO,
                    AVAILABLE_TIER,
                    NEXT_TIER,
                    CUMULATIVE_SPENDING_PERIOD,
                    TIER_ID,
                    MAINTAIN,
                    TOP_TIER,
                } = new MembershipTypeDAO().findByTier(Customer.MEMBER_TYPE.EN)
                nextTierDetails = NEXT_TIER ? new MembershipTypeDAO().findByTier(NEXT_TIER) : null
                const { START_DATE, END_DATE } = this._getStartEndDateForFindingAccumulativeAmt(
                    Number(nextTierDetails?.CUMULATIVE_SPENDING_PERIOD || CUMULATIVE_SPENDING_PERIOD),
                    Customer.EFFECTIVE_TO,
                    MAINTAIN
                )

                const CUMULATIVE_AMT = new SalesOrderDAO().findAccumulativeAmt(customerId, {
                    startDate: START_DATE,
                    endDate: END_DATE,
                })
                var FIXED_SPENDING_TO
                if (!SPENDING_TO) FIXED_SPENDING_TO = new MembershipTypeDAO().findByTier('Platinum').SPENDING_TO

                var SHOWING_SPENDING_TO, SHOWING_NEXT_TIER, SHOWING_TIER_PROGRESS_DEADLINE
                if ((MAINTAIN && CUMULATIVE_AMT === 0) || TOP_TIER) {
                    SHOWING_SPENDING_TO = ''
                    SHOWING_NEXT_TIER = ''
                    SHOWING_TIER_PROGRESS_DEADLINE = ''
                } else {
                    SHOWING_SPENDING_TO = SPENDING_TO || ''
                    SHOWING_NEXT_TIER = nextTierDetails ? nextTierDetails.TIER_ID : ''
                    SHOWING_TIER_PROGRESS_DEADLINE = TIER_PROGRESS_DEADLINE
                }
                const interestedProductNames = Customer.INTERESTED_PRODUCT.split(',')
                Customer.INTERNAL_ID = nsCustomerObj.INTERNAL_ID
                log.debug('Customer', Customer)
                return {
                    ...Customer,
                    INTERESTED_PRODUCT: interestedProductNames,
                    POINT_BALANCE: POINT_BALANCE || 0,
                    POINT_SUMMARY: POINT_SUMMARY || 0,
                    CUMULATIVE_AMT,
                    SPENDING_TO: SHOWING_SPENDING_TO,
                    AVAILABLE_TIER,
                    NEXT_TIER: SHOWING_NEXT_TIER,
                    DEFAULT_LANGUAGE: Customer.D_LANG,
                    REGISTRATION_DATE: Customer.REGISTRATION_DATE
                        ? moment(Customer.REGISTRATION_DATE).tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')
                        : '',
                    EFFECTIVE_DATE: Customer.EFFECTIVE_DATE
                        ? // ? moment(Customer.EFFECTIVE_DATE, 'DD/MM/YYYY').tz('Asia/Hong_Kong').format('YYYY-MM-DD')
                          moment(Customer.EFFECTIVE_DATE).tz('Asia/Hong_Kong').format('YYYY-MM-DD') === 'Invalid date'
                            ? moment(Customer.EFFECTIVE_DATE, 'DD/MM/YYYY').tz('Asia/Hong_Kong').format('YYYY-MM-DD')
                            : moment(Customer.EFFECTIVE_DATE).tz('Asia/Hong_Kong').format('YYYY-MM-DD')
                        : '',
                    EFFECTIVE_TO: Customer.EFFECTIVE_TO
                        ? moment(Customer.EFFECTIVE_TO).tz('Asia/Hong_Kong').format('YYYY-MM-DD')
                        : '',
                    WELCOME_GIFT_DATE: Customer.WELCOME_GIFT_DATE
                        ? // ? moment(Customer.WELCOME_GIFT_DATE, 'DD/MM/YYYY').tz('Asia/Hong_Kong').format('YYYY-MM-DD')
                          moment(Customer.WELCOME_GIFT_DATE).tz('Asia/Hong_Kong').format('YYYY-MM-DD') ===
                          'Invalid date'
                            ? moment(Customer.WELCOME_GIFT_DATE, 'DD/MM/YYYY').tz('Asia/Hong_Kong').format('YYYY-MM-DD')
                            : moment(Customer.WELCOME_GIFT_DATE).tz('Asia/Hong_Kong').format('YYYY-MM-DD')
                        : '',
                    DUMMY_DATE1: Customer.DUMMY_DATE1
                        ? moment(Customer.DUMMY_DATE1).tz('Asia/Hong_Kong').format('DD/MM/YYYY')
                        : '',
                    DUMMY_DATE2: Customer.DUMMY_DATE2
                        ? moment(Customer.DUMMY_DATE2).tz('Asia/Hong_Kong').format('DD/MM/YYYY')
                        : '',
                    DUMMY_TEXT1: Customer.DUMMY_TEXT1 ? Customer.DUMMY_TEXT1 : '',
                    DUMMY_TEXT2: Customer.DUMMY_TEXT2 ? Customer.DUMMY_TEXT2 : '',
                    TIER_PROGRESS_DEADLINE: oldestTransactionDate ? SHOWING_TIER_PROGRESS_DEADLINE : '',
                    TIER_ID,
                }
            } else {
                //Returning Inactive Customer
                return {
                    ...Customer,
                }
            }
        }

        findCustomerByPhoneOrEmail(phone, email) {
            return new CustomerDAO().findByKey({ phone, email })
        }

        findCustomerByPhoneOrEmailBasic(phone, email, areaCode) {
            return new CustomerDAO().findByKey({ phone, email }, true, areaCode)
        }

        createTempChinaCustomer(customerInfo, existingInternalID) {
            // Data access logic to create a China customer
            try {
                var internalId = existingInternalID
                if (!internalId) {
                    internalId = new CustomerDAO().createEmptyIndividualCustomer(customerInfo)
                }
                const entityId = new CustomerDAO().findEntityIdByInternalId(internalId)

                const tempCustomer = new TemporaryCustomerDAO().create(customerInfo, entityId, internalId)
                // const response = new ChinaDBServices().createCustomer(customerInfo, entityId)
                // this._chkCustomerSubsidiary(internalId, 10)
                // this._chkCustomerSubsidiary(internalId, 14)
                log.debug('return CN result', entityId + ' | ' + internalId)
                return { entityId: entityId || null, internalId: internalId || null }
            } catch (e) {
                log.debug('Error Create CN Customer', e)
            }
        }

        findPointHistoryByCustomerId(internalId) {
            const customerId = new CustomerDAO().findByKey({ id: internalId }).CUSTOMER_ID
            const redemptionHistory = new EarnedRewardsDAO().findRedemptionHistory(customerId, {
                startDate: null,
                endDate: null,
            })
            const earnedHistory = new EarnedRewardsDAO().findEarnedHistory(customerId, 'normalView', {
                startDate: null,
                endDate: null,
            })
            const dateUtils = new DateUtils()
            return [
                ..._.map(earnedHistory, _.partialRight(_.pick, ['points', 'createdDate', 'transaction'])),
                ..._.map(redemptionHistory, _.partialRight(_.pick, ['points', 'createdDate', 'transaction'])),
            ].sort((a, b) => {
                const dateA = moment(a.createdDate, 'YYYY-MM-DD')
                const dateB = moment(b.createdDate, 'YYYY-MM-DD')

                // First, compare by dateTime
                const dateTimeComparison = dateB.diff(dateA, 'days')
                if (dateTimeComparison !== 0) {
                    return dateTimeComparison // Sort by dateTime in descending order
                }

                // If dateTime is the same, compare by points
                const pointsA = a.points
                const pointsB = b.points

                // Check if both points are positive or negative
                const areBothPositive = pointsA >= 0 && pointsB >= 0
                const areBothNegative = pointsA < 0 && pointsB < 0

                // Sort based on points and positive/negative criteria
                if (areBothPositive || areBothNegative) {
                    return pointsB - pointsA // Sort by points in descending order
                } else {
                    return areBothPositive ? -1 : 1 // Sort positive points before negative points
                }
            })
        }

        updateCustomer(customer, mergeStatus, updatedInfo) {
            // this._chkCustomerSubsidiary(customer.INTERNAL_ID, 10)
            this._chkCustomerSubsidiary(customer.INTERNAL_ID, 14)

            return new CustomerDAO().update(customer, { ...updatedInfo }, mergeStatus)
        }

        createCustomer(customerInfo) {
            const internalId = new CustomerDAO().create({
                ...customerInfo,
            })
            const entityId = new CustomerDAO().findEntityIdByInternalId(internalId)
            try {
                // this._chkCustomerSubsidiary(internalId, 10)
                this._chkCustomerSubsidiary(internalId, 14)
            } catch (e) {
                log.error('error', e)
            }

            return { internalId, entityId }
        }

        _chkCustomerSubsidiary(customerId, subsidiary) {
            const customerSearchObj = search.create({
                type: 'customer',
                filters: [['internalid', 'anyof', customerId]],
                columns: [
                    search.createColumn({
                        name: 'name',
                        join: 'mseSubsidiary',
                    }),
                    search.createColumn({
                        name: 'internalid',
                        join: 'mseSubsidiary',
                    }),
                ],
            })
            const searchResult = customerSearchObj.run().getRange({ start: 0, end: 1000 })
            var originalSubsidArr = new Array()
            log.debug('searchResult.length', searchResult.length)
            for (let i = 0; i < searchResult.length; i++) {
                let subsidiary_id = searchResult[i].getValue({ name: 'internalid', join: 'mseSubsidiary' })
                originalSubsidArr.push(subsidiary_id)
            }
            log.debug('Start Add Subsidiary ', originalSubsidArr)
            // let set = new Set(originalSubsidArr)
            let valueToCheck = ['10', '14'] // HARDCODE: 10: IDL, 14 : AIL

            const rec = record.load({
                type: 'customer',
                id: customerId,
                isDynamic: true,
            })

            valueToCheck.forEach((value) => {
                log.debug('SUBSIDID', value)
                if (!originalSubsidArr.includes(value)) {
                    rec.selectNewLine({ sublistId: 'submachine' })
                    log.debug('New Subsidiary Line')
                    rec.setCurrentSublistValue({
                        sublistId: 'submachine',
                        fieldId: 'subsidiary',
                        value: value,
                    })
                    rec.commitLine({ sublistId: 'submachine' })
                    const recid = rec.save()
                    log.debug('Add subsidiary to Customer success', recid)
                }
            })
        }

        findPointBalanceByCustomerId(customerId, spec) {
            return this._getPointSummaryByCustomerId(customerId, spec)
        }

        createRewardRecord(mode, info) {
            const rewardActionFactory = new RewardActionFactory(mode, info)
            const action = rewardActionFactory.getRewardActionByMode()
            return action.execute()
        }

        isTransIdUsed(transId, decryptTranId) {
            log.debug('isTransIdUsed transId', transId + ' | ' + decryptTranId)
            if (_.isEmpty(transId)) return false
            // const encryptUtils = new EncryptUtils()
            // const encryptedId = transId
            // const decryptedId = encryptUtils.decryptTranId(transId)

            const customerList = new CustomerDAO().findCustomersByTransId(decryptTranId)
            log.debug('customerList', customerList)
            const erList = new InvoiceDAO().findRelatedTransIDUsedByInvAndEr(transId)
            log.debug('erList > 0', erList.length > 0)
            // if (erList.length === 0) return erList.length > 0;

            // const soList = new SalesOrderDAO().findByTransId(decryptedId)
            // log.debug('isTransIdUsed soList', JSON.stringify(soList))
            // if (soList.length === 0) return customerList.length > 1

            // const sixMonthsAgo = moment().add(-6, 'months')
            // const boundedInvList = erList.filter((earnRewards) => {
            //     const createdDate = moment(earnRewards.getValue("createddate"))
            //     return createdDate.isSameOrAfter(sixMonthsAgo)
            // })
            // log.debug('isTransIdUsed boundedSOList', JSON.stringify(boundedSOList))
            return erList.length > 0 || customerList.length > 1
        }

        isChinaCustomer(searchParams) {
            const isChina = new CustomerDAO().findByKey({
                id: searchParams.CUSTOMER_ID,
                email: searchParams.EMAIL,
                phone: searchParams.PHONE,
            })?.IS_CHINA_CUSTOMER
            log.debug('isChinaCustomer', isChina)
            return isChina
        }

        redeemItem(searchParams, Customer) {
            const remainingPoints = this.findPointBalanceByCustomerId(Customer.CUSTOMER_ID)
            if (remainingPoints < searchParams.REDEMPTION_POINTS)
                return {
                    code: Constant.API_STATUS_CODE.INSUFFICIENT_POINTS.CODE,
                    message: Constant.API_STATUS_CODE.INSUFFICIENT_POINTS.MESSAGE,
                }

            const fineItemList = searchParams.REDEEM_ITEM.map((itemQty) => ({
                name: itemQty.split('_')[0],
                qty: itemQty.split('_')[1],
            }))
            const itemList = new ItemDAO().findByNames(fineItemList.map((item) => item.name))

            const REDEEM_ITEM_LIST = []
            fineItemList.forEach((redeemItem) => {
                const matchingItem = itemList.find((item) => item.NAME === redeemItem.name)

                if (matchingItem) {
                    const combinedItem = _.merge({}, matchingItem, redeemItem)
                    REDEEM_ITEM_LIST.push(combinedItem)
                }
            })
            log.debug('redemption item list2', JSON.stringify(REDEEM_ITEM_LIST))

            const redeemCodeMasterList = new RedeemCodeMasterDAO().findByItems(itemList.map((item) => item.INTERNAL_ID))
            log.debug('redeemItemList', JSON.stringify(redeemCodeMasterList))
            const counts = redeemCodeMasterList.reduce((acc, value) => {
                acc[value] = (acc[value] || 0) + 1
                return acc
            }, {})
            log.debug('counts', JSON.stringify(counts))

            const errorMessage = []
            if (searchParams.VENDOR !== 'eRun') {
                itemList
                    .filter((item) => item.type === 'InvtPart')
                    .forEach((item) => {
                        const remainingItemQty = new InventoryNumberDAO()
                            .findOnHandLots(item.INTERNAL_ID)
                            .reduce((acc, lot) => acc + parseFloat(lot.available), 0)
                        if (remainingItemQty < 1) {
                            errorMessage.push(`${item.NAME} is out of stock`)
                        }
                    })
                REDEEM_ITEM_LIST.forEach((item) => {
                    const totalQty = counts[item.INTERNAL_ID] || 0
                    if (totalQty < item.qty) {
                        errorMessage.push(`${item.NAME} is out of stock`)
                    }
                })
            }
            if (errorMessage.length > 0)
                return {
                    code: Constant.API_STATUS_CODE.INSUFFICIENT_ITEM_QTY.CODE,
                    message: Constant.API_STATUS_CODE.INSUFFICIENT_ITEM_QTY.MESSAGE,
                    // details: errorMessage,
                }

            const parts = searchParams.CHANNEL.split(':')
            const channelName = parts[parts.length - 1].trim()
            const channelParent = parts
                .slice(0, parts.length - 1)
                .join(':')
                .trim()

            const redemptionVendor = new RedemptionVendorDAO().findByName(searchParams.VENDOR)
            const subsidiaryID = new SubsidiaryDAO().findByName(searchParams.SUBSIDIARY).INTERNAL_ID
            const locationID =
                redemptionVendor.INTERNAL_ID === '1'
                    ? new IntegrationMappingDAO().findLocationIdByPOSID(searchParams.LOCATION).NS_ID
                    : new LocationDAO().findByName(searchParams.LOCATION).internalId
            const channelID =
                redemptionVendor.INTERNAL_ID === '1'
                    ? new IntegrationMappingDAO().findChannelIdByPOSID(searchParams.CHANNEL).NS_ID
                    : new ChannelDAO().findByNameAndParent(channelName, channelParent).internalId
            const name = this._getRedemptionRecordName()

            const redemptionID = this.createRewardRecord('redemption', {
                ...searchParams,
                SUBSIDIARY: subsidiaryID,
                LOCATION: locationID,
                CHANNEL: channelID,
                INTERNAL_ID: Customer.INTERNAL_ID,
                REDEEM_ITEM_LIST,
                VENDOR: redemptionVendor.INTERNAL_ID,
                NAME: name,
                FIRST_NAME: Customer.FIRST_NAME,
                LAST_NAME: Customer.LAST_NAME,
                CUSTOMER_ID: Customer.CUSTOMER_ID,
                EMAIL: Customer.EMAIL,
            })

            const redemptionName = new EarnedRewardsDAO().findRedemptionById(redemptionID).name
            return {
                redemptionName,
                REDEEM_ITEM_LIST,
                code: Constant.API_STATUS_CODE.SUCCESS.CODE,
                message: Constant.API_STATUS_CODE.SUCCESS.MESSAGE,
            }
        }

        issueRedeemCodeAndSendEmail(data) {
            log.debug('searchParams', JSON.stringify(data))
            const redeemCodeMasterDAO = new RedeemCodeMasterDAO()
            const { REDEEM_ITEM_LIST: redeemedList } = data

            const redeemCodeMasterList = redeemCodeMasterDAO.findByInternalId(
                redeemedList.map((item) => item.INTERNAL_ID)
            )
            const redeemCodeListByProduct = _.groupBy(redeemCodeMasterList, 'voucherItem')
            log.debug('redeemCodeListByProduct', JSON.stringify(_.keys(redeemCodeListByProduct)))

            const redeemCodeList = []
            for (const redeemedProduct of redeemedList) {
                const redeemCodeMaster = redeemCodeListByProduct[redeemedProduct.INTERNAL_ID]
                const redeemedQty = parseInt(redeemedProduct.qty)
                log.debug('redeemedProduct', JSON.stringify(redeemedProduct))
                if (!redeemCodeMaster || redeemCodeMaster.length < redeemedQty) return constants.INSUFFICIENT_ITEM_QTY
                for (let i = 0; i < redeemedQty; i++) {
                    const redeemCode = redeemCodeMaster[i]
                    // if (!redeemCode.sent)
                    redeemCodeList.push(redeemCode)
                }
            }
            log.debug('redeemCodeList', JSON.stringify(redeemCodeList))

            for (let redeemCodeMaster of redeemCodeList) {
                const bodyFields = [
                    {
                        field: 'custrecordrcmastersentorsold',
                        value: true,
                        valueType: 'value',
                    },
                ]
                redeemCodeMasterDAO.update(redeemCodeMaster.internalId, bodyFields)
            }

            new EmailNotification('REDEMPTION', -5, data.EMAIL).sendEmail({
                FIRST_NAME: data.FIRST_NAME,
                LAST_NAME: data.LAST_NAME,
                redeemCodeList: redeemCodeList.map((redeemCode) => redeemCode.name),
            })
        }

        isValidRedemptionItemList(redeemList) {
            for (const item of redeemList) {
                const parts = item.split('_')

                if (parts.length === 2) {
                    const valueAfterUnderscore = parseInt(parts[1], 10)
                    if (isNaN(valueAfterUnderscore) || valueAfterUnderscore <= 0) {
                        return false
                    }
                } else {
                    return false
                }
            }
            return true
        }

        deleteShopifyUser({ email, phone }, nsCustomerID) {
            const shopifyCustomer = new ShopifyServices().getCustomer({ email, phone })
            log.debug('shopifyCustomer', JSON.parse(shopifyCustomer.body))
            const shopifyCustomerId = JSON.parse(shopifyCustomer.body).customers[0]?.id

            if (!shopifyCustomerId) return { code: 4004, message: 'Customer not found' }

            return new ShopifyServices().deleteCustomer(shopifyCustomerId, phone, email, nsCustomerID)
        }

        validateCustomerInfo(customerInfo) {
            const typeChecker = new TypeChecker()
            return typeChecker.checkTypes([
                { value: customerInfo.FIRST_NAME, type: 'string', field: 'FIRST_NAME' },
                { value: customerInfo.LAST_NAME, type: 'string', field: 'LAST_NAME' },
                { value: customerInfo.SALUTATION, type: 'string', field: 'SALUTATION' },
                { value: customerInfo.BIRTHDAY_MONTH, type: 'number', field: 'BIRTHDAY_MONTH' },
                { value: customerInfo.AGE, type: 'number', field: 'AGE' },
                { value: customerInfo.AREA_CODE, type: 'string', field: 'AREA_CODE' },
                { value: customerInfo.PHONE, type: 'string', field: 'PHONE' },
                { value: customerInfo.EMAIL, type: 'string', field: 'EMAIL' },
                { value: customerInfo.DEFAULT_LANGUAGE, type: 'string', field: 'DEFAULT_LANGUAGE' },
                { value: customerInfo.INTERESTED_PRODUCT, type: 'array', field: 'INTERESTED_PRODUCT' },
                { value: customerInfo.REGISTRATION_DATE, type: 'dateTime', field: 'REGISTRATION_DATE' },
                { value: customerInfo.RESIDENTIAL_REGION, type: 'string', field: 'RESIDENTIAL_REGION' },
                { value: customerInfo.DISTRICT, type: 'string', field: 'DISTRICT' },
                { value: customerInfo.REFERRAL_REFERENCE, type: 'string', field: 'REFERRAL_REFERENCE' },
                { value: customerInfo.MARKETING_PROMOTE, type: 'boolean', field: 'MARKETING_PROMOTE' },
                { value: customerInfo.TC, type: 'boolean', field: 'TC' },
                { value: customerInfo.TRANS_ID, type: 'string', field: 'TRANS_ID' },
                { value: customerInfo.REMARKS, type: 'string', field: 'REMARKS' },
                { value: customerInfo.DUMMY_DATE1, type: 'date', field: 'DUMMY_DATE1' },
                { value: customerInfo.DUMMY_DATE2, type: 'date', field: 'DUMMY_DATE2' },
                { value: customerInfo.DUMMY_TEXT1, type: 'string', field: 'DUMMY_TEXT1' },
            ])
        }

        validateRedeemInfo(redeemInfo) {
            const typeChecker = new TypeChecker()
            return typeChecker.checkTypes([
                { value: redeemInfo.REDEEM_ITEM, type: 'array', field: 'REDEEM_ITEM' },
                { value: redeemInfo.REDEMPTION_POINTS, type: 'number', field: 'REDEMPTION_POINTS' },
                { value: redeemInfo.REDEMPTION_DATE_TIME, type: 'dateTime', field: 'REDEMPTION_DATE_TIME' },
                { value: redeemInfo.CUSTOMER_ID, type: 'number', field: 'CUSTOMER_ID' },
                { value: redeemInfo.SUBSIDIARY, type: 'string', field: 'SUBSIDIARY' },
                { value: redeemInfo.LOCATION, type: 'string', field: 'LOCATION' },
                { value: redeemInfo.CHANNEL, type: 'string', field: 'CHANNEL' },
                { value: redeemInfo.VENDOR, type: 'string', field: 'VENDOR' },
                { value: redeemInfo.SOURCE_ID_FROM_POS, type: 'string', field: 'SOURCE_ID_FROM_POS' },
            ])
        }

        _getRedemptionRecordName() {
            const count = new EarnedRewardsDAO().getCount() + 1
            return `RD-${count.toString().padStart(10, '0')}`
        }

        _getPointSummaryByCustomerId(customerId, spec, startDate = '', endDate = '') {
            const dateUtils = new DateUtils()
            const earnedRewardsDAO = new EarnedRewardsDAO()
            const redemptionHistory = earnedRewardsDAO.findRedemptionHistory(customerId, {
                startDate,
                endDate,
            })
            const earnedHistory = earnedRewardsDAO
                .findEarnedHistory(customerId, spec, {
                    startDate,
                    endDate,
                })
                .filter((record) => {
                    return dateUtils.isSameOrAfterFromToday(record.pointExpiryDate)
                })
            const history = [...redemptionHistory, ...earnedHistory]
            log.debug('HISTORY', history)
            return history.reduce(
                (accumulator, record) => accumulator + parseFloat(record?.earnedPoints || record?.redeemedPoint),
                0
            )
        }
        _getStartEndDateForFindingAccumulativeAmt(spendingPeriod, effectiveTo, MAINTAIN) {
            const dateUtils = new DateUtils()
            log.debug('effectiveTo', effectiveTo)
            var START_DATE, END_DATE
            if (MAINTAIN) {
                log.debug('spendingPeriod', spendingPeriod)
                START_DATE = dateUtils.getStartDateforCalculateCumulativeAmountNetsuiteFormat(
                    spendingPeriod,
                    effectiveTo
                )
                END_DATE = dateUtils.dateStringToNetsuite(effectiveTo)
            } else {
                START_DATE = dateUtils.getStartDateforCalculateCumulativeAmountNetsuiteFormat(
                    spendingPeriod,
                    dateUtils.getTodayInputFormat()
                )
                END_DATE = moment(dateUtils.dateStringToNetsuite(dateUtils.getTodayInputFormat()), 'DD/MM/YYYY')
                    .add(1, 'days')
                    .format('DD/MM/YYYY')
            }
            return { START_DATE, END_DATE }
        }
    }

    return CustomerRepository
})
