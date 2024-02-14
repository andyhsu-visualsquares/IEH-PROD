function Schedule_POS_to_NS()
{
	// Schedule_POS_Member_GetChanges_JV1();
	Schedule_POS_Xact_GetSalesChanges_J()
	
}

function Schedule_POS_Member_GetChanges_JV1()
{	
	Logout();
	var LoginRes = Login();
	nlapiLogExecution("debug","LoginRes",LoginRes);
	// CheckError();
	
	//Product_AddNew_J
	var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Member_GetChanges_JV1";
	
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/json","cookie": LoginRes};

	var requestBody = {};
	
	var lastSyncDateTime = nlapiLookupField('customrecordintegrationlib',1,'custrecordintegrationlibdate');
	nlapiLogExecution("debug","lastSyncDateTime",lastSyncDateTime);
	var today = new Date();
	var now = GetDateKey(today);
	// nlapiLogExecution("debug","now",now);
	
	requestBody.vBeginTime = lastSyncDateTime;
	nlapiLogExecution("debug","requestBody.vBeginTime",requestBody.vBeginTime);
	var response = nlapiRequestURL(url,JSON.stringify(requestBody),header,'POST');
	var ResponseBody = response.getBody();
	nlapiLogExecution("debug","ResponseBody",(ResponseBody));
	
	if (ResponseBody != '{"d":""}')
	{
		datain = JSON.parse(ResponseBody);
		nlapiLogExecution('debug','datain',datain);
		var d = datain['d'];
		nlapiLogExecution("debug","d",JSON.parse(d));
		d = JSON.parse(d);
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
					var filters = new Array();
					filters[0] = new nlobjSearchFilter( 'custrecordcustomersubcatecate', null, 'anyOf', 2);
					filters[1] = new nlobjSearchFilter( 'custrecordcustomersubcatposid', null, 'equalTo', SGR);
					// filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHANOREQUALTO', lineQTY);
					// filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', 208);
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
					recCus.setFieldValue('custentityposotherlang',N2L);
					var UpdatedCustomerID = nlapiSubmitRecord(recCus);
					checkGovernance();
					nlapiLogExecution('debug', 'UpdatedCustomerID', UpdatedCustomerID);
				}
				else
				{
					var recCus = nlapiCreateRecord('customer');
					checkGovernance();
					recCus.setFieldValue('isperson','T');
					recCus.setFieldValue('lastname',N1L);
					recCus.setFieldValue('firstname',N2L);
					recCus.setFieldValue('category',2);
					var memberSubCat = 1; //POS 1 = 10, 2 = 12, 3 = 11, 4 = 21, 5 = 22
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
					filters[0] = new nlobjSearchFilter( 'custrecordcustomersubcatecate', null, 'anyOf', 2);
					filters[1] = new nlobjSearchFilter( 'custrecordcustomersubcatposid', null, 'equalTo', SGR);
					// filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHANOREQUALTO', lineQTY);
					// filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', 208);
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
					
					recCus.setFieldValue('custentity_customer_sub_category',SubCat);
					recCus.setFieldValue('subsidiary',10);
					recCus.setFieldValue('custentity_approve','T');	
					recCus.setFieldValue('custentity_pending_complete','F');
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
					recCus.setFieldValue('custentityposotherlang',N2L);
					
					var newCustomerID = nlapiSubmitRecord(recCus);
					checkGovernance();
					nlapiLogExecution('debug', 'Customer Created /Updated', newCustomerID);
				}
				
			}
		}
		nlapiSubmitField('customrecordintegrationlib',1,'custrecordintegrationlibdate',now);
	}
}
function Schedule_POS_Xact_GetSalesChanges_J()
{	
	Logout();
	var LoginRes = Login();

	CheckError();
	
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
	d = JSON.parse(d);
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
	// var now = GetDateKeyErun(endTime);
	var SalesList = d['SalesList'];//SalesList
	nlapiLogExecution("debug","JSON.stringifySalesList",JSON.stringify(SalesList));
	// nlapiLogExecution("debug","memberList",(memberList));
	checkGovernance();
	// var NetAmount = d['NA'];//Net Amount
	if(SalesList && SalesList != null && SalesList != 'null' && SalesList != '' )
	{
		nlapiLogExecution("debug","length",(SalesList.length));
		for(var i = 0; i < SalesList.length; i++)
		{
			nlapiLogExecution("audit","SalesList " + i, JSON.stringify(SalesList[i]));	
			var ShopNum = SalesList[i]['SN'];
			var NetAmount = SalesList[i]['NA'];//Net Amount
			if(ShopNum != 99 && ShopNum != 0)
			{
				var SalesNum = SalesList[i]['RL'];
				nlapiLogExecution("debug","SalesNum",SalesNum);
				var ShopNum = SalesList[i]['SN'];
				/*
				var LocationSearch = nlapiLoadSearch('location', 'customsearchlocationpos');
				checkGovernance();
				var Locationsearchfilter = LocationSearch.getFilters();
				Locationsearchfilter[0] = new nlobjSearchFilter('custrecordlocationposid', null, 'equalTo', ShopNum);
				LocationSearch.setFilters(Locationsearchfilter);
				var LocationresultSet = LocationSearch.runSearch();
				checkGovernance();
				var LocationSearchresults = LocationresultSet.getResults(0,1);
				nlapiLogExecution('debug', 'LocationSearchresults.length', LocationSearchresults.length);
				if (LocationSearchresults.length > 0)
				{
					var Locationid = LocationSearchresults[0].getId();
				}
				else 
				{
					var Locationid = 208;
				}
				nlapiLogExecution('debug', 'Locationid', Locationid);
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
				nlapiLogExecution('debug', 'Locationid', Locationid);
				
				/*
				var ChannelSearch = nlapiLoadSearch('customrecord_cseg1', 'customsearchchannelpos');
				checkGovernance();
				var Channelsearchfilter = ChannelSearch.getFilters();
				Channelsearchfilter[0] = new nlobjSearchFilter('custrecordchannelposid', null, 'equalTo', ShopNum);
				ChannelSearch.setFilters(Channelsearchfilter);
				var ChannelSearchresultSet = ChannelSearch.runSearch();
				checkGovernance();
				var ChannelSearchresults = ChannelSearchresultSet.getResults(0,1);
				nlapiLogExecution('debug', 'ChannelSearchresults.length', ChannelSearchresults.length);
				if (ChannelSearchresults.length > 0)
				{
					var Channelid = ChannelSearchresults[0].getId();
				}
				else 
				{
					var Channelid = 5;
				}
				nlapiLogExecution('debug', 'Locationid', Locationid);
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
				nlapiLogExecution('debug', 'Channelid', Channelid);
				
				var SC = SalesList[i]['SC'];
				
				var search = nlapiLoadSearch('customer', 'customsearch_frompos_iv');
				checkGovernance();
				var searchfilter = search.getFilters();
				searchfilter[0] = new nlobjSearchFilter('custentityposid', null, 'is', SC);
				search.setFilters(searchfilter);
				var resultSet = search.runSearch();
				checkGovernance();
				var searchresults = resultSet.getResults(0,1);
				nlapiLogExecution('debug', 'customersearchresults.length', searchresults.length);
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
				var NetAmt = SalesList[i]['NA'];
				var Cancelled = SalesList[i]['CF'];
				var HasDO = SalesList[i]['HasDO'];
				var JTxnDetail = SalesList[i]['Detail']; 
				var JTxnPayment = SalesList[i]['Payment'];
				
				
				nlapiLogExecution("debug","customerid",customerid);
				nlapiLogExecution("debug","HasDO",HasDO);
				nlapiLogExecution("debug","Cancelled",Cancelled);
				nlapiLogExecution("debug","NetAmount",NetAmount);
				var CM_index = 0;
				var CMid = [0];
				var invoiceAMT = 0;
				if(JTxnDetail)
				{
					if(JTxnPayment || (NetAmount == 0 && !JTxnPayment))
					{
						if (!HasDO)
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
								nlapiLogExecution('debug', 'TxSearchresults.length', TxSearchresults.length);
								if (TxSearchresults.length == 0)
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
											nlapiLogExecution('debug', 'lineRate', lineRate);
											nlapiLogExecution('debug', 'lineCancelled', lineCancelled);
											nlapiLogExecution('debug', 'lineQTY', lineQTY);
											
											if (lineCancelled == false)
											{									
												if (lineQTY > 0)
												{	
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
														rec.setCurrentLineItemValue('item','description','item is not matching');
													}
													
													nlapiLogExecution('debug', 'itemid', itemid);
													rec.setCurrentLineItemValue('item','item',itemid);
                                                    rec.setCurrentLineItemValue('item', 'price', -1)
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
															rec.setCurrentLineItemValue('item','description','item has no stock. ' + lineProductCode);
														}
													}
													
													rec.commitLineItem('item');
													invoiceAMT = invoiceAMT + (lineRate * lineQTY);
													nlapiLogExecution('debug', 'invoiceAMT @ Line ' + j , invoiceAMT);
												}
												else
												{
													
													var recCM = nlapiCreateRecord('creditmemo');
													nlapiLogExecution('debug', 'creditmemo', 'created');
													checkGovernance();
													recCM.setFieldValue('entity',customerid);
													recCM.setFieldValue('subsidiary',10);
													recCM.setFieldValue('location',Locationid);
													recCM.setFieldValue('cseg1',Channelid);
													recCM.setFieldValue('trandate',TxnDate);
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
													
													lineQTY = lineQTY * -1;
													
													recCM.setCurrentLineItemValue('item','item',itemid);
													recCM.setCurrentLineItemValue('item','quantity',lineQTY);
													recCM.setCurrentLineItemValue('item','rate',lineRate);
													
													if (islotitem == 'T')
													{
														//
														var filters = new Array();
														filters[0] = new nlobjSearchFilter( 'item', null, 'anyOf', itemid);
														filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'GREATERTHANOREQUALTO', lineQTY);
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
															
														}
													}
													
													recCM.commitLineItem('item');
													
													CMid[CM_index] = nlapiSubmitRecord(recCM);
													nlapiLogExecution('debug', 'Credit Memo Created', CMid[CM_index]);
													CM_index = CM_index + 1;
													nlapiLogExecution('debug', 'CM_index', CM_index);
													nlapiLogExecution('debug', 'CMid[' + CM_index - 1 + ']', CMid[CM_index-1]);
													// (CM_index > 0 && CMid[0] != 0)
												}	
											}
										}
									}
									var JTxnPayment = SalesList[i]['Payment'];
									nlapiLogExecution('debug', 'JTxnPayment', JTxnPayment);
									// if(JTxnPayment)
									{
										try{
											var TXid = nlapiSubmitRecord(rec);
											}
											catch (err)
											{
												nlapiLogExecution('error', 'Invoice create error', SalesNum);
											}
										checkGovernance();
										nlapiLogExecution('debug', 'Invoice Created', TXid);
									}
									//Payment
									
									nlapiLogExecution('debug', 'Total invoiceAMT', invoiceAMT);
									if(JTxnPayment)
									{
										if (invoiceAMT > 0)
										{
											var JTxnPayment = SalesList[i]['Payment'];
											nlapiLogExecution('debug', 'JTxnPayment', JTxnPayment);
											if(JTxnPayment)
											{
												nlapiLogExecution('debug', 'JTxnPayment.length', JTxnPayment.length);
												for(var k = 0; k < JTxnPayment.length; k++)
												{
													nlapiLogExecution('debug', 'k', k);
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
													
													nlapiLogExecution('debug', 'CM_index',CM_index);
													var recPay = nlapiTransformRecord('invoice',TXid,'customerpayment');
													nlapiLogExecution('debug', 'recPay Transformed');
													recPay.setFieldValue('location',Locationid);
													
													if (CM_index > 0)
													{
														
														var InvCrLineCount = recPay.getLineItemCount('credit');
														nlapiLogExecution('debug', 'InvCrLineCount',InvCrLineCount);
														for(var o = 1; o <= InvCrLineCount; o++)
														{
															for(var n = 0; n < CM_index; n++)
															{
																nlapiLogExecution('debug', 'o', o);
																var applied = recPay.getLineItemValue('credit','apply',o);
																var doc = recPay.getLineItemValue('credit','doc',o);
																nlapiLogExecution('debug', 'doc = ' + doc, 'CMid[n] = ' + CMid[n]);
																
																nlapiLogExecution('debug', 'due = ' + recPay.getLineItemValue('credit','due',o), 'amount = ' + recPay.getLineItemValue('credit','amount',o));
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
													
													var InvLineCount = recPay.getLineItemCount('apply');
													nlapiLogExecution('debug', 'InvLineCount',InvLineCount);
													for(var l = 1; l <= InvLineCount; l++)
													{
														
														var applied = recPay.getLineItemValue('apply','apply',l);
														nlapiLogExecution('debug', 'applied',applied);
														if (applied == 'T')
														{
															recPay.setLineItemValue('apply','apply',l, 'T');
															
															if (JTxnPayment.length > 1)
															{
																recPay.setLineItemValue('apply','amount',l,PLineAmt);
															}
															nlapiLogExecution('debug', 'applied amount',recPay.getLineItemValue('apply','amount',l));
															nlapiLogExecution('debug', 'l',l);
														}
													}
													
													nlapiLogExecution('debug', 'PLineAmt',PLineAmt);
													
													
													
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
													
													
													var PayID = nlapiSubmitRecord(recPay);
													checkGovernance();
													nlapiLogExecution('debug', 'PayID1',PayID);
													nlapiSubmitField('invoice',TXid,'custbodypospaymentmethod',NSpaymentMeth);
													checkGovernance();
												}
											}
											else if (CM_index > 0 && CMid[0] != 0)
											{
												var recPay = nlapiTransformRecord('invoice',TXid,'customerpayment');
												nlapiLogExecution('debug', 'recPay Transformed');
												// recPay.setFieldValue('memo',PLineMethod);
												var InvLineCount = recPay.getLineItemCount('apply');
												nlapiLogExecution('debug', 'InvLineCount',InvLineCount);
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
														nlapiLogExecution('debug', 'InvCrLineCount',InvCrLineCount);
														for(var o = 1; o <= InvCrLineCount; o++)
														{
															nlapiLogExecution('debug', 'o', o);
															var applied = recPay.getLineItemValue('credit','apply',o);
															var doc = recPay.getLineItemValue('credit','doc',o);
															nlapiLogExecution('debug', 'doc', doc);
															nlapiLogExecution('debug', 'CMid[n]' + n, CMid[n]);
															if (doc == CMid[n])
															{
																recPay.setLineItemValue('credit','apply',o, 'T');
															}
														}
													}
												}
												recPay.setFieldValue('location',Locationid);
												recPay.setFieldValue('trandate',TxnDate);
												var PayID = nlapiSubmitRecord(recPay);
												checkGovernance();
												nlapiLogExecution('debug', 'PayID2',PayID);
												nlapiSubmitField('invoice',TXid,'custbodypospaymentmethod',NSpaymentMeth);
												checkGovernance();
											}
										}
										else
										{
											var JTxnPayment = SalesList[i]['Payment'];
											nlapiLogExecution('debug', 'JTxnPayment', JTxnPayment);
											if(JTxnPayment)
											{
												nlapiLogExecution('debug', 'JTxnPayment.length', JTxnPayment.length);
												for(var k = 0; k < JTxnPayment.length; k++)
												{
													nlapiLogExecution('debug', 'k', k);
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
													nlapiSubmitField('invoice',TXid,'custbodypospaymentmethod',NSpaymentMeth);
													checkGovernance();
												}
											}
										}
									}
								}
								/*
								else
								{
									var TXid = TxSearchresults[0].getId();	
									nlapiLogExecution('debug', 'TXid', TXid);
									checkGovernance();
									// nlapiLogExecution('debug', 'isperson', recCus.getFieldValue('isperson'));
									var rec = nlapiLoadRecord('invoice', TXid);
								}
								*/
							}
							else //Cancel = true
							{
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
															rec.setCurrentLineItemValue('item','description','item has no stock. ' + lineProductCode);
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
														recPay.setFieldValue('memo',NSpaymentMeth);
														recPay.setFieldValue('paymentmethod',NSpaymentMeth);
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
														recPay.setFieldValue('location',Locationid);
														recPay.setFieldValue('trandate',TxnDate);
														var PayID = nlapiSubmitRecord(recPay);
														checkGovernance();
														nlapiLogExecution('debug', 'PayID',PayID);
													}
												}
											}
										}
									}
									// if (numOfLine >0)
									{
										//check credit exist
										var filters = new Array();
										// filters[2] = new nlobjSearchFilter('type', null, 'anyOf', 'creditmemo');
										filters[1] = new nlobjSearchFilter('custbodypossalesid', null, 'is', SalesNum);
										filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
										var columns = new Array();
										columns[0] = new nlobjSearchColumn('internalid');
										columns[0].setSort(); 
										// var InvoiceSearch = nlapiCreateSearch('transaction', filters, columns);
										var CMSearch = nlapiCreateSearch('creditmemo', filters, columns);
										checkGovernance();
										var Error_Count = 0;
										var CMSearchresultSet = CMSearch.runSearch();
										checkGovernance();
										var CMSearchresults = CMSearchresultSet.getResults(0,1);
										nlapiLogExecution('debug', 'CMSearchresults.length', CMSearchresults.length);
										var CMID = '';
										for ( var n = 0; CMSearchresults.length > 0 && CMSearchresults && n == 0 ; n++ )
										{
											nlapiLogExecution('debug', 'n', n);
											CMID = CMSearchresults[n].getId();
											// var ResultColumns = CMSearchresults[n].getAllColumns();
											// LotNum = CMSearchresults[n].getValue(ResultColumns[0]);
											nlapiLogExecution('debug', 'CMID', CMID);
										}
										
										if (CMID == '')
										{
											var recCredit = nlapiTransformRecord('invoice',invID, 'creditmemo');
											var CreditID = nlapiSubmitRecord(recCredit);
											nlapiLogExecution('debug', 'CreditID', CreditID);
											
											var recRefund = nlapiCreateRecord('customerrefund',{recordmode:'dynamic'} );
											recRefund.setFieldValue('customer',recCredit.getFieldValue('entity'));
											nlapiLogExecution('debug', 'customer', recCredit.getFieldValue('entity'));
											recRefund.setFieldValue('paymentmethod',NSpaymentMeth);
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
							}
						}
						else
						{
							var rec = nlapiCreateRecord('salesorder');
							checkGovernance();
							nlapiLogExecution('debug', 'Create SO');
						}
					}
				}
			}
		}
	}
	var DateEnd = GetDateKeyDateEnd(now);
	nlapiSubmitField('customrecordintegrationlib',2,'custrecordintegrationlibdate',now);
	nlapiSubmitField('customrecordintegrationlib',5,'custrecordintegrationlibdate',DateEnd);
	checkGovernance();
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
	// var LoginBody1 = LoginResponse.getBody();
	// nlapiLogExecution("debug","LoginBody1",LoginBody1);
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

function GetDateKeyErun(datestring)
{
	/*
	// var today = new Date();
	// nlapiLogExecution('debug', 'today', today);
	var to0 = datestring.getTimezoneOffset();
	// nlapiLogExecution('debug', 'to0', to0);
	var utc = datestring.getTime() + (datestring.getTimezoneOffset() * 60000);
	// nlapiLogExecution('debug', 'utc', utc);
	var hkTime = utc + (3600000 * 8);
	*/
	var intdatestring = parseInt(datestring) + 1;
	var newToday = new Date(intdatestring);
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
function GetDateKeyDateEnd(datestring)
{
	var yyyy = datestring.substring(0,4);
	var mm = datestring.substring(5,7);
	var dd = datestring.substring(8,10);
	
	var fulldate = yyyy + "/" + mm + "/" + dd + " " + '23' + ":" + '59' + ":" + '59';

	nlapiLogExecution('debug', 'fulldate', fulldate);
	
	return fulldate;
}