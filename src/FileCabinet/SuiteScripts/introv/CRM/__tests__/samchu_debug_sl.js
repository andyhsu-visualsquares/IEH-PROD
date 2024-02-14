/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
define(["../DAO/EarnedRewardsDAO","../../lib/lodash","../../lib/bignumber","N/file"], function(EarnedRewardsDAO,_,bignumber, file) {

    function onRequest(context) {
        try {
            // const earnedRewardsDAO = new EarnedRewardsDAO()
            // let customerIds = [58914]
            // let result = earnedRewardsDAO.findCustomerPointBalance(customerIds)
            // // let groupedResult = _.groupBy(result,"customerId")
            // // let groupedResult_key = Object.keys(groupedResult)
            // // for (let i = 0; i < groupedResult_key.length; i++) {
            // //     let customerId = groupedResult_key[i]
            // //     let earnedRewardData = groupedResult[customerId]
            // //     let sumReward = _.sumBy(earnedRewardData,"earnedPoints")
            // //     let sumRedeem = _.sumBy(earnedRewardData,"redeemPoints")
            // //     let pointBalance = new bignumber(sumReward).minus(sumRedeem)
            // //     groupedResult[customerId].push({ sumReward : sumReward, sumRedeem : sumRedeem, pointBalance:pointBalance })
            // // }
            let fileObj = file.load({
                id: 1823681
            })
            context.response.writeFile({
                file:fileObj,
                isInline:false
            });
            // context.response.write(JSON.stringify(result));
            
        } catch (error) {
            log.debug('error',error);
            log.debug('error stack',error.stack);
            
        }
    }

    return {
        onRequest: onRequest
    }
});
