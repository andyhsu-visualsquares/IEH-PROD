/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * 
 * Name : SL Cancel Membership
 * script : customscript_iv_cancel_membership_sl
 * deploy : customdeploy_iv_cancel_membership_sl
 * 
 * --1. load record
 * 2. get field list => clear except...
 * 3. update cancellation date
 * 
 * 4. Update all point of customer
**/
define(['N/error', 'N/format', 'N/log', 'N/record', 'N/search'], function(error, format, log, record, search) {

    function onRequest(context) {
        let rtn = {
            isSuccess: false,
            msg: "raw",
            id: 0,
            type: ""
        };

        var newRecId;
        if(!!context.request.body){
            const params = JSON.parse(context.request.body);
            newRecId = params.newRecId;
            // log.debug("params", JSON.stringify(params));
        }
        else{
            throw error.create({
                message: "Invalid Param",
                name: "Inavlid Param",
                notifyOff: true
            })
        }
        try{
            const CUSTOMER_ID = newRecId;

            var customerRec = record.load({
                type: "customer",
                id: CUSTOMER_ID,
                isDynamic: true
            })
            
            var fieldList = customerRec.getFields();
            // const ignoreFieldList = ["custentity_iv_cancel_reason","lastname","firstname","entityid","phone","email","isinactive","sys_id","origcurrency"];
            var neededFieldList = ["salutation","salesrep","companyname",/**will case subsi disappear "parent",*/"custentityuploadroadshow","cseg1",
                "pricelevel","terms","comments","custentity_iv_cl_member_card","custentity_iv_cl_member_type","custentity_iv_cl_outstanding_points",
                "custentity_iv_referral_reference","custentity_iv_registration_date",/**"custentity_iv_welcome_gift_provision_day"*/,
                "custentity_iv_cl_effective_date","custentity_iv_cl_effective_to","custentity_iv_cl_birthday","custentity_iv_cl_age",
                "custentity_iv_interested_products","custentity_iv_marketing_promotion_info","homephone",/**"phone",*/"mobilephone",
                /**"email"*/,"altphone","fax","custentity_iv_customer_areacode","custentitysales1contactperson","custentitysales1email",
                "custentitysales1phone","custentitysales1fax","custentitysales2contactperson","custentitysales2email","custentitysales2phone",
                "custentitysales2fax","custentityacccontactperson","custentityaccemail","custentityaccphone","custentityaccfax",
                "custentitylogiscontactperson","custentitylogisemail","custentitylogisphone","custentitylogisfax",
                "custentity1","custentity_primary_contact_person","custentity_sales_rep_email","custentity_sales_rep_phone",
                "custentity_comment_printout","custentity_approve","custentity_email_primary_person","custentityprintonreceiptsas",
                "custentityappstatus","custentity_iv_customer_data_policy","custentity_iv_residential_region",/**"custentity_iv_cancel_reason",*/
                "custentity_iv_district","custentity_iv_encrypted_id","custentity_iv_decrypted_id","custentity_iv_dummy_date1",
                "custentity_iv_dummy_date2","custentity_iv_dummy_text1","custentity_iv_dummy_text2","custentity_iv_default_language",
                "custentity_iv_customer_merge_pt_bal","custentity_iv_ischina",
                "custentity_pos_id","custentity_pos_caid","custentity_pos_sid","custentityposid","custentityposcardid","custentitypostraveldocid",
                "custentityposcity","custentityposdob","custentityposdatejoin","custentityposdateleft","custentityposexpirydate",
                "custentityposmemberexpired","custentityposwechatid","custentityposemail","custentityposphone","custentityposotherlang",
                /**"custentity_to_be_updated",*/"custentityposjson","custentity_iv_full_phone_number"
            ];
            const fieldTypeList = [
                "date",
                "select",
                "email",
                "text",
                "datetime",
                "currency",
                "datetimetz",
                "integer",
                "label",
                "phone",
                "textarea",
                "poscurrency",
                "url",
                "address",
                // "radio",
                "float",
                "posinteger"
             ]
            //  ["currency", "date", "datetime","DOCUMENT","email","emails","float","FULLPHONE","integer","PERCENT","phone","rate","select","text","textarea","time","timeofday","url","posinteger"];
            for (let i = 0; i < fieldList.length; i++) {
                const element = fieldList[i];
                if(neededFieldList.indexOf(element)!=-1){
                    var targetField = customerRec.getField({fieldId: element});
                    log.audit("subsidiary 2.5:"+element,customerRec.getValue("subsidiary"))
                    // log.audit("Field ID: "+ element, JSON.stringify(targetField));
                    if(targetField.type == "checkbox"){
                        customerRec.setValue(element, false);
                    }
                    else if(targetField.type == "multiselect"){
                        customerRec.setValue(element, []);
                    }
                    else if(fieldTypeList.indexOf(targetField.type) != -1){
                        customerRec.setValue(element, "");
                    }
                }
            }

            // Step 2: Change the name to and set cancel date
            customerRec.setValue("lastname", "Member");
            customerRec.setValue("firstname", "Cancelled");
            customerRec.setValue("custentity_iv_cancel_member_date", new Date());
            // Step 3 : remove all address
            var addressCount = customerRec.getLineCount({sublistId: "addressbook"})
            log.audit("addressCount",addressCount);
            for (let iAddress = 0; iAddress < addressCount; iAddress++) {
                log.audit("iAddress",iAddress);
                customerRec.removeLine({
                    sublistId: "addressbook",
                    line: iAddress,
                })
            }

            customerRec.save();

            // Need to remove all point provisioned.
            var allRewardPoint = _getAllEarnedPoint(CUSTOMER_ID);
            for (let j = 0; j < allRewardPoint.length; j++) {
                record.submitFields({
                    type: "customrecord_iv_earned_rewards",
                    id: allRewardPoint[j],
                    values: {
                        custrecord_iv_point_expiry_date_time : "",
                        // Status is "Cancelled"
                        custrecord_iv_status : "3",
                    }
                })
            }


            rtn.msg = JSON.stringify("Cancel Success!");
            rtn.isSuccess = true;
            context.response.write(JSON.stringify(rtn));


        }
        catch(e){
            log.error("SL Failed : " + newRecId,JSON.stringify(e.message + e.stack));

            rtn.isSuccess = false;
            rtn.msg = `SL Failed, ${JSON.stringify(e.message + e.stack)}`;
            context.response.write(JSON.stringify(rtn));
        }
    }

    // Maximum handel should be ~800 earned reward.
    function _getAllEarnedPoint(CUSTOMER_ID){
        var returnList = [];
        var customrecord_iv_earned_rewardsSearchObj = search.create({
            type: "customrecord_iv_earned_rewards",
            filters:
            [
               ["custrecord_iv_customer","anyof",CUSTOMER_ID], 
               "AND", 
               ["isinactive","is","F"], 
               "AND", 
               // Reward Type is "Point"
               ["custrecord_iv_reward_type","anyof","1"]
            ],
            columns:
            [
               search.createColumn({name: "internalid",sort: search.Sort.ASC})
            ]
        });
        var searchResultCount = customrecord_iv_earned_rewardsSearchObj.runPaged().count;
        log.debug("customrecord_iv_earned_rewardsSearchObj result count",searchResultCount);
        customrecord_iv_earned_rewardsSearchObj.run().each(function(result){
            // .run().each has a limit of 4,000 results
            returnList.push(result.id);
            return true;
        });
        return returnList;
    }

    return {
        onRequest: onRequest
    }
});
