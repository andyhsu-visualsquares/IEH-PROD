/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Name : UE Item Fulfillment
 * Script : customscript_iv_fulfillment_ue
 * Deploy : customdeploy_iv_fulfillment_ue
 * 
 * 20231005 John : Should Remove this script since Earn Point/Reward function's trigger point has moved to invoice.
**/
define(['N/record', 'N/https', 'N/url'], function(record, https, url) {

    function beforeLoad(context) {
        
    }

    function beforeSubmit(context) {
        
    }

    function afterSubmit(context) {
        const newRecord = context.newRecord;
        // should only use for retrive data
        const currRecord = record.load({
            type: newRecord.type,
            id: newRecord.id,
            isDynamic: true,
        });
        var createdFrom = currRecord.getValue({fieldId: "createdfrom"})
        var trandate = currRecord.getText({fieldId: "trandate"});
        // log.debug("createdFrom",createdFrom);
        var response = https.post({
            url: url.resolveScript({scriptId: 'customscript_iv_create_reward_sl', deploymentId: 'customdeploy_iv_create_reward_sl', returnExternalUrl: true}),
            body: JSON.stringify({
                newRecId : createdFrom,
                newRecType : "invoice",
                newRecDate: trandate
            }),
            headers: {name: 'Accept-Language', value: 'en-us'}
        });
        log.debug("se see",JSON.stringify(response.body));
        var tranCustomer = currRecord.getValue({fieldId: "entity"});
        var responseTier = https.post({
            url: url.resolveScript({scriptId: 'customscript_iv_downgrade_tier_sl', deploymentId: 'customdeploy_iv_downgrade_tier_sl', returnExternalUrl: true}),
            body: JSON.stringify({
                newRecId : tranCustomer,
            }),
            headers: {name: 'Accept-Language', value: 'en-us'}
        });
        log.debug("responseTier result",JSON.stringify(responseTier.body));

    }

    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});
