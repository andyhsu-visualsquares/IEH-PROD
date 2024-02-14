/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/record', 'N/search', '../Entity/RedemptionStaging'], (record, search, RedemptionStaging) => {
    class RedemptionStagingDAO {
        create(name, info, redemptionRewardID) {
            const redemptionStagingRecord = record.create({
                type: 'customrecord_iv_redemption_staging',
                isDynamic: true,
            })

            redemptionStagingRecord.setValue('name', name)
            redemptionStagingRecord.setValue('custrecord_iv_rdpt_staging_info', info)
            redemptionStagingRecord.setValue('custrecord_iv_rdpt_staging_rdpt_id', redemptionRewardID)

            return redemptionStagingRecord.save()
        }

        findNonFinishRedemptionStagingList() {
            const list = []

            const customrecord_iv_redemption_stagingSearchColInternalId = search.createColumn({ name: 'internalid' })
            const customrecord_iv_redemption_stagingSearchColName = search.createColumn({
                name: 'name',
            })
            const customrecord_iv_redemption_stagingSearchColCreated = search.createColumn({
                name: 'created',
                sort: search.Sort.ASC
            })
            const customrecord_iv_redemption_stagingSearchColInfo = search.createColumn({
                name: 'custrecord_iv_rdpt_staging_info',
            })
            const customrecord_iv_redemption_stagingSearchColRedemptionRewardId = search.createColumn({
                name: 'custrecord_iv_rdpt_staging_rdpt_id',
            })
            const customrecord_iv_redemption_stagingSearch = search.create({
                type: 'customrecord_iv_redemption_staging',
                filters: [['isinactive', 'is', 'F'], 'AND', ['custrecord_iv_rdpt_staging_status', 'anyof', '1', '3']],
                columns: [
                    customrecord_iv_redemption_stagingSearchColInternalId,
                    customrecord_iv_redemption_stagingSearchColName,
                    customrecord_iv_redemption_stagingSearchColInfo,
                    customrecord_iv_redemption_stagingSearchColRedemptionRewardId,
                    customrecord_iv_redemption_stagingSearchColCreated
                ],
            })

            const customrecord_iv_redemption_stagingSearchPagedData = customrecord_iv_redemption_stagingSearch.runPaged(
                { pageSize: 1000 }
            )
            for (let i = 0; i < customrecord_iv_redemption_stagingSearchPagedData.pageRanges.length; i++) {
                const customrecord_iv_redemption_stagingSearchPage =
                    customrecord_iv_redemption_stagingSearchPagedData.fetch({ index: i })
                customrecord_iv_redemption_stagingSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customrecord_iv_redemption_stagingSearchColInternalId)
                    const name = result.getValue(customrecord_iv_redemption_stagingSearchColName)
                    const info = result.getValue(customrecord_iv_redemption_stagingSearchColInfo)
                    const redemptionRewardId = result.getValue(
                        customrecord_iv_redemption_stagingSearchColRedemptionRewardId
                    )

                    log.debug(
                        'findNonFinishRedemptionStagingList',
                        JSON.stringify({ internalId, name, info, redemptionRewardId })
                    )
                    list.push(new RedemptionStaging({ internalId, name, info, redemptionRewardId }))
                })
            }

            return list
        }

        updateStagingStatus(internalId, status) {
            record.submitFields({
                type: 'customrecord_iv_redemption_staging',
                id: internalId,
                values: { custrecord_iv_rdpt_staging_status: status },
            })
        }

        updateErrorMessage(internalId, error) {
            record.submitFields({
                type: 'customrecord_iv_redemption_staging',
                id: internalId,
                values: { custrecord_iv_rdpt_staging_error_message: error },
            })
        }
    }

    return RedemptionStagingDAO
})
