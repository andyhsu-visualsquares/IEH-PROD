/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType MapReduceScript
 * @author Andy Chan
 *
 * @ScriptName MR Redemption Staging Workflow Controlle
 * @ScriptId customscript_iv_redemption_staging_ctrl
 * @DeploymentId customdeploy_iv_redemption_staging_ctrl
 * @Schedule every 15 minutes
 * @Description To control the workflow of redemption staging
 */
define(['./Services/RedemptionStagingWorkflowServices', './DAO/ScriptErrorDAO'], (
    RedemptionStagingWorkflowServices,
    ScriptErrorDAO
) => {
    const redemptionStagingWorkflowServices = new RedemptionStagingWorkflowServices()

    const getInputData = (context) => {
        try {
            log.audit('getInputData', context)

            return redemptionStagingWorkflowServices.findNonFinishRedemptionStagingList()
        } catch (e) {
            log.error('getInputDataError', e.toJSON ? e : e.stack ? e.stack : e.toString())
        }
    }

    const map = (context) => {
        const { value } = context
        const parsedValue = JSON.parse(value)
        log.audit('map', JSON.stringify(parsedValue))

        try {
            redemptionStagingWorkflowServices.setInternalId(parsedValue.internalId)
            redemptionStagingWorkflowServices.updateStagingStatus('2')

            redemptionStagingWorkflowServices.initAction('redemption', JSON.parse(parsedValue.info))
            const { soId, redeemCodeList } = redemptionStagingWorkflowServices.createSO()
            redemptionStagingWorkflowServices.updateRedeemCodeMaster(
                redeemCodeList,
                parsedValue.redemptionRewardId,
                soId
            )
            redemptionStagingWorkflowServices.fulfillSO(soId)

            redemptionStagingWorkflowServices.updateStagingStatus('4')
            redemptionStagingWorkflowServices.updateErrorMessage('')
            log.debug('done')
        } catch (e) {
            log.error('map', e.toJSON ? e : e.stack ? e.stack : e.toString())
            new ScriptErrorDAO().create({
                e,
                recordType: `Redemption Staging - ${parsedValue.internalId}`,
                script: 'MR_RedemptionStagingWorkflowController',
            })
            redemptionStagingWorkflowServices.updateStagingStatus('3')
            redemptionStagingWorkflowServices.updateErrorMessage(e.toJSON ? e : e.stack ? e.stack : e.toString())
            redemptionStagingWorkflowServices.rollback()
        }
    }

    const reduce = (context) => {
        try {
            log.audit('reduce', context)
            const { key, values } = context
        } catch (e) {
            log.error('reduce', e.toJSON ? e : e.stack ? e.stack : e.toString())
        }
    }

    const summarize = (context) => {
        try {
            log.audit('summarize', context)
            const { dateCreated, seconds, usage, concurrency, yields } = context
        } catch (e) {
            log.error('summarize', e.toJSON ? e : e.stack ? e.stack : e.toString())
        }
    }

    return {
        getInputData,
        map,
        reduce,
        summarize,
    }
})
