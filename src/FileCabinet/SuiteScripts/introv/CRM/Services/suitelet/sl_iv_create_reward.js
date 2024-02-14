/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *
 * Name : SL Create Reward
 * Script : customscript_iv_create_reward_sl
 * Deploy : customdeploy_iv_create_reward_sl
 *
 * Purpose: Use SO id to retrieve all reward from the customer Membership tier.
 *          Only handle Subtype is : POINT_PROVISION, SPECIFIC_CATEGORY, SPECIFIC_ITEM, REGIONAL_OFFER
 *          Some of them only check the criteria by certain field, may need to make a function for checking.
 **/
define([
    'N/error',
    'N/format',
    'N/log',
    'N/record',
    'N/search',
    '../AutoFulfilOnlineSO',
    '../../DAO/EarnedRewardsDAO',
    '../../DAO/RedeemCodeMasterDAO',
    '../../DAO/RewardSchemeDAO',
    '../../DAO/SalesOrderDAO',
    '../../DAO/ScriptErrorDAO',
    '../../../lib/Time/moment',
], function (
    error,
    format,
    log,
    record,
    search,
    AutoFulfilOnlineSO,
    EarnedRewardsDAO,
    RedeemCodeMasterDAO,
    RewardSchemeDAO,
    SalesOrderDAO,
    ScriptErrorDAO,
    moment,
) {
    function onRequest(context) {
        let rtn = {
            isSuccess: false,
            msg: 'raw',
            id: 0,
            type: '',
        }
        var newRecId
        if (!!context.request.body) {
            params = JSON.parse(context.request.body)

            newRecId = params.newRecId
            fulfillDate = params.newRecDate
            log.debug('params', JSON.stringify(params))
        } else {
            throw error.create({
                message: 'Invalid Param',
                name: 'Inavlid Param',
                notifyOff: true,
            })
        }

        try {
            const SO_ID = newRecId
            var transactionDetail = _getPendingProvision(SO_ID, 999)
            log.debug('transactionDetail for : ' + SO_ID, JSON.stringify(transactionDetail))

            // 20231005 John This was used to filter out guest Customer and skip there provision, now open for new register from POS
            if (!!transactionDetail[SO_ID] && !transactionDetail[SO_ID].membershipType) {
                var checkGuestCustomer = _getInoviceByCustomer(transactionDetail[SO_ID].invoicePOSSalesId)
                log.debug(
                    'checkGuestCustomer for : ' + transactionDetail[SO_ID].invoicePOSSalesId,
                    JSON.stringify(checkGuestCustomer)
                )

                if (checkGuestCustomer['isValid'] == false) {
                    // 20231005 John This mean skip process this Invoive.
                    throw error.create({
                        message: 'Invalid Customer',
                        name: 'Invalid Customer',
                        notifyOff: true,
                    })
                } else {
                    // 20231005 John This mean Customer was created can use provision to it.
                    transactionDetail[SO_ID].membershipType = checkGuestCustomer['newTier']
                    transactionDetail[SO_ID].customerRegion = checkGuestCustomer['newRegion']
                    transactionDetail[SO_ID].transEntity = checkGuestCustomer['internalid']
                    transactionDetail[SO_ID].altname = checkGuestCustomer['altname']
                    transactionDetail[SO_ID].email = checkGuestCustomer['email']
                }
            }

            const REWARD_DAO = new RewardSchemeDAO()
            var membershipDetail = REWARD_DAO.getRewardSchemeFromMemberships({
                APPLICABLE_TIER: transactionDetail[SO_ID].membershipType,
            })

            // need to check the expired date
            var expiryProvisionDate = moment(fulfillDate, 'DD/MM/YYYY')
            // log.debug('expiryProvisionDate : ' + typeof expiryProvisionDate, JSON.stringify(expiryProvisionDate))
            var seePoint = search.lookupFields({
                type: 'customrecord_iv_membership_tiers',
                id: transactionDetail[SO_ID].membershipType,
                columns: ['custrecord_iv_point_valid_period'],
            })

            expiryProvisionDate.add(Number(seePoint.custrecord_iv_point_valid_period), 'months').endOf('months')

            var toBeCreateEarnedRewardList = [];
            var toBeFulfillList = [];
            for (const key in membershipDetail) {
                if (Object.hasOwnProperty.call(membershipDetail, key)) {
                    const element = membershipDetail[key]
                    log.debug('Membership Tier ID :' + element.rewardSubType, JSON.stringify(membershipDetail[key]))

                    var earnedPoint = 0
                    var OLD_rewardType = ''
                    var isValid = false
                    var giftedList = []
                    var giftedQty = 0

                    // OLD_rewardType 1: point, 2: gift
                    var rewardType = element.rewardType
                    switch (Number(element.rewardSubType)) {
                        case REWARD_DAO.REWARD_SUB_TYPE.POINT_PROVISION.value:
                            if (!!rewardType) {
                                if (rewardType == 1) {
                                    if (Number(element.pointProvisionRate) > 0) {
                                        isValid = true
                                        OLD_rewardType = 1
                                        // TODO BigNumber.js needed
                                        earnedPoint +=
                                            Number(transactionDetail[SO_ID].transAmtTotal) *
                                            Number(element.pointProvisionRate)
                                    }
                                } else if (rewardType == 2) {
                                    // OLD_rewardType = 2;
                                }
                            }
                            break
                        case REWARD_DAO.REWARD_SUB_TYPE.NEW_MEMBER.value:
                            // OLD_rewardType = ;
                            // isValid = true;
                            break
                        case REWARD_DAO.REWARD_SUB_TYPE.BRITHDAY_OFFER.value:
                            // OLD_rewardType = ;
                            // isValid = true;
                            break
                        case REWARD_DAO.REWARD_SUB_TYPE.ORDER_AMOUNT.value:
                            // OLD_rewardType = ;
                            // isValid = true;
                            break
                        case REWARD_DAO.REWARD_SUB_TYPE.ORDER_QUANTITY.value:
                            // OLD_rewardType = ;
                            // isValid = true;
                            break
                        case REWARD_DAO.REWARD_SUB_TYPE.SPECIFIC_CATEGORY.value:
                            // default is true only invalid if not reach the Amount/ Quantity
                            var countValidAmt = 0
                            var countValidQty = 0
                            var isAmtValid = false
                            if (element.minBuyAmt == '') isAmtValid = true
                            var isQtyValid = false
                            if (element.minBuyQty == '') isQtyValid = true
                            var targetAmount = Number(element.minBuyAmt)
                            var targetQuantity = Number(element.minBuyQty)
                            if (!!element.pointProvisioned || !!element.custrecord_iv_point_provisioning_rate) {
                                if (!!element.specialCat) {
                                    var soLineItem = transactionDetail[SO_ID].transactionItem
                                    for (var indexRO = 0; indexRO < soLineItem.length; indexRO++) {
                                        if (soLineItem[indexRO].transItemCategory == element.specialCat) {
                                            // isAmtValid
                                            if (!!targetAmount) {
                                                var transAmtByCat =
                                                    transactionDetail[SO_ID].transByCat[element.specialCat].amount
                                                log.debug(
                                                    'transAmtByCat:' + transAmtByCat,
                                                    JSON.stringify(targetAmount)
                                                )
                                                countValidAmt += transAmtByCat
                                                if (countValidAmt >= targetAmount) {
                                                    isAmtValid = true
                                                }
                                            }
                                            // isQtyValid
                                            if (!!targetQuantity) {
                                                var transQtyByCat =
                                                    transactionDetail[SO_ID].transByCat[element.specialCat].qty
                                                log.debug(
                                                    'transQtyByCat:' + transQtyByCat,
                                                    JSON.stringify(targetQuantity)
                                                )
                                                countValidQty += transQtyByCat
                                                if (countValidQty >= targetQuantity) {
                                                    isQtyValid = true
                                                }
                                            }
                                        }
                                    }

                                    if (isAmtValid && isQtyValid) {
                                        if (!!rewardType) {
                                            if (rewardType == 1) {
                                                if (element.pointProvisioned) {
                                                    if (Number(element.pointProvisionRate) > 0) {
                                                        OLD_rewardType = 1
                                                        earnedPoint += Number(element.pointProvisioned)
                                                        isValid = true
                                                    }
                                                }
                                            } else if (rewardType == 2) {
                                                if (!!element.giftList) {
                                                    OLD_rewardType = 2
                                                    giftedList =
                                                        element.giftList.indexOf(',') != -1
                                                            ? element.giftList.split(',')
                                                            : element.giftList
                                                    giftedQty = element.giftQty
                                                    isValid = true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            break
                        case REWARD_DAO.REWARD_SUB_TYPE.SPECIFIC_ITEM.value:
                            log.debug('is SPECIFIC_ITEM', JSON.stringify(transactionDetail[SO_ID].transactionItem))
                            var countValidAmt = 0
                            var countValidQty = 0
                            var isAmtValid = false
                            if (element.minBuyAmt == '') isAmtValid = true
                            var isQtyValid = false
                            if (element.minBuyQty == '') isQtyValid = true
                            var targetAmount = Number(element.minBuyAmt)
                            var targetQuantity = Number(element.minBuyQty)
                            log.debug(
                                'is element.custrecord_iv_gift_to_be_provisioned',
                                JSON.stringify(element.custrecord_iv_gift_to_be_provisioned)
                            )

                            if (!!element.specailItem) {
                                var validItemList = element.specailItem.split(',')
                                var soLineItem = transactionDetail[SO_ID].transactionItem
                                for (var indexRO = 0; indexRO < soLineItem.length; indexRO++) {
                                    log.debug(
                                        'is validItemList.indexOf : ' +
                                        validItemList.indexOf(soLineItem[indexRO].transItem),
                                        JSON.stringify(soLineItem[indexRO].transItem) + ' on ' + validItemList
                                    )

                                    if (validItemList.indexOf(soLineItem[indexRO].transItem) != -1) {
                                        // isAmtValid
                                        log.debug('targetAmount', JSON.stringify(targetAmount))

                                        if (!!targetAmount) {
                                            var transAmtByItem =
                                                transactionDetail[SO_ID].transByItem[soLineItem[indexRO].transItem]
                                                    .amount
                                            log.debug('transAmtByItem:' + transAmtByItem, JSON.stringify(targetAmount))
                                            countValidAmt += transAmtByItem
                                            if (countValidAmt >= targetAmount) {
                                                isAmtValid = true
                                            }
                                        }
                                        log.debug('targetQuantity', JSON.stringify(targetQuantity))

                                        // isQtyValid
                                        if (!!targetQuantity) {
                                            var transQtyByItem =
                                                transactionDetail[SO_ID].transByItem[soLineItem[indexRO].transItem].qty
                                            log.debug(
                                                'transQtyByItem:' + transQtyByItem,
                                                JSON.stringify(targetQuantity)
                                            )
                                            countValidQty += transQtyByItem
                                            if (countValidQty >= targetQuantity) {
                                                isQtyValid = true
                                            }
                                        }
                                    }
                                }
                                if (isAmtValid && isQtyValid) {
                                    if (!!rewardType) {
                                        if (rewardType == 1) {
                                            if (element.pointProvisioned) {
                                                OLD_rewardType = 1
                                                earnedPoint += Number(element.pointProvisioned)
                                                isValid = true
                                            }
                                        } else if (rewardType == 2) {
                                            if (!!element.giftList) {
                                                OLD_rewardType = 2
                                                giftedList =
                                                    element.giftList.indexOf(',') != -1
                                                        ? element.giftList.split(',')
                                                        : element.giftList
                                                giftedQty = element.giftQty
                                                isValid = true
                                            }
                                        }
                                    }
                                }
                            }
                            break
                        case REWARD_DAO.REWARD_SUB_TYPE.REGIONAL_OFFER.value:
                            if (!!element.specialRegion) {
                                var specialRegionList = element.specialRegion.split(',')
                                if (specialRegionList.indexOf(transactionDetail[SO_ID].customerRegion) != -1) {
                                    if (!!rewardType) {
                                        if (rewardType == 1) {
                                            if (element.pointProvisioned) {
                                                OLD_rewardType = 1
                                                earnedPoint += Number(element.pointProvisioned)
                                                isValid = true
                                            }
                                        } else if (rewardType == 2) {
                                            if (!!element.giftList) {
                                                OLD_rewardType = 2
                                                giftedList =
                                                    element.giftList.indexOf(',') != -1
                                                        ? element.giftList.split(',')
                                                        : element.giftList
                                                giftedQty = element.giftQty
                                                isValid = true
                                            }
                                        }
                                    }
                                }
                            }
                            break
                        case REWARD_DAO.REWARD_SUB_TYPE.UPGRADE_OFFER.value:
                            // OLD_rewardType = ;
                            // isValid = true;
                            break
                        default:
                            break
                    }
                    if (isValid) {
                        // if OLD_rewardType = 2, created SO+IF for it.
                        var soId = ''
                        var isPOSOrder = !!transactionDetail[SO_ID].invoicePOSSalesId;
                        if (OLD_rewardType == 2 && !isPOSOrder) {
                            const soBodyData = [
                                {
                                    field: 'entity',
                                    value: transactionDetail[SO_ID].transEntity,
                                    valueType: 'value',
                                },
                                {
                                    field: 'subsidiary',
                                    value: transactionDetail[SO_ID].transSubsi,
                                    valueType: 'value',
                                },
                                {
                                    field: 'cseg1',
                                    value: transactionDetail[SO_ID].transChannel,
                                    valueType: 'value',
                                },
                                {
                                    field: 'location',
                                    value: transactionDetail[SO_ID].transLocation,
                                    valueType: 'value',
                                },
                                {
                                    field: 'orderstatus',
                                    value: 'Pending Fulfillment',
                                    valueType: 'text',
                                },
                                {
                                    field: 'custbody_approval_status',
                                    value: 4,
                                    valueType: 'value',
                                },
                                // {
                                //     field: 'custbodyreceivername',
                                //     value: `${this.info.FIRST_NAME} ${this.info.LAST_NAME}`,
                                //     valueType: 'value',
                                // },
                                {
                                    field: 'custbodyemailtonamevoucher',
                                    value: transactionDetail[SO_ID].altname,
                                    valueType: 'value',
                                },
                                {
                                    field: 'custbodyemailaddressvoucher',
                                    value: transactionDetail[SO_ID].email,
                                    valueType: 'value',
                                },
                                {
                                    field: 'custbody_iv_so_redeem_master_code',
                                    value: '',
                                    valueType: 'value',
                                },
                            ]

                            const soLineData = []
                            if (element.giftList.indexOf(',') != -1) {
                                giftedList.forEach((item) => {
                                    soLineData.push({
                                        sublist: 'item',
                                        lineItem: [
                                            { field: 'item', value: item },
                                            { field: 'quantity', value: giftedQty },
                                            { field: 'price', value: -1 },
                                            { field: 'rate', value: 0 },
                                            { field: 'custcol_discount_percentage', value: 100 },
                                        ],
                                    })
                                })
                            } else {
                                soLineData.push({
                                    sublist: 'item',
                                    lineItem: [
                                        { field: 'item', value: giftedList },
                                        { field: 'quantity', value: giftedQty },
                                        { field: 'price', value: -1 },
                                        { field: 'rate', value: 0 },
                                        { field: 'custcol_discount_percentage', value: 100 },
                                    ],
                                })
                            }
                            log.debug('giftedList', JSON.stringify(giftedList))
                            soId = new SalesOrderDAO().create(soBodyData, soLineData)
                            // TODO Need to config the Auto APporval
                            record.submitFields({
                                type: 'salesorder',
                                id: soId,
                                values: {
                                    custbody_approval_status: 4,
                                },
                            })
                            if (toBeFulfillList.indexOf(soId) == -1) {
                                toBeFulfillList.push(soId);
                            }
                        }

                        var oldParsedDate = format.parse({
                            value: transactionDetail[SO_ID].transDate,
                            type: format.Type.DATETIME,
                            timezone: 'Asia/Hong_Kong',
                        })
                        oldParsedDate =
                            oldParsedDate.getTime() + (oldParsedDate.getTimezoneOffset() + 8 * 60) * 60 * 1000
                        var parsedDate = new Date(oldParsedDate)

                        // log.debug(
                        //     'Date',
                        //     JSON.stringify({
                        //         oldParsedDate: oldParsedDate,
                        //         parsedDate: parsedDate,
                        //         rawTransDate: transactionDetail[SO_ID].transDate,
                        //         expiryProvisionDate : expiryProvisionDate,
                        //         transDate: moment(transactionDetail[SO_ID].transDate, 'DD/MM/YYYY'),
                        //     })
                        // )
                        var ERObj = {
                            REWARD_TYPE: OLD_rewardType,
                            REWARD_SCHEME: element.transId,
                            REWARD_CUSTOMER: transactionDetail[SO_ID].transEntity,
                            REWARD_SUBSI: transactionDetail[SO_ID].transSubsi,
                            REWARD_LOCATION: transactionDetail[SO_ID].transLocation,
                            REWARD_CHANNEL: transactionDetail[SO_ID].transChannel,
                            REWARD_SOURCESO: SO_ID,
                            // REWARD_EARNEDPOINT : custrecord_iv_earned_points is a Integer FIeld
                            REWARD_EARNEDPOINT: earnedPoint.toFixed(0),
                            REWARD_ACQUIREDGIFT: giftedList,
                            // : giftedQty,
                            REWARD_REDEEMPOINT: 0,
                            REWARD_REDEEMITEM: [],
                            REWARD_REDEEMRECORD: [],
                            REWARD_DATE_TIME: moment(transactionDetail[SO_ID].transDate, 'DD/MM/YYYY'),
                            REWARD_PROVISION_DATE_TIME: moment(transactionDetail[SO_ID].transDate, 'DD/MM/YYYY'),
                            REWARD_EXPIRY_DATE_TIME: OLD_rewardType == 1 ? expiryProvisionDate : '',
                            REWARD_STATUS: 2,
                            REWARD_IS_EXPIRED: false,
                            REWARD_OMNI_EN_MSG: element.OMNIeng,
                            REWARD_OMNI_TC_MSG: element.OMNItc,
                            REWARD_OMNI_SC_MSG: element.OMNIsc,
                        }
                        if (!!soId) {
                            ERObj['REWARD_GIFTSO'] = soId
                        }
                        toBeCreateEarnedRewardList.push(ERObj)
                    }
                }
            }

            // var needFulfill = false;
            log.debug('toBeCreateEarnedRewardList', JSON.stringify(toBeCreateEarnedRewardList))
            for (var k = 0; k < toBeCreateEarnedRewardList.length; k++) {
                const redemptionID = new EarnedRewardsDAO().createRewardRecord(toBeCreateEarnedRewardList[k])
                log.debug('redemptionID', redemptionID)

                // //20231121 Chris: + Redeem Code Master Logic For Changed Email QR Attachment Logic
                // log.debug("giftedList", toBeCreateEarnedRewardList[k].REWARD_ACQUIREDGIFT)
                // if (toBeCreateEarnedRewardList[k].REWARD_ACQUIREDGIFT.length !== 0) {

                //     let redeemCodeMasterList = search.create({
                //         type: "customrecordrcmaster",
                //         filters:
                //             [
                //                 ["custrecordrcmastervoucheritem", "anyof", toBeCreateEarnedRewardList[k].REWARD_ACQUIREDGIFT],
                //                 "AND",
                //                 ["custrecordrcmasterused", "is", "F"],
                //                 "AND",
                //                 ["custrecordrcmastersentorsold", "is", "F"],
                //                 "AND",
                //                 ["isinactive", "is", "F"],
                //                 "AND",
                //                 ["custrecordredeemcodenoteffective", "is", "F"]
                //             ],
                //         columns:
                //             [
                //                 'internalid',
                //                 'name',
                //                 'custrecordrcmasterredeemprod',
                //                 'custrecordrcmastervoucheritem',
                //                 'custrecordrcmastersentorsold'
                //             ]
                //     }).run().getRange({ start: 0, end: 1000 })
                //     if (redeemCodeMasterList.length > 0) {
                //         const redeemCodeMasterDAO = new RedeemCodeMasterDAO()
                //         const bodyFieldsToBeUpdated = [
                //             {
                //                 field: 'custrecordrcmastersentorsold',
                //                 value: true,
                //                 valueType: 'value',
                //             },
                //             {
                //                 field: 'custrecordrcmastersalestransaction',
                //                 value: `${soId}`,
                //                 valueType: 'value',
                //             },
                //         ]
                //         log.debug("redeemCodeMasterList[0].id", redeemCodeMasterList[0].id)
                //         log.debug("bodyFieldsToBeUpdated", bodyFieldsToBeUpdated)
                //         redeemCodeMasterDAO.update(redeemCodeMasterList[k].id, bodyFieldsToBeUpdated)
                //         needFulfill = true;
                //     }
                // }

            }
            // search all fail earned history & set them to inactive
            // _setInactiveFailEarnedPoint(transactionDetail[SO_ID].transEntity)
            record.submitFields({
                type: 'invoice',
                id: SO_ID,
                values: {
                    custbody_iv_is_earn_reward: true,
                },
            })

            // if (needFulfill) {
            for (let indexIF = 0; indexIF < toBeFulfillList.length; indexIF++) {
                const element = toBeFulfillList[indexIF];
                new AutoFulfilOnlineSO({ type: "salesorder", id: element }).fulfilOnlineSO();
            }
            // }

            context.response.write(JSON.stringify(membershipDetail))
        } catch (e) {
            // log.error("SL debug error",e.toString());
            // context.response.write(e.message);
            log.error('SL Failed : ' + newRecId, JSON.stringify(e.message + e.stack))
            rtn.isSuccess = false
            rtn.msg = `SL Failed, ${JSON.stringify(e.message + e.stack)}`

            new ScriptErrorDAO().create({
                e,
                transId: newRecId,
                recordType: 'customrecord_iv_earned_rewards',
                script: 'customdeploy_iv_create_reward_sl',
            })

            context.response.write(JSON.stringify(rtn))
        }
    }

    /**
     *
     * @param {*} INPUT_ID
     * @param {*} MAX_PROCESS_LINE
     * @returns
     *
     * Assume All SO will fully fulfill and provision point immediately.
     */
    function _getPendingProvision(INPUT_ID, MAX_PROCESS_LINE) {
        var salesorderSearchObj = search.create({
            type: 'invoice',
            filters: [
                ['type', 'anyof', 'CustInvc'],
                'AND',
                ['cogs', 'is', 'F'],
                'AND',
                ['taxline', 'is', 'F'],
                'AND',
                ['mainline', 'is', 'F'],
                //    "AND",
                //    ["formulanumeric: {quantity}-{quantityshiprecv}","greaterthan","0"],
                'AND',
                ['custbody_iv_is_earn_reward', 'is', 'F'],
                //    "AND",
                //    ["datecreated","onorafter","01/08/2023 12:00 am"],
                // // 20231005 John This was used to filter out guest Customer and skip there provision, now open for new register from POS
                //    "AND",
                //    ["customermain.custentity_iv_cl_member_type","noneof","@NONE@"],
                'AND',
                ['internalid', 'anyof', INPUT_ID],
            ],
            columns: [
                'internalid',
                'cseg1',
                'item',
                'datecreated',
                search.createColumn({ name: 'custentity_iv_cl_member_type', join: 'customerMain' }),
                search.createColumn({ name: 'custentity_iv_residential_region', join: 'customerMain' }),
                'quantity',
                'quantityshiprecv',
                'tranid',
                'entity',
                'account',
                'memo',
                'amount',
                'subsidiary',
                'location',
                'fxamount',
                'currency',
                search.createColumn({ name: 'custitem_iv_category', join: 'item' }),
                'custbodypossalesid',
                search.createColumn({ name: 'firstname', join: "customerMain" }),
                search.createColumn({ name: 'lastname', join: "customerMain" }),
                "email",
            ],
        })
        var resultMap = {}
        var ProcessCount = 0
        var searchResultCount = salesorderSearchObj.runPaged().count
        for (var i = 0; i < Math.ceil(searchResultCount / 1000) && i * 1000 < MAX_PROCESS_LINE; i++) {
            var results = salesorderSearchObj.run().getRange({ start: 1000 * i, end: 1000 * (i + 1) })
            // var results = salesorderSearchObj.run().getRange({start: 0, end: MAX_PROCESS_LINE});
            // for(var j=0;j<results.length ;j++){
            for (var j = 0; j < results.length && i * 1000 + j < MAX_PROCESS_LINE; j++) {
                ProcessCount++
                // log.debug("Line "+j, JSON.stringify(results));
                var transId = results[j].getValue('internalid')
                var transChannel = results[j].getValue('cseg1')
                var transDate = results[j].getValue('datecreated')
                var transItem = results[j].getValue('item')
                var membershipType = results[j].getValue({ name: 'custentity_iv_cl_member_type', join: 'customerMain' })
                var customerRegion = results[j].getValue({
                    name: 'custentity_iv_residential_region',
                    join: 'customerMain',
                })
                var transEntity = results[j].getValue('entity')
                var transQty = parseFloat(results[j].getValue('quantity'))
                var transReceiveQty = parseFloat(results[j].getValue('quantityshiprecv'))
                var transAmt = results[j].getValue('amount')
                var transFXAmt = results[j].getValue('fxamount')
                var transCurrency = results[j].getValue('currency')
                var transSubsi = results[j].getValue('subsidiary')
                var transLocation = results[j].getValue('location')
                var transItemCategory = results[j].getValue({ name: 'custitem_iv_category', join: 'item' })
                var invoicePOSSalesId = results[j].getValue('custbodypossalesid')
                var lineName = `${results[j].getValue({ name: "firstname", join: "customerMain" })} ${results[j].getValue({ name: "lastname", join: "cutomerMain" })}`
                var lineEmail = results[j].getValue('email')
                if (!resultMap[transId]) {
                    resultMap[transId] = {
                        transId: transId,
                        transChannel: transChannel,
                        transDate: transDate,
                        membershipType: membershipType,
                        transEntity: transEntity,
                        transSubsi: transSubsi,
                        customerRegion: customerRegion,
                        transLocation: transLocation,
                        transAmtTotal: 0,
                        transactionItem: [],
                        transByCat: {},
                        transByItem: {},
                        invoicePOSSalesId: invoicePOSSalesId,
                        altname: lineName,
                        email: lineEmail,
                    }
                }
                // TODO BigNumber.js needed
                resultMap[transId].transAmtTotal += parseFloat(transAmt)
                resultMap[transId].transactionItem.push({
                    transItem: transItem,
                    transQty: transQty,
                    transAmt: transAmt,
                    transFXAmt: transFXAmt,
                    transCurrency: transCurrency,
                    transItemCategory: transItemCategory,
                })
                if (!resultMap[transId].transByCat[transItemCategory]) {
                    resultMap[transId].transByCat[transItemCategory] = {
                        amount: 0,
                        qty: 0,
                    }
                }
                resultMap[transId].transByCat[transItemCategory].amount += parseFloat(transAmt)
                resultMap[transId].transByCat[transItemCategory].qty += parseFloat(transQty)

                if (!resultMap[transId].transByItem[transItem]) {
                    resultMap[transId].transByItem[transItem] = {
                        amount: 0,
                        qty: 0,
                    }
                }
                resultMap[transId].transByItem[transItem].amount += parseFloat(transAmt)
                resultMap[transId].transByItem[transItem].qty += parseFloat(transQty)
            }
        }
        log.debug('Total transaction line Count : ' + searchResultCount, JSON.stringify(resultMap))
        return resultMap
    }

    function _getInoviceByCustomer(externalId) {
        var rtn = {
            isValid: false,
            newTier: '',
            newRegion: '',
            internalid: 0,
            // stauts: "raw",
            // name: "",
        }
        var customerSearchObj = search.create({
            type: 'customer',
            filters: [
                ['custentity_iv_decrypted_id', 'is', externalId],
                'AND',
                ['isinactive', 'is', 'F'],
                'AND',
                ['isperson', 'is', 'T'],
            ],
            columns: [
                'internalid',
                'firstname',
                'lastname',
                search.createColumn({ name: 'datecreated', sort: search.Sort.ASC }),
                'custentity_iv_decrypted_id',
                'custentity_iv_cl_member_type',
                'custentity_iv_residential_region',
                'email',
            ],
        })
        var searchResultCount = customerSearchObj.runPaged().count
        log.debug('_getInoviceByCustomer result count for : ' + externalId, searchResultCount)

        const searchResult = customerSearchObj.run().getRange({ start: 0, end: 1 })
        for (var i = 0; i < searchResult.length; i++) {
            rtn['isValid'] = true
            rtn['newTier'] = searchResult[i].getValue('custentity_iv_cl_member_type')
            rtn['newRegion'] = searchResult[i].getValue('custentity_iv_residential_region')
            rtn['internalid'] = searchResult[i].getValue('internalid')
            rtn['altname'] = `${searchResult[i].getValue('firstname')} ${searchResult[i].getValue('lastname')}`
            rtn['email'] = searchResult[i].getValue('email')
            return rtn
        }
        return rtn
    }

    function _setInactiveFailEarnedPoint(CUSTOEMR_ID) {
        var customrecord_iv_earned_rewardsSearchObj = search.create({
            type: 'customrecord_iv_earned_rewards',
            filters: [
                ['custrecord_iv_er_eng_omni_msg', 'startswith', 'Member Registration - Invalid Receipt / Used Receipt'],
                'AND',
                ['isinactive', 'is', 'F'],
                'AND',
                ['custrecord_iv_customer', 'anyof', CUSTOEMR_ID],
            ],
            columns: [search.createColumn({ name: 'internalid', sort: search.Sort.ASC }), 'custrecord_iv_customer'],
        })
        var searchResultCount = customrecord_iv_earned_rewardsSearchObj.runPaged().count
        log.debug('_setInactiveFailEarnedPoint result count', searchResultCount)
        customrecord_iv_earned_rewardsSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            record.submitFields({
                type: 'customrecord_iv_earned_rewards',
                id: result.id,
                values: {
                    isinactive: true,
                },
            })
            return true
        })
    }
    return {
        onRequest: onRequest,
    }
})