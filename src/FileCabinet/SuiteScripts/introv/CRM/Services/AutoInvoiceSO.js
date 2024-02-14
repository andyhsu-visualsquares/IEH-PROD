/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/format', 'N/record'], (format, record) => {
    class AutoInvoiceSO {
        constructor(newRecord) {
            this.newRecord = record.load({
                type: newRecord.type,
                id: newRecord.id,
                isDynamic: true,
            })
        }

        invoiceSO() {
            if (this.newRecord.getValue('custbody_iv_is_auto_invoice')) return

            let hasUnbilled = false
            for (let i = 0; i < this.newRecord.getLineCount({ sublistId: 'item' }); i++) {
                const quantity = this.newRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    line: i,
                })
                const billedQuantity = this.newRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantitybilled',
                    line: i,
                })

                if (quantity > billedQuantity) {
                    hasUnbilled = true
                    break
                }
            }
            if (!hasUnbilled) return

            const invoiceRecord = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: this.newRecord.id,
                toType: record.Type.INVOICE,
                isDynamic: true,
            })
            const parsedDate = format.parse({
                value: this.newRecord.getValue('trandate'),
                type: format.Type.DATE,
                timezone: 'Asia/Hong_Kong',
            })
            invoiceRecord.setValue('trandate', parsedDate)
            invoiceRecord.save()

            this.updateSalesOrder()
        }

        updateSalesOrder() {
            record.submitFields({
                type: this.newRecord.type,
                id: this.newRecord.id,
                values: {
                    custbody_iv_is_auto_invoice: true,
                },
            })
        }
    }

    return AutoInvoiceSO
})
