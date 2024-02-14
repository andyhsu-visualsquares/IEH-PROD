function Schedule_POS_Xact_GetSalesChanges_J()
{	
	Logout();
	var LoginRes = Login();

	// CheckError();
	
	//Product_AddNew_J
	var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Xact_GetSalesChanges_J";
	
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/json","cookie": LoginRes};

	var requestBody = {};
	
	var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',2,'custrecordintegrationlibdate');
	// nlapiLogExecution("debug","lastSyncDateTime",lastSyncDateTime);
	var today = new Date();
	var now = GetDateKey(today);
	// nlapiLogExecution("debug","now",now);
	
	requestBody.vBeginTime = lastSyncDateTime;
	nlapiLogExecution("debug","requestBody.vBeginTime",requestBody.vBeginTime);
	var response = nlapiRequestURL(url,JSON.stringify(requestBody),header,'POST');
	var ResponseBody = response.getBody();
	nlapiLogExecution("debug","ResponseBody",(ResponseBody));
	
	datain = JSON.parse(ResponseBody);
	// nlapiLogExecution('debug','datain',datain);
	var d = datain['d'];
	// nlapiLogExecution("debug","d",JSON.parse(d));
	d =JSON.parse(d);
	var SalesList = d['SalesList'];//SalesList
	nlapiLogExecution("debug","JSON.stringifySalesList",JSON.stringify(SalesList));
	// nlapiLogExecution("debug","memberList",(memberList));
	checkGovernance();
	if(SalesList)
	{
		nlapiLogExecution("debug","length",(SalesList.length));
		for(var i = 0; i < SalesList.length; i++)
		{
			var SalesNum = SalesList[i]['RL'];
			nlapiLogExecution("debug","SalesNum",SalesNum);
			var ShopNum = SalesList[i]['SN'];
			
			var MID = '190100009';
			
			var search = nlapiLoadSearch('customer', 'customsearchcustomercreatefrompos');
			checkGovernance();
			var searchfilter = search.getFilters();
			searchfilter[0] = new nlobjSearchFilter('custentityposid', null, 'is', MID);
			search.setFilters(searchfilter);
			var resultSet = search.runSearch();
			checkGovernance();
			var searchresults = resultSet.getResults(0,1);
			nlapiLogExecution('debug', 'searchresults.length', searchresults.length);
			if (searchresults.length > 0)
			{
				var customerid = searchresults[0].getId();	
				nlapiLogExecution('debug', 'customerid', customerid);
				checkGovernance();
				// nlapiLogExecution('debug', 'isperson', recCus.getFieldValue('isperson'));
			}
			else
			{
				var customerid = 1951;	
			}
			
			var TxnDate = SalesList[i]['BSD'];
				var start = TxnDate.indexOf("(");
				var end = TxnDate.indexOf(")");
				var Temp1 = TxnDate.substr(start + 1, end - start - 1);
				var Temp2 = parseInt(Temp1);
				var Temp3 = new Date(Temp2);
			var TxnDate = GetDateKeyddmmyyyy(Temp3);
			var NetAmt = SalesList[i]['NA'];
			var Cancelled = SalesList[i]['CF'];
			var HasDO = SalesList[i]['HasDO'];
			nlapiLogExecution("debug","HasDO",HasDO);
			if (!HasDO)
			{
				var TxSearch = nlapiLoadSearch('transaction', 'customsearchtranfrompos');
				checkGovernance();
				var Txsearchfilter = TxSearch.getFilters();
				Txsearchfilter[1] = new nlobjSearchFilter('custbodypossalesid', null, 'is', SalesNum);
				TxSearch.setFilters(Txsearchfilter);
				var TxresultSet = TxSearch.runSearch();
				checkGovernance();
				var TxSearchresults = TxresultSet.getResults(0,1);
				nlapiLogExecution('debug', 'TxSearchresults.length', TxSearchresults.length);
				if (TxSearchresults.length == 0)
				{
					var rec = nlapiCreateRecord('invoice');
					rec.setFieldValue('entity',customerid);
					rec.setFieldValue('subsidiary',7);
					rec.setFieldValue('location',10);
					rec.setFieldValue('cseg1',5);
					rec.setFieldValue('trandate',TxnDate);
					
					var JTxnDetail = SalesList[i]['Detail'];
					if(JTxnDetail)
					{
						for(var j = 0; j < JTxnDetail.length; j++)
						{
							nlapiLogExecution('debug', 'j', j);
							var lineSalesNum = JTxnDetail[j]['RL'];
							var lineNum = JTxnDetail[j]['DK'];
							var lineProductCode = JTxnDetail[j]['BC'];
							var lineQTY = JTxnDetail[j]['QU'];
							var lineRate = JTxnDetail[j]['UP'];
							var lineAmt = JTxnDetail[j]['VDA'];
							var lineCancelled = JTxnDetail[j]['CA'];
							
							var ItemSearch = nlapiLoadSearch('item', 'customsearchpositem');
							checkGovernance();
							var Itemsearchfilter = ItemSearch.getFilters();
							Itemsearchfilter[0] = new nlobjSearchFilter('custitem_barcode', null, 'is', lineProductCode);
							ItemSearch.setFilters(Itemsearchfilter);
							var ItemresultSet = ItemSearch.runSearch();
							checkGovernance();
							var ItemSearchresults = ItemresultSet.getResults(0,1);
							nlapiLogExecution('debug', 'ItemSearchresults.length', ItemSearchresults.length);
							if (ItemSearchresults.length > 0)
							{
								var itemid = ItemSearchresults[0].getId();	
							}
							else
							{
								var itemid = 323;
							}
							
							rec.selectNewLineItem('item')
							rec.setCurrentLineItemValue('item','item',itemid);
							rec.setCurrentLineItemValue('item','quantity',lineQTY);
							rec.setCurrentLineItemValue('item','rate',lineRate);
							rec.commitLineItem('item');
						}
					}
					var TXid = nlapiSubmitRecord(rec);
					nlapiLogExecution('debug', 'Invoice Created', TXid);
					
				}
				else
				{
					var TXid = TxSearchresults[0].getId();	
					nlapiLogExecution('debug', 'TXid', TXid);
					checkGovernance();
					// nlapiLogExecution('debug', 'isperson', recCus.getFieldValue('isperson'));
					var rec = nlapiLoadRecord('invoice', TXid);
					
				}
				
				
				
				// var newCustomerID = nlapiSubmitRecord(recCus);
				// checkGovernance();
				// nlapiLogExecution('debug', 'Customer Created /Updated', newCustomerID);
				var JTxnPayment = SalesList[i]['Payment'];
				if(JTxnPayment)
				{
					for(var k = 0; k < JTxnPayment.length; k++)
					{
						var PLineSalesNum = JTxnPayment[k]['RL'];
						var PLineMethod = JTxnPayment[k]['PM'];
						var PLineAmt = JTxnPayment[k]['PA'];
						var PLineDate = JTxnPayment[k]['PD'];
							var start = PLineDate.indexOf("(");
							var end = PLineDate.indexOf(")");
							var Temp1 = PLineDate.substr(start + 1, end - start - 1);
							var Temp2 = parseInt(Temp1);
							var Temp3 = new Date(Temp2);
						var PLineDate = GetDateKeyddmmyyyy(Temp3);
						var PLineCancelled = JTxnPayment[k]['CA'];
						var recPay = nlapiTransformRecord('invoice',TXid,'customerpayment');
					}
				}
			}
			else
			{
				var rec = nlapiCreateRecord('salesorder');
				nlapiLogExecution('debug', 'Create SO');
			}
			
			
			
			
		}
	}
	// nlapiSubmitField('customrecordintegrationlib',1,'custrecordintegrationlibdate',now);
	nlapiLogExecution('debug', 'End');
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