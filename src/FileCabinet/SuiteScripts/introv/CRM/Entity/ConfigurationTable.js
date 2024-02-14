/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class ConfigurationTable {
        constructor(data) {
            this.internalId = data.internalId
            this.eShopAutoFulfilment = data.eShopAutoFulfilment
            this.key = data.key
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return ConfigurationTable
})
