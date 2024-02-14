function Schedule_POS_to_NS()
{
	// Schedule_POS_Member_GetChanges_J();

	Schedule_POS_Xact_GetSalesChanges_J()
	
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
	
	// var url = "https://eruntestapi.free.beeceptor.com/api.asmx/Member_GetChanges_J";
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/x-www-form-urlencoded","cookie": LoginRes};

	var requestBody = {};
	
	var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',1,'custrecordintegrationlibdate');
    for (var xx = 2; xx >= 0; xx--) 
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
		nlapiLogExecution("audit","requestBodyJSON",JSON.stringify(requestBody));
		nlapiLogExecution("audit","requestBody",requestBody);
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
					
					
					var search = nlapiLoadSearch('customer', 'customsearch_frompos_iv');
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
						// nlapiLogExecution('error', 'error Message: ' + err, JSON.stringify(SalesList[i]));
					}
					
				}
			}
			nlapiSubmitField('customrecordintegrationlib',1,'custrecordintegrationlibdate',now);
		}
	}
	nlapiLogExecution('emergency', 'END');
}



function Schedule_POS_Xact_GetSalesChanges_J()
{	
	Logout();
	var LoginRes = Login();

	CheckError();
	
	//Product_AddNew_J
	// var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Xact_GetSalesHistory_J";
	// var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Xact_GetSalesHistoryV2_J";
	var url = "https://ithpos.app/erunapi/api.asmx/Xact_GetSalesHistoryV2_J";
	
	// var header = {"Content-Type": "application/json"};
	// var header = {"Content-Type": "application/json","cookie": LoginRes};
	var header = {"Content-Type": "application/x-www-form-urlencoded","cookie": LoginRes};

	// var requestBody = {};
	
	var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',2,'custrecordintegrationlibdate');
	checkGovernance();
	var lastSyncDateTimeDateEnd1 = nlapiLookupField('customrecordintegrationlib',5,'custrecordintegrationlibdate');
	checkGovernance();
	var lastSyncDateTimeDateEnd = lastSyncDateTimeDateEnd1.substr(0, 10) + ' 00:00:00';
	// nlapiLogExecution("error","YYYYMMDD",YYYYMMDD);
	// var firstDay = new Date();
	// var previousweek= new Date(firstDay.getTime() - 7 * 24 * 60 * 60 * 1000);
	
	for (var xx = 4; xx >= 0; xx--)
	// for (var xx = 3; xx > 2; xx--) 
	// for (var xx = 8; xx > 7; xx--)
	// for (var xx = 1; xx > 0; xx--)
	{
		// GetDateKeyyyyymmddLastXDay(xx)
		for(var h = 0; h <=23; h ++)
		// for(var h = 20; h <=20; h ++)
		{
			var lastSyncDateTime = GetDateKeyyyyymmddLastXDay(xx) + ' ' + initial0(h) + ':00:00';
			var lastSyncDateTimeDateEnd = GetDateKeyyyyymmddLastXDay(xx) + ' ' + initial0(h) + ':59:59';
			// ?vBeginTime=2019/03/29 11:30:00&vEndTime=2019/03/29 23:59:59
			
			// lastSyncDateTime = '2023/09/26' + ' ' + initial0(h) + ':00:00';
			// lastSyncDateTimeDateEnd = '2023/09/26' + ' ' + initial0(h) + ':59:59';
			// vBeginTime:	
			// 2020/01/17 13:40:00
			// vEndTime:	
			// 2020/01/17 14:00:00
			
			nlapiLogExecution("debug","url",url);
			var today = new Date();
			// var now = GetDateKey(today);
			
			// var endtime = GetDateKeyDateEnd(lastSyncDateTime);
			// var starttime = GetDateKeyDateStart(lastSyncDateTime);
			
			// var lastSyncDateTime = '2023/10/01 ' + initial0(h) + ':00:00';
			// var lastSyncDateTimeDateEnd = '2023/10/01 ' + initial0(h) + ':59:59';
			
			// nlapiLogExecution("debug","now",now);
			var requestBody = 'vBeginTime=' + lastSyncDateTime + '&vEndTime=' + lastSyncDateTimeDateEnd + '&bLU=true&bDVD=true';
			// var requestBody = 'vBeginTime=' + lastSyncDateTime + '&vEndTime=' + lastSyncDateTimeDateEnd + '&bLU=false';
			
			// requestBody.vBeginTime = lastSyncDateTime;
			// requestBody.vEndTime = lastSyncDateTimeDateEnd;
			// nlapiLogExecution("debug","requestBody.vBeginTime",requestBody.vBeginTime);
			// nlapiLogExecution("debug","requestBody.vEndTime",requestBody.vEndTime);
			nlapiLogExecution("emergency","requestBodyJSON",JSON.stringify(requestBody));
			nlapiLogExecution("emergency","requestBody",requestBody);
			// var response = nlapiRequestURL(url,JSON.stringify(requestBody),header,'POST');
			checkGovernance();
			var response = nlapiRequestURL(url,requestBody,header,'POST');
			checkGovernance();
			var ResponseBody = response.getBody();
			nlapiLogExecution("debug","ResponseBody",(ResponseBody));
			
			var responseLen = ResponseBody.length;
			var ResponseBody_J = ResponseBody.substring(76,responseLen - 9);
			nlapiLogExecution('debug','ResponseBody_J',ResponseBody_J);
			var d = JSON.parse(ResponseBody_J);
			// datain = JSON.parse(ResponseBody);
			// nlapiLogExecution('debug','datain',datain);
			// var d = datain['d'];
			// nlapiLogExecution("debug","d",JSON.parse(d));
			// d = JSON.parse(datain);
			var endTime = d['EndTime'];
			// nlapiLogExecution("debug",'endTime',endTime);
			// var endTime = SalesList[i]['BSD'];
				var start = endTime.indexOf("(");
				var end = endTime.indexOf(")");
				var Temp1 = endTime.substr(start + 1, end - start - 1);
				var Temp2 = parseInt(Temp1);
				var Temp3 = new Date(Temp2);
				// nlapiLogExecution("debug",'Temp3',Temp3);
			var now = GetDateKey(Temp3);
			// var now = GetDateKeyErun(endTime);
			var SalesList = d['SalesList'];//SalesList
			nlapiLogExecution("debug","JSON.stringifySalesList",JSON.stringify(SalesList));
			// nlapiLogExecution("debug","memberList",(memberList));
			checkGovernance();
			if(SalesList && SalesList != null && SalesList != 'null' && SalesList != '' )
			{
				nlapiLogExecution("debug","SalesList.length",(SalesList.length));
				
				for(var i = 0; i < SalesList.length; i++)
				{
					var ShopNum = SalesList[i]['SN'];
					if(ShopNum != 99 && ShopNum != 0)
					// if(ShopNum != 99 && ShopNum != 0 && ShopNum == 15)
					{
						
						var SalesNum = SalesList[i]['RL'];
						
						
						
						
						// if (SalesNum == 'R992311031811814265')
						{	
							var ShopNum = SalesList[i]['SN'];
							var DWD = SalesList[i]['DWD'];
							var DVD = SalesList[i]['DVD'];
							nlapiLogExecution("audit","SalesNum",SalesNum);
							nlapiLogExecution("audit","SalesList " + i, JSON.stringify(SalesList[i]));	
							// nlapiLogExecution("audit","DVD",DVD);
							/*
							var LocationSearch = nlapiLoadSearch('location', 'customsearchlocationpos');
							checkGovernance();
							var Locationsearchfilter = LocationSearch.getFilters();
							Locationsearchfilter[0] = new nlobjSearchFilter('custrecordlocationposid', null, 'equalTo', ShopNum);
							LocationSearch.setFilters(Locationsearchfilter);
							var LocationresultSet = LocationSearch.runSearch();
							checkGovernance();
							var LocationSearchresults = LocationresultSet.getResults(0,1);
							// nlapiLogExecution('debug', 'LocationSearchresults.length', LocationSearchresults.length);
							if (LocationSearchresults.length > 0)
							{
								var Locationid = LocationSearchresults[0].getId();
							}
							else 
							{
								var Locationid = 208;
							}
							// nlapiLogExecution('debug', 'Locationid', Locationid);
							*/
							
							var LocationSearch = nlapiLoadSearch('customrecordintegrationlib', 'customsearchposlocation2');
							checkGovernance();
							var Locationsearchfilter = LocationSearch.getFilters();
							Locationsearchfilter[0] = new nlobjSearchFilter('custrecordintegrationlibposid', null, 'equalTo', ShopNum);
							LocationSearch.setFilters(Locationsearchfilter);
							var LocationresultSet = LocationSearch.runSearch();
							checkGovernance();
							var LocationSearchresults = LocationresultSet.getResults(0,1);
							// nlapiLogExecution('debug', 'LocationSearchresults.length', LocationSearchresults.length);
							if (LocationSearchresults.length > 0)
							{
								// var Locationid = LocationSearchresults[0].getId();
								var columns = LocationSearchresults[0].getAllColumns();
								var Locationid = LocationSearchresults[0].getValue(columns[0]);
							}
							else 
							{
								var Locationid = 208;
							}
							checkGovernance();
							// nlapiLogExecution('debug', 'Locationid', Locationid);
							var INVlocation = Locationid;
							if(DWD == 1)
							{
								var DeliveryLocation = FernSPEEDSearch('DeliveryLocation');
								checkGovernance();
								if(DeliveryLocation && DeliveryLocation != 0)
								{
									INVlocation = DeliveryLocation;
								}
								// nlapiLogExecution('emergency', 'SalesNum with DWD', SalesNum);
								// nlapiLogExecution('emergency', 'INVlocation: ' + INVlocation, 'Locationid: ' + Locationid);
							}
							
							/*
							var ChannelSearch = nlapiLoadSearch('customrecord_cseg1', 'customsearchchannelpos');
							checkGovernance();
							var Channelsearchfilter = ChannelSearch.getFilters();
							Channelsearchfilter[0] = new nlobjSearchFilter('custrecordchannelposid', null, 'equalTo', ShopNum);
							ChannelSearch.setFilters(Channelsearchfilter);
							var ChannelSearchresultSet = ChannelSearch.runSearch();
							checkGovernance();
							var ChannelSearchresults = ChannelSearchresultSet.getResults(0,1);
							// nlapiLogExecution('debug', 'ChannelSearchresults.length', ChannelSearchresults.length);
							if (ChannelSearchresults.length > 0)
							{
								var Channelid = ChannelSearchresults[0].getId();
							}
							else 
							{
								var Channelid = 5;
							}
							// nlapiLogExecution('debug', 'Channelid', Channelid);
							*/
							
							var ChannelSearch = nlapiLoadSearch('customrecordintegrationlib', 'customsearchposchannel2');
							
							checkGovernance();
							var Channelsearchfilter = ChannelSearch.getFilters();
							Channelsearchfilter[0] = new nlobjSearchFilter('custrecordintegrationlibposid', null, 'equalTo', ShopNum);
							ChannelSearch.setFilters(Channelsearchfilter);
							var ChannelSearchresultSet = ChannelSearch.runSearch();
							checkGovernance();
							var ChannelSearchresults = ChannelSearchresultSet.getResults(0,1);
							// nlapiLogExecution('debug', 'ChannelSearchresults.length', ChannelSearchresults.length);
							if (ChannelSearchresults.length > 0)
							{
								// var Channelid = ChannelSearchresults[0].getId();
								var columns = ChannelSearchresults[0].getAllColumns();
								var Channelid = ChannelSearchresults[0].getValue(columns[0]);
							}
							else 
							{
								var Channelid = 5;
							}
							// nlapiLogExecution('debug', 'Channelid', Channelid);
							checkGovernance();
							var SC = SalesList[i]['SC'];
							
							var search = nlapiLoadSearch('customer', 'customsearch_frompos_iv');
							checkGovernance();
							var searchfilter = search.getFilters();
							searchfilter[0] = new nlobjSearchFilter('custentityposid', null, 'is', SC);
						  // searchfilter[1] = new nlobjSearchFilter('cseg1', null, 'is', 2);
							search.setFilters(searchfilter);
							var resultSet = search.runSearch();
							checkGovernance();
							var searchresults = resultSet.getResults(0,1);
							// nlapiLogExecution('debug', 'customersearchresults.length', searchresults.length);
							if (searchresults.length > 0)
							{
								var customerid = searchresults[0].getId();	
								// nlapiLogExecution('debug', 'customerid', customerid);
								checkGovernance();
								// nlapiLogExecution('debug', 'isperson', recCus.getFieldValue('isperson'));
							}
							else
							{
								var customerid = 1535;	
							}
							
							var TxnDate = SalesList[i]['BSD'];
								var start = TxnDate.indexOf("(");
								var end = TxnDate.indexOf(")");
								var Temp1 = TxnDate.substr(start + 1, end - start - 1);
								var Temp2 = parseInt(Temp1);
								var Temp3 = new Date(Temp2);
							var TxnDate = GetDateKeyddmmyyyy(Temp3);
							var INVDate = TxnDate;
							if(DWD == 1)
							{
								var DeliveryDate = SalesList[i]['DVD'];
								if(DeliveryDate)
								{
									var start = DeliveryDate.indexOf("(");
									var end = DeliveryDate.indexOf(")");
									var Temp1 = DeliveryDate.substr(start + 1, end - start - 1);
									var Temp2 = parseInt(Temp1);
									var Temp3 = new Date(Temp2);
									var DeliveryDate = GetDateKeyddmmyyyy(Temp3);
										
									// var plus7Date = GetDateKeyddmmyyyyPlus7day(Temp3);
									if(DeliveryDate)
									{
										INVDate = DeliveryDate;
										
										// nlapiLogExecution('emergency', 'DeliveryDate: ' + DeliveryDate, 'TxnDate: ' + TxnDate);
									}
								}
							}
							
							var NetAmt = SalesList[i]['NA'];
							var Cancelled = SalesList[i]['CF'];
							var HasDO = SalesList[i]['HasDO'];
							var JTxnDetail = SalesList[i]['Detail']; 
							var JTxnPayment = SalesList[i]['Payment'];
							var completed = SalesList[i]['completed'];
							
							
							// nlapiLogExecution("debug","customerid",customerid);
							// nlapiLogExecution("debug","HasDO",HasDO);
							// nlapiLogExecution("debug","Cancelled",Cancelled);
							var CM_index = 0;
							var CMid = [0];
							var invoiceAMT = 0;
							if(JTxnDetail)
							{
								if(completed)
								{
									// if (!HasDO)
									{
										if(!Cancelled)
										{
											
											var TxSearch = nlapiLoadSearch('transaction', 'customsearchtranfrompos');
											checkGovernance();
											var Txsearchfilter = TxSearch.getFilters();
											Txsearchfilter[1] = new nlobjSearchFilter('custbodypossalesid', null, 'is', SalesNum);
											TxSearch.setFilters(Txsearchfilter);
											var TxresultSet = TxSearch.runSearch();
											checkGovernance();
											var TxSearchresults = TxresultSet.getResults(0,1);
											nlapiLogExecution('audit', 'TxSearchresults.length', TxSearchresults.length);
											if (TxSearchresults.length == 0)
											{
												var rec = nlapiCreateRecord('invoice');
												checkGovernance();
												rec.setFieldValue('entity',customerid);
												rec.setFieldValue('subsidiary',10);
												rec.setFieldValue('location',INVlocation);
												rec.setFieldValue('cseg1',Channelid);
												rec.setFieldValue('trandate',INVDate);
												rec.setFieldValue('custbodypossalesid',SalesNum);
												rec.setFieldValue('custbodyposjson',JSON.stringify(SalesList[i]));
												var Redmpt = SalesNum.substring(1,3);
												if (Redmpt == '10')
												{
													rec.setFieldValue('custbodyredemptioninvoice','T');
												}
												var JTxnPayment = SalesList[i]['Payment'];
												checkGovernance();
												nlapiLogExecution('debug', 'JTxnPayment', JTxnPayment);
												nlapiLogExecution('debug', 'i', i);
												var JTxnDetail = SalesList[i]['Detail'];
												if(JTxnDetail)
												{
													for(var j = 0; j < JTxnDetail.length; j++)
													{
														// nlapiLogExecution('debug', 'j', j);
														var lineSalesNum = JTxnDetail[j]['RL'];
														var lineNum = JTxnDetail[j]['DK'];
														var lineProductCode = JTxnDetail[j]['BC'];
														var lineQTY = JTxnDetail[j]['QU'];
														var lineOriginalRate = JTxnDetail[j]['UP'];
														// var lineAmt = JTxnDetail[j]['VDA'];
														var linePreDiscAmt = JTxnDetail[j]['PreDiscAmt'];
														var lineDiscountedAmt = JTxnDetail[j]['DiscountedAmt'];
														var lineDiscAmt = JTxnDetail[j]['DiscAmt'];
														var lineRate = parseFloat(lineDiscountedAmt) / parseFloat(lineQTY);
														var lineCancelled = JTxnDetail[j]['CA'];
														// nlapiLogExecution('debug', 'lineRate', lineRate);
														// nlapiLogExecution('debug', 'lineCancelled', lineCancelled);
														// nlapiLogExecution('debug', 'lineQTY', lineQTY);
														var XC = JTxnDetail[j]['XC'];
														var Redmpt = SalesNum.substring(1,3);
														if (Redmpt == '10' || XC == '81')
														{
															lineRate = 0;
														}
														
														var matchedItem = '';
														var DK = JTxnDetail[j]['DK'];
														// nlapiLogExecution('debug', 'DK', DK);
														if (lineCancelled == false)
														{									
															
															if (lineQTY > 0)
															{	
																nlapiLogExecution('debug', 'lineQTY > 0', 'start');
																rec.selectNewLineItem('item')
																var ItemSearch = nlapiLoadSearch('item', 'customsearchpositem');
																checkGovernance();
																var Itemsearchfilter = ItemSearch.getFilters();
																Itemsearchfilter[0] = new nlobjSearchFilter('custitem_barcode', null, 'is', lineProductCode);
																Itemsearchfilter[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
																ItemSearch.setFilters(Itemsearchfilter);
																var ItemSearchColumn = ItemSearch.getColumns();
																ItemSearchColumn[0] = new nlobjSearchColumn('islotitem', null);
																ItemSearch.setColumns(ItemSearchColumn);
																var ItemresultSet = ItemSearch.runSearch();
																checkGovernance();
																var ItemSearchresults = ItemresultSet.getResults(0,1);
																// nlapiLogExecution('debug', 'ItemSearchresults.length', ItemSearchresults.length);
																if (ItemSearchresults.length > 0)
																{
																	var itemid = ItemSearchresults[0].getId();
																	var columns = ItemSearchresults[0].getAllColumns();
																	var islotitem = ItemSearchresults[0].getValue(columns[0]);
																	var itemNum = ItemSearchresults[0].getValue(columns[4]);
																	var displayname = ItemSearchresults[0].getValue(columns[1]);
																	// nlapiLogExecution('debug', 'islotitem', islotitem);
																	matchedItem = itemid;
																}
																else
																{
																	var itemid = 513; //(temp Item with error)
																	rec.setCurrentLineItemValue('item','description','item is not matching' + lineProductCode);
																}
																
																// nlapiLogExecution('debug', 'itemid', itemid);
																rec.setCurrentLineItemValue('item','item',itemid);
                                                                rec.setCurrentLineItemValue('item', 'price', -1)
																rec.setCurrentLineItemValue('item','quantity',lineQTY);
																rec.setCurrentLineItemValue('item','rate',lineRate);
																nlapiLogExecution('debug', 'Line#: ' + j, 'itemid: ' + itemid);
																nlapiLogExecution('debug', 'lineQTY: ' + lineQTY, 'lineRate: ' + lineRate);
																
																if (islotitem == 'T')
																{
																	//
																	var filters = new Array();
																	filters[0] = new nlobjSearchFilter( 'item', null, 'anyOf', itemid);
																	filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'GREATERTHAN', lineQTY);
																	filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHAN', lineQTY);
																	filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', INVlocation);
																	var columns = new Array();
																	columns[0] = new nlobjSearchColumn('inventorynumber');
																	columns[1] = new nlobjSearchColumn('expirationdate');
																	columns[1].setSort(); 
																	columns[2] = new nlobjSearchColumn('location');
																	var LotNumSearch = nlapiCreateSearch('inventorynumber', filters, columns);
																	checkGovernance();
																	var Error_Count = 0;
																	var LotNumSearchresultSet = LotNumSearch.runSearch();
																	checkGovernance();
																	var LotNumSearchresults = LotNumSearchresultSet.getResults(0,1);
																	// nlapiLogExecution('debug', 'LotNumSearchresults.length', LotNumSearchresults.length);
																	var LotNum = '';
																	for ( var m = 0; LotNumSearchresults.length > 0 && LotNumSearchresults && m == 0 ; m++ )
																	{
																		// nlapiLogExecution('debug', 'm', m);
																		var inventoryNumID = LotNumSearchresults[m].getId();
																		var ResultColumns = LotNumSearchresults[m].getAllColumns();
																		// nlapiLogExecution('audit', 'LotNum Location', LotNumSearchresults[m].getValue(ResultColumns[2]));
																		LotNum = LotNumSearchresults[m].getValue(ResultColumns[0]);
																		// nlapiLogExecution('audit', 'itemid = ' + itemid, 'LotNum = ' + LotNum);
																	}
																	if (LotNum != '')
																	{	
																	//
																
																		var subrec = rec.createCurrentLineItemSubrecord('item', 'inventorydetail');
																		subrec.selectNewLineItem('inventoryassignment');
																		subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
																		subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', lineQTY);
																		subrec.commitLineItem('inventoryassignment');
																		subrec.commit();
																	}
																	else
																	{
																		rec.setCurrentLineItemValue('item','item',513);
																		rec.setCurrentLineItemValue('item','description','item has no stock. ' + lineProductCode);
																		rec.setCurrentLineItemValue('item','custcolposremarks',matchedItem);
																	}
																}
																
																rec.commitLineItem('item');
																invoiceAMT = invoiceAMT + (lineRate * lineQTY);
																// nlapiLogExecution('debug', 'invoiceAMT @ Line ' + j , invoiceAMT);
																nlapiLogExecution('debug', 'lineQTY > 0', 'end');
															}
															else //item line qty <0
															{
																nlapiLogExecution('debug', 'lineQTY > 0 Else', 'start');
																var recCM = nlapiCreateRecord('creditmemo');
																// nlapiLogExecution('debug', 'creditmemo', 'created');
																checkGovernance();
																recCM.setFieldValue('entity',customerid);
																recCM.setFieldValue('subsidiary',10);
																recCM.setFieldValue('location',INVlocation);
																recCM.setFieldValue('cseg1',Channelid);
																recCM.setFieldValue('trandate',INVDate);
																recCM.setFieldValue('custbodypossalesid',SalesNum);
																recCM.selectNewLineItem('item')
																var ItemSearch = nlapiLoadSearch('item', 'customsearchpositem');
																checkGovernance();
																var Itemsearchfilter = ItemSearch.getFilters();
																Itemsearchfilter[0] = new nlobjSearchFilter('custitem_barcode', null, 'is', lineProductCode);
																ItemSearch.setFilters(Itemsearchfilter);
																var ItemSearchColumn = ItemSearch.getColumns();
																ItemSearchColumn[0] = new nlobjSearchColumn('islotitem', null);
																ItemSearch.setColumns(ItemSearchColumn);
																var ItemresultSet = ItemSearch.runSearch();
																checkGovernance();
																var ItemSearchresults = ItemresultSet.getResults(0,1);
																// nlapiLogExecution('debug', 'ItemSearchresults.length', ItemSearchresults.length);
																if (ItemSearchresults.length > 0)
																{
																	var itemid = ItemSearchresults[0].getId();
																	var columns = ItemSearchresults[0].getAllColumns();
																	var islotitem = ItemSearchresults[0].getValue(columns[0]);
																	// nlapiLogExecution('debug', 'islotitem', islotitem);
																	// matchedItem = itemid;
																	var itemNum = ItemSearchresults[0].getValue(columns[4]);
																	var displayname = ItemSearchresults[0].getValue(columns[1]);
																	// nlapiLogExecution('debug', 'islotitem', islotitem);
																	matchedItem = itemid;
																}
																else
																{
																	var itemid = 513; //(temp Item with error)
																	rec.setCurrentLineItemValue('item','description','item is not matching. ' + lineProductCode);
																	rec.setCurrentLineItemValue('item','custcolposremarks',matchedItem);
																}
																
																lineQTY = lineQTY * -1;
																// nlapiLogExecution('debug', 'lineQTY', lineQTY);
																if (lineRate < 0)
																{
																	lineRate * -1;
																}
																// nlapiLogExecution('debug', 'lineRate', lineRate);
																recCM.setCurrentLineItemValue('item','item',itemid);
																recCM.setCurrentLineItemValue('item','quantity',lineQTY);
																recCM.setCurrentLineItemValue('item','rate',lineRate);
																nlapiLogExecution('debug', 'itemid', itemid);
																nlapiLogExecution('debug', 'lineQTY: ' + lineQTY, 'lineRate: ' + lineRate);
																
																if (islotitem == 'T')
																{
																	//
																	var filters = new Array();
																	filters[0] = new nlobjSearchFilter( 'item', null, 'anyOf', itemid);
																	filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'GREATERTHAN', lineQTY);
																	filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHAN', lineQTY);
																	
																	filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', INVlocation);
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
																	// nlapiLogExecution('debug', 'LotNumSearchresults.length', LotNumSearchresults.length);
																	var LotNum = '';
																	for ( var m = 0; LotNumSearchresults.length > 0 && LotNumSearchresults && m == 0 ; m++ )
																	{
																		// nlapiLogExecution('debug', 'm', m);
																		var inventoryNumID = LotNumSearchresults[m].getId();
																		var ResultColumns = LotNumSearchresults[m].getAllColumns();
																		LotNum = LotNumSearchresults[m].getValue(ResultColumns[0]);
																		// nlapiLogExecution('debug', 'LotNum', LotNum);
																	}
																	if (LotNum != '')
																	{	
																	//
																
																		var subrec = recCM.createCurrentLineItemSubrecord('item', 'inventorydetail');
																		subrec.selectNewLineItem('inventoryassignment');
																		subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
																		subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', lineQTY);
																		subrec.commitLineItem('inventoryassignment');
																		subrec.commit();
																	}
																	else
																	{
																		recCM.setCurrentLineItemValue('item','item',513);
																		rec.setCurrentLineItemValue('item','description','item has no stock. ' + lineProductCode);
																		rec.setCurrentLineItemValue('item','custcolposremarks',matchedItem);
																		
																	}
																}
																
																recCM.commitLineItem('item');
																// nlapiLogExecution('debug', 'line commit');
																// nlapiLogExecution('debug', 'CM_index', CM_index);
																try{
																CMid[CM_index] = nlapiSubmitRecord(recCM);
																checkGovernance();
																}
																catch (err)
																{
																	nlapiLogExecution('error', 'error Message: ' + err, JSON.stringify(SalesList[i]));
																	var recError = nlapiCreateRecord('customrecordpossyncerror');
																	checkGovernance();
																	recError.setFieldValue('custrecordsyncerror_posid', SalesNum);
																	recError.setFieldValue('custrecordsyncerror_json', JSON.stringify(SalesList[i]));
																	recError.setFieldValue('custrecordsynerror_date', INVDate); 
																	recError.setFieldValue('custrecordsyncerror_msg', err);
																	var ErrorID = nlapiSubmitRecord(recError);
																	checkGovernance();
																}
																// nlapiLogExecution('debug', 'Credit Memo Created', CMid[CM_index]);
																CM_index = CM_index + 1;
																// nlapiLogExecution('debug', 'CM_index', CM_index);
																// nlapiLogExecution('debug', 'CMid[' + CM_index - 1 + ']', CMid[CM_index-1]);
																// (CM_index > 0 && CMid[0] != 0)
																nlapiLogExecution('debug', 'lineQTY > 0 Else', 'end');
															}	
														}
													}
												}
												checkGovernance();
												nlapiLogExecution('debug', 'DK2.', DK);
												// var JTxnPayment = SalesList[i]['Payment'];
												checkGovernance();
												nlapiLogExecution('debug', 'JTxnPayment', JTxnPayment);
												// if(JTxnPayment)
												{
													try{
													checkGovernance();
													nlapiLogExecution('debug', 'before TXid');
													var TXid = nlapiSubmitRecord(rec);
													nlapiLogExecution('debug', 'TXid', TXid);
													checkGovernance();
													//Payment
												
													// nlapiLogExecution('debug', 'Total invoiceAMT', invoiceAMT);
													if(JTxnPayment)
													{
														if (invoiceAMT > 0)
														{
															var JTxnPayment = SalesList[i]['Payment'];
															// nlapiLogExecution('debug', 'JTxnPayment', JTxnPayment);
															if(JTxnPayment)
															{
																// nlapiLogExecution('debug', 'JTxnPayment.length', JTxnPayment.length);
																for(var k = 0; k < JTxnPayment.length; k++)
																{
																	var PLineCA = JTxnPayment[k]['CA'];	
																	if( PLineCA != true)
																	  {
																	// nlapiLogExecution('debug', 'k', k);
																	var PLineSalesNum = JTxnPayment[k]['RL'];
																	var PLineMethod = JTxnPayment[k]['PM'];
																	
																	var PAYDate = JTxnPayment[k]['PD'];
																	var start = PAYDate.indexOf("(");
																	var end = PAYDate.indexOf(")");
																	var Temp1 = PAYDate.substr(start + 1, end - start - 1);
																	var Temp2 = parseInt(Temp1);
																	var Temp3 = new Date(Temp2);
																	var PAYDate = GetDateKeyddmmyyyy(Temp3);
																	
																	var NSpaymentMeth = 1;
																	if(PLineMethod == 0)
																	{
																		NSpaymentMeth = 1;
																	}
																	else if(PLineMethod == 1) //octopus
																	{
																		NSpaymentMeth = 16;
																	}
																	else if(PLineMethod == 2) //Visa
																	{
																		NSpaymentMeth = 5;
																	}
																	else if(PLineMethod == 3) //Master
																	{
																		NSpaymentMeth = 4;
																	}
																	else if(PLineMethod == 4) //AE
																	{
																		NSpaymentMeth = 8;
																	}
																	else if(PLineMethod == 5) //Union Pay
																	{
																		NSpaymentMeth = 9;
																	}
																	else if(PLineMethod == 6) // Wechat Pay
																	{
																		NSpaymentMeth = 10;
																	}
																	else if(PLineMethod == 7) // Alipay
																	{
																		NSpaymentMeth = 11;
																	}
																	else if(PLineMethod == 9) //CNY
																	{
																		NSpaymentMeth = 12;
																	}
																	else if(PLineMethod == 10) // phyical Voucher
																	{
																		NSpaymentMeth = 7;
																	}
																	else if(PLineMethod == 11) // eVoucher
																	{
																		NSpaymentMeth = 14;
																	}
																	else if(PLineMethod == 12) //wechat voucher
																	{
																		NSpaymentMeth = 15;
																	}
																	else if(PLineMethod == 13) //Comp
																	{
																		NSpaymentMeth = 17;
																	}
																	else if(PLineMethod == 15) //TTX
																	{
																		NSpaymentMeth = 18;
																	}
																	else if(PLineMethod == 17) //JCB
																	{
																		NSpaymentMeth = 19;
																	}
																	else if(PLineMethod == 18) //Cash Coupon
																	{
																		NSpaymentMeth = 20;
																	}
																	else if(PLineMethod == 19) //Send Bill
																	{
																		NSpaymentMeth = 27;
																	}
																	else if(PLineMethod == 20) // Sino CP 50
																	{
																		NSpaymentMeth = 29;
																	}
																	else if(PLineMethod == 21) // Sino CP 20
																	{
																		NSpaymentMeth = 30;
																	}
																	else if(PLineMethod == 22) // $30 SHKP GC
																	{
																		NSpaymentMeth = 31;
																	}
																	else if(PLineMethod == 23) // $50 SHKP GC
																	{
																		NSpaymentMeth = 32;
																	}
																	else if(PLineMethod == 24) // $100 SHKP GC
																	{
																		NSpaymentMeth = 33;
																	}
																	else if(PLineMethod == 25) // $25 SHKP GC
																	{
																		NSpaymentMeth = 34;
																	}
																	else if(PLineMethod == 26) // $10 Sino CP
																	{
																		NSpaymentMeth = 35;
																	}
																	else if(PLineMethod == 27) // $100 Sino GC
																	{
																		NSpaymentMeth = 36;
																	}
																	else if(PLineMethod == 28) // DH $50 GV
																	{
																		NSpaymentMeth = 40;
																	}
																	else if(PLineMethod == 29) // tap and go
																	{
																		NSpaymentMeth = 41;
																	}
																	else if(PLineMethod == 30) // HLand GC-$30
																	{
																		NSpaymentMeth = 42;
																	}
																	else if(PLineMethod == 31) // HLand GC-$50
																	{
																		NSpaymentMeth = 43;
																	}
																	else if(PLineMethod == 32) // HLand GC-$100
																	{
																		NSpaymentMeth = 44;
																	}
																	else if(PLineMethod == 33) // Hang Lung Cash Coupon
																	{
																		NSpaymentMeth = 45;
																	}
																	else if(PLineMethod == 34) // Chinachem SC
																	{
																		NSpaymentMeth = 52;
																	}
																	else if(PLineMethod == 35) // Citygate SV
																	{
																		NSpaymentMeth = 53;
																	}
																	else if(PLineMethod == 36) // Uplan Coupon
																	{
																		NSpaymentMeth = 54;
																	}
																	else if(PLineMethod == 37) // New Town Plaza Cash Coupon
																	{
																		NSpaymentMeth = 75;
																	}
																	else if(PLineMethod == 39) // MOKO Cash Coupon
																	{
																		NSpaymentMeth = 76;
																	}
																	else if(PLineMethod == 40) // BOC Cash Coupon
																	{
																		NSpaymentMeth = 77;
																	}
																	else if(PLineMethod == 41) // HSB Cash Coupon
																	{
																		NSpaymentMeth = 78;
																	}
																	else if(PLineMethod == 38) // HKTB Cash Coupon
																	{
																		NSpaymentMeth = 79;
																	}
																	else if(PLineMethod == 42) // BOC Pay
																	{
																		NSpaymentMeth = 81;
																	}
																	else if(PLineMethod == 43) // 雲閃付
																	{
																		NSpaymentMeth = 80;
																	}
																	else if(PLineMethod == 44) // On Us Cash Coupon
																	{
																		NSpaymentMeth = 89;
																	}
																	else if(PLineMethod == 45) // Festival Walk Cash Coupon
																	{
																		NSpaymentMeth = 87;
																	}
																	else if(PLineMethod == 46) // Airport Cash Coupon
																	{
																		NSpaymentMeth = 90;
																	}
																	else if(PLineMethod == 47) // MTR Cash Coupon
																	{
																		NSpaymentMeth = 91;
																	}
																	else if(PLineMethod == 48) // POS Other 1
																	{
																		NSpaymentMeth = 92;
																	}
																	else if(PLineMethod == 49) // POS Other 2
																	{
																		NSpaymentMeth = 93;
																	}
																	else if(PLineMethod == 50) // POS Other 3
																	{
																		NSpaymentMeth = 94;
																	}
																	else if(PLineMethod == 51) // POS Other 4
																	{
																		NSpaymentMeth = 95;
																	}
																	else 
																	{
																		NSpaymentMeth = 1;
																	}
																	
																	// nlapiLogExecution('debug', 'CM_index',CM_index);
																	var recPay = nlapiTransformRecord('invoice',TXid,'customerpayment');
																	checkGovernance();
																	// nlapiLogExecution('debug', 'recPay Transformed');
																	recPay.setFieldValue('location',Locationid);
																	recPay.setFieldValue('trandate',PAYDate);
																	if (CM_index > 0)
																	{
																		
																		var InvCrLineCount = recPay.getLineItemCount('credit');
																		// nlapiLogExecution('debug', 'InvCrLineCount',InvCrLineCount);
																		for(var o = 1; o <= InvCrLineCount; o++)
																		{
																			for(var n = 0; n < CM_index; n++)
																			{
																				// nlapiLogExecution('debug', 'o', o);
																				var applied = recPay.getLineItemValue('credit','apply',o);
																				var doc = recPay.getLineItemValue('credit','doc',o);
																				// nlapiLogExecution('debug', 'doc = ' + doc, 'CMid[n] = ' + CMid[n]);
																				
																				// nlapiLogExecution('debug', 'due = ' + recPay.getLineItemValue('credit','due',o), 'amount = ' + recPay.getLineItemValue('credit','amount',o));
																				if (doc == CMid[n])
																				{
																					recPay.setLineItemValue('credit','apply',o, 'T');
																					recPay.setLineItemValue('credit','amount',o, recPay.getLineItemValue('credit','due',o));
																					nlapiLogExecution('debug', 'apply = ' + recPay.getLineItemValue('credit','apply',o), 'amount = ' + recPay.getLineItemValue('credit','amount',o));
																				}
																			}
																		}
																	}
																	
																	var PLineAmt = JTxnPayment[k]['PA'];
																	var PLineDate = JTxnPayment[k]['PD'];
																		var start = PLineDate.indexOf("(");
																		var end = PLineDate.indexOf(")");
																		var Temp1 = PLineDate.substr(start + 1, end - start - 1);
																		var Temp2 = parseInt(Temp1);
																		var Temp3 = new Date(Temp2);
																	var PLineDate = GetDateKeyddmmyyyy(Temp3);
																	var PLineCancelled = JTxnPayment[k]['CA'];
																	
																	
																	recPay.setFieldValue('memo',NSpaymentMeth);
																	recPay.setFieldValue('paymentmethod',NSpaymentMeth);
																	recPay.setFieldValue('trandate',PLineDate);
																	var InvLineCount = recPay.getLineItemCount('apply');
																	// nlapiLogExecution('debug', 'InvLineCount',InvLineCount);
																	for(var l = 1; l <= InvLineCount; l++)
																	{
																		
																		var applied = recPay.getLineItemValue('apply','apply',l);
																		// nlapiLogExecution('debug', 'applied',applied);
																		if (applied == 'T')
																		{
																			recPay.setLineItemValue('apply','apply',l, 'T');
																			if (JTxnPayment.length > 1)
																			{
																				recPay.setLineItemValue('apply','amount',l,PLineAmt);
																			}
																			// recPay.setLineItemValue('apply','amount',l,PLineAmt);
																			// nlapiLogExecution('debug', 'applied amount',recPay.getLineItemValue('apply','amount',l));
																			
																			// nlapiLogExecution('debug', 'l',l);
																		}
																	}
																	
																	// nlapiLogExecution('debug', 'PLineAmt',PLineAmt);
																	
																	
																	
																	// if (CM_index > 0 && CMid[0] != 0)
																	// {
																		// for(var n = 0; n <= CM_index; n++)
																		// {
																			// var InvCrLineCount = recPay.getLineItemCount('credit');
																			// nlapiLogExecution('debug', 'InvCrLineCount',InvCrLineCount);
																			// for(var o = 1; o <= InvCrLineCount; o++)
																			// {
																				// nlapiLogExecution('debug', 'o', o);
																				// var applied = recPay.getLineItemValue('credit','apply',o);
																				// var doc = recPay.getLineItemValue('credit','doc',o);
																				// nlapiLogExecution('debug', 'doc', doc);
																				// if (doc == CMid[n])
																				// {
																					// recPay.setLineItemValue('credit','apply',o, 'T');
																				// }
																			// }
																		// }
																	// }
																	
																	recPay.setFieldValue('trandate',PLineDate);
																	var PayID = nlapiSubmitRecord(recPay);
																	checkGovernance();
																	// nlapiLogExecution('debug', 'PayID1',PayID);
																	nlapiSubmitField('invoice',TXid,'custbodypospaymentmethod',NSpaymentMeth);
																	
																	checkGovernance();
																}
																}
															}
															else if (CM_index > 0 && CMid[0] != 0)
															{
																var recPay = nlapiTransformRecord('invoice',TXid,'customerpayment');
																checkGovernance();
																// nlapiLogExecution('debug', 'recPay Transformed');
																recPay.setFieldValue('location',Locationid);
																// recPay.setFieldValue('memo',PLineMethod);
																var InvLineCount = recPay.getLineItemCount('apply');
																// nlapiLogExecution('debug', 'InvLineCount',InvLineCount);
																for(var l = 1; l <= InvLineCount; l++)
																{
																	// nlapiLogExecution('debug', 'l',l);
																	var applied = recPay.getLineItemValue('apply','apply',l);
																	// nlapiLogExecution('debug', 'applied',applied);

																}
																
																if (CM_index > 0 && CMid[0] != 0)
																{
																	for(var n = 0; n <= CM_index; n++)
																	{
																		var InvCrLineCount = recPay.getLineItemCount('credit');
																		// nlapiLogExecution('debug', 'InvCrLineCount',InvCrLineCount);
																		for(var o = 1; o <= InvCrLineCount; o++)
																		{
																			// nlapiLogExecution('debug', 'o', o);
																			var applied = recPay.getLineItemValue('credit','apply',o);
																			var doc = recPay.getLineItemValue('credit','doc',o);
																			// nlapiLogExecution('debug', 'doc', doc);
																			// nlapiLogExecution('debug', 'CMid[n]' + n, CMid[n]);
																			if (doc == CMid[n])
																			{
																				recPay.setLineItemValue('credit','apply',o, 'T');
																			}
																		}
																	}
																}
																recPay.setFieldValue('trandate',TxnDate);
																var PayID = nlapiSubmitRecord(recPay);
																checkGovernance();
																// nlapiLogExecution('debug', 'PayID2',PayID);
																nlapiSubmitField('invoice',TXid,'custbodypospaymentmethod',NSpaymentMeth);
																checkGovernance();
															}
														}
														else
														{
															var JTxnPayment = SalesList[i]['Payment'];
															// nlapiLogExecution('debug', 'JTxnPayment', JTxnPayment);
															if(JTxnPayment)
															{
																// nlapiLogExecution('debug', 'JTxnPayment.length', JTxnPayment.length);
																for(var k = 0; k < JTxnPayment.length; k++)
																{
																	// nlapiLogExecution('debug', 'k', k);
																	var PLineSalesNum = JTxnPayment[k]['RL'];
																	var PLineMethod = JTxnPayment[k]['PM'];
																	var NSpaymentMeth = 1;
																	if(PLineMethod == 0)
																	{
																		NSpaymentMeth = 1;
																	}
																	else if(PLineMethod == 1) //octopus
																	{
																		NSpaymentMeth = 16;
																	}
																	else if(PLineMethod == 2) //Visa
																	{
																		NSpaymentMeth = 5;
																	}
																	else if(PLineMethod == 3) //Master
																	{
																		NSpaymentMeth = 4;
																	}
																	else if(PLineMethod == 4) //AE
																	{
																		NSpaymentMeth = 8;
																	}
																	else if(PLineMethod == 5) //Union Pay
																	{
																		NSpaymentMeth = 9;
																	}
																	else if(PLineMethod == 6) // Wechat Pay
																	{
																		NSpaymentMeth = 10;
																	}
																	else if(PLineMethod == 7) // Alipay
																	{
																		NSpaymentMeth = 11;
																	}
																	else if(PLineMethod == 9) //CNY
																	{
																		NSpaymentMeth = 12;
																	}
																	else if(PLineMethod == 10) // phyical Voucher
																	{
																		NSpaymentMeth = 7;
																	}
																	else if(PLineMethod == 11) // eVoucher
																	{
																		NSpaymentMeth = 14;
																	}
																	else if(PLineMethod == 12) //wechat voucher
																	{
																		NSpaymentMeth = 15;
																	}
																	else if(PLineMethod == 13) //Comp
																	{
																		NSpaymentMeth = 17;
																	}
																	else if(PLineMethod == 15) //TTX
																	{
																		NSpaymentMeth = 18;
																	}
																	
																	else if(PLineMethod == 17) //JCB
																	{
																		NSpaymentMeth = 19;
																	}
																	else if(PLineMethod == 18) //Cash Coupon
																	{
																		NSpaymentMeth = 20;
																	}
																	else if(PLineMethod == 19) //Send Bill
																	{
																		NSpaymentMeth = 27;
																	}
																	else if(PLineMethod == 20) // Sino CP 50
																	{
																		NSpaymentMeth = 29;
																	}
																	else if(PLineMethod == 21) // Sino CP 20
																	{
																		NSpaymentMeth = 30;
																	}
																	else if(PLineMethod == 22) // $30 SHKP GC
																	{
																		NSpaymentMeth = 31;
																	}
																	else if(PLineMethod == 23) // $50 SHKP GC
																	{
																		NSpaymentMeth = 32;
																	}
																	else if(PLineMethod == 24) // $100 SHKP GC
																	{
																		NSpaymentMeth = 33;
																	}
																	else if(PLineMethod == 25) // $25 SHKP GC
																	{
																		NSpaymentMeth = 34;
																	}
																	else if(PLineMethod == 26) // $10 Sino CP
																	{
																		NSpaymentMeth = 35;
																	}
																	else if(PLineMethod == 27) // $100 Sino GC
																	{
																		NSpaymentMeth = 36;
																	}
																	else if(PLineMethod == 28) // DH $50 GV
																	{
																		NSpaymentMeth = 40;
																	}
																	else if(PLineMethod == 29) // tap and go
																	{
																		NSpaymentMeth = 41;
																	}
																	else if(PLineMethod == 30) // HLand GC-$30
																	{
																		NSpaymentMeth = 42;
																	}
																	else if(PLineMethod == 31) // HLand GC-$50
																	{
																		NSpaymentMeth = 43;
																	}
																	else if(PLineMethod == 32) // HLand GC-$100
																	{
																		NSpaymentMeth = 44;
																	}
																	else if(PLineMethod == 33) // Hang Lung Cash Coupon
																	{
																		NSpaymentMeth = 45;
																	}
																	else if(PLineMethod == 34) // Chinachem SC
																	{
																		NSpaymentMeth = 52;
																	}
																	else if(PLineMethod == 35) // Citygate SV
																	{
																		NSpaymentMeth = 53;
																	}
																	else if(PLineMethod == 36) // Uplan Coupon
																	{
																		NSpaymentMeth = 54;
																	}
																	else if(PLineMethod == 37) // New Town Plaza Cash Coupon
																	{
																		NSpaymentMeth = 75;
																	}
																	else if(PLineMethod == 39) // MOKO Cash Coupon
																	{
																		NSpaymentMeth = 76;
																	}
																	else if(PLineMethod == 40) // BOC Cash Coupon
																	{
																		NSpaymentMeth = 77;
																	}
																	else if(PLineMethod == 41) // HSB Cash Coupon
																	{
																		NSpaymentMeth = 78;
																	}
																	else if(PLineMethod == 38) // HKTB Cash Coupon
																	{
																		NSpaymentMeth = 79;
																	}
																	else if(PLineMethod == 42) // BOC Pay
																	{
																		NSpaymentMeth = 81;
																	}
																	else if(PLineMethod == 43) // 雲閃付
																	{
																		NSpaymentMeth = 80;
																	}
																	else if(PLineMethod == 44) // On Us Cash Coupon
																	{
																		NSpaymentMeth = 89;
																	}
																	else if(PLineMethod == 45) // Festival Walk Cash Coupon
																	{
																		NSpaymentMeth = 87;
																	}
																	else if(PLineMethod == 46) // Airport Cash Coupon
																	{
																		NSpaymentMeth = 90;
																	}
																	else if(PLineMethod == 47) // MTR Cash Coupon
																	{
																		NSpaymentMeth = 91;
																	}
																	else if(PLineMethod == 48) // POS Other 1
																	{
																		NSpaymentMeth = 92;
																	}
																	else if(PLineMethod == 49) // POS Other 2
																	{
																		NSpaymentMeth = 93;
																	}
																	else if(PLineMethod == 50) // POS Other 3
																	{
																		NSpaymentMeth = 94;
																	}
																	else if(PLineMethod == 51) // POS Other 4
																	{
																		NSpaymentMeth = 95;
																	}
																	else 
																	{
																		NSpaymentMeth = 1;
																	}
																	nlapiSubmitField('invoice',TXid,'custbodypospaymentmethod',NSpaymentMeth);
																	checkGovernance();
																}
															}
														}
													}
													
													
													}
													catch (err)
													{
														nlapiLogExecution('error', 'Invoice create error', SalesNum);
														nlapiLogExecution('error', 'error Message: ' + err, JSON.stringify(SalesList[i]));
														var recError = nlapiCreateRecord('customrecordpossyncerror');
														checkGovernance();
														recError.setFieldValue('custrecordsyncerror_posid', SalesNum);
														recError.setFieldValue('custrecordsyncerror_json', JSON.stringify(SalesList[i]));
														recError.setFieldValue('custrecordsynerror_date', INVDate); 
														recError.setFieldValue('custrecordsyncerror_msg', err);
														var ErrorID = nlapiSubmitRecord(recError);
														checkGovernance();
													}
													checkGovernance();
													nlapiLogExecution('debug', 'Invoice Created', TXid);
												}
												
											}
										}
										/*else //Cancel = true
										{
											var JTxnPayment = SalesList[i]['Payment'];
											nlapiLogExecution('debug', 'JTxnPayment', JTxnPayment);
											if(JTxnPayment)
											{
												var filters = new Array();
												// filters[2] = new nlobjSearchFilter('type', null, 'anyOf', 'invoice');
												filters[1] = new nlobjSearchFilter('custbodypossalesid', null, 'is', SalesNum);
												filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
												var columns = new Array();
												columns[0] = new nlobjSearchColumn('internalid');
												columns[0].setSort(); 
												// var InvoiceSearch = nlapiCreateSearch('transaction', filters, columns);
												var InvoiceSearch = nlapiCreateSearch('invoice', filters, columns);
												checkGovernance();
												var Error_Count = 0;
												var InvoiceSearchresultSet = InvoiceSearch.runSearch();
												checkGovernance();
												var InvoiceSearchresults = InvoiceSearchresultSet.getResults(0,1);
												nlapiLogExecution('debug', 'InvoiceSearchresults.length', InvoiceSearchresults.length);
												var invID = '';
												for ( var n = 0; InvoiceSearchresults.length > 0 && InvoiceSearchresults && n == 0 ; n++ )
												{
													nlapiLogExecution('debug', 'n', n);
													invID = InvoiceSearchresults[n].getId();
													// var ResultColumns = InvoiceSearchresults[n].getAllColumns();
													// LotNum = InvoiceSearchresults[n].getValue(ResultColumns[0]);
													nlapiLogExecution('debug', 'invID', invID);
												}
												if(invID == '')
												{
													var rec = nlapiCreateRecord('invoice');
													checkGovernance();
													rec.setFieldValue('entity',customerid);
													rec.setFieldValue('subsidiary',10);
													rec.setFieldValue('location',Locationid);
													rec.setFieldValue('cseg1',Channelid);
													rec.setFieldValue('trandate',TxnDate);
													rec.setFieldValue('custbodypossalesid',SalesNum);
													
													var JTxnDetail = SalesList[i]['Detail'];
													if(JTxnDetail)
													{
														var numOfLine = 0;
														for(var j = 0; j < JTxnDetail.length; j++)
														{
															nlapiLogExecution('debug', 'j', j);
															var lineSalesNum = JTxnDetail[j]['RL'];
															var lineNum = JTxnDetail[j]['DK'];
															var lineProductCode = JTxnDetail[j]['BC'];
															var lineQTY = JTxnDetail[j]['QU'];
															var lineOriginalRate = JTxnDetail[j]['UP'];
															// var lineAmt = JTxnDetail[j]['VDA'];
															var linePreDiscAmt = JTxnDetail[j]['PreDiscAmt'];
															var lineDiscountedAmt = JTxnDetail[j]['DiscountedAmt'];
															var lineDiscAmt = JTxnDetail[j]['DiscAmt'];
															var lineRate = parseFloat(lineDiscountedAmt) / parseFloat(lineQTY);
															var lineCancelled = JTxnDetail[j]['CA'];
															
															if (lineCancelled == true)
															{
																numOfLine ++;
																rec.selectNewLineItem('item')
																var ItemSearch = nlapiLoadSearch('item', 'customsearchpositem');
																checkGovernance();
																var Itemsearchfilter = ItemSearch.getFilters();
																Itemsearchfilter[0] = new nlobjSearchFilter('custitem_barcode', null, 'is', lineProductCode);
																ItemSearch.setFilters(Itemsearchfilter);
																var ItemSearchColumn = ItemSearch.getColumns();
																ItemSearchColumn[0] = new nlobjSearchColumn('islotitem', null);
																ItemSearch.setColumns(ItemSearchColumn);
																var ItemresultSet = ItemSearch.runSearch();
																checkGovernance();
																var ItemSearchresults = ItemresultSet.getResults(0,1);
																nlapiLogExecution('debug', 'ItemSearchresults.length', ItemSearchresults.length);
																if (ItemSearchresults.length > 0)
																{
																	var itemid = ItemSearchresults[0].getId();
																	var columns = ItemSearchresults[0].getAllColumns();
																	var islotitem = ItemSearchresults[0].getValue(columns[0]);
																	nlapiLogExecution('debug', 'islotitem', islotitem);
																}
																else
																{
																	var itemid = 513; //(temp Item with error)
																	rec.setCurrentLineItemValue('item','description','item is not matching. ' + lineProductCode);
																}
																
																
																rec.setCurrentLineItemValue('item','item',itemid);
																rec.setCurrentLineItemValue('item','quantity',lineQTY);
																rec.setCurrentLineItemValue('item','rate',lineRate);
																
																if (islotitem == 'T')
																{
																	//
																	var filters = new Array();
																	filters[0] = new nlobjSearchFilter( 'item', null, 'anyOf', itemid);
																	filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'GREATERTHANOREQUALTO', lineQTY);
																	filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHANOREQUALTO', lineQTY);
																	filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', Locationid);
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
																		subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', lineQTY);
																		subrec.commitLineItem('inventoryassignment');
																		subrec.commit();
																	}
																	else
																	{
																		rec.setCurrentLineItemValue('item','item',513);
																		rec.setCurrentLineItemValue('item','description','item has not stock. ' + lineProductCode);
																	}
																}
																
																rec.commitLineItem('item');
																invoiceAMT = invoiceAMT + (lineRate * lineQTY);
															}
														}
													}
													// var JTxnPayment = SalesList[i]['Payment'];
													if (numOfLine > 0 )
													{
														var invID = nlapiSubmitRecord(rec);
														checkGovernance();
														nlapiLogExecution('debug', 'Invoice Created', invID);
													}
													
													
													// var invoiceAMT = rec.getFieldValue('total');
													nlapiLogExecution('debug', 'invoiceAMT', invoiceAMT);
													if (numOfLine > 0)
													{
														if (invoiceAMT > 0)
														{
															//Payment
															var JTxnPayment = SalesList[i]['Payment'];
															if(JTxnPayment)
															{
																for(var k = 0; k < JTxnPayment.length; k++)
																{
																	var PLineSalesNum = JTxnPayment[k]['RL'];
																	var PLineMethod = JTxnPayment[k]['PM'];
																	var NSpaymentMeth = 1;
																	if(PLineMethod == 0)
																	{
																		NSpaymentMeth = 1;
																	}
																	else if(PLineMethod == 1) //octopus
																	{
																		NSpaymentMeth = 16;
																	}
																	else if(PLineMethod == 2) //Visa
																	{
																		NSpaymentMeth = 5;
																	}
																	else if(PLineMethod == 3) //Master
																	{
																		NSpaymentMeth = 4;
																	}
																	else if(PLineMethod == 4) //AE
																	{
																		NSpaymentMeth = 8;
																	}
																	else if(PLineMethod == 5) //Union Pay
																	{
																		NSpaymentMeth = 9;
																	}
																	else if(PLineMethod == 6) // Wechat Pay
																	{
																		NSpaymentMeth = 10;
																	}
																	else if(PLineMethod == 7) // Alipay
																	{
																		NSpaymentMeth = 11;
																	}
																	else if(PLineMethod == 9) //CNY
																	{
																		NSpaymentMeth = 12;
																	}
																	else if(PLineMethod == 10) // phyical Voucher
																	{
																		NSpaymentMeth = 7;
																	}
																	else if(PLineMethod == 11) // eVoucher
																	{
																		NSpaymentMeth = 14;
																	}
																	else if(PLineMethod == 12) //wechat voucher
																	{
																		NSpaymentMeth = 15;
																	}
																	else if(PLineMethod == 13) //Comp
																	{
																		NSpaymentMeth = 17;
																	}
																	else if(PLineMethod == 15) //TTX
																	{
																		NSpaymentMeth = 18;
																	}
																	else if(PLineMethod == 17) //JCB
																	{
																		NSpaymentMeth = 19;
																	}
																	else if(PLineMethod == 18) //Cash Coupon
																	{
																		NSpaymentMeth = 20;
																	}
																	else if(PLineMethod == 19) //Send Bill
																	{
																		NSpaymentMeth = 27;
																	}
																	else 
																	{
																		NSpaymentMeth = 1;
																	}
																	var PLineAmt = JTxnPayment[k]['PA'];
																	var PLineDate = JTxnPayment[k]['PD'];
																		var start = PLineDate.indexOf("(");
																		var end = PLineDate.indexOf(")");
																		var Temp1 = PLineDate.substr(start + 1, end - start - 1);
																		var Temp2 = parseInt(Temp1);
																		var Temp3 = new Date(Temp2);
																	var PLineDate = GetDateKeyddmmyyyy(Temp3);
																	var PLineCancelled = JTxnPayment[k]['CA'];
																	var recPay = nlapiTransformRecord('invoice',invID,'customerpayment',{recordmode:'dynamic'});
																	nlapiLogExecution('debug', 'recPay Transformed');
																	recPay.setFieldValue('location',Locationid);
																	recPay.setFieldValue('memo',NSpaymentMeth);
																	recPay.setFieldValue('paymentmethod',NSpaymentMeth);
																	recPay.setFieldValue('trandate',TxnDate);
																	var InvLineCount = recPay.getLineItemCount('apply');
																	nlapiLogExecution('debug', 'InvLineCount',InvLineCount);
																	for(var l = 1; l <= InvLineCount; l++)
																	{
																		nlapiLogExecution('debug', 'l',l);
																		var applied = recPay.getLineItemValue('apply','apply',l);
																		nlapiLogExecution('debug', 'applied',applied);
																		if (applied == 'T')
																		{
																			recPay.setLineItemValue('apply','amount',l,PLineAmt);
																		}
																	}
																	var PayID = nlapiSubmitRecord(recPay);
																	checkGovernance();
																	nlapiLogExecution('debug', 'PayID',PayID);
																}
															}
														}
													}
												
													var recCredit = nlapiTransformRecord('invoice',invID, 'creditmemo');
													recCredit.setFieldValue('trandate',TxnDate);
													
													var CreditID = nlapiSubmitRecord(recCredit);
													nlapiLogExecution('debug', 'CreditID', CreditID);
													
													var recRefund = nlapiCreateRecord('customerrefund',{recordmode:'dynamic'} );
													recRefund.setFieldValue('customer',recCredit.getFieldValue('entity'));
													nlapiLogExecution('debug', 'customer', recCredit.getFieldValue('entity'));
													recRefund.setFieldValue('paymentmethod',NSpaymentMeth);
													recRefund.setFieldValue('trandate',TxnDate);
													recRefund.setFieldValue('location',Locationid);
													var refundLineCount = recRefund.getLineItemCount('apply');
													nlapiLogExecution('DEBUG','refundLineCount',refundLineCount);
													if (refundLineCount > 0)
													{
														for(var o = 1; o <= refundLineCount; o++)
														{
															recRefund.selectLineItem('apply', o);
															var applyID = recRefund.getCurrentLineItemValue('apply', 'doc');
															var amountRemaining = recRefund.getCurrentLineItemValue('apply', 'due');
															nlapiLogExecution('DEBUG','applyID', applyID);
															if (applyID == CreditID ) 
															{
																recRefund.setCurrentLineItemValue('apply', 'apply', 'T');
																recRefund.setCurrentLineItemValue('apply', 'amount', amountRemaining);
																recRefund.commitLineItem('apply');
															}
														}
														var JTxnPayment = SalesList[i]['Payment'];
															
														if (JTxnPayment)
														{
															if (amountRemaining > 0)
															{
																var RefundID = nlapiSubmitRecord(recRefund);
																nlapiLogExecution('debug', 'RefundID', RefundID);
															}
														}
													}
												}
											}
										}
										*/
									}
									// else
									// {
										// var rec = nlapiCreateRecord('salesorder');
										// checkGovernance();
										// nlapiLogExecution('debug', 'Create SO');
									// }
								}
							}
						}
					}
				}
			}
		}
	}
	var DateEnd = GetDateKeyDateEnd(now);
	nlapiSubmitField('customrecordintegrationlib',2,'custrecordintegrationlibdate',now);
	checkGovernance();
	nlapiSubmitField('customrecordintegrationlib',5,'custrecordintegrationlibdate',DateEnd);
	checkGovernance();
	nlapiLogExecution('debug', 'End');
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
	// var LoginURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_Login?sUsername=998&sPassword=998"
	var LoginURL = "https://ithpos.app/erunapi/api.asmx/System_Login?sUsername=999&sPassword=999"
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

function GetDateKeyDateEnd(datestring)
{
	var yyyy = datestring.substring(0,4);
	var mm = datestring.substring(5,7);
	var dd = datestring.substring(8,10);
	
	var fulldate = yyyy + "/" + mm + "/" + dd + " " + '23' + ":" + '59' + ":" + '59';

	// nlapiLogExecution('debug', 'fulldate', fulldate);
	
	return fulldate;
}

function GetDateKeyDateStart(datestring)
{
	var yyyy = datestring.substring(0,4);
	var mm = datestring.substring(5,7);
	var dd = datestring.substring(8,10);
	
	var fulldate = yyyy + "/" + mm + "/" + dd + " " + '00' + ":" + '00' + ":" + '01';

	// nlapiLogExecution('debug', 'fulldate', fulldate);
	
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

	// nlapiLogExecution('debug', 'fulldate', fulldate);
	
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

	// nlapiLogExecution('error', 'GetDateKeyyyyymmddToday_fulldate', fulldate);
	
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

	// nlapiLogExecution('audit', 'GetDateKeyyyyymmddLastWeek_fulldate', fulldate);
	
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

	// nlapiLogExecution('audit', 'GetDateKeyyyyymmddLastWeek_fulldate', fulldate);
	
	return fulldate;
}
function GetDateKeyddmmyyyyPlus7day(datestring)
{
	// var today = new Date();
	// nlapiLogExecution('debug', 'today', today);
	var plus7str = datestring.setDate(datestring.getDate() + 7);
	var plus7 = new Date(plus7str);
	var to0 = datestring.getTimezoneOffset();
	// nlapiLogExecution('debug', 'to0', to0);
	var utc = plus7.getTime() + (plus7.getTimezoneOffset() * 60000);
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

function initial0(num)
{
	var result = num;
	if(parseFloat(num) < 10)
	{
		result = '0' + num;
	}
	nlapiLogExecution('audit', 'initial0(num)', result);
	return result;
}

function FernSPEEDSearch(title)
{
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'name', null, 'is', title);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('custrecordintegrationlibnsid');

	var Search = nlapiCreateSearch('customrecordintegrationlib', filters, columns);
	checkGovernance();
	var SearchResultSet = Search.runSearch();
	var Searchresults = SearchResultSet.getResults(0,1);
	nlapiLogExecution('debug', 'Searchresults.length', Searchresults.length);
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