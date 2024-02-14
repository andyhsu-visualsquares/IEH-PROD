function UE_DefaultInventoryDetails_BL(type, name)
{
	nlapiLogExecution('debug', 'Script Start');
	var SOID = nlapiGetFieldValue('createdfrom');
	var SOName = nlapiGetFieldText('createdfrom');
	nlapiLogExecution('debug', 'SOID', SOID);
	nlapiLogExecution('debug', 'SOName', SOName);
	var subStrSOName = SOName.substring(0, 5);
	nlapiLogExecution('debug', 'subStrSOName', subStrSOName);
	if (subStrSOName == 'Sales')
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
			}
		}
	}
	form.setScript('customscriptcs_itemfulfill');
	fxn_reload()
}


