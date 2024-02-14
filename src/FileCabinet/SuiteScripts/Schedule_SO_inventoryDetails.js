function Schedule_SO_inventoryDetails()
{
	nlapiLogExecution('debug', 'Script Start');
	var SOID = nlapiGetContext().getSetting('SCRIPT', 'custscript_soid1');
	var trantype = nlapiGetContext().getSetting('SCRIPT', 'custscript_trantype');
	nlapiLogExecution('debug', 'SOID',SOID);

	{
		var recSO = nlapiLoadRecord(trantype,SOID);
		
		
		var itemcount = recSO.getLineItemCount('item');
		nlapiLogExecution('debug', 'itemcount', itemcount);
		
		for (var x = 1; x <= itemcount; x++)
		{
			
			recSO.selectLineItem('item',x);
			var itemid = recSO.getCurrentLineItemValue('item','item');
			var itemtype = recSO.getCurrentLineItemValue('item','itemtype');
			nlapiLogExecution('debug', 'itemid', itemid);
			nlapiLogExecution('debug', 'itemtype', itemtype);
		//	if (itemtype == 'InvtPart')
			{
				var qty = recSO.getCurrentLineItemValue('item','quantity');
				var tranunit = recSO.getCurrentLineItemValue('item', 'units');
				var location = recSO.getFieldValue('location');
				
				nlapiLogExecution('debug', 'itemid', itemid);
				nlapiLogExecution('debug', 'qty', qty);
				nlapiLogExecution('debug', 'location', location);
				
				
				
				{
					//
					var filters = new Array();
					filters[0] = new nlobjSearchFilter( 'item', null, 'anyOf', itemid);
					filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'greaterthan', 0);
				//	filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHANOREQUALTO', qty);
					filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', location);
					var columns = new Array();
					columns[0] = new nlobjSearchColumn('inventorynumber');
					columns[1] = new nlobjSearchColumn('expirationdate');
					columns[1].setSort(); 
					columns[2] = new nlobjSearchColumn('quantityavailable');
					columns[3] = new nlobjSearchColumn('unitstype', 'item');
					var LotNumSearch = nlapiCreateSearch('inventorynumber', filters, columns);

					var Error_Count = 0;
					var LotNumSearchresultSet = LotNumSearch.runSearch();

					var LotNumSearchresults = LotNumSearchresultSet.getResults(0,100);
					nlapiLogExecution('debug', 'LotNumSearchresults.length', LotNumSearchresults.length);
					var LotNum = '';
					
					
					if(LotNumSearchresults[0])
					{
						recSO.setFieldValue('custbodyautoassignlot', 'T');
						var remainquantity = parseFloat(qty);
						
						var invDetailSubrecord = recSO.viewCurrentLineItemSubrecord('item',     'inventorydetail');
						 if(invDetailSubrecord != null)
						{
							recSO.removeCurrentLineItemSubrecord('item', 'inventorydetail');
							recSO.commitLineItem('item');
						}
						var unitconvert = unitconversion1(LotNumSearchresults[0].getValue(columns[3]), tranunit);
						var subrec = recSO.createCurrentLineItemSubrecord('item', 'inventorydetail');
						for ( var m = 0; LotNumSearchresults.length > 0 && LotNumSearchresults && m<LotNumSearchresults.length; m++ )
						{
							nlapiLogExecution('debug', 'm', m);
							var inventoryNumID = LotNumSearchresults[m].getId();
							var ResultColumns = LotNumSearchresults[m].getAllColumns();
							LotNum = LotNumSearchresults[m].getValue(ResultColumns[0]);
							var lotquantity = parseFloat(LotNumSearchresults[m].getValue(ResultColumns[2]))/parseFloat(unitconvert);
							nlapiLogExecution('debug', 'LotNum', 'details:'+LotNum);
							nlapiLogExecution('debug', 'remainquantity:'+remainquantity, 'lotquantity:'+lotquantity);
							if(remainquantity<=lotquantity)
							
							{
							
							nlapiLogExecution('debug', 'subrec', 'subrec create');
							subrec.selectNewLineItem('inventoryassignment');
							subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
							subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', remainquantity);
							subrec.commitLineItem('inventoryassignment');
						//	subrec.commit();
							nlapiLogExecution('debug', 'SubRecord Committed', 'Yes');
							nlapiLogExecution('debug', 'inventorydetail Update', 'Yes');
							
							nlapiLogExecution('debug', 'item Line ' + x, 'completed');
							break;
							}
							else
							{
								nlapiLogExecution('debug', 'subrec', 'subrec create');
								subrec.selectNewLineItem('inventoryassignment');
								subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
								subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', lotquantity);
								subrec.commitLineItem('inventoryassignment');
							//	subrec.commit();
								nlapiLogExecution('debug', 'SubRecord Committed', 'Yes');
								nlapiLogExecution('debug', 'inventorydetail Update', 'Yes');
								remainquantity = parseFloat(remainquantity) - parseFloat(lotquantity);
							
							nlapiLogExecution('debug', 'item Line ' + x, 'completed11');
							}
						}
						nlapiLogExecution('debug', 'aaa');
						subrec.commit();
						
					}
					
				}
				
				
				/*
				var searchid = 'customsearchifscript';
				var search = nlapiLoadSearch('inventorynumber', searchid);
				var Error_Count = 0;
				var resultSet = search.runSearch();
				var searchresults = resultSet.getResults(0,1);
				nlapiLogExecution('debug', 'Search Result', searchresults.length);
				var LotNum = '';
				for ( var i = 0; searchresults && i == 0 ; i++ )
				{
					var inventoryNumID = searchresults[i].getId();
					var columns = searchresults[i].getAllColumns();
					LotNum = searchresults[i].getValue(columns[0]);
				}
				if (LotNum != '')
				{
					var subrecord = recSO.viewCurrentLineItemSubrecord('item', 'inventorydetail');
					nlapiLogExecution('debug', 'SubRecord Loaded', subrecord);
					if(!subrecord)
					{
						var subrecord = recSO.createCurrentLineItemSubrecord('item', 'inventorydetail');
						// var subrecord = nlapiEditCurrentLineItemSubrecord('item', 'inventorydetail');
						
						nlapiLogExecution('debug', 'SubRecord Created', subrecord);
							subrecord.selectNewLineItem('inventoryassignment');
							// subrecord.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', LotNum);
							subrecord.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
							subrecord.setCurrentLineItemValue('inventoryassignment', 'quantity', qty);
							subrecord.commitLineItem('inventoryassignment');
							nlapiLogExecution('debug', 'SubRecord Line Created', 'Yes');
						subrecord.commit();
						nlapiLogExecution('debug', 'SubRecord Committed', 'Yes');
						
						nlapiLogExecution('debug', 'inventorydetail Update', 'Yes');
						recSO.commitLineItem('item');
						nlapiLogExecution('debug', 'item Line ' + i, 'completed');
						nlapiSubmitRecord(recSO);
					}
				}
				*/
			}
			recSO.commitLineItem('item');
		}
		
		nlapiSubmitRecord(recSO);
	}
	
}

function unitconversion1(unitTypeId, unitid)
{
	nlapiLogExecution('debug', 'unit', unitTypeId+', '+unitid);
	var unitrec = nlapiLoadRecord('unitstype', unitTypeId);
	nlapiLogExecution('debug', 'unitrec', 'Loaded');
	var count = unitrec.getLineItemCount('uom');
	nlapiLogExecution('debug', 'uomcount', count);
	var unitconvert;
	var salesunitconvert;
	for(var i=1; i<=count; i++)
	{
		if(unitid == unitrec.getLineItemValue('uom','internalid', i))
		{
			nlapiLogExecution('debug', 'unitconversion.conversionrate', unitrec.getLineItemValue('uom','conversionrate', i));
			unitconvert = unitrec.getLineItemValue('uom','conversionrate', i);
		}
	
	}
	
	return (parseFloat(unitconvert) );
	
}