/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/https', '../../utils/DateUtils', 'N', "../Constants/Constants"], (https, DateUtils, N_1, const_1) => {
    class ChinaDBServices {
        constructor() {
            this._baseURL = 'https://iehcnapiapp.chinacloudsites.cn/api'
            this._headers = {
                'Content-Type': 'application/json',
            }
        }

        createCustomer(customerInfo, entityId) {
            const dateUtils = new DateUtils()
            return https.post({
                url: this._baseURL + '/customer/new-mainland-customer',
                body: JSON.stringify({
                    customerData: {
                        ...customerInfo,
                        CUSTOMER_ID: entityId,
                        MEMBER_TYPE: '1',
                        WELCOME_GIFT_DATE: dateUtils.convertDateTimeStringToNSDateString(customerInfo.REGISTRATION_DATE),
                        EFFECTIVE_DATE: dateUtils.convertDateTimeStringToNSDateString(customerInfo.REGISTRATION_DATE),
                        EFFECTIVE_TO: null,
                    },
                    currentEnv: const_1.CURRENT_ENV
                }),
                headers: this._headers,
            })
        }

        findCustomerByKey({ customerId, phone, email }) {
            log.debug('customerId', customerId)
            let url =
                this._baseURL +
                `/customer/target-customer-data?CUSTOMER_ID=${customerId || ''}&PHONE=${phone?.replace('+86', '')?.replace('86', '') || ''
                }&EMAIL=${encodeURIComponent(email || '')}&CURRENT_ENV=${const_1.CURRENT_ENV}`

            log.debug('url', url)
            return https.get({
                url,
                headers: this._headers,
            })
        }
        updateCustomer(customerInfo, entityId) {
            const dateUtils = new DateUtils()
            log.debug('customerInfo', customerInfo)
            return https.put({
                url: this._baseURL + '/customer/existing-customer',
                body: JSON.stringify({
                    customerData: {
                        ...customerInfo,
                        CUSTOMER_ID: entityId,
                    },
                    currentEnv: const_1.CURRENT_ENV
                }),
                headers: this._headers,
            })
        }

        getAllCustomer() {
            return https.get({
                url: this._baseURL + `/customer/all-customers?CURRENT_ENV=${const_1.CURRENT_ENV}`,
                headers: this._headers,
            })
        }
    }

    return ChinaDBServices
})
