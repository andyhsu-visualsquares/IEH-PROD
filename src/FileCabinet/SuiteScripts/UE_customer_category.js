function UE_customer_category(type)
{
	if(type=='create')
	{
		nlapiSetFieldValue('category', 1,false, false);
		nlapiSetFieldValue('custentity_customer_sub_category',3, false, false);
		nlapiLogExecution('debug', 'enter');
	}
}

function UE_customer_category_sourcing()
{
//	if(type=='create')
	{
	//	nlapiSetFieldValue('category', 1,false, false);
		if(!nlapiGetFieldValue('custentity_customer_sub_category'))
		nlapiSetFieldValue('custentity_customer_sub_category',3, false, false);
		nlapiLogExecution('debug', 'enter');
	}
}