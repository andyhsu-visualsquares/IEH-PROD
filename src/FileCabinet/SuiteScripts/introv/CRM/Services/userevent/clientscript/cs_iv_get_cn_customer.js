/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 * Script Name : CS Get CN Customer Data to Page
 * id: customscript_iv_get_cn_customer_cs
 *
 */
define(['../../../../lib/Time/moment', 'N'], function (moment, N_1) {
    function pageInit(context) {
        // const dateUtils = new DateUtils();
        if (!context.currentRecord.getValue('custentity_iv_ischina')) return true

        var cutomerModel = document.getElementById('cutomerModel');

        // console.log(cutomerModel);
        if (cutomerModel == null) {
            var htmlText = "<div id ='cutomerModel' style=\"position: absolute;top: 0;left: 0;display: block;background-color: rgba(9, 9, 9, 0.6);width: 100%;height: 100%;z-index: 1000;text-align:center\"/>\n"
                + "<img src=\"https://system.na2.netsuite.com/core/media/media.nl?id=3583&c=4890821&h=8dca27f2eedc57f9d2a1\" style=\"margin-top:20%;width:40px;\" /></br>\n"
                + "<b style=\"margin-top:2%;color:#fff\">"
                + "Loading From CN Database." + "</b>\n" + "</div>";

            document.body.insertAdjacentHTML('beforeend', htmlText);

        } else {
            document.getElementById('cutomerModel').style.display = 'block';
        }

        // jQuery(
        //     document.querySelector(
        //         '#main_form > table > tbody > tr:nth-child(1) > td > div > div.uir-page-title-secondline > div.uir-record-id'
        //     )
        // ).text('Data Loading From CN DB , Please Wait.....')

        let currRec = context.currentRecord
        let stagingSearchCount = N_1.search.create({
            type: "customrecord_iv_temp_china_customer",
            filters: [
                "name", 'is', `${currRec.getValue('entityid')}`,
                'AND',
                "custrecord_iv_china_db_workflow", "is", "1",
            ],
            columns: [
                "name",
                "custrecord_iv_temp_first_name",
                "custrecord_iv_temp_last_name"
            ]
        }).runPaged().count;

        if (stagingSearchCount > 0) {
            document.getElementById('cutomerModel').remove()
            var htmlText = "<div id ='cutomerModel' style=\"position: absolute;top: 0;left: 0;display: block;background-color: rgba(9, 9, 9, 0.6);width: 100%;height: 100%;z-index: 1000;text-align:center\"/>\n"
                + "<img src=\"https://system.na2.netsuite.com/core/media/media.nl?id=3583&c=4890821&h=8dca27f2eedc57f9d2a1\" style=\"margin-top:20%;width:40px;\" /></br>\n"
                + "<b style=\"margin-top:2%;color:#fff\">"
                + "Customer data not editable at this stage. Please try again later." + "</b>\n" + "</div>";

            document.body.insertAdjacentHTML('beforeend', htmlText);
        } else {

            var suiteletUrl = `https://5112262.app.netsuite.com/app/site/hosting/scriptlet.nl?script=606&deploy=1&CUSTOMER_ID=${currRec.getValue(
                'nameorig'
                // 'entityid' //Behaviour is different on different browser
            )}` // Replace with the actual Suitelet URL

            // Make a request to the Suitelet
            fetch(suiteletUrl)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    // Set field values using the fetched data
                    // console.log("Date1",moment(data.DUMMY_DATE1,"YYYY-MM-DD").format("DD/MM/YYYY"))
                    jQuery(
                        document.querySelector(
                            '#main_form > table > tbody > tr:nth-child(1) > td > div > div.uir-page-title-secondline > div.uir-record-id'
                        )
                    ).text(data.CUSTOMER_ID + ' ' + data.FIRST_NAME + ' ' + data.LAST_NAME)
                    // currRec.setValue({ fieldId: 'altname', value: data.FIRST_NAME + ' ' + data.LAST_NAME })
                    if (data.FIRST_NAME) currRec.setValue({ fieldId: 'firstname', value: data.FIRST_NAME })
                    if (data.LAST_NAME) currRec.setValue({ fieldId: 'lastname', value: data.LAST_NAME })
                    if (data.SALUTATION) currRec.setValue({ fieldId: 'salutation', value: data.SALUTATION })
                    if (data.BIRTHDAY_MONTH)
                        currRec.setValue({ fieldId: 'custentity_iv_cl_birthday', value: data.BIRTHDAY_MONTH })
                    if (data.AGE) currRec.setValue({ fieldId: 'custentity_iv_cl_age', value: data.AGE })
                    if (data.EMAIL) currRec.setValue({ fieldId: 'email', value: data.EMAIL })
                    if (data.REFERRAL_REFERENCE)
                        currRec.setValue({ fieldId: 'custentity_iv_referral_reference', value: data.REFERRAL_REFERENCE })
                    if (data.MARKETING_PROMOTE)
                        currRec.setValue({
                            fieldId: 'custentity_iv_marketing_promotion_info',
                            value: data.MARKETING_PROMOTE,
                        })
                    if (data.TC) currRec.setValue({ fieldId: 'custentity_iv_customer_data_policy', value: data.TC })
                    // if (data.MEMBER_TYPE)
                    //     currRec.setValue({ fieldId: 'custentity_iv_cl_member_type', value: data.MEMBER_TYPE })
                    if (data.DISTRICT) currRec.setValue({ fieldId: 'custentity_iv_district', value: data.DISTRICT })
                    if (data.DUMMY_TEXT1)
                        currRec.setValue({ fieldId: 'custentity_iv_dummy_text1', value: data.DUMMY_TEXT1 })
                    if (data.DUMMY_DATE1)
                        currRec.setText({
                            fieldId: 'custentity_iv_dummy_date1',
                            text: moment(data.DUMMY_DATE1, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                        })
                    if (data.DUMMY_DATE2)
                        currRec.setText({
                            fieldId: 'custentity_iv_dummy_date2',
                            text: moment(data.DUMMY_DATE2, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                        })

                    if (data.D_LANG) currRec.setText({ fieldId: 'custentity_iv_default_language', text: data.D_LANG })
                    if (data.REGISTRATION_DATE)
                        currRec.setValue({
                            fieldId: 'custentity_iv_registration_date',
                            value: moment(data.REGISTRATION_DATE, 'YYYY-MM-DD').toDate(),
                        })
                    if (data.RESIDENTIAL_REGION)
                        currRec.setText({ fieldId: 'custentity_iv_residential_region', text: data.RESIDENTIAL_REGION })
                    if (data.PHONE) currRec.setValue({ fieldId: 'phone', value: data.PHONE })
                    if (data.INTERESTED_PRODUCT)
                        currRec.setText({
                            fieldId: 'custentity_iv_interested_products',
                            text: data.INTERESTED_PRODUCT.split(',').join('\u0005'),
                        })
                    console.log('data.INTERESTED_PRODUCT', data.INTERESTED_PRODUCT)
                    // if (data.EFFECTIVE_DATE)
                    //     currRec.setText({
                    //         fieldId: 'custentity_iv_cl_effective_date',
                    //         text: moment(data.EFFECTIVE_DATE).format('DD/MM/YYYY'),
                    //     })
                    // if (data.WELCOME_GIFT_DATE)
                    //     currRec.setText({
                    //         fieldId: 'custentity_iv_welcome_gift_provision_day',
                    //         text: moment(data.WELCOME_GIFT_DATE).format('DD/MM/YYYY'),
                    //     })
                    if (data.EFFECTIVE_TO)
                        currRec.setText({
                            fieldId: 'custentity_iv_cl_effective_to',
                            text: moment(data.EFFECTIVE_TO, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                        })
                    document.getElementById('cutomerModel').remove();
                    return true
                })
                .catch(function (error) {
                    console.error('Error:', error)
                })
        }
    }
    // let cnCustomerValue = {
    //         firstname: customerData.FIRST_NAME,//
    //         lastname: customerData.LAST_NAME,//
    //         salutation: customerData.SALUTATION, //
    //         custentity_iv_cl_birthday: customerData.BIRTHDAY_MONTH, //
    //         custentity_iv_cl_age: customerData.AGE,//
    //         phone: customerData.PHONE,//
    //         email: customerData.EMAIL,//
    //         // custentity_iv_default_language: customerData.DEFAULT_LANGUAGE,
    //         // custentity_iv_interested_products: customerData.INTERESTED_PRODUCT,
    //         // custentity_iv_registration_date: customerData.REGISTRATION_DATE,
    //         // custentity_iv_residential_region: customerData.RESIDENTIAL_REGION,
    //         // custentity_iv_cl_effective_date: customerData.EFFECTIVE_DATE,
    //         // custentity_iv_cl_effective_to: customerData.EFFECTIVE_TO,
    //         // custentity_iv_welcome_gift_provision_day: customerData.WELCOME_GIFT_DATE,
    //         custentity_iv_referral_reference: customerData.REFERRAL_REFERENCE,//
    //         custentity_iv_marketing_promotion_info: customerData.MARKETING_PROMOTE,//
    //         custentity_iv_customer_data_policy: customerData.TC,//
    //         custentity_iv_cl_member_type: customerData.MEMBER_TYPE,//
    //         custentity_iv_district: customerData.DISTRICT,//
    //         custentity_iv_dummy_text1: customerData.DUMMY_TEXT1,//
    //         custentity_iv_dummy_date1: customerData.DUMMY_DATE1,//
    //         custentity_iv_dummy_date2: customerData.DUMMY_DATE2,//

    //     }
    function saveRecord(context) { }

    function validateField(context) { }

    function fieldChanged(context) { }

    function postSourcing(context) { }

    function lineInit(context) { }

    function validateDelete(context) { }

    function validateInsert(context) { }

    function validateLine(context) { }

    function sublistChanged(context) { }

    return {
        pageInit: pageInit,
        // saveRecord: saveRecord,
        // validateField: validateField,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
})
