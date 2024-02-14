/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class IntegrationMapping {
        constructor({ TYPE, NS_ID, POS_ID }) {
            this.TYPE = TYPE
            this.NS_ID = NS_ID
            this.POS_ID = POS_ID
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return IntegrationMapping
})
