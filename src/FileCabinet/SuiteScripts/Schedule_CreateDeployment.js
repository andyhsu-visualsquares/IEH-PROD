function Schedule_CreateDeployment()
{
	nlapiLogExecution('audit', 'Start');

	// var Scriptid = 754;
	var Scriptid = searchScriptID('Schedule_Redemption');
	nlapiLogExecution('debug', 'Scriptid', Scriptid);
	var count = 500;
	for (var x = 1; x <= count; x++)
	{
		nlapiLogExecution('debug','x : ' + x);
		var recDepl = nlapiCreateRecord('scriptdeployment', {'script':Scriptid});
		checkGovernance();
		nlapiLogExecution('debug','x : ' + x, 'recDepl: ' + recDepl);
		recDepl.setFieldValue('status','NOTSCHEDULED');
		
		var Deployid = nlapiSubmitRecord(recDepl);
		checkGovernance();
		nlapiLogExecution('debug','x : ' + x, 'Deployid: ' + Deployid);
	}
	

	
	nlapiLogExecution('audit', 'End');
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

function searchScriptID(scriptNamedId)
{
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'name', null, 'is', scriptNamedId);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('internalid').setSort();

	var Search = nlapiCreateSearch('scheduledscript', filters, columns);
	
	var SearchResultSet = Search.runSearch();
	var Searchresults = SearchResultSet.getResults(0,1);
	nlapiLogExecution('debug', 'Searchresults.length', Searchresults.length);
	nlapiLogExecution('debug', 'Searchresults()', JSON.stringify(Searchresults));
	if (Searchresults.length > 0)
	{
		var columns = Searchresults[0].getAllColumns();
		result = Searchresults[0].getValue(columns[0]);
	}
	else 
	{
		result = 0;
	}
	nlapiLogExecution('debug', 'result', result);
	return result;
}