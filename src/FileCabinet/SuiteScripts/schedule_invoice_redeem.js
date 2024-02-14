function schedule_invoice_redeem()
{
	var filters1 = new Array();
	filters1[0] = new nlobjSearchFilter('custbodyincluderedeemvoucher', null, 'is', 'T');
//	filters1[1] = new nlobjSearchFilter('custbody_assign_redeem_code', null, 'anyof', 1);
	filters1[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	filters1[2] = new nlobjSearchFilter('custbodypossalesid', null, 'isnotempty');
	filters1[3] = new nlobjSearchFilter('custbody_assign_redeem_code', null, 'anyof', 1);
	var columns1 = new Array();
	columns1[0] = new nlobjSearchColumn('internalid').setSort();
	var invoicesearch = nlapiCreateSearch('invoice', filters1, columns1);
	var invoiceresultSet = invoicesearch.runSearch();
	var invoiceindexID = 0;
	do{
		var invoiceresult = invoiceresultSet.getResults(invoiceindexID,invoiceindexID+999);
		nlapiLogExecution('debug', 'invoice search length', invoiceresult.length);
		if(invoiceresult[0])
		{
			for(var kk=0; invoiceresult && kk<invoiceresult.length; kk++)
						
			{
				var recid = invoiceresult[kk].getId();
				nlapiLogExecution('debug', 'recid', recid);
				
				var rec = nlapiLoadRecord('invoice', recid);
				checkGovernance();
				var count = rec.getLineItemCount('item');
				var flag = false;
				nlapiLogExecution('audit', 'Assign Redeem Code Start');
				for(var i=1; i<=count; i++)
				{	
					var channel = rec.getFieldValue('cseg1');
				//	var redeemItem = nlapiLookupField('item', rec.getLineItemValue('item', 'item',i),'custitemredeemingitem');
				//	var redeemValue = nlapiLookupField('item', rec.getLineItemValue('item', 'item',i),'custitemredeemingvalue');
				//	var isReddemItem = nlapiLookupField('item', rec.getLineItemValue('item', 'item',i),'custitemisredeemvoucher');
					
					nlapiLogExecution('debug', 'itemtype', rec.getLineItemValue('item', 'itemtype',i));
					if(rec.getLineItemValue('item', 'itemtype',i)=='NonInvtPart')
					{
						var itemrec = nlapiLoadRecord('noninventoryitem',	rec.getLineItemValue('item', 'item',i));
						var redeemItem = itemrec.getFieldValue('custitemredeemingitem');
						var redeemValue = itemrec.getFieldValue('custitemredeemingvalue');
						var isReddemItem = itemrec.getFieldValue('custitemisredeemvoucher');
						var itemclass = itemrec.getFieldValue('class');
						nlapiLogExecution('debug', 'redeemItem', redeemItem);
						nlapiLogExecution('debug', 'redeemItem Value', redeemValue);
						nlapiLogExecution('debug', 'isReddemItem', isReddemItem);
						nlapiLogExecution('debug', 'itemclass', itemclass);
						if(isReddemItem=='T' && (itemclass==1040||itemclass==1043))
						{
							if(redeemItem || redeemValue)
							{
								var itemid = rec.getLineItemValue('item', 'item',i);
								var redeemcount = rec.getLineItemValue('item', 'quantity', i);
								var price = rec.getLineItemValue('item','rate', i);
								var flagcount = 0;
							do	{
								var filters = new Array();
								filters[0] = new nlobjSearchFilter('custrecordrcmastervoucheritem', null, 'anyof', itemid);
								filters[1] = new nlobjSearchFilter('custrecordrcmastersalestransaction', null, 'is', '@NONE@');
								filters[2] = new nlobjSearchFilter('custrecordrcmastersentorsold', null, 'is', 'F');
								filters[3] = new nlobjSearchFilter('custrecordrcmasterused', null, 'is', 'F');
								filters[4] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
								if(channel)
								filters[5] = new nlobjSearchFilter('custrecordrcmasterchannel', null, 'anyof', channel);
								var columns = new Array();
								columns[0] = new nlobjSearchColumn('internalid').setSort();
								var search = nlapiCreateSearch('customrecordrcmaster', filters, columns);
								
								
							  //  var search = nlapiLoadSearch('customrecordrcmaster', 'customsearch53');
							//	search.addFilter(filters[0]);
								
								var resultSet = search.runSearch();
								var indexID = 0;
								do{
									var result = resultSet.getResults(indexID,indexID+999);
									nlapiLogExecution('debug', 'search length', result.length);
									if(result[0])
									{
										for(var k=0; result && k<result.length && flagcount<redeemcount; k++)
										{
											checkGovernance();
											var fields = new Array();
											fields[0] = 'custrecordrcmastersalestransaction';
											fields[1] = 'custrecordrcmaster';
											fields[2] = 'custrecord_fulfillment';
											fields[3] = 'custrecordrcmastersentorsold';
											var values = new Array();
											values[0] = recid;
											values[1] = price;
											values[2] = recid;
											values[3] = 'T';
											nlapiSubmitField('customrecordrcmaster',result[k].getId(), fields, values);
											indexID++;
											flagcount++;
											
										}
										if(flagcount>=redeemcount)
											break;
									}
									else
									{
										nlapiLogExecution('debug', 'no search result');
									}
									
								}while(result.length>=999);
							}while(redeemcount>flagcount);
								nlapiLogExecution('audit', 'Assgin Redeem to this item Finished');
							}
						}
					}
				}

					nlapiLogExecution('audit', 'Redeem Code Task Complete');
					nlapiSubmitField('invoice', recid, 'custbody_assign_redeem_code',5);
				invoiceindexID++;
			}	
		}
	}while(invoiceresult.length>=999)
}

function checkGovernance()
{
	var myGovernanceThreshold = 300;
	var context = nlapiGetContext();
 // 	nlapiLogExecution('debug', 'remainingUsage',context.getRemainingUsage());
	if( context.getRemainingUsage() < myGovernanceThreshold )
	{
		var state = nlapiYieldScript();
		if( state.status == 'FAILURE')
	{
		nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
		throw "Failed to yield script";
	} 
		else if ( state.status == 'RESUME' )
	{
		nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
	}
		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
	}
}