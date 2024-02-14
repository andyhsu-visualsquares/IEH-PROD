/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/search', '../Entity/Channel', 'N/record', '../../lib/Time/moment', 'N/config'], (
    search,
    Channel,
    record,
    moment,
    config
) => {
    class ChannelDAO {
        constructor() {}

        findByNameAndParent(name, parent) {
            let channel = null

            const customrecord_cseg1SearchColInternalId = search.createColumn({ name: 'internalid' })
            const customrecord_cseg1SearchColName = search.createColumn({ name: 'name', sort: search.Sort.ASC })
            const customrecord_cseg1SearchColRelatedLocation = search.createColumn({ name: 'custrecord1' })
            const customrecord_cseg1SearchColParent = search.createColumn({ name: 'parent' })
            const customrecord_cseg1SearchColPosId = search.createColumn({ name: 'custrecordchannelposid' })

            const customrecord_cseg1Search = search.create({
                type: 'customrecord_cseg1',
                filters: [['name', 'is', name]],
                columns: [
                    customrecord_cseg1SearchColInternalId,
                    customrecord_cseg1SearchColName,
                    customrecord_cseg1SearchColRelatedLocation,
                    customrecord_cseg1SearchColParent,
                    customrecord_cseg1SearchColPosId,
                ],
            })

            const customrecord_cseg1SearchPagedData = customrecord_cseg1Search.runPaged({ pageSize: 1000 })
            for (let i = 0; i < customrecord_cseg1SearchPagedData.pageRanges.length; i++) {
                const customrecord_cseg1SearchPage = customrecord_cseg1SearchPagedData.fetch({ index: i })
                customrecord_cseg1SearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customrecord_cseg1SearchColInternalId)
                    const name = result.getValue(customrecord_cseg1SearchColName)
                    const relatedLocation = result.getValue(customrecord_cseg1SearchColRelatedLocation)
                    const parent_result = result.getText(customrecord_cseg1SearchColParent)
                    const posId = result.getValue(customrecord_cseg1SearchColPosId)

                    log.debug(
                        'channel result',
                        JSON.stringify({
                            internalId,
                            name,
                            relatedLocation,
                            parent_result,
                            posId,
                        })
                    )

                    if (parent_result === parent)
                        channel = new Channel({ internalId, name, relatedLocation, posId, parent: parent_result })
                })
            }

            return channel
        }

        getAll() {}
    }

    return ChannelDAO
})
