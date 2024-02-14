function Schedule_Edit_Transaction()
{
	nlapiLogExecution('debug', 'Start');
	var searchid = 'customsearch716';
	var search = nlapiLoadSearch('transaction', searchid);
	checkGovernance();
	var Error_Count = 0;
	var resultSet = search.runSearch();
	checkGovernance();
	var indexID = 0;
	do
	{
		// var searchresults = resultSet.getResults(indexID,indexID+999);
		// var searchresults = resultSet.getResults(0,998);
		var searchresults = resultSet.getResults(0,1000);
		nlapiLogExecution('debug', 'searchresults.length', searchresults.length);
		checkGovernance();
		for ( var i = 0; searchresults && i <searchresults.length ; i++ )
			// for ( var i = 0; i < 1 ; i++ )
		{
			nlapiLogExecution('debug', 'i', i);
			
			// var tranid = searchresults[i].getId();
			var columns = searchresults[i].getAllColumns();
			var internalID = searchresults[i].getValue(columns[0]);
			var ShopID = searchresults[i].getValue(columns[1]);
			var payInternalID = searchresults[i].getValue(columns[2]);
			nlapiLogExecution('debug', 'internalID', internalID);
			nlapiLogExecution('debug', 'payInternalID', payInternalID);
			
			// if(ShopID == 11)
			// {
				// var channelid = 33;
				// var locationid = 332;
			// }
			// else
			// {
				// var channelid = 36;
				// var locationid = 337;
			// }
			
			if(payInternalID)
			{
				var successPay = nlapiDeleteRecord('customerpayment',payInternalID);
				// var successPay = 1;
				nlapiLogExecution('debug', 'successPay', successPay);
				// recPay.setFieldValue('location',locationid);
				// nlapiSubmitRecord(recPay);
			}
			
			var successInv = nlapiDeleteRecord('invoice',internalID);
			// var successInv = 2;
			nlapiLogExecution('debug', 'successInv', successInv);
			// recInv.setFieldValue('cseg1',channelid);
			// recInv.setFieldValue('location',locationid);
			// nlapiSubmitRecord(recInv);
			
			
			
			/*
			// var CMnum = searchresults[i].getValue(columns[5]);
			// var CMinternalid = searchresults[i].getValue(columns[6]);
			
			// nlapiLogExecution('debug', 'To run', internalID);
			// nlapiLogExecution('debug', 'To run', CMinternalid);
			
			
			var recCR = nlapiLoadRecord('customerrefund',internalID);
			checkGovernance();
			nlapiLogExecution('debug', 'loaded ' + 'customerrefund', internalID);
			
			var recCM = nlapiLoadRecord('creditmemo',CMinternalid);
			nlapiLogExecution('debug', 'loaded ' + 'creditmemo', CMinternalid);
			var invoiceID = recCM.getFieldValue('createdfrom');
			nlapiLogExecution('debug', 'invoiceID', invoiceID);
			var recInvoice = nlapiLoadRecord('invoice',invoiceID);
			nlapiLogExecution('debug', 'loaded ' + 'invoice', invoiceID);
			
			if(invoiceID)
			{
				var search2 = nlapiLoadSearch('transaction', 'customsearch395');
				// nlapiLogExecution('debug', 'Start Script', 'Start');
				var searchfilter2 = search2.getFilters();
				searchfilter2[2] = new nlobjSearchFilter('internalid', null, 'is', invoiceID);

				search2.setFilters(searchfilter2);
				var resultSet2 = search2.runSearch();
				var indexID2 = 0;

				do
				{
					var searchresults2 = resultSet2.getResults(indexID2,indexID2+998);
					nlapiLogExecution('debug', 'length', searchresults2.length);
					for ( var j = 0; searchresults2 && j <searchresults2.length ; j++ )
					{		
						var columns2 = searchresults2[j].getAllColumns();
						var invoiceInternalID = searchresults2[j].getValue(columns[0]);
						
						var PayID = searchresults2[j].getValue(columns[3]);
						nlapiLogExecution('debug', 'PayID', PayID);
						
						var recPay = nlapiLoadRecord('customerpayment',PayID);
						var paymentmethod = recPay.getFieldValue('paymentmethod');
						nlapiLogExecution('debug', 'paymentmethod', paymentmethod);
						
						
						indexID2 = indexID2 + 1;
					}
				}while(searchresults2.length>=998);
				
				
				
				
				recCR.setFieldValue('paymentmethod',paymentmethod);
				if (paymentmethod == 1)
				{
					recCR.setFieldValue('account',125);
				}
				nlapiSubmitRecord(recCR);
			}
			*/
			
			
			checkGovernance();
			
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