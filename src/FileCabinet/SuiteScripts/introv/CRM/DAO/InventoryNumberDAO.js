/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../Entity/InventoryNumber', 'N/search'], (InventoryNumber, search) => {
    class InventoryNumberDAO {
        constructor() {}

        findOnHandLots(itemId) {
            let inventoryNumber = []

            const inventorynumberSearchColInternalId = search.createColumn({ name: 'internalid' })
            const inventorynumberSearchColNumber = search.createColumn({
                name: 'inventorynumber',
                sort: search.Sort.ASC,
            })
            const inventorynumberSearchColItem = search.createColumn({ name: 'item' })
            const inventorynumberSearchColMemo = search.createColumn({ name: 'memo' })
            const inventorynumberSearchColExpirationDate = search.createColumn({ name: 'expirationdate' })
            const inventorynumberSearchColLocation = search.createColumn({ name: 'location' })
            const inventorynumberSearchColOnHand = search.createColumn({ name: 'quantityonhand' })
            const inventorynumberSearchColAvailable = search.createColumn({ name: 'quantityavailable' })
            const inventorynumberSearchColOnOrder = search.createColumn({ name: 'quantityonorder' })
            const inventorynumberSearchColIsOnHand = search.createColumn({ name: 'isonhand' })
            const inventorynumberSearchColInTransit = search.createColumn({ name: 'quantityintransit' })
            const inventorynumberSearchColDateCreated = search.createColumn({
                name: 'datecreated',
                sort: search.Sort.ASC,
            })

            const inventorynumberSearch = search.create({
                type: 'inventorynumber',
                filters: [['item', 'anyof', itemId], 'AND', ['isonhand', 'is', 'T'], 'AND', ['location', 'anyof', 209]],
                columns: [
                    inventorynumberSearchColInternalId,
                    inventorynumberSearchColNumber,
                    inventorynumberSearchColItem,
                    inventorynumberSearchColMemo,
                    inventorynumberSearchColExpirationDate,
                    inventorynumberSearchColLocation,
                    inventorynumberSearchColOnHand,
                    inventorynumberSearchColAvailable,
                    inventorynumberSearchColOnOrder,
                    inventorynumberSearchColIsOnHand,
                    inventorynumberSearchColInTransit,
                    inventorynumberSearchColDateCreated,
                ],
            })

            const inventorynumberSearchPagedData = inventorynumberSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < inventorynumberSearchPagedData.pageRanges.length; i++) {
                const inventorynumberSearchPage = inventorynumberSearchPagedData.fetch({ index: i })
                inventorynumberSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(inventorynumberSearchColInternalId)
                    const number = result.getValue(inventorynumberSearchColNumber)
                    const item = result.getValue(inventorynumberSearchColItem)
                    const memo = result.getValue(inventorynumberSearchColMemo)
                    const expirationDate = result.getValue(inventorynumberSearchColExpirationDate)
                    const location = result.getValue(inventorynumberSearchColLocation)
                    const onHand = result.getValue(inventorynumberSearchColOnHand)
                    const available = result.getValue(inventorynumberSearchColAvailable)
                    const onOrder = result.getValue(inventorynumberSearchColOnOrder)
                    const isOnHand = result.getValue(inventorynumberSearchColIsOnHand)
                    const inTransit = result.getValue(inventorynumberSearchColInTransit)
                    const dateCreated = result.getValue(inventorynumberSearchColDateCreated)

                    inventoryNumber.push(
                        new InventoryNumber({
                            internalId,
                            number,
                            item,
                            memo,
                            expirationDate,
                            location,
                            onHand: parseFloat(onHand),
                            available: parseFloat(available),
                            onOrder: parseFloat(onOrder),
                            isOnHand,
                            inTransit: parseFloat(inTransit),
                            dateCreated,
                        })
                    )
                })
            }

            return inventoryNumber
        }
    }
    return InventoryNumberDAO
})
