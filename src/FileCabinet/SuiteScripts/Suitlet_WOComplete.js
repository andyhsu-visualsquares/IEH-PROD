function Suitlet_WOComplete(request, response)
{
	
	var recId = request.getParameter('id');
	nlapiLogExecution('debug', 'recId', recId);
	var rec = nlapiLoadRecord('workordercompletion',recId);
	nlapiLogExecution('debug', 'workordercompletion loaded', recId);
	var info = 'Converting to Sales Item Inventory.<br/><br/>';
	
	var ConversionTransaction = rec.getFieldValue('custbodyassconversiontransacti');

/*	
	//added by Kathy
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custbody_wo_completion', null, 'anyof', recId);
	var search = nlapiCreateSearch( 'inventoryadjustment', filters, null );
	var resultset = search.runSearch().getResults(0,1);
	if(resultset[0])
	{
		info += 'Inventory have been converted before cannot be converted again';
		var url  = nlapiResolveURL('RECORD', 'inventoryadjustment', resultset[0].getId());
					var IATranID = nlapiLookupField('inventoryadjustment',resultset[0].getId(),'tranid');
					info += ': ' + '<a href="' + url + '">  ' + IATranID + '</a>';
	}
	else
		
*/	
	if (!ConversionTransaction)
	{
		var AssItemid = rec.getFieldValue('item');
		nlapiLogExecution('debug', 'assembly item id', AssItemid);
		var recAss = nlapiLoadRecord('lotnumberedassemblyitem',AssItemid);
		nlapiLogExecution('debug', 'assembly item Loaded', AssItemid);
		var SalesItemid = recAss.getFieldValue('custitem_sales_item');
		nlapiLogExecution('debug', 'SalesItemid', SalesItemid);
		
		var AssItemNum = recAss.getFieldValue('itemid');
		if (SalesItemid)
		{
			var recSalesItem = nlapiLoadRecord('inventoryitem',SalesItemid);
			var SalesItemNum = recSalesItem.getFieldValue('itemid');
			nlapiLogExecution('debug', 'SalesItemNum', SalesItemNum);
			nlapiLogExecution('debug', 'AssItemNum', AssItemNum.substr(0,AssItemNum.length-2));
			if(SalesItemNum == AssItemNum.substr(0,AssItemNum.length-2))
			{
				var AssConsumptionUnit = recAss.getFieldText('consumptionunit');
				var SalesConsumptionUnit = recSalesItem.getFieldText('consumptionunit');
				if(SalesConsumptionUnit == AssConsumptionUnit)
				{
					var subsidiary = rec.getFieldValue('subsidiary');
					var FromLocation = rec.getFieldValue('location');
					// var FinishLocation = rec.getFieldValue('custbodyfinishloaction');
					var trandate = rec.getFieldValue('trandate');
					var totalCost = rec.getFieldValue('total');
					nlapiLogExecution('debug', 'totalCost', totalCost);
					
					
					var WOqty = rec.getFieldValue('completedquantity');
					nlapiLogExecution('debug', 'WOqty', WOqty);
					var QTY = rec.getFieldValue('custbodywoqtytoconvert');
					if (QTY == null || QTY == 'null' || QTY == '')
					{
						QTY = WOqty;
					}
					nlapiLogExecution('debug', 'QTY', QTY);
					var UnitCost = totalCost/WOqty;
					nlapiLogExecution('debug', 'UnitCost', UnitCost);
				//	var inventorydetail = rec.getFieldValue('inventorydetail');
					var inventorydetail = rec.viewSubrecord('inventorydetail');
					var inventorydetailLineCount = inventorydetail.getLineItemCount('inventoryassignment');
					nlapiLogExecution('debug', 'inventorydetailLineCount', inventorydetailLineCount);//inventorydetail

					var recInvAdj = nlapiCreateRecord('inventoryadjustment');
					nlapiLogExecution('debug', 'recInvAdj', recInvAdj);
					recInvAdj.setFieldValue('account',361);
					recInvAdj.setFieldValue('subsidiary',subsidiary);
					recInvAdj.setFieldValue('trandate',trandate);
					
					recInvAdj.selectNewLineItem('inventory')
					nlapiLogExecution('debug', '-ve Line');
					recInvAdj.setCurrentLineItemValue('inventory','item',AssItemid);
					recInvAdj.setCurrentLineItemValue('inventory','location',FromLocation);
					recInvAdj.setCurrentLineItemValue('inventory','adjustqtyby',QTY *-1);
					// recInvAdj.setCurrentLineItemValue('inventory','unitcost',UnitCost);
					var currentvalue = recInvAdj.getCurrentLineItemValue('inventory','currentvalue');
					var EstimateUnitCost = recInvAdj.getCurrentLineItemValue('inventory','unitcost');
					nlapiLogExecution('debug', 'EstimateUnitCost',EstimateUnitCost);
					nlapiLogExecution('debug', 'currentvalue',currentvalue);
					
					var subrec = recInvAdj.createCurrentLineItemSubrecord('inventory', 'inventorydetail');
					for ( var a = 1; a <= inventorydetailLineCount && inventorydetailLineCount; a++ )
					{
						nlapiLogExecution('debug', 'a', a);
						inventorydetail.selectLineItem('inventoryassignment', a);
						var issueinventorynumber = inventorydetail.getCurrentLineItemValue('inventoryassignment', 'issueinventorynumber');
						var receiptinventorynumber = inventorydetail.getCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber');
						var expirationdate = inventorydetail.getCurrentLineItemValue('inventoryassignment', 'expirationdate');
						var LotQuantity = inventorydetail.getCurrentLineItemValue('inventoryassignment', 'quantity');
						nlapiLogExecution('debug', '-issueinventorynumber', issueinventorynumber);
						nlapiLogExecution('debug', '-receiptinventorynumber', receiptinventorynumber);
						nlapiLogExecution('debug', '-expirationdate', expirationdate);
						nlapiLogExecution('debug', '-LotQuantity', QTY);
					
						subrec.selectNewLineItem('inventoryassignment');
						subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', receiptinventorynumber);
						// subrec.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', receiptinventorynumber);
						subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', QTY *-1);
						subrec.setCurrentLineItemValue('inventoryassignment', 'expirationdate', expirationdate);
						subrec.setCurrentLineItemValue('inventoryassignment', 'inventorystatus', 1);
						
						nlapiLogExecution('debug', '-inventoryassignment', a);
						subrec.commitLineItem('inventoryassignment');
						
					}
					subrec.commit();
					recInvAdj.commitLineItem('inventory');
					
					var currentvalue = recInvAdj.getLineItemValue('inventory','currentvalue',1);
					var EstimateUnitCost = recInvAdj.getLineItemValue('inventory','unitcost',1);
					nlapiLogExecution('debug', 'EstimateUnitCost line1',EstimateUnitCost);
					nlapiLogExecution('debug', 'currentvalue line1',currentvalue);

					
					recInvAdj.selectNewLineItem('inventory')
					nlapiLogExecution('debug', '+ve Line');
					recInvAdj.setCurrentLineItemValue('inventory','item',SalesItemid);
					recInvAdj.setCurrentLineItemValue('inventory','location',FromLocation);
					recInvAdj.setCurrentLineItemValue('inventory','adjustqtyby',QTY);
					recInvAdj.setCurrentLineItemValue('inventory','unitcost',UnitCost);
					var subrec2 = recInvAdj.createCurrentLineItemSubrecord('inventory', 'inventorydetail');
					for ( var b = 1; b <= inventorydetailLineCount && inventorydetailLineCount; b++ )
					{
						nlapiLogExecution('debug', 'b', b);
						inventorydetail.selectLineItem('inventoryassignment', b);
						var issueinventorynumber = inventorydetail.getCurrentLineItemValue('inventoryassignment', 'issueinventorynumber');
						var receiptinventorynumber = inventorydetail.getCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber');
						var expirationdate = inventorydetail.getCurrentLineItemValue('inventoryassignment', 'expirationdate');
						var LotQuantity = inventorydetail.getCurrentLineItemValue('inventoryassignment', 'quantity');
						nlapiLogExecution('debug', '+issueinventorynumber', issueinventorynumber);
						nlapiLogExecution('debug', '+receiptinventorynumber', receiptinventorynumber);
						nlapiLogExecution('debug', '+expirationdate', expirationdate);
						nlapiLogExecution('debug', '+LotQuantity', QTY);
					
						subrec2.selectNewLineItem('inventoryassignment');
						// subrec2.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', receiptinventorynumber);
						subrec2.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', receiptinventorynumber);
						subrec2.setCurrentLineItemValue('inventoryassignment', 'quantity', QTY);
						subrec2.setCurrentLineItemValue('inventoryassignment', 'expirationdate', expirationdate);
						nlapiLogExecution('debug', '+inventoryassignment', b);
						subrec2.commitLineItem('inventoryassignment');
						nlapiLogExecution('debug', '+inventoryassignment line committed', b);
						
					}
					subrec2.commit();
					nlapiLogExecution('debug', '+inventoryassignment subrec2 committed');
					recInvAdj.commitLineItem('inventory');
					nlapiLogExecution('debug', 'inventory line committed');
					
					//added by kathy
					recInvAdj.setFieldValue('custbody_wo_completion', recId);
					
					
					var InvAdjID = nlapiSubmitRecord(recInvAdj);
					nlapiLogExecution('debug', 'InvAdjID', InvAdjID);
					nlapiLogExecution('debug', 'recId', recId);
				//	nlapiSubmitField('workordercompletion',recId,'custbodyassconversiontransacti',InvAdjID);
					 rec.setFieldValue('custbodyassconversiontransacti',InvAdjID);
					 nlapiSubmitRecord(rec);
					var url  = nlapiResolveURL('RECORD', 'inventoryadjustment', InvAdjID);
					var IATranID = nlapiLookupField('inventoryadjustment',InvAdjID,'tranid');
					info += 'Inventory Convert Successfully with Inventory Adjustment: ' + '<a href="' + url + '">  ' + IATranID + '</a>';
				}
				else
				{
					info += 'Assembly item unit ' + AssConsumptionUnit + ' not match sales item unit ' + SalesConsumptionUnit + '.';
				}
			}
			else
			{
				info += 'Assembly item number ' + AssItemNum + ' not match sales item number ' + SalesItemNum + '.';
			}
		}
		else
		{
			info += 'Assembly item do not setup with related sales item.';
		}
	}
	else
	{
		
		
	}
	
	response.write(info);
}