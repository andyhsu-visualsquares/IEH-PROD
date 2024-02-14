/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../Entity/SalesOrder', 'N/search', 'N/record', '../../utils/DateUtils'], (
    SalesOrder,
    search,
    record,
    DateUtils
) => {
    class SalesOrderDAO {
        constructor() {
            this.dateUtils = new DateUtils()
        }

        findByTransId(transid) {
            try {
                log.debug('SalesOrderDAO findByTransId', transid)
                const soList = []

                const salesorderSearchColInternalId = search.createColumn({ name: 'internalid' })
                const salesorderSearchColPosSalesId = search.createColumn({ name: 'custbodypossalesid' })
                const salesorderSearchColTransactionTotalCustom = search.createColumn({ name: 'custbodytxtotal' })
                const salesorderSearchColTransactionDiscount = search.createColumn({ name: 'transactiondiscount' })
                const salesorderSearchColName = search.createColumn({ name: 'entity' })
                const salesorderSearchColCreatedDate = search.createColumn({ name: 'trandate' })

                const salesorderSearch = search.create({
                    type: 'salesorder',
                    filters: [
                        [['custbodypossalesid', 'is', transid], 'OR', ['custbody_website_so', 'is', transid]],
                        'AND',
                        ['type', 'anyof', 'SalesOrd'],
                        'AND',
                        ['mainline', 'is', 'T'],
                    ],
                    columns: [
                        salesorderSearchColInternalId,
                        salesorderSearchColPosSalesId,
                        salesorderSearchColTransactionTotalCustom,
                        salesorderSearchColTransactionDiscount,
                        salesorderSearchColName,
                        salesorderSearchColCreatedDate,
                    ],
                })

                const salesorderSearchPagedData = salesorderSearch.runPaged({ pageSize: 1000 })
                for (let i = 0; i < salesorderSearchPagedData.pageRanges.length; i++) {
                    const salesorderSearchPage = salesorderSearchPagedData.fetch({ index: i })
                    salesorderSearchPage.data.forEach((result) => {
                        const internalId = result.getValue(salesorderSearchColInternalId)
                        const posSalesId = result.getValue(salesorderSearchColPosSalesId)
                        const transactionTotalCustom = result.getValue(salesorderSearchColTransactionTotalCustom)
                        const transactionDiscount = result.getValue(salesorderSearchColTransactionDiscount)
                        const name = result.getValue(salesorderSearchColName)
                        const createdDate = result.getValue(salesorderSearchColCreatedDate)

                        soList.push(
                            new SalesOrder({
                                NAME: name,
                                INTERNAL_ID: internalId,
                                TRANS_ID: transid,
                                TOTAL_AMOUNT: transactionTotalCustom,
                                DISCOUNT_AMOUNT: transactionDiscount,
                                PURCHASE_WAY: posSalesId ? 'POS' : 'WEB',
                                TYPE: 'SalesOrd',
                                CREATED_DATE: this.dateUtils.getTodayInputFormat(createdDate),
                            })
                        )
                    })
                }

                return soList
            } catch (e) {
                log.debug('Error on findByTransId', e.toString())
            }
        }

        findAccumulativeAmt(customerId, { startDate, endDate }) {
            log.debug('CHECK', startDate + ' | ' + endDate + ' | ' + customerId)
            let accumulativeAmt = 0
            let salesorderSearchObj = search.create({
                type: 'invoice',
                filters: [
                    ['type', 'anyof', 'CustInvc'],
                    'AND',
                    ['trandate', 'within', startDate, endDate],
                    'AND',
                    ['mainline', 'is', 'F'],
                    'AND',
                    ['customermain.entityid', 'haskeywords', customerId],
                ],
                columns: ['amount', 'mainname', 'debitamount', 'creditamount', 'itemtype'],
            })
            let searchCount = salesorderSearchObj.runPaged().count
            let salesorderSearch = salesorderSearchObj.run().getRange({ start: 0, end: 1000 })
            for (let i = 0; i < searchCount; i++) {
                accumulativeAmt += Number(salesorderSearch[i].getValue('amount'))
            }

            return accumulativeAmt
        }

        findAccumulativeAmtByInternal(customerId, { startDate, endDate }) {
            log.debug('CHECK', startDate + ' | ' + endDate + ' | ' + customerId)
            let accumulativeAmt = 0
            let salesorderSearchObj = search.create({
                type: 'invoice',
                filters: [
                    ['type', 'anyof', 'CustInvc'],
                    'AND',
                    ['trandate', 'within', startDate, endDate],
                    'AND',
                    ['mainline', 'is', 'F'],
                    'AND',
                    ['customermain', 'anyof', '1090923'],
                ],
                columns: ['amount', 'mainname', 'debitamount', 'creditamount', 'itemtype'],
            })
            let searchCount = salesorderSearchObj.runPaged().count
            let salesorderSearch = salesorderSearchObj.run().getRange({ start: 0, end: 1000 })
            for (let i = 0; i < searchCount; i++) {
                accumulativeAmt += Number(salesorderSearch[i].getValue('amount'))
            }

            return accumulativeAmt
        }

        create(bodyData, lineData) {
            log.debug('bodyData', bodyData)
            const soRecord = record.create({
                type: record.Type.SALES_ORDER,
                isDynamic: true,
            })
            bodyData.forEach((data) => {
                if (data.valueType === 'text') soRecord.setText({ fieldId: data.field, text: data.value })
                else soRecord.setValue({ fieldId: data.field, value: data.value })
            })
            lineData.forEach((data) => {
                soRecord.selectNewLine({ sublistId: data.sublist })
                data.lineItem.forEach((item) => {
                    if (data.valueType === 'text')
                        soRecord.setCurrentSublistText({
                            sublistId: data.sublist,
                            fieldId: item.field,
                            text: item.value,
                        })
                    else {
                        soRecord.setCurrentSublistValue({
                            sublistId: data.sublist,
                            fieldId: item.field,
                            value: item.value,
                        })
                    }
                })
                soRecord.commitLine({ sublistId: data.sublist })
            })
            return soRecord.save()
        }

        findTierProgressDeadlineByCustomerId(customerId) {
            let oldestDate = null
            const salesorderSearchColDate = search.createColumn({ name: 'trandate', summary: search.Summary.MIN })
            const salesorderSearch = search.create({
                type: 'salesorder',
                filters: [
                    ['trandate', 'within', 'previousoneyear'],
                    'AND',
                    ['type', 'anyof', 'SalesOrd'],
                    'AND',
                    ['customermain.entityid', 'is', customerId],
                ],
                columns: [salesorderSearchColDate],
            })

            const salesorderSearchPagedData = salesorderSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < salesorderSearchPagedData.pageRanges.length; i++) {
                const salesorderSearchPage = salesorderSearchPagedData.fetch({ index: i })
                salesorderSearchPage.data.forEach((result) => {
                    oldestDate = result.getValue(salesorderSearchColDate)
                })
            }

            return oldestDate
        }

        findTierProgressDeadlineByCustomerIdByInternalId(id) {
            let oldestDate = null
            const salesorderSearchColDate = search.createColumn({ name: 'trandate', summary: search.Summary.MIN })
            const salesorderSearch = search.create({
                type: 'salesorder',
                filters: [
                    ['trandate', 'within', 'previousoneyear'],
                    'AND',
                    ['type', 'anyof', 'SalesOrd'],
                    'AND',
                    ['customermain.internalid', 'is', '1090923'],
                ],
                columns: [salesorderSearchColDate],
            })

            const salesorderSearchPagedData = salesorderSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < salesorderSearchPagedData.pageRanges.length; i++) {
                const salesorderSearchPage = salesorderSearchPagedData.fetch({ index: i })
                salesorderSearchPage.data.forEach((result) => {
                    oldestDate = result.getValue(salesorderSearchColDate)
                })
            }

            return oldestDate
        }

        getAll() {}
    }

    return SalesOrderDAO
})
