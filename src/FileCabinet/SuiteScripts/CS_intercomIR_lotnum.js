function CS_intercomIR_lotnum(type, name)
{
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
}