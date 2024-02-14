/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Name : CS Customer
 * Script: customscript_iv_customer_cs
 * Deploy: customdeploy_iv_customer_cs
 * 
 * 2 Button action:"Refresh Tier", "Cancel Membership",
 * 1 Validation before save: "duplication check"
**/
define(['N/currentRecord', 'N/log', 'N/https', 'N/url', 'N/search', 'N/ui/dialog'], function (currentRecord, log, https, url, search, dialog) {

    function pageInit(context) {

    }

    function saveRecord(context) {
        var currRec = currentRecord.get();
        var recPhone = currRec.getValue("phone");
        var recEmail = currRec.getValue("email");
        var isDuplicatValid = _duplicatCheck(recPhone, recEmail, currRec.id);
        if (!isDuplicatValid) {
            dialog.create({
                buttons: [{ "label": "OK", value: 1 }],
                title: "The Phone or Email is duplicated",
                message: "The Phone or Email is duplicated"
            })
            return false;
            // throw error.create({
            //     message: "This Customer had duplicate Phone or Email",
            //     name: "Phone Or Email has been used",
            //     notifyOff: true
            // })
        }

        return true;
    }

    function refreshTier() {
        const rec = currentRecord.get();
        var customerId = rec.id
        // log.debug(context.key + "Map context typeof:"+typeof(context.value), JSON.stringify(context.value));

        var response = https.post({
            url: url.resolveScript({ scriptId: 'customscript_iv_downgrade_tier_sl', deploymentId: 'customdeploy_iv_downgrade_tier_sl', returnExternalUrl: true }),
            body: JSON.stringify({
                newRecId: customerId,
                isUpgrade: true,
                // newRecType : "salesorder",
                // newRecDate: trandate
            }),
            headers: { name: 'Accept-Language', value: 'en-us' }
        });
        log.debug("se see", JSON.stringify(response.body));


        console.log("response.body : " + response.body);
        location.reload();
    }

    function cancelMember() {
        const rec = currentRecord.get();
        var customerId = rec.id;
        var customerRejectReason = search.lookupFields({
            type: rec.type,
            id: rec.id,
            columns: ["custentity_iv_cancel_reason"]
        }).custentity_iv_cancel_reason
        if (!customerRejectReason) {
            dialog.alert({
                title: "Error",
                message: "Please input Cancellation Reason."
            })
        }
        else {
            var response = https.post({
                url: url.resolveScript({ scriptId: 'customscript_iv_cancel_membership_sl', deploymentId: 'customdeploy_iv_cancel_membership_sl', returnExternalUrl: true }),
                body: JSON.stringify({
                    newRecId: customerId,
                }),
                headers: { name: 'Accept-Language', value: 'en-us' }
            });
            var returnMsg = JSON.parse(response.body);
            log.debug("se see", JSON.stringify(response.body));
            console.log("response.body : " + response.body);
            dialog.create({
                buttons: [{ "label": "OK", value: 1 }],
                title: returnMsg.title ? returnMsg.title : "Empty Title",
                message: returnMsg.msg
            }).then(function (result) { location.reload() })
        }
    }


    /**
     * 
     * @param {*} recPhone 
     * @param {*} recEmail 
     * @param {*} recId 
     * @returns isDuplicated
     * 
     * For CS use , cs cannot use Config module
     */
    function _duplicatCheck(recPhone, recEmail, recId) {
        var isDuplicatValid = true;
        var validFilter = [["isinactive", "is", "F"]];
        var tempFilter = [];
        if (!!recPhone) {
            tempFilter.push(["phone", "haskeywords", recPhone]);
        }
        if (!!recEmail) {
            if (tempFilter.length > 0) tempFilter.push("OR");
            tempFilter.push(["email", "is", recEmail]);
        }
        if (!!recPhone || !!recEmail) {
            validFilter.push("AND");
            validFilter.push(tempFilter);
        }
        if (!!recId) {
            validFilter.push("AND");
            validFilter.push(["internalid", "noneof", recId]);
        }
        var customerSearchObj = search.create({
            type: "customer",
            filters: validFilter,
            columns:
                [
                    search.createColumn({ name: "internalid", sort: search.Sort.ASC })
                ]
        });
        var searchResultCount = customerSearchObj.runPaged().count;
        log.debug("customerSearchObj result count", searchResultCount);
        if (searchResultCount > 0 && (!!recPhone || !!recEmail)) {
            isDuplicatValid = false;
        }
        return isDuplicatValid;
    }



    return {
        pageInit: pageInit,
        refreshTier: refreshTier,
        cancelMember: cancelMember,
        saveRecord: saveRecord,
        // validateField: validateField,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});
