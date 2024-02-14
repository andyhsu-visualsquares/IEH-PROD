function Schedule_POS_Member_AddNew_Post()
{
	Schedule_POS_Customer_AddNew_Post();
	Schedule_POS_Employee_AddNew_Post();
}


function Schedule_POS_Customer_AddNew_Post()
{	
	Logout();
	var LoginRes = Login();
	nlapiLogExecution("debug","LoginRes",LoginRes);
	// CheckError();
	Logout();
	var LoginRes = Login();
	nlapiLogExecution("debug","LoginRes",LoginRes);
	
	//Member_AddNew_JV2
	var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Member_AddNew_JV2";
	
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/json","cookie": LoginRes};

	var requestBody = {};
	
	var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',3,'custrecordintegrationlibdate');
	// nlapiLogExecution("debug","lastSyncDateTime",lastSyncDateTime);
	var today = new Date();
	var now = GetDateKeyddmmyyyy(today);
	// nlapiLogExecution("debug","now",now);
	
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'custentity_approve', null, 'is', true);
	filters[1] = new nlobjSearchFilter( 'custentityposid', null, 'is','');
	filters[2] = new nlobjSearchFilter( 'category', null, 'anyOf', 2);
	filters[3] = new nlobjSearchFilter( 'datecreated', null, 'onorafter', lastSyncDateTime);
	filters[4] = new nlobjSearchFilter( 'custentity_customer_sub_category', null, 'anyOf', 28);
  filters[5] = new nlobjSearchFilter( 'cseg1', null, 'anyOf', 2);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('firstname');
	columns[1] = new nlobjSearchColumn('lastname');
	columns[2] = new nlobjSearchColumn('email');
	columns[3] = new nlobjSearchColumn('phone');
	columns[4] = new nlobjSearchColumn('entityid');
	columns[5] = new nlobjSearchColumn('datecreated');
	columns[6] = new nlobjSearchColumn('custentity_customer_sub_category');
	columns[7] = new nlobjSearchColumn('custentityposcity');
	columns[8] = new nlobjSearchColumn('custentityposdob');
	columns[9] = new nlobjSearchColumn('custentityposwechatid');
	columns[10] = new nlobjSearchColumn('custentityposemail');
	columns[11] = new nlobjSearchColumn('custentityposphone');
	
	var CustomerSearch = nlapiCreateSearch('customer', filters, columns);
	var Error_Count = 0;
	var CustomerSearchresultSet = CustomerSearch.runSearch();
	var CustomerSearchresults = CustomerSearchresultSet.getResults(0,999);
	nlapiLogExecution('debug', 'CustomerSearchresults.length', CustomerSearchresults.length);
	var LotNum = '';
	for ( var m = 0; CustomerSearchresults && m < CustomerSearchresults.length ; m++ )
	{
		nlapiLogExecution('debug', 'm', m);
		var CusID = CustomerSearchresults[m].getId();
		var ResultColumns = CustomerSearchresults[m].getAllColumns();
		var firstname = CustomerSearchresults[m].getValue(ResultColumns[0]);
		var lastname = CustomerSearchresults[m].getValue(ResultColumns[1]);
		var email = CustomerSearchresults[m].getValue(ResultColumns[2]);
		var phone = CustomerSearchresults[m].getValue(ResultColumns[3]);
		var entityid = CustomerSearchresults[m].getValue(ResultColumns[4]);
		var datecreated = GetDateKey(nlapiStringToDate(CustomerSearchresults[m].getValue(ResultColumns[5])));
		var memberSubCat = CustomerSearchresults[m].getValue(ResultColumns[6]);
		var City = CustomerSearchresults[m].getValue(ResultColumns[7]);
		var dob = CustomerSearchresults[m].getValue(ResultColumns[8]);
		var wechat = CustomerSearchresults[m].getValue(ResultColumns[9]);
		var posemail = CustomerSearchresults[m].getValue(ResultColumns[10]);
		var posphone = CustomerSearchresults[m].getValue(ResultColumns[11]);
		nlapiLogExecution('debug', 'datecreated', datecreated);
		
		if(email == null || email == 'null' || email == '')
		{
			email = posemail;
		}
		
		if(phone == null || phone == 'null' || phone == '')
		{
			phone = posphone;
		}
		
		var jMember = {};
		
			
		jMember.ID = phone;
		jMember.CAID = entityid;
		jMember.SID = wechat;
		jMember.N1L = firstname + " " + lastname;
		jMember.N2L = '0';
		jMember.TL1 = phone;
		jMember.TL2 = '';
		jMember.TL3 = '';
		jMember.EM = email;
		jMember.AD1L1 = '';
		jMember.AD1L2 = '';
		jMember.AD1L3 = '';
		jMember.AD2L1 = '';
		jMember.AD2L2 = '';
		jMember.AD2L3 = '';
		jMember.MC = '';
		jMember.OC = '';
		jMember.RE1L = City;
		jMember.RE2L = '';
		var SGR = 1; //POS 1 = 10, 2 = 12, 3 = 11, 4 = 21, 5 = 22
		if (memberSubCat == 12)
		{
			SGR = 2;
		}
		else if (memberSubCat == 11)
		{
			SGR = 3;
		}
		else if (memberSubCat == 21)
		{
			SGR = 4;
		}
		else if (memberSubCat == 22)
		{
			SGR = 5;
		}
		else
		{
			SGR = 1;
		}
		
		var filters = new Array();
		filters[0] = new nlobjSearchFilter( 'custrecordcustomersubcatecate', null, 'anyOf', 2);
		filters[1] = new nlobjSearchFilter( 'internalid', null, 'anyOf', memberSubCat);
		// filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHANOREQUALTO', lineQTY);
		// filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', 208);
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('custrecordcustomersubcatposid');
		columns[1] = new nlobjSearchColumn('name');
		columns[0].setSort(); 
		var SubCatSearch = nlapiCreateSearch('customrecord_customer_sub_category', filters, columns);
		checkGovernance();
		var Error_Count = 0;
		var SubCatSearchresultSet = SubCatSearch.runSearch();
		checkGovernance();
		var SubCatSearchresults = SubCatSearchresultSet.getResults(0,1);
		nlapiLogExecution('debug', 'SubCatSearchresults.length', SubCatSearchresults.length);
		var SubCat = 10;
		for ( var n = 0; SubCatSearchresults.length > 0 && SubCatSearchresults && n == 0 ; n++ )
		{
			nlapiLogExecution('debug', 'n', n);
			var SubCatID = SubCatSearchresults[n].getId();
			var ResultColumns = SubCatSearchresults[n].getAllColumns();
			SubCat = SubCatSearchresults[n].getValue(ResultColumns[0]);
			nlapiLogExecution('debug', 'SubCat', SubCat);
		}
		
		jMember.SGR = SubCat;
		jMember.SSE = 'F';
		jMember.SDB = GetDateKeyeRun(dob);
		jMember.DJ = datecreated;
		jMember.CAXP = '2099-12-31 00:00:00';
		jMember.DC = '0.1';
		jMember.CBAL = '0';
		jMember.HBAL = '0';
		var BPTS = [0,0,0];
		jMember.BPTS = BPTS;
		jMember.SPW = '';
		jMember.REFID = '';
		jMember.EX = 'False';
		

		var requestBody = {};
		requestBody.jMember = jMember;
		nlapiLogExecution("debug","requestBody",requestBody);
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
		
		CheckError();
		if (d != '' && d != ' ')
		{
			var CusFields = new Array();
			var CustValues = new Array();
			CusFields[0]='custentityposid';
			CustValues[0] = phone;
			CusFields[1]='custentityposcardid';
			CustValues[1] = phone;
			nlapiSubmitField('customer',CusID,CusFields,CustValues);
			nlapiLogExecution("debug","Customer Record " + entityid,'created');	
		}
	
	}
	
	nlapiSubmitField('customrecordintegrationlib',3,'custrecordintegrationlibdate',now);
	
}

function Schedule_POS_Employee_AddNew_Post()
{	
	Logout();
	var LoginRes = Login();

	// CheckError();
	
	//Product_AddNew_J
	var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Member_AddNew_JV2";
	
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/json","cookie": LoginRes};

	var requestBody = {};
	
	var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',3,'custrecordintegrationlibdate');
	// nlapiLogExecution("debug","lastSyncDateTime",lastSyncDateTime);
	var today = new Date();
	var now = GetDateKeyddmmyyyy(today);
	// nlapiLogExecution("debug","now",now);
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'custentityposid', null, 'is','');
	// filters[2] = new nlobjSearchFilter( 'datecreated', null, 'onorafter', lastSyncDateTime);
	filters[1] = new nlobjSearchFilter( 'custentitycreatetopos', null, 'is', true);
		
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('firstname');
	columns[1] = new nlobjSearchColumn('lastname');
	columns[2] = new nlobjSearchColumn('email');
	columns[3] = new nlobjSearchColumn('phone');
	columns[4] = new nlobjSearchColumn('entityid');
	columns[5] = new nlobjSearchColumn('datecreated');
	
	
	var EmployeeSearch = nlapiCreateSearch('employee', filters, columns);
	var Error_Count = 0;
	var EmployeeSearchresultSet = EmployeeSearch.runSearch();
	var EmployeeSearchresults = EmployeeSearchresultSet.getResults(0,999);
	nlapiLogExecution('debug', 'EmployeeSearchresults.length', EmployeeSearchresults.length);
	var LotNum = '';
	for ( var m = 0; EmployeeSearchresults && m < EmployeeSearchresults.length ; m++ )
	{
		nlapiLogExecution('debug', 'm', m);
		var CusID = EmployeeSearchresults[m].getId();
		var ResultColumns = EmployeeSearchresults[m].getAllColumns();
		var firstname = EmployeeSearchresults[m].getValue(ResultColumns[0]);
		var lastname = EmployeeSearchresults[m].getValue(ResultColumns[1]);
		var email = EmployeeSearchresults[m].getValue(ResultColumns[2]);
		var phone = EmployeeSearchresults[m].getValue(ResultColumns[3]);
		var entityid = EmployeeSearchresults[m].getValue(ResultColumns[4]);
		var datecreated = GetDateKey(nlapiStringToDate(EmployeeSearchresults[m].getValue(ResultColumns[5])));
		
		nlapiLogExecution('debug', 'datecreated', datecreated);
		
		var jMember = {};
		
			
		jMember.ID = entityid;
		jMember.CAID = entityid;
		jMember.SID = '';
		jMember.N1L = firstname + " " + lastname;
		jMember.N2L = '0';
		jMember.TL1 = phone;
		jMember.TL2 = '';
		jMember.TL3 = '';
		jMember.EM = email;
		jMember.AD1L1 = '';
		jMember.AD1L2 = '';
		jMember.AD1L3 = '';
		jMember.AD2L1 = '';
		jMember.AD2L2 = '';
		jMember.AD2L3 = '';
		jMember.MC = '';
		jMember.OC = '';
		jMember.RE1L = '';
		jMember.RE2L = '';
		jMember.SGR = '2';
		jMember.SSE = 'F';
		jMember.SDB = '';
		jMember.DJ = datecreated;
		jMember.CAXP = '2099-12-31T00:00:00';
		jMember.DC = '0.1';
		jMember.CBAL = '0';
		jMember.HBAL = '0';
		var BPTS = [0,0,0];
		jMember.BPTS = BPTS;
		jMember.SPW = '';
		jMember.REFID = '';
		jMember.EX = 'False';
		

		var requestBody = {};
		requestBody.jMember = jMember;
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
		
		CheckError();
		if (d != '')
		{
			var CusFields = new Array();
			var CustValues = new Array();
			CusFields[0]='custentityposid';
			CustValues[0] = entityid;
			CusFields[1]='custentityposcardid';
			CustValues[1] = entityid;
			nlapiSubmitField('employee',CusID,CusFields,CustValues);
			nlapiLogExecution("debug","employee Record " + entityid,'created');	
		}
	}
	
	nlapiSubmitField('customrecordintegrationlib',4,'custrecordintegrationlibdate',now);
	
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
	var LoginURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_Login?sUsername=998&sPassword=998"
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
	var LogoutURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LogoutUser?sUsername=998"
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

function GetDateKeyeRun(datestring)
{
	var dd = datestring.substring(0, 2);
	var mm = datestring.substring(3, 5);
	var yyyy = datestring.substring(6, 10);
	var eRunDate = yyyy + "/" + mm + "/" + dd;

	// nlapiLogExecution('debug', 'fulldate', fulldate);
	
	return eRunDate;
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