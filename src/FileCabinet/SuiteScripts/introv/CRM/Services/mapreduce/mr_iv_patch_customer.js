/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 *
 * Name : MR Patch Customer
 * Script : _iv_patch_entity_mr
 */
define(['N/search', 'N/error', 'N/file', 'N/log', 'N/record', 'N/runtime'], function(search, error, file, log, record, runtime) {

    function getInputData() {
        return file.load({
            id: 2052017
        })
    }

    function map(context) {
        try{
            // log.debug("Check"+typeof(context.value), "context.value:"+JSON.stringify(context.value));
            // const parsedData = JSON.parse(context.value);
            const parsedListData = context.value.split(",");
            const customerPOSID = parsedListData[3];
            var customerSearchObj = search.create({
                type: "customer",
                filters:
                [
                    ["isinactive","is","F"], 
                    "AND", 
                    ["phone","is",customerPOSID],
                ],
                columns:
                [
                    "internalid",
                    search.createColumn({name: "datecreated", sort: search.Sort.DESC}),                   
                ]
            });
            var searchResultCount = customerSearchObj.runPaged().count;
            // log.audit("customerSearchObj result count",searchResultCount);
            if(searchResultCount > 0){
                for(var i=0;i<Math.ceil(searchResultCount/1000);i++){
                    var results = customerSearchObj.run().getRange({start: 1000*i, end: 1000*(i+1)});
                    for(var j=0;j<results.length;j++){
                        if(j>0){
                            var newID = record.submitFields({
                                type: "customer",
                                id: results[j].getValue("internalid"),
                                values: {
                                    "isinactive": true,
                                    "custentity_approve":false,
                                }
                            })
                            log.audit(typeof(j) + " IS J : " + j,newID);
                            context.write("REMOVE_ID", newID);
                        }
                    }
                }
            }
        }
        catch(e){
            log.error("MR avr Map error.", e.name + " : "+ e.message + " : " + e.stack);
            context.write("Error", e.name + " : "+ e.message + " : " + e.stack);
        }
    }

    function reduce(context) {
    }

    function summarize(summary) {
        
        log.audit("Summarize context", JSON.stringify(summary));
        var returnText = "";
        summary.output.iterator().each(function(key, value) {
            if(key == 'REMOVE_ID'){
                if(returnText!="")returnText+=",";
                returnText+=value;
            }
            if(key == 'Error'){
                log.error("MR avr Map error."+key,value);
            }
            return true;
        });
        if(returnText!=""){
            var fileObj = file.create({
                name: "patch_customer_result"+new Date().getTime()+".csv",
                fileType: file.Type.CSV,
                contents: returnText,
                description: "string",
                folder: 2121278,
                encoding: file.Encoding.UTF8,
            })
            var fileId = fileObj.save();
            log.audit("returnText"+returnText.length,fileId);
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        // reduce: reduce,
        summarize: summarize
    }
});
