/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../Entity/Item', 'N/search'], (Item, search) => {
    class ItemDAO {
        constructor() {}

        findByName(name) {
            let item = null

            const itemSearchColInternalId = search.createColumn({ name: 'internalid' })
            const itemSearchColName = search.createColumn({ name: 'itemid', sort: search.Sort.ASC })
            const itemSearch = search.create({
                type: 'item',
                filters: [['name', 'anyof', name]],
                columns: [itemSearchColInternalId, itemSearchColName],
            })

            const itemSearchPagedData = itemSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < itemSearchPagedData.pageRanges.length; i++) {
                const itemSearchPage = itemSearchPagedData.fetch({ index: i })
                itemSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(itemSearchColInternalId)
                    const name = result.getValue(itemSearchColName)

                    item = new Item({ NAME: name, INTERNAL_ID: internalId })
                })
            }

            return item
        }

        findByNames(names) {
            const itemList = []
            const filters = []
            names.forEach((name, index) => {
                if (index === 0) filters.push(['name', 'is', name])
                else filters.push('OR', ['name', 'is', name])
            })

            const itemSearchColInternalId = search.createColumn({ name: 'internalid' })
            const itemSearchColName = search.createColumn({ name: 'itemid', sort: search.Sort.ASC })
            const itemSearchColType = search.createColumn({ name: 'type' })
            const itemSearchColClass = search.createColumn({ name: 'class' })

            const itemSearch = search.create({
                type: 'item',
                filters,
                columns: [itemSearchColInternalId, itemSearchColName, itemSearchColType, itemSearchColClass],
            })

            const itemSearchPagedData = itemSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < itemSearchPagedData.pageRanges.length; i++) {
                const itemSearchPage = itemSearchPagedData.fetch({ index: i })
                itemSearchPage.data.forEach((result) => {
                    itemList.push(
                        new Item({
                            NAME: result.getValue(itemSearchColName),
                            INTERNAL_ID: result.getValue(itemSearchColInternalId),
                            TYPE: result.getValue(itemSearchColType),
                            CLASS: result.getValue(itemSearchColClass),
                        })
                    )
                })
            }

            return itemList
        }

        findByInternalIds(internalIds) {
            const itemList = []
            const filters = []
            internalIds.forEach((internalId, index) => {
                if (index === 0) filters.push(['internalid', 'is', internalId])
                else filters.push('OR', ['internalid', 'is', internalId])
            })

            const itemSearchColInternalId = search.createColumn({ name: 'internalid' })
            const itemSearchColName = search.createColumn({ name: 'itemid', sort: search.Sort.ASC })
            const itemSearchColClass = search.createColumn({ name: 'class' })

            const itemSearch = search.create({
                type: 'item',
                filters,
                columns: [itemSearchColInternalId, itemSearchColName, itemSearchColClass],
            })

            const itemSearchPagedData = itemSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < itemSearchPagedData.pageRanges.length; i++) {
                const itemSearchPage = itemSearchPagedData.fetch({ index: i })
                itemSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(itemSearchColInternalId)
                    const name = result.getValue(itemSearchColName)
                    const classId = result.getValue(itemSearchColClass)

                    itemList.push(new Item({ NAME: name, INTERNAL_ID: internalId, CLASS: classId }))
                })
            }

            return itemList
        }

        findItemOnHandQtyByID(id) {
            let stock = 0
            const itemSearchColLocationOnHand = search.createColumn({
                name: 'locationquantityonhand',
                summary: search.Summary.SUM,
            })

            const itemSearch = search.create({
                type: 'item',
                filters: [['internalid', 'anyof', id]],
                columns: [itemSearchColLocationOnHand],
            })

            const itemSearchPagedData = itemSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < itemSearchPagedData.pageRanges.length; i++) {
                const itemSearchPage = itemSearchPagedData.fetch({ index: i })
                itemSearchPage.data.forEach((result) => {
                    stock = parseFloat(result.getValue(itemSearchColLocationOnHand))
                })
            }

            return stock
        }

        findItemTypeByID(id) {
            return search.lookupFields({
                type: search.Type.ITEM,
                id,
                columns: ['type'],
            }).type[0].value
        }

        getAll() {}
    }

    return ItemDAO
})
