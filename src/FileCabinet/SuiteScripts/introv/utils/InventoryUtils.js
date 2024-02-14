/**
 *@NApiVersion 2.1
 *@NModuleScope Public
 */
define(['N/search', '../configs/constants'], function (search, constants) {
    /**
     * @typedef {Object} LoosePackInventoryAdjustment
     * @property {string} loosePackAdjustmentID
     * @property {string} assemblyItemID
     * @property {number} loosePackQuantity
     * @property {string} adjustmentItem
     * @property {String} transactionDate
     */
    /**
     * Get the assembly item list where the inventory adjustment generated is false and finished goods produced is true
     *
     * @return {Array.<LoosePackInventoryAdjustment>}
     */
    const getAssemblyItemList = (specificIA) => {
        log.debug('saved search', 'getAssemblyItemList start')
        const list = []

        const filters = [
            ['type', 'anyof', 'InvAdjst'],
            'AND',
            ['custbody_iv_generated', 'is', 'F'],
            'AND',
            ['custbody_iv_finished_goods_produced', 'is', 'T'],
        ]
        if (specificIA) filters.push('AND', ['internalid', 'anyof', specificIA])

        const inventoryadjustmentSearchColInternalId = search.createColumn({ name: 'internalid' })
        const inventoryadjustmentSearchColAssemblyItem = search.createColumn({
            name: 'custitemitemassitem',
            join: 'item',
        })
        const inventoryadjustmentSearchColQuantity = search.createColumn({ name: 'quantity' })
        const inventoryadjustmentSearchColItem = search.createColumn({ name: 'item' })
        const inventoryadjustmentSearchColTransactionDate = search.createColumn({ name: 'trandate' })

        const inventoryadjustmentSearch = search.create({
            type: 'inventoryadjustment',
            filters,
            columns: [
                inventoryadjustmentSearchColInternalId,
                inventoryadjustmentSearchColAssemblyItem,
                inventoryadjustmentSearchColQuantity,
                inventoryadjustmentSearchColItem,
                inventoryadjustmentSearchColTransactionDate,
            ],
        })
        const inventoryadjustmentSearchPagedData = inventoryadjustmentSearch.runPaged({ pageSize: 1000 })
        for (let i = 0; i < inventoryadjustmentSearchPagedData.pageRanges.length; i++) {
            const inventoryadjustmentSearchPage = inventoryadjustmentSearchPagedData.fetch({ index: i })
            inventoryadjustmentSearchPage.data.forEach((result) => {
                if (result.getValue(inventoryadjustmentSearchColAssemblyItem))
                    list.push({
                        loosePackAdjustmentID: result.getValue(inventoryadjustmentSearchColInternalId),
                        assemblyItemID: result.getValue(inventoryadjustmentSearchColAssemblyItem),
                        loosePackQuantity: result.getValue(inventoryadjustmentSearchColQuantity),
                        adjustmentItem: result.getValue(inventoryadjustmentSearchColItem),
                        transactionDate: result.getValue(inventoryadjustmentSearchColTransactionDate),
                    })
                else
                    list.push({
                        loosePackAdjustmentID: result.getValue(inventoryadjustmentSearchColInternalId),
                        assemblyItemID: null,
                    })
            })
        }

        log.debug(
            'schedule loose pack adjustment',
            'getAssemblyItemList end, inventory adjustment Search: ' + list.length + ': ' + JSON.stringify(list)
        )
        return list
    }

    /**
     * @typedef {Object} BomItem
     * @property {string} loosePackAdjustmentID
     * @property {string} loosePackQuantity
     * @property {number} bomItemId
     * @property {string} assemblyItemID
     * @property {string} bomItemName
     * @property {String} transactionDate
     */
    /**
     * Get the bom item list for each assembly item
     *
     * @param {Array.<LoosePackInventoryAdjustment>} assemblyItemsList
     * @return {Array.<BomItem>}
     */
    const getBomItemList = (assemblyItemsList) => {
        log.debug('schedule loose pack adjustment', 'getBomItemList start')
        if (!assemblyItemsList) return []
        const list = []
        assemblyItemsList.forEach((assemblyItem) => {
            log.debug('schedule loose pack adjustment', 'getBomItemList assemblyItem: ' + JSON.stringify(assemblyItem))
            const assemblyitemSearchObj = search.create({
                type: 'assemblyitem',
                filters: [
                    ['type', 'anyof', 'Assembly'],
                    'AND',
                    ['internalid', 'anyof', assemblyItem.assemblyItemID],
                    'AND',
                    ['assemblyitembillofmaterials.default', 'is', 'T'],
                ],
                columns: [
                    search.createColumn({
                        name: 'itemid',
                        sort: search.Sort.ASC,
                    }),
                    'displayname',
                    search.createColumn({
                        name: 'billofmaterials',
                        join: 'assemblyItemBillOfMaterials',
                    }),
                ],
            })

            assemblyitemSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                // if (list.length === 0)  //only one default bom
                list.push({
                    loosePackAdjustmentID: assemblyItem.loosePackAdjustmentID,
                    loosePackQuantity: assemblyItem.loosePackQuantity,
                    assemblyItemID: assemblyItem.adjustmentItem,
                    transactionDate: assemblyItem.transactionDate,
                    bomItemId: result.getValue({
                        name: 'billofmaterials',
                        join: 'assemblyItemBillOfMaterials',
                    }),
                    bomItemName: result.getText({
                        name: 'billofmaterials',
                        join: 'assemblyItemBillOfMaterials',
                    }),
                })
                return true
            })
        })

        log.debug(
            'schedule loose pack adjustment',
            'getBomItemList end, assembly Item Bill Of Materials: ' + list.length + ': ' + JSON.stringify(list)
        )
        return list
    }

    /**
     * Get the on hand quantity in packing warehouse 7f (june) for each item
     * @param {Array} itemList
     * @returns {{[item: string]: {locationOnHand: number}}}
     */
    const getItemOnHandQtyMap = (itemList) => {
        log.debug('schedule loose pack adjustment', 'getItemOnHandQtyMap start: ' + JSON.stringify(itemList))
        if (!itemList || itemList.length === 0) return {}
        const itemOnHandQtyMap = {}
        for (let itemID of itemList) {
            itemOnHandQtyMap[itemID] = { locationOnHand: 0 }
        }

        const itemSearchColLocationOnHand = search.createColumn({ name: 'locationquantityonhand' })
        const itemSearchColInternalId = search.createColumn({ name: 'internalid' })
        const itemSearch = search.create({
            type: 'item',
            filters: [
                ['inventorylocation', 'anyof', constants.PACKING_WAREHOUSE_7F_JUNE],
                'AND',
                ['internalid', 'anyof', itemList],
            ],
            columns: [itemSearchColLocationOnHand, itemSearchColInternalId],
        })

        const itemSearchPagedData = itemSearch.runPaged({ pageSize: 1000 })
        for (let i = 0; i < itemSearchPagedData.pageRanges.length; i++) {
            const itemSearchPage = itemSearchPagedData.fetch({ index: i })
            itemSearchPage.data.forEach((result) => {
                const locationOnHand = result.getValue(itemSearchColLocationOnHand) || 0
                const internalId = result.getValue(itemSearchColInternalId)
                log.debug(
                    'schedule loose pack adjustment',
                    'getItemOnHandQtyMap internalId: ' +
                        internalId +
                        ', locationOnHand: ' +
                        locationOnHand +
                        ', result locationquantityonhand: ' +
                        result.getValue(itemSearchColLocationOnHand) +
                        ', result internalid: ' +
                        result.getValue(itemSearchColInternalId)
                )

                itemOnHandQtyMap[internalId] = { locationOnHand }
            })
        }
        log.debug('schedule loose pack adjustment', 'getItemOnHandQtyMap end: ' + JSON.stringify(itemOnHandQtyMap))
        return itemOnHandQtyMap
    }

    /**
     * @typedef {Object} Component
     * @property {string} loosePackAdjustmentID
     * @property {number} loosePackQuantity
     * @property {string} loosePackRootItem
     * @property {string} billOfMaterials
     * @property {string} internalId
     * @property {string} item
     * @property {string} itemName
     * @property {number} quantity
     */
    /**
     * Get the bom revision components list for each bom item
     *
     * @param {Array.<BomItem>} bomItemsList
     * @return {Array.<Component>}
     */
    const getComponentsList = (bomItemsList) => {
        log.debug('schedule loose pack adjustment', 'getComponentsList start')
        if (!bomItemsList) return []
        const list = []
        bomItemsList.forEach((bomItem) => {
            log.debug('schedule loose pack adjustment', 'getComponentsList bomItem: ' + JSON.stringify(bomItem))
            const bomrevisionSearchColBillOfMaterials = search.createColumn({ name: 'billofmaterials' })
            const bomrevisionSearchColInternalId = search.createColumn({ name: 'internalid', join: 'component' })
            const bomrevisionSearchColItem = search.createColumn({ name: 'item', join: 'component' })
            const bomrevisionSearchColQuantity = search.createColumn({ name: 'quantity', join: 'component' })

            const bomrevisionSearch = search.create({
                type: 'bomrevision',
                filters: [
                    ['billofmaterials', 'anyof', bomItem.bomItemId],
                    'AND',
                    ['effectivestartdate', 'onorbefore', bomItem.transactionDate],
                    'AND',
                    ['effectiveenddate', 'after', bomItem.transactionDate],
                ],
                columns: [
                    bomrevisionSearchColBillOfMaterials,
                    bomrevisionSearchColInternalId,
                    bomrevisionSearchColItem,
                    bomrevisionSearchColQuantity,
                ],
            })

            const bomrevisionSearchPagedData = bomrevisionSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < bomrevisionSearchPagedData.pageRanges.length; i++) {
                const bomrevisionSearchPage = bomrevisionSearchPagedData.fetch({ index: i })
                bomrevisionSearchPage.data.forEach((result) => {
                    const billOfMaterials = result.getValue(bomrevisionSearchColBillOfMaterials)
                    const internalId = result.getValue(bomrevisionSearchColInternalId)
                    const item = result.getValue(bomrevisionSearchColItem)
                    const itemName = result.getText(bomrevisionSearchColItem)
                    const quantity = result.getValue(bomrevisionSearchColQuantity)
                    if (item === bomItem.assemblyItemID) return true
                    list.push({
                        loosePackAdjustmentID: bomItem.loosePackAdjustmentID,
                        loosePackQuantity: bomItem.loosePackQuantity,
                        loosePackRootItem: bomItem.assemblyItemID,
                        billOfMaterials,
                        internalId,
                        item,
                        itemName,
                        quantity,
                    })
                    return true
                })
            }
        })

        log.debug(
            'schedule loose pack adjustment',
            'getComponentsList end, bom components: ' + list.length + ': ' + JSON.stringify(list)
        )
        return list
    }

    /**
     * Retrieve a list of inventory lots for a given list of BOM components
     *
     * @param {[{loosePackAdjustmentID: number, loosePackQuantity: number, billOfMaterials: number, internalId: number, quantity: number, item: number}]} bomComponents
     * @return {[{itemCount: number, expirationDate: "21/06/2020", seriallotNumberLocation: String, seriallotNumber: String, internalId: number, name: number}]}
     */
    const getInventoryLotList = (bomComponents) => {
        log.debug('schedule loose pack adjustment', 'getInventoryLotList start')
        const list = []
        // const compositedList = []
        const itemInternalIDFilter = ['item.internalid', 'anyof']
        bomComponents.filter((component) => itemInternalIDFilter.push(component.item))
        // 5491, 9914, 4912, 9893, 4873, 5171, 1986, 6132, 12548
        log.debug(
            'schedule loose pack adjustment',
            'getInventoryLotList itemInternalIDFilter: ' +
                itemInternalIDFilter.length +
                ': ' +
                JSON.stringify(itemInternalIDFilter)
        )

        const inventorydetailSearchColItemCount = search.createColumn({ name: 'itemcount' })
        const inventorydetailSearchColExpirationDate = search.createColumn({
            name: 'expirationdate',
            sort: search.Sort.DESC,
        })
        const inventorydetailSearchColSeriallotNumberLocation = search.createColumn({
            name: 'serialnumberlocation',
            join: 'item',
        })
        const inventorydetailSearchColSeriallotNumber = search.createColumn({ name: 'serialnumber', join: 'item' })
        const inventorydetailSearchColInternalId = search.createColumn({ name: 'internalid', join: 'item' })
        const inventorydetailSearchColName = search.createColumn({ name: 'itemid', join: 'item' })

        const inventorydetailSearch = search.create({
            type: 'inventorydetail',
            filters: [itemInternalIDFilter],
            columns: [
                inventorydetailSearchColItemCount,
                inventorydetailSearchColExpirationDate,
                inventorydetailSearchColSeriallotNumberLocation,
                inventorydetailSearchColSeriallotNumber,
                inventorydetailSearchColInternalId,
                inventorydetailSearchColName,
            ],
        })

        log.debug('search filter', 'inventorydetailSearch filter: ' + JSON.stringify(inventorydetailSearch.filters))
        log.debug('result count', 'inventorydetailSearch count: ' + inventorydetailSearch.runPaged().count)

        const inventorydetailSearchPagedData = inventorydetailSearch.runPaged({ pageSize: 1000 })
        log.debug(
            'inventorydetailSearchPagedData',
            'inventorydetailSearchPagedData: ' + JSON.stringify(inventorydetailSearchPagedData)
        )
        // for (let i = 0; i < inventorydetailSearchPagedData.pageRanges.length; i++) {
        //     const inventorydetailSearchPage = inventorydetailSearchPagedData.fetch({index: i});
        //     inventorydetailSearchPage.data.forEach((result) => {
        //         const itemCount = result.getValue(inventorydetailSearchColItemCount);
        //         const expirationDate = result.getValue(inventorydetailSearchColExpirationDate);
        //         const seriallotNumberLocation = result.getValue(inventorydetailSearchColSeriallotNumberLocation);
        //         const seriallotNumber = result.getValue(inventorydetailSearchColSeriallotNumber);
        //         const internalId = result.getValue(inventorydetailSearchColInternalId);
        //         const name = result.getValue(inventorydetailSearchColName);
        //         list.push(
        //             {itemCount, expirationDate, seriallotNumberLocation, seriallotNumber, internalId, name})
        //     });
        // }

        // list.forEach(item => {
        //     const existingItem = compositedList.find(outputItem =>
        //                                                  outputItem.seriallotNumberLocation
        //                                                  === item.seriallotNumberLocation
        //                                                  && outputItem.seriallotNumber === item.seriallotNumber
        //                                                  && outputItem.internalId === item.internalId
        //     );
        //     if (existingItem) {
        //         existingItem.itemCount = (
        //             parseFloat(existingItem.itemCount) + parseFloat(item.itemCount)
        //         ).toString();
        //     } else {
        //         compositedList.push(item);
        //     }
        // });

        const itemMap = new Map()

        list.forEach((item) => {
            const key = `${item.seriallotNumberLocation}_${item.seriallotNumber}_${item.internalId}`

            const existingItem = itemMap.get(key)

            if (existingItem) {
                existingItem.itemCount = (parseFloat(existingItem.itemCount) + parseFloat(item.itemCount)).toString()
            } else {
                itemMap.set(key, item)
            }
        })

        const compositedList = Array.from(itemMap.values())

        log.debug(
            'schedule loose pack adjustment',
            'getInventoryLotList end, list: ' +
                inventorydetailSearch.runPaged().count +
                '->' +
                compositedList.length +
                ': ' +
                JSON.stringify(compositedList)
        )
        return compositedList
    }

    /**
     * This function will get the average cost of the item.
     *
     * @param {Array.<object>} bomComponents
     * @param {string} bomComponents.internalid
     * @param {string} bomComponents.item
     * @param {string} bomComponents.billOfMaterials
     * @param {string} bomComponents.loosePackAdjustmentID
     * @param {number} bomComponents.quantity
     * @param {number} bomComponents.loosePackQuantity
     * @return {{[key: number]: number}}
     */
    const getItemAverageCost = (bomComponents) => {
        log.debug(
            'schedule loose pack adjustment',
            'getItemAverageCost start, bomComponents: ' + JSON.stringify(bomComponents)
        )
        const itemCost = {}
        const internalIDFilter = ['internalid', 'anyof']
        bomComponents.filter((component) => internalIDFilter.push(component.item))

        const itemSearchColName = search.createColumn({ name: 'itemid', sort: search.Sort.ASC })
        const itemSearchColDisplayName = search.createColumn({ name: 'displayname' })
        const itemSearchColInventoryLocation = search.createColumn({ name: 'inventorylocation' })
        const itemSearchColLocationAverageCost = search.createColumn({ name: 'locationaveragecost' })
        const itemSearchColInternalId = search.createColumn({ name: 'internalid' })

        const itemSearch = search.create({
            type: 'item',
            filters: [internalIDFilter, 'AND', ['inventorylocation', 'anyof', constants.FINISHED_PRODUCT_WAREHOUSE_7F]],
            columns: [
                itemSearchColName,
                itemSearchColDisplayName,
                itemSearchColInventoryLocation,
                itemSearchColLocationAverageCost,
                itemSearchColInternalId,
            ],
        })

        const itemSearchPagedData = itemSearch.runPaged({ pageSize: 1000 })
        for (let i = 0; i < itemSearchPagedData.pageRanges.length; i++) {
            const itemSearchPage = itemSearchPagedData.fetch({ index: i })
            itemSearchPage.data.forEach((result) => {
                const locationAverageCost = result.getValue(itemSearchColLocationAverageCost)
                const internalId = result.getValue(itemSearchColInternalId)

                itemCost[internalId] = parseFloat(locationAverageCost || 0)
            })
        }

        log.debug('schedule loose pack adjustment', 'getItemAverageCost end, itemCost: ' + JSON.stringify(itemCost))
        return itemCost
    }

    const getLotNumberedInventoryItemMap = (lotItemList) => {
        log.debug(
            'schedule loose pack adjustment',
            'getLotNumberedInventoryItemMap start, lotItemList: ' + JSON.stringify(lotItemList)
        )
        const map = {}

        const itemSearchColInternalId = search.createColumn({ name: 'internalid' })
        const itemSearchColName = search.createColumn({ name: 'itemid', sort: search.Sort.ASC })
        const itemSearchColAssemblyItem = search.createColumn({ name: 'custitemitemassitem' })

        const itemSearch = search.create({
            type: 'item',
            filters: [['custitemitemassitem', 'anyof', lotItemList]],
            columns: [itemSearchColInternalId, itemSearchColAssemblyItem],
        })

        const itemSearchPagedData = itemSearch.runPaged({ pageSize: 1000 })
        for (let i = 0; i < itemSearchPagedData.pageRanges.length; i++) {
            const itemSearchPage = itemSearchPagedData.fetch({ index: i })
            itemSearchPage.data.forEach((result) => {
                const internalId = result.getValue(itemSearchColInternalId)
                const assemblyItem = result.getValue(itemSearchColAssemblyItem)

                map[assemblyItem] = internalId
            })
        }

        return map
    }

    return {
        getAssemblyItemList,
        getInventoryLotList,
        getItemAverageCost,
        getBomItemList,
        getComponentsList,
        getItemOnHandQtyMap,
        getLotNumberedInventoryItemMap,
    }
})
