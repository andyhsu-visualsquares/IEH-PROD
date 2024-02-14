/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Chris Chau
 *
 * @ApplyTo
 * @Description
 */
define([], () => {
    return {
        
        RESIDENTIAL_AREA: {
            HONG_KONG: {
                TEXT: 'Hong Kong',
                VALUE: '1',
            },
            MAINLAND: {
                TEXT: 'Mainland',
                VALUE: '2',
            },
            MACAU: {
                TEXT: 'Macau',
                VALUE: '3',
            },
            TAIWAN: {
                TEXT: 'Taiwan',
                VALUE: '4',
            },
            OTHERS: {
                TEXT: 'Others',
                VALUE: '11',
            },
            
        },
        CUSTOM_LIST :{
            ITEM_CAT_LIST:{
                TEXT:"Item Category List",
                ID: "235"
            }
        }
    }
})
