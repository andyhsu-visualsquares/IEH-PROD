/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 * 20231122 Chris: Fixed Hide Point History with 0 existing points, pushed
 * 20231127 Chris: Retry Logic on CN Customer Related
 */
define([
    // '../DAO/CustomerDAO',
    '../Constants/Constants',
    '../../lib/lodash',
    '../../lib/Time/moment-timezone',
    '../DAO/EarnedRewardsDAO',
    'N/format',
    '../DAO/MembershipTypeDAO',
    '../DAO/IntegrationMappingDAO',
    '../DAO/SubsidiaryDAO',
    '../DAO/ItemDAO',
    '../DAO/RedemptionVendorDAO',
    '../DAO/LocationDAO',
    '../DAO/ChannelDAO',
    '../DAO/ItemCategoryDAO',
    '../DAO/ScriptErrorDAO',
    'N/email',
    '../Repository/CustomerRepository',
    '../../utils/DateUtils',
    '../../utils/EncryptUtils',
    '../DAO/InvoiceDAO',
    'N',
    './ChinaDBServices',
    'N/record',
    '../DAO/TemporaryCustomerDAO',
    'N/config',
], (
    // CustomerDAO,
    Constant,
    _,
    moment,
    EarnedRewardsDAO,
    format,
    MembershipTypeDAO,
    IntegrationMappingDAO,
    SubsidiaryDAO,
    ItemDAO,
    RedemptionVendorDAO,
    LocationDAO,
    ChannelDAO,
    ItemCategoryDAO,
    ScriptErrorDAO,
    email,
    CustomerRepository,
    DateUtils,
    EncryptUtils,
    InvoiceDAO,
    N_1,
    ChinaDBServices,
    record,
    CustomerDAO,
    config
) => {
    class CustomerServices {
        constructor() {
            this.customerRepository = new CustomerRepository()
        }

        getMemberInfo(searchParams) {
            log.debug('getMemberInfo')
            const { CUSTOMER_ID, EMAIL, PHONE } = searchParams
            if (!(CUSTOMER_ID || EMAIL || PHONE))
                return this._formatResponse(
                    {},
                    Constant.API_STATUS_CODE.MISSING_MANDATORY_FIELD.CODE,
                    Constant.API_STATUS_CODE.MISSING_MANDATORY_FIELD.MESSAGE
                )

            const Customer = this.customerRepository.isChinaCustomer(searchParams)
                ? this.customerRepository.findChinaCustomerByKey(searchParams)
                : this.customerRepository.findCustomerByKey(searchParams)

            if (_.isNil(Customer) && _.isEmpty(Customer))
                return this._formatResponse(
                    {},
                    Constant.API_STATUS_CODE.NO_SUCH_MEMBER.CODE,
                    Constant.API_STATUS_CODE.NO_SUCH_MEMBER.MESSAGE
                )
            log.debug('CustomerBody', Customer)
            const response = this._formatResponse(
                _.omit(
                    {
                        ...Customer,
                        CUSTOMER_ID: Customer.INTERNAL_ID,
                    },
                    [
                        'ADDRESS',
                        'ID',
                        'DUMMY_TEXT2',
                        'INTERNAL_ID',
                        'ADDRESS',
                        'ID',
                        'DUMMY_TEXT2',
                        // 'WELCOME_GIFT_DATE',
                        // 'EFFECTIVE_DATE',
                        // 'EFFECTIVE_TO_DATE',
                        // 'INTERESTED_PRODUCT',
                        'REMARKS',
                        'IS_CHINA_CUSTOMER',
                        'MERGE_POINT_BALANCE',
                        'INACTIVE',
                        'MEMBER_TYPE',
                        'D_LANG',
                        'MERGED',
                    ]
                ),
                Constant.API_STATUS_CODE.SUCCESS.CODE,
                Constant.API_STATUS_CODE.SUCCESS.MESSAGE
            )
            log.debug('response', response)
            return response
        }

        createCustomer(customerInfo) {
            try {
                const encryptUtils = new EncryptUtils()
                const { FIRST_NAME, LAST_NAME, PHONE, EMAIL, BIRTHDAY_MONTH, AGE, REGISTRATION_DATE, ...optionalInfo } =
                    customerInfo

                if (
                    this._missingMandatoryField([
                        FIRST_NAME,
                        LAST_NAME,
                        PHONE,
                        EMAIL,
                        BIRTHDAY_MONTH,
                        AGE,
                        REGISTRATION_DATE,
                    ])
                ) {
                    return this._formatResponse(
                        {},
                        Constant.API_STATUS_CODE.MISSING_MANDATORY_FIELD.CODE,
                        Constant.API_STATUS_CODE.MISSING_MANDATORY_FIELD.MESSAGE
                    )
                }

                const validateResult = this.customerRepository.validateCustomerInfo(customerInfo)
                const mismatchedFields = validateResult.filter((result) => !result.isValid)

                if (mismatchedFields.length > 0) {
                    return this._formatResponse(
                        { details: this._getMismatchedMessage(mismatchedFields) },
                        Constant.API_STATUS_CODE.BAD_REQUEST_FORMAT.CODE,
                        Constant.API_STATUS_CODE.BAD_REQUEST_FORMAT.MESSAGE
                    )
                }
                const decryptTranId = _.isEmpty(customerInfo.TRANS_ID)
                    ? ''
                    : encryptUtils.decryptTranId(customerInfo.TRANS_ID)

                customerInfo.DECRYPTED_ID = decryptTranId

                if (this._isChinaRegister(customerInfo)) {
                    return this._createChinaCustomer(customerInfo, decryptTranId)
                }

                // const existingCustomer = this.customerRepository.findCustomerByPhoneOrEmail(
                const existingCustomer = this.customerRepository.findCustomerByPhoneOrEmailBasic(
                    PHONE,
                    EMAIL,
                    customerInfo.AREA_CODE
                )

                log.debug('existingCustome2r', existingCustomer)
                if (
                    !_.isEmpty(existingCustomer) &&
                    _.isEmpty(existingCustomer.MEMBER_TYPE.EN) &&
                    _.isEmpty(existingCustomer.REGISTRATION_DATE)

                    // &&
                    // !existingCustomer?.INACTIVE
                ) {
                    return this._updateOldCustomer(existingCustomer, customerInfo, decryptTranId)
                } else if (!_.isEmpty(existingCustomer)) {
                    return this._formatResponse(
                        {},
                        Constant.API_STATUS_CODE.USER_ALREADY_EXIST.CODE,
                        Constant.API_STATUS_CODE.USER_ALREADY_EXIST.MESSAGE
                    )
                }

                return this._createNewCustomer(customerInfo, decryptTranId)
            } catch (e) {
                log.debug('Error Create Customer', e.message + e.stack)
            }
        }

        checkPointHistory(searchParams) {
            const { CUSTOMER_ID } = searchParams
            if (this._missingMandatoryField([CUSTOMER_ID]))
                return this._formatResponse(
                    {},
                    Constant.API_STATUS_CODE.MISSING_MANDATORY_FIELD.CODE,
                    Constant.API_STATUS_CODE.MISSING_MANDATORY_FIELD.MESSAGE
                )

            var history = this.customerRepository.findPointHistoryByCustomerId(CUSTOMER_ID)
            history = history.filter((history) => history.points !== 0)
            const status =
                history.length > 0 ? Constant.API_STATUS_CODE.SUCCESS : Constant.API_STATUS_CODE.NO_POINT_HISTORY

            if (history.length > 0) {
                return this._formatResponse({ HISTORY: history, CUSTOMER_ID }, status.CODE, status.MESSAGE)
            } else {
                return this._formatResponse({ HISTORY: [], CUSTOMER_ID }, status.CODE, status.MESSAGE)
            }
        }

        redeemPoint(searchParams) {
            const {
                REDEEM_ITEM,
                REDEMPTION_POINTS,
                REDEMPTION_DATE_TIME,
                CUSTOMER_ID,
                SUBSIDIARY,
                LOCATION,
                CHANNEL,
                SOURCE_ID_FROM_POS,
                VENDOR,
                CURRENT_MEMBER_TYPE,
            } = searchParams
            const mandatoryFields = [
                REDEEM_ITEM,
                REDEMPTION_POINTS,
                REDEMPTION_DATE_TIME,
                CUSTOMER_ID,
                SUBSIDIARY,
                LOCATION,
                CHANNEL,
                CURRENT_MEMBER_TYPE,
            ]
            if (VENDOR === 'eRun') mandatoryFields.push(SOURCE_ID_FROM_POS)
            if (this._missingMandatoryField(mandatoryFields))
                return this._formatResponse(
                    {},
                    Constant.API_STATUS_CODE.MISSING_MANDATORY_FIELD.CODE,
                    Constant.API_STATUS_CODE.MISSING_MANDATORY_FIELD.MESSAGE
                )

            const validateResult = this.customerRepository.validateRedeemInfo(searchParams)
            const mismatchedFields = validateResult.filter((result) => !result.isValid)
            if (mismatchedFields.length > 0)
                return this._formatResponse(
                    { details: this._getMismatchedMessage(mismatchedFields) },
                    Constant.API_STATUS_CODE.BAD_REQUEST_FORMAT.CODE,
                    Constant.API_STATUS_CODE.BAD_REQUEST_FORMAT.MESSAGE
                )

            if (!this.customerRepository.isValidRedemptionItemList(REDEEM_ITEM)) {
                return this._formatResponse(
                    {},
                    Constant.API_STATUS_CODE.REDEEM_ITEM_QUANTITY_NOT_EXPECTED.CODE,
                    Constant.API_STATUS_CODE.REDEEM_ITEM_QUANTITY_NOT_EXPECTED.MESSAGE
                )
            }

            const Customer = this.customerRepository.findCustomerByKey({ CUSTOMER_ID })
            if (_.isEmpty(Customer))
                return this._formatResponse(
                    {},
                    Constant.API_STATUS_CODE.NO_SUCH_MEMBER.CODE,
                    Constant.API_STATUS_CODE.NO_SUCH_MEMBER.MESSAGE
                )
            // if (Customer.MEMBER_TYPE.EN.toLowerCase() !== CURRENT_MEMBER_TYPE.toLowerCase())
            if (Customer.TIER_ID !== CURRENT_MEMBER_TYPE)
                return this._formatResponse(
                    {},
                    Constant.API_STATUS_CODE.MEMBER_TYPE_NOT_MATCH.CODE,
                    Constant.API_STATUS_CODE.MEMBER_TYPE_NOT_MATCH.MESSAGE
                )

            try {
                const result = this.customerRepository.redeemItem(searchParams, Customer)
                log.debug('redeem item result', JSON.stringify(result))

                if (result.code !== Constant.API_STATUS_CODE.SUCCESS.CODE)
                    return this._formatResponse({ details: result.details }, result.code, result.message)

                return this._formatResponse({ NAME: result.redemptionName }, result.code, result.message)
            } catch (e) {
                let error = e.toString()
                log.debug('error', e.stack)

                new ScriptErrorDAO().create({
                    e,
                    recordType: 'customrecord_iv_earned_rewards',
                    script: 'customdeploy_iv_create_reward_sl',
                })

                if ((error = 'TypeError: Error: Insufficient item quantity is not iterable')) {
                    return this._formatResponse(
                        {},
                        Constant.API_STATUS_CODE.INSUFFICIENT_ITEM_QTY.CODE,
                        Constant.API_STATUS_CODE.INSUFFICIENT_ITEM_QTY.MESSAGE
                    )
                }
            }
        }

        _createChinaCustomer(customerInfo, decryptTranId) {
            const { PHONE, EMAIL } = customerInfo
            const existingCustomer = this.customerRepository.findCustomerByPhoneOrEmailBasic(
                PHONE,
                EMAIL,
                customerInfo.AREA_CODE
            )
            log.debug('existingCustomer', existingCustomer)
            if (
                !_.isEmpty(existingCustomer) &&
                _.isEmpty(existingCustomer.MEMBER_TYPE.EN) &&
                _.isEmpty(existingCustomer.REGISTRATION_DATE)
            ) {
                //Check NS & CNDB, DATA UPDATES on BOTH & DO MERGE POINT
                var existingCustomerOnCNDB
                try {
                    existingCustomerOnCNDB = this.customerRepository.findChinaCustomerByKey(
                        { CUSTOMER_ID: null, EMAIL, PHONE },
                        'findInactive'
                    )
                } catch (e) {
                    log.debug('Error on Find CN Customer By Key', e.toString())
                    //RETRY
                    existingCustomerOnCNDB = this.customerRepository.findChinaCustomerByKey(
                        { CUSTOMER_ID: null, EMAIL, PHONE },
                        'findInactive'
                    )
                }
                if (existingCustomerOnCNDB) {
                    log.debug('UPDATE CNDB', 'Exsisting Customer: ' + existingCustomerOnCNDB)
                    //Will Do When SAving Customer Details on NS, Preventing Double Saving.
                } else {
                    //Merge On NS, but New to CNDB
                    log.debug('Merge on NS, New On CNDB')
                    this.customerRepository.createTempChinaCustomer(
                        {
                            ...customerInfo,
                            FULL_PHONE: customerInfo.AREA_CODE + PHONE,
                            WELCOME_GIFT_DATE: new DateUtils().getTodayNetsuiteFormat().date,
                            EFFECTIVE_DATE: new DateUtils().getTodayNetsuiteFormat().date,
                            DECRYPTED_TRANS_ID: decryptTranId,
                        },
                        existingCustomer.INTERNAL_ID
                    )
                }
                log.debug('UPDATE NS & MERGE')
                return this._updateOldCustomer(
                    existingCustomer,
                    customerInfo,
                    _.isEmpty(decryptTranId) ? null : decryptTranId
                )
            } else if (!_.isEmpty(existingCustomer))
                return this._formatResponse(
                    {},
                    Constant.API_STATUS_CODE.USER_ALREADY_EXIST.CODE,
                    Constant.API_STATUS_CODE.USER_ALREADY_EXIST.MESSAGE
                )
            log.debug('customerInfoCN', customerInfo)
            const { entityId, internalId } = this.customerRepository.createTempChinaCustomer({
                ...customerInfo,
                FULL_PHONE: customerInfo.AREA_CODE + PHONE,
                WELCOME_GIFT_DATE: new DateUtils().getTodayNetsuiteFormat().date,
                EFFECTIVE_DATE: new DateUtils().getTodayNetsuiteFormat().date,
                DECRYPTED_TRANS_ID: decryptTranId,
            })

            // if (this.customerRepository.isTransIdUsed(customerInfo.TRANS_ID)) {
            //     this.customerRepository.createRewardRecord('invalid', { ...customerInfo, internalId })
            // } else if (!_.isEmpty(customerInfo.TRANS_ID)) {
            //     this.customerRepository.createRewardRecord('earn', { ...customerInfo, internalId })
            // }
            if (this.customerRepository.isTransIdUsed(customerInfo.TRANS_ID, decryptTranId)) {
                //SKIP : Earned Rewards / Existing Customer Using Same Decrypted Trans ID
                this.customerRepository.createRewardRecord('invalid', { ...customerInfo, internalId })
            } else if (!_.isEmpty(customerInfo.TRANS_ID)) {
                //Need to check : If any Inv got the same Trans ID.(yes: TRIGGER no: SKIP)
                const invoiceDAO = new InvoiceDAO()
                // const encryptUtils = new EncryptUtils()
                // const decryptedId = encryptUtils.decryptTranId(customerInfo.TRANS_ID)
                let targetInvObj = invoiceDAO.findInvByTransID(decryptTranId)
                if (targetInvObj) {
                    log.debug('TargetINV', targetInvObj)
                    const invRec = record.load({ type: 'invoice', id: targetInvObj.id, isDynamic: true })
                    invRec.save({ ignoreMandatoryFields: true })
                    invoiceDAO.editInv(targetInvObj.id, {
                        // memo: targetInvObj.getValue("memo"),
                        entity: internalId,
                    })
                }
            }
            //Load Member Type
            // let customerObj = record.load({
            //     type: "customer",
            //     id: internalId
            // })
            // let memberTypeID = customerObj.getValue("custentity_iv_cl_member_type")
            // if (memberTypeID === Constant.MEMBER_TYPE.CLASSIC) {
            //     this.customerRepository.createRewardRecord('redemption', {
            //         ...customerInfo,
            //         INTERNAL_ID: internalId,
            //         CUSTOMER_ID: entityId,
            //         WELCOME_GIFT_DATE: new DateUtils().getTodayNetsuiteFormat().date,
            //     })
            // }

            //Create Staging Record for Membership Calculation & Welcome Gift
            const tempCustomerDAO = new CustomerDAO()
            tempCustomerDAO.createPendingMembershipCalculationRecord(internalId, entityId, customerInfo)

            return this._formatResponse(
                { CUSTOMER_ID: internalId },
                Constant.API_STATUS_CODE.SUCCESS.CODE,
                Constant.API_STATUS_CODE.SUCCESS.MESSAGE
            )
        }

        _updateOldCustomer(existingCustomer, customerInfo, decryptTranId) {
            const pointBalance = this.customerRepository.findPointBalanceByCustomerId(
                existingCustomer.CUSTOMER_ID,
                'findMergeBalance'
            )
            log.debug('merge pointBalance', pointBalance)
            const updatedCustomer = this.customerRepository.updateCustomer(existingCustomer, 'markMerged', {
                ...customerInfo,
                FULL_PHONE: customerInfo.AREA_CODE + customerInfo.PHONE,
                INTERESTED_PRODUCT: this._getInterestedProduct(customerInfo),
                DECRYPTED_ID: decryptTranId || null,
                POINT_BALANCE: pointBalance,
                // WELCOME_GIFT_DATE: new DateUtils().getTodayNetsuiteFormat().date,
                // WELCOME_GIFT_DATE: moment().tz('Asia/Hong_Kong').format('DD/MM/YYYY'),
                EFFECTIVE_DATE: moment().tz('Asia/Hong_Kong').format('DD/MM/YYYY'),
            })
            log.debug('updateCustomer before Merge', customerInfo)
            //merge old point to new customer
            if (!existingCustomer.MERGED)
                this.customerRepository.createRewardRecord('merge', {
                    ...customerInfo,
                    CUSTOMER_ID: existingCustomer.CUSTOMER_ID,
                    internalId: existingCustomer.INTERNAL_ID,
                    mergePoint: existingCustomer.MERGE_POINT_BALANCE,
                })

            // if (this.customerRepository.isTransIdUsed(customerInfo.TRANS_ID)) {
            //     this.customerRepository.createRewardRecord('invalid', {
            //         ...customerInfo,
            //         internalId: existingCustomer.INTERNAL_ID,
            //         mergePoint: existingCustomer.MERGE_POINT_BALANCE,
            //     })
            // } else if (!_.isEmpty(customerInfo.TRANS_ID)) {
            //     this.customerRepository.createRewardRecord('earn', {
            //         ...customerInfo,
            //         internalId: existingCustomer.INTERNAL_ID,
            //         mergePoint: existingCustomer.MERGE_POINT_BALANCE,
            //     })
            // }

            if (this.customerRepository.isTransIdUsed(customerInfo.TRANS_ID, decryptTranId)) {
                //SKIP : Earned Rewards / Existing Customer Using Same Decrypted Trans ID
                log.debug('Replicated : Invalid')
                this.customerRepository.createRewardRecord('invalid', {
                    ...customerInfo,
                    internalId: existingCustomer.INTERNAL_ID,
                })
            } else if (!_.isEmpty(customerInfo.TRANS_ID)) {
                //Need to check : If any Inv got the same Trans ID.(yes: TRIGGER no: SKIP)
                const invoiceDAO = new InvoiceDAO()
                // const encryptUtils = new EncryptUtils()
                // const decryptedId = encryptUtils.decryptTranId(customerInfo.TRANS_ID)
                let targetInvObj = invoiceDAO.findInvByTransID(decryptTranId)
                if (targetInvObj) {
                    //Create Earn Rewards by Triggering Logic built by John
                    log.debug('TargetINV', targetInvObj)
                    const invRec = record.load({ type: 'invoice', id: targetInvObj.id, isDynamic: true })
                    invRec.setValue(
                        'account',
                        invRec.getValue('account') || config.load('accountingpreferences').getValue('ARACCOUNT')
                    )
                    invRec.save({ ignoreMandatoryFields: true })
                    invoiceDAO.editInv(targetInvObj.id, {
                        // memo: targetInvObj.getValue("memo"),
                        entity: existingCustomer.INTERNAL_ID,
                        account:
                            invRec.getValue('account') || config.load('accountingpreferences').getValue('ARACCOUNT'),
                    })
                }
            }
            // //Recal member Type
            // N_1.https.post({
            //     url: N_1.url.resolveScript({ scriptId: 'customscript_iv_downgrade_tier_sl', deploymentId: 'customdeploy_iv_downgrade_tier_sl', returnExternalUrl: true }),
            //     body: JSON.stringify({
            //         newRecId: existingCustomer.INTERNAL_ID,
            //         isUpgrade: true
            //     }),
            //     headers: { name: 'Accept-Language', value: 'en-us' }
            // });
            // //Load Member Type
            // let customerObj = record.load({
            //     type: "customer",
            //     id: existingCustomer.INTERNAL_ID
            // })
            // let memberTypeID = customerObj.getValue("custentity_iv_cl_member_type")
            // if (memberTypeID === Constant.MEMBER_TYPE.CLASSIC) {
            //     this.customerRepository.createRewardRecord('redemption', {
            //         ...customerInfo,
            //         INTERNAL_ID: existingCustomer.INTERNAL_ID,
            //         CUSTOMER_ID: existingCustomer.CUSTOMER_ID,
            //         WELCOME_GIFT_DATE: new DateUtils().getTodayNetsuiteFormat().date,
            //     })
            // }
            //Create Staging Record for Membership Calculation & Welcome Gift
            const tempCustomerDAO = new CustomerDAO()
            tempCustomerDAO.createPendingMembershipCalculationRecord(
                existingCustomer.INTERNAL_ID,
                existingCustomer.CUSTOMER_ID,
                customerInfo
            )

            return this._formatResponse(
                { CUSTOMER_ID: existingCustomer.INTERNAL_ID },
                Constant.API_STATUS_CODE.SUCCESS.CODE,
                Constant.API_STATUS_CODE.SUCCESS.MESSAGE
            )
        }

        _createNewCustomer(customerInfo, decryptTranId) {
            const { internalId, entityId } = this.customerRepository.createCustomer({
                ...customerInfo,
                FULL_PHONE: customerInfo.AREA_CODE + customerInfo.PHONE,
                INTERESTED_PRODUCT: this._getInterestedProduct(customerInfo),
                DECRYPTED_ID: decryptTranId,
            })

            log.debug('{ internalId, entityId }', JSON.stringify({ internalId, entityId }))

            if (this.customerRepository.isTransIdUsed(customerInfo.TRANS_ID, decryptTranId)) {
                //SKIP : Earned Rewards / Existing Customer Using Same Decrypted Trans ID
                log.debug('Replicated : Invalid')
                this.customerRepository.createRewardRecord('invalid', { ...customerInfo, internalId })
            } else if (!_.isEmpty(customerInfo.TRANS_ID)) {
                //Need to check : If any Inv got the same Trans ID.(yes: TRIGGER no: SKIP)
                const invoiceDAO = new InvoiceDAO()
                // const encryptUtils = new EncryptUtils()
                // const decryptedId = encryptUtils.decryptTranId(customerInfo.TRANS_ID)
                let targetInvObj = invoiceDAO.findInvByTransID(decryptTranId)
                if (targetInvObj) {
                    //Create Earn Rewards by Triggering Logic built by John
                    log.debug('TargetINV', targetInvObj)
                    const invRec = record.load({ type: 'invoice', id: targetInvObj.id, isDynamic: true })
                    // invRec.setValue('entity', internalId)
                    invRec.save({ ignoreMandatoryFields: true })
                    // invRec.save()
                    invoiceDAO.editInv(targetInvObj.id, {
                        // memo: targetInvObj.getValue("memo"),
                        entity: internalId,
                    })
                }
            }
            //Recal member Type
            // let response = N_1.https.post({
            //     url: N_1.url.resolveScript({ scriptId: 'customscript_iv_downgrade_tier_sl', deploymentId: 'customdeploy_iv_downgrade_tier_sl', returnExternalUrl: true }),
            //     body: JSON.stringify({
            //         newRecId: internalId,
            //         isUpgrade: true
            //     }),
            //     headers: { name: 'Accept-Language', value: 'en-us' }
            // });
            // // let resMsg = JSON.parse(response.body).msg
            // let resMsg = 1

            // if (JSON.parse(resMsg).internalId === Constant.MEMBER_TYPE.CLASSIC) {
            //     log.debug("Start Redemption For New Customers")
            //     this.customerRepository.createRewardRecord('redemption', {
            //         ...customerInfo,
            //         INTERNAL_ID: internalId,
            //         CUSTOMER_ID: entityId,
            //         WELCOME_GIFT_DATE: new DateUtils().getTodayNetsuiteFormat().date,
            //     })
            // }

            //Create Staging Record for Membership Calculation & Welcome Gift
            const tempCustomerDAO = new CustomerDAO()
            tempCustomerDAO.createPendingMembershipCalculationRecord(internalId, entityId, customerInfo)

            const STATUS = entityId === -999 ? Constant.API_STATUS_CODE.BAD_REQUEST : Constant.API_STATUS_CODE.SUCCESS

            return this._formatResponse({ CUSTOMER_ID: internalId }, STATUS.CODE, STATUS.MESSAGE)
        }

        _missingMandatoryField(fields) {
            return fields.some((field) => _.isNil(field) || _.isEmpty('' + field))
        }

        _formatResponse(jsonData, STATUS_CODE, MESSAGE) {
            return { ...jsonData, STATUS_CODE, MESSAGE }
        }

        _isChinaRegister(customerInfo) {
            const { AREA_CODE, RESIDENTIAL_REGION } = customerInfo
            return (
                AREA_CODE.toString() === '86' ||
                AREA_CODE.toString() === '+86' ||
                RESIDENTIAL_REGION.toLowerCase() === 'mainland'
            )
        }

        _getInterestedProduct(info) {
            return Array.isArray(info.INTERESTED_PRODUCT) && info.INTERESTED_PRODUCT.length > 0
                ? new ItemCategoryDAO().findByNames(info.INTERESTED_PRODUCT).map((item) => item.INTERNAL_ID)
                : []
        }

        _getMismatchedMessage(mismatchedFields) {
            const messages = []
            mismatchedFields.forEach((field) => {
                messages.push(`${field.field} should be ${field.type}`)
            })
            return messages
        }
    }

    return CustomerServices
})
