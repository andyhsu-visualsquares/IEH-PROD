/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([
    '../Repository/RewardActions/RewardActionFactory',
    '../DAO/RedemptionStagingDAO',
    '../../utils/DateUtils',
    '../DAO/EarnedRewardsDAO',
    '../DAO/ItemDAO',
    '../DAO/InventoryNumberDAO',
    '../DAO/RedeemCodeMasterDAO',
    '../DAO/ClassTypeDAO',
    'N/record',
    '../../lib/Time/moment-timezone',
    '../../lib/lodash',
], (
    RewardActionFactory,
    RedemptionStagingDAO,
    DateUtils,
    EarnedRewardsDAO,
    ItemDAO,
    InventoryNumberDAO,
    RedeemCodeMasterDAO,
    ClassTypeDAO,
    record,
    moment,
    _
) => {
    class RedemptionStagingWorkflowServices {
        constructor() {
            this.action = null
            this.internalId = null
            this.soID = null
            this.redeemCodeList = null
            this.fulfilmentId = null
            this.redeemCodeMasterInternalId = null
        }

        setInternalId(internalId) {
            this.internalId = internalId
        }

        findNonFinishRedemptionStagingList() {
            return new RedemptionStagingDAO().findNonFinishRedemptionStagingList()
        }

        initAction(mode, info) {
            this.action = new RewardActionFactory(mode, info).getRewardActionByMode()
            this.soID = null
            this.redeemCodeList = null
            this.fulfilmentId = null
            this.redeemCodeMasterInternalId = null
            log.debug('initAction info', this.action.info)
            return this.action
        }

        createSO() {
            log.debug('createSO info', this.action.info)

            if (!this.enoughInventory()) throw new Error('Inventory is not enough')

            const { soId, redeemCodeList } = this.action.createSO(
                !_.isEmpty(this.action.info.WELCOME_GIFT_DATE)
                    ? this.action.info.REDEEM_ITEM_LIST.map((item) => ({ id: item.INTERNAL_ID, qty: item.QTY }))
                    : this.action.info.REDEEM_ITEM_LIST.map((item) => ({
                        id: item.INTERNAL_ID,
                        qty: parseInt(item.qty),
                    })),
                this.action.info.VENDOR
            )
            log.debug('soId', soId)

            const so = record.load({
                type: 'salesorder',
                id: soId,
                isDynamic: true,
            })
            so.setText({
                fieldId: 'orderstatus',
                text: 'Pending Fulfillment',
            })
            so.save()

            this.soID = soId
            this.redeemCodeList = redeemCodeList
            return { soId, redeemCodeList }
        }

        updateRedeemCodeMaster(redeemCodeList, internalId, soId) {
            log.debug('redeemCodeList', redeemCodeList)
            log.debug('internalId', internalId)
            this.redeemCodeMasterInternalId = internalId
            this.action._updateRedeemCodeMaster(redeemCodeList, internalId, soId)
            log.debug('updateRedeemCodeMaster done')
        }

        fulfillSO(soId) {
            log.debug('fulfillSO', soId)
            let allItemIsVoucher = true
            const classType = new ClassTypeDAO().findAll()
            log.debug('classType', classType)
            for (let item of this.action.info.REDEEM_ITEM_LIST) {
                const itemClass = classType.find((classType) => classType.internalId === item.CLASS)
                if (!itemClass.eVoucher) {
                    allItemIsVoucher = false
                }
            }

            if (allItemIsVoucher) this.fulfilmentId = this.action.fulfillSO(soId)
            else throw new Error('Not all item is voucher')

            log.debug('fulfillSO done')
        }

        updateStagingStatus(status) {
            const redemptionStagingDAO = new RedemptionStagingDAO()
            redemptionStagingDAO.updateStagingStatus(this.internalId, status)
        }

        updateErrorMessage(error) {
            const redemptionStagingDAO = new RedemptionStagingDAO()
            redemptionStagingDAO.updateErrorMessage(this.internalId, error)
        }

        rollback() {
            if (this.fulfilmentId) {
                record.load
                this.action.rollbackFulfillment(this.fulfilmentId)
            }
            if (this.redeemCodeList && this.redeemCodeMasterInternalId) {
                this.action.rollbackRedeemCodeMaster(this.redeemCodeList, this.redeemCodeMasterInternalId)
            }
            if (this.soID) {
                this.action.rollbackSO(this.soID)
            }
        }

        enoughInventory() {
            let enough = true
            const fineItemList = this.action.info.REDEEM_ITEM.map((itemQty) => ({
                name: itemQty.split('_')[0],
                qty: itemQty.split('_')[1],
            }))

            const itemList = new ItemDAO().findByNames(fineItemList.map((item) => item.name))

            const redeemCodeMasterList = new RedeemCodeMasterDAO().findByItems(itemList.map((item) => item.INTERNAL_ID))
            const counts = redeemCodeMasterList.reduce((acc, value) => {
                acc[value] = (acc[value] || 0) + 1
                return acc
            }, {})

            itemList
                .filter((item) => item.type === 'InvtPart')
                .forEach((item) => {
                    const remainingItemQty = new InventoryNumberDAO()
                        .findOnHandLots(item.INTERNAL_ID)
                        .reduce((acc, lot) => acc + parseFloat(lot.available), 0)
                    if (remainingItemQty < 1) {
                        enough = false
                    }
                })

            this.action.info.REDEEM_ITEM_LIST.forEach((item) => {
                const totalQty = counts[item.INTERNAL_ID] || 0
                if (totalQty < item.qty) {
                    enough = false
                }
            })

            return enough
        }

        getWelcomeGiftRewardsScheme() {
            return record.load({
                type: 'customrecord_iv_reward_scheme',
                id: 1,
            })
        }

        getSOObj(soId) {
            return record.load({
                type: 'salesorder',
                id: soId,
            })
        }

        createRewardsRecordForWelcomeGift(soObj, rewardsSchemeObj, parsedInfo) {
            const earnedRewardsDAO = new EarnedRewardsDAO()
            earnedRewardsDAO.createRewardRecord({
                REWARD_TYPE: 1,
                REWARD_SCHEME: 1,
                REWARD_CUSTOMER: parsedInfo.INTERNAL_ID,
                REWARD_SUBSI: soObj.getValue('subsidiary'),
                REWARD_LOCATION: soObj.getValue('location'),
                REWARD_CHANNEL: soObj.getValue('cseg1'),
                REWARD_SOURCESO: soObj.id,
                REWARD_EARNEDPOINT: 0,
                REWARD_REDEEMPOINT: 0,
                REWARD_DATE_TIME: moment().format('YYYY/MM/DD'),
                REWARD_PROVISION_DATE_TIME: moment().format('YYYY/MM/DD'),
                // REWARD_EXPIRY_DATE_TIME ,
                REWARD_STATUS: 2,
                REWARD_GIFTSO: soObj.id,
                REWARD_OMNI_EN_MSG: rewardsSchemeObj.getValue('custrecord_iv_rs_eng_display_msg'),
                REWARD_OMNI_TC_MSG: rewardsSchemeObj.getValue('custrecord_iv_rs_tchin_display_msg'),
                REWARD_OMNI_SC_MSG: rewardsSchemeObj.getValue('custrecord_iv_rs_schin_display_msg'),
                REWARD_ACQUIREDGIFT: rewardsSchemeObj.getValue('custrecord_iv_gift_to_be_provisioned'),
            })
        }
    }

    return RedemptionStagingWorkflowServices
})
