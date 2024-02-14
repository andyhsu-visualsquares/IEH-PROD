/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([
    'N/search',
    'N/record',
    '../Entity/EarnedRewards',
    '../../utils/DateUtils',
    '../Constants/Constants',
    '../../lib/Time/moment',
    '../../lib/lodash',
    '../../lib/bignumber',
    '../../utils/NumberUtils',
], (search, record, EarnedRewards, DateUtils, constants, moment, _, bignumber, NumberUtils) => {
    class EarnedRewardsDAO {
        constructor() {
            this.dateFormatter = new DateUtils()
        }

        findCustomerPointBalance(customerIds) {
            log.debug('customerIds', typeof customerIds)
            const numberUtils = new NumberUtils()
            let result = this.findCustomerValidEarnedRewardsRecord(customerIds)
            log.debug('resuolt', result)
            let groupedResult = _.groupBy(result, 'customerId')
            log.debug('groupedResult', groupedResult)
            let groupedResult_key = Object.keys(groupedResult)
            for (let i = 0; i < groupedResult_key.length; i++) {
                let customerId = groupedResult_key[i]
                let earnedRewardData = groupedResult[customerId]
                let sumReward = _.sumBy(earnedRewardData, 'earnedPoints')
                let sumRedeem = _.sumBy(earnedRewardData, 'redeemPoints')
                let pointBalance = new bignumber(sumReward).minus(sumRedeem).toNumber()
                pointBalance = numberUtils.numberWithCommas(pointBalance)
                groupedResult[customerId].push({
                    sumReward: sumReward,
                    sumRedeem: sumRedeem,
                    pointBalance: pointBalance,
                })
            }
            return groupedResult
        }
        findCustomerStoredPointBalance(customerIds) {
            try {
                let groupedResult = []
                for (let customerId of customerIds) {
                    let customerPoint = search.lookupFields({
                        type: 'customer',
                        id: customerId,
                        columns: ['custentity_iv_cl_outstanding_pts_storage', 'entityid'],
                    })
                    let targetCustomer = {
                        pointBalance: customerPoint.custentity_iv_cl_outstanding_pts_storage,
                    }
                    groupedResult.push({
                        customerId: customerId,
                        customerID: customerPoint.entityid,
                        pointBalance: customerPoint.custentity_iv_cl_outstanding_pts_storage,
                    })
                }
                return groupedResult
            } catch (e) {
                log.debug('e', e)
            }
        }

        findById(customerId) {
            let earnedPoints = 0
            const customrecord105SearchColEarnedPoints = search.createColumn({
                name: 'custrecord_iv_earned_points',
                summary: search.Summary.SUM,
            })
            const customrecord105Search = search.create({
                type: 'customrecord_iv_earned_rewards',
                filters: [
                    ['custrecord_iv_point_expiry_date_time', 'within', 'thisrollingyear'],
                    'AND',
                    ['custrecord_iv_status', 'anyof', '2', '5'],
                    'AND',
                    ['custrecord_iv_customer.entityid', 'is', customerId],
                    'AND',
                    ['isinactive', 'is', 'F'],
                ],
                columns: [customrecord105SearchColEarnedPoints],
            })

            const customrecord105SearchPagedData = customrecord105Search.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecord105SearchPagedData.pageRanges.length; i++) {
                const customrecord105SearchPage = customrecord105SearchPagedData.fetch({ index: i })
                customrecord105SearchPage.data.forEach((result) => {
                    earnedPoints = result.getValue(customrecord105SearchColEarnedPoints) || 0
                })
            }
            return earnedPoints
        }

        findCustomerValidEarnedRewardsRecord(customerIds) {
            let rewardRecordList = []
            let defaultFilter = [
                [
                    'custrecord_iv_status',
                    'anyof',
                    constants.EARNED_REWARDS_TYPE.POINT_STATUS.PROVISIONED,
                    constants.EARNED_REWARDS_TYPE.POINT_STATUS.PARITIALLY_USED,
                ],
                'AND',
                ['custrecord_iv_reward_type', 'anyof', constants.EARNED_REWARDS_TYPE.POINTS],
                'AND',
                ['custrecord_iv_expired', 'is', 'F'],
                'AND',
                [
                    ['custrecord_iv_point_expiry_date_time', 'onorafter', 'today'],
                    'OR',
                    ['custrecord_iv_point_expiry_date_time', 'isempty', ''],
                ],
            ]
            log.debug('defaultFilter', defaultFilter)
            if (customerIds.length > 0) {
                // defaultFilter.push("AND", ["custrecord_iv_customer", "anyof", `"${customerIds.join('","')}"`])
                defaultFilter.push('AND', ['custrecord_iv_customer', 'anyof', customerIds])
            }
            let customerFilter = customerIds
            var customrecord_iv_earned_rewardsSearchObj = search.create({
                type: 'customrecord_iv_earned_rewards',
                filters: defaultFilter,
                columns: [
                    'custrecord_iv_customer',
                    'custrecord_iv_scheme',
                    'custrecord_iv_earned_points',
                    'custrecord_iv_redeem_points',
                    'custrecord_iv_earned_date_time',
                    'custrecord_iv_point_expiry_date_time',
                    'custrecord_iv_status',
                    'custrecord_iv_reward_type',
                ],
            })
            var searchResultCount = customrecord_iv_earned_rewardsSearchObj.runPaged().count
            log.debug('customrecord_iv_earned_rewardsSearchObj result count', searchResultCount)
            customrecord_iv_earned_rewardsSearchObj.run().each(function (result) {
                let customerId = Number(result.getValue('custrecord_iv_customer'))
                let earnedPoints = Number(result.getValue('custrecord_iv_earned_points'))
                let redeemPoints = Number(result.getValue('custrecord_iv_redeem_points'))
                rewardRecordList.push({
                    customerId: customerId,
                    earnedPoints: earnedPoints,
                    redeemPoints: redeemPoints,
                })
                return true
            })
            log.debug('rewardRecordList', rewardRecordList)
            return rewardRecordList
            /*
            customrecord_iv_earned_rewardsSearchObj.id="customsearch1698131251420";
            customrecord_iv_earned_rewardsSearchObj.title="[Dev] [FIELD] Earned Points Search (copy)";
            var newSearchId = customrecord_iv_earned_rewardsSearchObj.save();
            */
        }

        findPointSummary(customerId, { startDate = null, endDate = null }) {
            let earnedPoints = 0
            const filters = [
                ['custrecord_iv_status', 'anyof', '2'],
                'AND',
                ['custrecord_iv_customer.entityid', 'is', customerId],
                'AND',
                ['isinactive', 'is', 'F'],
            ]
            if (startDate && endDate)
                filters.push('AND', [
                    'custrecord_iv_earned_date_time',
                    'within',
                    startDate + ' 12:00 am',
                    endDate + ' 12:00 am',
                ])

            const customrecord105SearchColEarnedPoints = search.createColumn({
                name: 'custrecord_iv_earned_points',
                summary: search.Summary.SUM,
            })
            const customrecord105Search = search.create({
                type: 'customrecord_iv_earned_rewards',
                filters,
                columns: [customrecord105SearchColEarnedPoints],
            })

            const customrecord105SearchPagedData = customrecord105Search.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecord105SearchPagedData.pageRanges.length; i++) {
                const customrecord105SearchPage = customrecord105SearchPagedData.fetch({ index: i })
                customrecord105SearchPage.data.forEach((result) => {
                    earnedPoints = parseInt(result.getValue(customrecord105SearchColEarnedPoints))
                })
            }

            return earnedPoints
        }

        // findPointSummaryByExpiryDate(customerId) {
        //     const summaryList = []
        //     let sumPointsByExpiry = {}
        //
        //     const filters = [
        //         ['custrecord_iv_status', 'anyof', '2', '5'],
        //         'AND',
        //         ['custrecord_iv_customer.entityid', 'is', customerId],
        //         'AND',
        //         ['custrecord_iv_point_expiry_date_time', 'onorafter', 'today'],
        //         'AND',
        //         ['custrecord_iv_reward_type', 'is', '1'],
        //         'AND',
        //         ['isinactive', 'is', 'F'],
        //     ]
        //
        //     const customrecord_iv_earned_rewardsSearchColPointExpiryDate = search.createColumn({
        //         name: 'custrecord_iv_point_expiry_date_time',
        //     })
        //     const customrecord_iv_earned_rewardsSearchColEarnedPoints = search.createColumn({
        //         name: 'custrecord_iv_earned_points',
        //     })
        //     const customrecord_iv_earned_rewardsSearchColRedeemPoints = search.createColumn({
        //         name: 'custrecord_iv_redeem_points',
        //     })
        //
        //     const customrecord105Search = search.create({
        //         type: 'customrecord_iv_earned_rewards',
        //         filters,
        //         columns: [
        //             customrecord_iv_earned_rewardsSearchColPointExpiryDate,
        //             customrecord_iv_earned_rewardsSearchColEarnedPoints,
        //             customrecord_iv_earned_rewardsSearchColRedeemPoints,
        //         ],
        //     })
        //
        //     log.debug('count', customrecord105Search.runPaged().count)
        //     const earnedRewardSearch = customrecord105Search.runPaged({ pageSize: 1000 })
        //     log.debug('a1')
        //     for (let i = 0; i < earnedRewardSearch.pageRanges.length; i++) {
        //         log.debug('a2')
        //         const customrecord105SearchPage = earnedRewardSearch.fetch({ index: i })
        //         log.debug('a3')
        //         customrecord105SearchPage.data.forEach((result) => {
        //             log.debug('aaaa')
        //             const earnedPoints = parseInt(
        //                 result.getValue(customrecord_iv_earned_rewardsSearchColEarnedPoints) || 0
        //             )
        //             const redeemPoints = parseInt(
        //                 result.getValue(customrecord_iv_earned_rewardsSearchColRedeemPoints) || 0
        //             )
        //
        //             summaryList.push({
        //                 EXPIRY_DATE: this.dateFormatter.dateStringToInputFormat(
        //                     result.getValue(customrecord_iv_earned_rewardsSearchColPointExpiryDate)
        //                 ),
        //                 EARNED_POINTS: earnedPoints - redeemPoints,
        //             })
        //         })
        //     }
        //
        //     log.debug('bbb')
        //     summaryList.sort(function (a, b) {
        //         let dateA = new Date(a.EXPIRY_DATE)
        //         let dateB = new Date(b.EXPIRY_DATE)
        //         return dateA - dateB
        //     })
        //     log.debug('ccc')
        //     for (let i = 0; i < summaryList.length; i++) {
        //         log.debug('ddd')
        //         let item = summaryList[i]
        //         let expiryDate = item.EXPIRY_DATE
        //         let earnedPoints = parseInt(item.EARNED_POINTS)
        //
        //         if (sumPointsByExpiry.hasOwnProperty(expiryDate)) {
        //             if (sumPointsByExpiry[expiryDate] + earnedPoints > 0) sumPointsByExpiry[expiryDate] += earnedPoints
        //         } else {
        //             if (earnedPoints > 0) sumPointsByExpiry[expiryDate] = earnedPoints
        //         }
        //     }
        //     log.debug('sumPointsByExpiry', sumPointsByExpiry)
        //     return sumPointsByExpiry
        // }
        findPointSummaryByExpiryDate(customerId) {
            const summaryList = []
            let sumPointsByExpiry = {}

            const filters = [
                ['custrecord_iv_status', 'anyof', '2', '5'],
                'AND',
                ['custrecord_iv_customer.entityid', 'is', customerId],
                'AND',
                ['custrecord_iv_point_expiry_date_time', 'onorafter', 'today'],
                'AND',
                ['custrecord_iv_reward_type', 'is', '1'],
                'AND',
                ['isinactive', 'is', 'F'],
            ]

            var customrecord_iv_earned_rewardsSearchObj = search.create({
                type: 'customrecord_iv_earned_rewards',
                filters,
                columns: [
                    search.createColumn({ name: 'custrecord_iv_point_expiry_date_time', label: 'Point Expiry Date' }),
                    search.createColumn({ name: 'custrecord_iv_earned_points', label: 'Earned Points' }),
                    search.createColumn({ name: 'custrecord_iv_redeem_points', label: 'Redeem Points' }),
                ],
            })
            var searchResultCount = customrecord_iv_earned_rewardsSearchObj.runPaged().count
            log.debug('customrecord_iv_earned_rewardsSearchObj result count', searchResultCount)
            var resultsss = customrecord_iv_earned_rewardsSearchObj.run().getRange(0, 1000)
            for (let i = 0; i < resultsss.length; i++) {
                // customrecord_iv_earned_rewardsSearchObj.run().each(function (result) {
                log.debug('aaaa')
                const earnedPoints = parseInt(resultsss[i].getValue('custrecord_iv_earned_points') || 0)
                const redeemPoints = parseInt(resultsss[i].getValue('custrecord_iv_redeem_points') || 0)

                summaryList.push({
                    EXPIRY_DATE: this.dateFormatter.dateStringToInputFormat(
                        resultsss[i].getValue('custrecord_iv_point_expiry_date_time')
                    ),
                    EARNED_POINTS: earnedPoints - redeemPoints,
                })
                // return true
            }

            log.debug('bbb')
            summaryList.sort(function (a, b) {
                let dateA = new Date(a.EXPIRY_DATE)
                let dateB = new Date(b.EXPIRY_DATE)
                return dateA - dateB
            })
            log.debug('ccc')
            for (let i = 0; i < summaryList.length; i++) {
                log.debug('ddd')
                let item = summaryList[i]
                let expiryDate = item.EXPIRY_DATE
                let earnedPoints = parseInt(item.EARNED_POINTS)

                if (sumPointsByExpiry.hasOwnProperty(expiryDate)) {
                    if (sumPointsByExpiry[expiryDate] + earnedPoints > 0) sumPointsByExpiry[expiryDate] += earnedPoints
                } else {
                    if (earnedPoints > 0) sumPointsByExpiry[expiryDate] = earnedPoints
                }
            }
            log.debug('sumPointsByExpiry', sumPointsByExpiry)
            return sumPointsByExpiry
        }

        findPointSummaryByExpiryDateByCustomerInternalId(id) {
            const summaryList = []
            let sumPointsByExpiry = {}

            const filters = [
                ['custrecord_iv_status', 'anyof', '2', '5'],
                'AND',
                ['custrecord_iv_customer', 'anyof', '1090923'],
                'AND',
                ['custrecord_iv_point_expiry_date_time', 'onorafter', 'today'],
                'AND',
                ['custrecord_iv_reward_type', 'is', '1'],
                'AND',
                ['isinactive', 'is', 'F'],
            ]

            const customrecord_iv_earned_rewardsSearchColPointExpiryDate = search.createColumn({
                name: 'custrecord_iv_point_expiry_date_time',
            })
            const customrecord_iv_earned_rewardsSearchColEarnedPoints = search.createColumn({
                name: 'custrecord_iv_earned_points',
            })
            const customrecord_iv_earned_rewardsSearchColRedeemPoints = search.createColumn({
                name: 'custrecord_iv_redeem_points',
            })

            const customrecord105Search = search.create({
                type: 'customrecord_iv_earned_rewards',
                filters,
                columns: [
                    customrecord_iv_earned_rewardsSearchColPointExpiryDate,
                    customrecord_iv_earned_rewardsSearchColEarnedPoints,
                    customrecord_iv_earned_rewardsSearchColRedeemPoints,
                ],
            })

            const customrecord105SearchPagedData = customrecord105Search.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecord105SearchPagedData.pageRanges.length; i++) {
                const customrecord105SearchPage = customrecord105SearchPagedData.fetch({ index: i })
                customrecord105SearchPage.data.forEach((result) => {
                    const earnedPoints = parseInt(
                        result.getValue(customrecord_iv_earned_rewardsSearchColEarnedPoints) || 0
                    )
                    const redeemPoints = parseInt(
                        result.getValue(customrecord_iv_earned_rewardsSearchColRedeemPoints) || 0
                    )

                    summaryList.push({
                        EXPIRY_DATE: this.dateFormatter.dateStringToInputFormat(
                            result.getValue(customrecord_iv_earned_rewardsSearchColPointExpiryDate)
                        ),
                        EARNED_POINTS: earnedPoints - redeemPoints,
                    })
                })
            }

            summaryList.sort(function (a, b) {
                let dateA = new Date(a.EXPIRY_DATE)
                let dateB = new Date(b.EXPIRY_DATE)
                return dateA - dateB
            })

            for (let i = 0; i < summaryList.length; i++) {
                let item = summaryList[i]
                let expiryDate = item.EXPIRY_DATE
                let earnedPoints = parseInt(item.EARNED_POINTS)

                if (sumPointsByExpiry.hasOwnProperty(expiryDate)) {
                    sumPointsByExpiry[expiryDate] += earnedPoints
                } else {
                    sumPointsByExpiry[expiryDate] = earnedPoints
                }
            }

            return sumPointsByExpiry
        }

        findEarnedHistory(customerId, spec, { startDate = '', endDate = '' }) {
            //Showing Point History Only
            const history = []

            const filters = [
                ['custrecord_iv_customer.entityid', 'is', customerId],
                'AND',
                ['custrecord_iv_reward_type', 'anyof', constants.EARNED_REWARDS_TYPE.POINTS],
            ]
            if (startDate && endDate)
                filters.push('AND', ['created', 'within', startDate + ' 12:00 am', endDate + ' 12:00 am'])
            if (spec === 'findMergeBalance')
                filters.push('AND', ['custrecord_iv_source_sales_order', 'noneof', '@NONE@'])
            else filters.push('AND', ['custrecord_iv_status', 'anyof', '2', '5'], 'AND', ['isinactive', 'is', 'F'])
            const customrecord105SearchColInternalId = search.createColumn({ name: 'internalid' })
            const customrecord105SearchColEarnedDateTime = search.createColumn({
                name: 'custrecord_iv_earned_date_time',
            })
            const customrecord105SearchColEarnedPoints = search.createColumn({ name: 'custrecord_iv_earned_points' })
            const customrecord105SearchColRedeemedPoints = search.createColumn({ name: 'custrecord_iv_redeem_points' })
            const customrecord105SearchColPointExpiryDate = search.createColumn({
                name: 'custrecord_iv_point_expiry_date_time',
            })
            const customrecord_iv_earned_rewardsSearchColOmniDisplayMessageEnglish = search.createColumn({
                name: 'custrecord_iv_er_eng_omni_msg',
            })
            const customrecord_iv_earned_rewardsSearchColOmniDisplayMessageSimplifiedChinese = search.createColumn({
                name: 'custrecord_iv_er_schin_omni_msg',
            })
            const customrecord_iv_earned_rewardsSearchColOmniDisplayMessageTraditionalChinese = search.createColumn({
                name: 'custrecord_iv_er_tchin_omni_msg',
            })
            const customrecord_iv_earned_rewardsSearchColRedemptionItem = search.createColumn({
                name: 'custrecord_iv_redemption_item',
            })
            const customrecord_iv_earned_rewardsSearchColRedeemptionRecord = search.createColumn({
                name: 'custrecord_iv_redemption_record',
            })
            const customrecord_iv_earned_rewardsSearchColProvisionDateTime = search.createColumn({
                name: 'custrecord_iv_provision_date_time',
            })

            const customrecord105Search = search.create({
                type: 'customrecord_iv_earned_rewards',
                filters,
                columns: [
                    customrecord105SearchColInternalId,
                    customrecord105SearchColEarnedDateTime,
                    customrecord105SearchColEarnedPoints,
                    customrecord105SearchColRedeemedPoints,
                    customrecord105SearchColPointExpiryDate,
                    customrecord_iv_earned_rewardsSearchColOmniDisplayMessageEnglish,
                    customrecord_iv_earned_rewardsSearchColOmniDisplayMessageSimplifiedChinese,
                    customrecord_iv_earned_rewardsSearchColOmniDisplayMessageTraditionalChinese,
                    customrecord_iv_earned_rewardsSearchColRedemptionItem,
                    customrecord_iv_earned_rewardsSearchColRedeemptionRecord,
                    customrecord_iv_earned_rewardsSearchColProvisionDateTime,
                ],
            })

            const customrecord105SearchPagedData = customrecord105Search.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecord105SearchPagedData.pageRanges.length; i++) {
                const customrecord105SearchPage = customrecord105SearchPagedData.fetch({ index: i })
                customrecord105SearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customrecord105SearchColInternalId)
                    const earnedDateTime = result.getValue(customrecord105SearchColEarnedDateTime)
                    const earnedPoints = result.getValue(customrecord105SearchColEarnedPoints)
                    const redeemedPoints = result.getValue(customrecord105SearchColRedeemedPoints)
                    const pointExpiryDate = result.getValue(customrecord105SearchColPointExpiryDate)
                    const omniDisplayMessageEnglish = result.getValue(
                        customrecord_iv_earned_rewardsSearchColOmniDisplayMessageEnglish
                    )
                    const omniDisplayMessageSimplifiedChinese = result.getValue(
                        customrecord_iv_earned_rewardsSearchColOmniDisplayMessageSimplifiedChinese
                    )
                    const omniDisplayMessageTraditionalChinese = result.getValue(
                        customrecord_iv_earned_rewardsSearchColOmniDisplayMessageTraditionalChinese
                    )
                    const redemptionItem = result.getValue(customrecord_iv_earned_rewardsSearchColRedemptionItem)
                    const redemptionRec = result.getValue(customrecord_iv_earned_rewardsSearchColRedeemptionRecord)
                    const provisionDateTime = result.getValue(customrecord_iv_earned_rewardsSearchColProvisionDateTime)

                    log.debug('new Date', this.dateFormatter.dateTimeStringToInputFormat(provisionDateTime))

                    history.push(
                        new EarnedRewards({
                            type: 'earned',
                            internalId,
                            createdDate: this.dateFormatter.dateTimeStringToInputFormat(provisionDateTime),
                            earnedPoints: Math.abs(parseInt(earnedPoints)),
                            points: Math.abs(parseInt(earnedPoints)),
                            transaction: {
                                EN: omniDisplayMessageEnglish,
                                SC: omniDisplayMessageSimplifiedChinese,
                                TC: omniDisplayMessageTraditionalChinese,
                            },
                            pointExpiryDate: this.dateFormatter.dateStringToInputFormat(pointExpiryDate),
                            redeemedPoint: parseInt(redeemedPoints),
                            redemptionItem: redemptionItem,
                            redemptionRec: redemptionRec,
                        })
                    )
                })
            }

            return history
        }

        findRedemptionHistory(customerId, { startDate = '', endDate = '' }) {
            const history = []
            const filters = [['custrecord_iv_rr_customer.entityid', 'is', customerId], 'AND', ['isinactive', 'is', 'F']]
            if (startDate && endDate)
                filters.push('AND', ['custrecord_iv_redemption_date', 'within', startDate, endDate])

            const customrecord288SearchColRedemptionPoints = search.createColumn({
                name: 'custrecord_iv_redemption_points',
            })
            const customrecord288SearchColDateCreated = search.createColumn({ name: 'custrecord_iv_redemption_date' })
            // const customrecord288SearchColDateCreated = search.createColumn({ name: 'created' })
            const customrecord_iv_loyalty_point_redemptionSearchColDisplayName = search.createColumn({
                name: 'displayname',
                join: 'CUSTRECORD_IV_REDEEMED_ITEM',
            })
            const customrecord_iv_loyalty_point_redemptionSearchColBilingulaItemName = search.createColumn({
                name: 'custitem_bilingual_name',
                join: 'CUSTRECORD_IV_REDEEMED_ITEM',
            })
            const customrecord_iv_loyalty_point_redemptionSearchColManualAdjustment = search.createColumn({
                name: 'custrecord_iv_rr_manual_adjustment',
            })

            const customrecord288Search = search.create({
                type: 'customrecord_iv_loyalty_point_redemption',
                filters,
                columns: [
                    'internalid',
                    customrecord288SearchColRedemptionPoints,
                    customrecord288SearchColDateCreated,
                    customrecord_iv_loyalty_point_redemptionSearchColDisplayName,
                    customrecord_iv_loyalty_point_redemptionSearchColManualAdjustment,
                    customrecord_iv_loyalty_point_redemptionSearchColBilingulaItemName,
                ],
            })

            const customrecord288SearchPagedData = customrecord288Search.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecord288SearchPagedData.pageRanges.length; i++) {
                const customrecord288SearchPage = customrecord288SearchPagedData.fetch({ index: i })
                var lastProcessedRRInternalID = 0
                customrecord288SearchPage.data.forEach((result) => {
                    const redemptionPoints = result.getValue(customrecord288SearchColRedemptionPoints)
                    const dateCreated = result.getValue(customrecord288SearchColDateCreated)
                    const itemName = result.getValue(customrecord_iv_loyalty_point_redemptionSearchColDisplayName)
                    const bilingualItemName = result.getValue(
                        customrecord_iv_loyalty_point_redemptionSearchColBilingulaItemName
                    )
                    const manualAdjustment = result.getValue(
                        customrecord_iv_loyalty_point_redemptionSearchColManualAdjustment
                    )
                    var targetRemption
                    if (result.id !== lastProcessedRRInternalID) {
                        targetRemption = new EarnedRewards({
                            type: 'redemption',
                            redeemedPoint: Number(parseInt(redemptionPoints) * -1),
                            points: Number(parseInt(redemptionPoints) * -1),
                            // redeemedPoint: -Math.abs(parseInt(redemptionPoints)),
                            // points: -Math.abs(parseInt(redemptionPoints)),
                            createdDate: this.dateFormatter.dateStringToInputFormat(dateCreated),
                            manualAdjustment,
                            transaction: {
                                EN: manualAdjustment ? 'Adjustment' : `Reward - ${bilingualItemName}`,
                                SC: manualAdjustment ? '调整' : `奖赏 - ${itemName}`,
                                TC: manualAdjustment ? '調整' : `獎賞 - ${itemName}`,
                            },
                        })
                    } else {
                        targetRemption = history.pop()
                        targetRemption.transaction = {
                            EN: targetRemption.transaction.EN + `, ${bilingualItemName}`,
                            SC: targetRemption.transaction.SC + `, ${itemName}`,
                            TC: targetRemption.transaction.TC + `, ${itemName}`,
                        }
                    }
                    history.push(targetRemption)
                    lastProcessedRRInternalID = result.id
                })
            }

            return history
        }

        findRedemptionById(internalId) {
            let redemption = null

            const customrecord288SearchColInternalId = search.createColumn({ name: 'internalid' })
            const customrecord288SearchColName = search.createColumn({ name: 'name', sort: search.Sort.ASC })
            const customrecord288Search = search.create({
                type: 'customrecord_iv_loyalty_point_redemption',
                filters: [['internalid', 'anyof', internalId], 'AND', ['isinactive', 'is', 'F']],
                columns: [customrecord288SearchColInternalId, customrecord288SearchColName],
            })

            const customrecord288SearchPagedData = customrecord288Search.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecord288SearchPagedData.pageRanges.length; i++) {
                const customrecord288SearchPage = customrecord288SearchPagedData.fetch({ index: i })
                customrecord288SearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customrecord288SearchColInternalId)
                    const name = result.getValue(customrecord288SearchColName)

                    redemption = new EarnedRewards({
                        internalId: internalId,
                        type: 'redemption',
                        name: name,
                    })
                })
            }

            return redemption
        }

        findValidPointBalance(customerId) {
            let earnedPoints = 0
            const filters = [
                ['custrecord_iv_status', 'anyof', '2'],
                'AND',
                ['custrecord_iv_customer.entityid', 'is', customerId],
                'AND',
                ['custrecord_iv_point_expiry_date_time', 'onorafter', 'today'],
                'AND',
                ['isinactive', 'is', 'F'],
            ]

            const customrecord105SearchColEarnedPoints = search.createColumn({
                name: 'custrecord_iv_earned_points',
                summary: search.Summary.SUM,
            })
            const customrecord105Search = search.create({
                type: 'customrecord_iv_earned_rewards',
                filters,
                columns: [customrecord105SearchColEarnedPoints],
            })

            const customrecord105SearchPagedData = customrecord105Search.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecord105SearchPagedData.pageRanges.length; i++) {
                const customrecord105SearchPage = customrecord105SearchPagedData.fetch({ index: i })
                customrecord105SearchPage.data.forEach((result) => {
                    earnedPoints = result.getValue(customrecord105SearchColEarnedPoints)
                })
            }

            return earnedPoints
        }

        createRedemptionRecord({
            REDEEM_ITEM,
            REDEMPTION_POINTS,
            REDEMPTION_DATE_TIME,
            CUSTOMER_ID,
            SUBSIDIARY,
            LOCATION,
            CHANNEL,
            SOURCE_ID_FROM_POS,
            VENDOR,
            NAME,
        }) {
            const redemptionRecord = record.create({
                type: 'customrecord_iv_loyalty_point_redemption',
                isDynamic: true,
            })

            redemptionRecord.setValue('name', NAME)
            redemptionRecord.setValue('custrecord_iv_rr_customer', CUSTOMER_ID)
            redemptionRecord.setValue('custrecord_iv_redemption_points', REDEMPTION_POINTS)
            redemptionRecord.setValue('custrecord_iv_redeemed_item', REDEEM_ITEM)
            redemptionRecord.setText(
                'custrecord_iv_redemption_date',
                this.dateFormatter.dateStringToNetsuite(REDEMPTION_DATE_TIME || moment().toDate())
            )
            redemptionRecord.setValue('custrecord_iv_rr_subsidiary', SUBSIDIARY)
            redemptionRecord.setValue('custrecord_iv_rr_location', LOCATION)
            redemptionRecord.setValue('custrecord_iv_rr_channel', CHANNEL)
            redemptionRecord.setValue('custrecord_iv_source_id_from_pos', SOURCE_ID_FROM_POS)
            redemptionRecord.setValue('custrecord_iv_rr_vendor', VENDOR)

            return redemptionRecord.save()
        }

        createRewardRecord({
            REWARD_TYPE,
            REWARD_SCHEME,
            REWARD_CUSTOMER,
            REWARD_SUBSI,
            REWARD_LOCATION,
            REWARD_CHANNEL,
            REWARD_SOURCESO,
            REWARD_EARNEDPOINT,
            REWARD_ACQUIREDGIFT,
            REWARD_REDEEMPOINT,
            REWARD_REDEEMITEM,
            REWARD_REDEEMRECORD,
            REWARD_DATE_TIME,
            REWARD_PROVISION_DATE_TIME,
            REWARD_EXPIRY_DATE_TIME,
            REWARD_STATUS,
            REWARD_IS_EXPIRED,
            REWARD_OMNI_EN_MSG,
            REWARD_OMNI_TC_MSG,
            REWARD_OMNI_SC_MSG,
            REWARD_GIFTSO,
        }) {
            const earnedReward = record.create({
                type: 'customrecord_iv_earned_rewards',
                isDynamic: true,
            })

            earnedReward.setValue('custrecord_iv_reward_type', REWARD_TYPE)
            earnedReward.setValue('custrecord_iv_scheme', REWARD_SCHEME)
            earnedReward.setValue('custrecord_iv_customer', REWARD_CUSTOMER)
            earnedReward.setValue('custrecord_iv_subsidiary', REWARD_SUBSI)
            earnedReward.setValue('custrecord_iv_location', REWARD_LOCATION)
            if (!!REWARD_CHANNEL) earnedReward.setValue('custrecord_iv_channel', REWARD_CHANNEL)
            earnedReward.setValue('custrecord_iv_source_sales_order', REWARD_SOURCESO)
            earnedReward.setValue('custrecord_iv_earned_points', REWARD_EARNEDPOINT || 0)

            if (!!REWARD_GIFTSO) earnedReward.setValue('custrecord_iv_er_gift_so', REWARD_GIFTSO)
            earnedReward.setValue('custrecord_iv_acquired_gift', REWARD_ACQUIREDGIFT)
            earnedReward.setValue('custrecord_iv_redeem_points', REWARD_REDEEMPOINT)
            earnedReward.setValue('custrecord_iv_redemption_item', REWARD_REDEEMITEM)
            earnedReward.setValue('custrecord_iv_redemption_record', REWARD_REDEEMRECORD)
            earnedReward.setText(
                'custrecord_iv_earned_date_time',
                this.dateFormatter.dateTimeStringToNetsuite(REWARD_DATE_TIME)
            )
            earnedReward.setText(
                'custrecord_iv_provision_date_time',
                this.dateFormatter.dateTimeStringToNetsuite(REWARD_PROVISION_DATE_TIME)
            )
            if (!!REWARD_EXPIRY_DATE_TIME) {
                earnedReward.setText(
                    'custrecord_iv_point_expiry_date_time',
                    this.dateFormatter.dateStringToNetsuite(REWARD_EXPIRY_DATE_TIME)
                )
            }
            earnedReward.setValue('custrecord_iv_status', REWARD_STATUS)
            earnedReward.setValue('custrecord_iv_expired', REWARD_IS_EXPIRED || false)
            earnedReward.setValue('custrecord_iv_er_eng_omni_msg', REWARD_OMNI_EN_MSG)
            earnedReward.setValue('custrecord_iv_er_tchin_omni_msg', REWARD_OMNI_TC_MSG)
            earnedReward.setValue('custrecord_iv_er_schin_omni_msg', REWARD_OMNI_SC_MSG)

            return earnedReward.save()
        }

        getExpectedReward(transactionDetail, schemeDetail) {
            // will output data per scheme

            return
        }

        updateEarnedRecord(internalId, updatedBodyData, updateSublistData) {
            const earnedReward = record.load({
                type: 'customrecord_iv_earned_rewards',
                id: internalId,
            })
            if (updatedBodyData) {
                for (let data of updatedBodyData) {
                    log.debug('data', data)
                    // if (data.field === 'custrecord_iv_redemption_record' || data.field === 'custrecord_iv_redemption_item') {
                    //     earnedReward.setText(data.field, data.value)
                    // } else {
                    earnedReward.setValue(data.field, data.value)
                    // }
                }
            }
            if (updateSublistData) {
                for (let data of updateSublistData) {
                    earnedReward.setSublistValue(data.sublistId, data.field, data.line, data.value)
                }
            }
            return earnedReward.save()
        }

        updateRedemptionRecord(internalId, updatedBodyData, updateSublistData) {
            const redemptionRecord = record.load({
                type: 'customrecord_iv_loyalty_point_redemption',
                id: internalId,
            })
            if (updatedBodyData) {
                for (let data of updatedBodyData) {
                    redemptionRecord.setValue(data.field, data.value)
                }
            }
            if (updateSublistData) {
                for (let data of updateSublistData) {
                    redemptionRecord.setSublistValue(data.sublistId, data.field, data.line, data.value)
                }
            }
            return redemptionRecord.save()
        }

        findExpiredList() {
            const list = []

            const customrecordIvEarnedRewardsSearchFilters = [
                ['custrecord_iv_point_expiry_date_time', 'before', 'today'],
                'AND',
                ['custrecord_iv_expired', 'is', 'F'],
            ]

            const customrecordIvEarnedRewardsSearchColInternalId = search.createColumn({ name: 'internalid' })
            const customrecordIvEarnedRewardsSearchColPointExpiryDate = search.createColumn({
                name: 'custrecord_iv_point_expiry_date_time',
            })
            const customrecordIvEarnedRewardsSearchColExpired = search.createColumn({ name: 'custrecord_iv_expired' })
            const customrecordIvEarnedRewardsSearchColEarnedPoints = search.createColumn({
                name: 'custrecord_iv_earned_points',
            })

            const customrecordIvEarnedRewardsSearch = search.create({
                type: 'customrecord_iv_earned_rewards',
                filters: customrecordIvEarnedRewardsSearchFilters,
                columns: [
                    customrecordIvEarnedRewardsSearchColInternalId,
                    customrecordIvEarnedRewardsSearchColPointExpiryDate,
                    customrecordIvEarnedRewardsSearchColExpired,
                    customrecordIvEarnedRewardsSearchColEarnedPoints,
                ],
            })

            const customrecordIvEarnedRewardsSearchPagedData = customrecordIvEarnedRewardsSearch.runPaged({
                pageSize: 1000,
            })
            for (let i = 0; i < customrecordIvEarnedRewardsSearchPagedData.pageRanges.length; i++) {
                const customrecordIvEarnedRewardsSearchPage = customrecordIvEarnedRewardsSearchPagedData.fetch({
                    index: i,
                })
                customrecordIvEarnedRewardsSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customrecordIvEarnedRewardsSearchColInternalId)
                    const pointExpiryDate = result.getValue(customrecordIvEarnedRewardsSearchColPointExpiryDate)
                    const expired = result.getValue(customrecordIvEarnedRewardsSearchColExpired)
                    const earnedPoints = result.getValue(customrecordIvEarnedRewardsSearchColEarnedPoints)

                    list.push(
                        new EarnedRewards({
                            internalId,
                            type: 'earned',
                            pointExpiryDate: this.dateFormatter.dateStringToInputFormat(pointExpiryDate),
                            expired,
                            earnedPoints,
                        })
                    )
                })
            }

            return list
        }

        update(internalId, bodyFields) {
            const recordType = 'customrecord_iv_earned_rewards'

            const recordObj = record.load({ type: recordType, id: internalId })

            for (let bodyField of bodyFields) {
                const { field, value, valueType } = bodyField
                if (valueType === 'value') recordObj.setValue({ fieldId: field, value })
                else if (valueType === 'text') recordObj.setText({ fieldId: field, text: value })
            }

            return recordObj.save()
        }

        getCount() {
            const customrecord288SearchObj = search.create({
                type: 'customrecord_iv_loyalty_point_redemption',
                filters: [],
                columns: ['internalid'],
            })
            return customrecord288SearchObj.runPaged().count
        }

        findWithInSixMonthsRecordsByCustomer({ firstName, lastName, internalId }) {
            const list = []

            const customrecordIvEarnedRewardsSearchFilters = [
                ['custrecord_iv_provision_date_time', 'within', 'monthsago6', 'daysago0'],
            ]
            log.debug('CheckInternalId', internalId)
            var reward_schemeSearchObj = search
                .create({
                    type: 'customrecord_iv_reward_scheme',
                    filters: [
                        ['custrecord_iv_subtype', 'anyof', '2'], //2 = Subtype is New Member
                        'AND',
                        ['isinactive', 'is', 'F'],
                    ],
                    columns: [
                        search.createColumn({
                            name: 'name',
                            sort: search.Sort.ASC,
                        }),
                        'scriptid',
                        'custrecord_iv_applicable_tier',
                        'custrecord_iv_scheme_description',
                        'custrecord_iv_rs_reward_type',
                    ],
                })
                .run()
                .getRange({ start: 0, end: 1000 })
            let newMemScheme = []
            for (let scheme of reward_schemeSearchObj) {
                newMemScheme.push(scheme.id)
            }

            if (internalId)
                customrecordIvEarnedRewardsSearchFilters.push('AND', ['custrecord_iv_customer', 'anyof', internalId])

            customrecordIvEarnedRewardsSearchFilters.push('AND', ['custrecord_iv_scheme', 'anyof', newMemScheme])
            const customrecordIvEarnedRewardsSearchColInternalId = search.createColumn({ name: 'internalid' })
            const customrecordIvEarnedRewardsSearchColName = search.createColumn({
                name: 'name',
                sort: search.Sort.ASC,
            })
            const customrecordIvEarnedRewardsSearchColProvisionDateTime = search.createColumn({
                name: 'custrecord_iv_provision_date_time',
            })
            const customrecordIvEarnedRewardsSearchColCustomer = search.createColumn({ name: 'custrecord_iv_customer' })

            const customrecordIvEarnedRewardsSearch = search.create({
                type: 'customrecord_iv_earned_rewards',
                filters: customrecordIvEarnedRewardsSearchFilters,
                columns: [
                    customrecordIvEarnedRewardsSearchColInternalId,
                    customrecordIvEarnedRewardsSearchColName,
                    customrecordIvEarnedRewardsSearchColProvisionDateTime,
                    customrecordIvEarnedRewardsSearchColCustomer,
                ],
            })

            const customrecordIvEarnedRewardsSearchPagedData = customrecordIvEarnedRewardsSearch.runPaged({
                pageSize: 1000,
            })
            for (let i = 0; i < customrecordIvEarnedRewardsSearchPagedData.pageRanges.length; i++) {
                const customrecordIvEarnedRewardsSearchPage = customrecordIvEarnedRewardsSearchPagedData.fetch({
                    index: i,
                })
                customrecordIvEarnedRewardsSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customrecordIvEarnedRewardsSearchColInternalId)
                    const name = result.getValue(customrecordIvEarnedRewardsSearchColName)
                    const provisionDateTime = result.getValue(customrecordIvEarnedRewardsSearchColProvisionDateTime)
                    const customer = result.getValue(customrecordIvEarnedRewardsSearchColCustomer)

                    list.push(new EarnedRewards({ internalId, name, provisionDateTime, customer }))
                })
            }
            log.debug('filters', customrecordIvEarnedRewardsSearchFilters)
            log.debug('lwelcomeGiftist', list)
            return list
        }

        getAll() {}
    }

    return EarnedRewardsDAO
})
