function UE_SO_BS(type)
{
	if(type != 'delete')
	{
		nlapiLogExecution('debug','Start');
        var shipdate = nlapiGetFieldValue('shipdate');
		var itemCount = nlapiGetLineItemCount('item');
		nlapiLogExecution('debug','itemCount', itemCount);
		for (var x = 1; x <= itemCount; x++)
		{
			nlapiLogExecution('debug','x', x);
			var QTY = nlapiGetLineItemValue('item','quantity',x);
			nlapiLogExecution('debug','QTY', QTY);
			nlapiSetLineItemValue('item','custcolorderqty',x,QTY);
          if(nlapiGetLineItemValue('item','custcolshipdate',x) == null || nlapiGetLineItemValue('item','custcolshipdate',x) == '' || nlapiGetLineItemValue('item','custcolshipdate',x) == 'null')
          {
          nlapiSetLineItemValue('item','custcolshipdate',x,shipdate);
          }
			nlapiLogExecution('debug','Line ' + x, 'Updated');
		}
		if(type == 'create')
		{
			if(nlapiGetFieldValue('intercotransaction'))
			{
				nlapiSetFieldValue('shipdate', nlapiLookupField('purchaseorder',nlapiGetFieldValue('intercotransaction'),'duedate'));
              nlapiSetFieldValue('custbody_printout_remark', nlapiLookupField('purchaseorder',nlapiGetFieldValue('intercotransaction'),'custbody_printout_remark'));
			}
		}
		
		nlapiLogExecution('debug','End');
	}
}
function UE_SO_BL(type)
{
	if(type!='delete')
	{
		form.setScript('customscriptue_so');
      	form.addButton('custpage_Add1','Assign Lot',"fxn_gen();");
		nlapiLogExecution('debug','Button Add');
	}
}

function UE_SO_BL2(type)
{	
	if(type=='copy'){
      
  var itemCount = nlapiGetLineItemCount('item');
		nlapiLogExecution('debug','itemCount', itemCount);
		for (var x = 1; x <= itemCount; x++)
		{

          nlapiSetLineItemValue('item','custcolshipdate',x,'');
          
        }
    }
}

function fxn_gen()
{
	nlapiLogExecution('debug', 'Script Start');
	var SOID = nlapiGetRecordId();
	// var recSO = nlapiLoadRecord('salesorder',SOID);
	nlapiLogExecution('debug', 'SOID',SOID);
	// nlapiLogExecution('debug', 'Script Start');
	// var SOID = nlapiGetFieldValue('createdfrom');
	// var SOName = nlapiGetFieldText('createdfrom');
	// nlapiLogExecution('debug', 'SOID', SOID);
	// nlapiLogExecution('debug', 'SOName', SOName);
	// var subStrSOName = SOName.substring(0, 5);
	// nlapiLogExecution('debug', 'subStrSOName', subStrSOName);
	// if (subStrSOName == 'Sales')
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
}
