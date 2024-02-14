function Schedule_Auto999999()
{
	// nlapiLogExecution('debug', 'Start');
	var Exeid = nlapiGetContext().getSetting('SCRIPT', 'custscript_executeid');
	nlapiSubmitField('customrecord999999adj', Exeid,'custrecord999999status','Runnning');
	
	nlapiLogExecution('debug', 'Start running');
	var Remarks = '';
	
	var searchid = 'customsearchauto999999';
	var search = nlapiLoadSearch('transaction', searchid);
	checkGovernance();
	var Error_Count = 0;
	var resultSet = search.runSearch();
	checkGovernance();
	var indexID = 0;
	do
	{
		var searchresults = resultSet.getResults(indexID,indexID+999);
		// var searchresults = resultSet.getResults(0,998);
		// var searchresults = resultSet.getResults(0,100);
		nlapiLogExecution('debug', 'searchresults.length', searchresults.length);
		checkGovernance();
		for ( var i = 0; searchresults && i <searchresults.length ; i++ )
		// for ( var i = 0; i < 2 ; i++ )
		{
			nlapiLogExecution('debug', 'i', i);
			
			// var tranid = searchresults[i].getId();
			var columns = searchresults[i].getAllColumns();
			var internalID = searchresults[i].getValue(columns[0]);
			var type = searchresults[i].getValue(columns[1]);
			// Credit Note / Invoice
			
			nlapiLogExecution('debug', 'internalID', internalID);
			nlapiLogExecution('debug', 'type', type);
			
			if (type == 'CustCred')
			{
				var rec = nlapiLoadRecord('creditmemo',internalID);
				Remarks += 'Credit Memo: ';
				checkGovernance();
			}
			else if (type == 'CustInvc')
			{
				var rec = nlapiLoadRecord('invoice',internalID);
				Remarks += 'Invoice: ';
				checkGovernance();
			}
			checkGovernance();
			nlapiLogExecution('debug', 'loaded ' + type, internalID);
			
			Remarks += rec.getFieldValue('tranid');
			
			var update = 0;
			
			var itemCount = rec.getLineItemCount('item');
			for ( var j = 1; j <= itemCount ; j++ )
			{	
				rec.selectLineItem('item',j);
				var itemID = rec.getCurrentLineItemValue('item','item');
				if(itemID == 513)
				{
					var memo = rec.getCurrentLineItemValue('item','description');
					// item has no stock. 4897095551755
					var memoLen = memo.length;
					if (memoLen == 32)
					{
						var lineProductCode = memo.substr(19,13);
						nlapiLogExecution('debug', 'barcode', lineProductCode);
						var lineQTY = rec.getCurrentLineItemValue('item','quantity');
						var lineRate = rec.getCurrentLineItemValue('item','rate');
						nlapiLogExecution('debug', 'barcode', lineProductCode);
						nlapiLogExecution('debug', 'lineQTY', lineQTY);
						nlapiLogExecution('debug', 'lineRate', lineRate);
						var Locationid = rec.getFieldValue('location');
						
						
						var ItemSearch = nlapiLoadSearch('item', 'customsearchpositem');
						checkGovernance();
						var Itemsearchfilter = ItemSearch.getFilters();
						Itemsearchfilter[0] = new nlobjSearchFilter('custitem_barcode', null, 'is', lineProductCode);
						ItemSearch.setFilters(Itemsearchfilter);
						var ItemSearchColumn = ItemSearch.getColumns();
						ItemSearchColumn[0] = new nlobjSearchColumn('islotitem', null);
						ItemSearch.setColumns(ItemSearchColumn);
						var ItemresultSet = ItemSearch.runSearch();
						checkGovernance();
						var ItemSearchresults = ItemresultSet.getResults(0,1);
						// nlapiLogExecution('debug', 'ItemSearchresults.length', ItemSearchresults.length);
						if (ItemSearchresults.length > 0)
						{
							var itemid = ItemSearchresults[0].getId();
							var columns = ItemSearchresults[0].getAllColumns();
							var islotitem = ItemSearchresults[0].getValue(columns[0]);
							// nlapiLogExecution('debug', 'islotitem', islotitem);
						}
						else
						{
							var itemid = 513; //(temp Item with error)
							rec.setCurrentLineItemValue('item','description','item is not matching');
						}
						
						// nlapiLogExecution('debug', 'itemid', itemid);
						rec.setCurrentLineItemValue('item','item',itemid);
						rec.setCurrentLineItemValue('item','quantity',lineQTY);
						rec.setCurrentLineItemValue('item','rate',lineRate);
						
						if (islotitem == 'T')
						{
							//
							var filters = new Array();
							filters[0] = new nlobjSearchFilter( 'item', null, 'anyOf', itemid);
							filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'GREATERTHANOREQUALTO', lineQTY);
							filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHANOREQUALTO', lineQTY);
							filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', Locationid);
							var columns = new Array();
							columns[0] = new nlobjSearchColumn('inventorynumber');
							columns[1] = new nlobjSearchColumn('expirationdate');
							columns[1].setSort(); 
							columns[2] = new nlobjSearchColumn('location');
							var LotNumSearch = nlapiCreateSearch('inventorynumber', filters, columns);
							checkGovernance();
							var Error_Count = 0;
							var LotNumSearchresultSet = LotNumSearch.runSearch();
							checkGovernance();
							var LotNumSearchresults = LotNumSearchresultSet.getResults(0,1);
							// nlapiLogExecution('debug', 'LotNumSearchresults.length', LotNumSearchresults.length);
							var LotNum = '';
							for ( var m = 0; LotNumSearchresults.length > 0 && LotNumSearchresults && m == 0 ; m++ )
							{
								// nlapiLogExecution('debug', 'm', m);
								var inventoryNumID = LotNumSearchresults[m].getId();
								var ResultColumns = LotNumSearchresults[m].getAllColumns();
								nlapiLogExecution('audit', 'LotNum Location', LotNumSearchresults[m].getValue(ResultColumns[2]));
								LotNum = LotNumSearchresults[m].getValue(ResultColumns[0]);
								nlapiLogExecution('audit', 'itemid = ' + itemid, 'LotNum = ' + LotNum);
							}
							if (LotNum != '')
							{	
							//
						
								var subrec = rec.createCurrentLineItemSubrecord('item', 'inventorydetail');
								subrec.selectNewLineItem('inventoryassignment');
								subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
								subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', lineQTY);
								subrec.commitLineItem('inventoryassignment');
								subrec.commit();
								update++;
							}
							else
							{
								rec.setCurrentLineItemValue('item','item',513);
								rec.setCurrentLineItemValue('item','description','item has no stock. ' + lineProductCode);
							}
						}
						if (update > 0)
						{
						rec.commitLineItem('item');
						}
						// invoiceAMT = invoiceAMT + (lineRate * lineQTY);

						// nlapiLogExecution('debug', 'invoiceAMT @ Line ' + j , invoiceAMT);
						
					}	
				}
			}
			
			Remarks += ' updated.\n'
          try{
			nlapiSubmitRecord(rec);
          }
          catch (err)
          {
            nlapiLogExecution('error', 'Invoice update error', internalID);
          }
          
			checkGovernance();
			indexID++;
		}
	}while(searchresults.length >= 999);
	var field = [];
	field[0] = 'custrecord999999status';
	field[1] = 'custrecord999999memo';
	var value = [];
	value[0] = 'Complete';
	value[1] = Remarks;
	
	nlapiSubmitField('customrecord999999adj', Exeid, field, value);
	
	nlapiLogExecution('debug', 'End');
}

function checkGovernance()
{
	var myGovernanceThreshold = 100;
	var context = nlapiGetContext();
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