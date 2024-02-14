/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * 
 * Name : SL Create Upgrade Reward
 * script : customscript_iv_upgrade_reward_sl
 * deploy : customdeploy_iv_upgrade_reward_sl
 * 
 * Purpose: only for the Tier Upgrade Reward.
 * 1. get New Tier is upgrade
 * 2. get all tier upgrade from this tier
 * 3. (vaidate for duplicate?) check created reward from this scheme this tier and this day./ trigger from everyone SL?
 * 4. Create SO + IF...
**/
define([
    'N/error',
    'N/log',
    'N/record',
    'N/search',
    '../AutoFulfilOnlineSO',
    '../../DAO/EarnedRewardsDAO',
    '../../DAO/RedeemCodeMasterDAO',
    '../../DAO/RewardSchemeDAO',
    '../../DAO/SalesOrderDAO',
    '../../../lib/Time/moment',
], function (
    error,
    log,
    record,
    search,
    AutoFulfilOnlineSO,
    EarnedRewardsDAO,
    RedeemCodeMasterDAO,
    RewardSchemeDAO,
    SalesOrderDAO,
    moment,
) {

    /**
     * 
     * @param {
     *      recCustomer,
     *      recSubsi,
     *      recChannel,
     *      recLocation,
     *      recTier
     * } context 
     */
    function onRequest(context) {
        let rtn = {
            isSuccess: false,
            msg: "raw",
            id: 0,
            type: ""
        };

        try {
            var params;
            if (!!context.request.body) {
                params = JSON.parse(context.request.body);
                log.debug("params", JSON.stringify(params));
            }
            else {
                throw error.create({
                    message: "Invalid Param",
                    name: "Inavlid Param",
                    notifyOff: true
                })
            }
            const recCustomer = params.recCustomer;
            log.debug("LOAD Customer", recCustomer)
            const customerObj = record.load({
                type: "customer",
                id: recCustomer
            })
            // TODO 20231124 John Since No Location field in Customer, We use Corporate - IDL : 209
            const recLocation = params.recLocation;
            const recTier = params.recTier;

            const REWARD_DAO = new RewardSchemeDAO();
            var membershipDetail = REWARD_DAO.getRewardSchemeFromMemberships({ APPLICABLE_TIER: recTier });

            var toBeCreateEarnedRewardList = [];
            var toBeFulfillList = [];
            for (const key in membershipDetail) {
                if (Object.hasOwnProperty.call(membershipDetail, key)) {
                    var giftedList = [];
                    var isValid = false;
                    var earnedPoint = 0;
                    var rewardType = "";
                    var giftedQty = 0;

                    const element = membershipDetail[key];
                    switch (Number(element.rewardSubType)) {
                        case REWARD_DAO.REWARD_SUB_TYPE.UPGRADE_OFFER.value:
                            log.debug("is element", JSON.stringify(element));
                            // log.debug("is element.giftList", JSON.stringify(element.giftList));
                            if (!!element.giftList) {
                                rewardType = 2;
                                giftedList = (element.giftList.indexOf(",") != -1) ? element.giftList.split(",") : element.giftList;
                                giftedQty = element.giftQty;
                                isValid = true;
                            }
                            else if (element.pointProvisioned) {
                                rewardType = 1;
                                earnedPoint += Number(element.pointProvisioned)
                                isValid = true;
                            }
                            break;
                        default:
                            break;
                    }
                    if (isValid) {
                        // if rewardType = 2, created SO+IF for it.
                        var soId = "";
                        if (rewardType == 2) {
                            const soBodyData = [
                                {
                                    field: 'entity',
                                    value: recCustomer,
                                    valueType: 'value',
                                },
                                {
                                    field: 'subsidiary',
                                    value: customerObj.getValue("subsidiary"),
                                    valueType: 'value',
                                },
                                {
                                    field: 'cseg1',
                                    value: customerObj.getValue("cseg1"),
                                    valueType: 'value',
                                },
                                {
                                    field: 'location',
                                    value: recLocation,
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
                                {
                                    field: 'custbody_iv_so_redeem_master_code',
                                    value: '',
                                    valueType: 'value',
                                },
                                {
                                    field: 'custbodyemailtonamevoucher',
                                    value: `${customerObj.getValue("firstname")} ${customerObj.getValue("lastname")}`,
                                    valueType: 'value'
                                },
                                {
                                    field: 'custbodyemailaddressvoucher',
                                    value: customerObj.getValue('email'),
                                    valueType: 'value'
                                },
                            ]

                            const soLineData = []
                            // giftedList.forEach((item) => {
                            //     soLineData.push({
                            //         sublist: 'item',
                            //         lineItem: [
                            //             { field: 'item', value: item },
                            //             { field: 'quantity', value: giftedQty },
                            //             { field: 'price', value: -1 },
                            //             { field: 'rate', value: 0 },
                            //             { field: 'custcol_discount_percentage', value: 100 },
                            //         ],
                            //     })
                            // })
                            if (element.giftList.indexOf(",") != -1) {
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
                            }
                            else {
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

                            soId = new SalesOrderDAO().create(soBodyData, soLineData)

                            record.submitFields({
                                type: "salesorder",
                                id: soId,
                                values: {
                                    custbody_approval_status: 4
                                }
                            })
                            if (toBeFulfillList.indexOf(soId) == -1) {
                                toBeFulfillList.push(soId);
                            }
                        }

                        // Assume the gift expiry date will same as point expiry date
                        var pointProvisionDate = moment().utc().add(8 * 60, "minute");
                        var seePoint = search.lookupFields({
                            type: "customrecord_iv_membership_tiers",
                            id: recTier,
                            columns: ["custrecord_iv_point_valid_period"]
                        })
                        var expiryProvisionDate = moment().utc().add(8 * 60, "minute");
                        expiryProvisionDate.add(Number(seePoint.custrecord_iv_point_valid_period), 'months').endOf("months")

                        var ERObj = {
                            REWARD_TYPE: rewardType,
                            REWARD_SCHEME: element.transId,
                            REWARD_CUSTOMER: recCustomer,
                            REWARD_SUBSI: customerObj.getValue("subsidiary"),
                            REWARD_LOCATION: recLocation,
                            REWARD_CHANNEL: customerObj.getValue("cseg1"),
                            REWARD_SOURCESO: "",
                            REWARD_EARNEDPOINT: earnedPoint,
                            REWARD_ACQUIREDGIFT: giftedList,
                            // : giftedQty,
                            REWARD_REDEEMPOINT: 0,
                            REWARD_REDEEMITEM: [],
                            REWARD_REDEEMRECORD: [],
                            REWARD_DATE_TIME: moment().utc().add(8 * 60, "minute"),
                            REWARD_PROVISION_DATE_TIME: pointProvisionDate,
                            REWARD_EXPIRY_DATE_TIME: expiryProvisionDate,
                            REWARD_STATUS: 2,
                            REWARD_IS_EXPIRED: false,
                            REWARD_OMNI_EN_MSG: element.OMNIeng,
                            REWARD_OMNI_TC_MSG: element.OMNItc,
                            REWARD_OMNI_SC_MSG: element.OMNIsc,
                        };
                        if (!!soId) {
                            ERObj["REWARD_GIFTSO"] = soId
                        }
                        toBeCreateEarnedRewardList.push(ERObj);
                    }
                }
            }

            // var needFulfill = false;
            log.debug("toBeCreateEarnedRewardList", JSON.stringify(toBeCreateEarnedRewardList))
            for (var k = 0; k < toBeCreateEarnedRewardList.length; k++) {
                const redemptionID = new EarnedRewardsDAO().createRewardRecord(toBeCreateEarnedRewardList[k]);
                log.debug("redemptionID", redemptionID);

                // //20231116 Chris: + Redeem Code Master Logic For Changed Email QR Attachment Logic
                // log.debug("giftedList", toBeCreateEarnedRewardList[k].REWARD_ACQUIREDGIFT)
                // let redeemCodeMasterList = search.create({
                //     type: "customrecordrcmaster",
                //     filters:
                //         [
                //             ["custrecordrcmastervoucheritem", "anyof", toBeCreateEarnedRewardList[k].REWARD_ACQUIREDGIFT],
                //             "AND",
                //             ["custrecordrcmasterused", "is", "F"],
                //             "AND",
                //             ["custrecordrcmastersentorsold", "is", "F"],
                //             "AND",
                //             ["isinactive", "is", "F"],
                //             "AND",
                //             ["custrecordredeemcodenoteffective", "is", "F"]
                //         ],
                //     columns:
                //         [
                //             'internalid',
                //             'name',
                //             'custrecordrcmasterredeemprod',
                //             'custrecordrcmastervoucheritem',
                //             'custrecordrcmastersentorsold'
                //         ]
                // }).run().getRange({ start: 0, end: 1000 })
                // if (redeemCodeMasterList.length > 0) {
                //     const redeemCodeMasterDAO = new RedeemCodeMasterDAO()
                //     const bodyFieldsToBeUpdated = [
                //         {
                //             field: 'custrecordrcmastersentorsold',
                //             value: true,
                //             valueType: 'value',
                //         },
                //         {
                //             field: 'custrecordrcmastersalestransaction',
                //             value: `${soId}`,
                //             valueType: 'value',
                //         },
                //     ]
                //     log.debug("redeemCodeMasterList[0].id", redeemCodeMasterList[0].id)
                //     log.debug("bodyFieldsToBeUpdated", bodyFieldsToBeUpdated)
                //     redeemCodeMasterDAO.update(redeemCodeMasterList[0].id, bodyFieldsToBeUpdated)
                //     needFulfill = true;
                // }
            }
            rtn.msg = JSON.stringify(recCustomer) + " : Customer Upgrade Tier Successful created";

            // if(needFulfill){
            for (let indexIF = 0; indexIF < toBeFulfillList.length; indexIF++) {
                const element = toBeFulfillList[indexIF];
                new AutoFulfilOnlineSO({ type: "salesorder", id: element }).fulfilOnlineSO();
            }
            // }
            // check customer current Period is permenant
            // check still have enough point
            // check which is down level + is level exist that time

            rtn.isSuccess = true;
            context.response.write(JSON.stringify(rtn));
        }
        catch (e) {
            // log.error("SL debug error",e.toString());
            // context.response.write(e.message);
            log.error("SL Failed", JSON.stringify(e.message + e.stack));
            rtn.isSuccess = false;
            rtn.msg = `SL Failed, ${JSON.stringify(e.message + e.stack)}`;
            context.response.write(JSON.stringify(rtn));
        }
    }

    return {
        onRequest: onRequest
    }
});