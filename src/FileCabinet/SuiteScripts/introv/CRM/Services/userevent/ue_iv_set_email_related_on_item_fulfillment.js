/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 *Author: Chris Chau
 20231212 Chris : Changed Email Tmeplate ID from Hardcode to Constants
 */
define(['N', "../../Constants/Constants"], function (N_1, const_1) {

    function beforeLoad(context) {

    }

    function beforeSubmit(context) {
        log.debug("TYPE", context.type)
        if (context.type !== "create") return true
        const { newRecord } = context
        log.debug("createdfrom", newRecord.getValue("createdfrom"))
        log.debug("check", newRecord.getValue("custbodyvoucheremailtempate"))
        // if (newRecord.getValue("custbodyvoucheremailtempate") && newRecord.getValue("custbodyvoucheremailtempate") !== "") return true
        const createdFromRecType = newRecord.getText("createdfrom")
        if (createdFromRecType.startsWith("Sales Order") && newRecord.getValue("custbodyvoucheremailtempate") == 9) { //Deafult Value on Field Setting, this mean dont have set value before saving

            var emailTemplateID
            let soRec = N_1.record.load({
                type: "salesorder",
                id: newRecord.getValue("createdfrom")
            })
            if (soRec.getValue("custbody_website_so") && soRec.getValue("custbody_website_so") !== "") {
                //Basic SO Fulfillment
                emailTemplateID = const_1.EMAIL_TEMPLATE_ID_FOR_SO_REDEEMPTION

            } else {
                let earnedRewardsSearchResult = N_1.search.create({
                    type: "customrecord_iv_earned_rewards",
                    filters: [
                        [
                            ["custrecord_iv_source_sales_order", "anyof", newRecord.getValue("createdfrom")], "OR", ["custrecord_iv_er_gift_so", "anyof", newRecord.getValue("createdfrom")]
                        ]
                    ],
                    columns: [
                        "name",
                        "custrecord_iv_scheme",
                        "custrecord_iv_customer"
                    ]
                }).run().getRange({ start: 0, end: 1000 })

                log.debug("earnedRewardsSearchResult", earnedRewardsSearchResult)
                if (earnedRewardsSearchResult.length === 0) {
                    //Redeemption Fulfillment
                    emailTemplateID = const_1.EMAIL_TEMPLATE_ID_FOR_SO_REDEEMPTION
                } else {
                    //Earned Rewards Fulfillment
                    let erRec = earnedRewardsSearchResult[0]
                    let rewardSchemeRec = N_1.record.load({
                        type: "customrecord_iv_reward_scheme",
                        id: erRec.getValue("custrecord_iv_scheme")
                    })
                    emailTemplateID = rewardSchemeRec.getValue("custrecord_iv_email_template")
                }

            }
            let emailTemplateRec = N_1.record.load({
                type: "customrecordvoucheremailtemplate",
                id: emailTemplateID
            })
            log.debug("emailTemplateRec", emailTemplateRec);
            newRecord.setValue("custbodyvoucheremailtempate", emailTemplateID)
            // newRecord.setValue("custbodyvoucheremailsubject", emailTemplateID)
            log.debug("emailTemplateID", emailTemplateID,)
            log.debug("emailTemplateRec", emailTemplateRec.getValue("custrecordvoucheremailtextarea"));
            // newRecord.setValue("custbodyvoucheremailtempate", emailTemplateID)
            newRecord.setValue("custbodycoucheremailcontent", emailTemplateRec.getValue("custrecordvoucheremailtextarea"))
            newRecord.setValue("custbodyvoucheremailsubject", emailTemplateRec.getValue("custrecordvoucheremailsubject"))

        } else if (createdFromRecType.startsWith("Sales Order") && newRecord.getValue("custbodyvoucheremailtempate") != 9) {
            emailTemplateID = newRecord.getValue("custbodyvoucheremailtempate")
            let emailTemplateRec = N_1.record.load({
                type: "customrecordvoucheremailtemplate",
                id: emailTemplateID
            })
            log.debug("emailTemplateRec", emailTemplateRec);
            newRecord.setValue("custbodyvoucheremailtempate", emailTemplateID)
            // newRecord.setValue("custbodyvoucheremailsubject", emailTemplateID)
            log.debug("emailTemplateID", emailTemplateID,)
            log.debug("emailTemplateRec", emailTemplateRec.getValue("custrecordvoucheremailtextarea"));
            // newRecord.setValue("custbodyvoucheremailtempate", emailTemplateID)
            newRecord.setValue("custbodycoucheremailcontent", emailTemplateRec.getValue("custrecordvoucheremailtextarea"))
            newRecord.setValue("custbodyvoucheremailsubject", emailTemplateRec.getValue("custrecordvoucheremailsubject"))
        }
        // N_1.record.submitFields({
        //     type: "itemfulfillment",
        //     id: newRecord.id,
        //     values: {
        //         custbodyvoucheremailtempate: emailTemplateID,
        //         custbodycoucheremailcontent: emailTemplateRec.getValue("custrecordvoucheremailtextarea"),
        //         custbodyvoucheremailsubject: emailTemplateRec.getValue("custrecordvoucheremailsubject")
        //     }
        // })
    }

    function afterSubmit(context) {
        const { newRecord } = context
        if (newRecord.getValue("custbodyvoucheremailtempate") && newRecord.getValue("custbodyvoucheremailtempate") !== "") return true
        var emailTemplateID
        let soRec = N_1.record.load({
            type: "salesorder",
            id: newRecord.getValue("createdfrom")
        })
        if (soRec.getValue("custbody_website_so") && soRec.getValue("custbody_website_so") !== "") {
            //Basic SO Fulfillment
            emailTemplateID = const_1.EMAIL_TEMPLATE_ID_FOR_SO_REDEEMPTION

        } else {
            let earnedRewardsSearchResult = N_1.search.create({
                type: "customrecord_iv_earned_rewards",
                filters: [
                    [["custrecord_iv_source_sales_order", "anyof", newRecord.getValue("createdfrom")], "OR", ["custrecord_iv_er_gift_so", "anyof", newRecord.getValue("createdfrom")]]
                ],
                columns: [
                    "name",
                    "custrecord_iv_scheme",
                    "custrecord_iv_customer"
                ]
            }).run().getRange({ start: 0, end: 1000 })

            if (earnedRewardsSearchResult.length === 0) {
                //Redeemption Fulfillment
                emailTemplateID = const_1.EMAIL_TEMPLATE_ID_FOR_SO_REDEEMPTION
            } else {
                //Earned Rewards Fulfillment
                log.debug("earnedRewardsSearchResult", earnedRewardsSearchResult)
                let erRec = earnedRewardsSearchResult[0]
                let rewardSchemeRec = N_1.record.load({
                    type: "customrecord_iv_reward_scheme",
                    id: erRec.getValue("custrecord_iv_scheme")
                })
                emailTemplateID = rewardSchemeRec.getValue("custrecord_iv_email_template")
            }

        }
        let emailTemplateRec = N_1.record.load({
            type: "customrecordvoucheremailtemplate",
            id: emailTemplateID
        })
        N_1.record.submitFields({
            type: "itemfulfillment",
            id: newRecord.id,
            values: {
                custbodyvoucheremailtempate: emailTemplateID,
                custbodycoucheremailcontent: emailTemplateRec.getValue("custrecordvoucheremailtextarea"),
                custbodyvoucheremailsubject: emailTemplateRec.getValue("custrecordvoucheremailsubject")
            }
        })

    }

    return {
        // beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    }
});


