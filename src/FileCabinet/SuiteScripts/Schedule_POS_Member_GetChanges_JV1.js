function Schedule_POS_Member_GetChanges_JV1()
{	
	Logout();
	var LoginRes = Login();

	// CheckError();
	
	//Product_AddNew_J
	var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Member_GetChanges_JV1";
	
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/json","cookie": LoginRes};

	var requestBody = {};
	
	var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',1,'custrecordintegrationlibdate');
	// nlapiLogExecution("debug","lastSyncDateTime",lastSyncDateTime);
	var today = new Date();
	var now = GetDateKey(today);
	// nlapiLogExecution("debug","now",now);
	
	requestBody.vBeginTime = lastSyncDateTime;
	nlapiLogExecution("debug","requestBody.vBeginTime",requestBody.vBeginTime);
	var response = nlapiRequestURL(url,JSON.stringify(requestBody),header,'POST');
	var ResponseBody = response.getBody();
	// nlapiLogExecution("debug","ResponseBody",(ResponseBody));
	
	datain = JSON.parse(ResponseBody);
	// nlapiLogExecution('debug','datain',datain);
	var d = datain['d'];
	// nlapiLogExecution("debug","d",JSON.parse(d));
	d =JSON.parse(d);
	var memberList = d['MbrList'];//MbrList
	nlapiLogExecution("debug","JSON.stringifymemberList",JSON.stringify(memberList));
	// nlapiLogExecution("debug","memberList",(memberList));
	nlapiLogExecution("debug","length",(memberList.length));
	checkGovernance();
	if(memberList)
	{
		for(var i = 0; i < memberList.length; i++)
		{
			var ID = memberList[i]['ID'];
			var CAID = memberList[i]['CAID'];
			var SID = memberList[i]['SID'];
			var N1L = memberList[i]['N1L'];
			var N2L = memberList[i]['N2L'];
			var TL1 = memberList[i]['TL1'];
			var TL2 = memberList[i]['TL2'];
			var EM = memberList[i]['EM'];
			var AD1L1 = memberList[i]['AD1L1'];
			var AD1L2 = memberList[i]['AD1L2'];
			var RE1L = memberList[i]['RE1L'];
			var RE2L = memberList[i]['RE2L'];
			var SDB = memberList[i]['SDB'];
			var DJ = memberList[i]['DJ'];
			var DL = memberList[i]['DL'];
			var CAXP = memberList[i]['CAXP'];
			var BPTS = memberList[i]['BPTS'][1];
			var EX = memberList[i]['EX'];
			var MC = memberList[i]['MC'];
			
			var start = SDB.indexOf("(");
			var end = SDB.indexOf(")");
			var Temp1 = SDB.substr(start + 1, end - start - 1);
			var Temp2 = parseInt(Temp1);
			var Temp3 = new Date(Temp2);
			var SDB = GetDateKeyddmmyyyy(Temp3);
			
			var start = DJ.indexOf("(");
			var end = DJ.indexOf(")");
			var Temp1 = DJ.substr(start + 1, end - start - 1);
			var Temp2 = parseInt(Temp1);
			var Temp3 = new Date(Temp2);
			var DJ = GetDateKeyddmmyyyy(Temp3);
			
			var start = DL.indexOf("(");
			var end = DL.indexOf(")");
			var Temp1 = DL.substr(start + 1, end - start - 1);
			var Temp2 = parseInt(Temp1);
			var Temp3 = new Date(Temp2);
			var DL = GetDateKeyddmmyyyy(Temp3);
			
			var start = CAXP.indexOf("(");
			var end = CAXP.indexOf(")");
			var Temp1 = CAXP.substr(start + 1, end - start - 1);
			var Temp2 = parseInt(Temp1);
			var Temp3 = new Date(Temp2);
			var CAXP = GetDateKeyddmmyyyy(Temp3);
			
			
			var search = nlapiLoadSearch('customer', 'customsearchcustomercreatefrompos');
			checkGovernance();
			var searchfilter = search.getFilters();
			searchfilter[0] = new nlobjSearchFilter('custentityposid', null, 'is', ID);
			search.setFilters(searchfilter);
			var resultSet = search.runSearch();
			checkGovernance();
			var searchresults = resultSet.getResults(0,1);
			nlapiLogExecution('debug', 'searchresults.length', searchresults.length);
			if (searchresults.length > 0)
			{
				var customerid = searchresults[0].getId();	
				nlapiLogExecution('debug', 'customerid', customerid);
				var recCus = nlapiLoadRecord('customer',customerid);
				checkGovernance();
				// nlapiLogExecution('debug', 'isperson', recCus.getFieldValue('isperson'));
			}
			else
			{
				var recCus = nlapiCreateRecord('customer');
				checkGovernance();
				recCus.setFieldValue('isperson','T');
				recCus.setFieldValue('lastname',N1L);
				recCus.setFieldValue('firstname',N1L);
				recCus.setFieldValue('category',2);
				recCus.setFieldValue('custentity_customer_sub_category',10);
				recCus.setFieldValue('subsidiary',7);
				recCus.setFieldValue('custentity_approve','T');	
				recCus.setFieldValue('custentity_pending_complete','F');
			}
			recCus.setFieldValue('custentityposid',ID);
			recCus.setFieldValue('custentityposcardid',CAID);
			recCus.setFieldValue('custentitypostraveldocid',SID);
			recCus.setFieldValue('custentityposcity',AD1L1);
			recCus.setFieldValue('phone',TL1);
			recCus.setFieldValue('email',EM);
			recCus.setFieldValue('custentityposdob',SDB);
			recCus.setFieldValue('custentityposdatejoin',DJ);
			recCus.setFieldValue('custentityposdateleft',DL);
			recCus.setFieldValue('custentityposexpirydate',CAXP);
			recCus.setFieldValue('custentityloyaltypoint',BPTS);
			recCus.setFieldValue('custentityposmemberexpired',EX);
			recCus.setFieldValue('custentityposwechatid',MC);
			
			
			var newCustomerID = nlapiSubmitRecord(recCus);
			checkGovernance();
			nlapiLogExecution('debug', 'Customer Created /Updated', newCustomerID);
		}
	}
	nlapiSubmitField('customrecordintegrationlib',1,'custrecordintegrationlibdate',now);
}

function CheckError()
{
	// Check Error URL
	var CheckErrorURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LastError"
	var CheckErrorResponse = nlapiRequestURL(CheckErrorURL,null,null,'GET');
	checkGovernance();
	var CheckErrorBody = CheckErrorResponse.getBody();
	nlapiLogExecution("debug","CheckErrorBody",CheckErrorBody);
}
function Login()
{
	// Login URL
	var LoginURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_Login?sUsername=999&sPassword=999"
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
	var LogoutURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LogoutUser?sUsername=999"
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
	var hkTime = utc + (3600000 * 8);
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

	nlapiLogExecution('debug', 'fulldate', fulldate);
	
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
	var fulldate = dd + "/" + mm + "/" + yyyy;

	// nlapiLogExecution('debug', 'fulldate', fulldate);
	
	return fulldate;
}