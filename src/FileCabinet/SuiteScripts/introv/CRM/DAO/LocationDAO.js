/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/search', '../Entity/Location'], (search, Location) => {
    class LocationDAO {
        constructor() {}

        findByName(name) {
            let location = null

            const locationSearchColInternalId = search.createColumn({ name: 'internalid' })
            const locationSearchColName = search.createColumn({ name: 'name', sort: search.Sort.ASC })
            const locationSearchColPosid = search.createColumn({ name: 'custrecordlocationposid' })
            const locationSearchColRelatedChannel = search.createColumn({ name: 'custrecordlocationrelatedchannel' })
            const locationSearchColLocationType = search.createColumn({ name: 'locationtype' })
            const locationSearchColSubsidiary = search.createColumn({ name: 'subsidiary' })
            const locationSearchColSpoilageLocation = search.createColumn({ name: 'custrecordspoliage' })

            const locationSearch = search.create({
                type: 'location',
                filters: [['name', 'is', name]],
                columns: [
                    locationSearchColInternalId,
                    locationSearchColName,
                    locationSearchColPosid,
                    locationSearchColRelatedChannel,
                    locationSearchColLocationType,
                    locationSearchColSubsidiary,
                    locationSearchColSpoilageLocation,
                ],
            })

            const locationSearchPagedData = locationSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < locationSearchPagedData.pageRanges.length; i++) {
                const locationSearchPage = locationSearchPagedData.fetch({ index: i })
                locationSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(locationSearchColInternalId)
                    const name = result.getValue(locationSearchColName)
                    const posID = result.getValue(locationSearchColPosid)
                    const relatedChannel = result.getValue(locationSearchColRelatedChannel)
                    const locationType = result.getValue(locationSearchColLocationType)
                    const subsidiary = result.getValue(locationSearchColSubsidiary)
                    const spoilageLocation = result.getValue(locationSearchColSpoilageLocation)

                    location = new Location({
                        internalId,
                        name,
                        posID,
                        relatedChannel,
                        type: locationType,
                        subsidiary,
                        spoilageLocation,
                    })
                })
            }

            return location
        }

        getAll() {}
    }

    return LocationDAO
})
