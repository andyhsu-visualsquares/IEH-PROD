/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @Author: Andy Chan
 *
 * @scriptName Schedule_Loose_Pack_Adjustment
 * @scriptId customscript_iv_ss_loose_pack_adjst
 * @deploymentId customdeploy_iv_ss_loose_pack_adjst, customdeploy_iv_ss_loose_pack_adjst_sche
 */
define(['N/record', 'N/format', '../configs/constants', '../utils/InventoryUtils', 'N/search'], function (
    record,
    format,
    constants,
    inventoryManager,
    search
) {
    function execute(context) {
        // try {
        log.debug('schedule loose pack adjustment', 'schedule_loose_pack_adjustment.js start')
        const assemblyItemsList = inventoryManager.getAssemblyItemList()

        const { fineAssemblyItemsList, noAssemblyItemAdjustmentIdList } = getFineAssemblyItemsList(assemblyItemsList)
        createErrorLog(noAssemblyItemAdjustmentIdList, 'No assembly item found')

        const bomItemsList = inventoryManager.getBomItemList(fineAssemblyItemsList)
        const componentsList = inventoryManager.getComponentsList(bomItemsList)

        const itemOnHandQtyMap = inventoryManager.getItemOnHandQtyMap(componentsList.map((component) => component.item))

        createInventoryAdjustment(componentsList, itemOnHandQtyMap)
        log.debug('schedule loose pack adjustment', 'schedule_loose_pack_adjustment.js end')
        // } catch (e) {
        //     log.error('schedule loose pack adjustment', e.toJSON ? e : (
        //         e.stack ? e.stack : e.toString()
        //     ));
        // }
    }

    const createErrorLog = (noAssemblyItemAdjustmentIdList, errorMessage) => {
        noAssemblyItemAdjustmentIdList.forEach((adjustmentId) => {
            record.submitFields({
                type: record.Type.INVENTORY_ADJUSTMENT,
                id: adjustmentId,
                values: {
                    custbody_iv_error_log: errorMessage,
                },
            })
        })
    }

    const getFineAssemblyItemsList = (assemblyItemsList) => {
        //group all the assembly items in the array by the adjustment id
        const groupedArr = assemblyItemsList.reduce((accumulator, currentValue) => {
            const loosePackAdjustmentID = currentValue.loosePackAdjustmentID
            const existingGroup = accumulator.find((group) => group[0].loosePackAdjustmentID === loosePackAdjustmentID)
            if (existingGroup) {
                existingGroup.push(currentValue)
            } else {
                accumulator.push([currentValue])
            }

            return accumulator
        }, [])

        const noAssemblyItemAdjustmentList = []
        groupedArr.forEach((adjustments) => {
            if (!adjustments.some((adjustment) => adjustment.assemblyItemID !== null))
                noAssemblyItemAdjustmentList.push(adjustments)
        })

        const noAssemblyItemAdjustmentIdList = noAssemblyItemAdjustmentList.map(
            (adjustments) => adjustments[0].loosePackAdjustmentID
        )
        const fineAssemblyItemsList = assemblyItemsList.filter(
            (item) =>
                !noAssemblyItemAdjustmentIdList.includes(item.loosePackAdjustmentID) && item.assemblyItemID !== null
        )

        return { fineAssemblyItemsList, noAssemblyItemAdjustmentIdList }
    }

    /**
     * Create inventory adjustment records for a group of components, based on a bill of materials, and updates the corresponding loose pack adjustment record.
     *
     * @param {Array.<Component>} componentsList
     * @param {{[item: string]: {locationOnHand: number}}} itemOnHandQtyMap
     */
    const createInventoryAdjustment = (componentsList, itemOnHandQtyMap) => {
        log.debug('schedule loose pack adjustment', 'createInventoryAdjustment start')
        // Reduce the array to a new array of sub-arrays grouped by the 'billOfMaterials' property
        const groupedArr = componentsList.reduce((accumulator, currentValue) => {
            const loosePackAdjustmentID = currentValue.loosePackAdjustmentID
            const existingGroup = accumulator.find((group) => group[0].loosePackAdjustmentID === loosePackAdjustmentID)
            if (existingGroup) {
                existingGroup.push(currentValue)
            } else {
                accumulator.push([currentValue])
            }

            return accumulator
        }, [])
        // const groupedArr = componentsList.reduce((acc, cur) => {
        //     const index = acc.findIndex(item => item[0].billOfMaterials === cur.billOfMaterials);
        //     if (index !== -1) {
        //         acc[index].push(cur);
        //     } else {
        //         acc.push([cur]);
        //     }
        //     return acc;
        // }, []);
        log.debug(
            'schedule loose pack adjustment',
            'createInventoryAdjustment groupedArr: ' + JSON.stringify(groupedArr)
        )

        groupedArr.forEach((bomComponents) => {
            const rootLoosePackAdjustmentID = bomComponents[0].loosePackAdjustmentID
            let errorMessage = null
            const lotItemList = []

            log.debug(
                'schedule loose pack adjustment',
                'createInventoryAdjustment bomComponents(' +
                    rootLoosePackAdjustmentID +
                    '): ' +
                    bomComponents.length +
                    ': ' +
                    JSON.stringify(bomComponents)
            )

            // const inventoryLotList = inventoryManager.getInventoryLotList(bomComponents)
            const itemAverageCost = inventoryManager.getItemAverageCost(bomComponents)

            const inventoryAdjustmentRecord = record.create({
                type: record.Type.INVENTORY_ADJUSTMENT,
                isDynamic: true,
            })

            // Set the subsidiary, location, and other fields on the record
            inventoryAdjustmentRecord.setValue({
                fieldId: 'subsidiary',
                value: constants.IFL,
            })

            inventoryAdjustmentRecord.setValue({
                fieldId: 'account',
                value: constants.INVENTORIES_126395,
            })

            inventoryAdjustmentRecord.setValue({
                fieldId: 'memo',
                value: 'Loose Pack Adjustment',
            })

            try {
                bomComponents.forEach((component, index) => {
                    const isLotItem = search.lookupFields({
                        type: search.Type.ITEM,
                        id: component.item,
                        columns: ['islotitem'],
                    })['islotitem']
                    log.debug(
                        'schedule loose pack adjustment',
                        'createInventoryAdjustment component: ' +
                            JSON.stringify(component) +
                            ', cost: ' +
                            itemAverageCost[component.item] +
                            ', item type: ' +
                            JSON.stringify(isLotItem)
                    )
                    if (isLotItem) {
                        lotItemList.push(component)
                        return
                    }
                    createAssemblyItem(component, inventoryAdjustmentRecord, itemOnHandQtyMap, index)
                })

                log.debug('schedule loose pack adjustment', 'lotItemList: ' + JSON.stringify(lotItemList))
                const lotNumberedInventoryItemMap = inventoryManager.getLotNumberedInventoryItemMap(
                    lotItemList.map((item) => item.item)
                )
                log.debug(
                    'schedule loose pack adjustment',
                    'lotNumberedInventoryItemMap: ' + JSON.stringify(lotNumberedInventoryItemMap)
                )

                createLotItem(lotItemList, inventoryAdjustmentRecord, lotNumberedInventoryItemMap)
            } catch (error) {
                errorMessage = error.message
                log.error(
                    'schedule loose pack adjustment',
                    'createInventoryAdjustment error: ' + error.toJSON
                        ? error
                        : error.stack
                        ? error.stack
                        : error.toString()
                )
            }

            const loosePackAdjustmentRecord = record.load({
                type: record.Type.INVENTORY_ADJUSTMENT,
                id: rootLoosePackAdjustmentID,
                isDynamic: true,
            })

            if (!errorMessage) {
                const invAdjId = inventoryAdjustmentRecord.save({
                    enableSourcing: false,
                })
                log.debug('schedule loose pack adjustment', 'createInventoryAdjustment invAdjId: ' + invAdjId)
                // update the loose pack adjustment record
                loosePackAdjustmentRecord.setValue({
                    fieldId: 'custbody_iv_generated',
                    value: true,
                })
                loosePackAdjustmentRecord.setValue({
                    fieldId: 'custbody_iv_generation_time',
                    value: format.parse({
                        value: new Date(),
                        type: format.Type.DATE,
                        timezone: format.Timezone.ASIA_HONG_KONG,
                    }),
                })
                loosePackAdjustmentRecord.setValue({
                    fieldId: 'custbody_iv_linked_ia',
                    value: invAdjId,
                })
                loosePackAdjustmentRecord.setValue({
                    fieldId: 'custbody_iv_error_log',
                    value: '',
                })
                loosePackAdjustmentRecord.setValue({
                    fieldId: 'memo',
                    value: 'Successfully generated inventory adjustment',
                })

                log.debug(
                    'schedule loose pack adjustment',
                    'createInventoryAdjustment end, created inventory adjustment: ' +
                        invAdjId +
                        ' for loose pack adjustment: ' +
                        rootLoosePackAdjustmentID
                )
            } else {
                loosePackAdjustmentRecord.setValue({
                    fieldId: 'custbody_iv_error_log',
                    value: errorMessage,
                })
                log.debug(
                    'schedule loose pack adjustment',
                    'createInventoryAdjustment end, error: ' +
                        errorMessage +
                        ', for loose pack adjustment: ' +
                        rootLoosePackAdjustmentID
                )
            }
            loosePackAdjustmentRecord.save()
        })
    }

    const createAssemblyItem = (component, inventoryAdjustmentRecord, itemOnHandQtyMap, index) => {
        const consumeQty = component.quantity * component.loosePackQuantity
        inventoryAdjustmentRecord.selectNewLine({
            sublistId: 'inventory',
        })

        inventoryAdjustmentRecord.setCurrentSublistValue({
            sublistId: 'inventory',
            fieldId: 'item',
            value: component.item,
            ignoreFieldChange: false,
        })

        inventoryAdjustmentRecord.setCurrentSublistValue({
            sublistId: 'inventory',
            fieldId: 'location',
            value: constants.PACKING_WAREHOUSE_7F_JUNE,
        })

        log.debug('check item on hand', 'item: ' + component.item + ', on hand: ' + itemOnHandQtyMap[component.item])
        if (consumeQty > itemOnHandQtyMap[component.item].locationOnHand)
            throw new Error(
                'Insufficient quantity on hand for item ' +
                    component.itemName +
                    ' (required: ' +
                    consumeQty +
                    ', on hand: ' +
                    itemOnHandQtyMap[component.item].locationOnHand +
                    ')'
            )
        else itemOnHandQtyMap[component.item].locationOnHand -= consumeQty

        inventoryAdjustmentRecord.setCurrentSublistValue({
            sublistId: 'inventory',
            fieldId: 'adjustqtyby',
            value: consumeQty * -1,
        })

        inventoryAdjustmentRecord.commitLine({
            sublistId: 'inventory',
        })

        log.debug('schedule loose pack adjustment', 'createInventoryAdjustment committed: ' + index)
    }

    const createLotItem = (lotItemList, inventoryAdjustmentRecord, lotNumberedInventoryItemMap) => {
        for (let lotItem of lotItemList) {
            log.debug(
                'schedule loose pack adjustment',
                'createInventoryAdjustment lot item component: ' + JSON.stringify(lotItem)
            )
            inventoryAdjustmentRecord.selectNewLine({
                sublistId: 'inventory',
            })

            inventoryAdjustmentRecord.setCurrentSublistValue({
                sublistId: 'inventory',
                fieldId: 'item',
                value: lotNumberedInventoryItemMap[lotItem.item] || lotItem.item,
                ignoreFieldChange: false,
            })

            inventoryAdjustmentRecord.setCurrentSublistValue({
                sublistId: 'inventory',
                fieldId: 'location',
                value: constants.FINISHED_PRODUCT_WAREHOUSE_7F,
            })

            inventoryAdjustmentRecord.setCurrentSublistValue({
                sublistId: 'inventory',
                fieldId: 'adjustqtyby',
                value: lotItem.loosePackQuantity * lotItem.quantity * -1,
            })

            const inventoryDetail = inventoryAdjustmentRecord.getCurrentSublistSubrecord({
                sublistId: 'inventory',
                fieldId: 'inventorydetail',
            })

            setInventoryDetail(inventoryDetail)

            inventoryAdjustmentRecord.commitLine({
                sublistId: 'inventory',
            })
        }
    }

    /**
     * set the lot(s) for the item
     * @param inventoryDetail
     */
    const setInventoryDetail = (inventoryDetail) => {
        log.debug(
            'schedule loose pack adjustment',
            'setInventoryDetail start, item id: ' +
                inventoryDetail.getValue('item') +
                ', item name: ' +
                inventoryDetail.getText('item')
        )
        const targetIssueQty = Math.abs(inventoryDetail.getValue('quantity'))
        const lotList = findLotList(inventoryDetail.getValue('item'))
        log.debug('schedule loose pack adjustment', 'lotList: ' + JSON.stringify(lotList))

        if (!lotList || lotList.length === 0)
            throw new Error('No lot found for item ' + inventoryDetail.getText('item'))

        const totalLotQty = lotList.reduce((total, lot) => total + (lot.quantity || lot.available), 0)
        log.debug('schedule loose pack adjustment', { totalLotQty, targetIssueQty })
        if (totalLotQty < targetIssueQty)
            throw new Error(
                'Insufficient quantity on hand for item ' +
                    inventoryDetail.getText('item') +
                    ' (required: ' +
                    targetIssueQty +
                    ', on hand: ' +
                    totalLotQty +
                    ')'
            )

        let remainingIssueQty = targetIssueQty
        let index = 0
        while (remainingIssueQty > 0 && index < lotList.length) {
            log.debug(
                'schedule loose pack adjustment',
                'check params: ' +
                    JSON.stringify({
                        index,
                        lotList: lotList[index],
                        remainingIssueQty,
                        issuedQty: Math.min(remainingIssueQty, lotList[index]?.onHand) * -1,
                    })
            )
            const issuedQty = Math.min(remainingIssueQty, lotList[index]?.onHand) * -1
            if (issuedQty >= 0) {
                index++
                continue
            }
            inventoryDetail.selectNewLine({
                sublistId: 'inventoryassignment',
            })
            inventoryDetail.setCurrentSublistValue({
                sublistId: 'inventoryassignment',
                fieldId: 'issueinventorynumber',
                value: lotList[index].inventoryNumberId,
            })
            inventoryDetail.setCurrentSublistValue({
                sublistId: 'inventoryassignment',
                fieldId: 'quantity',
                value: issuedQty,
            })
            inventoryDetail.commitLine({
                sublistId: 'inventoryassignment',
            })

            remainingIssueQty += issuedQty
            index++
        }
    }

    /**
     * find all the lot for the item which is in the finished product warehouse and expiration date is not before today
     * @param {string} item internal id
     * @returns {*[]}
     */
    const findLotList = (item) => {
        const lotList = []

        const inventorybalanceSearchColItem = search.createColumn({ name: 'item', sort: search.Sort.ASC })
        const inventorybalanceSearchColLocation = search.createColumn({ name: 'location' })
        const inventorybalanceSearchColInventoryNumber = search.createColumn({ name: 'inventorynumber' })
        const inventorybalanceSearchColStatus = search.createColumn({ name: 'status' })
        const inventorybalanceSearchColOnHand = search.createColumn({ name: 'onhand' })
        const inventorybalanceSearchColAvailable = search.createColumn({ name: 'available' })

        const inventorybalanceSearch = search.create({
            type: 'inventorybalance',
            filters: [
                ['item', 'anyof', item],
                'AND',
                ['location', 'anyof', constants.FINISHED_PRODUCT_WAREHOUSE_7F],
                // 'AND',
                // [
                //     ['inventorynumber.expirationdate', 'onorafter', 'today'],
                //     'OR',
                //     ['inventorynumber.expirationdate', 'isempty', ''],
                // ],
            ],
            columns: [
                inventorybalanceSearchColItem,
                inventorybalanceSearchColLocation,
                inventorybalanceSearchColInventoryNumber,
                inventorybalanceSearchColStatus,
                inventorybalanceSearchColOnHand,
                inventorybalanceSearchColAvailable,
            ],
        })

        const inventorybalanceSearchPagedData = inventorybalanceSearch.runPaged({ pageSize: 1000 })
        for (let i = 0; i < inventorybalanceSearchPagedData.pageRanges.length; i++) {
            const inventorybalanceSearchPage = inventorybalanceSearchPagedData.fetch({ index: i })
            inventorybalanceSearchPage.data.forEach((result) => {
                const inventoryNumber = result.getText(inventorybalanceSearchColInventoryNumber)
                const inventoryNumberId = result.getValue(inventorybalanceSearchColInventoryNumber)
                const onHand = result.getValue(inventorybalanceSearchColOnHand)
                const available = result.getValue(inventorybalanceSearchColAvailable)

                lotList.push({
                    inventoryNumber,
                    inventoryNumberId,
                    onHand: parseFloat(onHand),
                    available: parseFloat(available),
                })
            })
        }

        log.debug(
            'schedule loose pack adjustment',
            'findLotList for item (' + item + ') lotList: ' + JSON.stringify(lotList)
        )
        return mergeObjectInList(lotList, 'inventoryNumber', 'onHand', 'available')
    }

    const mergeObjectInList = (list, key, ...fields) => {
        return list.reduce((acc, obj) => {
            const existingObj = acc.find((item) => item[key] === obj[key])
            if (existingObj) {
                fields.forEach((field) => {
                    if (obj.hasOwnProperty(field)) {
                        existingObj[field] += obj[field]
                    }
                })
            } else {
                acc.push(obj)
            }
            return acc
        }, [])
    }

    return {
        execute: execute,
    }
})
