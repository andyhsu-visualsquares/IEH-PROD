/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/search', 'N/record', '../Entity/RedeemCodeMaster'], (search, record, RedeemCodeMaster) => {
    class RedeemCodeMasterDAO {
        constructor() { }

        findByInternalId(internalId) {
            log.debug("internalID", internalId)
            const redeemCodeMasterList = []

            const customrecordrcmasterSearchColInternalId = search.createColumn({ name: 'internalid' })
            const customrecordrcmasterSearchColName = search.createColumn({ name: 'name', sort: search.Sort.ASC })
            const customrecordrcmasterSearchColRedeemProduct = search.createColumn({
                name: 'custrecordrcmasterredeemprod',
            })
            const customrecordrcmasterSearchColVoucherItem = search.createColumn({
                name: 'custrecordrcmastervoucheritem',
            })
            const customrecordrcmasterSearchColUsed = search.createColumn({
                name: 'custrecordrcmastersentorsold',
            })

            const customrecordrcmasterSearch = search.create({
                type: 'customrecordrcmaster',
                filters: [
                    ['custrecordrcmastersentorsold', 'is', 'F'],
                    'AND',
                    ['custrecordrcmasterused', 'is', 'F'],
                    'AND',
                    ['custrecordrcmastervoucheritem', 'anyof', internalId],
                    'AND',
                    ['custrecordredeemcodenoteffective', 'is', 'F'],
                    'AND',
                    ['isinactive', 'is', 'F'],
                    'AND',
                    ['custrecordrcmastersentorsold', 'is', 'F'],
                    "AND",
                    ["custrecordrcmastereffectivedate", "after", "today"]
                ],
                columns: [
                    customrecordrcmasterSearchColInternalId,
                    customrecordrcmasterSearchColName,
                    customrecordrcmasterSearchColRedeemProduct,
                    customrecordrcmasterSearchColVoucherItem,
                    customrecordrcmasterSearchColUsed,
                ],
            })

            const customrecordrcmasterSearchPagedData = customrecordrcmasterSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecordrcmasterSearchPagedData.pageRanges.length; i++) {
                const customrecordrcmasterSearchPage = customrecordrcmasterSearchPagedData.fetch({ index: i })
                customrecordrcmasterSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customrecordrcmasterSearchColInternalId)
                    const name = result.getValue(customrecordrcmasterSearchColName)
                    const redeemProduct = result.getValue(customrecordrcmasterSearchColRedeemProduct)
                    const voucherItem = result.getValue(customrecordrcmasterSearchColVoucherItem)
                    const sent = result.getValue(customrecordrcmasterSearchColUsed)
                    redeemCodeMasterList.push(
                        new RedeemCodeMaster({ internalId, name, product: redeemProduct, voucherItem, sent })
                    )
                })
            }

            return redeemCodeMasterList.sort((a, b) => a.voucherItem.localeCompare(b.voucherItem))
        }

        findRedeemCodeByName(redeemCode) {
            var customrecordrcmasterSearchResult = search
                .create({
                    type: 'customrecordrcmaster',
                    filters: [['name', 'is', redeemCode]],
                    columns: [
                        search.createColumn({
                            name: 'name',
                            sort: search.Sort.ASC,
                        }),
                        'scriptid',
                        'custrecordrcmastersentorsold',
                    ],
                })
                .run()
                .getRange({ start: 0, end: 1000 })
            return customrecordrcmasterSearchResult[0]
        }

        update(internalId, bodyFields) {
            const recordType = 'customrecordrcmaster'

            const recordObj = record.load({ type: recordType, id: internalId })

            for (let bodyField of bodyFields) {
                const { field, value, valueType } = bodyField
                if (valueType === 'value') recordObj.setValue({ fieldId: field, value })
                else if (valueType === 'text') recordObj.setText({ fieldId: field, text: value })
            }

            return recordObj.save()
        }

        findByItems(items = []) {
            const list = []
            const customrecordrcmasterSearchFilters = [
                ['custrecordrcmastervoucheritem', 'anyof', items],
                'AND',
                ['custrecordrcmastereffectivedate', 'onorafter', 'today'],
                'AND',
                ['isinactive', 'is', 'F'],
                'AND',
                ['custrecordredeemcodenoteffective', 'is', 'F'],
                'AND',
                ['custrecordrcmastersentorsold', 'is', 'F']

            ]

            const customrecordrcmasterSearchColVoucherItemCode = search.createColumn({
                name: 'custrecordrcmastervoucheritem',
            })

            const customrecordrcmasterSearch = search.create({
                type: 'customrecordrcmaster',
                filters: customrecordrcmasterSearchFilters,
                columns: [customrecordrcmasterSearchColVoucherItemCode],
            })

            const customrecordrcmasterSearchPagedData = customrecordrcmasterSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecordrcmasterSearchPagedData.pageRanges.length; i++) {
                const customrecordrcmasterSearchPage = customrecordrcmasterSearchPagedData.fetch({ index: i })
                customrecordrcmasterSearchPage.data.forEach((result) => {
                    list.push(result.getValue(customrecordrcmasterSearchColVoucherItemCode))
                })
            }

            return list
        }
    }

    return RedeemCodeMasterDAO
})
