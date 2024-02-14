/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 *
 * Purpose: When Saving Fulfillment on UI
 * 1 - Find All Item Line on SO to check which item needs to have code from code master
 * 2.1 = Check any redeem code master asigned to this item  on this SO yet
 * 2 - Check if redeem code have enough stock for all item
 * 3 - Go into Code Master Available code to mark down related SO number for further processing later in Fern Code
 * 
 * Audit Log:
 * 20231123 Chris: Create
 * 20231208 Chris: Add Purpose 2.1 for handling double trigger issue
 */
define(['N', '../../../DAO/RedeemCodeMasterDAO'], function (N_1, RedeemCodeMasterDAO) {

    function beforeLoad(context) {

    }

    function beforeSubmit(context) {
        if (N_1.runtime.executionContext !== N_1.runtime.ContextType.USER_INTERFACE) return
        const { newRecord } = context;
        const saveFileNoEmail = newRecord.getValue("custbodyrvsavetofile")
        const soID = newRecord.getValue("createdfrom")
        const createdFromRecType = newRecord.getText("createdfrom")
        if (createdFromRecType.startsWith("Sales Order")) {
            const soRec = N_1.record.load({
                type: "salesorder",
                id: soID
            })
            const name = soRec.getValue("custbodyemailtonamevoucher")
            const email = soRec.getValue("custbodyemailaddressvoucher")
            const nameOnFulfilment = newRecord.getValue("custbodyemailtonamevoucher")
            const emailOnFulfilment = newRecord.getValue("custbodyemailaddressvoucher")

            if ((name && email) || (nameOnFulfilment && emailOnFulfilment)) {
                // Purpose 1 
                let soItemLength = soRec.getLineCount({
                    sublistId: "item"
                })
                var redeemCodeMasterObj = {}
                var allowFulfill = true
                for (let i = 0; i < soItemLength; i++) {
                    let itemID = soRec.getSublistValue({
                        sublistId: "item",
                        fieldId: "item",
                        line: i
                    })
                    let itemClassID = soRec.getSublistValue({
                        sublistId: "item",
                        fieldId: "class",
                        line: i
                    })
                    let quantity = newRecord.getSublistValue({ //Check Fulfilment Quantity
                        sublistId: "item",
                        fieldId: "quantity",
                        line: i
                    })
                    let totalQuantity = soRec.getSublistValue({
                        sublistId: "item",
                        fieldId: "quantity",
                        line: i
                    })

                    var checkVoucherClass = N_1.search.lookupFields({
                        type: "classification",
                        id: itemClassID,
                        columns: ['custrecord_evoucher']
                    })

                    if (checkVoucherClass.custrecord_evoucher) {
                        //Purpose 2.1: Check Any code assigned for this Item on this SO
                        let redeemCodeMasterRedeemedList = N_1.search.create({
                            type: "customrecordrcmaster",
                            filters: [
                                ["custrecordrcmastersalestransaction", "anyof", soID],
                                "AND",
                                ["isinactive", "is", "F"],
                                "AND",
                                ["internalid", "noneof", "3550721", "3483921"] //1 Time Testing Only
                            ]
                        }).run().getRange({ start: 0, end: 1000 })
                        log.debug("redeemCodeMasterRedeemedList", redeemCodeMasterRedeemedList)
                        if (redeemCodeMasterRedeemedList.length >= totalQuantity) return //This is a double triggering situation with all quantity fulfilled

                        //Purpose 2 : Find Code with this Item
                        let redeemCodeMasterList = N_1.search.create({
                            type: "customrecordrcmaster",
                            filters:
                                [
                                    ["custrecordrcmastervoucheritem", "anyof", itemID],
                                    "AND",
                                    ["custrecordrcmasterused", "is", "F"],
                                    "AND",
                                    ["custrecordrcmastersentorsold", "is", "F"],
                                    "AND",
                                    ["isinactive", "is", "F"],
                                    "AND",
                                    ["custrecordredeemcodenoteffective", "is", "F"],
                                    "AND",
                                    ["custrecordrcmastereffectivedate", "after", "today"]
                                ],
                            columns:
                                [
                                    'internalid',
                                    'name',
                                    'custrecordrcmasterredeemprod',
                                    'custrecordrcmastervoucheritem',
                                    'custrecordrcmastersentorsold'
                                ]
                        }).run().getRange({ start: 0, end: 1000 })
                        redeemCodeMasterObj[itemID] = {
                            qty: quantity,
                            codeMaster: redeemCodeMasterList
                        }
                        if (redeemCodeMasterList.length < quantity) {
                            log.debug("Stock Not Enough for Item : ", itemID)
                            break
                        }
                    }
                }
                for (const itemID in redeemCodeMasterObj) {
                    if (redeemCodeMasterObj.hasOwnProperty(itemID)) {
                        const value = redeemCodeMasterObj[itemID];
                        if (value.codeMaster.length < value.qty) {
                            // if (value.codeMaster.length < 999999999) {   //TEST ONLY
                            log.debug("CodeMaster length is smaller than qty for item:", itemID);
                            allowFulfill = false
                        }
                    }
                }
                //Purpose 3 
                log.debug("Start Code Master List Update")
                // if (redeemCodeMasterObj.hasOwnProperty(itemID)) {
                log.debug("redeemCodeMasterObj", redeemCodeMasterObj)
                if (allowFulfill) {
                    for (const itemID in redeemCodeMasterObj) {
                        if (redeemCodeMasterObj.hasOwnProperty(itemID)) {
                            const redeemCodeMasterDAO = new RedeemCodeMasterDAO()
                            const bodyFieldsToBeUpdated = [
                                {
                                    field: 'custrecordrcmastersentorsold',
                                    value: true,
                                    valueType: 'value',
                                },
                                {
                                    field: 'custrecordrcmastersalestransaction',
                                    value: `${soID}`,
                                    valueType: 'value',
                                },
                            ]
                            // for (const itemID in redeemCodeMasterObj) {
                            for (let i = 0; i < redeemCodeMasterObj[itemID].qty; i++) {
                                log.debug("Mark Redeem SOID on Redeem Code Master", redeemCodeMasterObj[itemID].codeMaster[i].id)
                                redeemCodeMasterDAO.update(redeemCodeMasterObj[itemID].codeMaster[i].id, bodyFieldsToBeUpdated)
                            }
                            // }
                        }
                    }
                    newRecord.setValue("custbodyredremark", "")
                } else {
                    log.debug("Stock Not Enough for Item, please check related code master stock")
                    // throw new Error("Stock Not Enough for Item, please check related code master stock.");
                }

                // }
            }
        }
    }
    function afterSubmit(context) {

    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    }
});
