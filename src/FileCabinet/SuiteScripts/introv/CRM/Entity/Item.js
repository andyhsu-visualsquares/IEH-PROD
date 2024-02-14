/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class Item {
        constructor({ NAME, INTERNAL_ID, TYPE, CLASS }) {
            this.NAME = NAME
            this.INTERNAL_ID = INTERNAL_ID
            this.TYPE = TYPE
            this.CLASS = CLASS
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return Item
})
