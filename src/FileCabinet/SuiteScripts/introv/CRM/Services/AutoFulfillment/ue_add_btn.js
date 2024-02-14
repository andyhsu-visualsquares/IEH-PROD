/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType UserEventScript
 * @author Andy Chan
 *
 * @ScriptName
 * @ScriptId
 * @DeploymentId
 * @ApplyTo
 * @Description
 */
define([], () => {
    const beforeLoad = (context) => {
        try {
            log.audit('beforeLoad', {
                type: context.type,
                form: context.form,
                newRecord: {
                    type: context.newRecord.type,
                    id: context.newRecord.id,
                },
                request: !context.request
                    ? null
                    : {
                          url: context.request.url,
                          parameters: context.request.parameters,
                      },
            })
            const { type, newRecord, form, request } = context
            if (type !== context.UserEventType.VIEW) {
                form.addButton({
                    id: 'custpage_btn_fulfillment',
                    label: 'Fulfillment',
                })
            }
        } catch (e) {
            log.error('beforeLoad', e.toJSON ? e : e.stack ? e.stack : e.toString())
        }
    }

    return {
        beforeLoad,
    }
})
