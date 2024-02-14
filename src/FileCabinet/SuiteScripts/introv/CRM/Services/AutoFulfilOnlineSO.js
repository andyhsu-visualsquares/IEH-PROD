/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../../lib/lodash', 'N/error', 'N/format', 'N/record', '../DAO/ClassTypeDAO', '../DAO/ItemDAO', '../DAO/RedeemCodeMasterDAO', '../DAO/ScriptErrorDAO',], (_, error, format, record, ClassTypeDAO, ItemDAO, RedeemCodeMasterDAO, ScriptErrorDAO) => {
    class AutoFulfilOnlineSO {
        constructor(newRecord) {
            this.newRecord = record.load({
                type: newRecord.type,
                id: newRecord.id,
                isDynamic: true,
            })
            this.itemFulfilmentRecord = null
            this.itemFulfilmentCount = 0
            this.allDigitalClassList = new ClassTypeDAO()
                .findAll()
                .map((classType) => classType.internalId)
        }

        fulfilOnlineSO() {
            if (this.newRecord.getValue('custbody_iv_is_auto_fulfill')) return

            try {
                this.initializeItemFulfillment()
                this.setItemFulfillmentDate()
                this.updateItemFulfillmentLines()

                if (this.itemFulfilmentCount == 0) {
                    const fulfilmentId = this.itemFulfilmentRecord.save()
                    this.updateSalesOrder()
                }
            } catch (e) {
                log.error("Autofulfill Error SO : " + this.newRecord.id, e.name + e.message + e.stack);
                record.submitFields({
                    type: record.Type.SALES_ORDER,
                    id: this.newRecord.id,
                    values: {
                        custbody_iv_error_log: e.message,
                    },
                })
                new ScriptErrorDAO().create({
                    errorMessage: e.message,
                    transId: this.newRecord.id,
                    recordType: '',
                    script: '',
                })
            }
        }

        initializeItemFulfillment() {
            this.itemFulfilmentRecord = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: this.newRecord.id,
                toType: record.Type.ITEM_FULFILLMENT,
                isDynamic: true,
            })
        }

        setItemFulfillmentDate() {
            const parsedDate = format.parse({
                value: this.newRecord.getValue('trandate'),
                type: format.Type.DATE,
                timezone: 'Asia/Hong_Kong',
            })
            this.itemFulfilmentRecord.setValue('trandate', parsedDate)
        }

        updateItemFulfillmentLines() {
            const fulfilmentLineItemFullList = this.getItemFromItemFulfilment()
            const fulfilmentLineItemList = fulfilmentLineItemFullList.itemlist
            const fulfilmentLineQtyList = fulfilmentLineItemFullList.quantitylist
            const itemList = new ItemDAO().findByInternalIds(fulfilmentLineItemList)

            log.debug('fulfilmentLineItemFullList', fulfilmentLineItemFullList)
            log.debug('fulfilmentLineItemList', fulfilmentLineItemList)
            log.debug('fulfilmentLineQtyList', fulfilmentLineQtyList)
            log.debug('itemList', itemList)
            log.debug('allDigitalClassList', this.allDigitalClassList)


            const validItemIdList = itemList.filter((item) => this.allDigitalClassList.includes(item.CLASS))
            log.debug('validItemIdList', validItemIdList)

            this.itemFulfilmentCount = itemList.length - validItemIdList.length
            // 20231124 John Only fulfill if all item is digital.
            if(this.itemFulfilmentCount == 0){

                const redeemCodeMasterList = new RedeemCodeMasterDAO().findByInternalId(fulfilmentLineItemList)
                // log.debug('redeemItemList', JSON.stringify(redeemCodeMasterList))
                const redeemCodeListByProduct = _.groupBy(redeemCodeMasterList, 'voucherItem')
                log.debug('redeemCodeListByProduct', JSON.stringify(_.keys(redeemCodeListByProduct)))
                var isRedeemCodeEnough = false;
                for(var checkRedeemCodeIndex = 0; checkRedeemCodeIndex < fulfilmentLineItemList.length; checkRedeemCodeIndex++){
                    if(!redeemCodeListByProduct[fulfilmentLineItemList[checkRedeemCodeIndex]] || redeemCodeListByProduct[fulfilmentLineItemList[checkRedeemCodeIndex]].length < fulfilmentLineQtyList[checkRedeemCodeIndex]){
                        throw error.create({
                            message: "Not Enough Voucher On line: " + checkRedeemCodeIndex + ", Item Id: "+fulfilmentLineItemList[checkRedeemCodeIndex],
                            name: "Not Enough Voucher",
                            notifyOff: true
                        })
                    }
                }
                for(var checkRedeemCodeIndex = 0; checkRedeemCodeIndex < fulfilmentLineItemList.length; checkRedeemCodeIndex++){
                    var bodyFieldsToBeUpdated = [
                        {
                            field: 'custrecordrcmastersentorsold',
                            value: true,
                            valueType: 'value',
                        },
                        {
                            field: 'custrecordrcmastersalestransaction',
                            value: this.newRecord.id,
                            valueType: 'value',
                        },
                    ]
                    log.debug("bodyFieldsToBeUpdated", bodyFieldsToBeUpdated)
                    for (let code = 0; code < fulfilmentLineQtyList[checkRedeemCodeIndex]; code++) {
                        new RedeemCodeMasterDAO().update(redeemCodeListByProduct[fulfilmentLineItemList[checkRedeemCodeIndex]][code].internalId, bodyFieldsToBeUpdated)
                    }
                }

                for (let j = 0; j < this.itemFulfilmentRecord.getLineCount({ sublistId: 'item' }); j++) {
                    this.itemFulfilmentRecord.selectLine({ sublistId: 'item', line: j })
                    const lineItemId = this.itemFulfilmentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                    })

                    log.debug(
                        'value : ' + (validItemIdList.findIndex((item) => '' + item.INTERNAL_ID === '' + lineItemId) !== -1),
                        'Success to Fulfill Line: '+ j + ' of item : ' + lineItemId
                    )
                    this.itemFulfilmentRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemreceive',
                        value: validItemIdList.findIndex((item) => '' + item.INTERNAL_ID === '' + lineItemId) !== -1,
                        ignoreFieldChange: true,
                    })

                    this.itemFulfilmentRecord.commitLine({ sublistId: 'item' })
                }
            }
        }

        getItemFromItemFulfilment() {
            const itemlist = []
            const quantitylist = []
            for (let j = 0; j < this.itemFulfilmentRecord.getLineCount({ sublistId: 'item' }); j++) {
                this.itemFulfilmentRecord.selectLine({ sublistId: 'item', line: j })
                const lineItemId = this.itemFulfilmentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                })
                const lineQty = this.itemFulfilmentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                })
                if (itemlist.indexOf(lineItemId) === -1) {
                    itemlist.push(lineItemId)
                    quantitylist.push(lineQty)
                }
                else{
                    quantitylist[itemlist.indexOf(lineItemId)] += Number(lineQty)
                }
            }
            return {itemlist, quantitylist}
        }

        updateSalesOrder() {
            record.submitFields({
                type: record.Type.SALES_ORDER,
                id: this.newRecord.id,
                values: {
                    custbody_iv_is_auto_fulfill: true,
                    custbody_iv_error_log: "",
                },
            })
        }
    }

    return AutoFulfilOnlineSO
})
