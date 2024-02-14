function Schedule_Redemption()
{
	// if(type == 'create' || type == 'edit')
	{
		var recId = nlapiGetContext().getSetting('SCRIPT', 'custscript_redemid');
		nlapiLogExecution('debug', 'recId', recId);
		var rec = nlapiLoadRecord('customrecordredemptionmain',recId);
		checkGovernance();
		// var tranid = rec.getFieldValue('tranid');
		var redemptionLocation = rec.getFieldValue('custrecordredemptionmainlocation');
		
		var redemptionChannel = rec.getFieldValue('custrecordredemptionmainchannel');
		var recLoc = nlapiLoadRecord('location',redemptionLocation);
		checkGovernance();
		var Subid = recLoc.getFieldValue('subsidiary');
		if(redemptionChannel == '' || redemptionChannel == 'null' || redemptionChannel == null)
		{
			var redemptionChannel = recLoc.getFieldValue('custrecordlocationrelatedchannel');
		}
		
		if(!rec.getFieldValue('custrecordredemptionmaininvoice'))
		{
			var recInv = nlapiCreateRecord('invoice');
			checkGovernance();
			recInv.setFieldValue('entity',1535);
			recInv.setFieldValue('subsidiary',Subid);
			if(Subid == 14) // AIL
			{
				recInv.setFieldValue('custbody_sync_pos_ail','T');
			}
			if(Subid == 10) // IDL
			{
				recInv.setFieldValue('custbody_sync_pos','T');
			}
			
			recInv.setFieldValue('cseg1',redemptionChannel);
			recInv.setFieldValue('trandate',rec.getFieldValue('custrecordredemptionmaindateprint'));
			recInv.setFieldValue('location',redemptionLocation);
			var voucherCount = rec.getLineItemCount('recmachcustrecordredemptionmain');
			for (var x = 1; x <= voucherCount; x++)
			{
				var voucherID = rec.getLineItemValue('recmachcustrecordredemptionmain','custrecordredeemvouchercode',x);
				if(voucherID != '' && voucherID != 'null' && voucherID != null)
				{
					var fields = new Array();
					var values = new Array();
					fields[0] = 'custrecordrcmasterredempmainid';
					values[0] = recId;
					fields[1] = 'custrecordredeemcodemasterredemptdate';
					values[1] = rec.getFieldValue('custrecordredemptionmaindate');
					fields[2] = 'custrecordrcmasterused';
					values[2] = "T";
					var updatefields = nlapiSubmitField('customrecordrcmaster', voucherID, fields, values); 
					checkGovernance();
					recInv.selectNewLineItem('item');
					// recInv.setCurrentLineItemValue('item','item',rec.getLineItemValue('recmachcustrecordredemptionmain','custrecordredeemproduct',x));
					// recInv.setCurrentLineItemValue('item','rate',0));
					// recInv.commitLineItem('item');
					
					
					
					var ItemSearch = nlapiLoadSearch('item', 'customsearchpositem');
					checkGovernance();
					var Itemsearchfilter = ItemSearch.getFilters();
					Itemsearchfilter[0] = new nlobjSearchFilter('internalid', null, 'is', rec.getLineItemValue('recmachcustrecordredemptionmain','custrecordredeemproduct',x));
					ItemSearch.setFilters(Itemsearchfilter);
					var ItemSearchColumn = ItemSearch.getColumns();
					ItemSearchColumn[0] = new nlobjSearchColumn('islotitem', null);
					ItemSearchColumn[0] = new nlobjSearchColumn('islotitem', null);
				  ItemSearchColumn[1] = new nlobjSearchColumn('custitem_barcode', null);
					ItemSearch.setColumns(ItemSearchColumn);
					var ItemresultSet = ItemSearch.runSearch();
					checkGovernance();
					var ItemSearchresults = ItemresultSet.getResults(0,1);
					if (ItemSearchresults.length > 0)
					{
						var itemid = ItemSearchresults[0].getId();
						var columns = ItemSearchresults[0].getAllColumns();
						var islotitem = ItemSearchresults[0].getValue(columns[0]);
						var barcode = ItemSearchresults[0].getValue(columns[1]);
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
						filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'GREATERTHAN', voucherCount);
						filters[3] = new nlobjSearchFilter( 'quantityonhand', null, 'GREATERTHAN', voucherCount);
						filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', rec.getFieldValue('custrecordredemptionmainlocation'));
						var columns = new Array();
						columns[0] = new nlobjSearchColumn('inventorynumber');
						columns[1] = new nlobjSearchColumn('expirationdate');
						columns[1].setSort(); 
						columns[2] = new nlobjSearchColumn('location');
						//columns[3] = new nlobjSearchColumn('custitem_barcode','item');
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
							recInv.setCurrentLineItemValue('item','description','item has no stock. ' + barcode);
							recInv.setCurrentLineItemValue('item','custcolposremarks',itemid);
							
						}
					}
					
					recInv.commitLineItem('item');

				}
			}
			recInv.setFieldValue('custbodypossalesid',recId);
			recInv.setFieldValue('custbodyredemptioninvoice','T');
			var InvID = nlapiSubmitRecord(recInv);
			checkGovernance();
			rec.setFieldValue('custrecordredemptionmaininvoice', InvID);
			
			
			nlapiSubmitRecord(rec);
			checkGovernance();
		}
	}
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