function Suitlet_createWO(request, response)
{
	
	var recId = request.getParameter('id');
	nlapiLogExecution('debug', 'recId', recId);
	var rec = nlapiLoadRecord('salesorder',recId);
	nlapiLogExecution('debug', 'SO loaded', recId);
	
	
	var WOGen = rec.getFieldValue('custbodywogenerated');
	nlapiLogExecution('debug', 'WOGen', WOGen);
	if (WOGen == 'F')
	{
		var info = 'Work order is started generating now<br/><br/>';
		
		var linecount = rec.getLineItemCount('item');
		for( var a = 1; a <= linecount; a++ )
		{
			var itemtype = rec.getLineItemValue('item','itemtype',a);
			nlapiLogExecution('debug', 'itemtype' + a, itemtype);
			if (itemtype == 'InvtPart')
			{
				var itemid = rec.getLineItemValue('item','item',a);
				var qty = rec.getLineItemValue('item','quantity',a);
				var recItem = nlapiLoadRecord('inventoryitem', itemid);
				var AssItemID = recItem.getFieldValue('custitemitemassitem');
				if (AssItemID)
				{
					
					var BOMSearch = nlapiLoadSearch('bom', 'customsearch414');
					var Error_Count = 0;
					var searchfilter = BOMSearch.getFilters();
					searchfilter[0] = new nlobjSearchFilter('assembly', 'assemblyitem', 'is', AssItemID);
					BOMSearch.setFilters(searchfilter);
					var BOMSearchresultSet = BOMSearch.runSearch();
					var BOMSearchresults = BOMSearchresultSet.getResults(0,1);
					
					for(var i = 0; i < BOMSearchresults.length; i++)
					{
						nlapiLogExecution('debug', 'i', i);
						var BOMid = BOMSearchresults[i].getId();
						var columns = BOMSearchresults[i].getAllColumns();
						var Revid = BOMSearchresults[i].getValue(columns[1]);
						nlapiLogExecution('debug', 'BOMid = ' + BOMid, 'Revid = ' + Revid);
						var recWO = nlapiCreateRecord('workorder');
						recWO.setFieldValue('subsidiary', 11);
						recWO.setFieldValue('location', 110);
						recWO.setFieldValue('assemblyitem', AssItemID);
						recWO.setFieldValue('billofmaterials', BOMid);
						recWO.setFieldValue('billofmaterialsrevision', Revid);
						recWO.setFieldValue('quantity', qty);
						
						
						var RoutingSearch = nlapiLoadSearch('manufacturingrouting', 'customsearch416');
						var Error_Count = 0;
						var searchfilter = RoutingSearch.getFilters();
						searchfilter[0] = new nlobjSearchFilter('billofmaterials', null, 'is', BOMid);
						RoutingSearch.setFilters(searchfilter);
						var RoutingSearchresultSet = RoutingSearch.runSearch();
						var RoutingSearchresults = RoutingSearchresultSet.getResults(0,1);
						
						for(var j = 0; j < RoutingSearchresults.length; j++)
						{
							nlapiLogExecution('debug', 'j', j);
							var Routingid = RoutingSearchresults[j].getId();
							// var columns = RoutingSearchresults[j].getAllColumns();
							// var Revid = RoutingSearchresults[j].getValue(columns[2]);
							nlapiLogExecution('debug', 'Routingid = ', Routingid);
							recWO.setFieldValue('iswip', 'T');
							recWO.setFieldValue('manufacturingrouting', Routingid);
						}
						if(RoutingSearchresults.length == 0)
						{
							info += 'Line ' + a + ' have no Manufacturing Routing!!<br/><br/>';
						}
						recWO.setFieldValue('custbodyendcustomerso', recId);
						
						// var linecount = recWO.getLineItemCount('item');
						// nlapiLogExecution('debug', 'linecount = ', linecount);
						try 
						{
							var WOid = nlapiSubmitRecord(recWO);
							var WOTranID = nlapiLookupField('workorder',WOid,'tranid');
							var url  = nlapiResolveURL('RECORD', 'workorder', WOid);
						
							var recLink = nlapiCreateRecord('customrecordwosolink');
							recLink.setFieldValue('custrecordwosolinkso',recId);
							recLink.setFieldValue('custrecordwosolinkwo',WOid);
							var Linkid = nlapiSubmitRecord(recLink);
							
							var IntercompTransaction = rec.getFieldValue('intercotransaction');
							nlapiLogExecution('debug', 'IntercompTransaction', IntercompTransaction);
							if (IntercompTransaction)
							{
								var recPO = nlapiLoadRecord('purchaseorder',IntercompTransaction);
								var EndCusSO = recPO.getFieldValue('createdfrom');
								nlapiSubmitField('workorder', WOid, 'custbodyendcustomerso', EndCusSO);
								nlapiSubmitField('salesorder', recId, 'custbodyendcustomerso', EndCusSO);
							}
							else
							{
								var EndCusSO = recId;
							}
							
							nlapiLogExecution('debug', 'EndCusSO', EndCusSO);
							
							if(EndCusSO)
							{
								var recEndCusSO = nlapiLoadRecord('salesorder',EndCusSO);
								
								var EndCusSOLineCount = recEndCusSO.getLineItemCount('item');
								
								for(var k = 1; k <= EndCusSOLineCount; k++)
								{
									var recSODetail = nlapiCreateRecord('customrecordsodetailsinwo');
									recSODetail.setFieldValue('custrecordsodetailsinwowonum',WOid);
									recSODetail.setFieldValue('custrecordsodetailsinwosointercomp',recId);
									recSODetail.setFieldValue('custrecordsodetailsinwosoendcust',EndCusSO);
									recSODetail.setFieldValue('custrecordsodetailsinwointercompdate',rec.getFieldValue('trandate'));
									recSODetail.setFieldValue('custrecordsodetailsinwoendcustdate',recEndCusSO.getFieldValue('trandate'));
									recSODetail.setFieldValue('custrecordsodetailsinwosalesitem',recEndCusSO.getLineItemValue('item','item',k));
									recSODetail.setFieldValue('custrecordsodetailsinwoitemdesc',recEndCusSO.getLineItemValue('item','description',k));
									recSODetail.setFieldValue('custrecordsodetailsinwoqty',recEndCusSO.getLineItemValue('item','quantity',k));
									recSODetail.setFieldValue('custrecordsodetailsinwounit',recEndCusSO.getLineItemValue('item','units',k));
									var SODetailID = nlapiSubmitRecord(recSODetail);
									nlapiLogExecution('debug', 'SODetailID' + k, SODetailID);
								}
							}
							
							info += 'Work order <a href="' + url + '">  ' + WOTranID + '</a>   generated successfully.<br/><br/>';
						}
						catch(err) 
						{
							info += 'Line ' + a + ' having error when generating Work Order. Please Create Manually!!<br/>';
							info += 'Line ' + a + ' : ' + err;
							
						}						
					}
					if (BOMSearchresults.length == 0)
					{
						info += 'Line ' + a + ' have no active BOM!!!<br/><br/>';
					}
				}
				else
				{
					info += 'Line ' + a + ' having error when generating Work Order. Please Create Manually!!<br/><br/>';
					info += 'Line ' + a + ' : ' + ' No Assembly Item in the Sales Item Record. ';
				}
			}
		}
		//end SO link
		
		nlapiSubmitField('salesorder', recId, 'custbodywogenerated', 'T');
		//complete
		info += 'Work order generation Completed.';
		response.write(info);
	}
	else
	{
		var info = 'Work order generated before.';
		response.write(info);
	}
}