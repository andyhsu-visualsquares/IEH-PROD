/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class ScriptError {
        constructor(data) {
            this.internalId = data.internalId
            this.dateCreated = data.dateCreated
            this.lastModified = data.lastModified
            this.lastModifiedBy = data.lastModifiedBy
            this.status = data.status
            this.errorTransaction = data.errorTransaction
            this.errorMessage = data.errorMessage
            this.errorRecordType = data.errorRecordType
            this.errorScript = data.errorScript
            this.errorCode = data.errorCode
            this.errorOccurTime = data.errorOccurTime
            this.errorLastUpdateTime = data.errorLastUpdateTime
        }
    }

    return ScriptError
})
