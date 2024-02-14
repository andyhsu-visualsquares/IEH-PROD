function Schedule_CopyRedeemCode()
{
	nlapiLogExecution('debug', 'Start');
	var searchid = 'customsearch780';
	var search = nlapiLoadSearch('file', searchid);
	checkGovernance();
	var Error_Count = 0;
	var resultSet = search.runSearch();
	checkGovernance();
	var indexID = 0;
	do
	{
		// var searchresults = resultSet.getResults(indexID,indexID+999);
		var searchresults = resultSet.getResults(0,998);
		// var searchresults = resultSet.getResults(0,1);
		nlapiLogExecution('debug', 'searchresults.length', searchresults.length);
		checkGovernance();
		for ( var i = 0; searchresults && i <searchresults.length ; i++ )
			// for ( var i = 0; i < 1 ; i++ )
		{
			nlapiLogExecution('debug', 'i', i);
			
			// var tranid = searchresults[i].getId();
			var columns = searchresults[i].getAllColumns();
			var code = searchresults[i].getValue(columns[0]);

			nlapiLogExecution('debug', 'code', code);
			
			var internalid = CodeInternalIDsearch(code);
			
			if(internalid > 0)
			{
				var rec = nlapiCopyRecord('customrecordrcmaster', internalid);
				checkGovernance();
				rec.setFieldValue('name',code);
				var recID = nlapiSubmitRecord(rec);
				checkGovernance();
				nlapiLogExecution('debug', 'recID', recID);
			}
			
			
			checkGovernance();
			indexID++;
		}
	}
	while(searchresults.length >= 999);
	nlapiLogExecution('debug', 'End');
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

function CodeInternalIDsearch(code)
{
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'name', null, 'is', code);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('internalid');

	var Search = nlapiCreateSearch('customrecordrcmaster', filters, columns);
	
	var SearchResultSet = Search.runSearch();
	var Searchresults = SearchResultSet.getResults(0,1);
	nlapiLogExecution('debug', 'Code Searchresults.length', Searchresults.length);
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