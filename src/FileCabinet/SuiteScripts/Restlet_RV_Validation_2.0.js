/**
 * @NApiVersion 2.x
 * @NScriptType restlet
 */
define([ 'N/record', 'N/search' ], function(record, search) {
	return {
		post : function(restletBody) {
			log.debug('1');
			log.debug('restletBody',restletBody);
						
			var restletData = restletBody;
			log.debug('restletData',restletData);
			var recordId = '';
				
			var RV_Code = restletData.RV_Code;
			log.debug('RV_Code',RV_Code);

			log.debug('2');
			var objRecord = record.create({
			   type : 'customrecordredeem',
			   isDynamic : true
			});
			log.debug('3');

			if (RV_Code)
			{
				// var mySearch = search.load({
				// id: 'customsearchrvcheckscriptuse'
				// });
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
						name: 'custrecordrcmasterredeemprod'
						}),
					search.createColumn({
						name: 'custrecordrcmastersentorsold',
                      sort: search.Sort.DESC
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
						name: 'custrecordrcmasterredeemtransac'
						}),
					search.createColumn({
						name: 'created',
						join: 'custrecordrcmasterredeemtransac'
						}),
					search.createColumn({
						name: 'custrecordrcmasterredeemvalue'
						}),
					search.createColumn({
						name: 'custrecord_effective_start_date'
						}),
					search.createColumn({
						name: 'custrecordrcmastereffectivedate'
						}),
						search.createColumn({
						name: 'custrecordrcmastervoucheritem'
						}),
						search.createColumn({
						name: 'custrecordredeemvoucheritem'
						})
						
				]
				});
				
				var searchResult = mySearch.run().getRange({
				start:0,
				end:1
				});
				// var index = 0;
				// if(searchResult[0])
				// log.debug('max', searchResult[0].getValue(searchitem.columns[0]));
				
				if(searchResult[0])
				{
					var code = searchResult[0].getValue({
						name: 'name'
					});
					var internalid = searchResult[0].getValue({
						name: 'internalid'
					});
					var redeemProd = searchResult[0].getText({
						name: 'custrecordrcmasterredeemprod'
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
					var RedeemTran = searchResult[0].getValue({
						name: 'custrecordrcmasterredeemtransac'
					});
					var RedeemTranDate = searchResult[0].getValue({
						name: 'created',
						join: 'custrecordrcmasterredeemtransac'
					});
					var RedeemValue = searchResult[0].getValue({
						name: 'custrecordrcmasterredeemvalue'
					});
					var EffectiveStartDate = searchResult[0].getValue({
						name: 'custrecord_effective_start_date'
					});
					var EffectiveEndDate = searchResult[0].getValue({
						name: 'custrecordrcmastereffectivedate'
					});
                  var NotEffective = searchResult[0].getValue({
						name: 'custrecordredeemcodenoteffective'
					});
					var voucherItem = searchResult[0].getText({
						name: 'custrecordrcmastervoucheritem'
					});
					var voucherRedeemItem = searchResult[0].getText({
						name: 'custrecordredeemvoucheritem'
					});
					if (!voucherRedeemItem)
					{
						voucherRedeemItem = voucherItem;
					}
                  if (inactive == true || inactive == 'T')
                    {
                      NotEffective = inactive;
                    }
                  
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
					var RedeemValue = '';
					var EffectiveStartDate='';
					var EffectiveEndDate = '';
                  var NotEffective = '';
				  var voucherItem = '';
				  var voucherRedeemItem = '';
					
				}
				log.debug('code',code);
				log.debug('internalid',internalid);
				log.debug('redeemProd',redeemProd);
				log.debug('Sold',Sold);
				log.debug('Used',Used);
				log.debug('inactive',inactive);
				log.debug('RedeemTran',RedeemTran);
				log.debug('RedeemTranDate',RedeemTranDate);
              log.debug('NotEffective',NotEffective);
			  log.debug('EffectiveStartDate',EffectiveStartDate);
				 log.debug('voucherItem',voucherItem);
				 log.debug('voucherRedeemItem',voucherRedeemItem);
				// mySearch.run().each(function(result) 
				// {
					// var code = result.getValue({
						// name: 'name'
					// });
					// log.debug('code',code);
					// var internalid = result.getValue({
						// name: 'internalid'
					// });
					// log.debug('internalid',internalid);
					// var Sold = result.getValue({
						// name: 'custrecordrcmastersentorsold'
					// });
					// log.debug('Sold',Sold);
					// var Used = result.getValue({
						// name: 'custrecordrcmasterused'
					// });
					// log.debug('Used',Used);
					// var inactive = result.getValue({
						// name: 'isinactive'
					// });
					// log.debug('inactive',inactive);
					// var SalesTran = result.getValue({
						// name: 'custrecordrcmastersalestransaction'
					// });
					// log.debug('SalesTran',SalesTran);
					
					// return {"code":code, "Sold":Sold, "Used":Used, "inactive":inactive, "SalesTran":SalesTran};
				// });
			}
			
			// if (RV_Code) 
			// {
				// objRecord.setValue({
				 // fieldId : 'custrecordredeemvouchercode',
				 // value : RV_Code
				// });
			// }
			
			// log.debug('code',code);
			// recordId = objRecord.save({
			   // enableSourcing : false,
			   // ignoreMandatoryFields : false
			// });
			// log.debug('recordId',recordId);
		
			// log.debug('5');
			
			return {"code":code, "redeemProd":redeemProd, "RedeemValue":RedeemValue, "Sold":Sold, "Used":Used, "inactive":NotEffective, "RedeemTran":RedeemTran, "RedeemTranDate":RedeemTranDate, "EffectiveStartDate":EffectiveStartDate, "EffectiveEndDate": EffectiveEndDate, "VoucherItem":voucherRedeemItem};
		}
	}
}
);
