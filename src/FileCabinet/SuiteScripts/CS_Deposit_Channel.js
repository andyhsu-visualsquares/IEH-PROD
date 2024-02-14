function CS_Deposit_Channel()
{
  if(nlapiGetFieldValue('salesorder'))
	nlapiSetFieldValue('cseg1', nlapiLookupField('salesorder', nlapiGetFieldValue('salesorder'), 'cseg1'));
}