/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class RedemptionStaging {
        constructor(data) {
            this.inactive = data.inactive
            this.name = data.name
            this.internalId = data.internalId
            this.info = data.info
            this.redemptionRewardId = data.redemptionRewardId
            this.status = data.status
            this.error = data.error
        }
    }

    return RedemptionStaging
})
