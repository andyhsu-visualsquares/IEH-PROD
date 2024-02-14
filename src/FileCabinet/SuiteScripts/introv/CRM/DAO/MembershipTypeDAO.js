/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../Entity/MembershipType', 'N/search'], (MembershipType, search) => {
    class MembershipTypeDAO {
        constructor() { }

        findByTier(tierName) {
            let membershipType = null

            const customrecord94SearchColName = search.createColumn({ name: 'name', sort: search.Sort.ASC })
            const customrecord94SearchColSpendingToExclusive = search.createColumn({
                // name: 'custrecord_iv_spending_to',
                name: 'custrecord_iv_spending_omni',
            })
            const customrecord94SearchColNameAvailableTier = search.createColumn({
                name: 'custrecord_iv_available_tiers_omni',
            })
            const customrecord94SearchColNameNextTier = search.createColumn({
                name: 'custrecord_iv_next_tier_omni',
            })
            const customrecord94SearchColNameCumulativeSpendingPeriod = search.createColumn({
                name: 'custrecord_iv_cumulative_spending_period',
            })
            const customrecord94SearchColNameSEQ = search.createColumn({
                name: 'custrecord_iv_sequence',
            })
            const customrecord94SearchColNameMaintain = search.createColumn({
                name: 'custrecord_iv_maintain',
            })
            const customrecord94SearchColNameTopTier = search.createColumn({
                name: 'custrecord_iv_top_tier',
            })
            log.audit("tierNameCHECKJ", tierName)
            const customrecord94Search = search.create({
                type: 'customrecord_iv_membership_tiers',
                filters: [['name', 'is', tierName]],
                columns: [
                    customrecord94SearchColName,
                    customrecord94SearchColSpendingToExclusive,
                    customrecord94SearchColNameAvailableTier,
                    customrecord94SearchColNameNextTier,
                    customrecord94SearchColNameCumulativeSpendingPeriod,
                    customrecord94SearchColNameSEQ,
                    customrecord94SearchColNameMaintain,
                    customrecord94SearchColNameTopTier,
                ],
            })

            const customrecord94SearchPagedData = customrecord94Search.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecord94SearchPagedData.pageRanges.length; i++) {
                const customrecord94SearchPage = customrecord94SearchPagedData.fetch({ index: i })
                customrecord94SearchPage.data.forEach((result) => {
                    const name = result.getValue(customrecord94SearchColName)
                    const spendingToExclusive = result.getValue(customrecord94SearchColSpendingToExclusive)
                    const availableTier = result.getText(customrecord94SearchColNameAvailableTier)
                    const nextTier = result.getText(customrecord94SearchColNameNextTier)
                    const cumulativeSpendingPeriod = result.getValue(
                        customrecord94SearchColNameCumulativeSpendingPeriod
                    )
                    const tierSEQ = result.getValue(customrecord94SearchColNameSEQ)
                    const maintain = result.getValue(customrecord94SearchColNameMaintain)
                    const topTier = result.getValue(customrecord94SearchColNameTopTier)

                    membershipType = new MembershipType({
                        MEMBERSHIP_TYPE: name,
                        SPENDING_TO: parseInt(spendingToExclusive) || null,
                        SPENDING_SENTENCE: 0,
                        AVAILABLE_TIER: availableTier.split(','),
                        NEXT_TIER: nextTier,
                        CUMULATIVE_SPENDING_PERIOD: cumulativeSpendingPeriod,
                        TIER_ID: tierSEQ,
                        MAINTAIN: maintain,
                        TOP_TIER: topTier,
                    })
                })
            }
            let mappedAvailableTier = []
            if (membershipType.AVAILABLE_TIER.length > 0) {
                for (let memType of membershipType.AVAILABLE_TIER) {
                    const customrecordTierSearchResult = search
                        .create({
                            type: 'customrecord_iv_membership_tiers',
                            filters: [['name', 'is', memType]],
                            columns: ['custrecord_iv_sequence'],
                        })
                        .run()
                        .getRange({ start: 0, end: 1000 })
                    if (customrecordTierSearchResult.length > 0)
                        mappedAvailableTier.push(
                            customrecordTierSearchResult[0].getValue('custrecord_iv_sequence') || memType
                        )
                }
                membershipType.AVAILABLE_TIER = mappedAvailableTier
            }

            return membershipType
        }

        findNameById(id) {
            let typeName = {}
            const customrecord_iv_membership_tiersSearchColNameInEnglish = search.createColumn({
                name: 'custrecord_iv_english_name',
            })
            const customrecord_iv_membership_tiersSearchColNameInSimplifiedChinese = search.createColumn({
                name: 'custrecord_iv_schinese_name',
            })
            const customrecord_iv_membership_tiersSearchColNameInTraditionalChinese = search.createColumn({
                name: 'custrecord_iv_tchinese_name',
            })
            const customrecord_iv_membership_tiersSearchColName = search.createColumn({
                name: 'name',
                sort: search.Sort.ASC,
            })
            const customrecord_iv_membership_tiersSearch = search.create({
                type: 'customrecord_iv_membership_tiers',
                filters: [['internalid', 'anyof', id]],
                columns: [
                    customrecord_iv_membership_tiersSearchColNameInEnglish,
                    customrecord_iv_membership_tiersSearchColNameInSimplifiedChinese,
                    customrecord_iv_membership_tiersSearchColNameInTraditionalChinese,
                    customrecord_iv_membership_tiersSearchColName,
                ],
            })

            const customrecord_iv_membership_tiersSearchPagedData = customrecord_iv_membership_tiersSearch.runPaged({
                pageSize: 1000,
            })
            for (let i = 0; i < customrecord_iv_membership_tiersSearchPagedData.pageRanges.length; i++) {
                const customrecord_iv_membership_tiersSearchPage =
                    customrecord_iv_membership_tiersSearchPagedData.fetch({ index: i })
                customrecord_iv_membership_tiersSearchPage.data.forEach((result) => {
                    const nameInEnglish = result.getValue(customrecord_iv_membership_tiersSearchColNameInEnglish)
                    const nameInSimplifiedChinese = result.getValue(
                        customrecord_iv_membership_tiersSearchColNameInSimplifiedChinese
                    )
                    const nameInTraditionalChinese = result.getValue(
                        customrecord_iv_membership_tiersSearchColNameInTraditionalChinese
                    )
                    const name = result.getValue(customrecord_iv_membership_tiersSearchColName)

                    typeName.EN = nameInEnglish || name || ''
                    typeName.SC = nameInSimplifiedChinese || ''
                    typeName.TC = nameInTraditionalChinese || ''
                })
            }

            return typeName
        }

        getAll() { }
    }

    return MembershipTypeDAO
})
