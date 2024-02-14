function Sch_SO_inventoryDetails()
{
	nlapiLogExecution('debug', 'Script Start');
	var SOID = nlapiGetContext().getSetting('SCRIPT', 'custscript2');
	nlapiLogExecution('debug', 'SOID',SOID);

	{
		var recSO = nlapiLoadRecord('salesorder',SOID);
		
		
		var itemcount = recSO.getLineItemCount('item');
		nlapiLogExecution('debug', 'itemcount', itemcount);
		
		for (var x = 1; x <= itemcount; x++)
		{
			recSO.selectLineItem('item',x);
			var itemid = recSO.getCurrentLineItemValue('item','item');
			var itemtype = recSO.getCurrentLineItemValue('item','itemtype');
			nlapiLogExecution('debug', 'itemid', itemid);
			nlapiLogExecution('debug', 'itemtype', itemtype);
			if (itemtype == 'InvtPart')
			{
				var qty = recSO.getCurrentLineItemValue('item','quantity');
				var location = recSO.getFieldValue('location');
				
				nlapiLogExecution('debug', 'itemid', itemid);
				nlapiLogExecution('debug', 'qty', qty);
				nlapiLogExecution('debug', 'location', location);
				
				
				
				var ItemSearch = nlapiLoadSearch('item', 'customsearchassignlot');
				var Itemsearchfilter = ItemSearch.getFilters();
				Itemsearchfilter[0] = new nlobjSearchFilter('internalid', null, 'is', itemid);
				ItemSearch.setFilters(Itemsearchfilter);
				var ItemSearchColumn = ItemSearch.getColumns();
				ItemSearchColumn[0] = new nlobjSearchColumn('islotitem', null);
				ItemSearch.setColumns(ItemSearchColumn);
				var ItemresultSet = ItemSearch.runSearch();
				var ItemSearchresults = ItemresultSet.getResults(0,1);
				nlapiLogExecution('debug', 'ItemSearchresults.length', ItemSearchresults.length);
				if (ItemSearchresults.length > 0)
				{
					var itemid = ItemSearchresults[0].getId();
					var columns = ItemSearchresults[0].getAllColumns();
					var islotitem = ItemSearchresults[0].getValue(columns[0]);
					nlapiLogExecution('debug', 'islotitem', islotitem);
				}
				else
				{
					var islotitem = 'F';
					// recSO.setCurrentLineItemValue('item','description','item is not matching');
				}

				if (islotitem == 'T')
				{
					//
					var filters = new Array();
					filters[0] = new nlobjSearchFilter( 'item', null, 'anyOf', itemid);
					filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'GREATERTHANOREQUALTO', qty);
					filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHANOREQUALTO', qty);
					filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', location);
					var columns = new Array();
					columns[0] = new nlobjSearchColumn('inventorynumber');
					columns[1] = new nlobjSearchColumn('expirationdate');
					columns[1].setSort(); 
					var LotNumSearch = nlapiCreateSearch('inventorynumber', filters, columns);

					var Error_Count = 0;
					var LotNumSearchresultSet = LotNumSearch.runSearch();

					var LotNumSearchresults = LotNumSearchresultSet.getResults(0,1);
					nlapiLogExecution('debug', 'LotNumSearchresults.length', LotNumSearchresults.length);
					var LotNum = '';
					for ( var m = 0; LotNumSearchresults.length > 0 && LotNumSearchresults && m == 0 ; m++ )
					{
						nlapiLogExecution('debug', 'm', m);
						var inventoryNumID = LotNumSearchresults[m].getId();
						var ResultColumns = LotNumSearchresults[m].getAllColumns();
						LotNum = LotNumSearchresults[m].getValue(ResultColumns[0]);
						nlapiLogExecution('debug', 'LotNum', LotNum);
					}
					if (LotNum != '')
					{	
						nlapiLogExecution('debug', 'LotNum', 'details');
				
						var subrec = recSO.createCurrentLineItemSubrecord('item', 'inventorydetail');
						nlapiLogExecution('debug', 'subrec', 'subrec create');
						subrec.selectNewLineItem('inventoryassignment');
						subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
						subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', qty);
						subrec.commitLineItem('inventoryassignment');
						subrec.commit();
						nlapiLogExecution('debug', 'SubRecord Committed', 'Yes');
						nlapiLogExecution('debug', 'inventorydetail Update', 'Yes');
						recSO.commitLineItem('item');
						nlapiLogExecution('debug', 'item Line ' + x, 'completed');
						
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
		}
		
		nlapiSubmitRecord(recSO);
	}
	
}
