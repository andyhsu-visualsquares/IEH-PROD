/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class TemporaryCustomer {
        constructor({
            CUSTOMER_ID,
            INTERNAL_ID,
            FIRST_NAME,
            LAST_NAME,
            SALUTATION,
            BIRTHDAY_MONTH,
            AGE,
            AREA_CODE,
            PHONE,
            EMAIL,
            DEFAULT_LANGUAGE,
            INTERESTED_PRODUCT,
            REGISTRATION_DATE,
            RESIDENTIAL_REGION,
            DISTRICT,
            REFERRAL_REFERENCE,
            MARKETING_PROMOTE,
            TC,
            TRANS_ID,
            DUMMY_DATE1,
            DUMMY_DATE2,
            DUMMY_TEXT1,
            CHINA_DB_WORKFLOW,
            SHOPIFY_WORKFLOW,
        }) {
            this.CUSTOMER_ID = CUSTOMER_ID
            this.INTERNAL_ID = INTERNAL_ID
            this.FIRST_NAME = FIRST_NAME
            this.LAST_NAME = LAST_NAME
            this.SALUTATION = SALUTATION
            this.BIRTHDAY_MONTH = BIRTHDAY_MONTH
            this.AGE = AGE
            this.AREA_CODE = AREA_CODE
            this.PHONE = PHONE
            this.EMAIL = EMAIL
            this.DEFAULT_LANGUAGE = DEFAULT_LANGUAGE
            this.INTERESTED_PRODUCT = INTERESTED_PRODUCT
            this.REGISTRATION_DATE = REGISTRATION_DATE
            this.RESIDENTIAL_REGION = RESIDENTIAL_REGION
            this.DISTRICT = DISTRICT
            this.REFERRAL_REFERENCE = REFERRAL_REFERENCE
            this.MARKETING_PROMOTE = MARKETING_PROMOTE
            this.TC = TC
            this.TRANS_ID = TRANS_ID
            this.DUMMY_DATE1 = DUMMY_DATE1
            this.DUMMY_DATE2 = DUMMY_DATE2
            this.DUMMY_TEXT1 = DUMMY_TEXT1
            this.CHINA_DB_WORKFLOW = CHINA_DB_WORKFLOW
            this.SHOPIFY_WORKFLOW = SHOPIFY_WORKFLOW
        }
    }
    return TemporaryCustomer
})
