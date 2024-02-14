function schedule_so_assigncode()
{
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custbody_assign_redeem_code', null, 'anyof', 1);
	filters[1] = new nlobjSearchFilter('custbody_approval_status', null, 'anyof', 4);
	filters[2] = new nlobjSearchFilter('custbody_massupdated', null, 'is', 'T');
	filters[3] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	var search1 = nlapiCreateSearch('salesorder', filters, null);
	var resultSet1 = search1.runSearch();
	var indexID1 = 0;
	do{
			var result1 = resultSet1.getResults(indexID1,indexID1+999);
           nlapiLogExecution('debug', 'kk<result1.length', kk<result1.length);
			if(result1[0])
			{
				for(var kk=0; result1 && kk<result1.length; kk++)
				{
					checkGovernance();
					SO_AssignCode(result1[kk].getId());
					indexID1++;
                    nlapiLogExecution('debug', 'SO #', result1[kk].getId());
				}
			}
		
	}while(search1.length>=999)
}