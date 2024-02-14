function schedule_if_fulfillncode()
{
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custbody_assign_redeem_code', null, 'anyof', 4);
	filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	filters[2] = new nlobjSearchFilter('cseg1', null, 'anyof', 3);
	var search1 = nlapiCreateSearch('itemfulfillment', filters, null);
    
 //   var search1 = nlapiLoadSearch('itemfulfillment','customsearch271')
	var resultSet1 = search1.runSearch();
	var indexID1 = 0;
	nlapiLogExecution('debug', 'indexID1', indexID1);
	do{
			var result1 = resultSet1.getResults(indexID1,indexID1+999);
			if(result1[0])
			{
				for(var kk=0; result1 && kk<result1.length; kk++)
				{
					nlapiLogExecution('debug', 'id', result1[kk].getId());
					checkGovernance();
					IF_fulfillcode(result1[kk].getId());
					indexID1++;
				}
			}
		
	}while(search1.length>=999)
}