/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    return {
        API_STATUS_CODE: {
            SUCCESS: {
                CODE: 200,
                MESSAGE: 'OK',
            },
            BAD_REQUEST: {
                CODE: 400,
                MESSAGE: 'Bad Request',
            },
            INTERNAL_SERVER_ERROR: {
                CODE: 500,
                MESSAGE: 'Internal Server Error',
            },
            NO_SUCH_MEMBER: {
                CODE: 2001,
                MESSAGE: 'No such member',
            },
            NO_POINT_HISTORY: {
                CODE: 2002,
                MESSAGE: 'No point history',
            },
            USER_ALREADY_EXIST: {
                CODE: 2003,
                MESSAGE: 'User already exist',
            },
            MISSING_MANDATORY_FIELD: {
                CODE: 2004,
                MESSAGE: 'Missing mandatory field',
            },
            INSUFFICIENT_POINTS: {
                CODE: 2005,
                MESSAGE: 'Insufficient points',
            },
            INSUFFICIENT_ITEM_QTY: {
                CODE: 2006,
                MESSAGE: 'Insufficient item quantity',
            },
            REQUESTED_TYPE_NOT_FOUND: {
                CODE: 2007,
                MESSAGE: 'Requested type not found',
            },
            BAD_REQUEST_FORMAT: {
                CODE: 2008,
                MESSAGE: 'Bad request format',
            },
            MEMBER_TYPE_NOT_MATCH: {
                CODE: 2009,
                MESSAGE: 'Member tier not match',
            },
            REDEEM_ITEM_QUANTITY_NOT_EXPECTED: {
                CODE: 2010,
                MESSAGE: 'Redeem item quantity is not expected',
            },
            UNEXPECTED_ERROR: {
                CODE: 5001,
                MESSAGE: 'Unexpected error',
            },
        },
        RECORD: {
            REDEMPTION_VENDOR_LIST: {
                TYPE: 'customlist',
                ID: '240',
            },
            ITEM_CATEGORY_LIST: {
                TYPE: 'customlist',
                ID: '235',
            },
            TEMPORARY_CUSTOMER: {
                TYPE: 'customrecord_iv_temp_china_customer',
            },
        },
        SUBSID: {
            IDL: 10,
            AIL: 14
        },
        EARNED_REWARDS_TYPE: {
            POINTS: 1,
            GIFTS: 2,
            POINT_STATUS: {
                PENDING: 1,
                PROVISIONED: 2,
                CANCELLED: 3,
                USED: 4,
                PARITIALLY_USED: 5,
                EXPIRED: 6
            }
        },
        MEMBER_TYPE: {
            CLASSIC: '1',
            LT_GOLD: '2',
            GOLD: '3',
            PLATINUM: '4',
            PLATINUM_LT_GOLD: '5',
            LT_PLATINUM: '6'
        },
        STAGING_REC_STATUS: {
            PENDING_START: '1',
            PROCESSING: '2',
            FINISHED: '3',
            UNAVIALABLE: '4',
            PENDING_RETRY: '5'
        },
        BASE_URL: 'https://5112262.app.netsuite.com/',
        BULK_EXPORT_FOLDER: 2119364,
        CURRENT_ENV: "PROD", //SB for Sandbox, PROD for Production
        EMAIL_TEMPLATE_ID_FOR_SO_REDEEMPTION: 19,
        REWARD_SCHEME_SUB_TYPE: {
            NEW_MEMBER: '2'
        },
      SHOPIFY_CONFIG: {
            BASE_URL: 'https://ipastry.myshopify.com',
            ACCESS_TOKEN: "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"
        }

    }
})
