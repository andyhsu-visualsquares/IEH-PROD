/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    class IRewardAction {
        constructor(info) {
            this.info = info
        }

        execute() {
            throw new Error('execute method should be implemented in derived class')
        }
    }
    return IRewardAction
})
