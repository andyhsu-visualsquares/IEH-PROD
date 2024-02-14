/**
 *@NApiVersion 2.1
 *@NModuleScope SameAccount
 *@NScriptType MapReduceScript
 *
 * Audit Log:
 * 20231124 Chris: Added Logic on preventing invoice with same transID wrongly calculated before welcome gift distribution
 */
define([
    './Services/PendingMembershipCalculationServices',
    './Constants/Constants',
    'N',
    './Repository/CustomerRepository',
    '../utils/DateUtils',
    './Services/RedemptionStagingWorkflowServices',
    '../lib/Time/moment-timezone',
    'N/search',
    './Services/ChinaDBServices'
], (
    PendingMembershipCalculationWorkflowServices,
    Constants,
    N_1,
    CustomerRepository,
    DateUtils,
    RedemptionStagingWorkflowServices,
    moment,
    search,
    ChinaDBServices
) => {
    const pendingMembershipCalculationServices = new PendingMembershipCalculationWorkflowServices()
    const getInputData = (context) => {
        try {
            log.audit('getInputData', context)
            return pendingMembershipCalculationServices.getNonFinishedPendingCalculationRec()
        } catch (e) {
            log.error('getInputData', e.toJSON ? e : e.stack ? e.stack : e.toString())
        }
    }

    function map(context) {
        const { value } = context
        const pmcRecObj = JSON.parse(value)
        log.debug('pmcRecObj', pmcRecObj)
        let customerInternalID = pmcRecObj.values.custrecord_iv_pmc_target_customer[0].value
        let customerID = pmcRecObj.values.custrecord_iv_pmc_customer_id
        let customerInfo = JSON.parse(pmcRecObj.values.custrecord_iv_pmc_customer_info)
        // rawCustomerInfo = rawCustomerInfo.slice(1, -1);
        // const pairs = rawCustomerInfo.split(", ");
        // const updatedPairs = pairs.map(pair => {
        //     const [property, value] = pair.split(": ");
        //     return `"${property}": ${value}`;
        // });
        // const customerInfo = `{${updatedPairs.join(", ")}}`;
        log.debug('customerInfo', customerInfo)
        let pmcRecID = pmcRecObj.id
        log.debug('map', pmcRecID)
        pendingMembershipCalculationServices.editProcessingStatus(pmcRecID, Constants.STAGING_REC_STATUS.PROCESSING)
        try {
            var memberAllowProcess = true
            if (customerInfo.RESIDENTIAL_REGION == "Mainland") {
                const chinaDBServices = new ChinaDBServices()
                let response = chinaDBServices.findCustomerByKey({ customerId: null, phone: customerInfo.PHONE, email: customerInfo.EMAIL })
                cnCustomerArr = JSON.parse(response.body).result
                if (cnCustomerArr.length === 0) memberAllowProcess = false
            }
            if (memberAllowProcess) {

                //Recal member Type
                N_1.https.post({
                    url: N_1.url.resolveScript({
                        scriptId: 'customscript_iv_downgrade_tier_sl',
                        deploymentId: 'customdeploy_iv_downgrade_tier_sl',
                        returnExternalUrl: true,
                    }),
                    body: JSON.stringify({
                        newRecId: customerInternalID,
                        isUpgrade: true,
                    }),
                    headers: { name: 'Accept-Language', value: 'en-us' },
                })
                // let resMsg = JSON.parse(response.body).msg

                var AMOUNT_LIST = _getCustomerTotalInvoice(customerInternalID, customerInfo.DECRYPTED_ID, customerInfo);
                var customerTotalInvoiceTier = _getTierByAmt(customerInternalID, AMOUNT_LIST)
                log.debug("customerTotalInvoiceTier", customerTotalInvoiceTier)
                customerInfo.internalId = customerInternalID
                log.debug("customerInfo", customerInfo)
                if (
                    customerTotalInvoiceTier.internalId === Constants.MEMBER_TYPE.CLASSIC &&
                    notYetEarnedWelcomeGiftWithinSixMonths(customerInfo)
                ) {
                    log.debug('Start Redemption For New Customers', customerInfo)
                    const redemptionStagingWfServices = new RedemptionStagingWorkflowServices()
                    let action = redemptionStagingWfServices.initAction(
                        'redemption',
                        {
                            ...customerInfo,
                            INTERNAL_ID: customerInternalID,
                            CUSTOMER_ID: customerID,
                            WELCOME_GIFT_DATE: new DateUtils().getTodayNetsuiteFormat().date,
                        },
                        'welcomeGift'
                    )
                    action.execute()
                }
                pendingMembershipCalculationServices.editProcessingStatus(pmcRecID, Constants.STAGING_REC_STATUS.FINISHED)
            } else {
                pendingMembershipCalculationServices.handlingError(pmcRecID, 'No Related Member On CN DB')
            }
        } catch (e) {
            log.error('map', e.toJSON ? e : e.stack ? e.stack : e.toString())
            pendingMembershipCalculationServices.handlingError(pmcRecID, e.toString())
        }
    }

    function reduce(context) { }

    function summarize(summary) { }

    function notYetEarnedWelcomeGiftWithinSixMonths({ FIRST_NAME, LAST_NAME, internalId }) {
        const result = pendingMembershipCalculationServices.findWithInSixMonthsRecordsByCustomer({
            firstName: FIRST_NAME,
            lastName: LAST_NAME,
            internalId: internalId
        })

        log.debug('notYetEarnedWelcomeGiftWithinSixMonths', result)
        return result
    }

    function _getCustomerTotalInvoice(CUSTOMER_ID, CUSTOMER_TRANSREGID, customerInfo) {
        var invocieAmtList = [];

        var transFilter = [
            ["mainline", "is", "T"],
            "AND",
            ["type", "anyof", "CustInvc"],
            // "AND", 
            // ["trandate","within",PERIOD_FROM, PERIOD_TO], 
            "AND",
            ["status", "anyof", "CustInvc:D", "CustInvc:B", "CustInvc:A"],
            // "AND", 
            // ["trandate","onorafter",periodEndDate],    
            "AND",
            ["datecreated", "noton", moment(customerInfo.REGISTRATION_DATE, 'YYYY-MM-DD HH:mm:ss').format("DD/MM/YYYY")]
        ]

        transFilter.push("AND", [["name", "anyof", CUSTOMER_ID]])
        // return invocieAmtList;

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
        log.debug("invoiceSearchObj result count", searchResultCount);
        var now = 0;
        while (now < searchResultCount) {
            var invoiceSearchResult = invoiceSearchObj.run().getRange({ start: now, end: now + 1000 });
            invoiceSearchResult.forEach(function (row, index) {
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

    function _getTierByAmt(CUSTOMER_ID, AMOUNT_LIST) {
        // var getConsectiveAmt = _checkPerviousStatus(CUSTOMER_ID);
        // log.debug("getConsectiveAmt.", JSON.stringify(getConsectiveAmt))

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
                for (var i = 0; i < AMOUNT_LIST.length; i++) {
                    var tierPeriodLength = elementTier.periodLong;
                    var tierStartDate = moment(new Date()).subtract(Number(tierPeriodLength), "M");
                    // var invoiceDate = moment(format.parse({value: AMOUNT_LIST[i].date,type: format.Type.DATE,timezone: format.Timezone.ASIA_HONG_KONG,}));
                    var invoiceDate = moment(N_1.format.parse({
                        value: AMOUNT_LIST[i].date,
                        type: N_1.format.Type.DATE,
                        // timezone: format.Timezone.ASIA_HONG_KONG,
                    })).subtract(new Date().getTimezoneOffset() + 8 * 60, 'minute')
                    if (tierStartDate.isBefore(invoiceDate)) {
                        AMOUNT += Number(AMOUNT_LIST[i].amt);
                    }
                }
                log.debug("elementTier : " + tierKey, "AMOUNT : " + AMOUNT + " elementTier.amtFrom: " + elementTier.amtFrom + JSON.stringify(AMOUNT >= elementTier.amtFrom));

                if (elementTier.isCompoundTier) {
                    var compoundPermanentTier, compoundNonPermanentTier;
                    for (let indexI = 0; indexI < elementTier.component.length; indexI++) {
                        if (TIER_LIST[elementTier.component[indexI]].isPermanent) {
                            compoundPermanentTier = elementTier.component[indexI];
                        }
                        else {
                            compoundNonPermanentTier = elementTier.component[indexI];
                        }
                    }
                    var isPermanent = false, isAmtEnough = false;

                    // var getConsectiveAmt = _checkPerviousStatus(elementTier.periodLong, TIER_LIST[compoundPermanentTier].amtFrom, AMOUNT_LIST);
                    // log.debug("getConsectiveAmt",JSON.stringify(getConsectiveAmt));

                    // if(!!getConsectiveAmt){
                    //     // if(conYearOnTier >= TIER_LIST[compoundPermanentTier].neededCumulate || (AMOUNT >= TIER_LIST[compoundPermanentTier].amtFrom && conYearOnTier >= TIER_LIST[compoundPermanentTier].neededCumulate-1)){
                    //     if(getConsectiveAmt >= TIER_LIST[compoundPermanentTier].neededCumulate){
                    //         isPermanent = true;
                    //     }
                    // }
                    isPermanent = _checkPerviousStatus(elementTier.periodLong, TIER_LIST[compoundPermanentTier].amtFrom, AMOUNT_LIST, TIER_LIST[compoundPermanentTier].neededCumulate);
                    if (AMOUNT >= TIER_LIST[compoundNonPermanentTier].amtFrom) {
                        isAmtEnough = true;
                    }
                    if (isPermanent && isAmtEnough) {
                        foundCorrectTier = true;
                    }

                    // need the non permat part amt fulfilled && perm part reach its cumulate
                    // foundCorrectTier = true;
                }
                else {// !elementTier.isCompoundTier
                    if (elementTier.isPermanent && (elementTier.neededCumulate > 1)) {
                        // perm part reach its cumulate

                        // var getConsectiveAmt = _checkPerviousStatus(elementTier.periodLong, elementTier.amtFrom, AMOUNT_LIST);
                        // log.debug("getConsectiveAmt",JSON.stringify(getConsectiveAmt));

                        // var conYearOnTier = 1, tierHistory = getConsectiveAmt;
                        // if(!!getConsectiveAmt){
                        // conYearOnTier = getConsectiveAmt;
                        // }        
                        // if(getConsectiveAmt >= elementTier.neededCumulate){
                        //     foundCorrectTier = true;
                        // }
                        var foundCorrectTier = _checkPerviousStatus(elementTier.periodLong, elementTier.amtFrom, AMOUNT_LIST, elementTier.neededCumulate);
                    }
                    else {// elementTier.neededCumulate == 1
                        if (AMOUNT >= elementTier.amtFrom) {
                            foundCorrectTier = true;
                        }
                    }
                }
                if (foundCorrectTier) {
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
    function _getMembershipTier() {
        var customrecord_iv_membership_tiersSearchObj = search.create({
            type: "customrecord_iv_membership_tiers",
            filters:
                [
                    ["isinactive", "is", "F"]
                ],
            columns:
                [
                    "internalid",
                    search.createColumn({ name: "custrecord_iv_sequence", sort: search.Sort.DESC }),
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
        while (now < searchResultCount) {
            var memberSearchResults = customrecord_iv_membership_tiersSearchObj.run().getRange({ start: now, end: now + 1000 });
            memberSearchResults.forEach(function (row, index) {
                if (!returnResult["orderList"]) returnResult["orderList"] = [];
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
                    component: row.getValue("custrecord_iv_component_tiers").indexOf(",") != -1 ? row.getValue("custrecord_iv_component_tiers").split(",") : row.getValue("custrecord_iv_component_tiers"),
                };
            })
            now += 1000;
        }
        return returnResult;
    }
    function _checkPerviousStatus(periodLength, AMOUNT, AMOUNT_LIST, contieuePeriodLength) {
        log.debug("periodLength", JSON.stringify({
            periodLength: periodLength,
            AMOUNT: AMOUNT,
            AMOUNT_LIST: AMOUNT_LIST
        }));
        var validPeriodList = [];

        const today = moment().utc().add(8 * 60, "minute").startOf('day')
        for (var i = 0; i < AMOUNT_LIST.length; i++) {

            // MOMENT USE: to parse the record date back to server time zone GMT-7 for using .isAfter()
            const targetday = moment(N_1.format.parse({
                value: AMOUNT_LIST[i].date,
                type: N_1.format.Type.DATE,
                timezone: N_1.format.Timezone.ASIA_HONG_KONG,
            })).utc().add(8 * 60, "minute").startOf('day');


            var obj = {};
            for (let indexCL = 0; indexCL < contieuePeriodLength; indexCL++) {
                var startMoment = moment(today).add(Number(periodLength) * (-indexCL), "M").subtract(Number(periodLength), "M").add("1", "d").startOf('day');
                var endMoment = moment(today).add(Number(periodLength) * (-indexCL), "M").endOf('day');
                var is_over = targetday.isBetween(startMoment, endMoment, undefined, '[]');
                var is_amt_over = Number(AMOUNT_LIST[i].amt) >= AMOUNT;
                if (is_over && is_amt_over && validPeriodList.indexOf(indexCL) == -1) validPeriodList.push(indexCL);
                obj[indexCL] = {
                    is_amt_over: is_amt_over,
                    is_amt_overText: Number(AMOUNT_LIST[i].amt) + " >= " + AMOUNT,
                    validPeriodList: validPeriodList,
                    today: today,
                    targetday: targetday,
                    is_over: is_over,
                    start: startMoment,
                    end: endMoment
                }
            }
            log.debug("obj", JSON.stringify(obj));
        }
        log.debug("validPeriodList", JSON.stringify(validPeriodList));

        // var consectivePeriodObj = {};

        // MOMENT USE: to parse the Current date Forward to HK time zone GMT+8 for using .startOf('day') & .diff()
        // this new Date() local will become HKT local, so this UTC will incorrect...

        // var todayDate = moment(new Date()).add(new Date().getTimezoneOffset() + 8*60,'minute').startOf('day');
        // var period1Date = moment(todayDate).subtract(Number(periodLength),"M").add(1,'d').subtract(1,'s');

        // var invoiceDate = moment(format.parse({
        //     value: AMOUNT_LIST[i].date,
        //     type: format.Type.DATE,
        //     timezone: format.Timezone.ASIA_HONG_KONG,
        // })).startOf('day');
        // var diffValue = todayDate.diff(invoiceDate, 'M', true);
        // // var indexPeriod = Math.floor((Number(diffValue)/Number(diffParam)))+1;
        // var indexPeriod = Math.floor((Number(diffValue)/Number(periodLength)));
        // // var indexPeriod = Math.floor((Math.abs(Number(diffValue)-Number(diffParam))/Number(periodLength)))+1;
        // log.debug("TTOBJ ", JSON.stringify({
        //     newDate : new Date(),
        //     forwardedDate : moment(new Date()).add(new Date().getTimezoneOffset() + 8*60,'minute'),
        //     todayDate : todayDate,
        //     invoiceDate : invoiceDate,
        //     periodLength : periodLength,
        //     diffValue : diffValue,
        //     indexPeriod: indexPeriod,
        // }));
        // if(!consectivePeriodObj[indexPeriod]){
        //     consectivePeriodObj[indexPeriod] = 0;
        // }
        // consectivePeriodObj[indexPeriod] += Number(AMOUNT_LIST[i].amt);
        // log.debug("consectivePeriodObj",JSON.stringify(consectivePeriodObj));

        // var conPeriod = -999;
        // var lastPeriod = -1;
        // for (const periodKey in consectivePeriodObj) {
        //     if (Object.hasOwnProperty.call(consectivePeriodObj, periodKey)) {
        //         const periodAmount = consectivePeriodObj[periodKey];
        //         log.debug("consectivePeriodObj",{
        //             conPeriod:conPeriod,
        //             lastPeriod:lastPeriod,
        //             periodAmount:periodAmount,
        //             AMOUNT:AMOUNT,
        //         });

        //         if(conPeriod == -999){
        //             conPeriod = 0;
        //             lastPeriod = periodKey-1;
        //         }
        //         if(periodAmount >= AMOUNT){
        //             // this year is enoght for tier
        //             if(periodKey - lastPeriod == 1){
        //                 conPeriod++;
        //             }
        //             else{
        //                 conPeriod = 0;
        //             }
        //         }
        //         lastPeriod = periodKey;
        //     }
        // }
        // return conPeriod;
        return validPeriodList.length >= contieuePeriodLength;
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize,
    }
})
