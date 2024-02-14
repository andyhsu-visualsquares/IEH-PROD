/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class InventoryNumber {
        constructor({
            internalId,
            number,
            item,
            memo,
            expirationDate,
            location,
            onHand,
            available,
            onOrder,
            isOnHand,
            inTransit,
            dateCreated,
        }) {
            this.internalId = internalId
            this.number = number
            this.item = item
            this.memo = memo
            this.expirationDate = expirationDate
            this.location = location
            this.onHand = onHand
            this.available = available
            this.onOrder = onOrder
            this.isOnHand = isOnHand
            this.inTransit = inTransit
            this.dateCreated = dateCreated
        }

        toString() {
            return JSON.stringify(this)
        }
    }
    return InventoryNumber
})
