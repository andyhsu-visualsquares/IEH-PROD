
/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 Script Name: MR Mass Redeem Code on IF Handling
 Script ID: customscript_iv_mass_redeem_code_if_mr
 *Deployment ID: customdeploy_iv_mass_redeem_code_if_mr
 */
define(['N', '../../DAO/RedeemCodeMasterDAO'], function (N_1, RedeemCodeMasterDAO) {

    function getInputData() {
        var redeemItemQtyObj = JSON.parse(N_1.runtime.getCurrentScript().getParameter({
            name: 'custscript_iv_redeem_code_master_obj',
        }));
        var soID = JSON.parse(N_1.runtime.getCurrentScript().getParameter({
            name: 'custscript_iv_script_param_so_id',
        }));
        log.debug("redeemItemQtyObj", redeemItemQtyObj)

        for (let itemID in redeemItemQtyObj) {
            let redeemCodeMasterListPagedData = N_1.search.create({
                type: "customrecordrcmaster",
                filters:
                    [
                        ["custrecordrcmastervoucheritem", "anyof", itemID],
                        "AND",
                        ["custrecordrcmasterused", "is", "F"],
                        "AND",
                        ["custrecordrcmastersentorsold", "is", "F"],
                        "AND",
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecordredeemcodenoteffective", "is", "F"],
                        "AND",
                        ["custrecordrcmastereffectivedate", "after", "today"]
                    ],
                columns:
                    [
                        'internalid',
                        'name',
                        'custrecordrcmasterredeemprod',
                        'custrecordrcmastervoucheritem',
                        'custrecordrcmastersentorsold'
                    ]
            }).runPaged({ pageSize: 1000 })
            let redeemCodeMasterList = []
            for (let i = 0; i < redeemCodeMasterListPagedData.pageRanges.length; i++) {
                let redeemCodeMasterListSearchPage = redeemCodeMasterListPagedData.fetch({ index: i })
                redeemCodeMasterListSearchPage.data.forEach((result) => {
                    redeemCodeMasterList.push(result)
                })
            }
            redeemItemQtyObj[itemID].codeMaster = redeemCodeMasterList

            if (redeemItemQtyObj.hasOwnProperty(itemID)) {
                const redeemCodeMasterDAO = new RedeemCodeMasterDAO()
                const bodyFieldsToBeUpdated = [
                    {
                        field: 'custrecordrcmastersentorsold',
                        value: true,
                        valueType: 'value',
                    },
                    {
                        field: 'custrecordrcmastersalestransaction',
                        value: `${soID}`,
                        valueType: 'value',
                    },
                ]
                // for (const itemID in redeemCodeMasterObj) {
                let redeemCodeMapProccessorArr = []
                for (let i = 0; i < redeemItemQtyObj[itemID].qty; i++) {
                    let targetMappingContent = {
                        codeID: redeemItemQtyObj[itemID].codeMaster[i].id,
                        fieldValues: bodyFieldsToBeUpdated
                    }
                    redeemCodeMapProccessorArr.push(targetMappingContent)
                    // redeemCodeMasterDAO.update(redeemItemQtyObj[itemID].codeMaster[i].id, bodyFieldsToBeUpdated)
                }

                return redeemCodeMapProccessorArr
                // }
            }

        }


    }

    function map(context) {
        let targetContext = JSON.parse(context.value)
        const redeemCodeMasterDAO = new RedeemCodeMasterDAO()
        log.debug("Mark Redeem SOID on Redeem Code Master", targetContext.codeID)

        redeemCodeMasterDAO.update(targetContext.codeID, targetContext.fieldValues)
        // log.debug('usage on MAP', N_1.runtime.getCurrentScript().getRemainingUsage())

    }

    function reduce(context) {

    }

    function summarize(summary) {
        log.debug("Summary State On Mass Redeem Code Fulfillment on MR")

        var soID = JSON.parse(N_1.runtime.getCurrentScript().getParameter({
            name: 'custscript_iv_script_param_so_id',
        }));
        log.debug("soID", soID)
        let ifID = N_1.search.create({
            type: "itemfulfillment",
            filter: [
                ['createdfrom', 'anyof', soID]
            ],
            columns: [
                'internalid',
                N_1.search.createColumn({
                    name: "datecreated",
                    sort: N_1.search.Sort.DESC
                })
            ]
        }).run().getRange({ start: 0, end: 999 })[0].getValue("internalid")
        var scriptTask = N_1.task.create({
            taskType: N_1.task.TaskType.SCHEDULED_SCRIPT,
            scriptId: 'customscript_schedule_if_redeem',
            deploymentId: 'customdeploy_schedule_if_redeem'
        });

        scriptTask.params = {
            'custscript_ifid': ifID
        };
        var scriptTaskId = scriptTask.submit();
        log.debug(`FINISH MASS UPDATING REDEEM CODE MASTER`, `CAUSED BY ITEM FULFILLMENT(IF Internal id: ${ifID})`)
        log.debug(`Handover to schedule_if_redeem`)
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});
