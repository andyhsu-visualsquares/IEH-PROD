/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 * Script Name: SS Mass Load Customer Data
 * Script ID: customscript_iv_mass_load_customer_data
 * Deployment ID: customdeploy_iv_mass_load_customer_data
 */
define(['N', '../../DAO/CustomerDAO', '../../Constants/ReportConstants', "../../DAO/EarnedRewardsDAO", 'N/search', '../../Constants/Constants'], function (N_1, CustomerDAO, const_1, EarnedRewardsDAO, search, const_2) {
    function execute(context) {
        let searchFilters = JSON.parse(N_1.runtime.getCurrentScript().getParameter({
            name: 'custscript_iv_search_filters',
        }))
        let savingTimeStamp = N_1.runtime.getCurrentScript().getParameter({
            name: "custscript_iv_saving_time_stamp"
        })
        // let customerSearchArr = JSON.parse(N_1.runtime.getCurrentScript().getParameter({
        //     name: 'custscriptcustomersearchpageresult',
        // }))
        // let searchID = N_1.runtime.getCurrentScript().getParameter({
        //     name: 'custscript_iv_searchid',
        // })
        log.debug('searchFilters', JSON.parse(searchFilters.nsFilters)[0][0])

        bulkLoading(JSON.parse(searchFilters.nsFilters), JSON.parse(searchFilters.cnFilters)).then(function ([nsCustomersArrPromise, cnCustomersArrPromise]) {
            const combinedCustomerDataFullArr = nsCustomersArrPromise.concat(cnCustomersArrPromise);
            log.debug("combinedCustomerDataFullArr", combinedCustomerDataFullArr)
            log.debug("combinedCustomerDataFullArr", combinedCustomerDataFullArr.length)
            // Trigger Export To XLXS On Calling Other SL
            // try {

            //     let sURL = N_1.url.resolveScript({
            //         scriptId: 'customscript_iv_export_customer_data_sl',
            //         deploymentId: 'customdeploy_iv_export_customer_data_sl',
            //         returnExternalUrl: true,
            //     })
            //     log.debug("sURL", sURL)
            //     N_1.https.post({
            //         url: sURL,
            //         headers: {
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify({ combinedCustomerDataFullArr, savingTimeStamp })
            //     })
            //     log.debug("Finish Posting")
            // } catch (e) {
            //     log.debug(e.toString())
            // }
        })




        // log.debug('combinedCustomerDataFullArr', combinedCustomerDataFullArr.length)

        //Create 
        // let newSearchResultRec = N_1.record.create({
        //     type: "customrecord_iv_mass_loading_customer",
        //     isDynamic: true
        // })
        // newSearchResultRec.setValue("custrecord_iv_mass_load_search_id", searchID)
        // newSearchResultRec.setValue("custrecord_iv_mass_load_customer_data", JSON.stringify(customerList))
        // newSearchResultRec.save();
        // for (let i = 0; i < customerSearchArr.length; i++) {
        // const customerRepository = new CustomerRepository()

        // let customer = customerRepository.findCustomerByKey(customerID, null, null)
        // let customerData = customerRepository.findCustomerByKey({
        //     CUSTOMER_ID: customerID,
        //     EMAIL: null,
        //     PHONE: null,
        // })

        // log.debug('Find Customer Details', customerID)
        // log.debug('Customer Details', customerData)
        // log.debug('Customer Counter', i + 1)
        // var script = N_1.runtime.getCurrentScript()
        // var remainingUsage = script.getRemainingUsage()
        // log.debug('remainingUsage', remainingUsage)
        // customerSearchPage.forEach((result) => {

        // })
        // }


        var script = N_1.runtime.getCurrentScript()
        var remainingUsage = script.getRemainingUsage()
        log.debug('remainingUsage', remainingUsage);
        // return customerList;
    }

    function nsSearch(nsFilters) {

        let customerList = []
        const customerSearchColInternalId = N_1.search.createColumn({ name: 'internalid' })
        const customerSearchColFirstName = N_1.search.createColumn({ name: 'firstname' })
        const customerSearchColMiddleName = N_1.search.createColumn({ name: 'middlename' })
        const customerSearchColLastName = N_1.search.createColumn({ name: 'lastname' })
        const customerSearchColSalutation = N_1.search.createColumn({ name: 'salutation' })
        const customerSearchColBirthdayMonth = N_1.search.createColumn({ name: 'custentity_iv_cl_birthday' })
        const customerSearchColAge = N_1.search.createColumn({ name: 'custentity_iv_cl_age' })
        const customerSearchColMobilePhone = N_1.search.createColumn({ name: 'phone' })
        const customerSearchColEmail = N_1.search.createColumn({ name: 'email' })
        const customerSearchColDefaultLanguage = N_1.search.createColumn({ name: 'custentity_iv_default_language' })
        const customerSearchColInterestedProducts = N_1.search.createColumn({
            name: 'custentity_iv_interested_products',
        })
        const customerSearchColRegistrationDate = N_1.search.createColumn({ name: 'custentity_iv_registration_date' })
        const customerSearchColResidentialRegion = N_1.search.createColumn({ name: 'custentity_iv_residential_region' })
        const customerSearchColEffectiveDate = N_1.search.createColumn({ name: 'custentity_iv_cl_effective_date' })
        const customerSearchColEffectiveTo = N_1.search.createColumn({ name: 'custentity_iv_cl_effective_to' })
        const customerSearchColWelcomeGiftProvisioningDate = N_1.search.createColumn({
            name: 'custentity_iv_welcome_gift_provision_day',
        })
        const customerSearchColOutstandingPoints = N_1.search.createColumn({
            name: 'custentity_iv_cl_outstanding_points',
        })
        const customerSearchColReferralReference = N_1.search.createColumn({ name: 'custentity_iv_referral_reference' })
        const customerSearchColAcceptMarketingPromotionInformation = N_1.search.createColumn({
            name: 'custentity_iv_marketing_promotion_info',
        })
        const customerSearchColAcceptTcAndCustomerDataPrivacyPolicy = N_1.search.createColumn({
            name: 'custentity_iv_customer_data_policy',
        })
        const customerSearchColMemberType = N_1.search.createColumn({ name: 'custentity_iv_cl_member_type' })
        const customerSearchColNameInSimplifiedChinese = N_1.search.createColumn({
            name: 'custrecord_iv_schinese_name',
            join: 'CUSTENTITY_IV_CL_MEMBER_TYPE',
        })
        const customerSearchColNameInTraditionalChinese = N_1.search.createColumn({
            name: 'custrecord_iv_tchinese_name',
            join: 'CUSTENTITY_IV_CL_MEMBER_TYPE',
        })
        const customerSearchColId = N_1.search.createColumn({ name: 'entityid', sort: N_1.search.Sort.ASC })
        const customerSearchColComments = N_1.search.createColumn({ name: 'comments' })
        const customerSearchColAreaCode = N_1.search.createColumn({ name: 'custentity_iv_customer_areacode' })
        // const customerSearchColAddress1 = N_1.search.createColumn({ name: 'address1' })
        const customerSearchColDistrict = N_1.search.createColumn({ name: 'custentity_iv_district' })
        const customerSearchColDummyDate1 = N_1.search.createColumn({ name: 'custentity_iv_dummy_date1' })
        const customerSearchColDummyDate2 = N_1.search.createColumn({ name: 'custentity_iv_dummy_date2' })
        const customerSearchColDummyText1 = N_1.search.createColumn({ name: 'custentity_iv_dummy_text1' })
        const customerSearchColIsChina = N_1.search.createColumn({ name: 'custentity_iv_ischina' })
        const customerSearchColMergePointBalance = N_1.search.createColumn({
            name: 'custentity_iv_customer_merge_pt_bal',
        })
        const customerSearchColInactive = N_1.search.createColumn({ name: 'isinactive' })

        log.debug("nsFilters", nsFilters)
        const customerIDSearch = N_1.search.create({
            type: 'customer',
            filters: nsFilters,
            columns: [
                N_1.search.createColumn({
                    name: 'entityid',
                    sort: N_1.search.Sort.DESC,
                }),
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
                // customerSearchColAddress1,
                customerSearchColDistrict,
                customerSearchColDummyDate1,
                customerSearchColDummyDate2,
                customerSearchColDummyText1,
                customerSearchColIsChina,
                customerSearchColMergePointBalance,
                customerSearchColInactive
            ],
        })


        const customerIDSearchPagedDataCount = customerIDSearch.runPaged().count

        log.debug("customerIDSearchPagedDataCount", customerIDSearchPagedDataCount);
        let ns_customer_ids = []
        for (let i = 0; i < Math.ceil(customerIDSearchPagedDataCount / 1000); i++) {
            let customerSearchData = customerIDSearch.run().getRange({ start: 1000 * i, end: (1000 * i) + 1000 });
            for (let result of customerSearchData) {
                ns_customer_ids.push(result.id);
                customerList.push({
                    ns_customer_id: result.id,
                    customerID: result.getValue("entityid"),
                    firstName: result.getValue(customerSearchColFirstName),
                    lastName: result.getValue(customerSearchColLastName),
                    salutation: result.getValue(customerSearchColSalutation),
                    birthdayMonth: `${result.getValue(customerSearchColBirthdayMonth)}`,
                    age: `${result.getValue(customerSearchColAge)}`,
                    phone: `${result.getValue(customerSearchColMobilePhone)}`,
                    email: result.getValue(customerSearchColEmail),
                    defaultLanguage: result.getText(customerSearchColDefaultLanguage),
                    residentialRegion: result.getText(customerSearchColResidentialRegion),
                    // district: customerData.REGION,
                    referralRef: result.getValue(customerSearchColReferralReference),
                    marketingPromote: result.getValue(
                        customerSearchColAcceptMarketingPromotionInformation
                    ) ? 'T' : 'F',
                    tc: result.getValue(
                        customerSearchColAcceptTcAndCustomerDataPrivacyPolicy
                    ) ? 'T' : 'F',
                    dummyDate1: result.getValue(customerSearchColDummyDate1),
                    dummyDate2: result.getValue(customerSearchColDummyDate2),
                    dummyText1: result.getValue(customerSearchColDummyText1),
                    memberType: result.getText(customerSearchColMemberType),
                    registrationDate: result.getValue(customerSearchColRegistrationDate),
                    effectiveDate: result.getValue(customerSearchColEffectiveDate),
                    effectiveToDate: result.getValue(customerSearchColEffectiveTo),
                    welcomeGiftDate: result.getValue(customerSearchColWelcomeGiftProvisioningDate),

                    // pointBalance: customerData.POINT_BALANCE,
                    // cumulativeAmt: customerData.CUMULATIVE_AMT,
                    // spendingTo: customerData.SPENDING_TO,
                    // nextTier: customerData.NEXT_TIER,
                })
            }
            log.debug("Finished Customer Page Counter: ", i + 1)
            // break;
        }
        const earnedRewardsDAO = new EarnedRewardsDAO()
        let customerPointBalanceList = earnedRewardsDAO.findCustomerPointBalance(ns_customer_ids)
        let customerStoredPointBalanceList = earnedRewardsDAO.findCustomerStoredPointBalance(ns_customer_ids)

        log.debug('customerPointBalanceList', customerPointBalanceList);
        log.debug('customerStoredPointBalanceList', customerStoredPointBalanceList);
        log.debug("customerList", customerList)
        try {
            for (let i = 0; i < customerList.length; i++) {
                let customerLineData = customerList[i]
                let ns_customer_id = customerLineData.ns_customer_id
                let pointBalance = 0
                // if (customerPointBalanceList.hasOwnProperty(ns_customer_id)) {
                //     let earnedRewardList = customerPointBalanceList[ns_customer_id]
                //     pointBalance = earnedRewardList[earnedRewardList.length - 1]
                //     if (pointBalance.hasOwnProperty('pointBalance')) {
                //         pointBalance = earnedRewardList[earnedRewardList.length - 1].pointBalance
                //     } else pointBalance = 0
                // }
                for (let pointDetails of customerStoredPointBalanceList) {
                    if (pointDetails.customerId == ns_customer_id) {
                        pointBalance = pointDetails.pointBalance
                    }
                }
                customerLineData["outstandingPoint"] = pointBalance || 0
            }
        } catch (error) {
            log.debug('error', error);
            log.debug('error stack', error.stack);

        }
        log.debug("customerList", customerList)
        return customerList;
    }

    function cnFilterCustomerFullArr({ birthdayMonth, salutation, lastname, firstname, phone, customerid, age, referRef, dummyDate1, dummyDate2, dummyDate1To, dummyDate2To, dummyText1, dummyText2, marketing, tc, dLang, region, membership, email, district, regFromDate, regToDate, effectiveDate, effectiveDateTo, effectiveToDate, effectiveToTill, intrestedItems, pointBalanceFrom, pointBalanceTo }, cnCustomerFullArr) {
        let cnCustomerFilterArr = cnCustomerFullArr
        var customerSearchResult = search.create({
            type: "customer",
            filters:
                [
                    ["custentity_iv_cl_member_type", "noneof", "@NONE@"],
                    "AND",
                    ["custentity_iv_ischina", "is", "T"],
                    "AND",
                    ["custentity_iv_registration_date", "isnotempty", ""],
                ],
            columns:
                [
                    search.createColumn({
                        name: "entityid",
                        sort: search.Sort.ASC
                    })
                ]
        }).run().getRange({ start: 0, end: 1000 });
        const earnedRewardsDAO = new EarnedRewardsDAO()
        let cnNSCustomerIDs = []
        for (let customer of customerSearchResult) {
            cnNSCustomerIDs.push(customer.id)
        }

        let customerStoredPointBalanceList = earnedRewardsDAO.findCustomerStoredPointBalance(cnNSCustomerIDs)

        for (let cnCustomer of cnCustomerFilterArr) {
            let pointBalance = 0
            for (let pointDetails of customerStoredPointBalanceList) {
                if (pointDetails.customerID == cnCustomer.CUSTOMER_ID) {
                    log.debug("cnPointsMatched", pointDetails.customerID + " | " + pointDetails.pointBalance)
                    pointBalance = pointDetails.pointBalance
                }
            }
            cnCustomer["outstandingPoint"] = pointBalance || 0
        }

        if (pointBalanceFrom) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                return Number(customer.outstandingPoint) >= Number(pointBalanceFrom)
            })
        }
        if (pointBalanceTo) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                return Number(pointBalanceTo) >= Number(customer.outstandingPoint)
            })
        }
        if (birthdayMonth) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                log.debug("customer.BIRTHDAY_MONTH", customer.BIRTHDAY_MONTH)
                let birthdayMonthArr = birthdayMonth.split('\u0005')
                return birthdayMonthArr.includes(`${customer.BIRTHDAY_MONTH}`)
            });
            log.debug("cnCustomerFilterArr", cnCustomerFilterArr);
        }
        if (salutation) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.SALUTATION.toLowerCase().includes(salutation.toLowerCase()));
        }
        if (lastname) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.LAST_NAME.toLowerCase().includes(lastname.toLowerCase()));
        }
        if (firstname) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.FIRST_NAME.toLowerCase().includes(firstname.toLowerCase()));
        }
        if (referRef) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.REFERRAL_REFERENCE.toLowerCase().includes(referRef.toLowerCase()));

        }
        if (email) {
            log.debug("email", encodeURIComponent(email).toLowerCase())
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.EMAIL.toLowerCase().includes(encodeURIComponent(email).toLowerCase()));
        }

        if (regFromDate) {
            regFromDate = format.parse({ value: regFromDate, type: format.Type.DATE })

            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                let customerDate = moment(customer.REGISTRATION_DATE, 'YYYY-MM-DD HH:mm:ss')
                let searchFromDate = moment(regFromDate)
                if (customerDate - searchFromDate >= 0) {
                    return true
                } else {
                    return false
                }
            })
        }
        if (regToDate) {
            regToDate = format.parse({ value: regToDate, type: format.Type.DATE })

            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                let customerDate = moment(customer.REGISTRATION_DATE, 'YYYY-MM-DD HH:mm:ss')
                let searchToDate = moment(regToDate)
                if (searchToDate - customerDate >= 0) {
                    return true
                } else {
                    return false
                }
            })
        }

        if (dummyDate1) {
            dummyDate1 = format.parse({ value: dummyDate1, type: format.Type.DATE })
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                let customerDate = moment(customer.DUMMY_DATE1, 'YYYY-MM-DD')
                let searchFromDate = moment(dummyDate1)
                if (customerDate - searchFromDate >= 0) {
                    return true
                } else {
                    return false
                }

            }
                // (customer.DUMMY_DATE1 && customer.DUMMY_DATE1.toLowerCase().includes(moment(dummyDate1).format("YYYY-MM-DD")))
            );
        }
        if (dummyDate1To) {
            dummyDate1To = format.parse({ value: dummyDate1To, type: format.Type.DATE })
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                let customerDate = moment(customer.DUMMY_DATE1, 'YYYY-MM-DD')
                let searchToDate = moment(dummyDate1To)
                if (searchToDate - customerDate >= 0) {
                    return true
                } else {
                    return false
                }
            }
                // (customer.DUMMY_DATE1 && customer.DUMMY_DATE1.toLowerCase().includes(moment(dummyDate1).format("YYYY-MM-DD")))
            );
        }
        if (dummyDate2) {
            dummyDate2 = format.parse({ value: dummyDate2, type: format.Type.DATE })
            log.debug("dummyDate2 : " + moment(dummyDate2).format("YYYY-MM-DD"), JSON.stringify(moment(dummyDate2).format("YYYY-MM-DD")))
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                let customerDate = moment(customer.DUMMY_DATE2, 'YYYY-MM-DD')
                let searchFromDate = moment(dummyDate2)
                if (customerDate - searchFromDate >= 0) {
                    return true
                } else {
                    return false
                }
            })
        }
        if (dummyDate2To) {
            dummyDate2To = format.parse({ value: dummyDate2To, type: format.Type.DATE })
            log.debug("dummyDate2 : " + moment(dummyDate2).format("YYYY-MM-DD"), JSON.stringify(moment(dummyDate2).format("YYYY-MM-DD")))
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                let customerDate = moment(customer.DUMMY_DATE2, 'YYYY-MM-DD')
                let searchToDate = moment(dummyDate2To)
                if (searchToDate - customerDate >= 0) {
                    return true
                } else {
                    return false
                }

            })
        }
        if (effectiveDate) {
            effectiveDate = format.parse({ value: effectiveDate, type: format.Type.DATE })
            log.debug("effectiveDate : " + moment(effectiveDate).format("YYYY-MM-DD"), JSON.stringify(moment(dummyDate2).format("YYYY-MM-DD")))
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                let customerDate = moment(customer.EFFECTIVE_DATE, 'YYYY-MM-DD')
                let searchFromDate = moment(effectiveDate)
                if (customerDate - searchFromDate >= 0) {
                    return true
                } else {
                    return false
                }

            })
        }
        if (effectiveDateTo) {
            effectiveDateTo = format.parse({ value: effectiveDateTo, type: format.Type.DATE })
            log.debug("effectiveDateTo : " + moment(effectiveDateTo).format("YYYY-MM-DD"), JSON.stringify(moment(dummyDate2).format("YYYY-MM-DD")))
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                let customerDate = moment(customer.EFFECTIVE_DATE, 'YYYY-MM-DD')
                let searchToDate = moment(effectiveDateTo)
                if (searchToDate - customerDate >= 0) {
                    return true
                } else {
                    return false
                }

            })
        }
        if (effectiveToDate) {
            effectiveToDate = format.parse({ value: effectiveToDate, type: format.Type.DATE })
            log.debug("effectiveDate : " + moment(effectiveToDate).format("YYYY-MM-DD"), JSON.stringify(moment(effectiveToDate).format("YYYY-MM-DD")))
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                let customerDate = moment(customer.EFFECTIVE_TO, 'YYYY-MM-DD')
                let searchFromDate = moment(effectiveToDate)
                if (customerDate - searchFromDate >= 0) {
                    return true
                } else {
                    return false
                }

            })
        }
        if (effectiveToTill) {
            effectiveToTill = format.parse({ value: effectiveToTill, type: format.Type.DATE })
            log.debug("effectiveToTill : " + moment(effectiveToTill).format("YYYY-MM-DD"), JSON.stringify(moment(dummyDate2).format("YYYY-MM-DD")))
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                let customerDate = moment(customer.EFFECTIVE_TO, 'YYYY-MM-DD')
                let searchToDate = moment(effectiveToTill)
                if (searchToDate - customerDate >= 0) {
                    return true
                } else {
                    return false
                }

            })
        }
        if (dummyText1) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => (customer.DUMMY_TEXT1 && customer.DUMMY_TEXT1.toLowerCase().includes(dummyText1.toLowerCase())));
        }
        if (dummyText2) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => (customer.DUMMY_TEXT2 && customer.DUMMY_TEXT2.toLowerCase().includes(dummyText2.toLowerCase())));
        }
        if (phone) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.PHONE.includes(phone));
        }
        if (customerid) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.CUSTOMER_ID.includes(customerid));
        }
        if (age) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.AGE == age);
        }
        log.debug("cnCustomerFilterArr1", cnCustomerFilterArr);
        if (marketing != "") {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.MARKETING_PROMOTE == (marketing == "T" ? true : false));
            log.debug("cnCustomerFilterArr1", cnCustomerFilterArr);

        }
        if (tc != "") {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.TC == (tc == "T" ? true : false));
        }

        if (dLang && dLang != "") {
            let dLangObj = const_1.LANGUAGE.filter(lang => lang.value == dLang)
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.D_LANG == dLangObj[0].text);
        }
        if (region && region != "") {
            let regionObj = const_1.REGION.filter(targetRegion => targetRegion.value == region)
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.RESIDENTIAL_REGION == regionObj[0].text);
        }
        if (membership && membership != "") {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.MEMBER_TYPE == membership);
        }
        if (district && district != "") {
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => (customer.DISTRICT && customer.DISTRICT.includes(district)));
        }
        if (intrestedItems) {
            let intrestedItemsArr = intrestedItems.split('\u0005')
            let intrestedItemsStringArr = []
            for (let itemId of intrestedItemsArr) {
                let itemString = search.lookupFields({
                    type: "customlist_iv_item_cat_list",
                    id: itemId,
                    columns: ['name']
                })
                intrestedItemsStringArr.push(itemString.name)
            }
            if (intrestedItemsArr.length > 0)
                cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                    let customerIntrestedProductArr = customer.INTERESTED_PRODUCT.split(',')
                    let result = intrestedItemsStringArr.some(function (item) {
                        return customerIntrestedProductArr.indexOf(item) !== -1
                    })
                    return result
                })
        }

        // //Search All Active CN Customer
        // var customerSearchResult = search.create({
        //     type: "customer",
        //     filters:
        //         [
        //             ["custentity_iv_cl_member_type", "noneof", "@NONE@"],
        //             "AND",
        //             ["custentity_iv_ischina", "is", "T"],
        //             "AND",
        //             ["custentity_iv_registration_date", "isnotempty", ""],
        //         ],
        //     columns:
        //         [
        //             search.createColumn({
        //                 name: "entityid",
        //                 sort: search.Sort.ASC
        //             })
        //         ]
        // }).run().getRange({ start: 0, end: 1000 });
        // let cnNSCustomerIDs = []
        // for (let customer of customerSearchResult) {
        //     cnNSCustomerIDs.push(customer.id)
        // }

        // const earnedRewardsDAO = new EarnedRewardsDAO()
        // let customerPointBalanceList = earnedRewardsDAO.findCustomerPointBalance(cnNSCustomerIDs)
        // let customerStoredPointBalanceList = earnedRewardsDAO.findCustomerStoredPointBalance(cnNSCustomerIDs)
        // log.debug('customerPointBalanceList', customerPointBalanceList);
        // log.debug("customerCNStoredPointBalanceList", customerStoredPointBalanceList)
        try {
            for (let i = 0; i < cnCustomerFilterArr.length; i++) {
                let customerLineData = cnCustomerFilterArr[i]
                let ns_customer_id = customerSearchResult.find((customer) => customer.getValue("entityid") === customerLineData.CUSTOMER_ID)
                // log.debug("ns_customer_id", ns_customer_id)
                // log.debug("ns_customer_id", typeof ns_customer_id)
                // log.debug("customerLineData.CUSTOMER_ID", customerLineData.CUSTOMER_ID)
                let pointBalance = 0
                // if (ns_customer_id && customerPointBalanceList.hasOwnProperty(ns_customer_id.id)) {
                //     let earnedRewardList = customerPointBalanceList[ns_customer_id.id]
                //     pointBalance = earnedRewardList[earnedRewardList.length - 1]
                //     if (pointBalance.hasOwnProperty('pointBalance')) {
                //         pointBalance = earnedRewardList[earnedRewardList.length - 1].pointBalance
                //     } else pointBalance = 0

                // }
                for (let pointDetails of customerStoredPointBalanceList) {
                    if (pointDetails.customerID == customerLineData.CUSTOMER_ID) {
                        log.debug("cnPointsMatched", pointDetails.customerID + " | " + pointDetails.pointBalance)
                        pointBalance = pointDetails.pointBalance
                    }
                }
                customerLineData["outstandingPoint"] = pointBalance || 0
            }
        } catch (error) {
            log.debug('error', error);
            log.debug('error stack', error.stack);

        }
        log.debug("cnCustomerFilterArr", cnCustomerFilterArr)
        return cnCustomerFilterArr;
    }


    function bulkLoading(nsFilters, cnFilters) {
        // var nsCustomersArrPromise = new Promise(function (resolve, reject) {
        //     let nsCustomersData = nsSearch(nsFilters);
        //     checkScriptRemainingUsage();
        //     resolve(nsCustomersData)
        // })

        // var cnCustomersArrPromise = new Promise(function (resolve, reject) {
        //     N_1.https.get.promise({
        //         url: 'https://iehcnapiapp.chinacloudsites.cn/api/customer/all-customers',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     }).then(function (response) {
        //         cnCustomerFullArr = JSON.parse(response.body).result
        //         log.debug('cnCustomerFullArr', cnCustomerFullArr.length)

        //         let cnFilteredArr = cnFilterCustomerFullArr(cnFilters, cnCustomerFullArr);
        //         let cnCustomerList = []
        //         log.debug("cnFilteredArr", cnFilteredArr)
        //         for (let result of cnFilteredArr) {
        //             cnCustomerList.push({
        //                 customerID: result.CUSTOMER_ID,
        //                 firstName: result.FIRST_NAME,
        //                 lastName: result.LAST_NAME,
        //                 salutation: result.SALUTATION,
        //                 birthdayMonth: `${result.BIRTHDAY_MONTH}`,
        //                 age: `${result.AGE}`,
        //                 phone: `${result.PHONE}`,
        //                 email: result.EMAIL,
        //                 defaultLanguage: result.D_LANG,
        //                 residentialRegion: result.RESIDENTIAL_REGION,
        //                 // district: customerData.REGION,
        //                 referralRef: result.REFERRAL_REFERENCE,
        //                 marketingPromote: result.MARKETING_PROMOTE ? 'T' : 'F',
        //                 tc: result.TC ? 'T' : 'F',
        //                 dummyDate1: result.DUMMY_DATE1,
        //                 dummyDate2: result.DUMMY_DATE2,
        //                 dummyText1: result.DUMMY_TEXT1,
        //                 memberType: result.MEMBER_TYPE,
        //                 registrationDate: result.REGISTRATION_DATE,
        //                 effectiveDate: result.EFFECTIVE_DATE,
        //                 effectiveToDate: result.EFFECTIVE_TO,
        //                 welcomeGiftDate: result.gWELCOME_GIFT_DATE,
        //                 // pointBalance: customerData.POINT_BALANCE,
        //                 // cumulativeAmt: customerData.CUMULATIVE_AMT,
        //                 // spendingTo: customerData.SPENDING_TO,
        //                 // nextTier: customerData.NEXT_TIER,
        //             })
        //         }
        //         log.debug("customerlist", cnCustomerList.length)
        //         resolve(cnCustomerList);
        //     }).catch(function (error) {
        //         log.error('Error occurred while retrieving customer data from CNDB', error);
        //     });
        // })
        // log.debug("ALL Customer RESULT", nsCustomersArrPromise)
        // log.debug("ALL Customer RESULT", cnCustomersArrPromise)
        // return Promise.all([nsCustomersArrPromise, cnCustomersArrPromise])


        var cnCustomerFullArr

        let cnCustomerDataPromise = new Promise(function (resolve, reject) {

            N_1.https.get.promise({
                url: `https://iehcnapiapp.chinacloudsites.cn/api/customer/all-customers?CURRENT_ENV=${const_2.CURRENT_ENV}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                cnCustomerFullArr = JSON.parse(response.body).result
                log.debug('cnCustomerFullArr', cnCustomerFullArr.length)
                log.debug('cnCustomerFullArrTestData', cnCustomerFullArr[0]);
                log.debug("cnFilters", cnFilters)
                let cnFilteredArr = cnFilterCustomerFullArr(cnFilters, cnCustomerFullArr);
                let cnCustomerList = []
                for (let result of cnFilteredArr) {
                    cnCustomerList.push({
                        customerID: result.CUSTOMER_ID,
                        firstName: result.FIRST_NAME,
                        lastName: result.LAST_NAME,
                        salutation: result.SALUTATION,
                        birthdayMonth: `${result.BIRTHDAY_MONTH}`,
                        age: `${result.AGE}`,
                        phone: `${result.PHONE}`,
                        email: result.EMAIL,
                        defaultLanguage: result.D_LANG,
                        residentialRegion: result.RESIDENTIAL_REGION,
                        // district: customerData.REGION,
                        referralRef: result.REFERRAL_REFERENCE,
                        marketingPromote: result.MARKETING_PROMOTE ? 'T' : 'F',
                        tc: result.TC ? 'T' : 'F',
                        dummyDate1: result.DUMMY_DATE1,
                        dummyDate2: result.DUMMY_DATE2,
                        dummyText1: result.DUMMY_TEXT1,
                        memberType: result.MEMBER_TYPE,
                        memberType: (result.MEMBER_TYPE ? isNaN(result.MEMBER_TYPE) ? result.MEMBER_TYPE : const_1.MEMBERSHIP.find(targetMembership => targetMembership.value == result.MEMBER_TYPE).text : '-') || '-',
                        registrationDate: result.REGISTRATION_DATE,
                        effectiveDate: result.EFFECTIVE_DATE,
                        effectiveToDate: result.EFFECTIVE_TO,
                        welcomeGiftDate: result.WELCOME_GIFT_DATE,
                        outstandingPoint: result.outstandingPoint || 0
                        // pointBalance: customerData.POINT_BALANCE,
                        // cumulativeAmt: customerData.CUMULATIVE_AMT,
                        // spendingTo: customerData.SPENDING_TO,
                        // nextTier: customerData.NEXT_TIER,
                    })
                }
                log.debug("CNcustomerlistLength", cnCustomerList.length)
                resolve(cnCustomerList);
            }).catch(function (error) {
                log.debug('error', error);
                log.debug('error stack', error.stack);
                log.error('Error occurred while retrieving customer data from CNDB', error);
            });
        })

        let nsCustomerDataPromise = new Promise(function (resolve, reject) {
            let nsCustomerList = nsSearch(nsFilters)
            log.debug("nsCustomerListLength", nsCustomerList.length)
            resolve(nsCustomerList);
        })

        return Promise.all([cnCustomerDataPromise, nsCustomerDataPromise]);


    }

    return {
        execute: execute,
    }
})
