/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 * Script NAme: SL Trigger Bulk Customer Loading SS
 * Script ID: customscript_iv_trigger_bulk_loading_sl
 * Deployment ID: customdeploy_iv_trigger_bulk_loading_sl
 */
define(["N"], function (N_1) {

    function onRequest(context) {
        const { request, response } = context
        const { nsFilters, cnFilters, savingTimeStamp, exportFromPageIndex, exportToPageIndex } = JSON.parse(request.body)
        // var scriptTask = N_1.task.create({
        //     //Trigger Export & Download By Bulk Loading by Calling SS
        //     taskType: N_1.task.TaskType.SCHEDULED_SCRIPT,
        //     scriptId: 'customscript_iv_mass_load_customer_data',
        //     deploymentId: 'customdeploy_iv_mass_load_customer_data',
        //     params: {
        //         'custscript_iv_search_filters': JSON.stringify({ nsFilters, cnFilters }),
        //         'custscript_iv_saving_time_stamp': savingTimeStamp
        //     }
        // });
        // var bulkExportScriptTaskID = scriptTask.submit();
        //For testing MR Script
        var scriptTask2 = N_1.task.create({
            //Trigger Export & Download By Bulk Loading by Calling SS
            taskType: N_1.task.TaskType.MAP_REDUCE,
            scriptId: 'customscript_iv_bulk_load_customer_data',
            deploymentId: 'customdeploy_iv_bulk_load_customer_data',
            params: {
                'custscript_iv_search_filters_mr': JSON.stringify({ nsFilters, cnFilters, exportFromPageIndex, exportToPageIndex }),
                'custscript_iv_saving_time_stamp_mr': savingTimeStamp
            }
        });
        var bulkExportScriptTaskID2 = scriptTask2.submit();
        log.debug("bulkExportScriptTaskID", bulkExportScriptTaskID2);
    }

    return {
        onRequest: onRequest
    }
});
