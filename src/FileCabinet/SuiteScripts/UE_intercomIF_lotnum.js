function UE_intercomIF_lotnum(type)
{
	/*
	if(type=='item' && name=='quantity')
	{
		var soid = nlapiLookupField('purchaseorder', nlapiGetFieldValue('createdfrom'),'intercotransaction');
		if(soid)
		{
			var s = nlapiLoadSearch('itemfulfillment','customsearch_if_lotnum');
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('internalid', 'createdfrom', 'is', soid);
			nlapiLogExecution('debug', 'itemid', nlapiGetCurrentLineItemText('item','item'));//nlapiGetCurrentLineItemValue
			filters[1] = new nlobjSearchFilter('item', null, 'anyof', nlapiGetCurrentLineItemValue('item','item'));
			s.addFilters(filters);
			var result = s.runSearch().getResults(0,100);
			if(result[0])
			{
				var columns = result[0].getAllColumns();
				for(var i=0; i< result.length; i++)
				{
					nlapiLogExecution('debug', 'lotnumber', result[i].getValue(columns[1]));
				}
			}
		}
	}
	*/
	
	if(type!='delete' && nlapiGetFieldValue('custbodyincluderedeemvoucher')=='F')
	{
		var poid = nlapiLookupField('salesorder', nlapiGetFieldValue('createdfrom'),'intercotransaction');
		if(poid)
		{
			var ifrec = nlapiLoadRecord('itemfulfillment', nlapiGetRecordId());
			var count = ifrec.getLineItemCount('item');
          nlapiLogExecution('debug', 'count',count);
			var porec = nlapiLoadRecord('purchaseorder', poid);
			nlapiLogExecution('debug', 'poid', poid);
			for(var i=1; i<=count; i++)
			{
				var itemid = ifrec.getLineItemValue('item','item',i);
				var quantity1= ifrec.getLineItemValue('item','quantity',i);
				nlapiLogExecution('debug', 'itemid', itemid);
			//	var itemtype = nlapiLookupField('item', itemid, 'type');
				try{
					var itemrec = nlapiLoadRecord('lotnumberedinventoryitem', itemid);
				}
				catch(e)
				{
					continue;
				}
				var inventorydetailrec = ifrec.viewLineItemSubrecord('item','inventorydetail', i);
				var detailcount = inventorydetailrec.getLineItemCount('inventoryassignment');
				nlapiLogExecution('debug', 'detailcount',detailcount);
				for(var k=1; k<= porec.getLineItemCount('item'); k++)
				{
					if(porec.getLineItemValue('item', 'item', k)!=itemid)
						continue;
					else if(porec.getLineItemValue('item', 'quantity', k)!= quantity1)
						continue;
					porec.selectLineItem('item', k);
					var invDetailSubrecord = porec.viewCurrentLineItemSubrecord('item', 'inventorydetail');
					if(invDetailSubrecord != null)
					{
					   porec.removeCurrentLineItemSubrecord('item', 'inventorydetail');
					   porec.commitLineItem('item');
					}
					
					porec.selectLineItem('item', k);
					
					var subrec = porec.createCurrentLineItemSubrecord('item', 'inventorydetail');
				//var subrec = porec.editCurrentLineItemSubrecord('item', 'inventorydetail');
					for(var j=1; j<= detailcount; j++)
					{
						subrec.selectNewLineItem('inventoryassignment');
						subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', inventorydetailrec.getLineItemText('inventoryassignment', 'issueinventorynumber', j));
						nlapiLogExecution('debug', 'number', inventorydetailrec.getLineItemText('inventoryassignment', 'issueinventorynumber', j));
						subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', inventorydetailrec.getLineItemValue('inventoryassignment', 'quantity', j));
						subrec.setCurrentLineItemValue('inventoryassignment', 'expirationdate', inventorydetailrec.getLineItemValue('inventoryassignment', 'expirationdate', j));
						nlapiLogExecution('debug', 'quantity',inventorydetailrec.getLineItemValue('inventoryassignment', 'quantity', j));
						subrec.commitLineItem('inventoryassignment');
					}
					subrec.commit();
					porec.commitLineItem('item');
				}
			}
			nlapiSubmitRecord(porec);
		}
	}
	
}