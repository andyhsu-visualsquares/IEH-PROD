/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class Channel {
        constructor({ internalId, name, relatedLocation, posID, parent }) {
            this.internalId = internalId
            this.name = name
            this.relatedLocation = relatedLocation
            this.parent = parent
            this.posID = posID
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return Channel
})
