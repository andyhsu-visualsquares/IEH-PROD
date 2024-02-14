/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class ClassType {
        constructor(data) {
            this.name = data.name
            this.internalId = data.internalId
            this.isInactive = data.isInactive
            this.parentClass = data.parentClass
            this.subsidiaries = data.subsidiaries
            this.includeChildren = data.includeChildren
            this.posMainCate = data.posMainCate
            this.posSubCate = data.posSubCate
            this.eVoucher = data.eVoucher
            this.cutOffTime = data.cutOffTime
        }
    }

    return ClassType
})
