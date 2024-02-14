/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * 
 * Name : SL Downgrade Tier
 * script : customscript_iv_downgrade_tier_sl
 * deploy : customdeploy_iv_downgrade_tier_sl
**/
define(['N/config', 'N/error', 'N/format', 'N/log', 'N/record', 'N/search', '../../DAO/EarnedRewardsDAO', '../../DAO/RewardSchemeDAO', '../../../lib/Time/moment', '../../../lib/Time/moment-timezone'], function(config, error, format, log, record, search, EarnedRewardsDAO, RewardSchemeDAO, moment, momentTZ) {

    var dateFormat;
    function onRequest(context) {
        let rtn = {
            isSuccess: false,
            msg: "raw",
            id: 0,
            type: ""
        };
        try{
            var params, isMapReduce, newRecId;
            if(!!context.request.body){
                params = JSON.parse(context.request.body);
                isMapReduce = params.isMapReduce;
                newRecId = params.newRecId;
                log.debug("params", JSON.stringify(params));
            }
            else{
                throw error.create({
                    message: "Invalid Param",
                    name: "Inavlid Param",
                    notifyOff: true
                })
            }

            // both Upgrade or Downgrade will need to check inside the this period
            const userPreferences = config.load({ type: config.Type.USER_PREFERENCES, isDynamic: true })
            var dateFormat = userPreferences.getValue({ fieldId: 'DATEFORMAT' })
            
            const customerId = newRecId;
            var customerObj = search.lookupFields({
                type: "customer",
                id: customerId,
                columns: ["custentity_iv_cl_effective_date", "custentity_iv_cl_effective_to", "custentity_iv_cl_member_type","custentity_iv_cl_member_type.custrecord_iv_sequence", "custentity_iv_decrypted_id"]
            })
            log.debug("customerObj",JSON.stringify(customerObj));
            var customerCurrentTier ="";
            if(customerObj.custentity_iv_cl_member_type)if(customerObj.custentity_iv_cl_member_type[0])customerCurrentTier = customerObj.custentity_iv_cl_member_type[0].value;
            // var customerStartDate = new Date();
            // if(!!customerObj.custentity_iv_cl_effective_date)customerStartDate = customerObj.custentity_iv_cl_effective_date;
            // customerStartDate = moment(format.parse({
            //     value: customerStartDate,
            //     type: format.Type.DATE,
            //     timezone: format.Timezone.ASIA_HONG_KONG,
            // }))
            var customerEndDate = customerObj.custentity_iv_cl_effective_to;
            var customerSeq = customerObj["custentity_iv_cl_member_type.custrecord_iv_sequence"]?Number(customerObj["custentity_iv_cl_member_type.custrecord_iv_sequence"]):0;
            
            const customerRegTransId = customerObj.custentity_iv_decrypted_id;
            var AMOUNT_LIST = _getCustomerTotalInvoice(customerId, customerRegTransId);
            var customerTotalInvoiceTier = _getTierByAmt(customerId,AMOUNT_LIST)
            if(customerTotalInvoiceTier.stauts == "ok"){
                const NEW_CUSTOMER_TIER = customerTotalInvoiceTier.internalId;
                const NEW_CUSTOMER_TIER_LV = customerTotalInvoiceTier.sequence;
                log.debug("customerCurrentTier == NEW_CUSTOMER_TIER", customerCurrentTier +"=="+NEW_CUSTOMER_TIER+"+"+(customerCurrentTier == NEW_CUSTOMER_TIER));
                log.debug("NEW_CUSTOMER_TIER_LV>customerSeq",NEW_CUSTOMER_TIER_LV +">"+customerSeq+"+"+ (NEW_CUSTOMER_TIER_LV>customerSeq));
                // TODO config 1 upgrade, 2 downgrade, 3 unchange
                const NEW_CUSTOMER_TIER_CHANGE = ((customerCurrentTier == NEW_CUSTOMER_TIER)?3:(NEW_CUSTOMER_TIER_LV>customerSeq?1:2))

                // Not downgrade if it is permanant tier.
                var parsedCustomerEndDate;
                if(!!customerEndDate){
                    // MOMENT USE: to parse the record date back to server time zone GMT-7 for using .isAfter()
                    parsedCustomerEndDate = moment(format.parse({
                        value: customerEndDate,
                        type: format.Type.DATE,
                        // timezone: format.Timezone.ASIA_HONG_KONG,
                    })).subtract(new Date().getTimezoneOffset() + 8*60,'minute')
                    var currentMoment = moment()
                    // log.debug("Dtae Issue : ", {
                    //     ["customerEndDate_is_"+typeof(customerEndDate)] : customerEndDate,
                    //     ["parsedCustomerEndDate_is_"+typeof(parsedCustomerEndDate)] : parsedCustomerEndDate,
                    //     ["newDate()_is_"+typeof(new Date())] : new Date(),
                    //     ["currentMoment_is_"+typeof(currentMoment)] : currentMoment,
                    // });
                }
                if(!customerEndDate && NEW_CUSTOMER_TIER_CHANGE == 2){
                    log.debug("Is permanent!");
                }
                else if(!!customerEndDate && NEW_CUSTOMER_TIER_CHANGE == 2 && parsedCustomerEndDate.isAfter(currentMoment)){
                    log.debug("Is Not Over Membership time!");
                }
                else{
                    // No Edititng Customer if "no changed".
                    if(NEW_CUSTOMER_TIER_CHANGE != 3){
                        var submitFieldCustomerObj = {
                            "custentity_iv_cl_member_card" : customerTotalInvoiceTier.imageId,
                            "custentity_iv_cl_member_type" : NEW_CUSTOMER_TIER
                        };
                        var newEffeciveFrom = moment().toDate();
                        submitFieldCustomerObj["custentity_iv_cl_effective_date"] = newEffeciveFrom;
                        if(!customerTotalInvoiceTier.isPermanent){
                            submitFieldCustomerObj["custentity_iv_cl_effective_to"] = moment(newEffeciveFrom).add(customerTotalInvoiceTier.periodLong,"M").endOf("Y").set('hour', 0).toDate()
                        }
                        else{
                            submitFieldCustomerObj["custentity_iv_cl_effective_to"] = "";
                        }
                        log.debug("submitFieldCustomerObj for Customer:"+customerId,JSON.stringify(submitFieldCustomerObj));
                        record.submitFields({
                            type: "customer",
                            id: customerId,
                            values: submitFieldCustomerObj
                        })
                    }
                    // No Tier History if the tier not change except on MR downgrade. isMapReduce can be any true value.
                    if(!(NEW_CUSTOMER_TIER_CHANGE == 3 && !isMapReduce)){
                        var tierHistory = record.create({type: "customrecord_iv_tier_history",isDynamic: true});
                        tierHistory.setValue("custrecord_iv_history_tier", NEW_CUSTOMER_TIER);
                        if(NEW_CUSTOMER_TIER_CHANGE != 3){
                            log.debug("HKDate", momentTZ().tz('Asiz/Hong_Kong'));
                            tierHistory.setValue("custrecord_iv_th_effective_from", moment().add(new Date().getTimezoneOffset() + 8*60,'minute').toDate());
                            if(!!submitFieldCustomerObj["custentity_iv_cl_effective_to"])
                                tierHistory.setValue("custrecord_iv_th_effective_to", submitFieldCustomerObj["custentity_iv_cl_effective_to"]);
                        }
                        tierHistory.setValue("custrecord_iv_upgrade_downgrade", NEW_CUSTOMER_TIER_CHANGE);
                        tierHistory.setValue("custrecord_iv_th_customer", customerId);
                        tierHistory.setValue("custrecord_iv_th_permanent", customerTotalInvoiceTier.isPermanent);
                        tierHistory.save();
                    }
                }
            }
            log.debug("customerTotalInvoiceTier", JSON.stringify(customerTotalInvoiceTier));
            rtn.msg = JSON.stringify(customerTotalInvoiceTier);


            // check customer current Period is permenant
            // check still have enough point
            // check which is down level + is level exist that time

            rtn.isSuccess = true;
            context.response.write(JSON.stringify(rtn));
        }
        catch(e){
            // log.error("SL debug error",e.toString());
            // context.response.write(e.message);
            log.error("SL Failed",JSON.stringify(e.message + e.stack));
            rtn.isSuccess = false;
            rtn.msg = `SL Failed, ${JSON.stringify(e.message + e.stack)}`;
            context.response.write(JSON.stringify(rtn));
        }
    }

    function _getCustomerTotalInvoice(CUSTOMER_ID, CUSTOMER_TRANSREGID){
        var invocieAmtList = [];

        var transFilter = [
            ["mainline","is","T"], 
            "AND", 
            ["type","anyof","CustInvc"], 
            // "AND", 
            // ["trandate","within",PERIOD_FROM, PERIOD_TO], 
            "AND", 
            ["status","anyof","CustInvc:D","CustInvc:B","CustInvc:A"],
            // "AND", 
            // ["trandate","onorafter",periodEndDate],          
        ]
        // 20231123 John remove Guest customer w/ POS ID, since Customer will always backward if valid customer
        // if(!CUSTOMER_TRANSREGID){
            transFilter.push("AND", [["name","anyof",CUSTOMER_ID]])
            // return invocieAmtList;
        // }
        // else{
            // transFilter.push("AND", [["name","anyof",CUSTOMER_ID], "OR", [["name","anyof",51077], "AND", ["custbodypossalesid", "is", CUSTOMER_TRANSREGID]]])
        // }
        // var periodEndDate = PERIOD_TO.subtract(30,"M").format(dateFormat)
        var invoiceSearchObj = search.create({
            type: "invoice",
            filters: transFilter,
            columns:
            [
                "trandate",
                "amount",
            ]
        });
        var searchResultCount = invoiceSearchObj.runPaged().count;
        log.debug("invoiceSearchObj result count",searchResultCount);
        var now = 0;
        while(now < searchResultCount) {
            var invoiceSearchResult = invoiceSearchObj.run().getRange({start: now, end: now + 1000});
            invoiceSearchResult.forEach(function (row, index){
                invocieAmtList.push({
                    date: row.getValue("trandate"),
                    amt: row.getValue("amount"),
                })
            });
            now += 1000;
        }

        // var totalAmt = invoiceSearchObj.run().getRange({start: 0,end: 1})[0].getValue({name: "amount",summary: "SUM"});
        // totalAmt = totalAmt?Number(totalAmt):0;
        // log.debug("totalAmt : "+typeof(totalAmt), JSON.stringify(totalAmt));
        return invocieAmtList;
    }

    function _getMembershipTier(){
        var customrecord_iv_membership_tiersSearchObj = search.create({
            type: "customrecord_iv_membership_tiers",
            filters:
            [
                ["isinactive","is","F"]
            ],
            columns:
            [
                "internalid",
                search.createColumn({name: "custrecord_iv_sequence",sort: search.Sort.DESC}),
                "name",
                "custrecord_iv_compound_tier",
                // "custrecord_iv_total_unused_points",
                "custrecord_iv_cumulative_spending_period",
                "custrecord_iv_no_of_period",
                "custrecord_iv_spending_from",
                "custrecord_iv_spending_to",
                "custrecord_iv_permanent",
                "custrecord_iv_cumulative_spending_period",
                "custrecord_iv_member_card",
                "custrecord_iv_component_tiers",
                
            ]
        });
        var searchResultCount = customrecord_iv_membership_tiersSearchObj.runPaged().count;
        // log.debug("customrecord_iv_membership_tiersSearchObj result count",searchResultCount);
        var returnResult = {};
        var now = 0;
        while(now < searchResultCount) {
            var memberSearchResults = customrecord_iv_membership_tiersSearchObj.run().getRange({start: now, end: now + 1000});
            memberSearchResults.forEach(function (row, index){
                if(!returnResult["orderList"])returnResult["orderList"] = [];
                returnResult["orderList"].push(row.getValue("internalid"));
                returnResult[row.getValue("internalid")] = {
                    internalId: row.getValue("internalid"),
                    name: row.getValue("name"),
                    sequence: row.getValue("custrecord_iv_sequence"),
                    neededCumulate: Number(row.getValue("custrecord_iv_no_of_period")),
                    isCompoundTier: row.getValue("custrecord_iv_compound_tier"),
                    amtFrom: Number(row.getValue("custrecord_iv_spending_from")),
                    amtTo: Number(row.getValue("custrecord_iv_spending_to")),
                    isPermanent: row.getValue("custrecord_iv_permanent"),
                    periodLong: Number(row.getValue("custrecord_iv_cumulative_spending_period")),
                    imageId: row.getValue("custrecord_iv_member_card"),
                    component: row.getValue("custrecord_iv_component_tiers").indexOf(",")!=-1?row.getValue("custrecord_iv_component_tiers").split(","):row.getValue("custrecord_iv_component_tiers"),
                };
            })
            now += 1000;
        }
        return returnResult;
    }

    function _getTierByAmt(CUSTOMER_ID, AMOUNT_LIST){
        var rtn = {
            stauts: "raw",
            name: "",
            internalId: 0,
        }
        var TIER_LIST = _getMembershipTier()
        for (let indexT = 0; indexT < TIER_LIST.orderList.length; indexT++) {
        // for (const tierKey in TIER_LIST) {
            var tierKey = TIER_LIST.orderList[indexT];
            if (Object.hasOwnProperty.call(TIER_LIST, tierKey)) {
                const elementTier = TIER_LIST[tierKey];
                var foundCorrectTier = false;
                var isCumulateGold = false;
                var isCumulatePlat = false;
                
                var AMOUNT = 0;
                for(var i = 0 ; i< AMOUNT_LIST.length; i++){
                    var tierPeriodLength = elementTier.periodLong;
                    var tierStartDate = moment().subtract(Number(tierPeriodLength),"M");
                    // var invoiceDate = moment(format.parse({value: AMOUNT_LIST[i].date,type: format.Type.DATE,timezone: format.Timezone.ASIA_HONG_KONG,}));
                    var invoiceDate = moment(format.parse({
                        value: AMOUNT_LIST[i].date,
                        type: format.Type.DATE,
                        // timezone: format.Timezone.ASIA_HONG_KONG,
                    })).subtract(new Date().getTimezoneOffset() + 8*60,'minute')
                    if(tierStartDate.isBefore(invoiceDate)){
                        AMOUNT += Number(AMOUNT_LIST[i].amt);
                    }
                }
                log.debug("elementTier : "+tierKey, "AMOUNT : " +AMOUNT + " elementTier.amtFrom: " + elementTier.amtFrom + JSON.stringify(AMOUNT >= elementTier.amtFrom));

                if(elementTier.isCompoundTier){
                    var compoundPermanentTier, compoundNonPermanentTier;
                    for(let indexI = 0; indexI < elementTier.component.length; indexI++){
                        if(TIER_LIST[elementTier.component[indexI]].isPermanent){
                            compoundPermanentTier = elementTier.component[indexI];
                        }
                        else{
                            compoundNonPermanentTier = elementTier.component[indexI];
                        }
                    }
                    var isPermanent = false, isAmtEnough = false;
                    isPermanent = _checkPerviousStatus(elementTier.periodLong, TIER_LIST[compoundPermanentTier].amtFrom, AMOUNT_LIST, TIER_LIST[compoundPermanentTier].neededCumulate);
                    if(AMOUNT >= TIER_LIST[compoundNonPermanentTier].amtFrom){
                        isAmtEnough = true;
                    }
                    if(isPermanent && isAmtEnough){
                        foundCorrectTier = true;
                    }
                }
                else {// !elementTier.isCompoundTier
                    if(elementTier.isPermanent && (elementTier.neededCumulate > 1)){
                        var foundCorrectTier = _checkPerviousStatus(elementTier.periodLong, elementTier.amtFrom, AMOUNT_LIST, elementTier.neededCumulate);
                    }
                    else{// elementTier.neededCumulate == 1
                        if(AMOUNT >= elementTier.amtFrom){
                            foundCorrectTier = true;
                        }
                    }
                }
                if(foundCorrectTier){
                    rtn = {
                        stauts: "ok",
                        name: elementTier.name,
                        sequence: Number(elementTier.sequence),
                        internalId: elementTier.internalId,
                        isPermanent: elementTier.isPermanent,
                        periodLong: Number(elementTier.periodLong),
                        imageId: elementTier.imageId,
                    }
                    break;
                }
                rtn = {
                    stauts: "fail",
                    name: "",
                    internalId: -1,
                    error: "No valid thing."
                }
            }
        }
        return rtn
    }


    function _checkPerviousStatus(periodLength, AMOUNT, AMOUNT_LIST, contieuePeriodLength){
        log.debug("periodLength", JSON.stringify({
            periodLength : periodLength,
            AMOUNT  :AMOUNT,
            AMOUNT_LIST : AMOUNT_LIST
        }));
        var validPeriodList = [];

        const today = moment().utc().add(8*60,"minute").startOf('day')
        for(var i = 0 ; i< AMOUNT_LIST.length; i++){

            // MOMENT USE: to parse the record date back to server time zone GMT-7 for using .isAfter()
            const targetday = moment(format.parse({
                value: AMOUNT_LIST[i].date,
                type: format.Type.DATE,
                timezone: format.Timezone.ASIA_HONG_KONG,
            })).utc().add(8*60,"minute").startOf('day');


            var obj = {};
            for(let indexCL = 0; indexCL< contieuePeriodLength; indexCL++){
                var startMoment=moment(today).add(Number(periodLength)*(-indexCL),"M").subtract(Number(periodLength),"M").add("1","d").startOf('day');
                var endMoment=moment(today).add(Number(periodLength)*(-indexCL),"M").endOf('day');
                var is_over = targetday.isBetween(startMoment, endMoment, undefined,'[]');
                var is_amt_over = Number(AMOUNT_LIST[i].amt) >= AMOUNT;
                if(is_over && is_amt_over && validPeriodList.indexOf(indexCL)==-1)validPeriodList.push(indexCL);
                obj[indexCL] = {
                    is_amt_over: is_amt_over,
                    is_amt_overText: Number(AMOUNT_LIST[i].amt) + " >= " + AMOUNT,
                    validPeriodList: validPeriodList,
                    today:today,
                    targetday:targetday,
                    is_over:is_over,
                    start:startMoment,
                    end:endMoment
                }
            }
            log.debug("obj",JSON.stringify(obj));
        }
        log.debug("validPeriodList",JSON.stringify(validPeriodList));
        return validPeriodList.length >= contieuePeriodLength;
    }
    
    return {
        onRequest: onRequest
    }
});