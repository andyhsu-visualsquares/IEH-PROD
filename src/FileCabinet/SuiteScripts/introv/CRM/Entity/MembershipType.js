/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class MembershipType {
        constructor({
            MEMBERSHIP_TYPE,
            SPENDING_TO,
            SPENDING_SENTENCE,
            AVAILABLE_TIER,
            NEXT_TIER,
            CUMULATIVE_SPENDING_PERIOD,
            TIER_ID,
            MAINTAIN,
            TOP_TIER
        }) {
            this.MEMBERSHIP_TYPE = MEMBERSHIP_TYPE
            this.SPENDING_TO = SPENDING_TO
            this.SPENDING_SENTENCE = SPENDING_SENTENCE
            this.AVAILABLE_TIER = AVAILABLE_TIER
            this.NEXT_TIER = NEXT_TIER
            this.CUMULATIVE_SPENDING_PERIOD = CUMULATIVE_SPENDING_PERIOD
            this.TIER_ID = TIER_ID
            this.MAINTAIN = MAINTAIN
            this.TOP_TIER = TOP_TIER
        }

        toString() {
            return JSON.stringify(this)
        }
    }

    return MembershipType
})
