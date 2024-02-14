/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 * Chris
 */
define(["N", 'N/ui/dialog'], function (N_1, dialog) {

    // function pageInit(context) {

    // }

    // function saveRecord(context) {

    // }

    // function validateField(context) {

    // }

    function fieldChanged(context) {
        let currRec = context.currentRecord
        if (context.fieldId !== "custrecord_iv_manual_adjustment") return true;
        if (currRec.getValue("custrecord_iv_manual_adjustment")) {
            currRec.setValue("custrecord_iv_er_eng_omni_msg", "Adjustment")
            currRec.setValue("custrecord_iv_er_tchin_omni_msg", "調整")
            currRec.setValue("custrecord_iv_er_schin_omni_msg", "调整")
        } else {
            console.log("UNTICKED")
            let rewardScheme = N_1.record.load({
                type: 'customrecord_iv_reward_scheme',
                id: currRec.getValue("custrecord_iv_scheme")
            });
            let displayEng = rewardScheme.getValue("custrecord_iv_rs_eng_display_msg")
            let displayTChi = rewardScheme.getValue("custrecord_iv_rs_tchin_display_msg")
            let displaySChi = rewardScheme.getValue("custrecord_iv_rs_schin_display_msg");
            currRec.setValue("custrecord_iv_er_eng_omni_msg", displayEng)
            currRec.setValue("custrecord_iv_er_tchin_omni_msg", displayTChi)
            currRec.setValue("custrecord_iv_er_schin_omni_msg", displaySChi)
            dialog.alert({
                title: "Notice",
                message: "OMNI DISPLAY MESSAGE (IN ENGLISH) / (IN TRADITIONAL CHINESE) / (IN SIMPLIFIED CHINESE) changed."
            })
        }
        return true;
    }

    // function postSourcing(context) {

    // }

    // function lineInit(context) {

    // }

    // function validateDelete(context) {

    // }

    // function validateInsert(context) {

    // }

    // function validateLine(context) {

    // }

    // function sublistChanged(context) {

    // }

    return {
        // pageInit: pageInit,
        // saveRecord: saveRecord,
        // validateField: validateField,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});
