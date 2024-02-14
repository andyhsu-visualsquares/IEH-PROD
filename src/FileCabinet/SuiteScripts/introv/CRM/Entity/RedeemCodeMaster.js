/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class RedeemCodeMaster {
        constructor({ internalId, name, product, voucherItem, sent }) {
            this.internalId = internalId
            this.name = name
            this.product = product
            this.voucherItem = voucherItem
            this.sent = sent
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return RedeemCodeMaster
})
