function UE_SO_totalQty(type)
{
	if(type!='delete')
	{
		var qty = 0;
		for(var i=1; i<=nlapiGetLineItemCount('item'); i++)
		{
			qty += parseFloat(nlapiGetLineItemValue('item', 'quantity', i));
		}
		nlapiSetFieldValue('custbody_total_qty', qty);
	}
}