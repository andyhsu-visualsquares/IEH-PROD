/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/record'], (record) => {
    class ScriptErrorDAO {
        create(data) {
            const rec = record.create({
                type: 'customrecord_iv_crm_error',
                isDynamic: true,
            })

            rec.setValue('custrecord_iv_crm_error_status', '1')
            rec.setValue('custrecord_iv_error_msg', data.errorMessage || '<br/> Error : ' + data.e.message || '')
            rec.setValue('custrecord_iv_error_record_type', data.recordType)
            rec.setValue('custrecord_iv_error_script', data.script)
            rec.setValue('custrecord_iv_error_time', new Date())
            rec.setValue('custrecord_iv_error_last_update', new Date())
            rec.setValue('custrecord_error_trans', data.transId)

            return rec.save()
        }
    }

    return ScriptErrorDAO
})
