/**
 * @NApiVersion 2.x
 * @NScriptType restlet
 */
define([ 'N/record', 'N/search' ], function(record, search) {
	return {
		post : function(restletBody) {
			log.debug('restletBody',restletBody);
						
			var restletData = restletBody;
			log.debug('restletData',restletData);
			var recordId = '';
				
			var RV_Code = restletData.RV_Code;
			log.debug('RV_Code',RV_Code);
			
			var RedeemLocation = restletData.location;
			log.debug('RedeemLocation',RedeemLocation);

			if (RV_Code)
			{

				var mySearch = search.create({
				type: 'customrecordrcmaster',
				filters: [
					['name', 'is', RV_Code]
					],
				columns: [
					search.createColumn({
						name: 'internalid'
						}),
					search.createColumn({
						name: 'name'
						}),
					search.createColumn({
						name: 'custrecordrcmastersentorsold'
						}),
					search.createColumn({
						name: 'custrecordrcmasterused',
						sort: search.Sort.ASC
						}),
					search.createColumn({
						name: 'isinactive'
						}),
                  search.createColumn({
						name: 'custrecordredeemcodenoteffective'
						}),
                  
					search.createColumn({
						name: 'custrecordrcmastersalestransaction'
						}),
					search.createColumn({
						name: 'trandate',
						join: 'custrecordrcmastersalestransaction'
						}),
					search.createColumn({
						name: 'custrecordrcmasterredeemprod'
						}),
					search.createColumn({
						name: 'incomeaccount',
						join: 'custrecordrcmasterredeemprod'
						}),
					search.createColumn({
						name: 'custrecordrcmastervoucheritem'
						}),
					search.createColumn({
						name: 'incomeaccount',
						join: 'custrecordrcmastervoucheritem'
						}),
					search.createColumn({
						name: 'custrecordrcmaster'
						}),
					search.createColumn({
						name: 'custrecordrcmasterchannel'
						}),
					search.createColumn({
						name: 'custrecordrcmasterredeemtransac'
						}),
					search.createColumn({
						name: 'created',
						join: 'custrecordrcmasterredeemtransac'
						}),
					search.createColumn({
						name: 'custrecord_effective_start_date'
						}),
					search.createColumn({
						name: 'custrecordrcmastereffectivedate'
						})
						
				]
				});
				
				var searchResult = mySearch.run().getRange({
				start:0,
				end:1
				});
				
				if(searchResult[0])
				{
					var code = searchResult[0].getValue({
						name: 'name'
					});
					var internalid = searchResult[0].getValue({
						name: 'internalid'
					});
					var redeemProd = searchResult[0].getValue({
						name: 'custrecordrcmasterredeemprod'
					});
					var redeemProdAcc = searchResult[0].getValue({
						name: 'incomeaccount',
						join: 'custrecordrcmasterredeemprod'
					});
					var voucherProd = searchResult[0].getValue({
						name: 'custrecordrcmastervoucheritem'
					});
					var voucherProdAcc = searchResult[0].getValue({
						name: 'incomeaccount',
						join: 'custrecordrcmastervoucheritem'
					});
					var Sold = searchResult[0].getValue({
						name: 'custrecordrcmastersentorsold'
					});
					var Used = searchResult[0].getValue({
						name: 'custrecordrcmasterused'
					});
					var inactive = searchResult[0].getValue({
						name: 'isinactive'
					});
                  var noteffective = searchResult[0].getValue({
						name: 'custrecordredeemcodenoteffective'
					});
                  
					var RedeemTran = searchResult[0].getValue({
						name: 'custrecordrcmasterredeemtransac'
					});
					var RedeemTranDate = searchResult[0].getValue({
						name: 'created',
						join: 'custrecordrcmasterredeemtransac'
					});
					var SalesPrice = searchResult[0].getValue({
						name: 'custrecordrcmaster'
					});
					var Channel = searchResult[0].getValue({
						name: 'custrecordrcmasterchannel'
					});
					var EffectiveStartDate = new Date(searchResult[0].getValue({
						name: 'custrecord_effective_start_date'
					}));
					var EffectiveEndDate = new Date(searchResult[0].getValue({
						name: 'custrecordrcmastereffectivedate'
					}));
				}
				else
				{
					var code = '';
					var internalid = '';
					var redeemProd = '';
					var Sold = '';
					var Used = '';
					var inactive = '';
					var RedeemTran = '';
					var RedeemTranDate = '';
					var voucherProd = '';
					var voucherProdAcc = '';
					var redeemProdAcc = '';
					var SalesPrice = 0;
					var Channel = '';
					var EffectiveStartDate='';
					var EffectiveEndDate = '';
                  var noteffective = '';
                  
				}
			}
			var today = new Date();
			if(today>= (EffectiveStartDate) && today<=  (EffectiveEndDate))
				log.debug('debug', 'date success');
			if (Sold == true && Used == false && noteffective == false && (RedeemTran == null || RedeemTran == 'null' || RedeemTran == '')) 
			{
				var recRedeem = record.create({
				   type : 'customrecordredeem',
				   isDynamic : true
				});
				var recRC = record.load({
					type: 'customrecordrcmaster', 
					id: internalid,
					isDynamic: true,
				});
				
				
				if(SalesPrice > 0)
			/*	{
					var recJN = record.create({
					   type : record.Type.JOURNAL_ENTRY,
					   isDynamic : true
					});
					
					recJN.setValue({
					 fieldId : 'custrecordredeemvouchercode',
					 value : RV_Code
					});
					
					var today = new Date();
					var to0 = today.getTimezoneOffset();
					var utc = today.getTime() + (today.getTimezoneOffset() * 60000);
					var hkTime = utc + (3600000 * 8);
					var newToday = new Date(hkTime);
					
					var approvalstatus = recJN.getValue({
						fieldId: 'approvalstatus'
					});
					log.debug('approvalstatus',approvalstatus);
					
					recJN.setValue({
					 fieldId : 'trandate',
					 value : newToday
					});
					recJN.setValue(
					{
					 fieldId : 'subsidiary',
					 value : 10
					});
					recJN.setValue(
					{
					 fieldId : 'approvalstatus',
					 value : 2
					});
					var memo = 'Generated From Redeem Voucher redemption with Code = ' + code;
					recJN.setValue(
					{
					 fieldId : 'memo',
					 value : memo
					});
					
					//Debit
					recJN.selectNewLine({
					sublistId: 'line'
					});
					recJN.setCurrentSublistValue({
						sublistId: 'line',
						fieldId: 'account',
						value: voucherProdAcc
					});
					recJN.setCurrentSublistValue({
						sublistId: 'line',
						fieldId: 'debit',
						value: SalesPrice
					});
					recJN.setCurrentSublistValue({
						sublistId: 'line',
						fieldId: 'location',
						value: RedeemLocation
					});
					recJN.setCurrentSublistValue({
						sublistId: 'line',
						fieldId: 'cseg1_2',
						value: Channel
					});
					recJN.setCurrentSublistValue({
						sublistId: 'line',
						fieldId: 'memo',
						value: memo
					});

					recJN.commitLine({
					sublistId: 'line'
					});
					// Credit
					recJN.selectNewLine({
					sublistId: 'line'
					});
					recJN.setCurrentSublistValue({
						sublistId: 'line',
						fieldId: 'account',
						value: redeemProdAcc
					});
					recJN.setCurrentSublistValue({
						sublistId: 'line',
						fieldId: 'credit',
						value: SalesPrice
					});
					recJN.setCurrentSublistValue({
						sublistId: 'line',
						fieldId: 'location',
						value: RedeemLocation
					});
					recJN.setCurrentSublistValue({
						sublistId: 'line',
						fieldId: 'cseg1',
						value: Channel
					});
					recJN.setCurrentSublistValue({
						sublistId: 'line',
						fieldId: 'memo',
						value: 'Generated From Redeem Voucher redemption'
					});

					recJN.commitLine({
					sublistId: 'line'
					});
					// NS_JNRecordId = recJN.save({
					   // enableSourcing : false,
					   // ignoreMandatoryFields : false
					// });
					log.debug('NS_JNRecordId',NS_JNRecordId);
					
					recRedeem.setValue(
					{
					 fieldId : 'custrecordredeemtx',
					 value : NS_JNRecordId
					});
				}
				*/
				recRedeem.setValue(
				{
				 fieldId : 'custrecordredeemvouchercode',
				 value : internalid
				});
				
				
				NS_RedeemRecordId = recRedeem.save({
				   enableSourcing : false,
				   ignoreMandatoryFields : false
				});
				log.debug('NS_RedeemRecordId',NS_RedeemRecordId);
				
				
				recRC.setValue(
				{
				 fieldId : 'custrecordrcmasterused',
				 value : true
				});
			recRC.setValue(
			{
				 fieldId : 'custrecordrcmasterredeemtransac',
				 value : NS_RedeemRecordId
				});
				
				NS_RCRecordId = recRC.save({
				   enableSourcing : false,
				   ignoreMandatoryFields : false
				});
				
				return {"success":true, "NS_RedeemRecordId":NS_RedeemRecordId};
			}
			else
			{
				return {"success":false, "Details":"Code is not valid"};
			}
		}
	}
}
);
