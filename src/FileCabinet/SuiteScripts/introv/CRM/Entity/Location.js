/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class Location {
        constructor({ internalId, name, posID, relatedChannel, type, subsidiary, spoilageLocation }) {
            this.internalId = internalId
            this.name = name
            this.posID = posID
            this.relatedChannel = relatedChannel
            this.type = type
            this.subsidiary = subsidiary
            this.spoilageLocation = spoilageLocation
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return Location
})
