/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 * Name : SL Create SO Web
 * Script : customscript_iv_create_so_web_sl
 * Deploy : customdeploy_iv_create_so_web_sl
 */
 define(['../AutoFulfilOnlineSO', '../AutoInvoiceSO', 'N/error', 'N/log', '../../DAO/ConfigurationTableDAO'], function (AutoFulfilOnlineSO, AutoInvoiceSO, error, log, ConfigurationTableDAO) {

    function onRequest(context) {
        let rtn = {
            isSuccess: false,
            msg: "raw",
            id: 0,
            type: ""
        };

        var newRecId, newRecType;
        if (!!context.request.body) {
            params = JSON.parse(context.request.body);

            newRecId = params.newRecId;
            newRecType = params.newRecType;
            log.debug("params", JSON.stringify(params));
        }
        else {
            throw error.create({
                message: "Invalid Param",
                name: "Inavlid Param",
                notifyOff: true
            })
        }
        var newRecord = {
            type: newRecType,
            id: newRecId,
        }

        try {
            const { eShopAutoFulfilment } = new ConfigurationTableDAO().findAll()
            log.debug('eShopAutoFulfilment', JSON.stringify(eShopAutoFulfilment))
            if(eShopAutoFulfilment){
                try{
                    new AutoFulfilOnlineSO(newRecord).fulfilOnlineSO()
                    log.debug('afterSubmit', 'Online SO Fulfiled')
                }
                catch(e)
                {
                    log.debug("AutoFulfilOnlineSO.fulfilOnlineSO", e.message);
                }
            }
            try{
                // Stopped auto-billing requested by IEH Feb 5 
                // new AutoInvoiceSO(newRecord).invoiceSO()
                // log.debug('afterSubmit', 'Online SO Invoiced')
               
            }
            catch(e)
            {
                log.debug("AutoInvoiceSO.invoiceSO", e.message);
            }
        } catch (e) {
            log.error('afterSubmit', e.toJSON ? e : e.stack ? e.stack : e.toString())
        }
        rtn.isSuccess = true
        context.response.write(JSON.stringify(rtn));
    }

    return {
        onRequest: onRequest
    }
});
