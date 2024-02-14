function Schedule_ForDelete()
{	
	var itemSearch = nlapiLoadSearch('customrecordrcmaster', 'customsearch838');
	checkGovernance();
	var Error_Count = 0;
	var itemSearchresultSet = itemSearch.runSearch();

	
	checkGovernance();
	 

	var indexID = 0;
	do
	{
		var itemSearchresults = itemSearchresultSet.getResults(indexID,indexID+999);
		checkGovernance();
		for(var i = 0; i < itemSearchresults.length; i++) 
		// for(var i = 0; i < itemSearchresults.length; i++) 
		{
			nlapiLogExecution('debug', 'i', i);
			var recid = itemSearchresults[i].getId();
			
			var columns = itemSearchresults[i].getAllColumns();
			
			var recid = itemSearchresults[i].getValue(columns[0]);
			var itemNum = itemSearchresults[i].getValue(columns[1]);
			nlapiLogExecution('debug', 'codeid = ' + recid, 'itemNum = ' + itemNum);
			try
			{
			nlapiDeleteRecord('customrecordrcmaster',recid);
			}
			catch(err)
			{
				nlapiLogExecution('error', 'errmsg = ', err);
			}
			//nlapiSubmitField('customrecordrcmaster',recid, 'custrecordrcmastereffectivedate', '28/09/2019');
			checkGovernance();
			//nlapiSubmitField('customrecordrcmaster',recid, 'custrecordredeemcodenoteffective', 'F');
			checkGovernance();
			indexID++;
		} 
	}while(itemSearchresults.length>=999);
	checkGovernance();
	
	

	
	nlapiLogExecution("debug","Script End");
	
}

function checkGovernance()
{
	var myGovernanceThreshold = 100;
	var context = nlapiGetContext();
	if( context.getRemainingUsage() < myGovernanceThreshold )
	{
		var state = nlapiYieldScript();
		if( state.status == 'FAILURE')
	{
		nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
		throw "Failed to yield script";
	} 
		else if ( state.status == 'RESUME' )
	{
		nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
	}
		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
	}
}