/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../Entity/Subsidiary', 'N/search'], (Subsidiary, search) => {
    class MembershipTypeDAO {
        constructor() {}

        findByName(name) {
            let targetSubsidiary = new Subsidiary({})
            const subsidiaries = this.getAll()
            for (let subsidiary of subsidiaries) {
                if (subsidiary.NAME === name) {
                    targetSubsidiary = subsidiary
                }
            }
            return targetSubsidiary
        }

        getAll() {
            const subsidiaryList = []

            const subsidiarySearchColNameNoHierarchy = search.createColumn({ name: 'namenohierarchy' })
            const subsidiarySearchColInternalId = search.createColumn({ name: 'internalid' })
            const subsidiarySearchColCountry = search.createColumn({ name: 'country' })
            const subsidiarySearchColCurrency = search.createColumn({ name: 'currency' })
            const subsidiarySearchColLanguage = search.createColumn({ name: 'language' })
            const subsidiarySearchColAddress = search.createColumn({ name: 'address', join: 'address' })

            const subsidiarySearch = search.create({
                type: 'subsidiary',
                filters: [],
                columns: [
                    subsidiarySearchColNameNoHierarchy,
                    subsidiarySearchColInternalId,
                    subsidiarySearchColCountry,
                    subsidiarySearchColCurrency,
                    subsidiarySearchColLanguage,
                    subsidiarySearchColAddress,
                ],
            })

            const subsidiarySearchPagedData = subsidiarySearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < subsidiarySearchPagedData.pageRanges.length; i++) {
                const subsidiarySearchPage = subsidiarySearchPagedData.fetch({ index: i })
                subsidiarySearchPage.data.forEach((result) => {
                    const nameNoHierarchy = result.getValue(subsidiarySearchColNameNoHierarchy)
                    const internalId = result.getValue(subsidiarySearchColInternalId)
                    const country = result.getValue(subsidiarySearchColCountry)
                    const currency = result.getValue(subsidiarySearchColCurrency)
                    const language = result.getValue(subsidiarySearchColLanguage)
                    const address = result.getValue(subsidiarySearchColAddress)

                    subsidiaryList.push(
                        new Subsidiary({
                            NAME: nameNoHierarchy,
                            INTERNAL_ID: internalId,
                            COUNTRY: country,
                            CURRENCY: currency,
                            LANGUAGE: language,
                            ADDRESS: address,
                        })
                    )
                })
            }

            return subsidiaryList
        }
    }

    return MembershipTypeDAO
})
