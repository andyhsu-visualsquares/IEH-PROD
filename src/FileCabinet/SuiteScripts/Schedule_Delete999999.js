function Schedule_Delete_Transaction()
{
	nlapiLogExecution('debug', 'Start');
	var searchid = 'customsearch955';
	var search = nlapiLoadSearch('transaction', searchid);
	checkGovernance();
	var Error_Count = 0;
	var resultSet = search.runSearch();
	checkGovernance();
	var indexID = 0;
	do
	{
		var searchresults = resultSet.getResults(indexID,indexID+999);
		// var searchresults = resultSet.getResults(0,998);
		// var searchresults = resultSet.getResults(0,1);
		nlapiLogExecution('debug', 'searchresults.length', searchresults.length);
		checkGovernance();
		for ( var i = 0; searchresults && i <searchresults.length ; i++ )
		// for ( var i = 0; i < 1 ; i++ )
		{
			nlapiLogExecution('debug', 'i', i);
			
			// var tranid = searchresults[i].getId();
			var columns = searchresults[i].getAllColumns();
			var internalID = searchresults[i].getValue(columns[0]);
			var type = searchresults[i].getValue(columns[1]);
			var InvID = searchresults[i].getValue(columns[2]);
			
			nlapiLogExecution('debug', 'To run', "internalID: " + internalID);
			nlapiLogExecution('debug', 'To run', type);
			// nlapiLogExecution('debug', 'To run', "InvID: " + InvID);
			var TxType = '';
			switch (type) {
				case 'SalesOrd':
				TxType = "salesorder";
				break;
				case 'PurchOrd':
				TxType = "purchaseorder";
				break;
				case 'VendBill':
				TxType = "vendorbill";
				break;
				case 'VendPymt':
				TxType = "vendorpayment";
				break;
				case 'FxReval':
				TxType = "NA";
				break;
				case 'ItemRcpt':
				TxType = "itemreceipt";
				break;
				case 'CustInvc':
				TxType = "invoice";
				break;
				case 'CustDep':
				TxType = "customerdeposit";
				break;
				case 'CustPymt':
				TxType = "customerpayment";
				break;
				case 'Journal':
				TxType = "journalentry";
				break;
				case 'DepAppl':
				TxType = "depositapplication";
				break;
				case 'ItemShip':
				TxType = "itemfulfillment";
				break;
				case 'TrnfrOrd':
				TxType = "transferorder";
				break;
				case 'Transfer':
				TxType = "NA";
				break;
				case 'Check':
				TxType = "NA";
				break;
				case 'VendAuth':
				TxType = "vendorreturnauthorization";
				break;
				case 'WorkOrd':
				TxType = "workorder";
				break;
				case 'InvAdjst':
				TxType = "inventoryadjustment";
				break;
				case 'Build':
				TxType = "assemblybuild";
				break;
				case 'VPrep':
				TxType = "vendorprepayment";
				break;
				case 'CustRfnd':
				TxType = "customerrefund";
				break;
				case 'CustCred':
				TxType = "creditmemo";
				break;
				case 'VPrepApp':
				TxType = "vendorprepaymentapplication";
				break;
				case 'VendCred':
				TxType = "vendorcredit";
				break;
				

				
			}
			nlapiLogExecution('debug', 'TxType', TxType);
			if (TxType != 'NA')
			{
				
				/*
				var rec = nlapiLoadRecord(TxType,internalID);
				checkGovernance();
				nlapiLogExecution('debug', 'loaded ' + TxType, internalID);
				// var linecount = rec.getLineItemCount('item');
				// nlapiLogExecution('debug', 'linecount' , linecount);
				// for ( var j = 1; j <= linecount ; j++ )
				// {
					// rec.setLineItemValue('item','class',j,1);
				// }
				rec.setFieldValue('class',1);
				nlapiSubmitRecord(rec);
				*/

				try
				{
					nlapiDeleteRecord(TxType,internalID);
					// nlapiDeleteRecord('invoice',InvID);
				}
				catch (error)
				{
					nlapiLogExecution('audit', 'error message: ' + error, "internalID: " + internalID);
				}
				checkGovernance();
			}
			checkGovernance();
			indexID++;
		}
	}while(searchresults.length >= 999);
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