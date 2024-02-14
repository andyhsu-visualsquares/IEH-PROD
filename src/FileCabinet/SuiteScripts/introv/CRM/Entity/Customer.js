/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class Customer {
        constructor({
            INTERNAL_ID,
            CUSTOMER_ID,
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
            EFFECTIVE_DATE,
            EFFECTIVE_TO,
            WELCOME_GIFT_DATE,
            POINT_BALANCE,
            ADDRESS,
            REFERRAL_REFERENCE,
            MARKETING_PROMOTE,
            TC,
            REMARKS,
            MEMBER_TYPE,
            MEMBER_TYPE_EXPIRY_DATE,
            POINT_SUMMARY,
            CUMULATIVE_AMT,
            SPENDING_TO,
            SPENDING_SENTENCE,
            STATUS_CODE,
            MESSAGE,
            ENCRYPTED_ID,
            DECRYPTED_ID,
            DISTRICT,
            DUMMY_TEXT1,
            DUMMY_TEXT2,
            DUMMY_DATE1,
            DUMMY_DATE2,
            IS_CHINA_CUSTOMER,
            MERGE_POINT_BALANCE,
            INACTIVE,
            MERGED
        }) {
            this.INTERNAL_ID = INTERNAL_ID
            this.CUSTOMER_ID = CUSTOMER_ID
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
            this.EFFECTIVE_DATE = EFFECTIVE_DATE
            this.EFFECTIVE_TO = EFFECTIVE_TO
            this.WELCOME_GIFT_DATE = WELCOME_GIFT_DATE
            this.POINT_BALANCE = POINT_BALANCE
            this.ADDRESS = ADDRESS
            this.REFERRAL_REFERENCE = REFERRAL_REFERENCE
            this.MARKETING_PROMOTE = MARKETING_PROMOTE
            this.TC = TC
            this.REMARKS = REMARKS
            this.MEMBER_TYPE = MEMBER_TYPE
            this.MEMBER_TYPE_EXPIRY_DATE = MEMBER_TYPE_EXPIRY_DATE
            this.POINT_SUMMARY = POINT_SUMMARY
            this.CUMULATIVE_AMT = CUMULATIVE_AMT
            this.SPENDING_TO = SPENDING_TO
            this.SPENDING_SENTENCE = SPENDING_SENTENCE
            this.STATUS_CODE = STATUS_CODE
            this.MESSAGE = MESSAGE
            this.ENCRYPTED_ID = ENCRYPTED_ID
            this.DECRYPTED_ID = DECRYPTED_ID
            this.DISTRICT = DISTRICT
            this.DUMMY_TEXT1 = DUMMY_TEXT1
            this.DUMMY_TEXT2 = DUMMY_TEXT2
            this.DUMMY_DATE1 = DUMMY_DATE1
            this.DUMMY_DATE2 = DUMMY_DATE2
            this.IS_CHINA_CUSTOMER = IS_CHINA_CUSTOMER
            this.MERGE_POINT_BALANCE = MERGE_POINT_BALANCE
            this.INACTIVE = INACTIVE
            this.MERGED = MERGED
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return Customer
})
