/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *Script Name: CS Code Master Validation IF
 *Script ID: customscript_iv_codemaster_validation_cs
 Purpose: Redeem code master before saving item fulfillment for error handling.

 Audit Log:
 20231124 Chris: Create
 */

define(['N', 'N/ui/dialog'], function (N_1, dialog) {

    function pageInit(context) {

    }

    function saveRecord(context) {

        if (N_1.runtime.executionContext !== N_1.runtime.ContextType.USER_INTERFACE) return
        const { currentRecord } = context
        const createdFromRecType = currentRecord.getText("createdfrom")
        console.log("createdFromRecType", createdFromRecType)
        if (!createdFromRecType.startsWith("Sales Order")) return true //Prevent Triger on Order Type rather than Sale Order

        const soID = currentRecord.getValue("createdfrom")
        const soRec = N_1.record.load({
            type: "salesorder",
            id: soID
        })
        const name = soRec.getValue("custbodyemailtonamevoucher")
        const email = soRec.getValue("custbodyemailaddressvoucher")
        const nameOnIF = currentRecord.getValue("custbodyemailtonamevoucher")
        const emailOnIF = currentRecord.getValue("custbodyemailaddressvoucher")


        if ((name && email) || (nameOnIF && emailOnIF)) {
            // Purpose 1 
            let soItemLength = soRec.getLineCount({
                sublistId: "item"
            })
            var redeemCodeMasterObj = {}
            var validationResult = { allow: true, msg: "" }
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
                let quantity = currentRecord.getSublistValue({ //Check Fulfil Quantity
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
                        log.debug("Stock Not Enough for Item : ", itemID + " | " + quantity)
                        currentRecord.setValue({
                            fieldId: "custbodyredremark",
                            value: `Line ${i + 1} can only assign ${redeemCodeMasterList.length} Voucher(s) out of ${quantity} voucher(s). Please check and review.`,
                            ignoreFieldChange: true,
                            forceSyncSourcing: true
                        })
                        break
                    }
                }
            }
            for (const itemID in redeemCodeMasterObj) {
                if (redeemCodeMasterObj.hasOwnProperty(itemID)) {
                    const value = redeemCodeMasterObj[itemID];
                    if (value.codeMaster.length < value.qty) {
                        // if (value.codeMaster.length < 999999999) {   //TEST ONLY
                        // log.debug("CodeMaster length is smaller than qty for item:", itemID);
                        validationResult = { allow: false, msg: "Stock not enough for related item, please check related code master stock." }

                    }
                }
            }

            if (!validationResult.allow) {
                dialog.alert({
                    title: "Manual Fulfillment Aborting",
                    message: validationResult.msg
                })
                return true
            } else {
                return true
            }

        } else {
            return true
        }
    }

    function validateField(context) {

    }

    function fieldChanged(context) {

    }

    function postSourcing(context) {

    }

    function lineInit(context) {

    }

    function validateDelete(context) {

    }

    function validateInsert(context) {

    }

    function validateLine(context) {

    }

    function sublistChanged(context) {

    }

    return {
        // pageInit: pageInit,
        saveRecord: saveRecord,
        // validateField: validateField,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});
