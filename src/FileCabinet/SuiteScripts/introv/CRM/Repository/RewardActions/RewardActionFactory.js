/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['./MergeAction', './InvalidAction', './EarnAction', './RedemptionAction'], (
    MergeAction,
    InvalidAction,
    EarnAction,
    RedemptionAction
) => {
    class RewardActionFactory {
        constructor(mode, info) {
            this.mode = mode
            this.info = info
        }

        getRewardActionByMode() {
            switch (this.mode) {
                case 'merge':
                    return new MergeAction(this.info)
                case 'invalid':
                    return new InvalidAction(this.info)
                case 'earn':
                    return new EarnAction(this.info)
                case 'redemption':
                    return new RedemptionAction(this.info)
                default:
                    throw new Error(`Unsupported mode: ${this.mode}`)
            }
        }
    }

    return RewardActionFactory
})
