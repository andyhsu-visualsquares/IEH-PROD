/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType restlet
 */
define(['N/record', 'N/search', 'N/url', 'N/https', './introv/CRM/DAO/RedeemCodeMasterDAO'], function (record, search, url, https, RedeemCodeMasterDAO) {
    function precision(a) {
        if (a) {
            if (!isFinite(a)) return 0;
            var e = 1, p = 0;
            while (Math.round(a * e) / e !== a) { e *= 10; p++; }
            return p;
        }
        else
            return 0;
    }

    function checkSaleNum(salesNum) {
        var mySearch = search.create({
            type: search.Type.SALES_ORDER,
            filters: [
                ['custbody_website_so', 'is', salesNum]
            ],
            columns: [
                search.createColumn({
                    name: 'internalid'
                })
            ]
        });

        var searchResult = mySearch.run().getRange({
            start: 0,
            end: 1
        });

        if (searchResult[0]) {
            return searchResult[0].getValue({
                name: 'internalid'
            });
        }
        else {
            return false;
        }
    }
    return {
        post: function (restletBody) {
            log.debug('restletBody', restletBody);
            log.debug('restletBody.tranDate', restletBody.tranDate);

            var NSCustomerID = restletBody.NSCustomerID;
            var salesNum = restletBody.salesNum;
            var customerPhone = restletBody.customerPhone;
            var tranDate = restletBody.tranDate;
            var depositMeth = restletBody.depositMeth;
            var tranTotal = restletBody.tranTotal;
            var discountCode = restletBody.discountCode;
            var customerEmail = restletBody.email;

            log.debug('total', tranTotal);
            log.debug('decimal place', precision(restletBody.tranTotal));
            var addressee = restletBody.shipaddressee;
            log.debug('addressee', addressee);
            var line = restletBody.lines;
            var total = 0;
            var flag = false;
            var customerflag = false;
            var salesflag = false;
            var evoucher = true;
            if (!restletBody.salesNum) {
                log.debug("sales number is empty");
                return { "Successful": "false", "Details": "sales number is empty" };
            }
            else {
                salesflag = checkSaleNum(restletBody.salesNum);
            }

            if (salesflag) {
                log.debug("exist sales order", salesflag);
                return { "Successful": "false", "Details": "Exist sales order with same number: " + salesflag };
            }
            if (!customerEmail) {
                log.debug("no email address");
                return { "Successful": "false", "Details": "email address is empty" };
            }
            if (!tranDate) {
                log.debug("no transaction date");
                return { "Successful": "false", "Details": "no transaction date" };
            }
            if (!depositMeth) {
                log.debug("no deposit method");
                return { "Successful": "false", "Details": "no deposit method" };
            }

            if (!tranTotal) {
                log.debug("no transaction total");
                return { "Successful": "false", "Details": "no transaction total" };
            }


            var lineinfo = true;
            log.debug("go to line");
            for (var i = 0; i < line.length; i++) {
                if (parseFloat(line[i].lineTotal) >= 0 && parseFloat(line[i].NSItemID) >= 0 && parseFloat(line[i].qty) >= 0 && parseFloat(line[i].unitPrice) >= 0) {
                }
                else {
                    lineinfo = false;


                    log.debug("no line info");
                    // log.debug("i",i);
                    // log.debug("line[i].lineTotal",line[i].lineTotal);
                    // log.debug("line[i].NSItemID",line[i].NSItemID);
                    // log.debug("line[i].qty",line[i].qty);
                    // log.debug("line[i].unitPrice",line[i].unitPrice);

                }
            }
            var evoucherflag;
            for (var i = 0; i < line.length; i++) {
                evoucherflag = search.lookupFields({
                    type: search.Type.ITEM,
                    id: line[i].NSItemID,
                    columns: ['custitemvoucherforemail']
                });
                if (evoucherflag['custitemvoucherforemail'] == false) {
                    evoucher = false;
                    log.debug('line:' + i, evoucherflag['custitemvoucherforemail']);
                    break;
                }
            }

            if (lineinfo == false) {
                log.debug("missing some line info");
                return { "Successful": "false", "Details": "missing some line info" };
            }
            else {
                log.debug("have line info");
            }

            if (!restletBody.shipcountry && evoucher == false) {
                log.debug("no shipping country");
                return { "Successful": "false", "Details": "no shipping country" };
            }

            for (var i = 0; i < line.length; i++) {
                total += parseFloat(line[i].lineTotal);
                log.debug("line " + i, line[i].lineTotal);
            }
            //tranTotal == lineTotal
            // if((parseFloat(total)).toFixed(2) != parseFloat(tranTotal))
            // {
            // log.debug("line total is not equal to transaction total","total:"+tranTotal+",line total:"+total);
            // return {"Successful": "false", "Details" : "line total is not equal to transaction total"};
            // }
            if (!NSCustomerID) {
                log.debug("no customer id");
                if (!!customerPhone || !!customerEmail) {
                    log.debug("customerPhone", customerPhone);
                    var mySearch = search.create({
                        type: search.Type.CUSTOMER,
                        filters: [
                            // 20231010 John Fern E-shop API for SO need not to use this field, use defualt field instead
                            // ['custentityposphone', 'is', customerPhone]
                            ["email", "is", customerEmail],
                            "OR",
                            ["phone", "haskeywords", customerPhone]
                        ],
                        columns: [
                            search.createColumn({
                                name: 'internalid'
                            })
                        ]
                    });

                    var searchResult = mySearch.run().getRange({
                        start: 0,
                        end: 1
                    });

                    if (searchResult[0]) {
                        NSCustomerID = searchResult[0].getValue({
                            name: 'internalid'
                        });
                        customerflag = true;
                        log.debug('Find Existing customer by phone', NSCustomerID);
                    }
                    else {
                        NSCustomerID = 51077
                        // var custRecord = record.create({
                        // 	type: record.Type.CUSTOMER,
                        // 	isDynamic: true
                        // });

                        // custRecord.setValue({
                        // 	fieldId: 'firstname',
                        // 	value: 'Temp',
                        // });
                        // custRecord.setValue({
                        // 	fieldId: 'lastname',
                        // 	value: 'Temp',
                        // });
                        // custRecord.setValue({
                        // 	 fieldId : 'isperson',
                        // 	 value : 'T'
                        // });
                        // custRecord.setValue({
                        // 	fieldId : 'category',
                        // 	value : '2'
                        // });
                        // custRecord.setValue({
                        // 	fieldId : 'custentity_customer_sub_category',
                        // 	value : 28
                        // });
                        // custRecord.setValue({
                        // 	fieldId : 'custentityposphone',
                        // 	value : customerPhone
                        // });
                        // custRecord.setValue({
                        // 	fieldId : 'subsidiary',
                        // 	value : 10
                        // });
                        // custRecord.setValue({
                        // 	fieldId : 'custentity_approve',
                        // 	value : true
                        // });
                        // custRecord.setValue({
                        // 	fieldId : 'custentity_pending_complete',
                        // 	value : true
                        // });
                        // custRecord.setValue({
                        // 	fieldId : 'custentity_to_be_updated',
                        // 	value : true
                        // });

                        // try{NSCustomerID = custRecord.save({
                        // 	enableSourcing : false,
                        // 	ignoreMandatoryFields : false
                        // });
                        log.debug('New Customer ID:', NSCustomerID);
                        flag = true;
                        // }catch(e){
                        // 	log.error({
                        // 		title: e.name,
                        // 		details: e.message
                        // 	});
                        // 	return {"success":false, "Details": "New Customer created unsuccessfully: " + e.message};
                        // }
                    }

                }
                else {
                    // return {"Success":false, "Details": "NSCustomerID is empty and Phone is empty"};
                    NSCustomerID = 51077

                }
            }
            else {

                var CustomerSearch = search.create({
                    type: search.Type.CUSTOMER,
                    filters: [
                        ['internalid', 'anyof', NSCustomerID]
                    ],
                    columns: [
                        search.createColumn({
                            name: 'internalid'
                        })
                    ]
                });

                var CustomersearchResult = CustomerSearch.run().getRange({
                    start: 0,
                    end: 1
                });

                if (!CustomersearchResult[0]) {
                    log.debug("this customer does not exist");
                    // return {"Success":false, "Details": "This customer id does not exist in NetSuite"};
                    NSCustomerID = 51077

                }
            }

            var SORecord = record.create({
                type: record.Type.SALES_ORDER,
                isDynamic: true
            });
            log.debug("SO Record");
            SORecord.setValue({
                fieldId: 'entity',
                value: NSCustomerID
            });
            var yyyy = tranDate.substring(6, 11);
            var mm = parseInt(tranDate.substring(3, 5)) - 1;
            var dd = tranDate.substring(0, 2);
            //	log.debug(yyyy);
            //	log.debug(parseFloat(tranDate.substring(3,5)));
            //	log.debug(mm);
            //	log.debug(dd);
            //	log.audit("trandate"+new Date(tranDate.substring(6,11),parseFloat(tranDate.substring(3,5))-1,tranDate.substring(0,2)));

            SORecord.setValue({
                fieldId: 'trandate',
                value: new Date(tranDate.substring(6, 11), parseFloat(tranDate.substring(3, 5)) - 1, tranDate.substring(0, 2))
            });

            var ThreeDay = new Date();
            var to0 = ThreeDay.getTimezoneOffset();
            // nlapiLogExecution('debug', 'to0', to0);
            var utc = ThreeDay.getTime() + (ThreeDay.getTimezoneOffset() * 60000);
            // nlapiLogExecution('debug', 'utc', utc);
            var hkTime = utc + (3600000 * 8);
            var newThreeDay = new Date(hkTime);

            newThreeDay.setDate(newThreeDay.getDate() + 4);
            log.debug('newThreeDay', newThreeDay);
            SORecord.setValue({
                fieldId: 'shipdate',
                value: newThreeDay
            });

            SORecord.setValue({
                fieldId: 'subsidiary',
                value: 10
            });

            var addr1 = restletBody.shipaddr1;

            if (discountCode) {
                var discountCodePrefix = discountCode.substring(0, 2);
                if (discountCodePrefix == 'CP' || discountCodePrefix == 'Cp' || discountCodePrefix == 'cP' || discountCodePrefix == 'cp') {
                    SORecord.setValue({
                        fieldId: 'cseg1',
                        value: 26
                    });
                }
                else {
                    SORecord.setValue({
                        fieldId: 'cseg1',
                        value: 3
                    });
                }
            }
            else if (addr1) {
                var addr1Prefix = addr1.substring(0, 2);
                if (addr1Prefix == 'CP' || addr1Prefix == 'Cp' || addr1Prefix == 'cP' || addr1Prefix == 'cp') {
                    SORecord.setValue({
                        fieldId: 'cseg1',
                        value: 26
                    });
                }
                else {
                    SORecord.setValue({
                        fieldId: 'cseg1',
                        value: 3
                    });
                }
            }
            else {
                SORecord.setValue({
                    fieldId: 'cseg1',
                    value: 3
                });
            }
            SORecord.setValue({
                fieldId: 'location',
                value: 209
            });
            SORecord.setValue({
                fieldId: 'custbodywebsitdiscountcode',
                value: discountCode
            });
            SORecord.setValue({
                fieldId: 'custbodyposjson',
                value: JSON.stringify(restletBody)
            });



            // if(evoucher==true)
            {
                SORecord.setValue({
                    fieldId: 'custbodyemailtonamevoucher',
                    value: restletBody.shipaddressee
                });
                SORecord.setValue({
                    fieldId: 'custbodyemailaddressvoucher',
                    value: restletBody.email
                });
            }
            //billing
            SORecord.setValue({
                fieldId: 'billaddresslist',
                value: ''
            });
            //end billing

            /*	SORecord.setValue({
                    fieldId: 'paymentmethod',
                    value: restletBody.depositMeth
                });*/
            var addrec = SORecord.getSubrecord({
                fieldId: 'shippingaddress'
            });
            addrec.setText({
                fieldId: 'country',
                text: restletBody.shipcountry
            });
            addrec.setValue({
                fieldId: 'addr1',
                value: restletBody.shipaddr1
            });
            addrec.setValue({
                fieldId: 'addr2',
                value: restletBody.shipaddr2
            });
            addrec.setValue({
                fieldId: 'addr3',
                value: restletBody.shipaddr3
            });
            addrec.setValue({
                fieldId: 'addressee',
                value: restletBody.shipaddressee
            });
            addrec.setValue({
                fieldId: 'addrphone',
                value: restletBody.shipphone
            });

            addrec.setValue({
                fieldId: 'state',
                value: restletBody.shipstate
            });
            addrec.setValue({
                fieldId: 'city',
                value: restletBody.shipcity
            });
            addrec.setValue({
                fieldId: 'zip',
                value: restletBody.shipzip
            });
            SORecord.setText({
                fieldId: 'orderstatus',
                text: 'Pending Fulfillment'
            });
            SORecord.setValue({
                fieldId: 'custbody_approval_status',
                value: 4
            });

            // if(depositMeth==6)
            {
                SORecord.setValue({
                    fieldId: 'custbodypaymentmethodonline',
                    value: depositMeth
                });
            }
            SORecord.setValue({
                fieldId: 'custbody_website_so',
                value: restletBody.salesNum
            });
            SORecord.setValue({
                fieldId: 'custbody_website_email',
                value: restletBody.email
            });
            //	SORecord.setValue({
            //		fieldId: 'custbodyincluderedeemvoucher',
            //		value: true
            //	});
            log.debug("SO Record line");
            var line = restletBody.lines;
            log.debug('line', line[0].qty);
            for (var i = 0; i < line.length; i++) {
                log.debug('item', line[i].NSItemID);
                SORecord.selectNewLine({
                    sublistId: 'item'
                });
                SORecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: line[i].NSItemID
                });
                SORecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: line[i].qty
                });
                SORecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'price',
                    value: -1
                });
                SORecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: line[i].unitPrice
                });
                SORecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount',
                    value: line[i].lineTotal
                });

                SORecord.commitLine({
                    sublistId: 'item'
                });
            }
            try {
                var recId = SORecord.save({
                    ignoreMandatoryFields: true
                });
                log.debug('new sales order created:', recId);

                // for (var i = 0; i < line.length; i++) {
                //     //20231116 Chris: + Redeem Code Master Logic For Changed Email QR Attachment Logic
                //     log.debug("giftedList", line[i].NSItemID)
                //     var redeemCodeMasterList = search.create({
                //         type: "customrecordrcmaster",
                //         filters:
                //             [
                //                 ["custrecordrcmastervoucheritem", "anyof", line[i].NSItemID],
                //                 "AND",
                //                 ["custrecordrcmasterused", "is", "F"],
                //                 "AND",
                //                 ["custrecordrcmastersentorsold", "is", "F"],
                //                 "AND",
                //                 ["isinactive", "is", "F"],
                //                 "AND",
                //                 ["custrecordredeemcodenoteffective", "is", "F"]
                //             ],
                //         columns:
                //             [
                //                 'internalid',
                //                 'name',
                //                 'custrecordrcmasterredeemprod',
                //                 'custrecordrcmastervoucheritem',
                //                 'custrecordrcmastersentorsold'
                //             ]
                //     }).run().getRange({ start: 0, end: 1000 })
                //     if (redeemCodeMasterList.length > 0) {
                //         var redeemCodeMasterDAO = new RedeemCodeMasterDAO()
                //         var bodyFieldsToBeUpdated = [
                //             {
                //                 field: 'custrecordrcmastersentorsold',
                //                 value: true,
                //                 valueType: 'value',
                //             },
                //             {
                //                 field: 'custrecordrcmastersalestransaction',
                //                 value: recId,
                //                 valueType: 'value',
                //             },
                //         ]
                //         log.debug("redeemCodeMasterList[0].id", redeemCodeMasterList[0].id)
                //         log.debug("bodyFieldsToBeUpdated", bodyFieldsToBeUpdated)
                //         for (let code = 0; code < line[i].qty; code++) {
                //             redeemCodeMasterDAO.update(redeemCodeMasterList[code].id, bodyFieldsToBeUpdated)
                //         }
                //     }

                // }




                if (restletBody.depositMeth != 6) {
                    var depositRecord = record.create({
                        type: record.Type.CUSTOMER_DEPOSIT,
                        isDynamic: true
                    });
                    depositRecord.setValue({
                        fieldId: 'customer',
                        value: NSCustomerID
                    });

                    if (discountCode) {
                        var discountCodePrefix = discountCode.substring(0, 2);
                        if (discountCodePrefix == 'CP' || discountCodePrefix == 'Cp' || discountCodePrefix == 'cP' || discountCodePrefix == 'cp') {
                            depositRecord.setValue({
                                fieldId: 'cseg1',
                                value: 26
                            });
                        }
                        else {
                            depositRecord.setValue({
                                fieldId: 'cseg1',
                                value: 3
                            });
                        }
                    }
                    else {
                        depositRecord.setValue({
                            fieldId: 'cseg1',
                            value: 3
                        })
                    }

                    if (addr1) {
                        var addr1Prefix = addr1.substring(0, 2);
                        if (addr1Prefix == 'CP' || addr1Prefix == 'Cp' || addr1Prefix == 'cP' || addr1Prefix == 'cp') {
                            depositRecord.setValue({
                                fieldId: 'cseg1',
                                value: 26
                            });
                        }
                        else {
                            depositRecord.setValue({
                                fieldId: 'cseg1',
                                value: 3
                            });
                        }
                    }
                    else {
                        depositRecord.setValue({
                            fieldId: 'cseg1',
                            value: 3
                        })
                    }

                    depositRecord.setValue({
                        fieldId: 'payment',
                        value: tranTotal
                    });
                    depositRecord.setValue({
                        fieldId: 'salesorder',
                        value: recId
                    });
                    depositRecord.setValue({
                        fieldId: 'paymentmethod',
                        value: restletBody.depositMeth
                    });
                    try {
                        var depositId = depositRecord.save({
                            ignoreMandatoryFields: true
                        });
                        log.debug('sales order deposit created:', depositId);

                        try {
                            var responseTier = https.post({
                                url: url.resolveScript({ scriptId: 'customscript_iv_create_so_web_sl', deploymentId: 'customdeploy_iv_create_so_web_sl', returnExternalUrl: true }),
                                body: JSON.stringify({
                                    newRecId: SORecord.id,
                                    newRecType: SORecord.type,
                                }),
                                headers: { name: 'Accept-Language', value: 'en-us' }
                            });
                            log.debug("responseTier result", JSON.stringify(responseTier.body));

                        }
                        catch (e) {
                            log.debug("customscript_iv_create_so_web_sl 1", e.message);
                        }
                        if (flag == true || customerflag == true)
                            return { "success": true, "NS_TransactionId": recId, "NSCustomerID": NSCustomerID };
                        else
                            return { "success": true, "NS_TransactionId": recId };
                    }
                    catch (e) {
                        log.debug("create sales deposit failed", e.message);
                        return { "success": false, "Details": "Sales Deposit Created unsuccessfully" };
                    }
                }
                else {
                    log.debug("create sales order successfully" + recId);

                    try {
                        var responseTier = https.post({
                            url: url.resolveScript({ scriptId: 'customscript_iv_create_so_web_sl', deploymentId: 'customdeploy_iv_create_so_web_sl', returnExternalUrl: true }),
                            body: JSON.stringify({
                                newRecId: SORecord.id,
                                newRecType: SORecord.type,
                            }),
                            headers: { name: 'Accept-Language', value: 'en-us' }
                        });
                        log.debug("responseTier result", JSON.stringify(responseTier.body));

                    }
                    catch (e) {
                        log.debug("customscript_iv_create_so_web_sl 2", e.message);
                    }
                    if (flag == true || customerflag == true)
                        return { "success": true, "NS_TransactionId": recId, "NSCustomerID": NSCustomerID };
                    else
                        return { "success": true, "NS_TransactionId": recId };
                }
            } catch (e) {
                log.error({
                    title: e.name,
                    details: e.message
                });
                return { "success": false, "Details": "Sales Order created unsuccessfully: " + e.message };
            }

        }
    }
}
);