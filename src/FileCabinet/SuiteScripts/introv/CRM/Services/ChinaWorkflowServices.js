/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([
    './ChinaDBServices',
    '../Repository/CustomerRepository',
    '../DAO/TemporaryCustomerDAO',
    '../../utils/DateUtils',
    "N"
], (ChinaDBServices, CustomerRepository, TemporaryCustomerDAO, DateUtils, N_1) => {
    class ChinaWorkflowServices {
        constructor() { }

        findTemporaryCustomerList() {
            return new TemporaryCustomerDAO().getAll()
        }

        createCustomerInDB(customerInfo) {
            try {
                log.debug('createCustomerInDB customerInfo', JSON.stringify(customerInfo))
                const customerRepository = new CustomerRepository()
                const chinaDBServices = new ChinaDBServices()

                this._updateWorkflowStatus(customerInfo.INTERNAL_ID, 'db', 'start')

                const response = chinaDBServices.createCustomer(customerInfo, customerInfo.CUSTOMER_ID)
                log.debug('db response', JSON.stringify(response))

                // if (response.code === 200) {
                //     if (customerRepository.isTransIdUsed(customerInfo.TRANS_ID)) {
                //         customerRepository.createRewardRecord('invalid', { customerInfo })
                //     } else if (!_.isEmpty(customerInfo.TRANS_ID)) {
                //         customerRepository.createRewardRecord('earn', { customerInfo })
                //     }

                //     customerRepository.createRewardRecord('redemption', {
                //         ...customerInfo,
                //         CUSTOMER_ID: customerInfo.CUSTOMER_ID,
                //         INTERNAL_ID: customerInfo.INTERNAL_ID,
                //         WELCOME_GIFT_DATE: new DateUtils().getTodayNetsuiteFormat().date,
                //         FIRST_NAME: 'China',
                //         LAST_NAME: 'Individual',
                //     })
                // }
                this._updateWorkflowStatus(customerInfo.INTERNAL_ID, 'db', response.code === 200 ? 'success' : 'fail')
            } catch (e) {
                if (e.name === 'SSS_CONNECTION_TIME_OUT') {
                    this._updateWorkflowStatus(customerInfo.INTERNAL_ID, 'db', 'retry')
                }
                new TemporaryCustomerDAO().updateErrorMessage(
                    customerInfo.INTERNAL_ID,
                    e.toString(),
                    'custrecord_iv_temp_error_log'
                )
            }
        }

        deleteShopifyCustomer(customerInfo) {
            try {
                log.debug('deleteShopifyCustomer customerInfo', JSON.stringify(customerInfo))
                this._updateWorkflowStatus(customerInfo.INTERNAL_ID, 'shopify', 'start')
                let tempCNRec = N_1.record.load({
                    type: "customrecord_iv_temp_china_customer",
                    id: customerInfo.INTERNAL_ID
                })
                const response = new CustomerRepository().deleteShopifyUser({
                    email: customerInfo.EMAIL,
                    phone: customerInfo.PHONE,
                }, tempCNRec.getValue("custrecord_iv_temp_customer_internal_id"))
                log.debug('shopify response', JSON.stringify(response))

                this._updateWorkflowStatus(
                    customerInfo.INTERNAL_ID,
                    'shopify',
                    response.code === 200 ? 'success' : response.code === 4004 ? 'unavailable' : 'fail'
                )
            } catch (e) {
                new TemporaryCustomerDAO().updateErrorMessage(
                    customerInfo.INTERNAL_ID,
                    e.toString(),
                    'custrecord_iv_temp_shopify_error_log'
                )
            }
        }

        deleteTemporaryCustomer(customerInfo) {
            new TemporaryCustomerDAO().remove(customerInfo.INTERNAL_ID)
        }

        _updateWorkflowStatus(internalID, workflowType, workflowStatus) {
            let type = 'custrecord_iv_shopify_workflow',
                status = '2'

            if (workflowType === 'db') type = 'custrecord_iv_china_db_workflow'
            if (['pending', 'fail'].includes(workflowStatus)) status = '1'
            if (workflowStatus === 'success') status = '3'
            if (workflowStatus === 'unavailable') status = '4'
            if (workflowStatus === 'retry') status = '5'

            const temporaryCustomerDAO = new TemporaryCustomerDAO()
            temporaryCustomerDAO.updateWorkflowStatus(internalID, [
                {
                    type,
                    status,
                },
            ])
        }
    }

    return ChinaWorkflowServices
})
