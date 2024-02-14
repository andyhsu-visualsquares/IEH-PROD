/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['./IRewardAction', '../../DAO/EarnedRewardsDAO', '../../DAO/RewardSchemeDAO', '../../../utils/DateUtils'], (
    IRewardAction,
    EarnedRewardsDAO,
    RewardSchemeDAO,
    DateUtils
) => {
    class MergeAction extends IRewardAction {
        execute() {
            log.audit('Merge Action Start')
            return this.create()
        }

        create() {
            log.debug('MergeAction execute info', JSON.stringify(this.info))
            const dateUtils = new DateUtils()

            const REWARD_TYPE = 1
            const REWARD_SCHEME = 11
            const REWARD_SUBSI = 10
            const { displayMessageEN, displayMessageSC, displayMessageTC } = new RewardSchemeDAO().findByInternalId(
                REWARD_SCHEME
            )

            const rewardRecord = {
                REWARD_TYPE,
                REWARD_SCHEME,
                REWARD_CUSTOMER: this.info.internalId,
                REWARD_SUBSI,
                REWARD_REDEEMPOINT: 0,
                REWARD_DATE_TIME: dateUtils.getTodayInputFormat(),
                REWARD_PROVISION_DATE_TIME: dateUtils.getTodayInputFormat(),
                REWARD_EXPIRY_DATE_TIME: dateUtils.getMonthEndOfDate(dateUtils.get18MonthsFromTodayInputFormat(), {
                    inputFormat: dateUtils.inputDateFormat,
                    outputFormat: dateUtils.inputDateFormat,
                }),
                REWARD_STATUS: 2,
                REWARD_OMNI_EN_MSG: displayMessageEN,
                REWARD_OMNI_TC_MSG: displayMessageTC,
                REWARD_OMNI_SC_MSG: displayMessageSC,
                REWARD_EARNEDPOINT: this.info.mergePoint,
            }

            log.debug('createRewardRecord id', new EarnedRewardsDAO().createRewardRecord(rewardRecord))
        }
    }
    return MergeAction
})
