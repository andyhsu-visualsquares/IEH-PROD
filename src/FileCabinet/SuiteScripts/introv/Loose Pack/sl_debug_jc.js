/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @author John Chan
 * 
 * Please ignore this File, no need to deploy.
**/
define([
    '../lib/lodash','N', 'N/file', 'N/format', "N/log", 
"N/search", 
"N/record", 'N/https', 'N/url', 'N/currency', 'N/email', 'N/workflow', 'N/runtime', 'N/ui/serverWidget', '../CRM/DAO/EarnedRewardsDAO', '../CRM/DAO/RewardSchemeDAO',
'../CRM/DAO/RedeemCodeMasterDAO', '../lib/Time/moment', 'N/config'], 
function(_, N_1, file, format, log, search, record, https, url, currency, email, workflow, runtime, serverWidget, EarnedRewardsDAO, RewardSchemeDAO, RedeemCodeMasterDAO, moment, config) {

    function onRequest(context) {
        var request = context.request;
        var response = context.response;
        try{

            var startTiem = new Date();

            // const customerId = 1535;
            // const customerId = 1013420;
            
            // const userPreferences = config.load({ type: config.Type.USER_PREFERENCES, isDynamic: true })

            // var dateFormat = userPreferences.getValue({ fieldId: 'DATEFORMAT' })

            // var customerObj = search.lookupFields({
            //     type: "customer",
            //     id: customerId,
            //     columns: ["custentity_iv_cl_effective_date", "custentity_iv_cl_effective_to", "custentity_iv_cl_member_type","custentity_iv_cl_member_type.custrecord_iv_sequence"]
            // })
            // var customerStartDate = new Date();
            // if(!!customerObj.custentity_iv_cl_effective_date)customerStartDate = customerObj.custentity_iv_cl_effective_date;
            // customerStartDate = moment(format.parse({
            //     value: customerStartDate,
            //     type: format.Type.DATE,
            //     timezone: format.Timezone.ASIA_HONG_KONG,
            // }))

            // var customerEndDate = customerObj.custentity_iv_cl_effective_to;
            // if(!customerObj.custentity_iv_cl_effective_to){
            //     customerEndDate = customerStartDate.add(12,"M").format(dateFormat)
            // }

            // customerEndDate = moment(format.parse({
            //     value: customerEndDate,
            //     type: format.Type.DATE,
            //     timezone: format.Timezone.ASIA_HONG_KONG,
            // }))

            // var AMOUNT_LIST = _getCustomerTotalInvoice(customerId);
            // // var AMOUNT = _getCustomerTotalInvoice(CUSTOMER_ID,PERIOD_FROM, PERIOD_TO);
            // var customerTotalInvoiceTier = _getTierByAmt(customerId,AMOUNT_LIST)
            // // var periodLength = 6;
            // // var a = moment(new Date());
            // // var b = moment(a).subtract(Number(periodLength),"M").add(1,'d');
            // // log.debug("a",a)
            // // log.debug("b",b)
            // context.response.write(JSON.stringify(customerTotalInvoiceTier));
            // var newRecord = record.load({
            //     type: "salesorder",
            //     id: 4704061,
            //     isDynamic: true,
            // })
            // for (var i = 0; i < newRecord.getLineCount({ sublistId: 'item' }); i++) {
            //     //20231116 Chris: + Redeem Code Master Logic For Changed Email QR Attachment Logic
            //     newRecord.selectLine({ sublistId: 'item', line: i })
            //     const lineItemId = newRecord.getCurrentSublistValue({
            //         sublistId: 'item',
            //         fieldId: 'item',
            //     })
            //     const lineQty = newRecord.getCurrentSublistValue({
            //         sublistId: 'item',
            //         fieldId: 'quantity',
            //     })
                
            //     log.debug("lineItemId", lineItemId)
                // var redeemCodeMasterList = search.create({
                //     type: "customrecordrcmaster",
                //     filters:
                //         [
                //             ["custrecordrcmastervoucheritem", "anyof", 12568],
                //             "AND",
                //             ["custrecordrcmasterused", "is", "F"],
                //             "AND",
                //             ["custrecordrcmastersentorsold", "is", "F"],
                //             "AND",
                //             ["isinactive", "is", "F"],
                //             "AND",
                //             ["custrecordredeemcodenoteffective", "is", "F"]
                //         ],
                //     columns:
                //         [
                //             'internalid',
                //             'name',
                //             'custrecordrcmasterredeemprod',
                //             'custrecordrcmastervoucheritem',
                //             'custrecordrcmastersentorsold'
                //         ]
                // }).run().getRange({ start: 0, end: 1000 })
                // if (redeemCodeMasterList.length > 0) {
                //     var bodyFieldsToBeUpdated = [
                //         {
                //             field: 'custrecordrcmastersentorsold',
                //             value: true,
                //             valueType: 'value',
                //         },
                //         // {
                //         //     field: 'custrecordrcmastersalestransaction',
                //         //     value: newRecord.id,
                //         //     valueType: 'value',
                //         // },
                //     ]
                //     log.debug("redeemCodeMasterList[0].id", redeemCodeMasterList[0].id)
                //     log.debug("bodyFieldsToBeUpdated", bodyFieldsToBeUpdated)
                //     // for (let code = 0; code < lineQty; code++) {
                //         log.debug("",redeemCodeMasterList[0].id + bodyFieldsToBeUpdated);
                //     // }
                // }

            // }
            const redeemCodeMasterList = new RedeemCodeMasterDAO().findByInternalId([14788])
            log.debug('redeemItemList', JSON.stringify(redeemCodeMasterList))
            const redeemCodeListByProduct = _.groupBy(redeemCodeMasterList, 'voucherItem')
            log.debug('redeemCodeListByProduct', JSON.stringify(_.keys(redeemCodeListByProduct)))

            context.response.write(JSON.stringify(redeemCodeListByProduct));
            // var testProvisionDate = new Date();
            // var seePoint = search.lookupFields({
            //     type: "customrecord_iv_membership_tiers",
            //     id: "5",
            //     columns: ["custrecord_iv_point_valid_period"]
            // })
            // context.response.write(JSON.stringify(seePoint));

            // var provisionMonth = Number(seePoint.custrecord_iv_point_valid_period)
            // testProvisionDate.setMonth(testProvisionDate.getMonth()+provisionMonth+1)
            // testProvisionDate.setDate(-1);
            
            // log.debug("test", JSON.stringify(testProvisionDate));
            // context.response.write(JSON.stringify(_getCustomerTotalInvoice(927428,"01/04/2023","31/03/2024")));
            // var resultTierPeriod = 12;

            // var effectiveDate = new Date();
            // var effectiveTo = new Date().setMonth(effectiveDate.getMonth()+resultTierPeriod+1)
            // // expiryProvisionDate.setDate(-1);
            // var effectiveToYear = new Date().setFullYear(effectiveDate.getFullYear()+1)
            // var testResult = _getTierByAmt(customerId, "01/04/2023","31/03/2024")
            // context.response.write(JSON.stringify(_getMembershipTier()));
            // context.response.write(JSON.stringify(testResult));
            // var customerRec = search.lookupFields({
            //     type: "customer",
            //     id: customerId,
            //     columns: ["custentity_iv_cl_member_type", "custentity_iv_cl_member_type.custrecord_iv_permanent"]
            // })
            // log.debug("customerRec", JSON.stringify(customerRec));
            
            // var isTierPermanent = customerRec["custentity_iv_cl_member_type.custrecord_iv_permanent"]
            // context.response.write(JSON.stringify(isTierPermanent));

            var endTiem = new Date();
            log.debug(" SL Map End : ",`Ramain Usage : ${N_1.runtime.getCurrentScript().getRemainingUsage()} <br/>StartTime: ${startTiem} <br/>EndTime: ${endTiem}`);
        }
        catch(e){
            log.error("SL debug error",e.toString());
            context.response.write(e.message);
        }
    }

            // const redemptionID = new EarnedRewardsDAO().createRewardRecord({
            //     REWARD_TYPE : 1,
            //     REWARD_SCHEME : 1,
            //     REWARD_CUSTOMER : 256594,
            //     REWARD_SUBSI : 3,
            //     REWARD_LOCATION : 408,
            //     REWARD_CHANNEL : 2,
            //     REWARD_SOURCESO : 8096,
            //     REWARD_EARNEDPOINT : 1,
            //     REWARD_ACQUIREDGIFT : [5792],
            //     REWARD_REDEEMPOINT : 1,
            //     REWARD_REDEEMITEM : [5792],
            //     REWARD_REDEEMRECORD : [1],
            //     REWARD_DATE_TIME : "2023/01/10 12:12:13",
            //     REWARD_PROVISION_DATE_TIME : "2023/01/10 12:12:13",
            //     REWARD_EXPIRY_DATE_TIME : "2023/01/10",
            //     REWARD_STATUS : 1,
            //     REWARD_IS_EXPIRED : true,
            //     REWARD_OMNI_EN_MSG : "haha",
            //     REWARD_OMNI_TC_MSG : "唔",
            //     REWARD_OMNI_SC_MSG : "波"
            // })
    function _getPendingProvision(MAX_PROCESS_LINE, context) {
        var salesorderSearchObj = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["cogs","is","F"], 
               "AND", 
               ["taxline","is","F"], 
               "AND", 
               ["mainline","is","F"], 
               "AND", 
               ["formulanumeric: {quantity}-{quantityshiprecv}","greaterthan","0"], 
               "AND", 
               ["custbody_iv_is_earn_reward","is","F"], 
               "AND", 
               ["datecreated","onorafter","01/08/2023 12:00 am"], 
               "AND", 
               ["customermain.custentity_iv_cl_member_type","noneof","@NONE@"]
            ],
            columns:
            [
                "ordertype",
                "item",
                "trandate",
                search.createColumn({name: "custentity_iv_cl_member_type",join: "customerMain"}),
                search.createColumn({name: "internalid",join: "customerMain"}),
                search.createColumn({name: "altname",join: "customerMain"}),
                "quantity",
                "quantityshiprecv",
                "tranid",
                "entity",
                "account",
                "memo",
                "amount"
            ]
        });
        var membershipList = [];
        var resultMap = {};
        var ProcessCount = 0;
        var searchResultCount = salesorderSearchObj.runPaged().count;
        for (var i = 0; i < Math.ceil(searchResultCount / 1000) && i * 1000 < MAX_PROCESS_LINE; i++) {
            var results = salesorderSearchObj.run().getRange({ start: 1000 * i, end: 1000 * (i + 1) });
            // var results = salesorderSearchObj.run().getRange({start: 0, end: MAX_PROCESS_LINE});
            // for(var j=0;j<results.length ;j++){
            for (var j = 0; j < results.length && i * 1000 + j < MAX_PROCESS_LINE; j++) {
                ProcessCount++;
                log.debug("Line "+j, JSON.stringify(results));
                var transId = results[j].getValue("internalid");
                var memberType = results[j].getValue({name: "custentity_iv_cl_member_type",join: "customerMain"});
                log.debug("memberType", JSON.stringify(memberType));
                    // new RewardSchemeDAO().getRewardSchemeFromMemberships({APPLICABLE_TIER: memberType,});
                if(membershipList.indexOf(memberType)==-1){
                    membershipList.push(memberType);
                }
            }
        }
        for(var k=0; k<membershipList.length; k++){
            context.response.write(JSON.stringify(new RewardSchemeDAO().getRewardSchemeFromMemberships({
                APPLICABLE_TIER: membershipList[k],
            })))
        }

        return membershipList;
    }

    function _getCustomerTotalInvoice(CUSTOMER_ID){
        // var periodEndDate = PERIOD_TO.subtract(30,"M").format(dateFormat)
        var invoiceSearchObj = search.create({
            type: "invoice",
            filters:
            [
                ["mainline","is","T"], 
                "AND", 
                ["type","anyof","CustInvc"], 
                "AND", 
                ["name","anyof",CUSTOMER_ID], 
                // "AND", 
                // ["trandate","within",PERIOD_FROM, PERIOD_TO], 
                "AND", 
                ["status","anyof","CustInvc:D","CustInvc:B","CustInvc:A"],
                // "AND", 
                // ["trandate","onorafter",periodEndDate],          
            ],
            columns:
            [
                "trandate",
                "amount",
            ]
        });
        var searchResultCount = invoiceSearchObj.runPaged().count;
        log.debug("invoiceSearchObj result count",searchResultCount);
        var invocieAmtList = [];
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
                "custrecord_iv_membership_valid_period",
                "custrecord_iv_member_card",
                "custrecord_iv_component_tiers",
                "custrecord_iv_cumulative_spending_period",                
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
                    periodLong: Number(row.getValue("custrecord_iv_membership_valid_period")),
                    imageId: row.getValue("custrecord_iv_member_card"),
                    component: row.getValue("custrecord_iv_component_tiers").indexOf(",")!=-1?row.getValue("custrecord_iv_component_tiers").split(","):row.getValue("custrecord_iv_component_tiers"),
                    expensePeriodLong: Number(row.getValue("custrecord_iv_cumulative_spending_period")),
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
                // internalId
                // name
                // sequence
                // neededCumulate
                // isCompoundTier
                // amtFrom
                // amtTo
                // isPermanent
                // periodLong
                // imageId
                // component
                var foundCorrectTier = false;
                var isCumulateGold = false;
                var isCumulatePlat = false;
                
                var AMOUNT = 0;
                for(var i = 0 ; i< AMOUNT_LIST.length; i++){
                    var tierPeriodLength = elementTier.expensePeriodLong;
                    var tierStartDate = moment(new Date()).subtract(Number(tierPeriodLength),"M");
                    var invoiceDate = moment(format.parse({value: AMOUNT_LIST[i].date,type: format.Type.DATE,timezone: format.Timezone.ASIA_HONG_KONG,}));
                    if(tierStartDate.isBefore(invoiceDate)){
                        AMOUNT += Number(AMOUNT_LIST[i].amt);
                    }
                }

                var getConsectiveAmt = _checkPerviousStatus(elementTier.expensePeriodLong, elementTier.amtFrom, AMOUNT_LIST);
                log.debug("getConsectiveAmt",JSON.stringify(getConsectiveAmt));

                log.debug("elementTier", "AMOUNT : " +AMOUNT + " elementTier.amtFrom: " + elementTier.amtFrom + JSON.stringify(AMOUNT >= elementTier.amtFrom));
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
                    var tierHistory = getConsectiveAmt;
                    if(!!tierHistory){
                        if(tierHistory.conYear >= TIER_LIST[compoundPermanentTier].neededCumulate || (AMOUNT >= TIER_LIST[compoundPermanentTier].amtFrom && tierHistory.conYear >= TIER_LIST[compoundPermanentTier].neededCumulate-1)){
                            isPermanent = true;
                        }
                    }
                    if(AMOUNT >= TIER_LIST[compoundNonPermanentTier].amtFrom){
                        isAmtEnough = true;
                    }
                    if(isPermanent && isAmtEnough){
                        foundCorrectTier = true;
                    }

                    // need the non permat part amt fulfilled && perm part reach its cumulate
                    // foundCorrectTier = true;
                }
                else {// !elementTier.isCompoundTier
                    if(elementTier.isPermanent && (elementTier.neededCumulate > 1)){
                        // perm part reach its cumulate
                        var conYearOnTier = 1, tierHistory = getConsectiveAmt;
                        if(!!tierHistory){
                            conYearOnTier = tierHistory.conYear;
                        }
                        if(conYearOnTier >= elementTier.neededCumulate || (AMOUNT >= elementTier.amtFrom && conYearOnTier >= elementTier.neededCumulate-1)){
                            foundCorrectTier = true;
                        }
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
    
    function _checkPerviousStatus(periodLength, AMOUNT, AMOUNT_LIST){
        var consectivePeriodObj = {};
        var maxPeriodLengthForAmt = 0;
        var todayDate = moment(new Date())
        var period1Date = moment(todayDate).subtract(Number(periodLength),"M").add(1,'d');
        const diffParam = todayDate.diff(period1Date, 'M', true);
        for(var i = 0 ; i< AMOUNT_LIST.length; i++){
            var invoiceDate = moment(format.parse({value: AMOUNT_LIST[i].date,type: format.Type.DATE,timezone: format.Timezone.ASIA_HONG_KONG,}));
            var diffValue = todayDate.diff(invoiceDate, 'M', true);

            var indexPeriod = Math.floor(((Number(diffValue)-Number(diffParam))/Number(periodLength)))+1;
            // log.debug("TTOBJ ", JSON.stringify({
            //     periodLength : periodLength,
            //     diffParam : diffParam,
            //     diffValue : diffValue,
            //     indexPeriod: indexPeriod,
            // }));
            if(!consectivePeriodObj[indexPeriod]){
                consectivePeriodObj[indexPeriod] = 0;
            }
            consectivePeriodObj[indexPeriod] += Number(AMOUNT_LIST[i].amt);
        }

        var conPeriod = 0;
        var lastPeriod = -1;
        for (const periodKey in consectivePeriodObj) {
            if (Object.hasOwnProperty.call(consectivePeriodObj, periodKey)) {
                const periodAmount = consectivePeriodObj[periodKey];
                if(conPeriod == 0)lastPeriod = periodKey;
                if(periodAmount >= AMOUNT){
                    // this year is enoght for tier
                    if(periodKey - lastPeriod == 1){
                        conPeriod++;
                    }
                    else{
                        conPeriod = 0;
                    }    
                }
            }
        }
        return conPeriod;

        // var customrecord_iv_tier_historySearchObj = search.create({
        //     type: "customrecord_iv_tier_history",
        //     filters:
        //     [
        //         ["isinactive","is","F"], 
        //         "AND", 
        //         ["custrecord_iv_th_customer","anyof",CUSTOMER_ID]
        //     ],
        //     columns:
        //     [
        //         "internalid",
        //         "custrecord_iv_history_tier",
        //         search.createColumn({name: "custrecord_iv_spending_from",join: "CUSTRECORD_IV_HISTORY_TIER"}), 
        //         search.createColumn({name: "custrecord_iv_sequence",join: "CUSTRECORD_IV_HISTORY_TIER"}), 
        //         search.createColumn({name: "name",join: "CUSTRECORD_IV_HISTORY_TIER"}),
        //         "custrecord_iv_th_effective_from",
        //         search.createColumn({name: "custrecord_iv_th_effective_to",sort: search.Sort.ASC}),
        //         "custrecord_iv_th_permanent",
        //         "custrecord_iv_upgrade_downgrade",
        //     ]
        // });
        // var searchResultCount = customrecord_iv_tier_historySearchObj.runPaged().count;
        // log.debug("customrecord_iv_tier_historySearchObj result count",searchResultCount);

        // var allAvailableTierObj = {
        //     "yearList" : [],
        // }

        // var now = 0;
        // while(now < searchResultCount) {
        //     var tierHistorySearchResults = customrecord_iv_tier_historySearchObj.run().getRange({start: now, end: now + 1000});
        //     tierHistorySearchResults.forEach(function (row, index){
        //         var isPermanent = row.getValue("custrecord_iv_th_permanent");
        //         if(!isPermanent){

        //             var activeYear = row.getValue("custrecord_iv_th_effective_to");
        //             var historyTier = row.getValue("custrecord_iv_history_tier");
        //             log.debug("historyTier",JSON.stringify(historyTier));
        //             var historyTierName = row.getValue({name: "name",join: "CUSTRECORD_IV_HISTORY_TIER"});
        //             var historyTierSpending = Number(row.getValue({name: "custrecord_iv_spending_from",join: "CUSTRECORD_IV_HISTORY_TIER"}));
        //             // TODO need format.parse and moment.getYear()
        //             activeYear = Number(activeYear.split("/")[activeYear.split("/").length-1]);
        //             if(!allAvailableTierObj[activeYear]){
        //                 allAvailableTierObj[activeYear] = 0;
        //             }
        //             log.debug("allAvailableTierObj.yearList",JSON.stringify(allAvailableTierObj.yearList));
        //             if(allAvailableTierObj.yearList.indexOf(activeYear)==-1)
        //                 allAvailableTierObj.yearList.push(activeYear);
        //             if(allAvailableTierObj[activeYear]<historyTierSpending){
        //                 allAvailableTierObj[activeYear] = historyTierSpending
        //             }
    
        //             if(!allAvailableTierObj[historyTier]){
        //                 allAvailableTierObj[historyTier] = {
        //                     "name" : historyTierName,
        //                     "yearList" : [activeYear],
        //                     "conYear" : 1,
        //                     "lastYear" : activeYear,
        //                 }
        //             }
        //             else{
        //                 allAvailableTierObj[historyTier].yearList.push(activeYear);
        //                 var lastValidYear = Number(allAvailableTierObj[historyTier].lastYear);
        //                 if(activeYear - lastValidYear == 1){
        //                     allAvailableTierObj[historyTier].conYear += 1;
        //                 }
        //                 else{
        //                     allAvailableTierObj[historyTier].conYear = 1;
        //                 }
        //                 allAvailableTierObj[historyTier].lastYear = activeYear;
        //             }
        //             // TODO config tier Id/ find dynamic solution to reference
        //             if(historyTier == 4){
        //                 if(!allAvailableTierObj["3"]){
        //                     allAvailableTierObj["3"] = {
        //                         "name" : "Gold",
        //                         "yearList" : [activeYear],
        //                         "conYear" : 1,
        //                         "lastYear" : activeYear,
        //                     }
        //                 }
        //                 else{
        //                     allAvailableTierObj["3"].yearList.push(activeYear);
        //                     var lastGoldYear = Number(allAvailableTierObj["3"].lastYear);
        //                     if(activeYear - lastGoldYear == 1){
        //                         allAvailableTierObj["3"].conYear += 1;
        //                     }
        //                     else{
        //                         allAvailableTierObj["3"].conYear = 1;
        //                     }    
        //                     allAvailableTierObj["3"].lastYear = activeYear;
        //                 }
        //             }
        //             // TODO config tier Id/ find dynamic solution to reference
        //             if(!allAvailableTierObj["1"]){
        //                 allAvailableTierObj["1"] = {
        //                     "name" : "Classic",
        //                     "yearList" : [activeYear],
        //                     "conYear" : 1,
        //                     "lastYear" : activeYear
        //                 }
        //             }
        //             else{
        //                 allAvailableTierObj["1"].yearList.push(activeYear);
        //                 var lastGoldYear = Number(allAvailableTierObj["1"].lastYear);
        //                 if(activeYear - lastGoldYear == 1){
        //                     allAvailableTierObj["1"].conYear += 1;
        //                 }
        //                 else{
        //                     allAvailableTierObj["1"].conYear = 1;
        //                 }    
        //                 allAvailableTierObj["1"].lastYear = activeYear;
        //             }

        //         }
        //     });
        //     now += 1000;
        // }
        // return allAvailableTierObj;
    }

    return {
        onRequest: onRequest
    }
});
