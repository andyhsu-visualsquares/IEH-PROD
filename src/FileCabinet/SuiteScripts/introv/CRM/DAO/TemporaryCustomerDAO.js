/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/search', 'N/record', '../Entity/TemporaryCustomer', '../../utils/DateUtils', '../Constants/Constants'], (
    search,
    record,
    TemporaryCustomer,
    DateUtils,
    Constants
) => {
    class CustomerDAO {
        constructor() {
            this.dateFormatter = new DateUtils()
        }

        create(customerInfo, entityId, internalId) {
            log.debug("tempCustomerInfo", customerInfo)
            const temporaryCustomer = record.create({
                type: Constants.RECORD.TEMPORARY_CUSTOMER.TYPE,
                isDynamic: true,
            })

            temporaryCustomer.setValue('name', entityId)
            temporaryCustomer.setValue('custrecord_iv_temp_customer_internal_id', internalId)
            temporaryCustomer.setValue('custrecord_iv_temp_first_name', customerInfo.FIRST_NAME)
            temporaryCustomer.setValue('custrecord_iv_temp_last_name', customerInfo.LAST_NAME)
            temporaryCustomer.setValue('custrecord_iv_temp_salutation', customerInfo.SALUTATION)
            temporaryCustomer.setValue('custrecord_iv_temp_birthday_month', customerInfo.BIRTHDAY_MONTH)
            temporaryCustomer.setValue('custrecord_iv_temp_age', customerInfo.AGE)
            temporaryCustomer.setValue('custrecord_iv_temp_area_code', customerInfo.AREA_CODE)
            temporaryCustomer.setValue('custrecord_iv_temp_phone', customerInfo.PHONE)
            temporaryCustomer.setValue('custrecord_iv_temp_email', customerInfo.EMAIL)
            temporaryCustomer.setValue('custrecord_iv_temp_default_language', customerInfo.DEFAULT_LANGUAGE)
            temporaryCustomer.setText(
                'custrecord_iv_temp_interested_product',
                JSON.stringify(customerInfo.INTERESTED_PRODUCT).replace(/\[|\]|'/g, '')
            )
            temporaryCustomer.setValue('custrecord_iv_temp_registration_date', customerInfo.REGISTRATION_DATE)
            temporaryCustomer.setValue('custrecord_iv_temp_residential_region', customerInfo.RESIDENTIAL_REGION)
            temporaryCustomer.setValue('custrecord_iv_temp_welcome_gift_date', this.dateFormatter.convertDateTimeStringToNSDateString(customerInfo.REGISTRATION_DATE))
            temporaryCustomer.setValue('custrecord_iv_temp_effective_date', this.dateFormatter.convertDateTimeStringToNSDateString(customerInfo.REGISTRATION_DATE))

            temporaryCustomer.setValue('custrecord_iv_temp_effective_to_date', customerInfo.EFFECTIVE_TO_DATE)
            temporaryCustomer.setValue('custrecord_iv_temp_district', customerInfo.DISTRICT)
            temporaryCustomer.setValue('custrecord_iv_temp_referral_reference', customerInfo.REFERRAL_REFERENCE)
            temporaryCustomer.setValue('custrecord_iv_temp_marketing_promot', customerInfo.MARKETING_PROMOTE)
            temporaryCustomer.setValue('custrecord_iv_temp_tc', customerInfo.TC)
            temporaryCustomer.setValue('custrecord_iv_temp_trans_id', customerInfo.TRANS_ID)
            temporaryCustomer.setValue('custrecord_iv_temp_dummy_date1', customerInfo.DUMMY_DATE1)
            temporaryCustomer.setValue('custrecord_iv_temp_dummy_date2', customerInfo.DUMMY_DATE2)
            temporaryCustomer.setValue('custrecord_iv_temp_dummy_text1', customerInfo.DUMMY_TEXT1)
            temporaryCustomer.setValue('custrecord_iv_shopify_workflow', '1')
            temporaryCustomer.setValue('custrecord_iv_china_db_workflow', '1')

            return temporaryCustomer.save()
        }

        getAll() {
            const list = []

            const customrecord_iv_temp_china_customerSearchColInternalId = search.createColumn({ name: 'internalid' })
            const customrecord_iv_temp_china_customerSearchColAge = search.createColumn({
                name: 'custrecord_iv_temp_age',
            })
            const customrecord_iv_temp_china_customerSearchColAreaCode = search.createColumn({
                name: 'custrecord_iv_temp_area_code',
            })
            const customrecord_iv_temp_china_customerSearchColBirthdayMonth = search.createColumn({
                name: 'custrecord_iv_temp_birthday_month',
            })
            const customrecord_iv_temp_china_customerSearchColChinaDbWorkflow = search.createColumn({
                name: 'custrecord_iv_china_db_workflow',
            })
            const customrecord_iv_temp_china_customerSearchColDefaultLanguage = search.createColumn({
                name: 'custrecord_iv_temp_default_language',
            })
            const customrecord_iv_temp_china_customerSearchColDistrict = search.createColumn({
                name: 'custrecord_iv_temp_district',
            })
            const customrecord_iv_temp_china_customerSearchColDummyDate1 = search.createColumn({
                name: 'custrecord_iv_temp_dummy_date1',
            })
            const customrecord_iv_temp_china_customerSearchColDummyDate2 = search.createColumn({
                name: 'custrecord_iv_temp_dummy_date2',
            })
            const customrecord_iv_temp_china_customerSearchColDummyText1 = search.createColumn({
                name: 'custrecord_iv_temp_dummy_text1',
            })
            const customrecord_iv_temp_china_customerSearchColDummyText2 = search.createColumn({
                name: 'custrecord_iv_temp_dummy_text2',
            })
            const customrecord_iv_temp_china_customerSearchColEffectiveDate = search.createColumn({
                name: 'custrecord_iv_temp_effective_date',
            })
            const customrecord_iv_temp_china_customerSearchColEffectiveToDate = search.createColumn({
                name: 'custrecord_iv_temp_effective_to_date',
            })
            const customrecord_iv_temp_china_customerSearchColEmail = search.createColumn({
                name: 'custrecord_iv_temp_email',
            })
            const customrecord_iv_temp_china_customerSearchColFirstName = search.createColumn({
                name: 'custrecord_iv_temp_first_name',
            })
            const customrecord_iv_temp_china_customerSearchColInterestedProduct = search.createColumn({
                name: 'custrecord_iv_temp_interested_product',
            })
            const customrecord_iv_temp_china_customerSearchColInactive = search.createColumn({ name: 'isinactive' })
            const customrecord_iv_temp_china_customerSearchColLastName = search.createColumn({
                name: 'custrecord_iv_temp_last_name',
            })
            const customrecord_iv_temp_china_customerSearchColMarketingPromote = search.createColumn({
                name: 'custrecord_iv_temp_marketing_promot',
            })
            const customrecord_iv_temp_china_customerSearchColName = search.createColumn({
                name: 'name',
                sort: search.Sort.ASC,
            })
            const customrecord_iv_temp_china_customerSearchColPhone = search.createColumn({
                name: 'custrecord_iv_temp_phone',
            })
            const customrecord_iv_temp_china_customerSearchColReferralReference = search.createColumn({
                name: 'custrecord_iv_temp_referral_reference',
            })
            const customrecord_iv_temp_china_customerSearchColRegistrationDate = search.createColumn({
                name: 'custrecord_iv_temp_registration_date',
            })
            const customrecord_iv_temp_china_customerSearchColRemarks = search.createColumn({
                name: 'custrecord_iv_temp_remarks',
            })
            const customrecord_iv_temp_china_customerSearchColResidentialRegion = search.createColumn({
                name: 'custrecord_iv_temp_residential_region',
            })
            const customrecord_iv_temp_china_customerSearchColSalutation = search.createColumn({
                name: 'custrecord_iv_temp_salutation',
            })
            const customrecord_iv_temp_china_customerSearchColShopifyWorkflow = search.createColumn({
                name: 'custrecord_iv_shopify_workflow',
            })
            const customrecord_iv_temp_china_customerSearchColTc = search.createColumn({
                name: 'custrecord_iv_temp_tc',
            })
            const customrecord_iv_temp_china_customerSearchColTransId = search.createColumn({
                name: 'custrecord_iv_temp_trans_id',
            })
            const customrecord_iv_temp_china_customerSearchColWelcomeGiftDate = search.createColumn({
                name: 'custrecord_iv_temp_welcome_gift_date',
            })
            const customrecord_iv_temp_china_customerSearch = search.create({
                type: 'customrecord_iv_temp_china_customer',
                filters: [],
                columns: [
                    customrecord_iv_temp_china_customerSearchColInternalId,
                    customrecord_iv_temp_china_customerSearchColAge,
                    customrecord_iv_temp_china_customerSearchColAreaCode,
                    customrecord_iv_temp_china_customerSearchColBirthdayMonth,
                    customrecord_iv_temp_china_customerSearchColChinaDbWorkflow,
                    customrecord_iv_temp_china_customerSearchColDefaultLanguage,
                    customrecord_iv_temp_china_customerSearchColDistrict,
                    customrecord_iv_temp_china_customerSearchColDummyDate1,
                    customrecord_iv_temp_china_customerSearchColDummyDate2,
                    customrecord_iv_temp_china_customerSearchColDummyText1,
                    customrecord_iv_temp_china_customerSearchColDummyText2,
                    customrecord_iv_temp_china_customerSearchColEffectiveDate,
                    customrecord_iv_temp_china_customerSearchColEffectiveToDate,
                    customrecord_iv_temp_china_customerSearchColEmail,
                    customrecord_iv_temp_china_customerSearchColFirstName,
                    customrecord_iv_temp_china_customerSearchColInterestedProduct,
                    customrecord_iv_temp_china_customerSearchColInactive,
                    customrecord_iv_temp_china_customerSearchColLastName,
                    customrecord_iv_temp_china_customerSearchColMarketingPromote,
                    customrecord_iv_temp_china_customerSearchColName,
                    customrecord_iv_temp_china_customerSearchColPhone,
                    customrecord_iv_temp_china_customerSearchColReferralReference,
                    customrecord_iv_temp_china_customerSearchColRegistrationDate,
                    customrecord_iv_temp_china_customerSearchColRemarks,
                    customrecord_iv_temp_china_customerSearchColResidentialRegion,
                    customrecord_iv_temp_china_customerSearchColSalutation,
                    customrecord_iv_temp_china_customerSearchColShopifyWorkflow,
                    customrecord_iv_temp_china_customerSearchColTc,
                    customrecord_iv_temp_china_customerSearchColTransId,
                    customrecord_iv_temp_china_customerSearchColWelcomeGiftDate,
                ],
            })

            const customrecord_iv_temp_china_customerSearchPagedData =
                customrecord_iv_temp_china_customerSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecord_iv_temp_china_customerSearchPagedData.pageRanges.length; i++) {
                const customrecord_iv_temp_china_customerSearchPage =
                    customrecord_iv_temp_china_customerSearchPagedData.fetch({ index: i })
                customrecord_iv_temp_china_customerSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customrecord_iv_temp_china_customerSearchColInternalId)
                    const age = result.getValue(customrecord_iv_temp_china_customerSearchColAge)
                    const areaCode = result.getValue(customrecord_iv_temp_china_customerSearchColAreaCode)
                    const birthdayMonth = result.getValue(customrecord_iv_temp_china_customerSearchColBirthdayMonth)
                    const chinaDbWorkflow = result.getValue(customrecord_iv_temp_china_customerSearchColChinaDbWorkflow)
                    const defaultLanguage = result.getValue(customrecord_iv_temp_china_customerSearchColDefaultLanguage)
                    const district = result.getValue(customrecord_iv_temp_china_customerSearchColDistrict)
                    const dummyDate1 = result.getValue(customrecord_iv_temp_china_customerSearchColDummyDate1)
                    const dummyDate2 = result.getValue(customrecord_iv_temp_china_customerSearchColDummyDate2)
                    const dummyText1 = result.getValue(customrecord_iv_temp_china_customerSearchColDummyText1)
                    const dummyText2 = result.getValue(customrecord_iv_temp_china_customerSearchColDummyText2)
                    const effectiveDate = result.getValue(customrecord_iv_temp_china_customerSearchColEffectiveDate)
                    const effectiveToDate = result.getValue(customrecord_iv_temp_china_customerSearchColEffectiveToDate)
                    const email = result.getValue(customrecord_iv_temp_china_customerSearchColEmail)
                    const firstName = result.getValue(customrecord_iv_temp_china_customerSearchColFirstName)
                    const interestedProduct = result.getValue(
                        customrecord_iv_temp_china_customerSearchColInterestedProduct
                    )
                    const inactive = result.getValue(customrecord_iv_temp_china_customerSearchColInactive)
                    const lastName = result.getValue(customrecord_iv_temp_china_customerSearchColLastName)
                    const marketingPromote = result.getValue(
                        customrecord_iv_temp_china_customerSearchColMarketingPromote
                    )
                    const name = result.getValue(customrecord_iv_temp_china_customerSearchColName)
                    const phone = result.getValue(customrecord_iv_temp_china_customerSearchColPhone)
                    const referralReference = result.getValue(
                        customrecord_iv_temp_china_customerSearchColReferralReference
                    )
                    const registrationDate = result.getValue(
                        customrecord_iv_temp_china_customerSearchColRegistrationDate
                    )
                    const remarks = result.getValue(customrecord_iv_temp_china_customerSearchColRemarks)
                    const residentialRegion = result.getValue(
                        customrecord_iv_temp_china_customerSearchColResidentialRegion
                    )
                    const salutation = result.getValue(customrecord_iv_temp_china_customerSearchColSalutation)
                    const shopifyWorkflow = result.getValue(customrecord_iv_temp_china_customerSearchColShopifyWorkflow)
                    const tc = result.getValue(customrecord_iv_temp_china_customerSearchColTc)
                    const transId = result.getValue(customrecord_iv_temp_china_customerSearchColTransId)
                    const welcomeGiftDate = result.getValue(customrecord_iv_temp_china_customerSearchColWelcomeGiftDate)

                    list.push(
                        new TemporaryCustomer({
                            INTERNAL_ID: internalId,
                            AGE: age,
                            AREA_CODE: areaCode,
                            BIRTHDAY_MONTH: birthdayMonth,
                            CHINA_DB_WORKFLOW: chinaDbWorkflow,
                            DEFAULT_LANGUAGE: defaultLanguage,
                            DISTRICT: district,
                            DUMMY_DATE1: dummyDate1,
                            DUMMY_DATE2: dummyDate2,
                            DUMMY_TEXT1: dummyText1,
                            DUMMY_TEXT2: dummyText2,
                            EFFECTIVE_DATE: effectiveDate,
                            EFFECTIVE_TO_DATE: effectiveToDate,
                            EMAIL: email,
                            FIRST_NAME: firstName,
                            INTERESTED_PRODUCT: JSON.parse('[' + interestedProduct + ']'),
                            INACTIVE: inactive,
                            LAST_NAME: lastName,
                            MARKETING_PROMOTE: marketingPromote,
                            CUSTOMER_ID: name,
                            PHONE: phone,
                            REFERRAL_REFERENCE: referralReference,
                            REGISTRATION_DATE: registrationDate,
                            REMARKS: remarks,
                            RESIDENTIAL_REGION: residentialRegion,
                            SALUTATION: salutation,
                            SHOPIFY_WORKFLOW: shopifyWorkflow,
                            TC: tc,
                            TRANS_ID: transId,
                            WELCOME_GIFT_DATE: welcomeGiftDate,
                        })
                    )
                })
            }

            return list
        }

        updateWorkflowStatus(internalId, workflowData = []) {
            if (!internalId || !workflowData.length) return

            const temporaryCustomer = record.load({
                type: Constants.RECORD.TEMPORARY_CUSTOMER.TYPE,
                id: internalId,
                isDynamic: true,
            })

            for (const { type, status } of workflowData) {
                temporaryCustomer.setValue(type, status)
            }

            temporaryCustomer.save()
        }

        updateErrorMessage(internalId, errorMessage, source) {
            if (!internalId || !errorMessage) return

            const temporaryCustomer = record.load({
                type: Constants.RECORD.TEMPORARY_CUSTOMER.TYPE,
                id: internalId,
                isDynamic: true,
            })

            temporaryCustomer.setValue(source, errorMessage)

            temporaryCustomer.save()
        }
        getCNCustomerInSatging(customerID) {
            let targetCNCustomerID = search.create({
                type: "customrecord_iv_temp_china_customer",
                filters:
                    [
                        ["name", "is", customerID]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC
                        })
                    ]
            }).run().getRange({ start: 0, end: 1000 })[0].id;
            let targetCNCustomer = record.load({
                type: "customrecord_iv_temp_china_customer",
                id: targetCNCustomerID
            })
            return targetCNCustomer
        }

        remove(internalId) {
            const temporaryCustomer = record.delete({
                type: Constants.RECORD.TEMPORARY_CUSTOMER.TYPE,
                id: internalId,
            })
        }

        createPendingMembershipCalculationRecord(customerInternalId, customerId, customerInfo) {
            let pmcRec = record.create({
                type: "customrecord_iv_customer_pend_member_cal",
                isDynamic: true
            })
            pmcRec.setValue("custrecord_iv_pmc_target_customer", customerInternalId)
            pmcRec.setValue("custrecord_iv_pmc_customer_id", customerId)
            pmcRec.setValue("custrecord_iv_pmc_customer_info", JSON.stringify(customerInfo))
            pmcRec.setValue("custrecord_iv_pmc_processing_status", Constants.STAGING_REC_STATUS.PENDING_START)
            return pmcRec.save()
        }
    }

    return CustomerDAO
})
