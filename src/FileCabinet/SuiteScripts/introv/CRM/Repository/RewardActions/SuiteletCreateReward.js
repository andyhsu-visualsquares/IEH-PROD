/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/url', 'N/https'], (url, https) => {
    class SuiteletCreateReward {
        constructor(internalId, type, welcomeGiftDate) {
            this.internalId = internalId
            this.type = type
            this.welcomeGiftDate = welcomeGiftDate
            // this.info = info
        }

        create() {
            // Logic to create reward using suitelet - sl_iv_create_reward
            const response = https.post({
                url: url.resolveScript({
                    scriptId: 'customscript_iv_create_reward_sl',
                    deploymentId: 'customdeploy_iv_create_reward_sl',
                    returnExternalUrl: true,
                }),
                body: JSON.stringify({
                    newRecId: this.internalId,
                    newRecType: this.type,
                    welcomeGiftDate: this.welcomeGiftDate,
                }),
                headers: { name: 'Accept-Language', value: 'en-us' },
            })
            log.debug('SuiteletCreateReward create response body', response.body)
        }

        createWithoutTranID() {
            // Logic to create reward without TranID
            const response = https.post({
                url: url.resolveScript({
                    scriptId: 'customscript_iv_create_reward_no_tran_sl',
                    deploymentId: 'customdeploy_iv_create_reward_no_tran_sl',
                    returnExternalUrl: true,
                }),
                body: JSON.stringify({
                    welcomeGiftDate: this.welcomeGiftDate,
                }),
                headers: { name: 'Accept-Language', value: 'en-us' },
            })
            log.debug('SuiteletCreateReward create without transaction response body', response.body)

        }
    }
    return SuiteletCreateReward
})
