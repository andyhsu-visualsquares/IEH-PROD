/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class EarnedRewards {
        constructor({
            internalId,
            name,
            type,
            provisionDate,
            redeemedPoint,
            pointExpiryDate,
            scheme,
            earnedPoints,
            createdDate,
            transaction,
            points,
            manualAdjustment,
            redemptionItem,
            redemptionRec,
            expired,
            customer,
        }) {
            this.internalId = internalId
            this.name = name
            this.type = type
            this.provisionDate = provisionDate
            this.redeemedPoint = redeemedPoint
            this.pointExpiryDate = pointExpiryDate
            this.scheme = scheme
            this.earnedPoints = earnedPoints
            this.createdDate = createdDate
            this.transaction = transaction
            this.points = points
            this.manualAdjustment = manualAdjustment
            this.redemptionItem = redemptionItem
            this.redemptionRec = redemptionRec
            this.expired = expired
            this.customer = customer
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return EarnedRewards
})
