/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['./IRewardAction', '../../DAO/EarnedRewardsDAO', '../../../utils/DateUtils', '../../../lib/Time/moment-timezone'], (
    IRewardAction,
    EarnedRewardsDAO,
    DateUtils,
  moment
) => {
    class InvalidAction extends IRewardAction {
        execute() {
            log.audit('Invalid Action Start')
            return this.create()
        }

        create() {
            // Logic for creating a reward during an invalid action
            log.debug('InvalidAction execute info', JSON.stringify(this.info))
            const dateUtils = new DateUtils()

            const REWARD_TYPE = 1
            const REWARD_SCHEME = 5
            const REWARD_SUBSI = 10

            const rewardRecord = {
                REWARD_TYPE,
                REWARD_SCHEME,
                REWARD_CUSTOMER: this.info.internalId,
                REWARD_SUBSI,
                REWARD_REDEEMPOINT: 0,
                REWARD_DATE_TIME: dateUtils.getTodayInputFormat(),
                // REWARD_PROVISION_DATE_TIME: dateUtils.getTodayInputFormat(),
              REWARD_PROVISION_DATE_TIME: moment().tz('Asia_Hong_Kong').format('YYYY/MM/DD'),
                REWARD_EXPIRY_DATE_TIME: dateUtils.getMonthEndOfDate(dateUtils.get18MonthsFromTodayInputFormat(), {
                    inputFormat: dateUtils.inputDateFormat,
                    outputFormat: dateUtils.inputDateFormat,
                }),
                REWARD_STATUS: 2,
                REWARD_OMNI_EN_MSG: 'Member Registration - Invalid Receipt / Used Receipt',
                REWARD_OMNI_TC_MSG: '會員註冊 - 收據無效 / 收據重覆使用',
                REWARD_OMNI_SC_MSG: '会员註册 - 收据无效 / 收据重覆使用',
            }

            new EarnedRewardsDAO().createRewardRecord(rewardRecord)
        }
    }

    return InvalidAction
})
