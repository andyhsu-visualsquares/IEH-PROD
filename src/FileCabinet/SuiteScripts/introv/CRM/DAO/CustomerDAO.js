/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([
    'N/search',
    'N/record',
    '../Entity/Customer',
    '../../utils/DateUtils',
    '../../utils/EncryptUtils',
    '../Constants/Constants',
], (search, record, Customer, DateUtils, EncryptUtils, Constants) => {
    class CustomerDAO {
        constructor() {
            this.dateFormatter = new DateUtils()
        }

        findByKey({ id, email, phone }, checkingForCreation, areaCode) {
            const filters = [['isperson', 'is', 'T'], 'AND', ['isinactive', 'is', 'F']]
            //Escape Member & Reg Date checking on Creation Duplication Check, will check on Services
            if (!checkingForCreation)
                filters.push('AND', ['custentity_iv_cl_member_type', 'noneof', '@NONE@'], 'AND', [
                    'custentity_iv_registration_date',
                    'isnotempty',
                    '',
                ])
            if (id && !isNaN(Number(id))) {
                filters.push('AND', ['internalid', 'anyof', id])
            } else if (email && phone) {
                filters.push('AND', [
                    ['custentity_iv_full_phone_number', 'is', areaCode ? areaCode + phone : phone],
                    'OR',
                    ['email', 'is', email],
                    'OR',
                    ['phone', 'is', phone],
                ])
            } else if (email) {
                filters.push('AND', ['email', 'is', email])
            } else if (phone) {
                filters.push('AND', [
                    ['custentity_iv_full_phone_number', 'is', areaCode ? areaCode + phone : phone],
                    'OR',
                    ['phone', 'is', phone],
                ])
            }
            log.debug('FiltersOnfindByKey', filters)
            let customer = null

            const customerSearchColInternalId = search.createColumn({ name: 'internalid' })
            const customerSearchColFirstName = search.createColumn({ name: 'firstname' })
            const customerSearchColMiddleName = search.createColumn({ name: 'middlename' })
            const customerSearchColLastName = search.createColumn({ name: 'lastname' })
            const customerSearchColSalutation = search.createColumn({ name: 'salutation' })
            const customerSearchColBirthdayMonth = search.createColumn({ name: 'custentity_iv_cl_birthday' })
            const customerSearchColAge = search.createColumn({ name: 'custentity_iv_cl_age' })
            const customerSearchColMobilePhone = search.createColumn({ name: 'phone' })
            const customerSearchColEmail = search.createColumn({ name: 'email' })
            const customerSearchColDefaultLanguage = search.createColumn({ name: 'custentity_iv_default_language' })
            const customerSearchColInterestedProducts = search.createColumn({
                name: 'custentity_iv_interested_products',
            })
            const customerSearchColRegistrationDate = search.createColumn({ name: 'custentity_iv_registration_date' })
            const customerSearchColResidentialRegion = search.createColumn({ name: 'custentity_iv_residential_region' })
            const customerSearchColEffectiveDate = search.createColumn({ name: 'custentity_iv_cl_effective_date' })
            const customerSearchColEffectiveTo = search.createColumn({ name: 'custentity_iv_cl_effective_to' })
            const customerSearchColWelcomeGiftProvisioningDate = search.createColumn({
                name: 'custentity_iv_welcome_gift_provision_day',
            })
            const customerSearchColOutstandingPoints = search.createColumn({
                name: 'custentity_iv_cl_outstanding_points',
            })
            const customerSearchColReferralReference = search.createColumn({ name: 'custentity_iv_referral_reference' })
            const customerSearchColAcceptMarketingPromotionInformation = search.createColumn({
                name: 'custentity_iv_marketing_promotion_info',
            })
            const customerSearchColAcceptTcAndCustomerDataPrivacyPolicy = search.createColumn({
                name: 'custentity_iv_customer_data_policy',
            })
            const customerSearchColMemberType = search.createColumn({ name: 'custentity_iv_cl_member_type' })
            const customerSearchColNameInSimplifiedChinese = search.createColumn({
                name: 'custrecord_iv_schinese_name',
                join: 'CUSTENTITY_IV_CL_MEMBER_TYPE',
            })
            const customerSearchColNameInTraditionalChinese = search.createColumn({
                name: 'custrecord_iv_tchinese_name',
                join: 'CUSTENTITY_IV_CL_MEMBER_TYPE',
            })
            const customerSearchColId = search.createColumn({ name: 'entityid', sort: search.Sort.ASC })
            const customerSearchColComments = search.createColumn({ name: 'comments' })
            const customerSearchColAreaCode = search.createColumn({ name: 'custentity_iv_customer_areacode' })
            const customerSearchColAddress1 = search.createColumn({ name: 'address1' })
            const customerSearchColDistrict = search.createColumn({ name: 'custentity_iv_district' })
            const customerSearchColDummyDate1 = search.createColumn({ name: 'custentity_iv_dummy_date1' })
            const customerSearchColDummyDate2 = search.createColumn({ name: 'custentity_iv_dummy_date2' })
            const customerSearchColDummyText1 = search.createColumn({ name: 'custentity_iv_dummy_text1' })
            const customerSearchColIsChina = search.createColumn({ name: 'custentity_iv_ischina' })
            const customerSearchColMergePointBalance = search.createColumn({
                name: 'custentity_iv_customer_merge_pt_bal',
            })
            const customerSearchColInactive = search.createColumn({ name: 'isinactive' })
            const customerSearchColMerged = search.createColumn({ name: 'custentity_iv_merged' })

            if ((id && !isNaN(Number(id))) || email || phone) {
                log.debug('2')
                const customerSearch = search.create({
                    type: 'customer',
                    filters,
                    columns: [
                        customerSearchColInternalId,
                        customerSearchColFirstName,
                        customerSearchColMiddleName,
                        customerSearchColLastName,
                        customerSearchColSalutation,
                        customerSearchColBirthdayMonth,
                        customerSearchColAge,
                        customerSearchColMobilePhone,
                        customerSearchColEmail,
                        customerSearchColDefaultLanguage,
                        customerSearchColInterestedProducts,
                        customerSearchColRegistrationDate,
                        customerSearchColResidentialRegion,
                        customerSearchColEffectiveDate,
                        customerSearchColEffectiveTo,
                        customerSearchColWelcomeGiftProvisioningDate,
                        customerSearchColOutstandingPoints,
                        customerSearchColReferralReference,
                        customerSearchColAcceptMarketingPromotionInformation,
                        customerSearchColAcceptTcAndCustomerDataPrivacyPolicy,
                        customerSearchColMemberType,
                        customerSearchColNameInSimplifiedChinese,
                        customerSearchColNameInTraditionalChinese,
                        customerSearchColId,
                        customerSearchColComments,
                        customerSearchColAreaCode,
                        customerSearchColAddress1,
                        customerSearchColDistrict,
                        customerSearchColDummyDate1,
                        customerSearchColDummyDate2,
                        customerSearchColDummyText1,
                        customerSearchColIsChina,
                        customerSearchColMergePointBalance,
                        customerSearchColInactive,
                        customerSearchColMerged,
                    ],
                })
                log.debug('search length', customerSearch.runPaged().count)

                const customerSearchPagedData = customerSearch.runPaged({ pageSize: 1000 })
                for (let i = 0; i < customerSearchPagedData.pageRanges.length; i++) {
                    const customerSearchPage = customerSearchPagedData.fetch({ index: i })
                    customerSearchPage.data.forEach((result) => {
                        const internalId = result.getValue(customerSearchColInternalId)
                        const firstName = result.getValue(customerSearchColFirstName)
                        const middleName = result.getValue(customerSearchColMiddleName)
                        const lastName = result.getValue(customerSearchColLastName)
                        const salutation = result.getValue(customerSearchColSalutation)
                        const birthdayMonth = result.getValue(customerSearchColBirthdayMonth)
                        const age = result.getValue(customerSearchColAge)
                        const mobilePhone = result.getValue(customerSearchColMobilePhone)
                        const email = result.getValue(customerSearchColEmail)
                        const defaultLanguage = result.getText(customerSearchColDefaultLanguage)
                        const interestedProducts = result.getValue(customerSearchColInterestedProducts)
                        const registrationDate = result.getValue(customerSearchColRegistrationDate)
                        const residentialRegion = result.getText(customerSearchColResidentialRegion)
                        const effectiveDate = result.getValue(customerSearchColEffectiveDate)
                        const effectiveTo = result.getValue(customerSearchColEffectiveTo)
                        const welcomeGiftProvisioningDate = result.getValue(
                            customerSearchColWelcomeGiftProvisioningDate
                        )
                        const outstandingPoints = result.getValue(customerSearchColOutstandingPoints)
                        const referralReference = result.getValue(customerSearchColReferralReference)
                        const acceptMarketingPromotionInformation = result.getValue(
                            customerSearchColAcceptMarketingPromotionInformation
                        )
                        const acceptTcAndCustomerDataPrivacyPolicy = result.getValue(
                            customerSearchColAcceptTcAndCustomerDataPrivacyPolicy
                        )
                        const memberType = result.getText(customerSearchColMemberType)
                        const memberTypeSC = result.getValue(customerSearchColNameInSimplifiedChinese)
                        const memberTypeTC = result.getValue(customerSearchColNameInTraditionalChinese)
                        const memberTypeId = result.getValue(customerSearchColMemberType)
                        const id = result.getValue(customerSearchColId)
                        const comments = result.getValue(customerSearchColComments)
                        const areaCode = result.getText(customerSearchColAreaCode)
                        const address = result.getValue(customerSearchColAddress1)
                        const district = result.getValue(customerSearchColDistrict)
                        const dummyDate1 = result.getValue(customerSearchColDummyDate1)
                        const dummyDate2 = result.getValue(customerSearchColDummyDate2)
                        const dummyText1 = result.getValue(customerSearchColDummyText1)
                        const isChina = result.getValue(customerSearchColIsChina)
                        const mergePointBalance = result.getValue(customerSearchColMergePointBalance)
                        const inactive = result.getValue(customerSearchColInactive)
                        const merged = result.getValue(customerSearchColMerged)
                        // log.debug('inactive', inactive)
                        log.debug('4')

                        customer = new Customer({
                            INTERNAL_ID: parseInt(internalId),
                            CUSTOMER_ID: id,
                            FIRST_NAME: firstName,
                            LAST_NAME: lastName,
                            SALUTATION: salutation,
                            BIRTHDAY_MONTH: parseInt(birthdayMonth),
                            AGE: parseInt(age),
                            PHONE: mobilePhone,
                            EMAIL: email,
                            DEFAULT_LANGUAGE: defaultLanguage,
                            INTERESTED_PRODUCT: interestedProducts,
                            REGISTRATION_DATE: this.dateFormatter.dateTimeStringToInputFormat(registrationDate),
                            RESIDENTIAL_REGION: residentialRegion,
                            EFFECTIVE_DATE: this.dateFormatter.dateStringToInputFormat(effectiveDate),
                            EFFECTIVE_TO: this.dateFormatter.dateStringToInputFormat(effectiveTo),
                            WELCOME_GIFT_DATE: this.dateFormatter.dateStringToInputFormat(welcomeGiftProvisioningDate),
                            POINT_BALANCE: outstandingPoints,
                            REFERRAL_REFERENCE: referralReference,
                            MARKETING_PROMOTE: acceptMarketingPromotionInformation,
                            TC: acceptTcAndCustomerDataPrivacyPolicy,
                            REMARKS: comments,
                            MEMBER_TYPE: {
                                EN: memberType,
                                TC: memberTypeTC,
                                SC: memberTypeSC,
                            },
                            AREA_CODE: areaCode,
                            ADDRESS: address,
                            DISTRICT: district,
                            DUMMY_TEXT1: dummyText1,
                            DUMMY_DATE1: dummyDate1,
                            DUMMY_DATE2: dummyDate2,
                            IS_CHINA_CUSTOMER: isChina,
                            MERGE_POINT_BALANCE: mergePointBalance,
                            INACTIVE: inactive,
                            MERGED: merged,
                        })
                    })
                }
            } else if (id && isNaN(Number(id)) && !email && !phone) {
                log.debug('5')
                customer = []
            }

            return customer
        }

        findByKeyOnStaging({ id, email, phone }) {
            const filters = [['isinactive', 'is', 'F']]
            if (id) {
                filters.push('AND', ['custrecord_iv_temp_customer_internal_id', 'is', id])
            } else if (email && phone) {
                filters.push('AND', [
                    ['custrecord_iv_temp_email', 'is', email],
                    'OR',
                    ['custrecord_iv_temp_phone', 'is', phone],
                ])
            } else if (email) {
                filters.push('AND', ['custrecord_iv_temp_email', 'is', email])
            } else if (phone) {
                filters.push('AND', [['custrecord_iv_temp_phone', 'is', phone]])
            }
            let customer = null

            const customerSearchColInternalId = search.createColumn({ name: 'custrecord_iv_temp_customer_internal_id' })
            const customerSearchColFirstName = search.createColumn({ name: 'custrecord_iv_temp_first_name' })
            const customerSearchColLastName = search.createColumn({ name: 'custrecord_iv_temp_last_name' })
            const customerSearchColSalutation = search.createColumn({ name: 'custrecord_iv_temp_salutation' })
            const customerSearchColBirthdayMonth = search.createColumn({ name: 'custrecord_iv_temp_birthday_month' })
            const customerSearchColAge = search.createColumn({ name: 'custrecord_iv_temp_age' })
            const customerSearchColMobilePhone = search.createColumn({ name: 'custrecord_iv_temp_phone' })
            const customerSearchColEmail = search.createColumn({ name: 'custrecord_iv_temp_email' })
            const customerSearchColDefaultLanguage = search.createColumn({
                name: 'custrecord_iv_temp_default_language',
            })
            const customerSearchColInterestedProducts = search.createColumn({
                name: 'custrecord_iv_temp_interested_product',
            })
            const customerSearchColRegistrationDate = search.createColumn({
                name: 'custrecord_iv_temp_registration_date',
            })
            const customerSearchColResidentialRegion = search.createColumn({
                name: 'custrecord_iv_temp_residential_region',
            })
            const customerSearchColEffectiveDate = search.createColumn({ name: 'custrecord_iv_temp_effective_date' })
            const customerSearchColEffectiveTo = search.createColumn({ name: 'custrecord_iv_temp_effective_to_date' })
            const customerSearchColWelcomeGiftProvisioningDate = search.createColumn({
                name: 'custrecord_iv_temp_welcome_gift_date',
            })
            const customerSearchColReferralReference = search.createColumn({
                name: 'custrecord_iv_temp_referral_reference',
            })
            const customerSearchColAcceptMarketingPromotionInformation = search.createColumn({
                name: 'custrecord_iv_temp_marketing_promot',
            })
            const customerSearchColAcceptTcAndCustomerDataPrivacyPolicy = search.createColumn({
                name: 'custrecord_iv_temp_tc',
            })
            const customerSearchColId = search.createColumn({ name: 'name', sort: search.Sort.ASC })
            // const customerSearchColComments = search.createColumn({ name: 'comments' })
            const customerSearchColAreaCode = search.createColumn({ name: 'custrecord_iv_temp_area_code' })
            const customerSearchColDistrict = search.createColumn({ name: 'custrecord_iv_temp_district' })
            const customerSearchColDummyDate1 = search.createColumn({ name: 'custrecord_iv_temp_dummy_date1' })
            const customerSearchColDummyDate2 = search.createColumn({ name: 'custrecord_iv_temp_dummy_date2' })
            const customerSearchColDummyText1 = search.createColumn({ name: 'custrecord_iv_temp_dummy_text1' })

            const customerSearch = search.create({
                type: 'customrecord_iv_temp_china_customer',
                filters,
                columns: [
                    customerSearchColInternalId,
                    customerSearchColFirstName,
                    customerSearchColLastName,
                    customerSearchColSalutation,
                    customerSearchColBirthdayMonth,
                    customerSearchColAge,
                    customerSearchColMobilePhone,
                    customerSearchColEmail,
                    customerSearchColDefaultLanguage,
                    customerSearchColInterestedProducts,
                    customerSearchColRegistrationDate,
                    customerSearchColResidentialRegion,
                    customerSearchColEffectiveDate,
                    customerSearchColEffectiveTo,
                    customerSearchColWelcomeGiftProvisioningDate,
                    customerSearchColReferralReference,
                    customerSearchColAcceptMarketingPromotionInformation,
                    customerSearchColAcceptTcAndCustomerDataPrivacyPolicy,
                    customerSearchColId,
                    customerSearchColAreaCode,
                    customerSearchColDistrict,
                    customerSearchColDummyDate1,
                    customerSearchColDummyDate2,
                    customerSearchColDummyText1,
                ],
            })

            const customerSearchPagedData = customerSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customerSearchPagedData.pageRanges.length; i++) {
                const customerSearchPage = customerSearchPagedData.fetch({ index: i })
                customerSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customerSearchColInternalId)
                    const firstName = result.getValue(customerSearchColFirstName)
                    const lastName = result.getValue(customerSearchColLastName)
                    const salutation = result.getValue(customerSearchColSalutation)
                    const birthdayMonth = result.getValue(customerSearchColBirthdayMonth)
                    const age = result.getValue(customerSearchColAge)
                    const mobilePhone = result.getValue(customerSearchColMobilePhone)
                    const email = result.getValue(customerSearchColEmail)
                    const defaultLanguage = result.getValue(customerSearchColDefaultLanguage)
                    const interestedProducts = result.getValue(customerSearchColInterestedProducts)
                    const registrationDate = result.getValue(customerSearchColRegistrationDate)
                    const residentialRegion = result.getValue(customerSearchColResidentialRegion)
                    const effectiveDate = result.getValue(customerSearchColEffectiveDate)
                    const effectiveTo = result.getValue(customerSearchColEffectiveTo)
                    const welcomeGiftProvisioningDate = result.getValue(customerSearchColWelcomeGiftProvisioningDate)
                    const referralReference = result.getValue(customerSearchColReferralReference)
                    const acceptMarketingPromotionInformation = result.getValue(
                        customerSearchColAcceptMarketingPromotionInformation
                    )
                    const acceptTcAndCustomerDataPrivacyPolicy = result.getValue(
                        customerSearchColAcceptTcAndCustomerDataPrivacyPolicy
                    )
                    const id = result.getValue(customerSearchColId)
                    const areaCode = result.getValue(customerSearchColAreaCode)
                    const district = result.getValue(customerSearchColDistrict)
                    const dummyDate1 = result.getValue(customerSearchColDummyDate1)
                    const dummyDate2 = result.getValue(customerSearchColDummyDate2)
                    const dummyText1 = result.getValue(customerSearchColDummyText1)

                    customer = new Customer({
                        INTERNAL_ID: parseInt(internalId),
                        CUSTOMER_ID: id,
                        FIRST_NAME: firstName,
                        LAST_NAME: lastName,
                        SALUTATION: salutation,
                        BIRTHDAY_MONTH: parseInt(birthdayMonth),
                        AGE: parseInt(age),
                        PHONE: mobilePhone,
                        EMAIL: email,
                        DEFAULT_LANGUAGE: defaultLanguage,
                        INTERESTED_PRODUCT: interestedProducts,
                        REGISTRATION_DATE: registrationDate,
                        RESIDENTIAL_REGION: residentialRegion,
                        EFFECTIVE_DATE: this.dateFormatter.dateStringToInputFormat(effectiveDate),
                        EFFECTIVE_TO: this.dateFormatter.dateStringToInputFormat(effectiveTo),
                        WELCOME_GIFT_DATE: this.dateFormatter.dateStringToInputFormat(welcomeGiftProvisioningDate),
                        REFERRAL_REFERENCE: referralReference,
                        MARKETING_PROMOTE: acceptMarketingPromotionInformation,
                        TC: acceptTcAndCustomerDataPrivacyPolicy,
                        AREA_CODE: areaCode,
                        DISTRICT: district,
                        DUMMY_TEXT1: dummyText1,
                        DUMMY_DATE1: dummyDate1,
                        DUMMY_DATE2: dummyDate2,
                    })
                })
            }
            return customer
        }

        create(customerInfo) {
            const customer = record.create({
                type: record.Type.CUSTOMER,
                isDynamic: true,
            })

            customer.setValue('isperson', 'T')
            customer.setValue('firstname', customerInfo.FIRST_NAME)
            customer.setValue('lastname', customerInfo.LAST_NAME)
            customer.setValue('salutation', customerInfo.SALUTATION)
            customer.setValue('custentity_iv_cl_birthday', customerInfo.BIRTHDAY_MONTH)
            customer.setValue('custentity_iv_cl_age', customerInfo.AGE)
            customer.setValue('phone', customerInfo.PHONE)
            customer.setValue('email', customerInfo.EMAIL)
            customer.setText('custentity_iv_default_language', customerInfo.DEFAULT_LANGUAGE)
            customer.setText(
                'custentity_iv_registration_date',
                this.dateFormatter.dateTimeStringToNetsuite(customerInfo.REGISTRATION_DATE)
            )
            customer.setValue('custentity_iv_interested_products', customerInfo.INTERESTED_PRODUCT)
            customer.setText('custentity_iv_residential_region', customerInfo.RESIDENTIAL_REGION)
            customer.setText('custentity_iv_customer_areacode', customerInfo.AREA_CODE)
            customer.setText('custentity_iv_full_phone_number', customerInfo.FULL_PHONE)

            customer.setText(
                'custentity_iv_welcome_gift_provision_day',
                this.dateFormatter.convertDateTimeStringToNSDateString(customerInfo.REGISTRATION_DATE)
            )
            customer.setText(
                'custentity_iv_cl_effective_date',
                this.dateFormatter.convertDateTimeStringToNSDateString(customerInfo.REGISTRATION_DATE)
            )

            customer.setValue('custentity_iv_referral_reference', customerInfo.REFERRAL_REFERENCE)
            customer.setValue('custentity_iv_marketing_promotion_info', customerInfo.MARKETING_PROMOTE || false)
            customer.setValue('custentity_iv_customer_data_policy', customerInfo.TC || false)

            customer.setText(
                'custentity_iv_dummy_date1',
                this.dateFormatter.dateStringToNetsuite(customerInfo.DUMMY_DATE1)
            )
            customer.setText(
                'custentity_iv_dummy_date2',
                this.dateFormatter.dateStringToNetsuite(customerInfo.DUMMY_DATE2)
            )
            customer.setValue('custentity_iv_dummy_text1', customerInfo.DUMMY_TEXT1)
            customer.setValue('custentity_iv_dummy_text2', customerInfo.DUMMY_TEXT2)
            customer.setValue('custentity_iv_encrypted_id', customerInfo.TRANS_ID)
            customer.setValue('custentity_iv_decrypted_id', customerInfo.DECRYPTED_ID)

            customer.selectNewLine('addressbook')
            customer.setCurrentSublistValue({
                sublistId: 'addressbook',
                fieldId: 'label',
                value: 'Primary Address',
            })
            const addressRecord = customer.getCurrentSublistSubrecord({
                sublistId: 'addressbook',
                fieldId: 'addressbookaddress',
            })
            addressRecord.setValue({
                fieldId: 'addr1',
                value: customerInfo.DISTRICT,
            })
            customer.commitLine('addressbook')
            customer.setValue('custentity_iv_district', customerInfo.DISTRICT)

            customer.setValue('category', 2)
            customer.setValue('subsidiary', 10)
            customer.setValue('custentity_customer_sub_category', 10)
            customer.setValue('custentity_iv_cl_member_card', 2050610)
            customer.setValue('custentity_iv_cl_member_type', 1)
            customer.setValue('cseg1', 3)
            customer.selectNewLine({
                sublistId: 'submachine',
            })
            customer.setCurrentSublistValue({
                sublistId: 'submachine',
                fieldId: 'subsidiary',
                value: Constants.SUBSID.AIL,
            })
            customer.commitLine({
                sublistId: 'submachine',
            })

            //Put Internal ID into POSID Field
            let customerInternalID = customer.save()
            record.submitFields({
                type: record.Type.CUSTOMER,
                id: customerInternalID,
                values: {
                    custentityposid: customerInternalID,
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true,
                },
            })

            return customerInternalID
        }

        createEmptyIndividualCustomer(customerInfo) {
            const customer = record.create({
                type: record.Type.CUSTOMER,
                isDynamic: true,
            })

            customer.setValue('isperson', 'T')
            customer.setValue('firstname', 'China')
            customer.setValue('lastname', 'Individual')
            customer.setValue('custentity_iv_ischina', true)

            customer.setValue('category', 2)
            customer.setValue('subsidiary', 10)
            customer.setValue('custentity_customer_sub_category', 10)
            customer.setValue('custentity_iv_cl_member_card', 2050610)
            customer.setValue('custentity_iv_cl_member_type', 1)
            customer.setValue('email', customerInfo.EMAIL)
            customer.setValue('phone', customerInfo.PHONE)
            customer.setValue('custentity_iv_full_phone_number', customerInfo.FULL_PHONE)
            customer.setText('custentity_iv_customer_areacode', customerInfo.AREA_CODE)
            customer.setValue('cseg1', 3)

            customer.setText('custentity_iv_default_language', customerInfo.DEFAULT_LANGUAGE)
            customer.setValue('custentity_iv_marketing_promotion_info', customerInfo.MARKETING_PROMOTE || false)
            customer.setValue('custentity_iv_customer_data_policy', customerInfo.TC || false)
            log.debug(
                'customerInfo.INTERESTED_PRODUCT',
                JSON.stringify(customerInfo.INTERESTED_PRODUCT).replace(/[\[\]"]/g, '')
            )
            log.debug('customerInfo.INTERESTED_PRODUCT', customerInfo.INTERESTED_PRODUCT)
            customer.setText({
                fieldId: 'custentity_iv_interested_products',
                // text: JSON.stringify(customerInfo.INTERESTED_PRODUCT).replace(/[\[\]"]/g, '').split(',').join('\u0005'),
                text: customerInfo.INTERESTED_PRODUCT,
            })
            customer.setText(
                'custentity_iv_registration_date',
                this.dateFormatter.dateTimeStringToNetsuite(customerInfo.REGISTRATION_DATE)
            )
            customer.setText(
                'custentity_iv_cl_effective_date',
                this.dateFormatter.convertDateTimeStringToNSDateString(customerInfo.REGISTRATION_DATE)
            )
            customer.setText(
                'custentity_iv_welcome_gift_provision_day',
                this.dateFormatter.convertDateTimeStringToNSDateString(customerInfo.REGISTRATION_DATE)
            )
            customer.setValue('custentity_iv_encrypted_id', customerInfo.TRANS_ID)
            if (!_.isEmpty(customerInfo.TRANS_ID)) {
                // const encryptUtils = new EncryptUtils()
                // const decryptedId = encryptUtils.decryptTranId(customerInfo.TRANS_ID)
                customer.setValue('custentity_iv_decrypted_id', customerInfo.DECRYPTED_TRANS_ID)
            }
            customer.selectNewLine({ sublistId: 'submachine' })
            log.debug('New Subsidiary Line')
            customer.setCurrentSublistValue({
                sublistId: 'submachine',
                fieldId: 'subsidiary',
                value: 14,
            })
            customer.commitLine({ sublistId: 'submachine' })

            //Put Internal ID into POSID Field
            log.debug('Customer', customer)
            let customerInternalID = customer.save()
            record.submitFields({
                type: record.Type.CUSTOMER,
                id: customerInternalID,
                values: {
                    custentityposid: customerInternalID,
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true,
                },
            })

            return customerInternalID
        }

        findEntityIdByInternalId(internalId) {
            try {
                const { entityid } = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: internalId,
                    columns: ['entityid'],
                })
                return entityid
            } catch (error) {
                return -999
            }
        }

        update(customer, customerInfo, mergeStatus) {
            const customerRecord = record.load({
                type: record.Type.CUSTOMER,
                id: customer.INTERNAL_ID,
                isDynamic: true,
            })
            log.debug('customerInfo', customerInfo)

            if (mergeStatus === 'markMerged') {
                customerRecord.setValue('custentity_iv_merged', true)
                customerRecord.setValue('cseg1', 3)
                customerRecord.setValue('custentity_iv_cancel_reason', '')
                customerRecord.setValue('custentity_iv_cancel_member_date', '')
            }
            if (
                customerInfo.RESIDENTIAL_REGION.toLowerCase() === 'mainland' ||
                customerInfo.AREA_CODE.toString() === '86' ||
                customerInfo.AREA_CODE.toString() === '+86'
            )
                customerRecord.setValue('custentity_iv_ischina', true)
            customerRecord.setValue('isperson', 'T')
            customerRecord.setValue('firstname', customerInfo.FIRST_NAME)
            customerRecord.setValue('lastname', customerInfo.LAST_NAME)
            customerRecord.setValue('salutation', customerInfo.SALUTATION)
            customerRecord.setValue('custentity_iv_cl_birthday', customerInfo.BIRTHDAY_MONTH)
            customerRecord.setValue('custentity_iv_cl_age', customerInfo.AGE)
            customerRecord.setValue('phone', customerInfo.PHONE)
            customerRecord.setValue('email', customerInfo.EMAIL)
            customerRecord.setText('custentity_iv_default_language', customerInfo.DEFAULT_LANGUAGE)
            customerRecord.setText(
                'custentity_iv_registration_date',
                this.dateFormatter.dateTimeStringToNetsuite(customerInfo.REGISTRATION_DATE)
            )
            customerRecord.setValue('custentity_iv_interested_products', customerInfo.INTERESTED_PRODUCT)
            customerRecord.setText('custentity_iv_residential_region', customerInfo.RESIDENTIAL_REGION)
            // customerRecord.setText(
            //     'custentity_iv_welcome_gift_provision_day',
            //     this.dateFormatter.convertDateTimeStringToNSDateString(customerInfo.REGISTRATION_DATE)
            // )
            customerRecord.setText(
                'custentity_iv_cl_effective_date',
                this.dateFormatter.convertDateTimeStringToNSDateString(customerInfo.REGISTRATION_DATE)
            )
            customerRecord.setValue('custentity_iv_referral_reference', customerInfo.REFERRAL_REFERENCE)
            customerRecord.setValue('custentity_iv_marketing_promotion_info', customerInfo.MARKETING_PROMOTE || false)
            customerRecord.setValue('custentity_iv_customer_data_policy', customerInfo.TC || false)
            customerRecord.setValue('custentity_iv_encrypted_id', customerInfo.TRANS_ID)
            customerRecord.setValue('custentity_iv_decrypted_id', customerInfo.DECRYPTED_ID)
            customerRecord.setValue('comments', customerInfo.REMARKS)
            customerRecord.setText(
                'custentity_iv_dummy_date1',
                this.dateFormatter.dateStringToNetsuite(customerInfo.DUMMY_DATE1)
            )
            customerRecord.setText(
                'custentity_iv_dummy_date2',
                this.dateFormatter.dateStringToNetsuite(customerInfo.DUMMY_DATE2)
            )
            customerRecord.setValue('custentity_iv_dummy_text1', customerInfo.DUMMY_TEXT1)
            customerRecord.setValue('custentity_iv_dummy_text2', customerInfo.DUMMY_TEXT2)
            customerRecord.setValue('custentity_iv_encrypted_id', customerInfo.TRANS_ID)
            customerRecord.setValue('custentity_iv_decrypted_id', customerInfo.DECRYPTED_ID)

            customerRecord.setText('custentity_iv_customer_areacode', customerInfo.AREA_CODE)
            customerRecord.setText('custentity_iv_full_phone_number', customerInfo.FULL_PHONE)
            customerRecord.setValue('custentityposid', customer.INTERNAL_ID)

            customerRecord.selectNewLine('addressbook')
            customerRecord.setCurrentSublistValue({
                sublistId: 'addressbook',
                fieldId: 'label',
                value: 'Primary Address',
            })
            const addressRecord = customerRecord.getCurrentSublistSubrecord({
                sublistId: 'addressbook',
                fieldId: 'addressbookaddress',
            })
            addressRecord.setValue({
                fieldId: 'addr1',
                value: customerInfo.ADDRESS,
            })
            customerRecord.commitLine('addressbook')
            customerRecord.setValue('custentity_iv_district', customerInfo.DISTRICT)

            // customerRecord.setValue('isinactive', false)
            customerRecord.setValue('category', 2)
            let originalSubsid = customerRecord.getValue('subsidiary')
            if (!originalSubsid || originalSubsid == '') customerRecord.setValue('subsidiary', 10)
            customerRecord.setValue('custentity_customer_sub_category', 10)
            customerRecord.setValue('custentity_iv_cl_member_card', 2050610)
            customerRecord.setValue('custentity_iv_cl_member_type', 1)

            customerRecord.save()
            return customer
        }

        findCustomersByTransId(decryptTranId) {
            log.debug('decryptTranId', decryptTranId)
            const customers = []

            const customerSearchColInternalId = search.createColumn({ name: 'internalid' })
            const customerSearchColFirstName = search.createColumn({ name: 'firstname' })
            const customerSearchColMiddleName = search.createColumn({ name: 'middlename' })
            const customerSearchColLastName = search.createColumn({ name: 'lastname' })
            // const customerSearchColSalutation = search.createColumn({ name: 'salutation' })
            // const customerSearchColBirthdayMonth = search.createColumn({ name: 'custentity_iv_cl_birthday' })
            // const customerSearchColAge = search.createColumn({ name: 'custentity_iv_cl_age' })
            const customerSearchColMobilePhone = search.createColumn({ name: 'phone' })
            const customerSearchColEmail = search.createColumn({ name: 'email' })
            // const customerSearchColDefaultLanguage = search.createColumn({ name: 'custentity_iv_default_language' })
            // const customerSearchColInterestedProducts = search.createColumn({
            //     name: 'custentity_iv_interested_products',
            // })
            // const customerSearchColRegistrationDate = search.createColumn({ name: 'custentity_iv_registration_date' })
            // const customerSearchColResidentialRegion = search.createColumn({ name: 'custentity_iv_residential_region' })
            // const customerSearchColEffectiveDate = search.createColumn({ name: 'custentity_iv_cl_effective_date' })
            // const customerSearchColEffectiveTo = search.createColumn({ name: 'custentity_iv_cl_effective_to' })
            // const customerSearchColWelcomeGiftProvisioningDate = search.createColumn({
            //     name: 'custentity_iv_welcome_gift_provision_day',
            // })
            // const customerSearchColOutstandingPoints = search.createColumn({
            //     name: 'custentity_iv_cl_outstanding_points',
            // })
            // const customerSearchColReferralReference = search.createColumn({ name: 'custentity_iv_referral_reference' })
            // const customerSearchColAcceptMarketingPromotionInformation = search.createColumn({
            //     name: 'custentity_iv_marketing_promotion_info',
            // })
            // const customerSearchColAcceptTcAndCustomerDataPrivacyPolicy = search.createColumn({
            //     name: 'custentity_iv_customer_data_policy',
            // })
            // const customerSearchColMemberType = search.createColumn({ name: 'custentity_iv_cl_member_type' })
            // const customerSearchColNameInSimplifiedChinese = search.createColumn({
            //     name: 'custrecord_iv_schinese_name',
            //     join: 'CUSTENTITY_IV_CL_MEMBER_TYPE',
            // })
            // const customerSearchColNameInTraditionalChinese = search.createColumn({
            //     name: 'custrecord_iv_tchinese_name',
            //     join: 'CUSTENTITY_IV_CL_MEMBER_TYPE',
            // })
            // const customerSearchColId = search.createColumn({ name: 'entityid', sort: search.Sort.ASC })
            // const customerSearchColComments = search.createColumn({ name: 'comments' })
            // const customerSearchColAreaCode = search.createColumn({ name: 'custentity_iv_customer_areacode' })
            // const customerSearchColEncryptedId = search.createColumn({ name: 'custentity_iv_encrypted_id' })
            // const customerSearchColDecryptedId = search.createColumn({ name: 'custentity_iv_decrypted_id' })
            // const customerSearchColDummyDate1 = search.createColumn({ name: 'custentity_iv_dummy_date1' })
            // const customerSearchColDummyDate2 = search.createColumn({ name: 'custentity_iv_dummy_date2' })
            // const customerSearchColDummyText1 = search.createColumn({ name: 'custentity_iv_dummy_text1' })
            // const customerSearchColInactive = search.createColumn({ name: 'isinactive' })

            const customerSearch = search.create({
                type: 'customer',
                filters: [
                    // ['custentity_iv_encrypted_id', 'is', encryptedId || ''],
                    // 'AND',
                    ['custentity_iv_decrypted_id', 'is', decryptTranId],
                ],
                columns: [
                    customerSearchColInternalId,
                    customerSearchColFirstName,
                    customerSearchColMiddleName,
                    customerSearchColLastName,
                    // customerSearchColSalutation,
                    // customerSearchColBirthdayMonth,
                    // customerSearchColAge,
                    customerSearchColMobilePhone,
                    customerSearchColEmail,
                    // customerSearchColDefaultLanguage,
                    // customerSearchColInterestedProducts,
                    // customerSearchColRegistrationDate,
                    // customerSearchColResidentialRegion,
                    // customerSearchColEffectiveDate,
                    // customerSearchColEffectiveTo,
                    // customerSearchColWelcomeGiftProvisioningDate,
                    // customerSearchColOutstandingPoints,
                    // customerSearchColReferralReference,
                    // customerSearchColAcceptMarketingPromotionInformation,
                    // customerSearchColAcceptTcAndCustomerDataPrivacyPolicy,
                    // customerSearchColMemberType,
                    // customerSearchColNameInSimplifiedChinese,
                    // customerSearchColNameInTraditionalChinese,
                    // customerSearchColId,
                    // customerSearchColComments,
                    // customerSearchColAreaCode,
                    // customerSearchColEncryptedId,
                    // customerSearchColDecryptedId,
                    // customerSearchColDummyDate1,
                    // customerSearchColDummyDate2,
                    // customerSearchColDummyText1,
                    // customerSearchColInactive,
                ],
            })

            const customerSearchPagedData = customerSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customerSearchPagedData.pageRanges.length; i++) {
                const customerSearchPage = customerSearchPagedData.fetch({ index: i })
                customerSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customerSearchColInternalId)
                    const firstName = result.getValue(customerSearchColFirstName)
                    const middleName = result.getValue(customerSearchColMiddleName)
                    const lastName = result.getValue(customerSearchColLastName)
                    // const salutation = result.getValue(customerSearchColSalutation)
                    // const birthdayMonth = result.getValue(customerSearchColBirthdayMonth)
                    // const age = result.getValue(customerSearchColAge)
                    const mobilePhone = result.getValue(customerSearchColMobilePhone)
                    const email = result.getValue(customerSearchColEmail)
                    // const defaultLanguage = result.getText(customerSearchColDefaultLanguage)
                    // const interestedProducts = result.getValue(customerSearchColInterestedProducts)
                    // const registrationDate = result.getValue(customerSearchColRegistrationDate)
                    // const residentialRegion = result.getText(customerSearchColResidentialRegion)
                    // const effectiveDate = result.getValue(customerSearchColEffectiveDate)
                    // const effectiveTo = result.getValue(customerSearchColEffectiveTo)
                    // const welcomeGiftProvisioningDate = result.getValue(customerSearchColWelcomeGiftProvisioningDate)
                    // const outstandingPoints = result.getValue(customerSearchColOutstandingPoints)
                    // const referralReference = result.getValue(customerSearchColReferralReference)
                    // const acceptMarketingPromotionInformation = result.getValue(
                    //     customerSearchColAcceptMarketingPromotionInformation
                    // )
                    // const acceptTcAndCustomerDataPrivacyPolicy = result.getValue(
                    //     customerSearchColAcceptTcAndCustomerDataPrivacyPolicy
                    // )
                    // const memberType = result.getText(customerSearchColMemberType)
                    // const memberTypeSC = result.getValue(customerSearchColNameInSimplifiedChinese)
                    // const memberTypeTC = result.getValue(customerSearchColNameInTraditionalChinese)
                    // const memberTypeId = result.getValue(customerSearchColMemberType)
                    // const id = result.getValue(customerSearchColId)
                    // const comments = result.getValue(customerSearchColComments)
                    // const areaCode = result.getText(customerSearchColAreaCode)
                    // const encryptedId = result.getValue(customerSearchColEncryptedId)
                    // const decryptedId = result.getValue(customerSearchColDecryptedId)
                    // const dummyDate1 = result.getValue(customerSearchColDummyDate1)
                    // const dummyDate2 = result.getValue(customerSearchColDummyDate2)
                    // const dummyText1 = result.getValue(customerSearchColDummyText1)
                    // const inactive = result.getValue(customerSearchColInactive)

                    customers.push(
                        new Customer({
                            INTERNAL_ID: internalId,
                            // CUSTOMER_ID: id,
                            FIRST_NAME: firstName,
                            LAST_NAME: lastName,
                            // SALUTATION: salutation,
                            // BIRTHDAY_MONTH: parseInt(birthdayMonth),
                            // AGE: parseInt(age),
                            PHONE: mobilePhone,
                            EMAIL: email,
                            // DEFAULT_LANGUAGE: defaultLanguage,
                            // INTERESTED_PRODUCT: interestedProducts,
                            // REGISTRATION_DATE: this.dateFormatter.dateTimeStringToInputFormat(registrationDate),
                            // RESIDENTIAL_REGION: residentialRegion,
                            // EFFECTIVE_DATE: this.dateFormatter.dateStringToInputFormat(effectiveDate),
                            // EFFECTIVE_TO: this.dateFormatter.dateStringToInputFormat(effectiveTo),
                            // WELCOME_GIFT_DATE: this.dateFormatter.dateStringToInputFormat(welcomeGiftProvisioningDate),
                            // POINT_BALANCE: outstandingPoints,
                            // REFERRAL_REFERENCE: referralReference,
                            // MARKETING_PROMOTE: acceptMarketingPromotionInformation,
                            // TC: acceptTcAndCustomerDataPrivacyPolicy,
                            // REMARKS: comments,
                            // MEMBER_TYPE: {
                            //     EN: memberType,
                            //     TC: memberTypeTC,
                            //     SC: memberTypeSC,
                            // },
                            // AREA_CODE: parseInt(areaCode),
                            // ENCRYPTED_ID: encryptedId,
                            // DECRYPTED_ID: decryptedId,
                            // DUMMY_TEXT1: dummyText1,
                            // DUMMY_DATE1: dummyDate1,
                            // DUMMY_DATE2: dummyDate2,
                            // INACTIVE: inactive,
                        })
                    )
                })
            }

            return customers
        }

        /**
         *
         * @param {*} recPhone
         * @param {*} recEmail
         * @param {*} recId
         * @returns isDuplicated
         */
        duplicatCheck(recPhone, recEmail, recId) {
            var isDuplicatValid = true
            var validFilter = [['isinactive', 'is', 'F']]
            var tempFilter = []
            if (!!recPhone) {
                tempFilter.push(['phone', 'haskeywords', recPhone])
            }
            if (!!recEmail) {
                if (tempFilter.length > 0) tempFilter.push('OR')
                tempFilter.push(['email', 'is', recEmail])
            }
            if (!!recPhone || !!recEmail) {
                validFilter.push('AND')
                validFilter.push(tempFilter)
            }
            if (!!recId) {
                validFilter.push('AND')
                validFilter.push(['internalid', 'noneof', recId])
            }
            log.debug('validFilter', validFilter)
            var customerSearchResult = search
                .create({
                    type: 'customer',
                    filters: validFilter,
                    columns: [
                        search.createColumn({ name: 'internalid', sort: search.Sort.ASC }),
                        'custentity_iv_cl_member_type',
                        'custentity_iv_registration_date',
                    ],
                })
                .run()
                .getRange({ start: 0, end: 1000 })
            if (
                customerSearchResult.legnth > 0 &&
                (!!recPhone || !!recEmail) &&
                !_.isEmpty(customerSearchResult[0].getValue('custentity_iv_cl_member_type')) &&
                !_.isEmpty(customerSearchResult[0].getValue('custentity_iv_registration_date'))
            ) {
                isDuplicatValid = false
            }
            return isDuplicatValid
        }

        getAll() {}
    }

    return CustomerDAO
})
