function CS_itemUnit(type, name)
{
  //	nlapiLogExecution('error', nlapiLookupField('item',nlapiGetCurrentLineItemValue('item','item'),'type'));
	if(type=='item' && name =='units' && nlapiGetCurrentLineItemValue('item','item')&& nlapiGetCurrentLineItemValue('item','units')&& nlapiLookupField('item',nlapiGetCurrentLineItemValue('item','item'),'type')!='NonInvtPart')
	{
		var unit = nlapiGetCurrentLineItemValue('item','units');
		nlapiLogExecution('debug', 'unit', unit);
		var itemid = nlapiGetCurrentLineItemValue('item', 'item');
      
		var itemrec;
		try{
			itemrec = nlapiLoadRecord('lotnumberedinventoryitem', itemid);
		}
		catch(e)
		{
			itemrec = nlapiLoadRecord('inventoryitem', itemid);
		}
		var stockunit = itemrec.getFieldValue('stockunit');
		var purchaseunit = itemrec.getFieldValue('purchaseunit');
		var saleunit = itemrec.getFieldValue('saleunit');
		var baseunit = itemrec.getFieldValue('baseunit');
		var flag = false;
		if(unit == stockunit)
			flag = true;
		else if(unit == purchaseunit)
			flag = true;
		else if(unit == saleunit)
			flag = true;
		else if(unit == baseunit)
			flag = true;
		if(flag == false)
		{
			alert('Input wrong unit');
			nlapiSetCurrentLineItemValue('item','units',saleunit);
			return false;
		}
		else
			return true;
	}
}