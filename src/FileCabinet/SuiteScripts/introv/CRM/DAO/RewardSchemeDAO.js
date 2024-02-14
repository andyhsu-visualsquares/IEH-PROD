/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author John Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/search', '../Entity/RewardScheme', '../../lib/lodash'], (search, RewardScheme, _) => {
    class RewardSchemeDAO {
        constructor() {
            /**
             * List Id: customlist286
             * Name : Point Scheme Type
             *
             * Regular is long term reward, Promotion will have limited time
             */
            this.REWARD_SCHEME_TYPE = {
                REGULAR: {
                    value: 1,
                    text: 'Regular',
                },
                PROMOTION: {
                    value: 2,
                    text: 'Promotion',
                },
            }
            /**
             * List Id: customlist288
             * Name : Reward Scheme Sub-Type List
             */
            this.REWARD_SUB_TYPE = {
                POINT_PROVISION: {
                    value: 1,
                    text: 'Point Provision',
                },
                NEW_MEMBER: {
                    value: 2,
                    text: 'New Member',
                },
                BRITHDAY_OFFER: {
                    value: 3,
                    text: 'Birthday Offer',
                },
                ORDER_AMOUNT: {
                    value: 4,
                    text: 'Order Amount',
                },
                ORDER_QUANTITY: {
                    value: 5,
                    text: 'Order Quantity',
                },
                SPECIFIC_CATEGORY: {
                    value: 6,
                    text: 'Specific Category',
                },
                SPECIFIC_ITEM: {
                    value: 7,
                    text: 'Specific Item',
                },
                REGIONAL_OFFER: {
                    value: 8,
                    text: 'Regional Offer',
                },
                UPGRADE_OFFER: {
                    value: 9,
                    text: 'Upgrade Offer',
                },
            }
        }

        getRewardSchemeFromMemberships({ APPLICABLE_TIER }) {
            var customrecord_iv_reward_schemeSearchObj = search.create({
                type: 'customrecord_iv_reward_scheme',
                filters: [
                    ['custrecord_iv_applicable_tier', 'anyof', APPLICABLE_TIER],
                    'AND',
                    ['isinactive', 'is', 'F'],
                    // Regular is long term reward, Promotion will have limited time
                    'AND',
                    [
                        ['custrecord_iv_type', 'anyof', this.REWARD_SCHEME_TYPE.REGULAR.value],
                        'OR',
                        [
                            ['custrecord_iv_type', 'anyof', this.REWARD_SCHEME_TYPE.PROMOTION.value],
                            'AND',
                            ['custrecord_iv_effective_from', 'onorbefore', 'today'],
                            'AND',
                            ['custrecord_iv_effective_to', 'onorafter', 'today'],
                        ],
                    ],
                ],
                columns: [
                    'internalid',
                    'custrecord_iv_subtype',
                    'custrecord_iv_applicable_tier',
                    'name',
                    'custrecord_iv_scheme_description',
                    'custrecord_iv_point_provisioning_rate',
                    'custrecord_iv_points_to_be_provisioned',
                    'custrecord_iv_gift_to_be_provisioned',
                    'custrecord_iv_gift_provisioning_quantity',
                    'custrecord_iv_point_provision_day',
                    'custrecord_iv_min_eligible_amount',
                    'custrecord_iv_minimum_eligible_quantity',
                    'custrecord_iv_eligible_category',
                    'custrecord_iv_eligible_item',
                    'custrecord_iv_eligible_region',
                    'custrecord_iv_rs_eng_display_msg',
                    'custrecord_iv_rs_tchin_display_msg',
                    'custrecord_iv_rs_schin_display_msg',
                    'custrecord_iv_rs_reward_type',
                ],
            })
            var resultMap = {}
            var ProcessCount = 0
            var searchResultCount = customrecord_iv_reward_schemeSearchObj.runPaged().count
            for (var i = 0; i < Math.ceil(searchResultCount / 1000); i++) {
                var results = customrecord_iv_reward_schemeSearchObj
                    .run()
                    .getRange({ start: 1000 * i, end: 1000 * (i + 1) })
                for (var j = 0; j < results.length; j++) {
                    ProcessCount++
                    var transId = results[j].getValue('internalid')
                    var rewardSubType = results[j].getValue('custrecord_iv_subtype')
                    var transName = results[j].getValue('name')
                    var pointProvisionRate = results[j].getValue('custrecord_iv_point_provisioning_rate')
                    var pointProvisioned = results[j].getValue('custrecord_iv_points_to_be_provisioned')
                    var giftList = results[j].getValue('custrecord_iv_gift_to_be_provisioned')
                    var giftQty = results[j].getValue('custrecord_iv_gift_provisioning_quantity')

                    var specialDay = results[j].getValue('custrecord_iv_point_provision_day')
                    var minBuyAmt = results[j].getValue('custrecord_iv_min_eligible_amount')
                    var minBuyQty = results[j].getValue('custrecord_iv_minimum_eligible_quantity')
                    var specialCat = results[j].getValue('custrecord_iv_eligible_category')
                    var specailItem = results[j].getValue('custrecord_iv_eligible_item')
                    var specialRegion = results[j].getValue('custrecord_iv_eligible_region')
                    var OMNIeng = results[j].getValue('custrecord_iv_rs_eng_display_msg')
                    var OMNItc = results[j].getValue('custrecord_iv_rs_tchin_display_msg')
                    var OMNIsc = results[j].getValue('custrecord_iv_rs_schin_display_msg')
                    var rewardType = results[j].getValue('custrecord_iv_rs_reward_type')
                    resultMap[transId] = {
                        transId: transId,
                        transName: transName,
                        rewardSubType: rewardSubType,
                        pointProvisionRate: pointProvisionRate,
                        pointProvisioned: pointProvisioned,
                        giftList: giftList,
                        giftQty: giftQty,
                        specialDay: specialDay,
                        minBuyAmt: minBuyAmt,
                        minBuyQty: minBuyQty,
                        specialCat: specialCat,
                        specailItem: specailItem,
                        specialRegion: specialRegion,
                        OMNIeng: OMNIeng,
                        OMNItc: OMNItc,
                        OMNIsc: OMNIsc,
                        rewardType: rewardType,
                    }
                }
            }

            return resultMap
        }

        findByInternalId(internalId) {
            let rewardScheme = null
            const customrecord_iv_reward_schemeSearchColInternalId = search.createColumn({ name: 'internalid' })
            const customrecord_iv_reward_schemeSearchColRewardSchemeNo = search.createColumn({
                name: 'name',
            })
            const customrecord_iv_reward_schemeSearchColOmniDisplayMessageEnglish = search.createColumn({
                name: 'custrecord_iv_rs_eng_display_msg',
            })
            const customrecord_iv_reward_schemeSearchColOmniDisplayMessageSimplifiedChinese = search.createColumn({
                name: 'custrecord_iv_rs_schin_display_msg',
            })
            const customrecord_iv_reward_schemeSearchColOmniDisplayMessageTraditionalChinese = search.createColumn({
                name: 'custrecord_iv_rs_tchin_display_msg',
            })
            const customrecord_iv_reward_schemeSearchGiftToBeProvisioned = search.createColumn({
                name: 'custrecord_iv_gift_to_be_provisioned',
            })
            const customrecord_iv_reward_schemeSearchColGiftProvisioningQuantity = search.createColumn({
                name: 'custrecord_iv_gift_provisioning_quantity',
            })
            const customrecord_iv_reward_schemeSearchColType = search.createColumn({
                name: 'type',
                join: 'CUSTRECORD_IV_GIFT_TO_BE_PROVISIONED',
            })
            const customrecord_iv_reward_schemeSearchColSchemeRewardType = search.createColumn({
                name: 'custrecord_iv_rs_reward_type',
            })

            const customrecord_iv_reward_schemeSearch = search.create({
                type: 'customrecord_iv_reward_scheme',
                filters: [['internalid', 'anyof', internalId]],
                columns: [
                    customrecord_iv_reward_schemeSearchColInternalId,
                    customrecord_iv_reward_schemeSearchColRewardSchemeNo,
                    customrecord_iv_reward_schemeSearchColOmniDisplayMessageEnglish,
                    customrecord_iv_reward_schemeSearchColOmniDisplayMessageSimplifiedChinese,
                    customrecord_iv_reward_schemeSearchColOmniDisplayMessageTraditionalChinese,
                    customrecord_iv_reward_schemeSearchGiftToBeProvisioned,
                    customrecord_iv_reward_schemeSearchColGiftProvisioningQuantity,
                    customrecord_iv_reward_schemeSearchColType,
                    customrecord_iv_reward_schemeSearchColSchemeRewardType,
                ],
            })

            const customrecord_iv_reward_schemeSearchPagedData = customrecord_iv_reward_schemeSearch.runPaged({
                pageSize: 1000,
            })
            for (let i = 0; i < customrecord_iv_reward_schemeSearchPagedData.pageRanges.length; i++) {
                const customrecord_iv_reward_schemeSearchPage = customrecord_iv_reward_schemeSearchPagedData.fetch({
                    index: i,
                })
                customrecord_iv_reward_schemeSearchPage.data.forEach((result) => {
                    const internalId = result.getValue(customrecord_iv_reward_schemeSearchColInternalId)
                    const rewardSchemeNo = result.getValue(customrecord_iv_reward_schemeSearchColRewardSchemeNo)
                    const omniDisplayMessageEnglish = result.getValue(
                        customrecord_iv_reward_schemeSearchColOmniDisplayMessageEnglish
                    )
                    const omniDisplayMessageSimplifiedChinese = result.getValue(
                        customrecord_iv_reward_schemeSearchColOmniDisplayMessageSimplifiedChinese
                    )
                    const omniDisplayMessageTraditionalChinese = result.getValue(
                        customrecord_iv_reward_schemeSearchColOmniDisplayMessageTraditionalChinese
                    )
                    const gifts = result.getValue(customrecord_iv_reward_schemeSearchGiftToBeProvisioned)
                    const giftQty = result.getValue(customrecord_iv_reward_schemeSearchColGiftProvisioningQuantity)
                    const type = result.getValue(customrecord_iv_reward_schemeSearchColType)
                    const schemeRewardsType = result.getValue(customrecord_iv_reward_schemeSearchColSchemeRewardType)

                    rewardScheme = new RewardScheme({
                        internalId,
                        name: rewardSchemeNo,
                        displayMessageEN: omniDisplayMessageEnglish,
                        displayMessageSC: omniDisplayMessageSimplifiedChinese,
                        displayMessageTC: omniDisplayMessageTraditionalChinese,
                        gifts: _.isArray(gifts) ? gifts : gifts.split(','),
                        giftQty: giftQty || 0,
                        rewardType: schemeRewardsType,
                    })
                })
            }

            return rewardScheme
        }

        getWelcomeRewardScheme() {
            var rewardScheme
            var rewardSchemeSearchResult = search
                .create({
                    type: 'customrecord_iv_reward_scheme',
                    filters: [['custrecord_iv_subtype', 'anyof', this.REWARD_SUB_TYPE.NEW_MEMBER.value]],
                    columns: ['internalid'],
                })
                .run()
                .getRange({ start: 0, end: 1000 })
            rewardScheme = N_1.record.load({
                type: 'customrecord_iv_reward_scheme',
                id: rewardSchemeSearchResult[0].id,
            })
            log.debug('Reward Scheme ID', rewardScheme.id)
            return rewardScheme
        }

        getAll() {}
    }

    return RewardSchemeDAO
})
