function Suitelet_Redemption_Print(request, response)
{
	var recId = request.getParameter('id');
	nlapiLogExecution('debug', 'recId', recId);
	var rec = nlapiLoadRecord('customrecordredemptionmain',recId);
	// var tranid = rec.getFieldValue('tranid');
	/*
	if(!rec.getFieldValue('custrecordredemptionmaininvoice'))
	{
		var recInv = nlapiCreateRecord('invoice');
		recInv.setFieldValue('entity',1535);
		recInv.setFieldValue('cseg1',rec.getFieldValue('custrecordredemptionmainchannel'));
		recInv.setFieldValue('location',rec.getFieldValue('custrecordredemptionmainlocation'));
		var voucherCount = rec.getLineItemCount('recmachcustrecordredemptionmain');
		for (var x = 1; x <= voucherCount; x++)
		{
			var voucherID = rec.getLineItemValue('recmachcustrecordredemptionmain','custrecordredeemvouchercode',x);
			var fields = new Array();
			var values = new Array();
			fields[0] = 'custrecordrcmasterredempmainid';
			values[0] = recId;
			fields[1] = 'custrecordredeemcodemasterredemptdate';
			values[1] = rec.getFieldValue('custrecordredemptionmaindate');
			fields[2] = 'custrecordrcmasterused';
			values[2] = "T";
			var updatefields = nlapiSubmitField('customrecordrcmaster', voucherID, fields, values); 
			
			recInv.selectNewLineItem('item');
			// recInv.setCurrentLineItemValue('item','item',rec.getLineItemValue('recmachcustrecordredemptionmain','custrecordredeemproduct',x));
			// recInv.setCurrentLineItemValue('item','rate',0));
			// recInv.commitLineItem('item');
			
			
			
			var ItemSearch = nlapiLoadSearch('item', 'customsearchpositem');
			var Itemsearchfilter = ItemSearch.getFilters();
			Itemsearchfilter[0] = new nlobjSearchFilter('internalid', null, 'is', rec.getLineItemValue('recmachcustrecordredemptionmain','custrecordredeemproduct',x));
			ItemSearch.setFilters(Itemsearchfilter);
			var ItemSearchColumn = ItemSearch.getColumns();
			ItemSearchColumn[0] = new nlobjSearchColumn('islotitem', null);
			ItemSearchColumn[0] = new nlobjSearchColumn('islotitem', null);
			ItemSearch.setColumns(ItemSearchColumn);
			var ItemresultSet = ItemSearch.runSearch();
			var ItemSearchresults = ItemresultSet.getResults(0,1);
			if (ItemSearchresults.length > 0)
			{
				var itemid = ItemSearchresults[0].getId();
				var columns = ItemSearchresults[0].getAllColumns();
				var islotitem = ItemSearchresults[0].getValue(columns[0]);
			}
			else
			{
				var itemid = 513; //(temp Item with error)
				recInv.setCurrentLineItemValue('item','description','item is not matching');
			}
			
			recInv.setCurrentLineItemValue('item','item',itemid);
			recInv.setCurrentLineItemValue('item','quantity',1);
			recInv.setCurrentLineItemValue('item','rate',0);
			
			if (islotitem == 'T')
			{
				//
				var filters = new Array();
				filters[0] = new nlobjSearchFilter( 'item', null, 'anyOf', itemid);
				filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'GREATERTHANOREQUALTO', 1);
				filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHANOREQUALTO', 1);
				filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', rec.getFieldValue('custrecordredemptionmainlocation'));
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
				var LotNum = '';
				for ( var m = 0; LotNumSearchresults.length > 0 && LotNumSearchresults && m == 0 ; m++ )
				{
					var inventoryNumID = LotNumSearchresults[m].getId();
					var ResultColumns = LotNumSearchresults[m].getAllColumns();
					nlapiLogExecution('audit', 'LotNum Location', LotNumSearchresults[m].getValue(ResultColumns[2]));
					LotNum = LotNumSearchresults[m].getValue(ResultColumns[0]);
					nlapiLogExecution('audit', 'itemid = ' + itemid, 'LotNum = ' + LotNum);
				}
				if (LotNum != '')
				{	
					var subrec = recInv.createCurrentLineItemSubrecord('item', 'inventorydetail');
					subrec.selectNewLineItem('inventoryassignment');
					subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
					subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', 1);
					subrec.commitLineItem('inventoryassignment');
					subrec.commit();
				}
				else
				{
					recInv.setCurrentLineItemValue('item','item',513);
					recInv.setCurrentLineItemValue('item','description','item has no stock. ' + rec.getLineItemText('recmachcustrecordredemptionmain','custrecordredeemproduct',x));
				}
			}
			
			recInv.commitLineItem('item');

		}
		recInv.setFieldValue('custbodypossalesid',recId);
		//var InvID = nlapiSubmitRecord(recInv);
		rec.setFieldValue('custrecordredemptionmaininvoice', InvID);
		
		
		// nlapiSubmitRecord(rec);
		
	}
	*/
	var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
	xml += '<pdf>'

	//Start body
	xml += '<body width="72mm" height="200mm" font-size="6.5" padding="0in 0.2in 0.2in 0.2in">';
	
	
		xml += '<table align="center">';
		xml += '<tr>';
		xml += '<td>';
		var file = nlapiLoadFile(339163);
		var ImgURL = file.getURL();
		xml += '<table align="center" width="100%">';
		xml += '<tr>';
		xml += '<td align="center">';
		xml += '<img src="'+nlapiEscapeXML(ImgURL)+'" height="40mm" width="" />';
		xml += '</td>';
		xml += '</tr>';
		xml += '</table>';
		xml += '</td>';
		xml += '</tr>';
		
		xml += '<tr>';
		xml += '<td style="font-family: MSung, STSong, MHei, HeiseiMin, hygothic, san-serif;">';
		var locationAdd = rec.getFieldValue('custrecordredemptionmainaddress');
		var locationAdd2 = rec.getFieldValue('custrecordredemptionmainadd2');
		var locationAdd3 = rec.getFieldValue('custrecordredemptionmainadd3');
		xml += nlapiEscapeXML(locationAdd);
		xml += '<br/>';
		xml += nlapiEscapeXML(locationAdd2);
		xml += '<br/>Tel: ';
		xml += nlapiEscapeXML(locationAdd3);
		xml += '</td>';
		xml += '</tr>';
		
		xml += '</table>';
	
		xml += '<table align="center">';
		xml += '<tr>';
		xml += '<td style="font-family: MSung, STSong, MHei, HeiseiMin, hygothic, san-serif;" font-size="11">';
		xml += '<b>兌換</b><br/>';
		xml += '</td>';
		xml += '</tr>';
		xml += '</table>';
		
		xml += '<table align="left" width="100%">';
		xml += '<tr>';
		xml += '<td style="font-family: MSung, STSong, MHei, HeiseiMin, hygothic, san-serif;">';
		xml += "<br/>";
		xml += '日期: ';
		xml += rec.getFieldValue('custrecordredemptionmaindateprint');
		xml += '</td>';
		xml += '</tr>'
		xml += '<tr>';
		xml += '<td style="font-family: MSung, STSong, MHei, HeiseiMin, hygothic, san-serif;">';
		xml += '單號: ';
		var invTranID = rec.getFieldValue('name');
		nlapiLogExecution('debug', 'invTranID', invTranID);
		xml += invTranID;

		xml += "<br/>";
		xml += '</td>';
		xml += '</tr>';
		xml += '</table>';
		
		xml += '<table align="center" width="100%" font-size="8">';
		xml += '<tr>';
		xml += '<td style="border-bottom: 1px solid;font-family: MSung, STSong, MHei, HeiseiMin, hygothic, san-serif;">';
		xml += '貨品';
		xml += '</td>';
		xml += '<td style="border-bottom: 1px solid;font-family: MSung, STSong, MHei, HeiseiMin, hygothic, san-serif;">';
		xml += '數量';
		xml += '</td>';
		xml += '</tr>';
		
		var voucherCount = rec.getLineItemCount('recmachcustrecordredemptionmain');
		for (var x = 1; x <= voucherCount; x++)
		{
			
			xml += '<tr>';
			xml += '<td style="font-family: MSung, STSong, MHei, HeiseiMin, hygothic, san-serif;">';
			xml += rec.getLineItemValue('recmachcustrecordredemptionmain','custrecordredemptionsublistchiprodname',x);
			xml += '<br/>';
			xml += rec.getLineItemValue('recmachcustrecordredemptionmain','custrecordredeemproductname',x);
			xml += '</td>';
			xml += '<td>';
			xml += 1;
			xml += '</td>';
			xml += '</tr>';
		}
		xml += '</table>';
		
		
		xml += '<table align="center" width="100%">';
		xml += '<tr>';
		xml += '<td>';
		xml += "<br/>";
		xml += "<br/>";
		xml += "<br/>";
		xml += '</td>';
		xml += '</tr>';
		xml += '</table>';
		
		xml += '<table align="center" width="100%">';
		xml += '<tr>';
		xml += '<td align="center">';
		xml += '<barcode codetype="code128" width="50mm" height="15mm" showtext="true" value="';
		xml += invTranID;
		xml += '"/>'
		xml += '</td>';
		xml += '</tr>';
		xml += '</table>';
	
	xml += '</body>';
	//end body
	


	
	xml += '\n</pdf>';
	nlapiLogExecution('debug', 'XML', xml);
	nlapiLogExecution('debug', 'XML Finished');
	var file = nlapiXMLToPDF(xml);
	response.setContentType('PDF','Printout.pdf','inline');
	response.write(file.getValue());
	
}


function ifnull(varstring)
{
	if (varstring == null)
	{
		return ''; 
	}
	else 
	{
		return varstring;
	}
}

function comma(x)
 {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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