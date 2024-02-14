/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
**/
define(['N/error', 'N/record', 'N/search', '../../DAO/EarnedRewardsDAO', '../../DAO/RewardSchemeDAO', '../../../lib/Time/moment', 'N/url', 'N/log', 'N/https'], function (error, record, search, EarnedRewardsDAO, RewardSchemeDAO, moment, url, log, https) {

    function getInputData() {
        return search.create({
            type: "customer",
            filters:
                [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custentity_iv_cl_effective_to", "before", "today"],
                    "AND",
                    ["custentity_iv_cl_member_type", "noneof", "@NONE@"],
                    "AND",
                    ["isperson", "is", "T"],
                ],
            columns:
                [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC
                    }),
                    //    "altname",
                    "custentity_iv_cl_effective_to"
                ]
        })
        var resultList = [];
        var customerSearchObj = search.create({
            type: "customer",
            filters:
                [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custentity_iv_cl_effective_to", "before", "today"],
                    "AND",
                    ["custentity_iv_cl_member_type", "noneof", "@NONE@"],
                    "AND",
                    ["isperson", "is", "T"],
                ],
            columns:
                [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC
                    }),
                    "altname",
                    "custentity_iv_cl_effective_to"
                ]
        });
        var searchResultCount = customerSearchObj.runPaged().count;
        log.debug("customerSearchObj result count", searchResultCount);
        customerSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            resultList.push(result.id);
            return true;
        });
        return resultList
    }

    function map(context) {
        try {

            log.debug(context.key + "Map context typeof:" + typeof (context.value), JSON.stringify(context.value));
            const parseData = JSON.parse(context.value)
            log.debug('parseData', JSON.stringify(parseData))

            var response = https.post({
                url: url.resolveScript({ scriptId: 'customscript_iv_downgrade_tier_sl', deploymentId: 'customdeploy_iv_downgrade_tier_sl', returnExternalUrl: true }),
                body: JSON.stringify({
                    newRecId: parseData.id,
                    isDownGrade: true,
                }),
                headers: { name: 'Accept-Language', value: 'en-us' }
            });
            log.debug("se see", JSON.stringify(response.body));

        }
        catch (e) {
            e["internalId"] = context.key;
            context.write("error", e.toString())
        }
    }

    function reduce(context) {

    }

    function summarize(summary) {
        log.audit("Summarize context", JSON.stringify(summary));
        summary.output.iterator().each(function (key, value) {
            if (key == 'error') {
                log.error("MR avr Map error." + key, value);
            }
            return true;
        });
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});