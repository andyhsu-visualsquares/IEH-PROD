function IF_fulfillcode(ifid) {
	var soid = nlapiLookupField('itemfulfillment', ifid, 'createdfrom');
	checkGovernance();
	if (soid) {
		var attachments = new Array();
		var attachmentsID = new Array();
		// var fileindex = 0;

		nlapiLogExecution('audit', 'Fulfill Redeem Code Started');
		var ifrec = nlapiLoadRecord('itemfulfillment', ifid);
		checkGovernance();
		var ifNum = ifrec.getFieldValue('tranid');
		var channel = ifrec.getFieldValue('cseg1');
		var subsid = ifrec.getFieldText('subsidiary');
		var soId = ifrec.getFieldValue('createdfrom');
		var subsid_ID = ifrec.getFieldValue('subsidiary');

		checkGovernance();
		var recFolder = nlapiCreateRecord('folder');
		checkGovernance();
		recFolder.setFieldValue('parent', 18148);
		//recFolder.setFieldValue('name','aaaa3');
		recFolder.setFieldValue('name', ifNum);
		var FolderID = 18148;
		// if (ifrec.getFieldValue('custbodyrvsavetofile') == 'T')
		{
			checkGovernance();
			try {
				var FolderID = nlapiSubmitRecord(recFolder);
				checkGovernance();
			}
			catch (err) {
				recFolder.setFieldValue('name', ifNum + '_2');
				var FolderID = nlapiSubmitRecord(recFolder);
				checkGovernance();
			}
		}
		var foremail = 'F';
		var cnCustomerName = ''

		//Handling for China Individuals
		if (ifrec.getFieldValue('custbodyemailtonamevoucher') === "China Individual" || ifrec.getFieldValue('custbodyemailtonamevoucher') === "Addressess") {
			var filters = new Array();
			var searchEmail = ifrec.getFieldValue('custbodyemailaddressvoucher');
			filters[0] = new nlobjSearchFilter('email', null, 'is', searchEmail);

			var columns = new Array();
			columns[0] = new nlobjSearchColumn('entityid')
			var cnCustomerSearch = nlapiCreateSearch('customer', filters, columns);
			var cnCustomerNSDataResultSet = cnCustomerSearch.runSearch();
			var cnCustomerNSData = cnCustomerNSDataResultSet.getResults(0, 999);

			//Search on CN DB
			// nlapiLogExecution('DEBUG', 'cnCustomerNSData', cnCustomerNSData.getResults(0, 999));
			var cnCustomerID = cnCustomerNSData[0].getValue("entityid")
			var url = "https://iehcnapiapp.chinacloudsites.cn/api" + "/customer/target-customer-data?CUSTOMER_ID=" + cnCustomerID + "&PHONE=''&EMAIL=''&CURRENT_ENV='PROD'"
			var headers = {
				'Content-Type': 'application/json',
			}

			nlapiLogExecution('DEBUG', 'CNDBURL', url)
			// Make the GET request
			try {
				var response = nlapiRequestURL(url, null, headers, "GET");
				nlapiLogExecution('DEBUG', 'response', response.body);

				var parsedData = JSON.parse(response.body);
				var cnCustomerData = parsedData.result[0];
				cnCustomerName = cnCustomerData.FIRST_NAME + cnCustomerData.LAST_NAME;
			} catch (e) {
				nlapiLogExecution('DEBUG', 'Error When Loading Name From CN DB', "Default Value Set : Customer");

				cnCustomerName = "Customer"
			}
		}

		var redeemRemark = '';
		// Sumup related Item on Same Fulfilment
		var redeemItemSumup = new Array();
		for (var i = 1; i <= ifrec.getLineItemCount('item'); i++) {
			var redeemItemID = ifrec.getLineItemValue('item', 'item', i)
			var redeemcount = ifrec.getLineItemValue('item', 'quantity', i);
			// var existingItem = redeemItemSumup.find(targetItem => targetItem.redeemItemID === redeemItemID)
			var existingItem;
			for (var targetIndex = 0; targetIndex < redeemItemSumup.length; targetIndex++) {
				var targetItem = redeemItemSumup[targetIndex];
				if (targetItem.redeemItemID === redeemItemID) {
					existingItem = targetItem;
					break;
				}
			}
			if (!existingItem) {
				var redeemItem = nlapiLookupField('item', ifrec.getLineItemValue('item', 'item', i), 'custitemredeemingitem');
				var price = ifrec.getLineItemValue('item', 'rate', i);
				var redeemValue = nlapiLookupField('item', ifrec.getLineItemValue('item', 'item', i), 'custitemredeemingvalue');
				var voucherforemail = nlapiLookupField('item', ifrec.getLineItemValue('item', 'item', i), 'custitemvoucherforemail');
				var itemName = ifrec.getLineItemValue('item', 'description', i);
				var targetRedeemItemSummary = {
					redeemItemID: redeemItemID,
					redeemItem: redeemItem,
					price: price,
					redeemValue: redeemValue,
					voucherforemail: voucherforemail,
					redeemcount: redeemcount,
					itemName: itemName,
					itemIdentifier: redeemItemSumup.length
				}
				redeemItemSumup.push(targetRedeemItemSummary)
			} else {
				redeemItemSumup[existingItem.itemIdentifier].redeemcount += redeemcount
			}
		}

		nlapiLogExecution('debug', 'redeemItemSumupCheck', redeemItemSumup.length + " | " + redeemItemSumup[0]);
		for (var i = 0; i < redeemItemSumup.length; i++) {
			var price = redeemItemSumup[i].price;
			var redeemItem = redeemItemSumup[i].redeemItem;
			var redeemValue = redeemItemSumup[i].redeemValue;
			var voucherforemail = redeemItemSumup[i].voucherforemail;
			if (voucherforemail == 'T') {
				foremail = 'T';
			}
			nlapiLogExecution('debug', 'redeemItem', redeemItem);
			nlapiLogExecution('debug', 'redeemValue', redeemValue);
			if (redeemItemSumup[i].redeemItemID != 1885) {
				if ((redeemItem || redeemValue) && (redeemItemSumup[i].redeemItemID != '1885' || ifrec.getFieldValue('entity') == 1537)) {
					var redeemcount = redeemItemSumup[i].redeemcount;
					// var itemName = ifrec.getLineItemText('item', 'item',i);
					var itemName = redeemItemSumup[i].itemName;

					var flagcount = 0;
					do {
						/*
						var filters = new Array();
						filters[0] = new nlobjSearchFilter('custrecordrcmastersalestransaction', null, 'anyof', soid);
						filters[1] = new nlobjSearchFilter('custrecord_fulfillment', null, 'is', '@NONE@');
						filters[2] = new nlobjSearchFilter('custrecordrcmastervoucheritem', null, 'anyof', ifrec.getLineItemValue('item','item', i));
						var columns = new Array();
						columns[0] = new nlobjSearchColumn('internalid').setSort();
						columns[1] = new nlobjSearchColumn('name');
						columns[2] = new nlobjSearchColumn('custrecordrcmastergennum');
						columns[3] = new nlobjSearchColumn('custrecordrcmasterrc');
						var search = nlapiCreateSearch('customrecordrcmaster', filters, columns);
						checkGovernance();
						*/
						var filters = new Array();
						filters[0] = new nlobjSearchFilter('custrecordrcmastervoucheritem', null, 'anyof', redeemItemSumup[i].redeemItemID);//custrecordrcmastervoucheritem
						// filters[1] = new nlobjSearchFilter('custrecordrcmastersalestransaction', null, 'is', '@NONE@');
						// filters[2] = new nlobjSearchFilter('custrecordrcmastersentorsold', null, 'is', 'F');
						// filters[3] = new nlobjSearchFilter('custrecordrcmasterused', null, 'is', 'F');
						// filters[4] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
						filters[1] = new nlobjSearchFilter('custrecordrcmastersalestransaction', null, 'anyof', soId)
						filters[2] = new nlobjSearchFilter('custrecord_fulfillment', null, 'is', '@NONE@')
						//   custrecordredeemcodenoteffective
						//filters[5] = new nlobjSearchFilter('custrecordredeemcodenoteffective', null, 'is', 'F');
						// if (channel)
						// 	filters[1] = new nlobjSearchFilter('custrecordrcmasterchannel', null, 'anyof', channel);
						var columns = new Array();
						columns[0] = new nlobjSearchColumn('internalid').setSort();
						columns[1] = new nlobjSearchColumn('name');
						columns[2] = new nlobjSearchColumn('custrecordrcmastergennum');
						columns[3] = new nlobjSearchColumn('custrecordrcmasterrc');
						var search = nlapiCreateSearch('customrecordrcmaster', filters, columns);
						checkGovernance();
						var resultSet = search.runSearch();
						nlapiLogExecution('Audit', 'search run');

						{
							// var indexID = 0;
							// var result = resultSet.getResults(indexID,indexID+999);
							// var result = resultSet.getResults(0,1);
							var result = resultSet.getResults(0, 999);
							if (result[0]) {
								// for(var k=0; result && k<result.length && flagcount<redeemcount; k++)
								// var k = Math.floor(Math.random() * result.length);
								// nlapiLogExecution('debug', 'STOCK LEFT', k);
								result.reverse()
								for (var k = 0; k < result.length; k++) {
									nlapiLogExecution('audit', 'search length', result.length);
									var fields = new Array();
									fields[0] = 'custrecordrcmasterreceivername';
									fields[1] = 'custrecordrcmasterreceiveremail';
									fields[2] = 'custrecord_fulfillment';
									// fields[3] = 'custrecordrcmastersentorsold';
									fields[4] = 'custrecordrcmaster';
									// fields[5] = 'custrecordrcmastersalestransaction';
									var values = new Array();
									values[0] = ifrec.getFieldValue('custbodyemailtonamevoucher');
									values[1] = ifrec.getFieldValue('custbodyemailaddressvoucher');
									values[2] = ifid;
									// values[3] = 'T';
									values[4] = price;
									// values[5] = ifid;
									nlapiSubmitField('customrecordrcmaster', result[k].getId(), fields, values);
									nlapiLogExecution('audit', 'submitted', result[k].getId());
									checkGovernance();
									if (voucherforemail == 'T') {
										attachments[k] = RC_file(result[k].getValue(columns[1]), k, result[k].getValue(columns[2]), ifrec.getFieldValue('custbodyrvsavetofile'), ifNum, FolderID, result[k].getValue(columns[3]), subsid, itemName);
										checkGovernance();
										nlapiLogExecution('audit', 'attachments[k]', attachments[k]);
									}

									// if (ifrec.getFieldValue('custbodyrvsavetofile') == 'T')
									{
										var fileid = nlapiSubmitFile(attachments[k]);
										attachmentsID.push(fileid);
										checkGovernance();
										nlapiLogExecution('audit', 'fileid', fileid);
										attachments[k] = '';
									}
									// fileindex++;

									// indexID++;
									flagcount++;



								}
								if (flagcount >= redeemcount)
									break;
							}
							else {
								nlapiLogExecution('debug', 'no search result');
								redeemRemark += 'Line ' + i + ' can only assign ' + flagcount + ' voucher(s) out of ' + redeemcount + ' voucher(s). Please check and review.\n'
								break;
							}
							// }while(result.length>=999 && redeemcount>flagcount);
						}
					} while (redeemcount > flagcount && flagcount > 0);
				}
			}
		}
		nlapiLogExecution('audit', 'Fulfill Redeem Code Finished');
		var recipient = ifrec.getFieldValue('custbodyemailaddressvoucher');
		//	var recipient = 'kathy@fern.com.hk';
		//custbody_website_so
		var websiteSO = nlapiLookupField('transaction', ifrec.getFieldValue('createdfrom'), 'custbody_website_so');
		checkGovernance();
		var SOtranid = nlapiLookupField('transaction', ifrec.getFieldValue('createdfrom'), 'tranid');
		checkGovernance();
		var subjectTranID = ifNum;
		if (websiteSO) {
			subjectTranID = websiteSO;
		}
		else if (SOtranid) {
			subjectTranID = SOtranid;
		}

		var emailSubject = ifrec.getFieldValue('custbodyvoucheremailsubject');
		if (emailSubject != null && emailSubject != 'null' && emailSubject != '') {
			var subject = emailSubject + ' - ' + subjectTranID;
		}
		else {
			var subject = '皇玥餅藝 - 月餅換領電子禮券 - ' + subjectTranID;
		}
		var records = new Object();
		records['transaction'] = ifid;
		// var body = '親愛的 Dear ' + nlapiEscapeXML(ifrec.getFieldValue('custbodyemailtonamevoucher') === "China Individual" ? cnCustomerName : ifrec.getFieldValue('custbodyemailtonamevoucher')) + '：<br/><br/>';
		var body = 'Dear ' + (cnCustomerName !== "" ? cnCustomerName : ifrec.getFieldValue('custbodyemailtonamevoucher')) + '：<br/><br/>';
		checkGovernance();
		var emailContent = ifrec.getFieldValue('custbodycoucheremailcontent');

		if (emailContent != null && emailContent != 'null' && emailContent != '') {
			body += emailContent;
		}
		else {
			body += '<b>皇玥餅藝旗艦店 開張誌慶</b><br/><br/>皇玥餅藝，扎根香港，致力傳承中式餅藝文化。上選優質天然食材，堅持用心製作，希望讓大家吃得開心和放心。<br/><br/>全新旗艦店將於今年3月29日開業，全線餅藝產品屆時將正式發售。<br/><br/>感謝您一如既往的支持，現憑電子換領券可於店內免費換領 經典蛋卷 或 休閒蛋卷 或 奇趣蛋卷精裝禮盒一盒 (價值$118)<br/><br/><u>皇玥餅藝旗艦店地址：</u><br/>香港九龍尖沙咀加連威老道43號地鋪 (港鐵尖沙咀B2出口)<br/><br/>';
		}
		// body += '<b>皇玥餅藝旗艦店 開張誌慶</b><br/><br/>皇玥餅藝，扎根香港，致力傳承中式餅藝文化。上選優質天然食材，堅持用心製作，希望讓大家吃得開心和放心。<br/><br/>全新旗艦店將於今年3月29日開業，全線餅藝產品屆時將正式發售。<br/><br/>感謝您一如既往的支持，現憑電子換領券可於店內免費換領 經典蛋卷 或 休閒蛋卷 或 奇趣蛋卷精裝禮盒一盒 (價值$118)<br/><br/><u>皇玥餅藝旗艦店地址：</u><br/>香港九龍尖沙咀加連威老道43號地鋪 (港鐵尖沙咀B2出口)<br/><br/>';

		body += '<b>皇玥 IMPERIAL PATISSERIE</b><br/>查詢電話 Enquiry Hotline ：(852)2217 3638<br/>網址 Website ：<a href="https://www.iPastry.com.hk">www.iPastry.com.hk</a><br/><a href="https://www.iPastry.com.hk"><img src="https://5112262.app.netsuite.com/core/media/media.nl?id=18880&c=5112262&h=arYEa2UWG-4dYJeq24UveukVfNU0J5Vj1rZK-6AQoPiNIbg7"></a><br/><a href="https://www.facebook.com/iPastry.HK/"><img src="https://5112262.app.netsuite.com/core/media/media.nl?id=18879&c=5112262&h=P5yWx3IZiK6oL0_C6C1pbuKP_oxsLPfFPXPaG1CYupFBgWLo"></a><a href="https://instagram.com/ipastry.hk"><img src="https://5112262.app.netsuite.com/core/media/media.nl?id=18878&c=5112262&h=oCG_XrkPLhaZBzkfzdoWbzdIUWFzV7sfjkN5w_x5b8rjMcuC"></a><a href="https://www.youtube.com/channel/UC09G0vV7JFv3P5QA9GL6nSQ"><img src="https://5112262.app.netsuite.com/core/media/media.nl?id=18877&c=5112262&h=7VR05sEjfguY19rVLC4L8GmMD7OK82z4j6vMaevmahTdAZYR"></a>';
		// body += '<b>皇玥</b><br/>查詢電話：(852)2217 3638<br/>網址：<a href="www.iPastry.com.hk">www.iPastry.com.hk</a><br/><a href="www.iPastry.com.hk"><img src="http://shopping.netsuite.com/core/media/media.nl?id=21784&amp;c=5112262_SB1&amp;h=5a5d87b8abbcb61ac57e"></a><br/><a href="https://www.facebook.com/iPastry.HK/"><img src="http://shopping.netsuite.com/core/media/media.nl?id=21785&amp;c=5112262_SB1&amp;h=3805239659573dc21d04"></a><a href="https://instagram.com/ipastry.hk"><img src="http://shopping.netsuite.com/core/media/media.nl?id=21786&amp;c=5112262_SB1&amp;h=e39174f17cd32a818d04"></a>';

		var fieldsname = new Array();
		var valuesArray = new Array();

		fieldsname[0] = 'custbody_assign_redeem_code';
		valuesArray[0] = 5;
		fieldsname[1] = 'custbodyredeemvoucherrecorded';
		valuesArray[1] = 'T';
		fieldsname[2] = 'custbodyredremark';
		valuesArray[2] = redeemRemark;

		//20231208 Introv Chris: Add back Fern Updates, sender issue (EXCLUDING in SB)
		var senderID = 1044244;
		if (subsid_ID == 11) // IFL
		{
			senderID = 1118827;
		}
		if (subsid_ID == 10) {
			senderID = 1118828;
		}


		if (ifrec.getFieldValue('custbodyrvsavetofile') != 'T') {
			if (ifrec.getFieldValue('custbodyforemailredeemvoucher') == 'T' && foremail == 'T') {
				if (attachmentsID.length < 15)
				//nlapiSendEmail(1539, recipient, subject,body,null, 'cs@ipastry.com.hk',records, attachments);
				{
					var attach = new Array();
					for (var attC = 0; attC < attachmentsID.length; attC++) {
						attach[attC] = nlapiLoadFile(attachmentsID[attC]);
					}
					nlapiSendEmail(senderID, recipient, subject, body, null, 'dn@ieh.com.hk', records, attach);
					checkGovernance();
				}
				else {
					var jjcount = Math.ceil(attachmentsID.length / 15);
					for (var jj = 1; jj <= jjcount; jj++) {
						var jj1 = jj - 1;
						if (jj < jjcount)
							var newatt = attachmentsID.slice(jj1 * 15, jj * 15);

						else
							var newatt = attachmentsID.slice(jj1 * 15, attachmentsID.length);
						//nlapiSendEmail(1539, recipient, subject,body,null, 'cs@ipastry.com.hk',records, newatt);

						var attach = new Array();
						for (var attC = 0; attC < newatt.length; attC++) {
							attach[attC] = nlapiLoadFile(newatt[attC]);
						}
						emailSeq = (parseFloat(jj1) + 1);
						var subject2 = subject + ' - ' + emailSeq;
						nlapiSendEmail(senderID, recipient, subject2, body, null, 'dn@ieh.com.hk', records, attach);
						checkGovernance();

					}
				}
				//		ifrec.setFieldValue('custbodyredeemvoucheremailsent','T');
				fieldsname[3] = 'custbodyredeemvoucheremailsent';
				valuesArray[3] = 'T';
				nlapiSubmitField('itemfulfillment', ifid, fieldsname, valuesArray);
				checkGovernance();

			}
			else {
				nlapiSubmitField('itemfulfillment', ifid, fieldsname, valuesArray);
				checkGovernance();
			}
		}
		else {
			nlapiSubmitField('itemfulfillment', ifid, fieldsname, valuesArray);
			checkGovernance();
		}

		//nlapiSendEmail(3, recipient, subject,body,null, null,null, attachments);
		nlapiLogExecution('debug', 'ifid', ifid);

		//	ifrec.setFieldValue('custbody_assign_redeem_code',5);

		//	  ifrec.setFieldValue('custbodyredeemvoucherrecorded','T');
		//	var id = nlapiSubmitRecord(ifrec);

		//	nlapiSubmitField('itemfulfillment', ifid, 'custbody_assign_redeem_code', 5);
		//	nlapiLogExecution('debug', 'id', id);
		//nlapiSubmitField('itemfulfillment', ifid, 'custbody_assign_redeem_code',5);
	}
}

function checkGovernance() {
	var myGovernanceThreshold = 300
	var context = nlapiGetContext()
	nlapiLogExecution('debug', 'remainingUsage', context.getRemainingUsage())
	if (context.getRemainingUsage() < myGovernanceThreshold) {
		var state = nlapiYieldScript()
		if (state.status == 'FAILURE') {
			nlapiLogExecution(
				'ERROR',
				'Failed to yield script, exiting: Reason = ' + state.reason + ' / Size = ' + state.size
			)
			throw 'Failed to yield script'
		} else if (state.status == 'RESUME') {
			nlapiLogExecution('AUDIT', 'Resuming script because of ' + state.reason + '.  Size = ' + state.size)
		}
		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
	}
}

function RC_file(name, index, generator, save, ifNum, FolderID, codeText, subsid, itemName) {
	index++
	// var filename = index+'-Imperial Patisserie Gift Voucher.pdf';
	var filename = itemName + '_' + index + '_' + ifNum
	var code = name
	// filename = subsid + '-' + ifNum + '-' + filename;

	// if (save == 'T')
	// {
	// filename = filename + '-' + name;
	// }
	filename = filename + '.pdf'
	var xml = '<?xml version="1.0"?>\n<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">\n'
	xml += '<pdf>'

	//Start body
	//	xml += '<body width="507px" height="900px" font-size="8.5">';

	//	xml += '<body width="505px"  height="1200px" font-size="8.5" style="padding:0;">';
	xml += '<body width="505px" height="900px" style="padding:0 0 0 0">'
	/*
			xml += '<table align="center" style="width:506px; height:899px;border-collapse:collapse;" cellpadding="0" cellspacing="0" border="0">';
			xml += '<tr>';
			xml += '<td colspan="3"><img src="http://shopping.netsuite.com/core/media/media.nl?id=24607&amp;c=5112262_SB1&amp;h=5ee2171a430967fd3211" style="float: center;height:630px; width:506px" /> </td>';
			xml += '</tr>';
			xml += '<tr>';
			xml += '<td rowspan="2"><img src="http://shopping.netsuite.com/core/media/media.nl?id=24608&amp;c=5112262_SB1&amp;h=c1f009683d1d8cf216df" style="float: center;height:269px; width:294px" /> </td>';
			xml += '<td><barcode codetype="qrcode" width="180px" height="180px" showtext="true" value="';
			xml += code;
			xml += '"/>'
			xml += '</td>';
			xml += '<td><img src="http://shopping.netsuite.com/core/media/media.nl?id=24610&amp;c=5112262_SB1&amp;h=6d202f218e3d1e18d685" style="float: center;height:182px; width:32px" /> </td>';
			xml += '</tr>';
			xml += '<tr>';
			xml += '<td colspan="2"><img src="http://shopping.netsuite.com/core/media/media.nl?id=24609&amp;c=5112262_SB1&amp;h=22c26090856f57a9572f" style="float: center;height:87px; width:212px" /> </td>';
			xml += '</tr>';
			xml += '</table>';
	*/
	var topImage = nlapiLookupField('customrecordrcgenerator', generator, 'custrecordrcgeneratortopimage')
	var leftImage = nlapiLookupField('customrecordrcgenerator', generator, 'custrecordrcgeneratorleftimage')
	var rightImage = nlapiLookupField('customrecordrcgenerator', generator, 'custrecordrcgeneratorrightimage')
	var bottomImage = nlapiLookupField('customrecordrcgenerator', generator, 'custrecordrcgeneratorbottomimage')

	if (topImage) {
		var topImageURL = nlapiEscapeXML(nlapiLoadFile(topImage).getURL())
	} else {
		var topImageURL =
			'http://shopping.na2.netsuite.com/core/media/media.nl?id=178&amp;c=5112262&amp;h=d4413d90916411315d7d'
	}
	nlapiLogExecution('debug', 'topImageURL', topImageURL)
	if (leftImage) {
		var leftImageURL = nlapiEscapeXML(nlapiLoadFile(leftImage).getURL())
	} else {
		var leftImageURL =
			'http://shopping.na2.netsuite.com/core/media/media.nl?id=179&amp;c=5112262&amp;h=ff5366b851a0164bd2a3'
	}
	nlapiLogExecution('debug', 'leftImageURL', leftImageURL)
	if (rightImage) {
		var rightImageURL = nlapiEscapeXML(nlapiLoadFile(rightImage).getURL())
	} else {
		var rightImageURL =
			'http://shopping.na2.netsuite.com/core/media/media.nl?id=181&amp;c=5112262&amp;h=1f78924146521272eaa8'
	}
	nlapiLogExecution('debug', 'rightImageURL', rightImageURL)
	if (bottomImage) {
		var bottomImageURL = nlapiEscapeXML(nlapiLoadFile(bottomImage).getURL())
	} else {
		var bottomImageURL =
			'http://shopping.na2.netsuite.com/core/media/media.nl?id=180&amp;c=5112262&amp;h=e065da7e9529d294771e'
	}
	nlapiLogExecution('debug', 'bottomImageURL', bottomImageURL)
	xml +=
		'<table align="center" vertical-align="top" style="width:506px; height:100%;border-collapse:collapse;" cellpadding="0" cellspacing="0" border="0" cellmargin="0">'
	xml += '<tr>'
	xml += '<td colspan="3"><img src="' + topImageURL + '" style="float: center;height:630px; width:506px" /> </td>'
	xml += '</tr>'
	xml += '<tr>'
	xml += '<td rowspan="2"><img src="' + leftImageURL + '" style="float: center;height:269px; width:294px" /> </td>'
	xml += '<td>'

	xml += '<table align="center" width="180px" height="180px">'
	xml += '<tr>'
	xml += '<td align="center" width="180px">'
	xml += '<barcode codetype="qrcode" width="150px" height="150px" showtext="true" value="'
	xml += code
	xml += '"/>'
	xml += '</td>'
	xml += '</tr>'
	xml += '<tr>'
	xml += '<td align="center">'
	xml += codeText
	xml += '</td>'
	xml += '</tr>'
	xml += '</table>'

	xml += '</td>'
	xml += '<td><img src="' + rightImageURL + '" style="float: center;height:182px; width:32px" /> </td>'
	xml += '</tr>'
	xml += '<tr>'
	xml += '<td colspan="2"><img src="' + bottomImageURL + '" style="height:87px; width:212px" /> </td>'

	xml += '</tr>'
	xml += '</table>'

	/*
	xml += '<table align="center" vertical-align="top" style="width:506px; height:100%;border-collapse:collapse;" cellpadding="0" cellspacing="0" border="0" cellmargin="0">';
			xml += '<tr>';
			xml += '<td colspan="3"><img src="http://shopping.na2.netsuite.com/core/media/media.nl?id=178&amp;c=5112262&amp;h=d4413d90916411315d7d" style="float: center;height:630px; width:506px" /> </td>';
			xml += '</tr>';
			xml += '<tr>';
			xml += '<td rowspan="2"><img src="http://shopping.na2.netsuite.com/core/media/media.nl?id=179&amp;c=5112262&amp;h=ff5366b851a0164bd2a3" style="float: center;height:269px; width:294px" /> </td>';
			xml += '<td><barcode codetype="qrcode" width="180px" height="180px" showtext="true" value="';
			xml += code;
			xml += '"/>'
			xml += '</td>';
			xml += '<td><img src="http://shopping.na2.netsuite.com/core/media/media.nl?id=181&amp;c=5112262&amp;h=1f78924146521272eaa8" style="float: center;height:182px; width:32px" /> </td>';
			xml += '</tr>';
			xml += '<tr>';
			xml += '<td colspan="2"><img src="http://shopping.na2.netsuite.com/core/media/media.nl?id=180&amp;c=5112262&amp;h=e065da7e9529d294771e" style="float: center;height:87px; width:212px" /> </td>';
			xml += '</tr>';
			xml += '</table>';
	*/
	/*
			xml += '<body width="253px"  font-size="8.5" style="padding:0;">';
			xml += '<table align="center" style="width:253px; height:450px;border-collapse:collapse;" cellpadding="0" cellspacing="0" border="0">';
			xml += '<tr>';
			xml += '<td colspan="3"><img src="http://shopping.netsuite.com/core/media/media.nl?id=24607&amp;c=5112262_SB1&amp;h=5ee2171a430967fd3211" style="float: center;height:315px; width:253px" /> </td>';
			xml += '</tr>';
			xml += '<tr>';
			xml += '<td rowspan="2"><img src="http://shopping.netsuite.com/core/media/media.nl?id=24608&amp;c=5112262_SB1&amp;h=c1f009683d1d8cf216df" style="float: center;height:135px; width:147px" /> </td>';
			xml += '<td><barcode codetype="qrcode" width="90px" height="90px" showtext="true" value="';
			xml += code;
			xml += '"/>'
			xml += '</td>';
			xml += '<td><img src="http://shopping.netsuite.com/core/media/media.nl?id=24610&amp;c=5112262_SB1&amp;h=6d202f218e3d1e18d685" style="float: center;height:91px; width:16px" /> </td>';
			xml += '</tr>';
			xml += '<tr>';
			xml += '<td colspan="2"><img src="http://shopping.netsuite.com/core/media/media.nl?id=24609&amp;c=5112262_SB1&amp;h=22c26090856f57a9572f" style="float: center;height:44px; width:106px" /> </td>';
			xml += '</tr>';
			xml += '</table>';
		*/

	xml += '</body>'
	//end body

	xml += '\n</pdf>'
	//	nlapiLogExecution('debug', 'XML', xml);
	//	nlapiLogExecution('debug', 'XML Finished');
	var file = nlapiXMLToPDF(xml)
	file.setName(filename)
	file.setFolder(FolderID)
	file.setIsInactive(false)
	file.setIsOnline(false)
	return file
}