function CS_SoldOutItem_Save()
{
  if(nlapiGetFieldValue('entity') != 334)
  {  
  if(nlapiGetFieldValue('custbody_check_soldout')=='F')
    {
	var count = nlapiGetLineItemCount('item');
	var flag = false;
	for(var i=1; i<=count; i++)
	{
		var itemid = nlapiGetLineItemValue('item', 'item', i);
		if(nlapiLookupField('item',itemid, 'custitem_soldout')=='T')
		{
			flag=true;
			break;
		}
	}
      nlapiSetFieldValue('custbody_check_soldout','T');
	if(flag==true)
	{
		
		var v = confirm('This order includes a sold out item, do you want to save this order?');
		
		return v;
	}
      else 
        return true;
      
    }
  else
  return true;
}
else
	return true;
}