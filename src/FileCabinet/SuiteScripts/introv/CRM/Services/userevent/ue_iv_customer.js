/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 *
 * Name : UE Customer
 * Script : customscript_iv_customer_ue
 * Deploy : customdeploy_iv_customer_ue
 *
 * Function List
 * 1. Add button for "Refresh Tier" & "Cancel MemberShip"
 * 2. Duplication Check on Customer while save reject deplicate Phone / email
 **/
define(['N/record', 'N/https', 'N/url', 'N/runtime', 'N/error', 'N/search', '../../DAO/CustomerDAO'], function (
    record,
    https,
    url,
    runtime,
    error,
    search,
    CustomerDAO
) {
    function beforeLoad(context) {
        try {
            var form = context.form
            const currRec = context.newRecord

            //STARTOF 1. Add button for "Refresh Tier" & "Cancel MemberShip"
            if (
                context.type === context.UserEventType.VIEW &&
                runtime.executionContext === runtime.ContextType.USER_INTERFACE
            ) {
                // form.addButton({
                //     id: 'custpage_iv_entity_refresh',
                //     label: 'Refresh Tier',
                //     functionName: 'refreshTier',
                // })

                if (!!currRec.getValue('custentity_iv_cancel_reason')) {
                    form.addButton({
                        id: 'custpage_iv_entity_cancel',
                        label: 'Cancel Membership',
                        functionName: 'cancelMember',
                    })
                }

                form.clientScriptModulePath = '../client/cs_iv_customer.js'
            }
            //ENDOF 1. Add button for "Refresh Tier" & "Cancel MemberShip"
        } catch (e) {
            log.error('UE SO Error:', JSON.stringify(e.message))
        }
    }

    function beforeSubmit(context) {
        const currRec = context.newRecord
        const oldRec = context.oldRecord
        if (
            context.type != context.UserEventType.DELETE &&
            runtime.executionContext != runtime.ContextType.USER_INTERFACE
        ) {
            // STRATOF 2. Duplication Check on Customer while save reject deplicate Phone / email
            var recPhone = currRec.getValue('phone')
            var recEmail = currRec.getValue('email')
            var isDuplicatValid = new CustomerDAO().duplicatCheck(recPhone, recEmail, currRec.id)
            if (!isDuplicatValid) {
                throw error.create({
                    message: 'This Customer had duplicate Phone or Email',
                    name: 'Phone Or Email has been used',
                    notifyOff: true,
                })
            }
            // ENDOF 2. Duplication Check on Customer while save reject deplicate Phone / email
        }
        try {
            //
            if (!!oldRec) {
                var newTier = currRec.getValue('custentity_iv_cl_member_type')
                var oldTier = oldRec.getValue('custentity_iv_cl_member_type')
                if (!!newTier && newTier != oldTier) {
                    var newTierObj = search.lookupFields({
                        type: 'customrecord_iv_membership_tiers',
                        id: newTier,
                        columns: ['custrecord_iv_sequence'],
                    })

                    // defualt Tier Upgrade true, only fail if old tier is lower.
                    var isTierUpgrade = true
                    if (!!oldTier) {
                        var oldTierObj = search.lookupFields({
                            type: 'customrecord_iv_membership_tiers',
                            id: oldTier,
                            columns: ['custrecord_iv_sequence'],
                        })

                        if (Number(newTierObj.custrecord_iv_sequence) < Number(oldTierObj.custrecord_iv_sequence)) {
                            isTierUpgrade = false
                        }
                    }

                    if (isTierUpgrade) {
                        // TODO cseg1 3 : Retails : Online
                        // const currChannel = currRec.getValue("cseg1");
                        const currChannel = 3
                        // TODO cseg1 209 : Corporate - IDL
                        // const currLocation = ;
                        const currLocation = 209
                        var response = https.post({
                            url: url.resolveScript({
                                scriptId: 'customscript_iv_upgrade_reward_sl',
                                deploymentId: 'customdeploy_iv_upgrade_reward_sl',
                                returnExternalUrl: true,
                            }),
                            body: JSON.stringify({
                                recCustomer: currRec.id,
                                recSubsi: currRec.getValue('subsidiary'),
                                recChannel: currChannel,
                                recLocation: currLocation,
                                recTier: newTier,
                            }),
                            headers: { name: 'Accept-Language', value: 'en-us' },
                        })
                        log.debug('se see', JSON.stringify(response.body))
                    }
                    log.debug('isTierUpgrade : ' + isTierUpgrade, {
                        newTierObj: newTierObj,
                        oldTierObj: oldTierObj,
                    })
                }
            }
        } catch (e) {
            log.error('UE SO Error:', JSON.stringify(e.message))
        }
    }

    function afterSubmit(context) {}

    /**
     *
     * @param {*} recPhone
     * @param {*} recEmail
     * @param {*} recId
     * @returns isDuplicated
     */
    function _duplicatCheck(recPhone, recEmail, recId) {
        var recPhone = currRec.getValue('phone')
        var recEmail = currRec.getValue('email')
        var recId = currRec.id
        var isDuplicatValid = true
        var validFilter = [['isinactive', 'is', 'F']]
        var tempFilter = []
        if (!!recPhone) {
            tempFilter.push(['phone', 'haskeywords', recPhone])
        }
        if (!!recEmail) {
            if (tempFilter.length > 0) tempFilter.push('OR')
            tempFilter.push(['email', 'is', recEmail])
        }
        if (!!recPhone || !!recEmail) {
            validFilter.push('AND')
            validFilter.push(tempFilter)
        }
        if (!!recId) {
            validFilter.push('AND')
            validFilter.push(['internalid', 'noneof', recId])
        }
        var customerSearchObj = search.create({
            type: 'customer',
            filters: validFilter,
            columns: [search.createColumn({ name: 'internalid', sort: search.Sort.ASC })],
        })
        var searchResultCount = customerSearchObj.runPaged().count
        // log.debug("customerSearchObj result count",searchResultCount);
        if (searchResultCount > 0 && (!!recPhone || !!recEmail)) {
            isDuplicatValid = false
        }
        return isDuplicatValid
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    }
})
