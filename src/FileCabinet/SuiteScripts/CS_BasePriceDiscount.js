function CS_QuoBasicprice_FieldChange(type, name)
{
   if ((type == 'item') && (name == 'custcol_base_price')) 
   {
		var percent = nlapiGetCurrentLineItemValue('item','custcol_discount_percentage');
		var base = nlapiGetCurrentLineItemValue('item','custcol_base_price');
		var itemid = nlapiGetCurrentLineItemValue('item','item');
		var itemtype = nlapiGetCurrentLineItemValue('item','itemtype');
		// nlapiLogExecution('debug','itemid', itemid);
		// nlapiLogExecution('debug','base', base);
		// nlapiLogExecution('debug','percent', percent);
		// nlapiLogExecution('debug','itemtype', itemtype);
		if (itemtype == 'NonInvtPart' || itemtype == 'InvtPart')
		{
			if (base != null && base != '' && base != 'null' && percent != null && percent != '' && percent != 'null')
			{
				var rate = parseFloat(base) * (1 - parseFloat(percent)/100);
				nlapiLogExecution('debug','rate', rate);
				nlapiSetCurrentLineItemValue('item','rate',rate);
			}
		}
   }
   if ((type == 'item') && (name == 'custcol_discount_percentage')) 
   {
		var percent = nlapiGetCurrentLineItemValue('item','custcol_discount_percentage');
		var base = nlapiGetCurrentLineItemValue('item','custcol_base_price');
		var itemid = nlapiGetCurrentLineItemValue('item','item');
		var itemtype = nlapiGetCurrentLineItemValue('item','itemtype');
		// nlapiLogExecution('debug','itemid', itemid);
		// nlapiLogExecution('debug','base', base);
		// nlapiLogExecution('debug','percent', percent);
		// nlapiLogExecution('debug','itemtype', itemtype);
		if (itemtype == 'NonInvtPart' || itemtype == 'InvtPart')
		{
			if (base != null && base != '' && base != 'null' && percent != null && percent != '' && percent != 'null')
			{
				var rate = parseFloat(base) * (1 - parseFloat(percent)/100);
				nlapiLogExecution('debug','rate', rate);
				nlapiSetCurrentLineItemValue('item','rate',rate);
			}
		}
   }
}