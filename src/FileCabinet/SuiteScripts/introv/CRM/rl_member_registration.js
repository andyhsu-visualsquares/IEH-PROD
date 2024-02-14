/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType RESTlet
 * @author Andy Chan
 *
 * @ScriptName RL CRM Member Registration
 * @ScriptId customscript_iv_cmr_member_regist_rl
 * @DeploymentId customdeploy_iv_cmr_member_regist_rl
 * @ApplyTo
 * @Description
 */
define(['./Services/CustomerServices', './Services/ShopifyServices', './Constants/Constants'], (
    CustomerServices,
    ShopifyServices,
    Constant
) => {
    const CustomerService = new CustomerServices()

    const get = (requestParams) => {
        try {
            log.audit('get', requestParams)

            const { type, ...searchParams } = requestParams
            switch (type) {
                case 'member':
                    return { ...CustomerService.getMemberInfo(searchParams) }
                case 'pointHistory':
                    return { ...CustomerService.checkPointHistory(searchParams) }
                default:
                    return {
                        STATUS_CODE: Constant.API_STATUS_CODE.REQUESTED_TYPE_NOT_FOUND.CODE,
                        MESSAGE: Constant.API_STATUS_CODE.REQUESTED_TYPE_NOT_FOUND.MESSAGE,
                    }
            }
        } catch (e) {
            log.error('get', e.toJSON ? e : e.stack ? e.stack : e.toString())
            return {
                STATUS_CODE: Constant.API_STATUS_CODE.UNEXPECTED_ERROR.CODE,
                MESSAGE: Constant.API_STATUS_CODE.UNEXPECTED_ERROR.MESSAGE,
                DETAIL: e.toJSON ? e : e.stack ? e.stack : e.toString(),
            }
        }
    }

    const post = (requestBody) => {
        try {
            log.audit('post', requestBody)
            const { TYPE, ...queryInfo } = requestBody
            switch (TYPE) {
                case 'registration':
                    return { ...CustomerService.createCustomer(queryInfo) }
                case 'pointRedemption':
                    return { ...CustomerService.redeemPoint(queryInfo) }
                default:
                    return {
                        STATUS_CODE: Constant.API_STATUS_CODE.REQUESTED_TYPE_NOT_FOUND.CODE,
                        MESSAGE: Constant.API_STATUS_CODE.REQUESTED_TYPE_NOT_FOUND.MESSAGE,
                    }
            }
        } catch (e) {
            log.error('post', e.toJSON ? e : e.stack ? e.stack : e.toString())
            return {
                STATUS_CODE: Constant.API_STATUS_CODE.UNEXPECTED_ERROR.CODE,
                MESSAGE: Constant.API_STATUS_CODE.UNEXPECTED_ERROR.MESSAGE,
                DETAIL: e.toJSON ? e : e.stack ? e.stack : e.toString(),
            }
        }
    }

    const put = (requestBody) => {
        try {
            log.audit('put', requestBody)
            return JSON.parse(
                new ShopifyServices().getCustomer({ email: requestBody.EMAIL, phone: requestBody.PHONE }).body
            )
        } catch (e) {
            log.error('put', e.toJSON ? e : e.stack ? e.stack : e.toString())
            return {
                STATUS_CODE: Constant.API_STATUS_CODE.UNEXPECTED_ERROR.CODE,
                MESSAGE: Constant.API_STATUS_CODE.UNEXPECTED_ERROR.MESSAGE,
                DETAIL: e.toJSON ? e : e.stack ? e.stack : e.toString(),
            }
        }
    }

    const delete_ = (requestParams) => {
        try {
            log.audit('delete', requestParams)
            return {
                STATUS_CODE: Constant.API_STATUS_CODE.REQUESTED_TYPE_NOT_FOUND.CODE,
                MESSAGE: Constant.API_STATUS_CODE.REQUESTED_TYPE_NOT_FOUND.MESSAGE,
            }
        } catch (e) {
            log.error('delete', e.toJSON ? e : e.stack ? e.stack : e.toString())
            return {
                STATUS_CODE: Constant.API_STATUS_CODE.UNEXPECTED_ERROR.CODE,
                MESSAGE: Constant.API_STATUS_CODE.UNEXPECTED_ERROR.MESSAGE,
                DETAIL: e.toJSON ? e : e.stack ? e.stack : e.toString(),
            }
        }
    }

    return {
        get,
        post,
        put,
        // delete: delete_,
    }
})
