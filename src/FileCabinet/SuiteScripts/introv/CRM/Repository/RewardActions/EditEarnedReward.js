/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../../DAO/EarnedRewardsDAO', '../../../utils/DateUtils'], (EarnedRewardsDAO, DateUtils) => {
    class EditEarnedReward {
        constructor(info) {
            this.info = info
        }

        edit() {
            // Logic to edit earned reward
            const records = this.findSufficientRewardRecord()
            for (let record of records) {
                const earnedRewardsDAO = new EarnedRewardsDAO()
                const redeemedPoint = record.redeemedPoint + record.toBeRedeemedPoint
                let currentRedemptionItem = record.redemptionItem !== '' ? record.redemptionItem.split('\u0005') : []
                if (currentRedemptionItem.length > 0) {
                    let currentRedmptedItem = currentRedemptionItem[0].split(',')
                    for (let redeemItem of this.info.redeemItemList) {
                        currentRedmptedItem.includes(redeemItem)
                            ? null
                            : currentRedmptedItem.push(redeemItem.INTERNAL_ID)
                    }
                    currentRedemptionItem = currentRedmptedItem
                } else {
                    for (let redeemItem of this.info.redeemItemList) {
                        currentRedemptionItem.push(redeemItem.INTERNAL_ID)
                    }
                }
                earnedRewardsDAO.updateEarnedRecord(record.internalId, [
                    {
                        field: 'custrecord_iv_redeem_points',
                        value: redeemedPoint,
                    },
                    {
                        field: 'custrecord_iv_redemption_record',
                        value:
                            record.redemptionRec === ''
                                ? this.info.redemptionRecordID
                                : record.redemptionRec.split(',').join('\u0005') +
                                  '\u0005' +
                                  this.info.redemptionRecordID,
                    },
                    {
                        field: 'custrecord_iv_redemption_item',
                        value: currentRedemptionItem.join('\u0005'),
                    },
                ])
            }
        }

        findSufficientRewardRecord() {
            log.debug('info', this.info)
            const dateUtils = new DateUtils()
            const targetRecord = []
            const earnedHistory = new EarnedRewardsDAO()
                .findEarnedHistory(this.info.CUSTOMER_ID, '', {
                    startDate: '',
                    endDate: '',
                })
                .sort((a, b) => {
                    return dateUtils.diffDate(a.pointExpiryDate, b.pointExpiryDate)
                })
                .filter((record) => {
                    return dateUtils.isSameOrAfterFromToday(record.pointExpiryDate)
                })
                .filter((record) => {
                    return record.points
                })
            let redeemPoint = parseInt(this.info.REDEMPTION_POINTS)
            for (let record of earnedHistory) {
                const freePoint = record.points - record.redeemedPoint
                if (freePoint > redeemPoint) {
                    targetRecord.push({ ...record, toBeRedeemedPoint: redeemPoint })
                    break
                } else {
                    targetRecord.push({ ...record, toBeRedeemedPoint: freePoint })
                    redeemPoint -= freePoint
                }
            }

            log.debug('targetRecord', targetRecord)
            return targetRecord
        }
    }
    return EditEarnedReward
})
