/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N', 'N/ui/dialog'], function (N_1, dialog) {

    function pageInit(context) {

    }

    // function saveRecord(context) {

    // }

    // function validateField(context) {

    // }

    function fieldChanged(context) {
        const { currentRecord, fieldId, value } = context
        if (!currentRecord.getValue("custrecord_iv_rr_manual_adjustment")) return true;
        if (fieldId === 'custrecord_iv_earned_reward_used' && currentRecord.getValue("custrecord_iv_earned_reward_used")) {
            console.log(currentRecord.getValue("custrecord_iv_earned_reward_used"))
            let earnedRewardsRec = N_1.record.load({
                type: "customrecord_iv_earned_rewards",
                id: currentRecord.getValue("custrecord_iv_earned_reward_used")
            })
            let remainingPoints = Number(earnedRewardsRec.getValue("custrecord_iv_earned_points")) - Number(earnedRewardsRec.getValue("custrecord_iv_redeem_points"))
let earnedRewardStatus = earnedRewardsRec.getValue("custrecord_iv_status")

            console.log("remainingPoints", remainingPoints)
            if (earnedRewardStatus != 2 && earnedRewardStatus != 5) {
                return showInvalidMsg('Invalid Earned Rewards', 0, "Earned Rewards with Invalid Status.")

            }
          if (remainingPoints === 0) {
                // currentRecord.setValue("custrecord_iv_earned_reward_used", "")
                return showInvalidMsg('Invalid Earned Rewards', remainingPoints)
            }
            // let targetCustomer = earnedRewardsRec.getValue("custrecord_iv_customer")
            // currentRecord.setValue("custrecord_iv_rr_customer", targetCustomer)
            if (currentRecord.getValue("custrecord_iv_redemption_points")) {
                let adjustmentPoint = currentRecord.getValue("custrecord_iv_redemption_points")
              console.log("adjustmentPoint", adjustmentPoint)
                if (adjustmentPoint > remainingPoints) {
                    currentRecord.setValue("custrecord_iv_redemption_points", "")
                    return showInvalidMsg('Not Enough Point in Eearn Rewards', remainingPoints)
                }

            }
        }

        if (fieldId === 'custrecord_iv_redemption_points' && currentRecord.getValue("custrecord_iv_earned_reward_used")) {
            let earnedRewardsRec = N_1.record.load({
                type: "customrecord_iv_earned_rewards",
                id: currentRecord.getValue("custrecord_iv_earned_reward_used")
            })
            let remainingPoints = Number(earnedRewardsRec.getValue("custrecord_iv_earned_points")) - Number(earnedRewardsRec.getValue("custrecord_iv_redeem_points"))

            let adjustmentPoint = currentRecord.getValue("custrecord_iv_redemption_points")
            if (adjustmentPoint > remainingPoints) {
                currentRecord.setValue("custrecord_iv_redemption_points", "")
                return showInvalidMsg('Not Enough Point in Eearn Rewards', remainingPoints)
            }
        }

    }

    function showInvalidMsg(Msg, remainingPoints, invalidER) {
        console.log("Invalid Operation")
        if (invalidER) {
            dialog.alert({
                title: Msg,
                message: `Earned Rewards with invalid status, not suitable for manual adjustment.`
            })
        } else {
            dialog.alert({
                title: Msg,
                message: `${remainingPoints} POINTS available in the selected Earned Rewards.`
            })
        }
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
        pageInit: pageInit,
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
