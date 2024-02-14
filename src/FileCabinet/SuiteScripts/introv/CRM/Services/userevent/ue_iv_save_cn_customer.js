/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 * Name: UE Handle Save CN Customer
 * ID: customscript_iv_save_cn_customer_ue
 * Author : Chris Chau
 */
define(['../../Constants/CustomerConstants', 'N', '../ChinaDBServices'], function (customerConstants, N_1, ChinaDBServices) {

    function beforeLoad(context) {

    }

    function beforeSubmit(context) {
        if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.COPY) return true;
        let currRec = context.newRecord;
        let oldRec = context.oldRecord;
        log.debug("N_1.runtime.executionContext", N_1.runtime.executionContext)
        log.debug(`oldRec.getValue("custentity_iv_registration_date")`, !oldRec.getValue("custentity_iv_registration_date"))
        log.debug("CurrentRec Reg Date", currRec.getValue("custentity_iv_registration_date"))
        if (N_1.runtime.executionContext != N_1.runtime.ContextType.USER_INTERFACE && oldRec.getValue("custentity_iv_registration_date")) return true
        const cnDBServices = new ChinaDBServices();
        if (!currRec.getValue("custentity_iv_ischina")) return true;

        var cnCustomerData = {};

        // Add mappings for each field
        cnCustomerData.FIRST_NAME = currRec.getValue("firstname");
        cnCustomerData.LAST_NAME = currRec.getValue("lastname");
        cnCustomerData.SALUTATION = currRec.getValue("salutation");
        cnCustomerData.BIRTHDAY_MONTH = currRec.getValue("custentity_iv_cl_birthday");
        cnCustomerData.AGE = currRec.getValue("custentity_iv_cl_age");
        cnCustomerData.PHONE = currRec.getValue("phone");
        cnCustomerData.EMAIL = currRec.getValue("email");
        cnCustomerData.DEFAULT_LANGUAGE = currRec.getText("custentity_iv_default_language");
        cnCustomerData.AREA_CODE = currRec.getText("custentity_iv_customer_areacode")
        cnCustomerData.DISTRICT = currRec.getValue("custentity_iv_district")

        cnCustomerData.INTERESTED_PRODUCT = currRec.getText("custentity_iv_interested_products");
        cnCustomerData.REGISTRATION_DATE = currRec.getValue("custentity_iv_registration_date");
        cnCustomerData.RESIDENTIAL_REGION = currRec.getText("custentity_iv_residential_region");
        cnCustomerData.EFFECTIVE_DATE = currRec.getValue("custentity_iv_cl_effective_date");
        cnCustomerData.EFFECTIVE_TO = currRec.getValue("custentity_iv_cl_effective_to");
        cnCustomerData.WELCOME_GIFT_DATE = currRec.getValue("custentity_iv_welcome_gift_provision_day");
        cnCustomerData.REFERRAL_REFERENCE = currRec.getValue("custentity_iv_referral_reference");
        cnCustomerData.MARKETING_PROMOTE = currRec.getValue("custentity_iv_marketing_promotion_info");
        cnCustomerData.TC = currRec.getValue("custentity_iv_customer_data_policy");
        cnCustomerData.MEMBER_TYPE = currRec.getValue("custentity_iv_cl_member_type");
        cnCustomerData.DISTRICT = currRec.getValue("custentity_iv_district");
        cnCustomerData.DUMMY_TEXT1 = currRec.getValue("custentity_iv_dummy_text1");
        cnCustomerData.DUMMY_DATE1 = currRec.getValue("custentity_iv_dummy_date1");
        cnCustomerData.DUMMY_DATE2 = currRec.getValue("custentity_iv_dummy_date2");

        log.debug("STATUS :", "Transfer to CN DB");
        log.debug("cnCustomerData", cnCustomerData)
        let updateRespond = cnDBServices.updateCustomer(cnCustomerData, currRec.getValue("entityid"))
        log.debug("updateRespond", updateRespond.code);

        if (updateRespond.code != "200") {
            let errorMsg = (JSON.parse(updateRespond.body)).msg
            throw new Error("Submit to CN DB Error : " + errorMsg)
        }


        log.debug("STATUS :", "Start Clearing")
        let allBlankHeaderFieldIds = [
            'salutation',
            'custentity_iv_cl_birthday',
            'custentity_iv_cl_age',
            'custentity_iv_default_language',
            // 'custentity_iv_interested_products',
            // 'custentity_iv_registration_date',
            // 'custentity_iv_cl_effective_date',
            // 'custentity_iv_cl_effective_to',
            // 'custentity_iv_welcome_gift_provision_day',
            'custentity_iv_referral_reference',
            // 'custentity_iv_marketing_promotion_info',
            // 'custentity_iv_customer_data_policy',
            // 'custentity_iv_cl_member_type',
            'custentity_iv_district',
            'custentity_iv_dummy_text1',
            'custentity_iv_dummy_date1',
            'custentity_iv_dummy_date2',
            'custentity_iv_residential_region'
        ];

        for (let i = 0; i < allBlankHeaderFieldIds.length; i++) {
            if (allBlankHeaderFieldIds[i] === "custentity_iv_marketing_promotion_info" || allBlankHeaderFieldIds[i] === "custentity_iv_customer_data_policy") {
                currRec.setValue(allBlankHeaderFieldIds[i], false);
            } else {
                currRec.setValue(allBlankHeaderFieldIds[i], "");
            }
        }
        currRec.setValue("firstname", "China")
        currRec.setValue("lastname", "Individual")
        // currRec.setValue("altname", "China Individual")
        log.debug("Finish Clearing")
    }

    function afterSubmit(context) {

    }

    return {
        // beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    }
});

