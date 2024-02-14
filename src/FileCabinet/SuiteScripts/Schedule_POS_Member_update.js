function Schedule_POS_to_NS()
{
	Schedule_POS_Member_GetChanges_J();
	// Schedule_POS_Member_GetChanges_JV1();
	//Schedule_POS_Xact_GetSalesChanges_J()
	
}

function Schedule_POS_Member_GetChanges_J()
{	
	Logout();
	var LoginRes = Login();
	nlapiLogExecution("debug","LoginRes",LoginRes);
	// CheckError();
	
	//Product_AddNew_J
	// var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Member_GetChanges_J";
	var url = "https://ithpos.app/erunapi/api.asmx/Member_GetChanges_J";
	
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/x-www-form-urlencoded","cookie": LoginRes};

	var requestBody = {};
	
	var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',1,'custrecordintegrationlibdate');
	for (var xx = 80; xx > 0; xx--)	
	{	
		// var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',1,'custrecordintegrationlibdate');
		var lastSyncDateTime = GetDateKeyyyyymmddLastXDay(xx) + ' 00:00:01';
		var lastSyncDateTimeDateEnd = GetDateKeyyyyymmddLastXDay(xx - 1) + ' 23:59:00';
		
		
		var today = new Date();
		var now = GetDateKey(today);
		// nlapiLogExecution("debug","now",now);
		var endtime = GetDateKeyDateEnd(lastSyncDateTime);
		var starttime = GetDateKeyDateStart(lastSyncDateTime);
		// requestBody.vBeginTime = lastSyncDateTime;
		var requestBody = 'vBeginTime=' + lastSyncDateTime + '&vEndTime=' + lastSyncDateTimeDateEnd;
		//
		nlapiLogExecution("audit","requestBody.vBeginTime",lastSyncDateTime);
		nlapiLogExecution("error","requestBodyJSON",JSON.stringify(requestBody));
		nlapiLogExecution("error","requestBody",requestBody);
		// var response = nlapiRequestURL(url,JSON.stringify(requestBody),header,'POST');
		var response = nlapiRequestURL(url,requestBody,header,'POST');
		// var response = nlapiRequestURL(url,JSON.stringify(requestBody),header,'POST');
		var ResponseBody = response.getBody();
		nlapiLogExecution("debug","ResponseBody",(ResponseBody));
		
		
		
		if (ResponseBody != '{"d":""}')
		{
			// datain = JSON.parse(ResponseBody);
			// nlapiLogExecution('debug','datain',datain);
			
			var responseLen = ResponseBody.length;
			var ResponseBody_J = ResponseBody.substring(76,responseLen - 9);
			nlapiLogExecution('debug','ResponseBody_J',ResponseBody_J);
			var d = JSON.parse(ResponseBody_J);
			
			// var d = datain['d'];
			// nlapiLogExecution("debug","d",JSON.parse(d));
			// d = JSON.parse(d);
			var endTime = d['EndTime'];
			nlapiLogExecution("debug",'endTime',endTime);
			// var endTime = SalesList[i]['BSD'];
				var start = endTime.indexOf("(");
				var end = endTime.indexOf(")");
				var Temp1 = endTime.substr(start + 1, end - start - 1);
				var Temp2 = parseInt(Temp1);
				var Temp3 = new Date(Temp2);
				nlapiLogExecution("debug",'Temp3',Temp3);
			var now = GetDateKey(Temp3);
			
			var memberList = d['MbrList'];//MbrList
			nlapiLogExecution("debug","JSON.stringifymemberList",JSON.stringify(memberList));
			// nlapiLogExecution("debug","length",(memberList.length));
			checkGovernance();
			if(memberList)
			{
				for(var i = 0; i < memberList.length; i++)
				{
					nlapiLogExecution("debug","JSON.stringifymemberList - " + i,JSON.stringify(memberList[i]));
					var ID = memberList[i]['ID'];
					var CAID = memberList[i]['CAID'];
					var SID = memberList[i]['SID'];
					var N1L = memberList[i]['N1L'];
					var N2L = memberList[i]['N2L'];
					if (N2L == '' || N2L == 'null' || N2L == null)
					{
						N2L = '-';
					}
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
					var SGR = memberList[i]['SGR'];
					
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
						recCus.setFieldValue('lastname',N2L.substring(0, 32));
						recCus.setFieldValue('firstname',N1L.substring(0, 32));
                      recCus.setFieldValue('custentityposotherlang',N1L.substring(0, 32));
                      
						recCus.setFieldValue('category',2);
						var memberSubCat = 1; //POS 1 = 10, 2 = 12, 3 = 11, 4 = 21, 5 = 22, 6 = 23
						if (SGR == 2)
						{
							memberSubCat = 12;
						}
						else if (SGR == 3)
						{
							memberSubCat = 11;
						}
						else if (SGR == 4)
						{
							memberSubCat = 21;
						}
						else if (SGR == 5)
						{
							memberSubCat = 22;
						}
						else if (SGR == 6)
						{
							memberSubCat = 23;
						}
						else
						{
							memberSubCat = 10;
						}
						
						var filters = new Array();
						// filters[0] = new nlobjSearchFilter( 'custrecordcustomersubcatecate', null, 'anyOf', 2);
						filters[0] = new nlobjSearchFilter( 'custrecordcustomersubcatposid', null, 'equalTo', SGR);
						// filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHANOREQUALTO', lineQTY);
						// filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', Locationid);
						var columns = new Array();
						columns[0] = new nlobjSearchColumn('internalid');
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
						for ( var m = 0; SubCatSearchresults.length > 0 && SubCatSearchresults && m == 0 ; m++ )
						{
							nlapiLogExecution('debug', 'm', m);
							var SubCatID = SubCatSearchresults[m].getId();
							var ResultColumns = SubCatSearchresults[m].getAllColumns();
							SubCat = SubCatSearchresults[m].getValue(ResultColumns[0]);
							nlapiLogExecution('debug', 'SubCat', SubCat);
						}
						
						
						recCus.setFieldValue('category',2);
						recCus.setFieldValue('custentity_customer_sub_category',SubCat);
						// recCus.setFieldValue('custentity_customer_sub_category',memberSubCat);
						recCus.setFieldValue('subsidiary',10);
						recCus.setFieldValue('custentity_approve','T');	
						recCus.setFieldValue('custentity_pending_complete','F');
					}
					recCus.setFieldValue('custentityposid',ID);
					recCus.setFieldValue('custentityposcardid',CAID);
					recCus.setFieldValue('custentitypostraveldocid',SID);
					recCus.setFieldValue('custentityposcity',RE1L);
					recCus.setFieldValue('custentityposphone',TL1);
					recCus.setFieldValue('custentityposemail',EM);
					recCus.setFieldValue('custentityposdob',SDB);
					recCus.setFieldValue('custentityposdatejoin',DJ);
					recCus.setFieldValue('custentityposdateleft',DL);
					recCus.setFieldValue('custentityposexpirydate',CAXP);
					recCus.setFieldValue('custentityloyaltypoint',BPTS);
					recCus.setFieldValue('custentityposmemberexpired',EX);
					recCus.setFieldValue('custentityposwechatid',SID);
					recCus.setFieldValue('custentityposjson',JSON.stringify(memberList[i]));
					
					try
					{
						var newCustomerID = nlapiSubmitRecord(recCus);
						checkGovernance();
						nlapiLogExecution('debug', 'Customer Created /Updated', newCustomerID);
					}
					catch (err)
					{
						nlapiLogExecution('debug', 'Customer Not Created /Updated', ID);
					}
					
				}
			}
			nlapiSubmitField('customrecordintegrationlib',1,'custrecordintegrationlibdate',now);
		}
	}
	nlapiLogExecution('error', 'END');
}


function CheckError()
{
	// Check Error URL
	var CheckErrorURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LastError"
	var CheckErrorURL = "https://ithpos.app/erunapi/api.asmx/System_LastError";
	var CheckErrorResponse = nlapiRequestURL(CheckErrorURL,null,null,'GET');
	checkGovernance();
	var CheckErrorBody = CheckErrorResponse.getBody();
	nlapiLogExecution("debug","CheckErrorBody",CheckErrorBody);
}
function Login()
{
	// Login URL
	// var LoginURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_Login?sUsername=998&sPassword=998"
	var LoginURL = "https://ithpos.app/erunapi/api.asmx/System_Login?sUsername=998&sPassword=998";
	var LoginResponse = nlapiRequestURL(LoginURL,null,null,'GET');
	checkGovernance();
	// var LoginBody1 = LoginResponse.getBody();
	// nlapiLogExecution("debug","LoginBody1",LoginBody1);
	var LoginBody = LoginResponse.getHeader('Set-Cookie');
	nlapiLogExecution("debug","LoginBody",LoginBody);
	return LoginBody;
}
function Logout()
{
	// Logout URL
	// var LogoutURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LogoutUser?sUsername=998"
	var LogoutURL = "https://ithpos.app/erunapi/api.asmx/System_LogoutUser?sUsername=998"
	var LogoutResponse = nlapiRequestURL(LogoutURL,null,null,'GET');
	checkGovernance();
	var LogoutBody = LogoutResponse.getBody();
	nlapiLogExecution("debug","LogoutBody",LogoutBody);
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

function GetDateKeyDateEnd(datestring)
{
	var yyyy = datestring.substring(0,4);
	var mm = datestring.substring(5,7);
	var dd = datestring.substring(8,10);
	
	var fulldate = yyyy + "/" + mm + "/" + dd + " " + '23' + ":" + '59' + ":" + '59';

	nlapiLogExecution('debug', 'fulldate', fulldate);
	
	return fulldate;
}

function GetDateKeyDateStart(datestring)
{
	var yyyy = datestring.substring(0,4);
	var mm = datestring.substring(5,7);
	var dd = datestring.substring(8,10);
	
	var fulldate = yyyy + "/" + mm + "/" + dd + " " + '00' + ":" + '00' + ":" + '01';

	nlapiLogExecution('debug', 'fulldate', fulldate);
	
	return fulldate;
}

function GetDateKey(datestring)
{
	// var today = new Date();
	// nlapiLogExecution('debug', 'today', today);
	var to0 = datestring.getTimezoneOffset();
	// nlapiLogExecution('debug', 'to0', to0);
	var utc = datestring.getTime() + (datestring.getTimezoneOffset() * 60000);
	// nlapiLogExecution('debug', 'utc', utc);
	var hkTime = utc + (3600000 * 8) + 1;
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

function GetDateKeyyyyymmddToday()
{
	var datestring = new Date();
	nlapiLogExecution('error', 'GetDateKeyyyyymmddToday_datestring', datestring);
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
	var fulldate = yyyy + "/" + mm + "/" + dd;

	nlapiLogExecution('error', 'GetDateKeyyyyymmddToday_fulldate', fulldate);
	
	return fulldate;
}

function GetDateKeyyyyymmddLastXDay(xx)
{
	var today = new Date();
	// nlapiLogExecution('error', 'GetDateKeyyyyymmddLastWeek_Today', today);
	var datestring= new Date(today.getTime() - xx * 24 * 60 * 60 * 1000);
	// nlapiLogExecution('error', 'GetDateKeyyyyymmddLastWeek_datestring', datestring);
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
	var fulldate = yyyy + "/" + mm + "/" + dd;

	nlapiLogExecution('error', 'GetDateKeyyyyymmddLastWeek_fulldate', fulldate);
	
	return fulldate;
}
function GetDateKeyyyyymmddLastWeek()
{
	var today = new Date();
	// nlapiLogExecution('error', 'GetDateKeyyyyymmddLastWeek_Today', today);
	var datestring= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
	// nlapiLogExecution('error', 'GetDateKeyyyyymmddLastWeek_datestring', datestring);
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
	var fulldate = yyyy + "/" + mm + "/" + dd;

	nlapiLogExecution('error', 'GetDateKeyyyyymmddLastWeek_fulldate', fulldate);
	
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
