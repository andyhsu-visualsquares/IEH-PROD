function Schedule_POS_Member_AddBPT()
{
	Schedule_POS_Customer_AddBPT_Post();
}


function Schedule_POS_Customer_AddBPT_Post()
{	
	nlapiLogExecution("debug","Start");
	Logout();
	var LoginRes = Login();

	// CheckError();
	
	//Member_AddNew_JV2
	// var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Member_AddBPT_J";
	var url = "https://ithpos.app/erunapi/api.asmx/Member_AddBPT_J";
	
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/json","cookie": LoginRes};

	var requestBody = {};
	
	var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',6,'custrecordintegrationlibdate');
	nlapiLogExecution("debug","lastSyncDateTime",lastSyncDateTime);
	var lastSyncDateTime = '01/07/21 00:01';
	var today = new Date();
	var now = GetDateKeyddmmyyyy(today);
	// nlapiLogExecution("debug","now",now);
	
	
	var CustomerSearch = nlapiLoadSearch('transaction', 'customsearchonlinordertotal_2');
	checkGovernance();
	var Customersearchfilter = CustomerSearch.getFilters();
	nlapiLogExecution("debug","getFilters");
	Customersearchfilter[0] = new nlobjSearchFilter( 'datecreated', null, 'onorafter', lastSyncDateTime);
	CustomerSearch.setFilters(Customersearchfilter);
	nlapiLogExecution("debug","setFilters");
	var CustomerresultSet = CustomerSearch.runSearch();
	nlapiLogExecution("debug","runSearch");
	checkGovernance();
	var indexID = 0;
	do
	{
		var CustomerSearchresults = CustomerresultSet.getResults(indexID,indexID+999);
		nlapiLogExecution('debug', 'CustomerSearchresults.length', CustomerSearchresults.length);

		for ( var m = 0; CustomerSearchresults && m < CustomerSearchresults.length ; m++ )
		{
			nlapiLogExecution('debug', 'm', m);
			var TranID = CustomerSearchresults[m].getId();
			var ResultColumns = CustomerSearchresults[m].getAllColumns();
			var CustomerName = CustomerSearchresults[m].getValue(ResultColumns[0]);
			var CustomerPOSID = CustomerSearchresults[m].getValue(ResultColumns[1]);
			var PTS = CustomerSearchresults[m].getValue(ResultColumns[5]);
			
			var jBPTAdj = {};
			
				
			jBPTAdj.ID = CustomerPOSID;
			jBPTAdj.Pts = PTS;
			

			var requestBody = {};
			requestBody.jBPTAdj = jBPTAdj;
			nlapiLogExecution("debug","JSON.stringify(requestBody)",JSON.stringify(requestBody));
			var response = nlapiRequestURL(url,JSON.stringify(requestBody),header,'POST');
			checkGovernance();
			var ResponseBody = response.getBody();
			nlapiLogExecution("debug","ResponseBody",ResponseBody);
			
			datain = JSON.parse(ResponseBody);
			nlapiLogExecution('debug','datain',datain);
			var d = datain['d'];
			nlapiLogExecution("debug","d",d);
			// var error = datain.error;
			// var TXid = datain['TransactionID'];
			
			nlapiSubmitField('salesorder',TranID,'custbodypointearned','T');
			nlapiLogExecution("debug","Transaction" + TranID + 'Point Earned');
			CheckError();
			indexID++;
		}
	}while (CustomerSearchresults.length>=999);
	
	nlapiSubmitField('customrecordintegrationlib',6,'custrecordintegrationlibdate',now);
	nlapiLogExecution("debug","End");
}



function CheckError()
{
	// Check Error URL
	// var CheckErrorURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LastError"
	var CheckErrorURL = "https://ithpos.app/erunapi/api.asmx/System_LastError";
	var CheckErrorResponse = nlapiRequestURL(CheckErrorURL,null,null,'GET');
	checkGovernance();
	var CheckErrorBody = CheckErrorResponse.getBody();
	nlapiLogExecution("debug","CheckErrorBody",CheckErrorBody);
}
function Login()
{
	// Login URL
	// var LoginURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_Login?sUsername=888&sPassword=888"
	var LoginURL = "https://ithpos.app/erunapi/api.asmx/System_Login?sUsername=888&sPassword=888";
	var LoginResponse = nlapiRequestURL(LoginURL,null,null,'GET');
	checkGovernance();
	// var LoginBody = LoginResponse.getBody();
	var LoginBody = LoginResponse.getHeader('Set-Cookie');
	// nlapiLogExecution("debug","LoginBody",LoginBody);
	return LoginBody;
}
function Logout()
{
	// Logout URL
	// var LogoutURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LogoutUser?sUsername=888";
	var LogoutURL = "https://ithpos.app/erunapi/api.asmx/System_LogoutUser?sUsername=888";
	var LogoutResponse = nlapiRequestURL(LogoutURL,null,null,'GET');
	checkGovernance();
	var LogoutBody = LogoutResponse.getBody();
	// nlapiLogExecution("debug","LogoutBody",LogoutBody);
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

function GetDateKey(datestring)
{
	// var today = new Date();
	// nlapiLogExecution('debug', 'today', today);
	var to0 = datestring.getTimezoneOffset();
	// nlapiLogExecution('debug', 'to0', to0);
	var utc = datestring.getTime() + (datestring.getTimezoneOffset() * 60000);
	// nlapiLogExecution('debug', 'utc', utc);
	var hkTime = utc + (0);
	var newToday = new Date(hkTime);
	// nlapiLogExecution('debug', 'newToday', newToday);
	
	var yyyy = newToday.getFullYear();
	var mm = newToday.getMonth()+1;
	if (mm < 10)
	{
		mm = '0' + mm;
	}
	var dd = newToday.getDate();
	if (dd < 10)
	{
		dd = '0' + dd;
	}
	var hh = newToday.getHours();
	if (hh < 10)
	{
		hh = '0' + hh;
	}
	var min = newToday.getMinutes();
	if (min < 10)
	{
		min = '0' + min;
	}
	var sec = newToday.getSeconds();
	if (sec < 10)
	{
		sec = '0' + sec;
	}
	var msec = newToday.getMilliseconds();
	if (msec < 10)
	{
		msec = '0' + msec;
	}
	var fulldate = yyyy + "/" + mm + "/" + dd + " " + hh + ":" + min + ":" + sec;

	// nlapiLogExecution('debug', 'fulldate', fulldate);
	
	return fulldate;
}

function GetDateKeyddmmyyyy(datestring)
{
	// var today = new Date();
	// nlapiLogExecution('debug', 'today', today);
	var to0 = datestring.getTimezoneOffset();
	// nlapiLogExecution('debug', 'to0', to0);
	var utc = datestring.getTime() + (datestring.getTimezoneOffset() * 60000);
	// nlapiLogExecution('debug', 'utc', utc);
	var hkTime = utc + (3600000 * 8);
	var newToday = new Date(hkTime);
	// nlapiLogExecution('debug', 'newToday', newToday);
	
	var yyyy = newToday.getFullYear();
	var yyyystr = yyyy.toString();
	var yy = yyyystr.substring(2,4);
	var mm = newToday.getMonth()+1;
	if (mm < 10)
	{
		mm = '0' + mm;
	}
	var dd = newToday.getDate();
	if (dd < 10)
	{
		dd = '0' + dd;
	}
	var hh = newToday.getHours();
	if (hh < 10)
	{
		hh = '0' + hh;
	}
	var min = newToday.getMinutes();
	if (min < 10)
	{
		min = '0' + min;
	}
	var sec = newToday.getSeconds();
	if (sec < 10)
	{
		sec = '0' + sec;
	}
	var msec = newToday.getMilliseconds();
	if (msec < 10)
	{
		msec = '0' + msec;
	}
	var fulldate = dd + "/" + mm + "/" + yy + " " + hh + ":" + min;

	// nlapiLogExecution('debug', 'fulldate', fulldate);
	
	return fulldate;
}