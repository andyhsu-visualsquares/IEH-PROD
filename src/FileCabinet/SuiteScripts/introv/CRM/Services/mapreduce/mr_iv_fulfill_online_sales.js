/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 *
 * Script Name : MR Auto Fulfill Online SO
 * Script Id : customscript_auto_fulfill_online_so_mr
 * Deploy Id : customdeploy_auto_fulfill_online_so_mr
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
        var salesorderSearchObj = search.create({
            type: 'salesorder',
            filters: [
                ['type', 'anyof', 'SalesOrd'],
                'AND',
                ['custbody_website_so', 'isnotempty', ''],
                'AND',
                ['mainline', 'is', 'T'],
                'AND',
                ['custbody_iv_is_auto_fulfill', 'is', 'F'],
                'AND',
                ['status', 'anyof', 'SalesOrd:B', 'SalesOrd:D', 'SalesOrd:E'],
                // "AND",
                // ["internalid","is","4543146"],
            ],
            columns: [
                search.createColumn({
                    name: 'internalid',
                    sort: search.Sort.ASC,
                }),
                // "mainline",
                'trandate',
                // "asofdate",
                // "postingperiod",
                // "taxperiod",
                // "type",
                // "tranid",
                // "entity",
                // "account",
                // "memo",
                // "amount",
                // "custbodyjnrefnum",
                // "custbody_assign_redeem_code",
                // "custbody_create_if_status",
                // "custbodypossalesid",
                // "line.cseg1",
                // "custbody_speed_post_num",
                // "custbodyreceivername",
                // "custbodyccto1",
                // "custbodyccto2",
                // "custbodyemailcontent",
                // "custbodyemail",
                // "custbodysendername",
                // "custbodyquotationfile",
                // "custbodymultishipday",
                // "custbodydnspeedpsotno",
                // "custbody_11187_pref_entity_bank",
                // "custbody_11724_pay_bank_fees",
                // "custbody_11724_bank_fee",
                // "custbody_15529_vendor_entity_bank",
                // "custbody_15529_emp_entity_bank",
                // "custbody_15699_exclude_from_ep_process",
                // "cseg1"
            ],
        })
        var searchResultCount = salesorderSearchObj.runPaged().count
        log.debug('salesorderSearchObj result count', searchResultCount)
        // var preMappedItemExternlIdList = [];
        var preMappedItem = []
        var ProcessCount = 0
        var searchResultCount = salesorderSearchObj.runPaged().count
        for (var i = 0; i < Math.ceil(searchResultCount / 1000) && i * 1000 < MAX_PROCESS_LINE; i++) {
            var results = salesorderSearchObj.run().getRange({ start: 1000 * i, end: 1000 * (i + 1) })
            for (var j = 0; j < results.length && i * 1000 + j < MAX_PROCESS_LINE; j++) {
                ProcessCount++
                var transId = results[j].getValue('internalid')
                var trandate = results[j].getValue('trandate')
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
                    },
                })
                // }
            }
        }
        log.debug('salesorderSearchObj result count' + ProcessCount, searchResultCount)
        return preMappedItem
    }

    function map(context) {
        const parseData = JSON.parse(context.value)
        log.debug('parseData', JSON.stringify(parseData))
        try {
            // log.debug(JSON.stringify(context.key) + " is "+typeof(context.key), "context.value:"+JSON.stringify(context.value));

            var allDigitalClassList = []
            var classificationSearchObj = search.create({
                type: 'classification',
                filters: [['custrecord_evoucher', 'is', 'T'], 'AND', ['isinactive', 'is', 'F']],
                columns: ['internalid', search.createColumn({ name: 'name', sort: search.Sort.ASC })],
            })
            var searchResultCount = classificationSearchObj.runPaged().count
            log.debug('classificationSearchObj result count', searchResultCount)
            classificationSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                allDigitalClassList.push(result.id)
                return true
            })

            var newIFRec = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: parseData.id,
                toType: record.Type.ITEM_FULFILLMENT,
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
            newIFRec.setValue('trandate', parsedDate)

            // getItemFromIF()
            var lineItemList = []
            for (var j = 0; j < newIFRec.getLineCount({ sublistId: 'item' }); j++) {
                newIFRec.selectLine({ sublistId: 'item', line: j })
                var lineItemId = newIFRec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' })
                if (lineItemList.indexOf(lineItemId) == -1) {
                    lineItemList.push(lineItemId)
                }
            }
            log.debug('lineItemList', JSON.stringify(lineItemList))
            // getValidItem()
            var validItemIdList = []
            var itemSearchObj = search.create({
                type: 'item',
                filters: [
                    ['internalid', 'anyof', lineItemList],
                    // "AND",
                    // ["custitemshoptempclass.custrecord_evoucher","is","T"]
                ],
                columns: [search.createColumn({ name: 'internalid', sort: search.Sort.ASC }), 'class'],
            })
            var searchResultCount = itemSearchObj.runPaged().count
            log.debug('itemSearchObj result count', searchResultCount)
            itemSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                var itemClass = result.getValue('class')
                if (allDigitalClassList.indexOf(itemClass) != -1) {
                    validItemIdList.push(result.id)
                }
                return true
            })
            if (validItemIdList.length == 0) {
                // throw error.create({
                //     message: "Skipped",
                //     name: "No Digital Item in SO",
                //     notifyOff: true
                // })
                log.audit('Skipped SO : ' + parseData.id, 'No Digital Item in SO')
            } else {
                for (var j = 0; j < newIFRec.getLineCount({ sublistId: 'item' }); j++) {
                    newIFRec.selectLine({ sublistId: 'item', line: j })
                    var lineItemId = newIFRec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' })
                    newIFRec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemreceive',
                        value: validItemIdList.indexOf(lineItemId) != -1,
                        ignoreFieldChange: true,
                    })
                    newIFRec.commitLine({ sublistId: 'item' })
                }
                var fulfillId = newIFRec.save()
                log.audit('Fulfilled SO : ' + parseData.id, fulfillId)
            }

            // Always Mark True, TODO mark false in retry
            record.submitFields({
                type: record.Type.SALES_ORDER,
                id: parseData.id,
                values: {
                    custbody_iv_is_auto_fulfill: true,
                },
            })
        } catch (e) {
            log.error('MR avr Map error.' + context.key, e.name + ' : ' + e.message + ' : ' + e.stack)
            context.write('Error', context.key + ':' + e.name + ' : ' + e.message + ' : ' + e.stack)
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
