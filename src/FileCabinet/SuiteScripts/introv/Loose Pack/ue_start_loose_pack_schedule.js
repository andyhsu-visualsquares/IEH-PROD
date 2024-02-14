/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType UserEventScript
 * @author Andy Chan
 *
 * @scriptId customscript_iv_start_loose_pack_sche_ue
 * @deploymentId customdeploy_iv_start_loose_pack_sche_ue
 */
define(['N/task', 'N/log', 'N/search'],
       (task, log, search) => {

           const afterSubmit = context => {
               try {
                   log.debug('ue_start_loose_pack_schedule.js', 'afterSubmit start');
                   if (alreadyTriggered('customscript_iv_ss_loose_pack_adjst')) {
                       log.debug('The script is running', 'customscript_iv_ss_loose_pack_adjst already triggered');
                   } else {
                       const taskId = task.create({
                                                      taskType    : task.TaskType.SCHEDULED_SCRIPT,
                                                      scriptId    : 'customscript_iv_ss_loose_pack_adjst',
                                                      deploymentId: 'customdeploy_iv_ss_loose_pack_adjst',
                                                  })
                                          .submit();
                       log.debug('started task id: ', 'task id: ' + taskId)
                   }
                   log.debug('ue_start_loose_pack_schedule.js', 'afterSubmit end')
               } catch (e) {
                   log.error('afterSubmit', e.toJSON ? e : (
                       e.stack ? e.stack : e.toString()
                   ));
               }
           };

           const alreadyTriggered = (scriptId) => {
               const scheduledscriptinstanceSearchColScriptId = search.createColumn({name: 'scriptid', join: 'script'});
               const scheduledscriptinstanceSearchColStatus = search.createColumn({name: 'status'});
               const scheduledscriptinstanceSearch = search.create({
                                                                       type   : 'scheduledscriptinstance',
                                                                       filters: [
                                                                           ['status', 'anyof', 'PROCESSING', 'PENDING'],
                                                                           'AND',
                                                                           ['script.scriptid', 'is', scriptId],
                                                                       ],
                                                                       columns: [
                                                                           scheduledscriptinstanceSearchColScriptId,
                                                                           scheduledscriptinstanceSearchColStatus,
                                                                       ],
                                                                   });

               const scheduledscriptinstanceSearchPagedData = scheduledscriptinstanceSearch.runPaged({pageSize: 1000});

               return scheduledscriptinstanceSearchPagedData.pageRanges.length > 0
           }

           return {
               afterSubmit,
           };
       },
);