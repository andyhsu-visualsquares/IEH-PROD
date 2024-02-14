/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/search', 'N/record'], (
    search,
    record,
) => {
    class ScriptDeploymentDAO {
        constructor() { }

        findBusyScriptDeploymentStatus(scriptId) {
            let status = "idle"
            var ssiSearchObj = search.create({
                type: search.Type.SCHEDULED_SCRIPT_INSTANCE,
                filters: [
                    ["status", "anyof", "PENDING", "PROCESSING"],
                    "AND",
                    ["script.scriptid", "is", scriptId],
                ],
            });
            let searchCount = ssiSearchObj.runPaged().count
            // let myInterval =  setInterval(function () {
            //     var ssiSearchObj = search.create({
            //       type: search.Type.SCHEDULED_SCRIPT_INSTANCE,
            //       filters: [
            //         ["status", "anyof", "PENDING", "PROCESSING"],
            //         "AND",
            //         ["script.scriptid", "is", "customscript_iv_mr_inform3pl"],
            //       ],
            //     });
            //     console.log( "ssiSearchObj.runPaged().count", ssiSearchObj.runPaged().count );
            //     if (ssiSearchObj.runPaged().count == 0) {
            //       clearInterval(myInterval);
            //       status = "idle"
            //       window.onbeforeunload = null;
            //       window.location.replace(
            //         "https://5245249-sb1.app.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=578&searchtype=Custom&searchid=191&Custom_CREATEDrange=TODAY&Custom_CREATEDfrom=23-Dec-2022&Custom_CREATEDfromrel_formattedValue=&Custom_CREATEDfromrel=&Custom_CREATEDfromreltype=DAGO&Custom_CREATEDto=23-Dec-2022&Custom_CREATEDtorel_formattedValue=&Custom_CREATEDtorel=&Custom_CREATEDtoreltype=DAGO&CUSTRECORD_IV_3PL_STATUS=%40ALL%40&style=NORMAL&Custom_CREATEDmodi=WITHIN&Custom_CREATED=TODAY&report=&grid=&dle=&sortcol=Custom_CREATED_raw&sortdir=DESC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=EqJza80IbKtr0JHUxaC1_7yTlUom1WRLkyL7knW7ZiM6ozb0bVCO3H7Ser0VoLC8ATE-gYjZlGf1hKyfZzaUMpgIeO-ygNunvqWA26MLm26RRegMwDV7ZNVGDxb8CnOWbbni7S2j3-oDOvDtxMYFo33kiXvc4TVf7BZWNMxDSpc%3D&twbx=F&showall=F&quicksort=Custom_CREATED_raw%20DESC");
            //     } else status = "busy"
            //   }, 1000);
            return searchCount;
        }
        getAll() { }
    }

    return ScriptDeploymentDAO
})
