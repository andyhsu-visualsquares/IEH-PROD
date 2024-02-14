/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Name : UE Invoice
 * Script : customscript_iv_invoice_ue
 * Deploy : customdeploy_iv_invoice_ue
 * 
 * 
**/
define(['N/record', 'N/https', 'N/url', 'N/error', 'N/log', 'N/search', '../../DAO/CustomerDAO'], function(record, https, url, error, log, search, CustomerDAO) {
    function beforeLoad(context) {}
    function beforeSubmit(context) {}
    function afterSubmit(context) {
        const newRecord = context.newRecord;
        if(context.type != context.UserEventType.DELETE && context.type != context.UserEventType.XEDIT){
            const currRecord = record.load({
                type: newRecord.type,
                id: newRecord.id,
                isDynamic: true,
            });
            // var createdFrom = currRecord.getValue({fieldId: "createdfrom"})
            var trandate = currRecord.getText({fieldId: "trandate"});
            var tranCustomer = currRecord.getValue({fieldId: "entity"});

            var customerObj = search.lookupFields({
                type: "customer",
                id: tranCustomer,
                columns: ["custentity_iv_cl_member_type", "custentity_iv_registration_date"]
            })
            log.debug("customerObj",JSON.stringify(customerObj))
            var posID = currRecord.getValue("custbodypossalesid"); 
            var isPOSOrder = !!posID;
            
            var customerCurrentTier = "";
            var customerRegistDate = customerObj.custentity_iv_registration_date;
            if(customerObj.custentity_iv_cl_member_type)if(customerObj.custentity_iv_cl_member_type[0])customerCurrentTier = customerObj.custentity_iv_cl_member_type[0].value;
            var isGuestOrder = !customerCurrentTier;
            
            log.debug(newRecord.id + " : Start Invoice Point Provision Check",{
                "Record ID": newRecord.id,
                "Context Type": context.type,
                "posID": posID,
                "customerCurrentTier": customerCurrentTier,
                "tranCustomer": tranCustomer,
            })
            // Get Customer by Decrypted ID if it is Guest Order & from Eshop
            if(isPOSOrder && isGuestOrder){
                // 20231020 Sam read related payment
                let payment_ids = []
                let paymentLineCount = currRecord.getLineCount('links')
                for (let i = 0; i < paymentLineCount; i++) {
                    currRecord.selectLine({ sublistId: 'links', line: i })
                    let payment_id = currRecord.getCurrentSublistValue({ sublistId: 'links', fieldId: 'id' })
                    payment_ids.push(payment_id)
                }
                var checkGuestCustomer = new CustomerDAO().findCustomersByTransId(posID)
                log.debug(newRecord.id + "checkGuestCustomer for : "+posID, JSON.stringify(checkGuestCustomer));
                if(checkGuestCustomer.length == 0){
                    // 20231005 John This mean skip process this Invoive.
                    log.debug(newRecord.id + "Skip Earned Point");
                    tranCustomer = "";
                }
                else{
                    // 20231005 John This mean Customer was created can use provision to it.
                    tranCustomer = checkGuestCustomer[0].INTERNAL_ID

            var customerObj = search.lookupFields({
                type: "customer",
                id: tranCustomer,
                columns: ["custentity_iv_cl_member_type", "custentity_iv_registration_date"]
            })
            customerRegistDate = customerObj.custentity_iv_registration_date;

                    // 20231020 Sam reset invoice customer
                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            entity : tranCustomer
                        }
                    })
                    isGuestOrder = false;
                    // 20231020 Sam reset related payments customers
                    for (let i = 0; i < payment_ids.length; i++) {
                        // record.submitFields({ type: "customerpayment", id: payment_ids[i], values: { customer : tranCustomer } })
                        let paymentRec = record.load({ type: 'customerpayment', id: payment_ids[i], isDynamic: true, })
                        paymentRec.setValue('customer',tranCustomer)
                        let related_invoice_id = newRecord.id
                        let related_invoice_index = paymentRec.findSublistLineWithValue({ sublistId: 'apply', fieldId: 'internalid', value: related_invoice_id })
                        paymentRec.selectLine({ sublistId: "apply", line: related_invoice_index })
                        paymentRec.setCurrentSublistValue({ sublistId: 'apply', fieldId: 'apply', value: true, })
                        paymentRec.save()
                    }
                }
            }            
            // 20231124 John To skip earn Reward If Customer no registration Date.
            if(customerRegistDate == "")return;

            if(!isGuestOrder && !!tranCustomer){
                // 20231005 John This mean Customer was created can use provision to it.
                //   tranCustomer = checkGuestCustomer["internalid"]
                var responseTier = https.post({
                    url: url.resolveScript({scriptId: 'customscript_iv_downgrade_tier_sl', deploymentId: 'customdeploy_iv_downgrade_tier_sl', returnExternalUrl: true}),
                    body: JSON.stringify({
                        newRecId : tranCustomer,
                    }),
                    headers: {name: 'Accept-Language', value: 'en-us'}
                });
                log.debug(newRecord.id + "responseTier result",JSON.stringify(responseTier.body));
                var response = https.post({
                    url: url.resolveScript({scriptId: 'customscript_iv_create_reward_sl', deploymentId: 'customdeploy_iv_create_reward_sl', returnExternalUrl: true}),
                    body: JSON.stringify({
                        newRecId : newRecord.id,
                        newRecType : "invoice",
                        newRecDate: trandate
                    }),
                    headers: {name: 'Accept-Language', value: 'en-us'}
                });
                log.debug(newRecord.id + "responseReward result",JSON.stringify(response.body));    
            }
        }
    }
    
    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});
