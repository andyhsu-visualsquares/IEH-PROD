/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['./IRewardAction', './SuiteletCreateReward', '../../DAO/SalesOrderDAO', '../../../utils/EncryptUtils'], (
    IRewardAction,
    SuiteletCreateReward,
    SalesOrderDAO,
    EncryptUtils
) => {
    class EarnAction extends IRewardAction {
        execute() {
            const so = this.searchSOByTransId()
            log.debug("SO", so)
            return so.length > 0
                ? new SuiteletCreateReward(so[0].INTERNAL_ID, so[0].TYPE, this.info.WELCOME_GIFT_DATE).create()
                : null
        }

        searchSOByTransId() {
            const encryptUtils = new EncryptUtils()
            const encryptedId = this.info.TRANS_ID
            const decryptedId = encryptUtils.decryptTranId(encryptedId)
            return new SalesOrderDAO().findByTransId(decryptedId)
        }
    }
    return EarnAction
})
