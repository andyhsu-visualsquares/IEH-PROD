/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 *
 * @ScriptName Mass Print Delivery Note
 * @ScriptId customscript_iv_mass_print_dn_sl
 * @DeploymentId customdeploy_iv_mass_print_dn_sl
 * @Description Mass print delivery notes
 */

define([
    'N/ui/serverWidget',
    'N/render',
    'N/search',
    'N/file',
    'N/url',
    'N/error',
    'N/record',
    'N/format',
    '../../Repository/CustomerRepository',
    '../../DAO/CustomerDAO',
    '../../DAO/EarnedRewardsDAO',
    '../../../utils/DateUtils',
    'N',
    '../ChinaDBServices',
    '../../Constants/ReportConstants',
    '../../../lib/Time/moment-timezone',
    '../../Constants/Constants'
], function (
    serverWidget,
    render,
    search,
    file,
    url,
    error,
    record,
    format,
    CustomerRepository,
    CustomerDAO,
    EarnedRewardsDAO,
    DateUtils,
    N_1,
    ChinaDBServices,
    const_1,
    moment,
    const_2
) {
    var savingTimeStamp = null
    function onRequest(context) {
        try {
            log.audit('onRequest', {
                request: {
                    clientIpAddress: context.request.clientIpAddress,
                    url: context.request.url,
                    method: context.request.method,
                    parameters: context.request.parameters,
                },
            })
            const { response, request } = context
            const {
                status,
                cust_filter_birthday_month,
                cust_filter_salutation,
                cust_filter_lastname,
                cust_filter_firstname,
                cust_filter_phone,
                cust_filter_customerid,
                cust_filter_page_index,
                cust_ns_filter,
                cust_cn_filter,
                cust_filter_age,
                cust_filter_to_age,
                cust_filter_refer_ref,
                cust_filter_dummy_d1,
                cust_filter_dummy_d2,
                cust_filter_dummy_d1_to,
                cust_filter_dummy_d2_to,
                cust_filter_dummy_t1,
                cust_filter_dummy_t2,
                cust_filter_marketing,
                cust_filter_tc,
                // cust_filter_d_lang,
                // cust_filter_region,
                // cust_filter_membership,
                cust_filter_email,
                cust_filter_district,
                cust_filter_effective_from,
                cust_filter_effective_date_to,
                cust_filter_effective_to,
                cust_filter_effective_to_till,
                cust_filter_regist_date,
                cust_filter_regist_to_date,
                cust_filter_saving_timestamp,
                cust_filter_interst_item,
                cust_filter_point_balance_from,
                cust_filter_point_balance_to,
                cust_filter_export_page_index_from,
                cust_filter_export_page_index_to
            } = request.parameters
            var cust_filter_d_lang = request.parameters.cust_filter_d_lang;
            var cust_filter_region = request.parameters.cust_filter_region;
            var cust_filter_membership = request.parameters.cust_filter_membership;
            if (!!cust_filter_d_lang) if (cust_filter_d_lang.includes("\u0005")) cust_filter_d_lang = cust_filter_d_lang.split("\u0005")
            if (!!cust_filter_membership) if (cust_filter_membership.includes("\u0005")) cust_filter_membership = cust_filter_membership.split("\u0005")
            if (!!cust_filter_region) if (cust_filter_region.includes("\u0005")) cust_filter_region = cust_filter_region.split("\u0005")
            // const customerList = custpage_filter_customer === '' ? [] : custpage_filter_customer?.split('\u0005')
            log.debug('onRequest', {
                status,
                birthdayMonth: cust_filter_birthday_month,
                salutation: cust_filter_salutation,
                lastname: cust_filter_lastname,
                firstname: cust_filter_firstname,
                phone: cust_filter_phone,
                customerid: cust_filter_customerid,
                page: cust_filter_page_index,
                nsfilter: cust_ns_filter,
                cnfilter: cust_cn_filter,
                age: cust_filter_age,
                referRef: cust_filter_refer_ref,
                dummyDate1: cust_filter_dummy_d1,
                dummyDate2: cust_filter_dummy_d2,
                dummyDate1To: cust_filter_dummy_d1_to,
                dummyDate2To: cust_filter_dummy_d2_to,
                dummyText1: cust_filter_dummy_t1,
                dummyText2: cust_filter_dummy_t2,
                marketing: cust_filter_marketing,
                tc: cust_filter_tc,
                dLang: cust_filter_d_lang,
                region: cust_filter_region,
                membership: cust_filter_membership,
                email: cust_filter_email,
                district: cust_filter_district,
                searchTime: cust_filter_saving_timestamp,
                intrestedItems: cust_filter_interst_item,
                pointBalanceFrom: cust_filter_point_balance_from,
                pointBalanceTo: cust_filter_point_balance_to,
                exportPageFrom: cust_filter_export_page_index_from,
                exportPageTo: cust_filter_export_page_index_to
            })

            // 建立一個名為 "Customer Export Report" 的表單
            const form = serverWidget.createForm({ title: 'Imperial Club Member Export' })
            layoutForm(form, {
                status,
                birthdayMonth: cust_filter_birthday_month,
                salutation: cust_filter_salutation,
                lastname: cust_filter_lastname,
                firstname: cust_filter_firstname,
                phone: cust_filter_phone,
                customerid: cust_filter_customerid,
                page: cust_filter_page_index,
                nsfilter: cust_ns_filter,
                cnfilter: cust_cn_filter,
                age: cust_filter_age,
                toAge: cust_filter_to_age,
                referRef: cust_filter_refer_ref,
                dummyDate1: cust_filter_dummy_d1,
                dummyDate2: cust_filter_dummy_d2,
                dummyDate1To: cust_filter_dummy_d1_to,
                dummyDate2To: cust_filter_dummy_d2_to,
                dummyText1: cust_filter_dummy_t1,
                dummyText2: cust_filter_dummy_t2,
                marketing: cust_filter_marketing,
                tc: cust_filter_tc,
                dLang: cust_filter_d_lang,
                region: cust_filter_region,
                membership: cust_filter_membership,
                email: cust_filter_email,
                district: cust_filter_district,
                effectiveDate: cust_filter_effective_from,
                effectiveDateTo: cust_filter_effective_date_to,
                effectiveToDate: cust_filter_effective_to,
                effectiveToTill: cust_filter_effective_to_till,
                regFromDate: cust_filter_regist_date,
                regToDate: cust_filter_regist_to_date,
                intrestedItems: cust_filter_interst_item,
                pointBalanceFrom: cust_filter_point_balance_from,
                pointBalanceTo: cust_filter_point_balance_to,
                exportPageFrom: cust_filter_export_page_index_from,
                exportPageTo: cust_filter_export_page_index_to
                // searchTime: cust_filter_saving_timestamp
            })

            if (request.method === 'POST') {
                let allowExport = checkUserPermission();
                let downloadDetails = getFilesInFolder(cust_filter_saving_timestamp)


                if (allowExport && downloadDetails.length == 0)
                    form.addButton({
                        id: 'print',
                        label: 'Export',
                        functionName: "exportDataToExcel('" + cust_filter_saving_timestamp + "')",
                    })
                if (downloadDetails.length > 0) {
                    form.addButton({
                        id: 'print2',
                        label: 'Download',
                        functionName: "downloadFiles('" + JSON.stringify(downloadDetails) + "')"
                    })
                }



                const customerSublist = createSublist(form)
                searchNSCustomerList(form, {
                    birthdayMonth: cust_filter_birthday_month,
                    salutation: cust_filter_salutation,
                    lastname: cust_filter_lastname,
                    firstname: cust_filter_firstname,
                    phone: cust_filter_phone,
                    customerid: cust_filter_customerid,
                    page: cust_filter_page_index,
                    age: cust_filter_age,
                    toAge: cust_filter_to_age,
                    referRef: cust_filter_refer_ref,
                    dummyDate1: cust_filter_dummy_d1,
                    dummyDate2: cust_filter_dummy_d2,
                    dummyDate1To: cust_filter_dummy_d1_to,
                    dummyDate2To: cust_filter_dummy_d2_to,
                    dummyText1: cust_filter_dummy_t1,
                    dummyText2: cust_filter_dummy_t2,
                    marketing: cust_filter_marketing,
                    tc: cust_filter_tc,
                    dLang: cust_filter_d_lang,
                    region: cust_filter_region,
                    membership: cust_filter_membership,
                    email: cust_filter_email,
                    district: cust_filter_district,
                    effectiveDate: cust_filter_effective_from,
                    effectiveDateTo: cust_filter_effective_date_to,
                    effectiveToDate: cust_filter_effective_to,
                    effectiveToTill: cust_filter_effective_to_till,
                    regFromDate: cust_filter_regist_date,
                    regToDate: cust_filter_regist_to_date,
                    intrestedItems: cust_filter_interst_item,
                    pointBalanceFrom: cust_filter_point_balance_from,
                    pointBalanceTo: cust_filter_point_balance_to,
                    exportPageFrom: cust_filter_export_page_index_from,
                    exportPageTo: cust_filter_export_page_index_to

                }).then(function ([customerIDSearchPagedDataCount, cnCustomerData, nsCustomerData, nsCustomerIds]) {
                    log.debug('cnCustomerData', cnCustomerData.length)
                    log.debug('nsCustomerData', nsCustomerData.length)
                    log.debug("customerIDSearchPagedDataCount", customerIDSearchPagedDataCount)
                    const combinedCustomerDataFullArr = nsCustomerData.concat(cnCustomerData);
                    log.debug('combinedCustomerDataFullArr', combinedCustomerDataFullArr);
                    log.debug('1customerListFullLength', combinedCustomerDataFullArr.length)
                    log.debug('customerSublist', customerSublist)
                    if (Number(customerIDSearchPagedDataCount) > 1000) {
                        // form.addSubmitButton({
                        //     id: 'change_page_btn',
                        //     label: 'Change Result Page',
                        // })
                        var f_pageIndex = form.getField({ id: "cust_filter_page_index" })
                        f_pageIndex.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.NORMAL
                        })
                        var f_exportPageIndexFrom = form.getField({ id: "cust_filter_export_page_index_from" })
                        var f_exportPageIndexTo = form.getField({ id: "cust_filter_export_page_index_to" })
                        f_exportPageIndexFrom.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.NORMAL
                        })
                        f_exportPageIndexTo.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.NORMAL
                        })
                        for (let i = 1; i < Math.ceil(customerIDSearchPagedDataCount / 1000); i++) {

                            f_pageIndex.addSelectOption({ value: i, text: i + 1 })
                            f_exportPageIndexFrom.addSelectOption({ value: i, text: i + 1 })
                            f_exportPageIndexTo.addSelectOption({ value: i, text: i + 1 })
                        }

                    }
                    if (combinedCustomerDataFullArr.length > 0) {
                        log.debug('setSublistItems', "start");
                        setSublistItems(customerSublist, combinedCustomerDataFullArr, nsCustomerIds)

                    }
                    log.debug("DataCount>1000?", Number(customerIDSearchPagedDataCount) > 1000)
                })
            }

            // 設定客戶端腳本模組路徑
            form.clientScriptModulePath = '../userevent/clientscript/cs_iv_mass_load_customer'
            // 在回應中寫入表單頁面
            response.writePage(form)
        } catch (e) {
            log.error('onRequest', e.toJSON ? e : e.stack ? e.stack : e.toString())
            context.response.write(e.toString())
        }
    }

    function layoutForm(form, filters) {
        // 檢查是否存在 custpage_filter_enddate 參數且不為空, 如果不存在，將 endDate 設定為當前日期
        // let endDate = date || dateNow()

        //建立按鈕(filter)
        form.addSubmitButton({
            id: 'filter',
            label: 'Search',
        })

        // 建立名為 "filters" 的欄位群組，標籤為 "Filter Criteria"
        form.addFieldGroup({
            id: 'filters',
            label: 'Filter Criteria',
        })
        form.addFieldGroup({
            id: 'page',
            label: 'Preview Page',
        })

        var f_nsSearchingFilters = form.addField({
            id: "cust_ns_filter",
            type: serverWidget.FieldType.LONGTEXT,
            label: "NS SEARCH FILTER",
        })
        f_nsSearchingFilters.defaultValue = filters.nsfilter
        f_nsSearchingFilters.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        })
        var f_cnSearchingFilters = form.addField({
            id: "cust_cn_filter",
            type: serverWidget.FieldType.LONGTEXT,
            label: "CN SEARCH FILTER",
        })
        f_cnSearchingFilters.defaultValue = filters.cnfilter
        f_cnSearchingFilters.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        })

        var f_pageIndex = form.addField({
            id: "cust_filter_page_index",
            type: serverWidget.FieldType.SELECT,
            label: "PAGE",
            container: "page"
        })
        f_pageIndex.addSelectOption({ value: 0, text: "1" })
        f_pageIndex.defaultValue = filters.page || 0;
        f_pageIndex.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        })

        var f_exportPageIndexFrom = form.addField({
            id: "cust_filter_export_page_index_from",
            type: serverWidget.FieldType.SELECT,
            label: "Export from PAGE",
            container: "page"
        })
        f_exportPageIndexFrom.addSelectOption({ value: 0, text: "1" })
        f_exportPageIndexFrom.defaultValue = filters.exportPageFrom || 0;
        f_exportPageIndexFrom.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        })

        var f_exportPageIndexTo = form.addField({
            id: "cust_filter_export_page_index_to",
            type: serverWidget.FieldType.SELECT,
            label: "Export to PAGE",
            container: "page"
        })
        f_exportPageIndexTo.addSelectOption({ value: 0, text: "1" })
        f_exportPageIndexTo.defaultValue = filters.exportPageTo || 0;
        f_exportPageIndexTo.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        })

        var f_month = form.addField({
            id: 'cust_filter_birthday_month',
            type: serverWidget.FieldType.MULTISELECT,
            label: 'Birthday Month',
            container: 'filters'
        })
        for (let month of const_1.MONTH) {
            f_month.addSelectOption({ value: month.value, text: month.text })
        }
        f_month.defaultValue = filters.birthdayMonth || '';

        var f_salutation = form.addField({
            id: 'cust_filter_salutation',
            type: serverWidget.FieldType.TEXT,
            label: 'Salutation',
            container: 'filters'
        });
        f_salutation.defaultValue = filters.salutation

        var f_lastname = form.addField({
            id: "cust_filter_lastname",
            type: serverWidget.FieldType.TEXT,
            label: "Last Name",
            container: 'filters'
        })
        f_lastname.defaultValue = filters.lastname

        var f_firstname = form.addField({
            id: "cust_filter_firstname",
            type: serverWidget.FieldType.TEXT,
            label: "First Name",
            container: 'filters'
        })
        f_firstname.defaultValue = filters.firstname

        var f_phone = form.addField({
            id: "cust_filter_phone",
            type: serverWidget.FieldType.TEXT,
            label: "Phone",
            container: 'filters'
        })
        f_phone.defaultValue = filters.phone

        var f_email = form.addField({
            id: "cust_filter_email",
            type: serverWidget.FieldType.TEXT,
            label: "Email",
            container: 'filters'
        })
        f_email.defaultValue = filters.email

        var f_customerID = form.addField({
            id: "cust_filter_customerid",
            type: serverWidget.FieldType.TEXT,
            label: "Customer ID",
            container: 'filters'
        })
        f_customerID.defaultValue = filters.customerid

        var f_age = form.addField({
            id: "cust_filter_age",
            type: serverWidget.FieldType.TEXT,
            label: "From Age",
            container: "filters"
        })
        var f_to_age = form.addField({
            id: "cust_filter_to_age",
            type: serverWidget.FieldType.TEXT,
            label: "To Age",
            container: "filters"
        })
        f_age.defaultValue = filters.age
        f_to_age.defaultValue = filters.toAge

        var f_referRef = form.addField({
            id: "cust_filter_refer_ref",
            type: serverWidget.FieldType.TEXT,
            label: "Referral Reference",
            container: "filters"
        })
        f_referRef.defaultValue = filters.referRef

        var f_dummyDate1 = form.addField({
            id: 'cust_filter_dummy_d1',
            type: serverWidget.FieldType.DATE,
            label: 'Dummy Date 1 (From)',
            container: 'filters'
        });
        f_dummyDate1.defaultValue = filters.dummyDate1

        var f_dummyDate1_to = form.addField({
            id: 'cust_filter_dummy_d1_to',
            type: serverWidget.FieldType.DATE,
            label: 'Dummy Date 1 (To)',
            container: 'filters'
        });
        f_dummyDate1_to.defaultValue = filters.dummyDate1To
        // f_dummyDate1_to.updateDisplayType({
        //     displayType: "HIDDEN"
        // })
        var f_dummyDate2 = form.addField({
            id: 'cust_filter_dummy_d2',
            type: serverWidget.FieldType.DATE,
            label: 'Dummy Date 2 (From)',
            container: 'filters'
        });
        var f_dummyDate2_to = form.addField({
            id: 'cust_filter_dummy_d2_to',
            type: serverWidget.FieldType.DATE,
            label: 'Dummy Date 2 (TO)',
            container: 'filters'
        });
        // f_dummyDate2_to.updateDisplayType({
        //     displayType: "HIDDEN"
        // })
        f_dummyDate2.defaultValue = filters.dummyDate2


        f_dummyDate2_to.defaultValue = filters.dummyDate2To

        var f_dummyText1 = form.addField({
            id: "cust_filter_dummy_t1",
            type: serverWidget.FieldType.TEXT,
            label: "Dummy Text 1",
            container: "filters"
        })
        f_dummyText1.defaultValue = filters.dummyText1

        var f_dummyText2 = form.addField({
            id: "cust_filter_dummy_t2",
            type: serverWidget.FieldType.TEXT,
            label: "Dummy Text 2",
            container: "filters"
        })
        f_dummyText2.defaultValue = filters.dummyText2

        var f_marketing = form.addField({
            id: "cust_filter_marketing",
            type: serverWidget.FieldType.SELECT,
            label: "Marketing & Promote",
            container: "filters"
        })
        f_marketing.defaultValue = filters.marketing || "T"
        f_marketing.addSelectOption({ value: "", text: "" })
        f_marketing.addSelectOption({ value: "T", text: "Yes" })
        f_marketing.addSelectOption({ value: "F", text: "No" })

        var f_tc = form.addField({
            id: "cust_filter_tc",
            type: serverWidget.FieldType.SELECT,
            label: "T&C",
            container: "filters"
        })
        f_tc.defaultValue = filters.tc || "T"
        f_tc.addSelectOption({ value: "", text: "" })
        f_tc.addSelectOption({ value: "T", text: "Yes" })
        f_tc.addSelectOption({ value: "F", text: "No" })

        var f_defualtLanguage = form.addField({
            id: "cust_filter_d_lang",
            type: serverWidget.FieldType.MULTISELECT,
            label: "Default Language",
            container: "filters"
        })
        for (let lang of const_1.LANGUAGE) {
            if (!!lang.value)
                f_defualtLanguage.addSelectOption({ value: lang.value, text: lang.text })
        }
        f_defualtLanguage.defaultValue = filters.dLang || ""

        var f_region = form.addField({
            id: "cust_filter_region",
            type: serverWidget.FieldType.MULTISELECT,
            label: "Residential Region",
            container: "filters"
        })
        for (let region of const_1.REGION) {
            if (!!region.value)
                f_region.addSelectOption({ value: region.value, text: region.text })
        }
        f_region.defaultValue = filters.region || ""

        var f_membership = form.addField({
            id: "cust_filter_membership",
            type: serverWidget.FieldType.MULTISELECT,
            label: "Membership Type",
            container: "filters"
        })
        for (let membership of const_1.MEMBERSHIP) {
            if (!!membership.value)
                f_membership.addSelectOption({ value: membership.value, text: membership.text })
        }
        f_membership.defaultValue = filters.membership || ''

        // custentity_iv_district
        var f_district = form.addField({
            id: 'cust_filter_district',
            type: serverWidget.FieldType.TEXT,
            label: "District",
            container: 'filters'
        })
        f_district.defaultValue = filters.district || '';

        var f_regist_date = form.addField({
            id: 'cust_filter_regist_date',
            type: serverWidget.FieldType.DATE,
            label: "Registration Date (From)",
            container: 'filters'
        })
        f_regist_date.defaultValue = filters.regFromDate || '';

        var f_regist_to_date = form.addField({
            id: 'cust_filter_regist_to_date',
            type: serverWidget.FieldType.DATE,
            label: "Registration Date (To)",
            container: 'filters'
        })
        // f_regist_to_date.updateDisplayType({
        //     displayType: "HIDDEN"
        // })
        f_regist_to_date.defaultValue = filters.regToDate || '';
        var f_effective_from = form.addField({
            id: 'cust_filter_effective_from',
            type: serverWidget.FieldType.DATE,
            label: "Effective Date (FROM)",
            container: 'filters'
        })
        f_effective_from.defaultValue = filters.effectiveDate;
        var f_effective_date_to = form.addField({
            id: 'cust_filter_effective_date_to',
            type: serverWidget.FieldType.DATE,
            label: "Effective Date (TO)",
            container: 'filters'
        })
        f_effective_date_to.defaultValue = filters.effectiveDateTo;
        var f_effective_to = form.addField({
            id: 'cust_filter_effective_to',
            type: serverWidget.FieldType.DATE,
            label: "Effective To (From)",
            container: 'filters'
        })
        f_effective_to.defaultValue = filters.effectiveToDate;
        var f_effective_to_till = form.addField({
            id: 'cust_filter_effective_to_till',
            type: serverWidget.FieldType.DATE,
            label: "Effective To (To)",
            container: 'filters'
        })
        f_effective_to_till.defaultValue = filters.effectiveToTill;
        var f_interst_item = form.addField({
            id: 'cust_filter_interst_item',
            type: serverWidget.FieldType.MULTISELECT,
            label: "Interested Products",
            container: 'filters',
            // source: "customlist_iv_item_cat_list"
        })
        allItemCat = search.create({
            type: "customlist_iv_item_cat_list",
            columns: [
                "name",
            ]
        }).run().getRange({ start: 0, end: 1000 })
        for (let itemcat of allItemCat) {
            f_interst_item.addSelectOption({ value: itemcat.id, text: itemcat.getValue("name") })
        }
        f_interst_item.defaultValue = filters.interst_item || '';
        // f_interst_item.removeSelectOption({
        //     value: null
        // })



        var f_pointBalance_from = form.addField({
            id: 'cust_filter_point_balance_from',
            type: serverWidget.FieldType.INTEGER,
            label: "Point Balance (From)",
            container: "filters"
        })
        f_pointBalance_from.defaultValue = filters.pointBalanceFrom
        var f_pointBalance_to = form.addField({
            id: 'cust_filter_point_balance_to',
            type: serverWidget.FieldType.INTEGER,
            label: "Point Balance (To)",
            container: "filters"
        })
        f_pointBalance_to.defaultValue = filters.pointBalanceTo
        var f_pointBalance_remarks = form.addField({
            id: 'cust_filter_point_balance_remarks',
            type: serverWidget.FieldType.TEXT,
            label: "*Point Balance Update once daily",
            container: "filters"
        })
        // f_pointBalance_remarks.defaultValue = "Point Balance Update Every 2 Hrs."
        f_pointBalance_remarks.updateDisplayType({ displayType: serverWidget.FieldDisplayType.INLINE })
        var f_searchTime = form.addField({
            id: 'cust_filter_saving_timestamp',
            type: serverWidget.FieldType.TEXT,
            label: "Search Time",
            container: 'filters',
            // defaultValue: moment().tz('Asia/Hong_Kong').format("YYYYMMDD_HHmmss")
        })
        f_searchTime.defaultValue = filters.searchTime || moment().tz('Asia/Hong_Kong').format("YYYYMMDD_HHmmss")
        f_searchTime.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN })
    }

    const createSublist = (form) => {
        // 創建一個內嵌的子清單
        const customerSublist = form.addSublist({
            id: 'custpage_cuslist_customer',
            type: serverWidget.SublistType.LIST,
            label: 'Customer',
            // tab: 'custpage_subtab_payment',
        })

        customerSublist.addField({
            id: 'cuslist_customerid',
            label: 'ID',
            type: serverWidget.FieldType.TEXT,
        })
        // .updateDisplayType({
        //     displayType: serverWidget.FieldDisplayType.HIDDEN,
        // })

        customerSublist.addField({
            id: 'cuslist_first_name',
            label: 'FIRST NAME',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_last_name',
            label: 'LAST NAME',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_salutation',
            label: 'SALUTATION',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_birthday_month',
            label: 'BIRTHDAY MONTH',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_age',
            label: 'AGE',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_area_code',
            label: 'AREA CODE',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_phone',
            label: 'PHONE',
            type: serverWidget.FieldType.TEXT,
        })

        customerSublist.addField({
            id: 'cuslist_email',
            label: 'EMAIL',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_default_language',
            label: 'DEFAULT LANGUAGE',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_residential_region',
            label: 'RESIDENTIAL REGION',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_district',
            label: 'DISTRICT',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_referral_ref',
            label: 'REFERRAL RREFERENCE',
            type: serverWidget.FieldType.TEXT,
        })
        let mpField = customerSublist.addField({
            id: 'cuslist_marketing_promote',
            label: 'MARKETING PROMOTE',
            type: serverWidget.FieldType.CHECKBOX,
        })
        mpField.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED,
        })
        let tcField = customerSublist.addField({
            id: 'cuslist_tc',
            label: 'TC',
            type: serverWidget.FieldType.CHECKBOX,
        })
        tcField.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED,
        })

        customerSublist.addField({
            id: 'cuslist_dummy_date1',
            label: 'DUMMY DATE 1',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_dummy_date2',
            label: 'DUMMY DATE 2',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_dummy_text1',
            label: 'DUMMY TEXT 1',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_member_type',
            label: 'MEMBER TYPE',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_registration_date',
            label: 'REGISTRATION DATE',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_effective_date',
            label: 'EFFECTIVE DATE',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_effective_to',
            label: 'EFFECTIVE TO',
            type: serverWidget.FieldType.TEXT,
        })
        customerSublist.addField({
            id: 'cuslist_welcome_gift_date',
            label: 'WELCOME GIFT DATE',
            type: serverWidget.FieldType.TEXT,
        })

        //20231024 Sam Add point balance
        customerSublist.addField({
            id: 'cuslist_point_balance',
            label: 'Outstanding Points',
            type: serverWidget.FieldType.TEXT,
        })
        return customerSublist
    }

    const setSublistItems = (sublist, customerList, nsCustomerIds) => {
        log.debug('setSublistItems', "start");
        const earnedRewardsDAO = new EarnedRewardsDAO()
        log.debug("ncCustomerIds", nsCustomerIds)
        const customerPointBalanceList = earnedRewardsDAO.findCustomerPointBalance(nsCustomerIds)
        let customerLine = 0
        dateUtils = new DateUtils()
        log.debug("customerPointBalanceList", customerPointBalanceList)
        customerList.forEach((customer) => {
            if (!customer) return;

            sublist.setSublistValue({
                id: 'cuslist_customerid',
                line: customerLine,
                value: customer.customerID,
            })

            sublist.setSublistValue({
                id: 'cuslist_first_name',
                line: customerLine,
                value: customer.firstName || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_last_name',
                line: customerLine,
                value: customer.lastName || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_salutation',
                line: customerLine,
                value: customer.salutation || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_birthday_month',
                line: customerLine,
                value: customer.birthdayMonth || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_age',
                line: customerLine,
                value: customer.age || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_phone',
                line: customerLine,
                value: customer.phone || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_email',
                line: customerLine,
                value: customer.email || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_default_language',
                line: customerLine,
                value: customer.defaultLanguage || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_residential_region',
                line: customerLine,
                value: customer.residentialRegion || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_district',
                line: customerLine,
                value: customer.district || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_referral_ref',
                line: customerLine,
                value: customer.referralRef || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_marketing_promote',
                line: customerLine,
                value: customer.marketingPromote,
            })

            sublist.setSublistValue({
                id: 'cuslist_tc',
                line: customerLine,
                value: customer.tc,
            })

            sublist.setSublistValue({
                id: 'cuslist_dummy_date1',
                line: customerLine,
                value: customer.dummyDate1 || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_dummy_date2',
                line: customerLine,
                value: customer.dummyDate2 || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_dummy_text1',
                line: customerLine,
                value: customer.dummyText1 || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_member_type',
                line: customerLine,
                // value: customer.memberType || '-',
                value: (!customer.memberType ? " - " : isNaN(customer.memberType) ? customer.memberType : const_1.MEMBERSHIP.find(targetMembership => targetMembership.value == customer.memberType).text) || '-',

            })

            sublist.setSublistValue({
                id: 'cuslist_registration_date',
                line: customerLine,
                value: customer.registrationDate || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_effective_date',
                line: customerLine,
                value: customer.effectiveDate || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_effective_to',
                line: customerLine,
                value: customer.effectiveToDate || '-',
            })

            sublist.setSublistValue({
                id: 'cuslist_welcome_gift_date',
                line: customerLine,
                value: customer.welcomeGiftDate || '-',
            })
            try {
                // let customerPointBalanceList_keys = Object.keys(customerPointBalanceList)
                let pointBalance = null
                // log.debug("customerPointBalanceList_keys", customerPointBalanceList_keys)

                // if (customerPointBalanceList_keys.indexOf(customer.ns_customer_id) != -1) {
                //     let rewardRecordList = customerPointBalanceList[customer.ns_customer_id]
                //     pointBalance = rewardRecordList[rewardRecordList.length - 1]["pointBalance"]
                // } else {
                pointBalance = customer.outstandingPoint
                // }
                sublist.setSublistValue({
                    id: 'cuslist_point_balance',
                    line: customerLine,
                    value: pointBalance || '0',
                })
            } catch (error) {
                log.debug('error', error);
                log.debug('error stack', error.stack);


            }
            customerLine++
        })
        log.debug("customerLine", customerLine)
    }

    const searchNSCustomerList = (form, searchCriteria) => {
        const chinaDBServices = new ChinaDBServices()
        var cnCustomerFullArr
        let customerlist = []
        const filters = searchFilterComplier(searchCriteria)

        let f_ns_filter = form.getField({ id: "cust_ns_filter" })
        f_ns_filter.defaultValue = JSON.stringify(filters)
        let f_cn_filter = form.getField({ id: "cust_cn_filter" })
        f_cn_filter.defaultValue = JSON.stringify(searchCriteria)

        log.debug('filters', filters)
        log.debug('searchCriteria', JSON.stringify(searchCriteria))
        let cnCustomerDataPromise = new Promise(function (resolve, reject) {

            N_1.https.get.promise({
                url: `https://iehcnapiapp.chinacloudsites.cn/api/customer/all-customers?CURRENT_ENV=${const_2.CURRENT_ENV}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                log.debug("CHECK", response)
                cnCustomerFullArr = JSON.parse(response.body).result
                log.debug('cnCustomerFullArr', cnCustomerFullArr.length)
                log.debug('cnCustomerFullArrTestData', cnCustomerFullArr[0]);

                let cnFilteredArr = cnFilterCustomerFullArr(searchCriteria, cnCustomerFullArr, form);
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
                        district: result.DISTRICT,
                        referralRef: result.REFERRAL_REFERENCE,
                        marketingPromote: result.MARKETING_PROMOTE ? 'T' : 'F',
                        tc: result.TC ? 'T' : 'F',
                        dummyDate1: result.DUMMY_DATE1,
                        dummyDate2: result.DUMMY_DATE2,
                        dummyText1: result.DUMMY_TEXT1,
                        memberType: result.MEMBER_TYPE,
                        registrationDate: result.REGISTRATION_DATE,
                        effectiveDate: result.EFFECTIVE_DATE,
                        effectiveToDate: result.EFFECTIVE_TO,
                        welcomeGiftDate: result.WELCOME_GIFT_DATE,
                        outstandingPoint: result.outstandingPoint
                        // pointBalance: customerData.POINT_BALANCE,
                        // cumulativeAmt: customerData.CUMULATIVE_AMT,
                        // spendingTo: customerData.SPENDING_TO,
                        // nextTier: customerData.NEXT_TIER,
                    })
                }
                log.debug("customerlist", cnCustomerList)
                resolve(cnCustomerList);
            }).catch(function (error) {
                log.debug('error', error);
                log.debug('error stack', error.stack);
                log.error('Error occurred while retrieving customer data from CNDB', error.message + "<br/>" + error.stack);
            });
        })


        dateUtils = new DateUtils()
        try {

            var customerIDSearch = compileNSSearchObject(filters);
            var customerIDSearchPagedDataCountPromise = new Promise(function (resolve, reject) {
                let customerCount = customerIDSearch.runPaged().count
                log.debug("customerCount", customerCount)
                resolve(customerCount)
            })
        } catch (e) {
            log.debug("Error on ns Search: ", e.toString())
        }

        let nsCustomerIds = []
        let nsCustomerDataPromise = new Promise(function (resolve, reject) {

            let nsCustomerList = []
            customerIDSearchPagedDataCount = customerIDSearch.runPaged().count
            log.debug('customerIDSearchPagedData', customerIDSearchPagedDataCount)
            // for (let i = 0; i < Math.ceil(customerIDSearchPagedDataCount / 1000); i++) {
            // if (i == 10) break;
            let nsSearchResult = customerIDSearch.run().getRange({ start: 1000 * (searchCriteria.page), end: (1000 * (searchCriteria.page)) + 999 });
            for (let result of nsSearchResult) {
                nsCustomerIds.push(result.id)
                nsCustomerList.push({
                    ns_customer_id: result.id,
                    customerID: result.getValue("entityid"),
                    firstName: result.getValue('firstname'),
                    lastName: result.getValue('lastname'),
                    salutation: result.getValue('salutation'),
                    birthdayMonth: `${result.getValue('custentity_iv_cl_birthday')}`,
                    age: `${result.getValue('custentity_iv_cl_age')}`,
                    phone: `${result.getValue('phone')}`,
                    email: result.getValue('email'),
                    defaultLanguage: result.getText('custentity_iv_default_language'),
                    residentialRegion: result.getText('custentity_iv_residential_region'),
                    district: result.getValue('custentity_iv_district'),
                    referralRef: result.getValue('custentity_iv_referral_reference'),
                    marketingPromote: result.getValue(
                        'custentity_iv_marketing_promotion_info'
                    ) ? 'T' : 'F',
                    tc: result.getValue(
                        'custentity_iv_customer_data_policy'
                    ) ? 'T' : 'F',
                    dummyDate1: result.getValue('custentity_iv_dummy_date1'),
                    dummyDate2: result.getValue('custentity_iv_dummy_date2'),
                    dummyText1: result.getValue('custentity_iv_dummy_text1'),
                    memberType: result.getText('custentity_iv_cl_member_type'),
                    registrationDate: result.getValue('custentity_iv_registration_date'),
                    effectiveDate: result.getValue('custentity_iv_cl_effective_date'),
                    effectiveToDate: result.getValue('custentity_iv_cl_effective_to'),
                    welcomeGiftDate: result.getValue('custentity_iv_welcome_gift_provision_day'),
                    outstandingPoint: result.getValue('custentity_iv_cl_outstanding_pts_storage'),

                })
            }
            log.debug("Completed Page Counter:", i + 1)
            checkScriptRemainingUsage();
            // break;
            // }
            resolve(nsCustomerList);
        })

        return Promise.all([customerIDSearchPagedDataCountPromise, cnCustomerDataPromise, nsCustomerDataPromise, nsCustomerIds]);

    }

    const searchFilterComplier = ({ birthdayMonth, salutation, lastname, firstname, phone, customerid, age, toAge, referRef, dummyDate1, dummyDate2, dummyDate1To, dummyDate2To, dummyText1, dummyText2, marketing, tc, dLang, region, membership, email, district, effectiveDate, effectiveDateTo, effectiveToDate, regFromDate, regToDate, effectiveToTill, intrestedItems, pointBalanceFrom, pointBalanceTo }) => {
        const filters = [
            ['custentity_iv_cl_member_type', 'noneof', '@NONE@'],
            "AND",
            ["custentity_iv_registration_date", "isnotempty", ""],
            "AND",
            ["custentity_iv_ischina", "is", "F"]
        ];
        if (birthdayMonth && birthdayMonth !== '') {
            let birthdayFilter = []
            let birthdayMonthArr = birthdayMonth.split('\u0005')
            birthdayFilter.push(['custentity_iv_cl_birthday', 'equalto', birthdayMonthArr[0]]);
            if (birthdayMonthArr.length > 1) {
                for (let i = 1; i < birthdayMonthArr.length; i++) {
                    birthdayFilter.push('OR', ['custentity_iv_cl_birthday', 'equalto', birthdayMonthArr[i]])
                }
            }
            filters.push('AND', birthdayFilter)
        }
        if (pointBalanceFrom) {
            filters.push('AND', ["custentity_iv_cl_outstanding_pts_storage", "greaterthanorequalto", `${pointBalanceFrom}`])
        }
        if (pointBalanceTo) {
            filters.push('AND', ["custentity_iv_cl_outstanding_pts_storage", "lessthanorequalto", `${pointBalanceTo}`])
        }
        // if (age && age !== '') {
        //     filters.push('AND', ['custentity_iv_cl_age', 'equalto', age]);
        // }
        if (toAge && toAge != '' && age && age !== '') {
            filters.push('AND', [["custentity_iv_cl_age", "greaterthanorequalto", age], "AND", ["custentity_iv_cl_age", "lessthanorequalto", toAge]]);
        }
        if (marketing && marketing !== '') {
            filters.push('AND', ['custentity_iv_marketing_promotion_info', 'is', marketing]);
        }
        if (tc && tc !== '') {
            filters.push('AND', ['custentity_iv_customer_data_policy', 'is', tc]);
        }
        if (dLang && dLang !== '') {
            filters.push('AND', ['custentity_iv_default_language', 'anyof', dLang]);
        }
        if (region && region !== '') {
            filters.push('AND', ['custentity_iv_residential_region', 'anyof', region]);
        }
        if (membership && membership !== '') {
            filters.push('AND', ['custentity_iv_cl_member_type', 'anyof', membership]);
        }
        if (dummyDate1 && dummyDate1 !== '') {
            filters.push('AND', ['custentity_iv_dummy_date1', 'onorafter', dummyDate1]);
        }
        if (dummyDate2 && dummyDate2 !== '') {
            filters.push('AND', ['custentity_iv_dummy_date2', 'onorafter', dummyDate2]);
        }

        if (dummyDate1To && dummyDate1To !== '') {
            filters.push('AND', ['custentity_iv_dummy_date1', 'onorbefore', dummyDate1To]);
        }
        if (dummyDate2 && dummyDate2To !== '') {
            filters.push('AND', ['custentity_iv_dummy_date2', 'onorbefore', dummyDate2To]);
        }

        if (effectiveDate && effectiveDate !== '') {
            filters.push('AND', ['custentity_iv_cl_effective_date', 'onorafter', effectiveDate]);
        }

        log.debug("effectiveDateTo", effectiveDateTo)
        if (effectiveDateTo && effectiveDateTo !== "") {
            filters.push('AND', ['custentity_iv_cl_effective_date', 'onorbefore', effectiveDateTo]);
        }

        if (effectiveToDate && effectiveToDate != "") {
            filters.push('AND', ['custentity_iv_cl_effective_to', 'onorafter', effectiveToDate]);
        }
        if (effectiveToTill && effectiveToTill !== "") {
            filters.push('AND', ['custentity_iv_cl_effective_to', 'onorbefore', effectiveToTill]);
        }

        if (regFromDate && regFromDate !== '') {
            log.debug("regFronmDate", regFromDate)
            filters.push('AND', ['custentity_iv_registration_date', 'onorafter', `${regFromDate} 12:00 am`]);
        }
        if (regToDate && regToDate != "") {
            filters.push('AND', ['custentity_iv_registration_date', 'onorbefore', `${regToDate} 11:59 pm`]);
        }
        if (intrestedItems) {

            let intrestedItemsArr = intrestedItems.split('\u0005')
            if (intrestedItemsArr.length > 0) {
                filters.push('AND', ['custentity_iv_interested_products', 'anyof', intrestedItemsArr])
            }
        }


        const commonFilterConditions = [
            { key: 'salutation', value: salutation },
            { key: 'lastname', value: lastname },
            { key: 'firstname', value: firstname },
            { key: 'phone', value: phone },
            { key: 'entityid', value: customerid },
            { key: 'custentity_iv_referral_reference', value: referRef },
            { key: 'custentity_iv_dummy_text1', value: dummyText1 },
            { key: 'custentity_iv_dummy_text2', value: dummyText2 },
            { key: 'email', value: email },
            { key: 'custentity_iv_district', value: district },
        ];

        commonFilterConditions.forEach(({ key, value }) => {
            if (value && value !== '') {
                filters.push('AND', [key, 'contains', value]);
            }
        });
        log.debug("filters", filters)

        return filters;
    }

    function compileNSSearchObject(searchFilters) {
        // 01: Define Search Result Column
        var customerSearchColInternalId = N_1.search.createColumn({ name: 'internalid' })
        var customerSearchColFirstName = N_1.search.createColumn({ name: 'firstname' })
        var customerSearchColMiddleName = N_1.search.createColumn({ name: 'middlename' })
        var customerSearchColLastName = N_1.search.createColumn({ name: 'lastname' })
        var customerSearchColSalutation = N_1.search.createColumn({ name: 'salutation' })
        var customerSearchColBirthdayMonth = N_1.search.createColumn({ name: 'custentity_iv_cl_birthday' })
        var customerSearchColAge = N_1.search.createColumn({ name: 'custentity_iv_cl_age' })
        var customerSearchColMobilePhone = N_1.search.createColumn({ name: 'phone' })
        var customerSearchColEmail = N_1.search.createColumn({ name: 'email' })
        var customerSearchColDefaultLanguage = N_1.search.createColumn({ name: 'custentity_iv_default_language' })
        var customerSearchColInterestedProducts = N_1.search.createColumn({
            name: 'custentity_iv_interested_products',
        })
        var customerSearchColRegistrationDate = N_1.search.createColumn({ name: 'custentity_iv_registration_date' })
        var customerSearchColResidentialRegion = N_1.search.createColumn({ name: 'custentity_iv_residential_region' })
        var customerSearchColEffectiveDate = N_1.search.createColumn({ name: 'custentity_iv_cl_effective_date' })
        var customerSearchColEffectiveTo = N_1.search.createColumn({ name: 'custentity_iv_cl_effective_to' })
        var customerSearchColWelcomeGiftProvisioningDate = N_1.search.createColumn({
            name: 'custentity_iv_welcome_gift_provision_day',
        })
        var customerSearchColOutstandingPoints = N_1.search.createColumn({
            name: 'custentity_iv_cl_outstanding_points',
        })
        var customerSearchColReferralReference = N_1.search.createColumn({ name: 'custentity_iv_referral_reference' })
        var customerSearchColAcceptMarketingPromotionInformation = N_1.search.createColumn({
            name: 'custentity_iv_marketing_promotion_info',
        })
        var customerSearchColAcceptTcAndCustomerDataPrivacyPolicy = N_1.search.createColumn({
            name: 'custentity_iv_customer_data_policy',
        })
        var customerSearchColMemberType = N_1.search.createColumn({ name: 'custentity_iv_cl_member_type' })
        var customerSearchColNameInSimplifiedChinese = N_1.search.createColumn({
            name: 'custrecord_iv_schinese_name',
            join: 'CUSTENTITY_IV_CL_MEMBER_TYPE',
        })
        var customerSearchColNameInTraditionalChinese = N_1.search.createColumn({
            name: 'custrecord_iv_tchinese_name',
            join: 'CUSTENTITY_IV_CL_MEMBER_TYPE',
        })
        var customerSearchColId = N_1.search.createColumn({ name: 'entityid', sort: N_1.search.Sort.ASC })
        var customerSearchColComments = N_1.search.createColumn({ name: 'comments' })
        var customerSearchColAreaCode = N_1.search.createColumn({ name: 'custentity_iv_customer_areacode' })
        // var customerSearchColAddress1 = N_1.search.createColumn({ name: 'address1' })
        var customerSearchColDistrict = N_1.search.createColumn({ name: 'custentity_iv_district' })
        var customerSearchColDummyDate1 = N_1.search.createColumn({ name: 'custentity_iv_dummy_date1' })
        var customerSearchColDummyDate2 = N_1.search.createColumn({ name: 'custentity_iv_dummy_date2' })
        var customerSearchColDummyText1 = N_1.search.createColumn({ name: 'custentity_iv_dummy_text1' })
        var customerSearchColIsChina = N_1.search.createColumn({ name: 'custentity_iv_ischina' })
        var customerSearchColMergePointBalance = N_1.search.createColumn({
            name: 'custentity_iv_customer_merge_pt_bal',
        })
        var customerSearchColInactive = N_1.search.createColumn({ name: 'isinactive' })
        var customerSearchColPointBalance = N_1.search.createColumn({ name: 'custentity_iv_cl_outstanding_pts_storage' })

        log.debug("searchFilters", searchFilters)
        //02: Create Search Obj
        const customerIDSearch = N_1.search.create({
            type: 'customer',
            filters: searchFilters,
            columns: [
                N_1.search.createColumn({
                    name: 'entityid',
                    sort: N_1.search.Sort.ASC,
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
                customerSearchColInactive,
                customerSearchColPointBalance
            ],
        })
        return customerIDSearch;
    }

    function cnFilterCustomerFullArr({ birthdayMonth, salutation, lastname, firstname, phone, customerid, age, referRef, dummyDate1, dummyDate2, dummyDate1To, dummyDate2To, dummyText1, dummyText2, marketing, tc, dLang, region, membership, email, district, regFromDate, regToDate, effectiveDate, effectiveDateTo, effectiveToDate, effectiveToTill, intrestedItems, pointBalanceFrom, pointBalanceTo }, cnCustomerFullArr, form) {
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
        log.debug("cnCustomerFullArr", cnCustomerFilterArr)
        log.debug("pointBalanceFrom", pointBalanceFrom)
        if (pointBalanceFrom) {
            cnCustomerFilterArr = cnCustomerFilterArr.filter((customer) => {
                return Number(customer.outstandingPoint) >= Number(pointBalanceFrom)
            })
        }
        log.debug("pointBalanceTo", pointBalanceTo)
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
            // let dLangObj = const_1.LANGUAGE.filter(lang => lang.value == dLang)
            let dLangObj = const_1.LANGUAGE.filter(lang => dLang.includes(lang.value))
            cnCustomerFilterArr = cnCustomerFilterArr.filter(customer => customer.D_LANG == dLangObj[0].text);
        }
        if (region && region != "") {
            log.debug("region", region)
            if (!Array.isArray(region)) region = [region]
            let regionObj = const_1.REGION.filter(targetRegion => region.includes(targetRegion.value))
            log.debug('regionObj', regionObj);
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
        log.debug("cnCustomerFilterArr", cnCustomerFilterArr);
        return cnCustomerFilterArr;
    }

    function checkScriptRemainingUsage() {
        var script = N_1.runtime.getCurrentScript()
        var remainingUsage = script.getRemainingUsage()
        log.debug('remainingUsage', remainingUsage);
    }
    function checkUserPermission() {
        var userObj = N_1.runtime.getCurrentUser();
        var docuPermission = userObj.getPermission({
            name: 'LIST_FILECABINET'
        });
        // var customerPermission = userObj.getPermission({
        //     name: 'LIST_CUSTJOB'
        // });
        log.debug("USerID", userObj.id)
        log.debug("docuPermission", docuPermission)
        // log.debug("customerPermission", customerPermission)

        return [N_1.runtime.Permission.EDIT, N_1.runtime.Permission.FULL].includes(docuPermission)
        // && [N_1.runtime.Permission.EDIT, N_1.runtime.Permission.FULL].includes(customerPermission);
    }

    function getFilesInFolder(savingTimeStamp) {
        log.debug("SavingTimeStampSearchonList&Export", savingTimeStamp)
        var fileSearch = search.create({
            type: search.Type.FOLDER,
            filters: [["file.name", "contains", `${savingTimeStamp}`]],
            columns: [
                search.createColumn({
                    name: "name",
                    sort: search.Sort.ASC
                }),
                "foldersize",
                "lastmodifieddate",
                "parent",
                "numfiles",
                search.createColumn({
                    name: "hostedpath",
                    join: "file"
                }),
                search.createColumn({
                    name: "internalid",
                    join: "file"
                }),
                search.createColumn({
                    name: "name",
                    join: "file"
                }),
                search.createColumn({
                    name: "url",
                    join: "file"
                })
            ],
        });

        var files = [];
        fileSearch.run().each(function (result) {
            var fileId = result.getValue({
                name: 'internalid',
                join: 'file'
            });
            // console.log("result", JSON.stringify(result))
            if (fileId) {
                var fileName = result.getValue({ name: 'name', join: 'file' });
                var fileURL = result.getValue({ name: "url", join: "file" })
                // var fileContent = file
                //   .load({
                //     id: fileId
                //   })
                //   .getContents();

                files.push({
                    type: 'file',
                    name: fileName,
                    url: fileURL
                    //   fullPath: folderPath + '/' + fileName,
                    //   content: fileContent
                });
            }
            return true;
        });

        // In case of empty folder return the folder name
        // if (files.length == 0) {
        //     files.push({
        //         type: 'folder',
        //         fullPath: folderPath
        //     });
        // }

        return files;
    }

    return {
        onRequest: onRequest,
    }
})