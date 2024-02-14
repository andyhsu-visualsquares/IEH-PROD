define(['N', 'N/search'], (N_1, search) => {
    class InvoiceDAO {
        constructor() {}

        editInv(invID, data) {
            N_1.record.submitFields({
                type: 'invoice',
                id: invID,
                values: data,
                options: {
                    ignoreMandatoryFields: true,
                },
            })
        }

        findInvByTransID(transID) {
            var invoiceSearchResult = search
                .create({
                    type: 'invoice',
                    filters: [
                        ['type', 'anyof', 'CustInvc'],
                        'AND',
                        ['custbodypossalesid', 'is', transID],
                        'AND',
                        ['custbody_iv_is_earn_reward', 'is', 'F'],
                    ],
                    columns: [
                        search.createColumn({
                            name: 'ordertype',
                            sort: search.Sort.ASC,
                        }),
                        'tranid',
                        'memo',
                    ],
                })
                .run()
                .getRange({ start: 0, end: 1000 })
            return invoiceSearchResult.length > 0 ? invoiceSearchResult[0] : null
        }

        findRelatedTransIDUsedByInvAndEr(transID) {
            var invoiceSearchResult = search
                .create({
                    type: 'invoice',
                    filters: [['type', 'anyof', 'CustInvc'], 'AND', ['custbodypossalesid', 'is', transID]],
                    columns: [
                        search.createColumn({
                            name: 'ordertype',
                            sort: search.Sort.ASC,
                        }),
                        'tranid',
                    ],
                })
                .run()
                .getRange({ start: 0, end: 1000 })
            if (invoiceSearchResult.length === 0) return invoiceSearchResult
            let invID = invoiceSearchResult[0].id
            var customrecord_iv_earned_rewardsSearchResult = search
                .create({
                    type: 'customrecord_iv_earned_rewards',
                    filters: [['custrecord_iv_source_sales_order', 'is', invID]],
                    columns: [
                        search.createColumn({
                            name: 'scriptid',
                            sort: search.Sort.ASC,
                        }),
                        'custrecord_iv_scheme',
                        'custrecord_iv_earned_points',
                        'custrecord_iv_redeem_points',
                        'custrecord_iv_acquired_gift',
                        'custrecord_iv_provision_date_time',
                        'custrecord_iv_point_expiry_date_time',
                        'custrecord_iv_status',
                        'createddate',
                    ],
                })
                .run()
                .getRange({ start: 0, end: 1000 })

            return customrecord_iv_earned_rewardsSearchResult
        }
    }

    return InvoiceDAO
})
