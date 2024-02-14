/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([
    '../Repository/RewardActions/RewardActionFactory',
    '../DAO/RedemptionStagingDAO',
    '../../utils/DateUtils',
    '../DAO/EarnedRewardsDAO',
    'N/record',
    '../../lib/Time/moment-timezone',
    '../Constants/Constants',
    'N',
], (RewardActionFactory, RedemptionStagingDAO, DateUtils, EarnedRewardsDAO, record, moment, Constants, N_1) => {
    class PendingMembershipCalculationWorkflowServices {
        constructor() { }

        getNonFinishedPendingCalculationRec() {
            const pmcRecSearch = N_1.search.create({
                type: 'customrecord_iv_customer_pend_member_cal',
                filters: [
                    [
                        'custrecord_iv_pmc_processing_status',
                        'anyof',
                        Constants.STAGING_REC_STATUS.PENDING_START,
                        Constants.STAGING_REC_STATUS.PENDING_RETRY,
                    ],
                ],
                columns: [
                    'custrecord_iv_pmc_target_customer',
                    'custrecord_iv_pmc_customer_id',
                    'custrecord_iv_pmc_customer_info',
                ],
            })
            log.debug('search result', pmcRecSearch.run().getRange({ start: 0, end: 1000 }))
            return pmcRecSearch.run().getRange({ start: 0, end: 1000 })
        }

        editProcessingStatus(pmcRecID, status) {
            return record.submitFields({
                type: 'customrecord_iv_customer_pend_member_cal',
                id: pmcRecID,
                values: {
                    custrecord_iv_pmc_processing_status: status,
                },
            })
        }

        handlingError(pmcRecID, errorMsg) {
            return record.submitFields({
                type: 'customrecord_iv_customer_pend_member_cal',
                id: pmcRecID,
                values: {
                    custrecord_iv_pmc_error_msg: errorMsg,
                    custrecord_iv_pmc_processing_status: Constants.STAGING_REC_STATUS.PENDING_RETRY,
                },
            })
        }

        findWithInSixMonthsRecordsByCustomer({ firstName, lastName, internalId }) {
            return new EarnedRewardsDAO().findWithInSixMonthsRecordsByCustomer({ firstName, lastName, internalId }).length === 0
        }
    }

    return PendingMembershipCalculationWorkflowServices
})
