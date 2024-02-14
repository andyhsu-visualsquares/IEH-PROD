/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType MapReduceScript
 * @author Andy Chan
 *
 * @ScriptName MR China Customer Controller
 * @ScriptId customscript_iv_china_customer_ctrl_mr
 * @DeploymentId customdeploy_iv_china_customer_ctrl_mr
 * @Schedule every 15 minutes
 * @Description To control the workflow of china customer
 */
define(['./Services/ChinaWorkflowServices'], (ChinaWorkflowServices) => {
    const chinaWorkflowServices = new ChinaWorkflowServices()

    const getInputData = (context) => {
        try {
            log.audit('getInputData', context)
            return chinaWorkflowServices.findTemporaryCustomerList()
        } catch (e) {
            log.error('getInputData', e.toJSON ? e : e.stack ? e.stack : e.toString())
        }
    }

    const map = (context) => {
        try {
            const { value } = context
            const customerInfo = JSON.parse(value)
            log.audit('map', JSON.stringify(customerInfo))

            const { CHINA_DB_WORKFLOW, SHOPIFY_WORKFLOW } = customerInfo

            if (CHINA_DB_WORKFLOW === '1' || CHINA_DB_WORKFLOW === '5') chinaWorkflowServices.createCustomerInDB(customerInfo)
            if (SHOPIFY_WORKFLOW === '1') chinaWorkflowServices.deleteShopifyCustomer(customerInfo)
            if ([CHINA_DB_WORKFLOW, SHOPIFY_WORKFLOW].every((status) => status === '3' || status === '4'))
                chinaWorkflowServices.deleteTemporaryCustomer(customerInfo)
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
