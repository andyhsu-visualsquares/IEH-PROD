/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/search', '../Entity/ClassType'], (search, ClassType) => {
    class ClassTypeDAO {
        findAll() {
            const list = []

            const classificationSearchColName = search.createColumn({ name: 'name', sort: search.Sort.ASC })
            const classificationSearchColPosMainCate = search.createColumn({ name: 'custrecordposmaincate' })
            const classificationSearchColPosSubCate = search.createColumn({ name: 'custrecordpossubcate' })
            const classificationSearchColCutOffTime = search.createColumn({ name: 'custrecordcutofftime' })
            const classificationSearchColInactive = search.createColumn({ name: 'isinactive' })
            const classificationSearchColInternalId = search.createColumn({ name: 'internalid' })
            const classificationSearchColSubsidiary = search.createColumn({ name: 'subsidiary' })
            const classificationSearchColeVoucher = search.createColumn({ name: 'custrecord_evoucher' })
            const classificationSearch = search.create({
                type: 'classification',
                filters: [['custrecord_evoucher', 'is', 'T'], 'AND', ['isinactive', 'is', 'F']],
                columns: [
                    classificationSearchColName,
                    classificationSearchColPosMainCate,
                    classificationSearchColPosSubCate,
                    classificationSearchColCutOffTime,
                    classificationSearchColInactive,
                    classificationSearchColInternalId,
                    classificationSearchColSubsidiary,
                    classificationSearchColeVoucher,
                ],
            })

            const classificationSearchPagedData = classificationSearch.runPaged({ pageSize: 1000 })
            for (let i = 0; i < classificationSearchPagedData.pageRanges.length; i++) {
                const classificationSearchPage = classificationSearchPagedData.fetch({ index: i })
                classificationSearchPage.data.forEach((result) => {
                    const name = result.getValue(classificationSearchColName)
                    const posMainCate = result.getValue(classificationSearchColPosMainCate)
                    const posSubCate = result.getValue(classificationSearchColPosSubCate)
                    const cutOffTime = result.getValue(classificationSearchColCutOffTime)
                    const inactive = result.getValue(classificationSearchColInactive)
                    const internalId = result.getValue(classificationSearchColInternalId)
                    const subsidiaries = result.getValue(classificationSearchColSubsidiary)
                    const eVoucher = result.getValue(classificationSearchColeVoucher)

                    list.push(
                        new ClassType({
                            name,
                            posMainCate,
                            posSubCate,
                            cutOffTime,
                            inactive,
                            internalId,
                            subsidiaries,
                            eVoucher,
                        })
                    )
                })
            }

            return list
        }
    }

    return ClassTypeDAO
})
