/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 *
 * Script Name : MR Auto Invoice Website SO
 * Script Id : customscript_auto_invoice_website_so_mr
 * Deploy Id : customdeploy_auto_invoice_website_so_mr
 **/
define(['N/error', 'N/format', 'N/log', 'N/record', 'N/search', '../../DAO/ScriptErrorDAO'], function (
    error,
    format,
    log,
    record,
    search,
    ScriptErrorDAO
) {
    function getInputData() {
        const MAX_PROCESS_LINE = 100
        var itemfulfillmentSearchObj = search.create({
            type: 'salesorder',
            filters: [
                ['type', 'anyof', 'SalesOrd'],
                'AND',
                ['custbody_website_so', 'isnotempty', ''],
                'AND',
                // ["mainline","is","T"],
                // "AND",
                // ["status","anyof",/**"SalesOrd:D",*/"SalesOrd:B","SalesOrd:E","SalesOrd:F"]
                ['mainline', 'is', 'F'],
                'AND',
                ['taxline', 'is', 'F'],
                'AND',
                ['status', 'anyof', 'SalesOrd:E', 'SalesOrd:F', 'SalesOrd:B'],
                'AND',
                ['formulanumeric: {quantity}-{quantitybilled}', 'greaterthan', '0'],
            ],
            columns: [
                // "internalid",
                // search.createColumn({name: "trandate",sort: search.Sort.ASC}),
                search.createColumn({
                    name: 'internalid',
                    summary: 'GROUP',
                }),
                search.createColumn({
                    name: 'trandate',
                    summary: 'GROUP',
                    sort: search.Sort.ASC,
                }),
            ],
        })
        // var preMappedItemExternlIdList = [];
        var preMappedItem = []
        var ProcessCount = 0
        var searchResultCount = itemfulfillmentSearchObj.runPaged().count
        for (var i = 0; i < Math.ceil(searchResultCount / 1000) && i * 1000 < MAX_PROCESS_LINE; i++) {
            var results = itemfulfillmentSearchObj.run().getRange({ start: 1000 * i, end: 1000 * (i + 1) })
            for (var j = 0; j < results.length && i * 1000 + j < MAX_PROCESS_LINE; j++) {
                ProcessCount++
                var transId = results[j].getValue({
                    name: 'internalid',
                    summary: 'GROUP',
                })
                var trandate = results[j].getValue({
                    name: 'trandate',
                    summary: 'GROUP',
                    sort: search.Sort.ASC,
                })
                // if(preMappedItemExternlIdList.indexOf(cacheExternalID) == -1){
                //     preMappedItemExternlIdList.push(cacheExternalID);
                preMappedItem.push({
                    recordType: 'salesorder',
                    id: transId,
                    values: {
                        internalid: {
                            value: transId,
                            text: transId,
                        },
                        trandate: {
                            value: trandate,
                            text: trandate,
                        },
                        // "custrecord_recordtype" : recordType,
                        // "custrecord_iv_dex_action" : cacheAction,
                        // "custrecord_iv_dex_trans" : cacheTrans,
                        // "custrecord_timestamp" : cacheTime,
                        // "custrecord_changes" : cacheChange,
                        // "custrecord_in_status" : {
                        //     value: cacheStatus,
                        //     text: cacheStatusName
                        // },
                        // "custrecord_iv_dex_msg" : cacheMsg,
                        // "custrecord_process_date" : cacheProcessDate
                    },
                })
                // }
            }
        }
        log.debug('itemfulfillmentSearchObj result count' + ProcessCount, searchResultCount)
        return preMappedItem
    }

    function map(context) {
        const parseData = JSON.parse(context.value)
        log.debug('parseData', JSON.stringify(parseData))
        try {
            // log.debug(JSON.stringify(context.key) + " is "+typeof(context.key), "context.value:"+JSON.stringify(context.value));

            // throw error.create({
            //     message: "Try",
            //     name: "Result",
            //     notifyOff: true
            // })
            var newInvRec = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: parseData.id,
                toType: record.Type.INVOICE,
                isDynamic: true,
            })
            // need to use dynamic to auto change due date and sale effective date
            var parsedDate = format.parse({
                value: parseData.values.trandate.value,
                type: format.Type.DATE,
                timezone: 'Asia/Hong_Kong',
            })

            log.debug(
                'parsedDate',
                JSON.stringify({
                    rawParsedDate: parseData.values.trandate.value,
                    parsedDate: parsedDate,
                })
            )
            newInvRec.setValue('trandate', parsedDate)

            var invoiceRecId = newInvRec.save()

            // 20231016 John : Since those Sales order already have deposite, no Customer payment is needed.
            // var newPaymentRec = record.transform({
            //     fromType: record.Type.INVOICE,
            //     fromId: invoiceRecId,
            //     toType: record.Type.CUSTOMER_PAYMENT, // record type : customerpayment
            //     isDynamic: true,
            // });
            // var paymentRecId = newPaymentRec.save();

            // log.audit("Invoice & Payment from SO : ", JSON.stringify({
            //     "invoiceRecId":invoiceRecId,
            //     "paymentRecId":paymentRecId,
            // }));
        } catch (e) {
            log.error('MR avr Map error.' + parseData.id, e.name + ' : ' + e.message + ' : ' + e.stack)
            context.write('Error', parseData.id + ':' + e.name + ' : ' + e.message + ' : ' + e.stack)
        }
    }

    function reduce(context) {}

    function summarize(summary) {
        var returnText = ''
        var errorList = []
        summary.output.iterator().each(function (key, value) {
            if (key == 'Error') {
                errorList.push(value)
            }
            return true
        })
        log.error('MR error count : ' + errorList.length, JSON.stringify(errorList))
        if (errorList.length > 0) {
            new ScriptErrorDAO().create({
                errorMessage: JSON.stringify(errorList),
                recordType: 'salesorder',
                script: 'customdeploy_auto_invoice_website_so_mr',
            })
        }
        log.audit('Summarize context', JSON.stringify(summary))
    }

    return {
        getInputData: getInputData,
        map: map,
        // reduce: reduce,
        summarize: summarize,
    }
})
