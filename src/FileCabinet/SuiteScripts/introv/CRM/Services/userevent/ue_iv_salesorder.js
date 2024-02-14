/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 *
 * Script Name : UE Salesorder
 * Script Id : customscript_iv_salesorder_ue
 * Deploy Id : customdeploy_iv_salesorder_ue
 *
 * 20230510 John : added new field "custrecord_iv_ext_so_id" as index of externalId
 * 20231101 John : inactived Was used to trigger create Invoice and Fulfillment, now use function insert to Restlet SO Web
 **/
define(['../AutoFulfilOnlineSO', '../AutoInvoiceSO', '../../DAO/ConfigurationTableDAO'], function (
    AutoFulfilOnlineSO,
    AutoInvoiceSO,
    ConfigurationTableDAO
) {
    function afterSubmit(context) {
        try {
            if (context.type === context.UserEventType.DELETE) return
            const { eShopAutoFulfilment } = new ConfigurationTableDAO().findAll()
            log.debug('eShopAutoFulfilment', eShopAutoFulfilment)

            new AutoFulfilOnlineSO(context.newRecord).fulfilOnlineSO()
            log.debug('afterSubmit', 'Online SO Fulfiled')
            new AutoInvoiceSO(context.newRecord).invoiceSO()
            log.debug('afterSubmit', 'Online SO Invoiced')
        } catch (e) {
            log.error('afterSubmit', e.toJSON ? e : e.stack ? e.stack : e.toString())
        }
    }

    return {
        afterSubmit,
    }
})
