function Schedule_MO_POSO_Type5()
{
	var recid = nlapiGetContext().getSetting('SCRIPT', 'custscriptmoid3');
//	var recid = 225;
	try{
	checkGovernance();
	var erroritem = 0;
	
	var rec = nlapiLoadRecord('customrecordquickshoporder', recid);
	checkGovernance();
	var location = rec.getFieldValue('custrecordquickshoporderlocation');
	nlapiLogExecution('debug', 'To Location', location);
	var recLoc = nlapiLoadRecord('location',location);
	var Subid = recLoc.getFieldValue('subsidiary');
	nlapiLogExecution('debug', 'Subid', Subid);
	var fromlocation = FernSPEEDSearch('Transfer From Location');
	nlapiLogExecution('debug', 'fromlocation', fromlocation);
	checkGovernance();
	
	var lineCount = rec.getLineItemCount('recmachcustrecordquickshoporderlinelink'); 
	
	// Start Transfer
	{
		if(rec.getFieldValue('custrecordquickshopordertypeid')==5)
		{			
			var recPO = nlapiCreateRecord('transferorder');
			checkGovernance();
			// var vendorID = rec.getFieldValue('custrecordquickshopordervia');
			var orderType = rec.getFieldValue('custrecordquickshopordertypeid');
			var staffmeal = rec.getFieldValue('custrecordquickshoporderstaffmeal');
			var ordRemarks = rec.getFieldValue('custrecordquickshopordremarks');
			
			// recPO.setFieldValue('entity',vendorID);
			recPO.setFieldValue('trandate', rec.getFieldValue('custrecordquickshoporderdate'));
			recPO.setFieldValue('subsidiary', Subid);
			recPO.setFieldValue('transferlocation', location);
			recPO.setFieldValue('location', fromlocation);
			recPO.setFieldValue('custbodyrelatedquickshoporder', recid);
			recPO.setFieldValue('custbody_transfer_type', 3);
			recPO.setFieldValue('custbodyquoremarkremarks', ordRemarks);
			recPO.setFieldValue('shipdate', rec.getFieldValue('custrecordquickshoporderdeliverdate'));
			// recPO.setFieldValue('approvalstatus', 2);

			var lineCount = rec.getLineItemCount('recmachcustrecordquickshoporderlinelink'); 
			nlapiLogExecution('debug', 'lineCount', lineCount);
			var internalindex = 0;
			
			for (var k = 1; k <= lineCount; k++)
			{
				checkGovernance();
				nlapiLogExecution('debug', 'k start', k);
				var picking = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlinepicking', k);
				var itemid = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineitem', k);
				var itemtype = nlapiLookupField('item',itemid,'type');
				if(itemtype == "InvtPart")
				{
					picking = 'T';
				}
				var po = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlinepo', k);
				var reject = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlinerejected', k);
				var linked = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlinelinkedpo', k);
				var lineID = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'id', k);
				nlapiLogExecution('audit', 'lineID', lineID);
				nlapiLogExecution('audit', 'picking', picking);
				nlapiLogExecution('audit', 'po', po);
				if(picking == 'T' && reject != 'T' && linked != 'T')
				{
					internalindex++;
					
					if(itemtype != 'NonInvtPart')
					{
						var lineremarks = 	rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineremarks', k);
						nlapiLogExecution('debug', 'itemid', itemid);
						var qty = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineqty', k);
						nlapiLogExecution('debug', 'qty', qty);
						var fields = ['unitstype', 'stockunit', 'custitemcatchweightitem', 'purchaseunit','custitemcatchweightconversion'];
						var values = nlapiLookupField('item', itemid, fields);
						checkGovernance();
						if(values.unitstype)
						{
							if(values.custitemcatchweightitem == 'T')
							{
								var cwqty = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineqty', k);
								var convert = unitconversion(values.unitstype, values.purchaseunit, values.stockunit);
								convert = 1;
								var purchaseqty = (parseFloat(cwqty)/parseFloat(values.custitemcatchweightconversion))*parseFloat(convert);
								
								
							}
							else
							{
								var qty = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineqty', k);
								var lineunit = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshopordlineuom', k);
								var convert = unitconversion(values.unitstype, values.purchaseunit, lineunit);
								convert = 1;
								var purchaseqty = parseFloat(qty)*parseFloat(convert);
							}
						}
						else
						{
							var qty = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineqty', k);
							var purchaseqty = parseFloat(qty);
						}
						nlapiLogExecution('debug', 'purchaseqty', purchaseqty);
						var polinecount = recPO.getLineItemCount('item');
						if(polinecount > 0)
						{
							for(var jj = 1; jj <= polinecount; jj++)
							{
								var poitemid = recPO.getLineItemValue('item','item', jj);
								if(poitemid == itemid)
								{
									recPO.selectLineItem('item', jj);
									var poqty = parseFloat(recPO.getCurrentLineItemValue('item', 'quantity'))+parseFloat(purchaseqty);
									recPO.setCurrentLineItemValue('item', 'quantity', poqty);
									recPO.commitLineItem('item');
									break;
								}
							}
						}
						else
						{
							var jj = 1;
						}
						if(jj > polinecount)
						{
							recPO.selectNewLineItem('item');//i
							recPO.setCurrentLineItemValue('item','item',itemid);
							recPO.setCurrentLineItemValue('item','quantity',purchaseqty);
							recPO.setCurrentLineItemValue('item','units',values.purchaseunit);
							recPO.commitLineItem('item');
						}
						nlapiLogExecution('debug', 'k end', k);
						nlapiSubmitField('customrecordquickshoporderline', lineID, 'custrecordquickshoporderlinelinkedpo', 'T');
						checkGovernance();
					}
				}
			}
			nlapiLogExecution('debug', 'internalindex', internalindex);
			if(internalindex > 0)
			{
				nlapiLogExecution('debug', 'start submit TO');
				var POid = nlapiSubmitRecord(recPO);
				checkGovernance();
				nlapiLogExecution('debug', 'POid', POid);
				
				var generatedPOSO = nlapiCreateRecord('customrecordfernspeedposo');
				checkGovernance();
				generatedPOSO.setFieldValue('custrecord_molink', recid);
				if(rec.getFieldValue('custrecordquickshopordertypeid') == 5)
				{
					generatedPOSO.setFieldValue('custrecordfernspeedmopo', POid);
					// generatedPOSO.setFieldValue('custrecordfernspeedmoso', SOid);
				}
				var linkID = nlapiSubmitRecord(generatedPOSO);
				nlapiLogExecution('debug', 'linkID', linkID);
				checkGovernance();
			}
		}
	}
	//End Transfer

	// Start NonInvt PO
	{
		if(rec.getFieldValue('custrecordquickshopordertypeid')==5)
		{			
			var recPO = nlapiCreateRecord('purchaseorder');
			checkGovernance();
			var vendorID = rec.getFieldValue('custrecordquickshopordervia');
			var orderType = rec.getFieldValue('custrecordquickshopordertypeid');
			var staffmeal = rec.getFieldValue('custrecordquickshoporderstaffmeal');
			var OrderRemarks = rec.getFieldValue('custrecordquickshopordremarks');
			
			recPO.setFieldValue('entity',vendorID);
			recPO.setFieldValue('trandate', rec.getFieldValue('custrecordquickshoporderdate'));
			recPO.setFieldValue('location', location);
			recPO.setFieldValue('cseg1', 2);
			recPO.setFieldValue('custbodyrelatedquickshoporder', recid);
			recPO.setFieldValue('duedate', rec.getFieldValue('custrecordquickshoporderdeliverdate'));
			recPO.setFieldValue('custbody_printout_remark', OrderRemarks);
			recPO.setFieldValue('approvalstatus', 2);

			var lineCount = rec.getLineItemCount('recmachcustrecordquickshoporderlinelink'); 
			nlapiLogExecution('debug', 'lineCount', lineCount);
			var internalindex = 0;
			
			for (var k = 1; k <= lineCount; k++)
			{
				checkGovernance();
				nlapiLogExecution('debug', 'k start', k);
				var picking = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlinepicking', k);
				var po = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlinepo', k);
				var itemid = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineitem', k);
				var itemtype = nlapiLookupField('item',itemid,'type');
				if(itemtype == "NonInvtPart")
				{
					po = 'T';
				}
				var reject = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlinerejected', k);
				var linked = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlinelinkedpo', k);
				var lineID = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'id', k);
				
				nlapiLogExecution('audit', 'lineID', lineID);
				if(po == 'T' && reject != 'T' && linked != 'T' && itemtype == "NonInvtPart")
				{
					internalindex++;
					var itemid = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineitem', k);
					var lineremarks = 	rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineremarks', k);
					nlapiLogExecution('debug', 'itemid', itemid);
					var qty = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineqty', k);
					
					var fields = ['unitstype', 'stockunit', 'custitemcatchweightitem', 'purchaseunit','custitemcatchweightconversion'];
					var values = nlapiLookupField('item', itemid, fields);
					checkGovernance();

					{
						var qty = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlineqty', k);
						var purchaseqty = parseFloat(qty);
					}
					
					var polinecount = recPO.getLineItemCount('item');
					if(polinecount > 0)
					for(var jj = 1; jj <= polinecount; jj++)
					{
						var poitemid = recPO.getLineItemValue('item','item', jj);
						if(poitemid == itemid && itemtype != 'NonInvtPart')
						{
							recPO.selectLineItem('item', jj);
							var poqty = parseFloat(recPO.getCurrentLineItemValue('item', 'quantity')) + parseFloat(purchaseqty);
							recPO.setCurrentLineItemValue('item', 'quantity', poqty);
							recPO.commitLineItem('item');
							break;
						}
					}
					else
					{
						var jj = 1;
					}
					nlapiLogExecution('debug', 'poqty', poqty);
					nlapiLogExecution('debug', 'purchaseqty', purchaseqty);
					if(jj > polinecount)
					{
						recPO.selectNewLineItem('item');//i
						recPO.setCurrentLineItemValue('item','item',itemid);
						if(itemid == erroritem || itemtype == 'NonInvtPart')
						{
							recPO.setCurrentLineItemValue('item','description',lineremarks);
						}
						recPO.setCurrentLineItemValue('item','quantity',purchaseqty);
						recPO.setCurrentLineItemValue('item','units',values.purchaseunit);
						recPO.setCurrentLineItemValue('item','location',location);
						
						
						var itemrate = 0;
						var baseprice = 0;
						nlapiLogExecution('debug', 'baseprice', baseprice);
						if(baseprice != '' & baseprice != null && baseprice != 'null')
						{
							itemrate = baseprice;
						}
						nlapiLogExecution('audit', 'rate', itemrate);
						var markup = 0;
						nlapiLogExecution('debug', 'markup', markup);
						var internalrate;
						if(markup)
						{
							internalrate = itemrate;
						}
						else
						{
							internalrate = itemrate;
						}
						recPO.setCurrentLineItemValue('item','rate',internalrate);
						recPO.commitLineItem('item');
					}
					nlapiLogExecution('debug', 'k end', k);
					nlapiSubmitField('customrecordquickshoporderline', lineID, 'custrecordquickshoporderlinelinkedpo', 'T');
					checkGovernance();
				}
			}
			
			if(internalindex > 0)
			{
				nlapiLogExecution('debug', 'internalindex', internalindex);
				var POid = nlapiSubmitRecord(recPO);
				checkGovernance();
				
				var recPO = nlapiLoadRecord('purchaseorder', POid);
				checkGovernance();
				nlapiLogExecution('debug', 'POid', POid);

				
				var generatedPOSO = nlapiCreateRecord('customrecordfernspeedposo');
				checkGovernance();
				generatedPOSO.setFieldValue('custrecord_molink', recid);
				if(rec.getFieldValue('custrecordquickshopordertypeid') == 5)
				{
					generatedPOSO.setFieldValue('custrecordfernspeedmopo', POid);
					// generatedPOSO.setFieldValue('custrecordfernspeedmoso', SOid);
				}
				nlapiSubmitRecord(generatedPOSO);
				checkGovernance();
			}
		}
	}
	//End PO
	


	var recV2 = nlapiLoadRecord('customrecordquickshoporder', recid);
	var lineCount = recV2.getLineItemCount('recmachcustrecordquickshoporderlinelink');
	var pending = 0;
	var confirmed = 0;
	var recStatus = 1;
	
	for (var x = 1; x <= lineCount; x++)
	{
		var reject = recV2.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlinerejected', x);
		var linked = recV2.getLineItemValue('recmachcustrecordquickshoporderlinelink', 'custrecordquickshoporderlinelinkedpo', x);
		if(linked != 'T' && reject != 'T')
		{
			pending ++;
		}
		else if(linked == 'T')
		{
			confirmed ++;
		}
	}
	if(pending > 0 && confirmed > 0)
	{
		recStatus = 9;
	}
	else if(confirmed > 0 && pending == 0)
	{
		recStatus = 2;
	}
	nlapiLogExecution('debug', 'recStatus', recStatus);
	nlapiSubmitField('customrecordquickshoporder', recid, 'custrecordquickshoporderstatus', recStatus);
	}
	catch(e)
	{
		var subject = "there is an error when generate po/so:"+recid;
		var sender=3;
		var emailBody = 'Dear officer,<br/> There is an error happens when generated PO/SO, details is as following:<br/>' + e.getCode() +'<br/>'+e.getDetails();
		nlapiSendEmail( sender, 'kathy@fern.com.hk', subject,emailBody);
		nlapiLogExecution('debug', 'error: ', e);
	}
}

function SearchProcureSub()
{
	var filterExpression = 	[["custrecordprocuresub","is","T"]];
	
	var columns = new  Array();
	columns[0] = new nlobjSearchColumn('custrecordsubdefaultlocation', null, null);
	var s = nlapiCreateSearch('subsidiary', filterExpression, columns);
	var result = s.runSearch().getResults(0,1);
	var subpara = {};
	if(result[0])
	{
		subpara.procureid = result[0].getId();
		subpara.mainlocationid = result[0].getValue(columns[0]);
	}
	return subpara;
}

function ifnullzero(x)
{
	if(!x)
		x=0;
	return x;
}

function ifnull(x)
{
	if(!x)
		x='';
	return x;
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

function unitconvertbase(unitTypeId, unitid)
{
	nlapiLogExecution('debug', 'unit', unitTypeId+', '+unitid);
	var unitrec = nlapiLoadRecord('unitstype', unitTypeId);
	nlapiLogExecution('debug', 'unitrec', 'Loaded');
	var count = unitrec.getLineItemCount('uom');
	nlapiLogExecution('debug', 'uomcount', count);
	var unitconvert;
	var salesunitconvert;
	for(var i=1; i<=count; i++)
	{
		if(unitid == unitrec.getLineItemValue('uom','internalid', i))
		{
			nlapiLogExecution('debug', 'unitconversion.conversionrate', unitrec.getLineItemValue('uom','conversionrate', i));
			unitconvert = unitrec.getLineItemValue('uom','conversionrate', i);
		}
	
	}
	
	return parseFloat(unitconvert) ;
}

function unitconversion(unitTypeId, unitid, salesunit)
{
	nlapiLogExecution('debug', 'unit', 'unitTypeId'+', '+unitid+'salesunit:'+salesunit);
	var unitrec = nlapiLoadRecord('unitstype', unitTypeId);
	nlapiLogExecution('debug', 'unitrec', 'Loaded');
	var count = unitrec.getLineItemCount('uom');
	nlapiLogExecution('debug', 'uomcount', count);
	var unitconvert;
	var salesunitconvert;
	for(var i=1; i<=count; i++)
	{
		if(unitid == unitrec.getLineItemValue('uom','internalid', i))
		{
			nlapiLogExecution('debug', 'unitconversion.conversionrate', unitrec.getLineItemValue('uom','conversionrate', i));
			unitconvert = unitrec.getLineItemValue('uom','conversionrate', i);
		}
		if(salesunit == unitrec.getLineItemValue('uom','internalid', i))
		{
			nlapiLogExecution('debug', 'salesunit.conversionrate', unitrec.getLineItemValue('uom','conversionrate', i));
			salesunitconvert = unitrec.getLineItemValue('uom','conversionrate', i);
		}
	}
	
	return (parseFloat(unitconvert) / parseFloat(salesunitconvert));
	
}

function uniqueVendor(rec)
{
	var count = rec.getLineItemCount('recmachcustrecordquickshoporderlinelink');
	var vendorlist = new Array();
	var index = 0;
	for(var i=1; i<=count; i++)
	{
		var po = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink','custrecordquickshoporderlinepo', i);
		var linked = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink','custrecordquickshoporderlinelinkedpo', i);
		var rejected = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink','custrecordquickshoporderlinerejected', i);
		if(po == 'T' && linked != 'T' && rejected != 'T')
		{
			vendorlist[index] = rec.getLineItemValue('recmachcustrecordquickshoporderlinelink','custrecordquickshopordlinevendor', i);
			index++;
		}
	}
	function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
	}
	var unique = vendorlist.filter(onlyUnique);
	nlapiLogExecution('debug', 'vendorlist', JSON.stringify(unique));
	return unique;
}

function FernSPEEDSearch(title)
{
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'name', null, 'is', title);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('custrecordfernspeedsettingref');

	var Search = nlapiCreateSearch('customrecordfernspeedsettings', filters, columns);
	
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
