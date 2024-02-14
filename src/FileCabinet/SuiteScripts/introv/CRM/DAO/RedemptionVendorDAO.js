/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../Entity/RedemptionVendor', 'N/search', 'N/record', '../Constants/Constants'], (
    RedemptionVendor,
    search,
    record,
    Constants
) => {
    class RedemptionVendorDAO {
        constructor() {}

        findByName(name) {
            let redemptionVendor = null

            const redemptionVendorRecord = record.load({
                type: Constants.RECORD.REDEMPTION_VENDOR_LIST.TYPE,
                id: Constants.RECORD.REDEMPTION_VENDOR_LIST.ID,
            })

            const vendorCount = redemptionVendorRecord.getLineCount('customvalue')
            for (let i = 0; i < vendorCount; i++) {
                const NAME = redemptionVendorRecord.getSublistValue('customvalue', 'value', i)
                const INTERNAL_ID = redemptionVendorRecord.getSublistValue('customvalue', 'valueid', i).toString()

                if (NAME === name) redemptionVendor = new RedemptionVendor({ NAME, INTERNAL_ID })
            }

            return redemptionVendor
        }

        getAll() {}
    }

    return RedemptionVendorDAO
})
