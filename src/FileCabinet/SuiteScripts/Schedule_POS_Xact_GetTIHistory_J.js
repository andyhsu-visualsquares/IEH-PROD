function Schedule_POS_Xact_GetTIHistory_J()
{
	Logout();
	var LoginRes = Login();

	CheckError();
	
	//Product_AddNew_J
//	var url = "http://ieh.softether.net:8888/erunapitest/api.asmx/Xact_GetTIHistory_J";
	// var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Xact_GetTIHistory_J";
	var url = "https://ithpos.app/erunapi/api.asmx/Xact_GetTIHistory_J";
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/json","cookie": LoginRes};

	var requestBody = {};
	var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',15,'custrecordintegrationlibdate');//nlapiLookupField('customrecordintegrationlib',15,'custrecordintegrationlibdate')
	nlapiLogExecution('debug', 'start time', lastSyncDateTime);
	
//	var response = nlapiRequestURL(url,JSON.stringify(requestBody),header,'POST');
//	requestBody.vBeginTime = "2020/01/30 00:00:00";
	var s=nlapiLoadSearch('customrecordintegrationlib','customsearch_lib_today').runSearch().getResults(0,1);
	var column1 = s[0].getAllColumns();
	var today = s[0].getValue(column1[0]);
	DateEnd = today.substring(6) + "/" + today.substring(3,5) +"/"+today.substring(0,2)+" " +"23:59:59";
	var now1 = s[0].getValue(column1[1]);
//	now = now1.substring(6,10) + "/" + now1.substring(3,5) +"/"+now1.substring(0,2)+ now1.substring(10);
	now = now1;
	requestBody.vBeginTime = today.substring(6) + "/" + today.substring(3,5) +"/"+today.substring(0,2)+" " +"00:00:00";
	
	
//	var now = new Date();
//	var DateEnd = GetDateKeyDateEnd(now);
	nlapiLogExecution('error', 'DateEnd', DateEnd);
//	var DateEnd = GetDateKeyDateEnd(lastSyncDateTime)
	requestBody.vEndTime = DateEnd;
  
    // requestBody.vBeginTime = '2023/12/01 00:00:00';
	// requestBody.vEndTime = '2023/12/06 23:59:59';
	nlapiLogExecution('error', 'requestBody', JSON.stringify(requestBody));
	for(var n=1; n<=3; n++)
	{
	var response = nlapiRequestURL(url,JSON.stringify(requestBody),header,'POST');
	// var response = nlapiRequestURL(url,requestBody,header,'POST');
	nlapiLogExecution('debug', 'called api: ' + response, JSON.stringify(response));
	var ResponseBody = response.getBody();
	nlapiLogExecution('debug', 'ResponseBody', ResponseBody);
	datain = JSON.parse(ResponseBody);
	var d = datain['d'];
	d = JSON.parse(d);
	var endTime = d['EndTime'];
	var start = endTime.indexOf("(");
	var end = endTime.indexOf(")");
	var Temp1 = endTime.substr(start + 1, end - start - 1);
	var Temp2 = parseInt(Temp1);
	var Temp3 = new Date(Temp2);
	nlapiLogExecution("debug",'Temp3',Temp3);
//	var DateEnd = GetDateKeyDateEnd(Temp3);
//	var now = GetDateKey(Temp3);
	var TOList = d['TIList'];
	if(TOList)
	{
		for(var i=0; i< TOList.length; i++)
		{
			nlapiLogExecution('debug', 'TOList:'+ TOList.length,'i:'+i);
			checkGovernance();
		//	var i=0;
			var ItemReceiptNum = TOList[i]['RL'];
			
			nlapiLogExecution("debug","TONum",ItemReceiptNum);
			var toLocation = TOList[i]['SN'];
			var fromLocation = TOList[i]['SC'];
			var date = TOList[i]['BD'];
			
			var start = date.indexOf("(");
			var end = date.indexOf(")");
			var Temp1 = date.substr(start + 1, end - start - 1);
			var Temp2 = parseInt(Temp1);
			var Temp3 = new Date(Temp2);
			var trandate = GetDateKeyddmmyyyy(Temp3);
			nlapiLogExecution('debug', 'toLocation:'+toLocation, 'fromLocation:'+fromLocation);
			toLocation = searchLocation(toLocation);
			fromLocation = searchLocation(fromLocation);
			nlapiLogExecution('debug', 'toLocation:'+toLocation, 'fromLocation:'+fromLocation);
			var TOstatus = TOList[i]['CSTS'];
			var TOCancelled = TOList[i]['CF'];
			var ItemFulfillNum = TOList[i]['ORL'];
			var JTIDetail = TOList[i]['Detail'];
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custbody_pos_ir_num', null, 'is', ItemReceiptNum);
			var search = nlapiCreateSearch('transferorder',filters, null);
			var searchResult = search.runSearch().getResults(0,1);
			nlapiLogExecution('debug', searchResult.length+','+TOCancelled+','+TOstatus);
			if(searchResult.length==0 && TOCancelled == false && TOstatus == 5)
			{
				var rec = nlapiCreateRecord('transferorder');
				checkGovernance();
				rec.setFieldValue('custbody_pos_ir_num', ItemReceiptNum);
				rec.setFieldValue('trandate', trandate);
				rec.setFieldValue('transferlocation', toLocation);
				rec.setFieldValue('location', fromLocation);
				rec.setFieldText('orderstatus', 'Pending Fulfillment');
				rec.setFieldValue('cseg1', searchChannel(TOList[i]['SN']));
				rec.setFieldValue('useitemcostastransfercost', 'T');
				rec.setFieldValue('subsidiary', 10);
				for(var k=0; k< JTIDetail.length; k++)
				{
					var lineTONum = JTIDetail[k]['RL'];
					var lineNum = JTIDetail[k]['DK'];
					var itemBC = JTIDetail[k]['BC'];
					var itemid = searchItem(itemBC);
					var type = nlapiLookupField('item', itemid, 'islotitem');
					var quantity = JTIDetail[k]['QU'];
					var cancelflag = JTIDetail[k]['CA'];
					var itemType = nlapiLookupField('item', itemid, 'type');
					nlapiLogExecution('debug', 'itemType', itemType);
					if(cancelflag == false && itemType != 'NonInvtPart')
					{
						rec.selectNewLineItem('item');
						rec.setCurrentLineItemValue('item','item', itemid);
						rec.setCurrentLineItemValue('item', 'quantity', quantity);//setCurrentLineItemValue
						rec.setCurrentLineItemValue('item', 'custcol_pos_line', lineNum);
						if (type == 'T')
						{
							var filters = new Array();
							filters[0] = new nlobjSearchFilter( 'item', null, 'anyOf', itemid);
							filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'GREATERTHANOREQUALTO', quantity);
							filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHANOREQUALTO', quantity);
							filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', fromLocation);
							var columns = new Array();
							columns[0] = new nlobjSearchColumn('inventorynumber');
							columns[1] = new nlobjSearchColumn('expirationdate');
							columns[1].setSort(); 
							var LotNumSearch = nlapiCreateSearch('inventorynumber', filters, columns);
							checkGovernance();
							var Error_Count = 0;
							var LotNumSearchresultSet = LotNumSearch.runSearch();
							checkGovernance();
							var LotNumSearchresults = LotNumSearchresultSet.getResults(0,1);
							nlapiLogExecution('debug', 'LotNumSearchresults.length', LotNumSearchresults.length);
							var LotNum = '';
							for ( var m = 0; LotNumSearchresults.length > 0 && LotNumSearchresults && m == 0 ; m++ )
							{
								nlapiLogExecution('debug', 'm', m);
								var m=0;
								var inventoryNumID = LotNumSearchresults[m].getId();
								var ResultColumns = LotNumSearchresults[m].getAllColumns();
								LotNum = LotNumSearchresults[m].getValue(ResultColumns[0]);
								nlapiLogExecution('debug', 'LotNum', LotNum);
							}
							if (LotNum != '')
							{	
							//
							
								var subrec = rec.createCurrentLineItemSubrecord('item', 'inventorydetail');
								subrec.selectNewLineItem('inventoryassignment');
								subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
								subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', quantity);
								subrec.commitLineItem('inventoryassignment');
								subrec.commit();
							}
							else
							{
								rec.setCurrentLineItemValue('item','item',8928);
								rec.setCurrentLineItemValue('item','description','item has no stock. ' + itemBC);
								rec.setCurrentLineItemValue('item','custcolposremarks', itemid);
							}
						}
						rec.commitLineItem('item');
					}
				}
				rec.setFieldValue('custbody_transfer_type', 3);
				try{
					var recid = nlapiSubmitRecord(rec);
					nlapiLogExecution('debug', 'transfer order id', recid);
					
					var itemfulfillment = nlapiTransformRecord('transferorder', recid, 'itemfulfillment');
					itemfulfillment.setFieldValue('trandate', trandate);
					for(var ii=1; ii<=itemfulfillment.getLineItemCount('item');ii++)
					{
						itemfulfillment.setLineItemValue('item', 'quantity', ii,itemfulfillment.getLineItemValue('item', 'quantityremaining', ii));
						
					}
					itemfulfillment.setFieldValue('trandate', trandate);
					itemfulfillment.setFieldValue('cseg1',searchChannel(TOList[i]['SC']));
					nlapiLogExecution('debug', 'from channel', searchChannel(TOList[i]['SC'])+','+TOList[i]['SC']);
					var fulfillmentid = nlapiSubmitRecord(itemfulfillment);
					var itemreceipt = nlapiTransformRecord('transferorder', recid, 'itemreceipt');
					itemreceipt.setFieldValue('trandate', trandate);
					itemreceipt.setFieldValue('cseg1',searchChannel(TOList[i]['SN']));
					nlapiLogExecution('debug', 'to channel', searchChannel(TOList[i]['SN'])+','+TOList[i]['SN']);
					var itemreceiptid = nlapiSubmitRecord(itemreceipt);
					nlapiLogExecution('debug', 'fulfillmentid', fulfillmentid);
					nlapiLogExecution('debug', 'itemreceiptid', itemreceiptid);
				}
				catch (err)
				{
					nlapiLogExecution('error', 'error Message: ' + err, lineTONum);
					var recError = nlapiCreateRecord('customrecordpossyncerror');
					recError.setFieldValue('custrecordsyncerror_posid', lineTONum);
					recError.setFieldValue('custrecordsyncerror_json', JSON.stringify(TOList[i]));
					recError.setFieldValue('custrecordsynerror_date', trandate);
					
					recError.setFieldValue('custrecordsyncerror_msg', err);
					var ErrorID = nlapiSubmitRecord(recError);
				}
				
			}
			else if(searchResult.length>0)
			{
				nlapiLogExecution('debug','exist same transfer order', searchResult[0].getId());
			}
			
		}
	}
	}
	nlapiSubmitField('customrecordintegrationlib',15,'custrecordintegrationlibdate',now);
//	var DateEnd = GetDateKeyDateEnd(now);
	nlapiSubmitField('customrecordintegrationlib',16,'custrecordintegrationlibdate',DateEnd);
	
}

function CheckError()
{
	// Check Error URL
	// var CheckErrorURL = "http://ieh.softether.net:8888/erunapitest/api.asmx/System_LastError"
	var CheckErrorURL = "https://ithpos.app/erunapi/api.asmx/System_LastError";
	var CheckErrorResponse = nlapiRequestURL(CheckErrorURL,null,null,'GET');
	checkGovernance();
	var CheckErrorBody = CheckErrorResponse.getBody();
	nlapiLogExecution("debug","CheckErrorBody",CheckErrorBody);
}
function Login()
{
	// Login URL
//	var LoginURL = "http://ieh.softether.net:8888/erunapitest/api.asmx/System_Login?sUsername=999&sPassword=999"
// var LoginURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_Login?sUsername=999&sPassword=999"
var LoginURL = "https://ithpos.app/erunapi/api.asmx/System_Login?sUsername=999&sPassword=999";
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
//	var LogoutURL = "http://ieh.softether.net:8888/erunapitest/api.asmx/System_LogoutUser?sUsername=999"
// var LogoutURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LogoutUser?sUsername=999"
var LogoutURL = "https://ithpos.app/erunapi/api.asmx/System_LogoutUser?sUsername=999"
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

function GetDateKeyDateEnd(enddate)
{
//	enddate.setDate(enddate.getDate()+1);
	var yyyy = enddate.getFullYear();
	var mm = enddate.getMonth() + 1 ;
	var dd = enddate.getDate();
	
	var fulldate = yyyy + "/" + mm + "/" + dd + " " + '23' + ":" + '59' + ":" + '59';

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

function searchLocation(Location)
{
	nlapiLogExecution('debug', 'location', Location);
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('name', null, 'is', 'Location Mapping');
	filters[1] = new nlobjSearchFilter('custrecordintegrationlibposid', null, 'equalto', Location);//custrecordintegrationlibnsid
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('custrecordintegrationlibnsid');
	var search = nlapiCreateSearch('customrecordintegrationlib',filters, columns);
	var searchResult = search.runSearch().getResults(0,1);
	if(searchResult.length==0 || !searchResult)
		return 0;
	else
	{
		nlapiLogExecution('debug',searchResult[0].getValue(columns[0]));
		nlapiLogExecution('debug',searchResult[0].getId());
		return searchResult[0].getValue(columns[0]);
	}
}

function searchChannel(shopNum)
{
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('name', null, 'is', 'Channel Mapping');
	filters[1] = new nlobjSearchFilter('custrecordintegrationlibposid', null, 'equalto', shopNum);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('custrecordintegrationlibnsid');
	var search = nlapiCreateSearch('customrecordintegrationlib',filters, columns);
	var searchResult = search.runSearch().getResults(0,1);
	if(searchResult.length==0 || !searchResult)
		return 0;
	else
		return searchResult[0].getValue(columns[0]);
}

function searchItem(itemBC)
{
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custitem_barcode', null, 'is', itemBC);
	var search = nlapiCreateSearch('item',filters, null);
	var searchResult = search.runSearch().getResults(0,1);
	if(searchResult.length==0 || !searchResult)
		return 0;
	else
	{
		nlapiLogExecution('debug', 'itemid', searchResult[0].getId());
		return searchResult[0].getId();
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