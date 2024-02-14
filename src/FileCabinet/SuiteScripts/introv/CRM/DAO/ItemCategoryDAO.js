/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../Entity/ItemCategory', 'N/search', 'N/record', '../Constants/Constants'], (
    ItemCategory,
    search,
    record,
    Constants
) => {
    class ItemCategoryDAO {
        constructor() {}

        findByNames(names = []) {
            const itemCategories = []

            const allItemCategories = this.getAll()

            for (let itemCategory of allItemCategories) {
                if (names.includes(itemCategory.NAME)) itemCategories.push(itemCategory)
            }

            return itemCategories
        }

        findByInternalIds(internalIds = []) {
            const categories = []

            const allItemCategories = this.getAll()

            for (let itemCategory of allItemCategories) {
                if (internalIds.includes(itemCategory.INTERNAL_ID)) categories.push(itemCategory)
            }

            return categories
        }

        getAll() {
            const itemCategories = []

            const itemCategoryRecord = record.load({
                type: Constants.RECORD.ITEM_CATEGORY_LIST.TYPE,
                id: Constants.RECORD.ITEM_CATEGORY_LIST.ID,
            })

            const vendorCount = itemCategoryRecord.getLineCount('customvalue')
            for (let i = 0; i < vendorCount; i++) {
                const NAME = itemCategoryRecord.getSublistValue('customvalue', 'value', i)
                const INTERNAL_ID = itemCategoryRecord.getSublistValue('customvalue', 'valueid', i).toString()

                itemCategories.push(new ItemCategory({ NAME, INTERNAL_ID }))
            }

            return itemCategories
        }
    }

    return ItemCategoryDAO
})
