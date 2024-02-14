function Schedule_RedemptionSyncPOS()
{	
	Logout();
	var LoginRes = Login();
	var url = "http://ieh.softether.net:8888/erunapitest/api.asmx/Product_UpdateStock";
	var header = {"Content-Type": "application/json","cookie": LoginRes};
	
	
	var itemSearch = nlapiLoadSearch('customrecordredemptionmain', 'customsearchredemptsynpos');
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
		{
			nlapiLogExecution('debug', 'i', i);
			var recid = itemSearchresults[i].getId();
			nlapiLogExecution('debug', 'recid', recid);
			var columns = itemSearchresults[i].getAllColumns();
			var locationID = itemSearchresults[i].getValue(columns[0])
			nlapiLogExecution('debug', 'locationID', locationID);
			var rec = nlapiLoadRecord('customrecordredemptionmain', recid);
			checkGovernance();
			var recError = 0;
			var lineCount = rec.getLineItemCount('recmachcustrecordredemptionmain');
			for (var x = 1; x <= lineCount; x ++)
			{
				nlapiLogExecution('debug', 'x', x);
				var itemid = rec.getLineItemValue('recmachcustrecordredemptionmain','custrecordredeemproduct',x);
				var stockUpdate = {};
				stockUpdate.SN = nlapiLookupField('location',locationID,'custrecordlocationposid');
				stockUpdate.BC = nlapiLookupField('item', itemid, 'custitem_barcode');
				stockUpdate.QU = -1;
			
				var requestBody = {};
				requestBody.jStockAdj = stockUpdate;
				var response = nlapiRequestURL(url, JSON.stringify(requestBody),header,'POST');
				var responseBody = JSON.parse(response.getBody());
				nlapiLogExecution('debug', 'responseBody', responseBody['d']);
				if(responseBody['d'] == 'success')
					rec.setLineItemValue('recmachcustrecordredemptionmain', 'custrecordredemptsubsyncpoc', x, 'T');
				else
				{
					rec.setLineItemValue('recmachcustrecordredemptionmain', 'custrecordredemptsubsyncpoc', x, 'F');
					recError = 1;
				}
			}
			if (recError == 0)
			{
				rec.setFieldValue('custrecordredepmtionposcompleted', 'T');
			}
			nlapiSubmitRecord(rec);
			
			
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

function Login()
{
	// Login URL
	var LoginURL = "http://ieh.softether.net:8888/erunapitest/api.asmx/System_Login?sUsername=999&sPassword=999"
	var LoginResponse = nlapiRequestURL(LoginURL,null,null,'GET');
	checkGovernance();
	// var LoginBody = LoginResponse.getBody();
	var LoginBody = LoginResponse.getHeader('Set-Cookie');
	nlapiLogExecution("debug","LoginBody",LoginBody);
	return LoginBody;
}
function Logout()
{
	// Logout URL
	var LogoutURL = "http://ieh.softether.net:8888/erunapitest/api.asmx/System_LogoutUser?sUsername=999"
	var LogoutResponse = nlapiRequestURL(LogoutURL,null,null,'GET');
	checkGovernance();
	var LogoutBody = LogoutResponse.getBody();
	nlapiLogExecution("debug","LogoutBody",LogoutBody);
}