/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType UserEventScript
 * @author Andy Chan
 *
 * @ScriptName UE Append Redeem Code to Email
 * @ScriptId customscript_iv_append_email_ue
 * @DeploymentId customdeploy_iv_append_email_ue
 * @ApplyTo Sales Order
 * @Description Append Redeem Code to Email Template
 */
define([], () => {
    const beforeSubmit = (context) => {
        try {
            log.audit('beforeSubmit', {
                type: context.type,
                newRecord: {
                    type: context.newRecord.type,
                    id: context.newRecord.id,
                },
                oldRecord: !context.oldRecord
                    ? null
                    : {
                          type: context.oldRecord.type,
                          id: context.oldRecord.id,
                      },
            })
            const { type, newRecord, oldRecord } = context
            const isAppended = newRecord.getValue({ fieldId: 'custbody_iv_redeem_code_appended' })
            const redeemCode = newRecord.getValue({ fieldId: 'custbody_iv_so_redeem_master_code' })
            const emailTemplate = newRecord.getValue({ fieldId: 'custbodyemailcontent' })

            if (isAppended) return
            if (!redeemCode || redeemCode === '') return
            if (!emailTemplate || emailTemplate === '') return

            const redeemCodeTitle = 'Redeem Code'
            let appendEmail = ''
            appendEmail += emailTemplate
            appendEmail +=
                '<p>' +
                '<span style="font-size:11pt"><span style="font-family:Calibri,sans-serif"><strong><em><u><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="color:#7030a0">' +
                redeemCodeTitle +
                '</span></span></span></u></em></strong></span></span>' +
                '<br>'
            appendEmail += redeemCode
            log.debug('appendEmail', appendEmail)
            newRecord.setValue({ fieldId: 'custbodyemailcontent', value: appendEmail })
            newRecord.setValue({ fieldId: 'custbody_iv_redeem_code_appended', value: true })
        } catch (e) {
            log.error('beforeSubmit', e.toJSON ? e : e.stack ? e.stack : e.toString())
        }
    }

    return {
        beforeSubmit,
    }
})
