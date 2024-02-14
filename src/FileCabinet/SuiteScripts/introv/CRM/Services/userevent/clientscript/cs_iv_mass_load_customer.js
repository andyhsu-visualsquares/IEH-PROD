/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N', "../../../DAO/ScriptDeploymentDAO.js", "N/https", "N/url", "N/ui/message", "N/currentRecord", "N/search", 'N/format', '../../../Constants/Constants'], function (N_1, ScriptDeploymentDAO, https, url, message, currentRecord, search, format, const_1) {

    function pageInit(context) {
        try {
            let BusyMsg = message.create({ type: message.Type.WARNING, title: "Busy", message: "Please wait...", })
            console.log('Initial')
            let genExcelSLScriptId = "customscript_iv_export_customer_data_sl"
            let genExcelSLDeployId = "customdeploy_iv_export_customer_data_sl"
            var response = https.post({
                url: url.resolveScript(
                    {
                        scriptId: genExcelSLScriptId,
                        deploymentId: genExcelSLDeployId,
                        returnExternalUrl: true
                    }),
                body: JSON.stringify("getScriptStatus"),
                headers: { name: 'Accept-Language', value: 'en-us' }
            });
            console.log('response', response);
            console.log('response body', response.body);
            let responseBody = JSON.parse(response.body)
            let responseProcessing = responseBody.processing
            let responseExcels = responseBody.excelIds
            console.log('responseExcels', responseExcels);
            if (responseProcessing == "busy") BusyMsg.show({ duration: 3000 })

        } catch (error) {
            console.log('error', error);

        }
    }

    function fieldChanged(context) {
        if (context.fieldId == "cust_filter_export_page_index_to") {
            const rec = currentRecord.get()
            const exportFromPage = rec.getValue('cust_filter_export_page_index_from')
            const exportToPage = rec.getValue('cust_filter_export_page_index_to')

            if (Number(exportToPage) - Number(exportFromPage) + 1 > 80) {
                alert('Export Covers No More Than 80 Pages Per Execution')
                rec.setValue(context.fieldId, Number(exportFromPage) + 79)
                return false
            }
        }

        // if (context.fieldId == "cust_filter_to_age") {
        //     const rec = currentRecord.get()
        //     const fromAge = rec.getValue('cust_filter_age')
        //     const toAge = rec.getValue('cust_filter_to_age')
        //     if (!fromAge) rec.setValue('cust_filter_age', toAge, true)
        //     if (toAge < fromAge && toAge && fromAge) {
        //         alert('To Age should be greater than From Age')
        //         rec.setValue(context.fieldId, fromAge, true)
        //         return false
        //     }
        // }
    }

    function ageAlert(rec, toAge, fromAge, fieldId) {
        alert('To Age should be greater than From Age')
        rec.setValue(fieldId, "", true)
        return false
    }
    function exportDataToExcel(savingTimeStamp) {
        let folderUrl = "https://5112262.app.netsuite.com/app/common/media/mediaitemfolders.nl?whence="
        let CompleteMsg = message.create({ type: message.Type.CONFIRMATION, title: "Excel Saved", message: folderUrl, })
        let BusyMsg = message.create({ type: message.Type.WARNING, title: "Generating Customer Report", message: "Please wait...", })
        let genExcelSLScriptId = "customscript_iv_export_customer_data_sl"
        let genExcelSLDeployId = "customdeploy_iv_export_customer_data_sl"
        BusyMsg.show()
        let currRec = N_1.currentRecord.get()
        let nsFilters = currRec.getValue("cust_ns_filter")
        let cnFilters = currRec.getValue("cust_cn_filter")
        let exportFromPageIndex = currRec.getValue("cust_filter_export_page_index_from")
        let exportToPageIndex = currRec.getValue("cust_filter_export_page_index_to")
        // let lineCount = currRec.getLineCount({ sublistId: "custpage_cuslist_customer" });
        // let customerDataArr = []
        // for (let i = 0; i < lineCount; i++) {
        //     let customer = {
        //         customerID: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_customerid", line: i }),
        //         firstName: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_first_name", line: i }),
        //         lastName: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_last_name", line: i }),
        //         salutation: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_salutation", line: i }),
        //         birthdayMonth: `${currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_birthday_month", line: i })}`,
        //         age: `${currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_age", line: i }) || "-"}`,
        //         phone: `${currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_phone", line: i })}`,
        //         email: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_email", line: i }),
        //         defaultLanguage: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_default_language", line: i }),
        //         residentialRegion: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_residential_region", line: i }),
        //         // district: customerData.REGION,
        //         referralRef: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_referral_ref", line: i }),
        //         marketingPromote: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_marketing_promote", line: i }) ? 'T' : 'F',
        //         tc: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_tc", line: i }) ? 'T' : 'F',
        //         dummyDate1: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_dummy_date1", line: i }),
        //         dummyDate2: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_dummy_date2", line: i }),
        //         dummyText1: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_dummy_text1", line: i }),
        //         memberType: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_member_type", line: i }),
        //         registrationDate: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_registration_date", line: i }),
        //         effectiveDate: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_effective_date", line: i }),
        //         effectiveToDate: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_effective_to", line: i }),
        //         welcomeGiftDate: currRec.getSublistValue({ sublistId: "custpage_cuslist_customer", fieldId: "cuslist_welcome_gift_date", line: i }),
        //     }
        //     customerDataArr.push(customer)
        // }
        // Trigger Export & Download On Calling Other SL
        // let sURL = N_1.url.resolveScript({
        //     scriptId: 'customscript_iv_export_customer_data_sl',
        //     deploymentId: 'customdeploy_iv_export_customer_data_sl',
        //     returnExternalUrl: false,
        //     // params: {
        //     //     custscript_iv_customer_data: JSON.stringify(customerDataArr)
        //     //     // "custscript_iv_customer_data": "HIHI"
        //     // },
        // })
        // console.log("customerDataArrLength", customerDataArr)
        // console.log('StringLength', customerDataArr)
        // N_1.https.post.promise({
        //     url: sURL,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ customerDataArr })
        // }).then(function (response) {
        //     let fileBlob = new Blob([response.body], { type: 'application/vnd.ms-excel' });

        //     // Create a temporary anchor element to initiate the file download
        //     let downloadLink = document.createElement('a');
        //     downloadLink.href = URL.createObjectURL(fileBlob);
        //     downloadLink.download = `CustomerSearch_${moment().format("YYYY-MM-DD-HH-mm-ss")}.xls`;

        //     // Trigger the download
        //     downloadLink.click();

        // }).catch(function (error) {
        //     console.log('Error:', error);
        // });




        let sURL = N_1.url.resolveScript({
            //Trigger Export & Download By Bulk Loading by Calling SL -> SS

            scriptId: 'customscript_iv_trigger_bulk_loading_sl',
            deploymentId: 'customdeploy_iv_trigger_bulk_loading_sl',
            // params: {
            //     'custscript_iv_search_filters': JSON.stringify({ customerDataArr }),
            // }
        });
        // var now = new Date();
        // var savingTimeStamp = format.format({
        //     value: now,
        //     type: format.Type.DATETIMETZ
        // })
        N_1.https.post({
            url: sURL,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nsFilters, cnFilters, savingTimeStamp, exportFromPageIndex, exportToPageIndex })
        })
        let pendingCheckAttempt = 0
        let getCreateExcelSSStatus = getScriptStatus("customscript_iv_bulk_load_customer_data")
        if (getCreateExcelSSStatus != 0) jQuery(document.querySelector("#print")).hide()

        let myInterval = setInterval(function () {
            let response = callGenExcelSL()

            let getCreateExcelSSStatus = getScriptStatus("customscript_iv_bulk_load_customer_data")
            if (getCreateExcelSSStatus != 0) jQuery(document.querySelector("#print")).hide()
            let responseBody = JSON.parse(response.body)
            let processStatus = responseBody.processing
            let fileUrls = responseBody.excelIds
            console.log('fileUrls', fileUrls);
            console.log('responseBody', responseBody);
            pendingCheckAttempt++
            // if (pendingCheckAttempt === 99) {
            //     let refreshMsg = message.create({ type: message.Type.WARNING, title: "Please Refresh This Page To Continue", message: "Download button will show after refresh if the export report is ready.", })
            //     clearInterval(myInterval);
            //     BusyMsg.hide()
            //     refreshMsg.show()
            // }
            if (processStatus == "idle" && getCreateExcelSSStatus == 0) {
                let urls = getFilesInFolder(savingTimeStamp)
                console.log("urls", urls)
                if (urls.length > 0) {
                    let bulkexportSlURL = N_1.url.resolveScript({
                        scriptId: "customscript_iv_list_export_customer_sl",
                        deploymentId: "customdeploy_iv_list_export_customer_sl",
                        params: {
                            'cust_filter_saving_timestamp': savingTimeStamp
                        }
                    })
                    // + '?cust_filter_saving_timestamp=' + savingTimeStamp
                    N_1.https.post({
                        url: bulkexportSlURL,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ downloadUrls: urls }),
                        // params: {
                        //     'cust_filter_saving_timestamp': savingTimeStamp
                        // }
                    })
                }
                BusyMsg.hide()
                CompleteMsg.show()
                jQuery("#print").hide();
                clearInterval(myInterval);
                // window.open(location.href, '_self')
                location.reload()
                // window.open(const_1.BASE_URL + '/app/site/hosting/scriptlet.nl', '_self')
            }

            // if (!responseProcessing) {
            //     CompleteMsg.show()
            //     BusyMsg.hide()
            //     clearInterval(myInterval);
            // } else { 
            // BusyMsg.show() 
            // CompleteMsg.hide()
            // }
        }, 36300);
        // console.log("bulkExportScriptTaskID", bulkExportScriptTaskID);
    }

    function callGenExcelSL() {
        let genExcelSLScriptId = "customscript_iv_export_customer_data_sl"
        let genExcelSLDeployId = "customdeploy_iv_export_customer_data_sl"
        var response = https.post({
            url: url.resolveScript(
                {
                    scriptId: genExcelSLScriptId,
                    deploymentId: genExcelSLDeployId,
                    returnExternalUrl: true
                }),
            body: JSON.stringify("getScriptStatus"),
            headers: { name: 'Accept-Language', value: 'en-us' }
        });
        let getCreateExcelSSStatus = getScriptStatus("customscript_iv_bulk_load_customer_data")
        if (getCreateExcelSSStatus != 0) jQuery(document.querySelector("#print")).hide()
        return response
    }

    function getScriptStatus(scriptId) {
        var ssiSearchObj = search.create({
            type: search.Type.SCHEDULED_SCRIPT_INSTANCE,
            filters: [
                ["status", "anyof", "PENDING", "PROCESSING"],
                "AND",
                ["script.scriptid", "is", scriptId],
            ],
        });
        let statusCount = ssiSearchObj.runPaged().count
        return statusCount
    }

    function getFilesInFolder(savingTimeStamp) {
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

    function downloadFiles(downloadUrlString) {
        let urlArr = JSON.parse(downloadUrlString)
        console.log("urlArr", urlArr)
        for (let details of urlArr) {
            // window.setTimeout(() => download(details.url), 500)
            window.open(const_1.BASE_URL + details.url, "_blank")

        }
        let exportPageUrl = url.resolveScript({
            scriptId: "customscript_iv_list_export_customer_sl",
            deploymentId: "customdeploy_iv_list_export_customer_sl"
        })
        window.open(const_1.BASE_URL + exportPageUrl, "_blank")
        // window.close()
    }


    return {
        pageInit: pageInit,
        exportDataToExcel: exportDataToExcel,
        downloadFiles: downloadFiles,
        // saveRecord: saveRecord,
        // validateField: validateField,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});
