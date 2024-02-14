/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 * TODO: 20231211 Chris -  Hardcoded location for welcome gift earn rewards on Line ~#85
 * TODO: 20231211 Crhis - Hardcoded rewards scheme ID = 1 as for welcomegift on Line ~#77
 * 20231212 Chris: Welcome Gift handle multiple reward scheme
 */
define([
    'N/record',
    './IRewardAction',
    './SuiteletCreateReward',
    './EditEarnedReward',
    '../../DAO/EarnedRewardsDAO',
    '../../DAO/RewardSchemeDAO',
    '../../DAO/SalesOrderDAO',
    '../../DAO/InventoryNumberDAO',
    '../../DAO/RedeemCodeMasterDAO',
    '../../DAO/RedemptionStagingDAO',
    '../../DAO/ClassTypeDAO',
    '../../../lib/lodash',
    '../CustomerRepository',
    '../../../lib/Time/moment-timezone',
    '../../Constants/Constants',
    'N'
], (
    record,
    IRewardAction,
    SuiteletCreateReward,
    EditEarnedReward,
    EarnedRewardsDAO,
    RewardSchemeDAO,
    SalesOrderDAO,
    InventoryNumberDAO,
    RedeemCodeMasterDAO,
    RedemptionStagingDAO,
    ClassTypeDAO,
    _,
    CustomerRepository,
    moment,
    const_1,
    N_1
) => {
    class RedemptionAction extends IRewardAction {
        constructor(info) {
            super(info)
            this.WAVE = '2'
        }
        execute() {
            log.audit('Redemption Action Start')
            if (!_.isEmpty(this.info.WELCOME_GIFT_DATE)) {
                let rewardSchemeSearchResult = N_1.search.create({
                    type: "customrecord_iv_reward_scheme",
                    filters:
                        [
                            ["custrecord_iv_applicable_tier", "anyof", const_1.MEMBER_TYPE.CLASSIC],
                            "AND",
                            ["custrecord_iv_subtype", "anyof", const_1.REWARD_SCHEME_SUB_TYPE.NEW_MEMBER],
                            'AND',
                            ["isinactive", "is", "F"],
                            'AND',
                            ["custrecord_iv_effective_to", "notbefore", "today"],
                            'AND',
                            ["custrecord_iv_effective_from", "notafter", "today"]
                        ],
                    columns:
                        [
                            "scriptid",
                            "custrecord_iv_applicable_tier",
                            "custrecord_iv_scheme_description",
                            "custrecord_iv_rs_reward_type"
                        ]
                }).run().getRange({ start: 0, end: 1000 });
                log.debug("scheme search", rewardSchemeSearchResult.length )
                for (let i = 0; i < rewardSchemeSearchResult.length; i++) {

                    const { gifts: itemList, giftQty, rewardType } = new RewardSchemeDAO().findByInternalId(rewardSchemeSearchResult[i].id)
                    var soID, targetRedeemCodeList, soObj, customerObj, membershipObj
                    log.debug("itemList Length | itemList[0] | !itemlist[0]?", itemList.length + " | " + itemList[0] + " | " + !itemList[0])
                    if (itemList.length == 1 && itemList[0] || itemList.length > 1) {

                        this.info.REDEEM_ITEM_LIST = itemList.map((item) => ({ INTERNAL_ID: item, QTY: giftQty }))
                        //CHECK PAST 6 MONTHS GOT ANY WELCOME GIFT ?

                        const { soId, redeemCodeList } = this.createSO(itemList.map((item) => ({ id: item, qty: giftQty })))
                        soID = soId
                        targetRedeemCodeList = redeemCodeList
                        log.debug("redeemCodeLisAfterCreateSOForWelcomeGift", redeemCodeList)
                        this._updateRedeemCodeMaster(redeemCodeList, null, soId)
                        soObj = record.load({
                            type: 'salesorder',
                            id: soId,
                        })
                    } else {
                        customerObj = record.load({
                            type: "customer",
                            id: this.info.INTERNAL_ID
                        })
                        membershipObj = record.load({
                            type: "customrecord_iv_membership_tiers",
                            id: "1" //HARDCODE: Fixed Classic Type
                        })
                    }
                    let rewardsSchemeObj = record.load({
                        type: 'customrecord_iv_reward_scheme',
                        id: rewardSchemeSearchResult[i].id, 
                    })

                    log.debug('rewardType', rewardType)
                    const earnedRewardsDAO = new EarnedRewardsDAO()
                    earnedRewardsDAO.createRewardRecord({
                        REWARD_TYPE: rewardType,
                        REWARD_SCHEME: rewardsSchemeObj.id,
                        REWARD_CUSTOMER: this.info.INTERNAL_ID,
                        REWARD_SUBSI: (soObj ? soObj.getValue('subsidiary') : customerObj.getValue("subsidiary")),
                        REWARD_LOCATION: (soObj ? soObj.getValue('location') : 209), //Hardcode as Coporate - IDL
                        REWARD_CHANNEL: (soObj ? soObj.getValue('cseg1') : customerObj.getValue("cseg1")),
                        REWARD_SOURCESO: (soObj ? soObj.id : ""),
                        REWARD_EARNEDPOINT: rewardsSchemeObj.getValue("custrecord_iv_points_to_be_provisioned"),
                        REWARD_REDEEMPOINT: 0,
                        REWARD_DATE_TIME: moment().tz('Asia/Hong_Kong').format('YYYY/MM/DD'),
                        REWARD_PROVISION_DATE_TIME: moment().tz('Asia_Hong_Kong').format('YYYY/MM/DD'),
                        REWARD_EXPIRY_DATE_TIME: moment().add(membershipObj.getValue("custrecord_iv_point_valid_period"), "month").endOf("month").format("YYYY/MM/DD"),
                        REWARD_STATUS: 2,
                        REWARD_GIFTSO: (soObj ? soObj.id : ""),
                        REWARD_OMNI_EN_MSG: rewardsSchemeObj.getValue('custrecord_iv_rs_eng_display_msg'),
                        REWARD_OMNI_TC_MSG: rewardsSchemeObj.getValue('custrecord_iv_rs_tchin_display_msg'),
                        REWARD_OMNI_SC_MSG: rewardsSchemeObj.getValue('custrecord_iv_rs_schin_display_msg'),
                        REWARD_ACQUIREDGIFT: rewardsSchemeObj.getValue('custrecord_iv_gift_to_be_provisioned'),
                    })
                    if (itemList.length == 1 && itemList[0] || itemList.length > 1) {
                        this.fulfillSO(soID)
                        log.debug('Finish Create SO & Fulfilling Target SO with New Register Without TranID.', `SO ID: ${soID}`)
                    }

                }
                // if (_.isEmpty(this.info.TRANS_ID)) {
            } else if (!_.isEmpty(this.info.REDEEM_ITEM)) {
                log.debug('RedemptionAction REDEEM_ITEM', JSON.stringify(this.info))
                if (this.info.VENDOR !== this.WAVE) {
                    //eRun : No Checking is needed
                    const internalId = this.createRedemptionReward()
                    new EditEarnedReward({
                        ...this.info,
                        redemptionRecordID: internalId,
                        redeemItemList: this.info.REDEEM_ITEM_LIST,
                    }).edit()
                    return internalId
                } else {
                    const internalId = this.createRedemptionReward()
                    new RedemptionStagingDAO().create('Redemption Staging', JSON.stringify(this.info), internalId)
                    log.debug('RedemptionAction createRedemptionReward', 'done')

                    new EditEarnedReward({
                        ...this.info,
                        redemptionRecordID: internalId,
                        redeemItemList: this.info.REDEEM_ITEM_LIST,
                    }).edit()
                    return internalId
                }
            }
        }

        createRedemptionReward() {
            return new EarnedRewardsDAO().createRedemptionRecord({
                ...this.info,
                REDEEM_ITEM: this.info.REDEEM_ITEM_LIST.map((item) => item.INTERNAL_ID),
                CUSTOMER_ID: this.info.INTERNAL_ID,
            })
        }

        createSO(itemList, vendor) {
            log.debug('RedemptionAction createSO', JSON.stringify(this.info))
            if (itemList.length === 0) return
            log.debug('RedemptionAction createSO item list', JSON.stringify(itemList))
            if (!itemList.some((item) => item.qty > 0)) return

            const redeemCodeMaster = this._issueRedeemCodeMaster(itemList)

            const soBodyData = [
                {
                    field: 'entity',
                    value: `${this.info.CUSTOMER_ID} ${this.info.RESIDENTIAL_REGION === 'Mainland' ? 'China' : this.info.FIRST_NAME
                        } ${this.info.RESIDENTIAL_REGION === 'Mainland' ? 'Individual' : this.info.LAST_NAME}`,
                    valueType: 'text',
                },
                {
                    field: 'subsidiary',
                    value: 10,
                    valueType: 'value',
                },
                {
                    field: 'cseg1',
                    value: 3,
                    valueType: 'value',
                },
                {
                    field: 'location',
                    value: 209,
                    valueType: 'value',
                },
                // {
                //     field: 'orderstatus',
                //     value: 'Pending Fulfillment',
                //     valueType: 'text',
                // },
                // {
                //     field: 'custbody_approval_status',
                //     value: 4,
                //     valueType: 'value',
                // },
                {
                    field: 'custbody_reapprove_level',
                    value: 2,
                    valueType: 'value',
                },
                {
                    field: 'custbody_iv_is_auto_fulfill',
                    value: true,
                    valueType: 'value',
                },
                {
                    field: 'custbodyemailtonamevoucher',
                    value: `${this.info.FIRST_NAME} ${this.info.LAST_NAME}`,
                    valueType: 'value',
                },
                {
                    field: 'custbodyemailaddressvoucher',
                    value: this.info.EMAIL,
                    valueType: 'value',
                },
                {
                    field: 'custbody_iv_so_redeem_master_code',
                    value: redeemCodeMaster.message,
                    valueType: 'value',
                },
            ]

            const soLineData = []
            itemList.forEach((item) => {
                soLineData.push({
                    sublist: 'item',
                    lineItem: [
                        { field: 'item', value: item.id },
                        { field: 'quantity', value: item.qty },
                        { field: 'price', value: -1 },
                        { field: 'rate', value: 0 },
                        { field: 'custcol_discount_percentage', value: 100 },
                    ],
                })
            })
            log.debug('redeemCodeList', redeemCodeMaster.redeemCodeList)
            return {
                soId: vendor === '1' ? null : new SalesOrderDAO().create(soBodyData, soLineData),
                redeemCodeList: redeemCodeMaster.redeemCodeList,
            }
        }

        fulfillSO = (soId) => {
            log.debug('fulfillSO soId', soId)

            record.submitFields({
                type: record.Type.SALES_ORDER,
                id: soId,
                values: {
                    custbody_approval_status: 4,
                },
            })

            const fulfillment = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: soId,
                toType: record.Type.ITEM_FULFILLMENT,
                isDynamic: true,
            })

            const fulfillmentLineCount = fulfillment.getLineCount({ sublistId: 'item' })
            log.debug('fulfillSO fulfillmentLineCount', fulfillmentLineCount)
            for (let i = 0; i < fulfillmentLineCount; i++) {
                log.debug('fulfillSO info', JSON.stringify(this.info))
                fulfillment.selectLine({ sublistId: 'item', line: i })
                const itemId = fulfillment.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' })
                const qty = fulfillment.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity' })
                if (
                    // _.isEmpty(this.info.WELCOME_GIFT_DATE) &&
                    this.info.REDEEM_ITEM_LIST.find((item) => item.INTERNAL_ID === itemId && item.TYPE === 'InvtPart')
                ) {
                    const targetLots = this._findSuitableLots(new InventoryNumberDAO().findOnHandLots(itemId), qty)
                    log.debug('fulfillSO lots', targetLots)

                    const subRecord = fulfillment.getCurrentSublistSubrecord({
                        sublistId: 'item',
                        fieldId: 'inventorydetail',
                    })
                    targetLots.forEach((lot) => {
                        subRecord.selectNewLine({ sublistId: 'inventoryassignment' })
                        subRecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'issueinventorynumber',
                            value: lot.internalId,
                        })
                        subRecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'quantity',
                            value: lot.toBeUsedQty,
                        })
                        subRecord.commitLine({ sublistId: 'inventoryassignment' })
                    })

                    fulfillment.commitLine({ sublistId: 'item' })
                }
            }
            const fulfillmentId = fulfillment.save()
            log.debug('fulfillmentId', fulfillmentId)
            return fulfillmentId
        }

        _findSuitableLots = (lots, qty) => {
            log.debug('_findSuitableLots lots', lots)
            const targetLots = []

            let remainingQty = parseInt(qty)
            for (let lot of lots) {
                if (lot.available > remainingQty) {
                    targetLots.push({ ...lot, toBeUsedQty: remainingQty })
                    break
                } else {
                    targetLots.push({ ...lot, toBeUsedQty: lot.available })
                    remainingQty -= lot.available
                }
            }

            return targetLots
        }

        _issueRedeemCodeMaster = () => {
            log.debug('_issueRedeemCodeMaster', JSON.stringify(this.info))
            const redeemCodeMasterDAO = new RedeemCodeMasterDAO()

            const { REDEEM_ITEM_LIST: redeemedList } = this.info
            const redeemCodeMasterList = redeemCodeMasterDAO.findByInternalId(
                redeemedList.map((item) => item.INTERNAL_ID)
            )
            const redeemCodeListByProduct = _.groupBy(redeemCodeMasterList, 'voucherItem')
            log.debug('redeemCodeListByProduct', JSON.stringify(_.keys(redeemCodeListByProduct)))
            log.debug('redeemCodeListByProduct', JSON.stringify(redeemCodeListByProduct))

            const redeemCodeList = this._populateRedeemCodeList(redeemedList, redeemCodeListByProduct)
            log.debug('redeemCodeList', JSON.stringify(redeemCodeList))

            let message = this._getStyledMessage(redeemCodeList)

            return { message, redeemCodeList }
        }

        _populateRedeemCodeList = (redeemedList, redeemCodeListByProduct) => {
            const redeemCodeList = []

            for (const redeemedProduct of redeemedList) {
                const redeemCodeMaster = redeemCodeListByProduct[redeemedProduct.INTERNAL_ID]
                const redeemedQty = parseInt(redeemedProduct.qty ? redeemedProduct.qty : redeemedProduct.QTY)
                log.debug('redeemedProduct', JSON.stringify(redeemedProduct))
                for (let i = 0; i < redeemedQty; i++) {
                    const redeemCode = redeemCodeMaster[i]
                    redeemCodeList.push(redeemCode)
                }
            }

            return redeemCodeList
        }

        _getStyledMessage = (redeemCodeList) => {
            let message = ''

            for (let code of redeemCodeList) {
                message +=
                    '<span style="font-size:11pt">' +
                    '<span style="font-family:Calibri,sans-serif">' +
                    '<em>' +
                    '<span style="font-size:12.0pt">' +
                    '<span style="font-family: Times New Roman, serif">' +
                    '<span style="color:#262626">' +
                    code.name +
                    '</span>' +
                    '</span>' +
                    '</span>' +
                    '</em>' +
                    '</span>' +
                    '</span>' +
                    '<br>'
            }

            return message
        }

        _updateRedeemCodeMaster = (redeemCodeList, redemptionRecordId, soId) => {
            log.debug('_updateRedeemCodeMaster', 'start')
            const redeemCodeMasterDAO = new RedeemCodeMasterDAO()

            const redemptionBodyFields = [
                {
                    field: 'custrecord_iv_redeem_code_master',
                    value: redeemCodeList.map((redeemCode) => redeemCode.internalId),
                    valueType: 'value',
                },
            ]
            log.debug('redemptionBodyFields', redemptionRecordId + " | " + redemptionBodyFields)
            if (redemptionRecordId) {
                new EarnedRewardsDAO().updateRedemptionRecord(redemptionRecordId, redemptionBodyFields)
            }

            const bodyFields = [
                {
                    field: 'custrecordrcmastersentorsold',
                    value: true,
                    valueType: 'value',
                },
                {
                    field: 'custrecordrcmastersalestransaction',
                    value: `${soId}`,
                    valueType: 'value',
                },
            ]

            for (let redeemCodeMaster of redeemCodeList) {
                log.debug('bodyFields', redeemCodeMaster.internalId + " | " + bodyFields)
                redeemCodeMasterDAO.update(redeemCodeMaster.internalId, bodyFields)
            }
        }

        encodeToBase64 = (stringToEncode) => {
            var encodedString = ''

            if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
                encodedString = window.btoa(stringToEncode)
            } else {
                var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
                var input = stringToEncode
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4
                var i = 0

                do {
                    chr1 = input.charCodeAt(i++)
                    chr2 = input.charCodeAt(i++)
                    chr3 = input.charCodeAt(i++)

                    enc1 = chr1 >> 2
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
                    enc4 = chr3 & 63

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64
                    } else if (isNaN(chr3)) {
                        enc4 = 64
                    }

                    encodedString +=
                        keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4)
                } while (i < input.length)
            }

            return encodedString
        }

        rollbackFulfillment = (fulfillmentId) => {
            log.debug('rollbackFulfillment', fulfillmentId)
            record.delete({
                type: record.Type.ITEM_FULFILLMENT,
                id: fulfillmentId,
            })
        }

        rollbackRedeemCodeMaster = (redeemCodeList, redemptionRecordId) => {
            log.debug('rollbackRedeemCodeMaster', JSON.stringify(redeemCodeList))
            const redeemCodeMasterDAO = new RedeemCodeMasterDAO()

            redeemCodeList.forEach((redeemCodeMaster, index) => {
                if (index === 0) {
                    const bodyFields = [
                        {
                            field: 'custrecord_iv_redeem_code_master',
                            value: null,
                            valueType: 'value',
                        },
                    ]
                    new EarnedRewardsDAO().updateRedemptionRecord(redemptionRecordId, bodyFields)
                }
                const bodyFields = [
                    {
                        field: 'custrecordrcmastersentorsold',
                        value: false,
                        valueType: 'value',
                    },
                ]
                redeemCodeMasterDAO.update(redeemCodeMaster.internalId, bodyFields)
            })
        }

        rollbackSO = (soId) => {
            log.debug('rollbackSO', soId)
            record.delete({
                type: record.Type.SALES_ORDER,
                id: soId,
            })
        }
    }

    return RedemptionAction
})
