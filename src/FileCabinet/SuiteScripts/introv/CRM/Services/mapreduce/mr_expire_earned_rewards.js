/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType MapReduceScript
 * @author Andy Chan
 *
 * @ScriptName
 * @ScriptId
 * @DeploymentId
 * @Schedule
 * @Description
 */
define(['../../DAO/EarnedRewardsDAO'], (EarnedRewardsDAO) => {
    const getInputData = (context) => {
        try {
            log.audit('getInputData', context)
            return new EarnedRewardsDAO().findExpiredList()
        } catch (e) {
            log.error('getInputData', e.toJSON ? e : e.stack ? e.stack : e.toString())
        }
    }

    const map = (context) => {
        try {
            log.audit('map', context)
            const { key, value } = context
            const { internalId } = JSON.parse(value)

            const bodyFields = [
                {
                    field: 'custrecord_iv_status',
                    value: 6,
                    valueType: 'value',
                },
                {
                    field: 'custrecord_iv_expired',
                    value: true,
                    valueType: 'value',
                },
            ]

            new EarnedRewardsDAO().update(internalId, bodyFields)
        } catch (e) {
            log.error('map', e.toJSON ? e : e.stack ? e.stack : e.toString())
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
