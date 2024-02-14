/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @preserved
 * 
 * Script Name : MR Script Schedule
 * Script Id : customscript_iv_script_schedule_mr
 * Deploy Id : customdeploy_iv_script_schedule_mr
**/
define(['N/log', 'N/record', 'N/runtime', 'N/search', 'N/task'], function(log, record, runtime, search, task) {

    function getInputData() {
        return {"Status" : "OK"}
    }

    function map(context) {}

    function reduce(context) {}

    function summarize(summary) {
        
        try{
            // var getScriptDeployment = search.create({
            //     type: record.Type.SCHEDULED_SCRIPT_INSTANCE,
            //     filters: [
            //     ["status", "anyof","PENDING","PROCESSING","RESTART","RETRY"], "AND",
            //     ["script.scriptid", "startswith", 'customscript_iv_john_debug_mr']],
            //     columns: ["script.internalid"]
            // }).runPaged().count;
            // // log.debug("getScriptDeployment",getScriptDeployment);
            // if(getScriptDeployment < 1){
            //     var schedule = task.create({taskType: task.TaskType.MAP_REDUCE});
            //     // log.debug("runtime.getCurrentUser().id",runtime.getCurrentUser().email);
            //     schedule.scriptId = 'customscript_iv_john_debug_mr';
            //     schedule.deploymentId = 'customdeploy_iv_john_debug_mr';
            //     // log.debug("schedule",JSON.stringify(schedule));
            //     var schedule_id = schedule.submit();
            // }
        }
        catch(e) {
            log.error("MR Script Schedule Error:",JSON.stringify(e.message));
            if(e.name != "MAP_REDUCE_ALREADY_RUNNING")
                throw e;
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        // reduce: reduce,
        summarize: summarize
    }
});
