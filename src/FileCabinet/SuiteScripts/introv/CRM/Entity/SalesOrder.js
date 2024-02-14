/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class SalesOrder {
        constructor({ NAME, INTERNAL_ID, TRANS_ID, TOTAL_AMOUNT, DISCOUNT_AMOUNT, PURCHASE_WAY, TYPE, CREATED_DATE }) {
            this.NAME = NAME
            this.INTERNAL_ID = INTERNAL_ID
            this.TRANS_ID = TRANS_ID
            this.TOTAL_AMOUNT = TOTAL_AMOUNT
            this.DISCOUNT_AMOUNT = DISCOUNT_AMOUNT
            this.PURCHASE_WAY = PURCHASE_WAY
            this.TYPE = TYPE
            this.CREATED_DATE = CREATED_DATE
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return SalesOrder
})
