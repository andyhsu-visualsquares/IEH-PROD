function CS_SO_address(type, name)
{
	if(name==='item' && type==='item')
	{
		if(!nlapiGetCurrentLineItemValue('item','custcoldelivery')&& nlapiGetCurrentLineItemValue('item', 'item') && nlapiGetFieldValue('shipaddresslist')>0)
		{
			nlapiSetCurrentLineItemValue('item', 'custcoldelivery',nlapiGetFieldValue('shipaddresslist'));
			nlapiLogExecution('debug',nlapiGetFieldValue('shipaddresslist'));
			nlapiSetCurrentLineItemValue('item', 'custcol_delivery_address',nlapiGetFieldValue('shipaddress'));
		}
   //   if(!nlapiSetCurrentLineItemValue('item', 'createpo',''))
  //    nlapiSetCurrentLineItemValue('item', 'createpo','');
	}
	return true;
}

function CS_shipdate()
{
  var date1 = nlapiDateToString(nlapiAddDays(nlapiStringToDate(nlapiGetFieldValue('trandate')),3),'date');
  nlapiSetFieldValue('shipdate',date1);
}