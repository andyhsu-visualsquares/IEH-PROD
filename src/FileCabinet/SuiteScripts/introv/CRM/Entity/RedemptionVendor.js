/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class RedemptionVendor {
        constructor({ NAME, INTERNAL_ID }) {
            this.NAME = NAME
            this.INTERNAL_ID = INTERNAL_ID
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return RedemptionVendor
})
