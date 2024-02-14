/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/search', '../Entity/ConfigurationTable'], (search, ConfigurationTable) => {
    class ConfigurationTableDAO {
        findAll() {
            let config = null

            const customrecord_iv_encrypt_keySearchColInternalId = search.createColumn({ name: 'internalid' })
            const customrecord_iv_encrypt_keySearchColKey = search.createColumn({ name: 'custrecord_iv_encrypt_key' })
            const customrecord_iv_encrypt_keySearchColEshopAutoFulfilment = search.createColumn({
                name: 'custrecord_iv_eshop_auto_fulfil_config',
            })

            const customrecord_iv_encrypt_keySearch = search.create({
                type: 'customrecord_iv_encrypt_key',
                filters: [['isinactive', 'is', 'F']],
                columns: [
                    customrecord_iv_encrypt_keySearchColInternalId,
                    customrecord_iv_encrypt_keySearchColKey,
                    customrecord_iv_encrypt_keySearchColEshopAutoFulfilment,
                ],
            })

            const customrecord_iv_encrypt_keySearchPagedData = customrecord_iv_encrypt_keySearch.runPaged({
                pageSize: 1000,
            })
            for (let i = 0; i < customrecord_iv_encrypt_keySearchPagedData.pageRanges.length; i++) {
                const customrecord_iv_encrypt_keySearchPage = customrecord_iv_encrypt_keySearchPagedData.fetch({
                    index: i,
                })
                customrecord_iv_encrypt_keySearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customrecord_iv_encrypt_keySearchColInternalId)
                    const key = result.getValue(customrecord_iv_encrypt_keySearchColKey)
                    const eShopAutoFulfilment = result.getValue(customrecord_iv_encrypt_keySearchColEshopAutoFulfilment)

                    config = new ConfigurationTable({ internalId, key, eShopAutoFulfilment })
                })
            }

            return config
        }
    }
    return ConfigurationTableDAO
})
