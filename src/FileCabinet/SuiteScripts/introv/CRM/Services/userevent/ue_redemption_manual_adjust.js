/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(["N", '../../DAO/EarnedRewardsDAO', '../../Constants/Constants'], function (N_1, EarnedRewardsDAO, const_1) {

    function beforeLoad(context) {

    }

    function beforeSubmit(context) {

    }

    function afterSubmit(context) {
        const { newRecord } = context
        log.debug("newRecID", newRecord.id)
        if (!newRecord.getValue("custrecord_iv_rr_manual_adjustment")) return true
        let targetEarnrewards = newRecord.getValue("custrecord_iv_earned_reward_used")
        let targetEarnrewardsRec = N_1.record.load({
            type: "customrecord_iv_earned_rewards",
            id: targetEarnrewards
        })
        if (targetEarnrewardsRec.getValue("custrecord_iv_redemption_record").includes(`${newRecord.id}`)) return true;

        let redeemedItems = newRecord.getValue("custrecord_iv_redeemed_item")
        let redeemedPoint = newRecord.getValue("custrecord_iv_redemption_points")

        log.debug("custrecord_iv_redemption_item", targetEarnrewardsRec.getValue("custrecord_iv_redemption_item"))
        let currentRedemptionItem = (targetEarnrewardsRec.getValue("custrecord_iv_redemption_item").length > 0 ? targetEarnrewardsRec.getValue("custrecord_iv_redemption_item") : []);
        if (currentRedemptionItem.length > 0) {
            let currentRedmptedItem = currentRedemptionItem[0].split(",")
            for (let redeemItem of redeemedItems) {
                currentRedmptedItem.includes(redeemItem) ? null : currentRedmptedItem.push(redeemItem)
            }
            currentRedemptionItem = currentRedmptedItem
        } else {
            for (let redeemItem of redeemedItems) {
                currentRedemptionItem.push(redeemItem)
            }
        }

        let remainingPoints = Number(targetEarnrewardsRec.getValue("custrecord_iv_earned_points")) - Number(targetEarnrewardsRec.getValue("custrecord_iv_redeem_points"))
        let adjustmentPoint = newRecord.getValue("custrecord_iv_redemption_points")
        const currentRedemptionRec = targetEarnrewardsRec.getValue("custrecord_iv_redemption_record")
        const newRedemptionRec = currentRedemptionRec
            ? Array.isArray(currentRedemptionRec)
                ? [...currentRedemptionRec, newRecord.id].join('\u0005')
                : `${currentRedemptionRec}\u0005${newRecord.id}`
            : newRecord.id;

        log.debug("newRedemptionRec", newRedemptionRec)
        const earnedRewardsDAO = new EarnedRewardsDAO()
        earnedRewardsDAO.updateEarnedRecord(targetEarnrewards, [
            {
                field: 'custrecord_iv_redeem_points',
                value: targetEarnrewardsRec.getValue("custrecord_iv_redeem_points") ? Number(targetEarnrewardsRec.getValue("custrecord_iv_redeem_points")) + Number(redeemedPoint) : Number(redeemedPoint)
            },
            {
                field: 'custrecord_iv_redemption_record',
                value: newRedemptionRec
                // value: (targetEarnrewardsRec.getValue("custrecord_iv_redemption_record").length === 0 ? newRecord.id : targetEarnrewardsRec.getValue("custrecord_iv_redemption_record").split(",").join("\u0005") + "\u0005" + newRecord.id)
            },
            {
                field: 'custrecord_iv_redemption_item',
                value: currentRedemptionItem.join('\u0005')
            },
            {
                field: 'custrecord_iv_status',
                value: remainingPoints > adjustmentPoint ? const_1.EARNED_REWARDS_TYPE.POINT_STATUS.PARITIALLY_USED : const_1.EARNED_REWARDS_TYPE.POINT_STATUS.USED
            }

        ])
    }

    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});
