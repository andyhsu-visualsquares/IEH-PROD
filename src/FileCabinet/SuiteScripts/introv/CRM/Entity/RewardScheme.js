/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author John Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class RewardScheme {
        constructor(data) {
            this.internalId = data.internalId
            this.name = data.name
            this.displayMessageEN = data.displayMessageEN
            this.displayMessageSC = data.displayMessageSC
            this.displayMessageTC = data.displayMessageTC
            this.gifts = data.gifts
            this.giftQty = data.giftQty
            this.rewardType = data.rewardType
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return RewardScheme
})
