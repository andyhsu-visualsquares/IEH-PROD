/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../Entity/IntegrationMapping', 'N/search'], (IntegrationMapping, search) => {
    class MembershipTypeDAO {
        constructor() { }

        findLocationIdByPOSID(posId) {
            let mapping = null
            const customrecordintegrationlibSearchColName = search.createColumn({ name: 'name', sort: search.Sort.ASC })
            const customrecordintegrationlibSearchColPosid = search.createColumn({
                name: 'custrecordintegrationlibposid',
            })
            const customrecordintegrationlibSearchColNsId = search.createColumn({
                name: 'custrecordintegrationlibnsid',
            })

            const customrecordintegrationlibSearch = search.create({
                type: 'customrecordintegrationlib',
                filters: [
                    ['custrecordintegrationlibposid', 'equalto', posId],
                    'AND',
                    ['name', 'haskeywords', 'location'],
                ],
                columns: [
                    customrecordintegrationlibSearchColName,
                    customrecordintegrationlibSearchColPosid,
                    customrecordintegrationlibSearchColNsId,
                ],
            })

            const customrecordintegrationlibSearchPagedData = customrecordintegrationlibSearch.runPaged({
                pageSize: 1000,
            })
            for (let i = 0; i < customrecordintegrationlibSearchPagedData.pageRanges.length; i++) {
                const customrecordintegrationlibSearchPage = customrecordintegrationlibSearchPagedData.fetch({
                    index: i,
                })
                customrecordintegrationlibSearchPage.data.forEach((result) => {
                    const name = result.getValue(customrecordintegrationlibSearchColName)
                    const posId = result.getValue(customrecordintegrationlibSearchColPosid)
                    const nsId = result.getValue(customrecordintegrationlibSearchColNsId)

                    mapping = new IntegrationMapping({ TYPE: name, NS_ID: nsId, POS_ID: posId })
                })
            }

            return mapping
        }

        findChannelIdByPOSID(posId) {
            let mapping = null
            const customrecordintegrationlibSearchColName = search.createColumn({ name: 'name', sort: search.Sort.ASC })
            const customrecordintegrationlibSearchColPosid = search.createColumn({
                name: 'custrecordintegrationlibposid',
            })
            const customrecordintegrationlibSearchColNsId = search.createColumn({
                name: 'custrecordintegrationlibnsid',
            })

            const customrecordintegrationlibSearch = search.create({
                type: 'customrecordintegrationlib',
                filters: [
                    ['custrecordintegrationlibposid', 'equalto', posId],
                    'AND',
                    ['name', 'haskeywords', 'channel'],
                ],
                columns: [
                    customrecordintegrationlibSearchColName,
                    customrecordintegrationlibSearchColPosid,
                    customrecordintegrationlibSearchColNsId,
                ],
            })

            const customrecordintegrationlibSearchPagedData = customrecordintegrationlibSearch.runPaged({
                pageSize: 1000,
            })
            for (let i = 0; i < customrecordintegrationlibSearchPagedData.pageRanges.length; i++) {
                const customrecordintegrationlibSearchPage = customrecordintegrationlibSearchPagedData.fetch({
                    index: i,
                })
                customrecordintegrationlibSearchPage.data.forEach((result) => {
                    const name = result.getValue(customrecordintegrationlibSearchColName)
                    const posid = result.getValue(customrecordintegrationlibSearchColPosid)
                    const nsId = result.getValue(customrecordintegrationlibSearchColNsId)

                    mapping = new IntegrationMapping({ TYPE: name, NS_ID: nsId, POS_ID: posid })
                })
            }

            return mapping
        }

        findEncryptionKey() {
            var customrecord_iv_encrypt_keySearchResult = search.create({
                type: "customrecord_iv_encrypt_key",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_iv_encrypt_key", "isnotempty", ""]
                    ],
                columns:
                    [
                        "scriptid",
                        "custrecord_iv_encrypt_key"
                    ]
            }).run().getRange({ start: 0, end: 1000 })[0];
            return customrecord_iv_encrypt_keySearchResult.getValue("custrecord_iv_encrypt_key")
        }

        getAll() { }
    }

    return MembershipTypeDAO
})
