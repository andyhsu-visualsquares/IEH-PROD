function UE_Sales_Deposit_AS(type)
{
	if(type!='delete')
	{
		var createdfrom = nlapiGetFieldValue('salesorder');
		if(createdfrom)
		{
			nlapiLogExecution('debug', 'createdfrom', createdfrom);
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('salesorder', null, 'anyof', createdfrom);
			var columns = new Array();
			columns[0] = new nlobjSearchColumn('total', null,'sum');
			var result = nlapiSearchRecord('customerdeposit', null, filters, columns);
			
			
			var depositAmount = result[0].getValue(columns[0]);
			nlapiLogExecution('debug', 'depositAmount', depositAmount);
			nlapiSubmitField('salesorder', createdfrom, 'custbody_deposit_amount', depositAmount,true);
		//	var sorec = nlapiLoadRecord('salesorder', createdfrom);
		//	sorec.setFieldValue('custbody_deposit_amount', depositAmount);
		//	nlapiSubmitRecord(sorec);
		}
	}
}