function UE_SO_ItemFulfillment(type)
{
	if(type=='xedit' && nlapiGetFieldValue('custbody_create_if_status')==2)
	{
		var ifrec = nlapiTransformRecord('salesorder', nlapiGetRecordId(), 'itemfulfillment');
		var fulfillmentId = nlapiSubmitRecord(ifrec);
		nlapiSubmitField('salesorder', nlapiGetRecordId(), 'custbody_create_if_status', 3);
	}
}

function getToday()
{
	
}