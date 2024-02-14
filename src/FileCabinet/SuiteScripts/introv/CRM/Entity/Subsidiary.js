/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class Subsidiary {
        constructor({ NAME, INTERNAL_ID, COUNTRY, CURRENCY, LANGUAGE, ADDRESS }) {
            this.NAME = NAME
            this.INTERNAL_ID = INTERNAL_ID
            this.COUNTRY = COUNTRY
            this.CURRENCY = CURRENCY
            this.LANGUAGE = LANGUAGE
            this.ADDRESS = ADDRESS
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return Subsidiary
})
