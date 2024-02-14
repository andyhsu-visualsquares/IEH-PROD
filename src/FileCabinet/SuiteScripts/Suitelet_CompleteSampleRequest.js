function Suitelet_CompleteSampleRequest(request, response)
{
	
	var SRid = request.getParameter('id');
	
	var recSR = nlapiLoadRecord('customrecord_samplerequest',SRid);
	var inventoryAdjID = recSR.getFieldValue('custrecord_related_ivt');
	nlapiLogExecution('debug', 'inventoryAdjID',  inventoryAdjID);
	if (inventoryAdjID == null || inventoryAdjID == 'null' || inventoryAdjID == '')
	{
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('custbody_relatedsamplerequest', null, 'anyof', SRid);
		nlapiLogExecution('debug', 'internalid',  SRid);

		var search = nlapiCreateSearch( 'inventoryadjustment', filters, null );
		
		var resultset = search.runSearch().getResults(0,1);
		if(resultset[0])
		{
			nlapiLogExecution('debug', 'id', resultset[0].getId());
			var rec = nlapiLoadRecord('inventoryadjustment', resultset[0].getId());
		}
		else
			var rec = nlapiCreateRecord('inventoryadjustment');
		
		nlapiLogExecution('debug', 'a');
		
		var memo = recSR.getFieldValue('custrecord_remarks');
		var subsidiary = recSR.getFieldValue('custrecord_subsidiary');
		var adjustAccount = recSR.getFieldValue('custrecord_requestpurpose');
	  nlapiLogExecution('debug', 'adjustAccount',adjustAccount);
		rec.setFieldValue('subsidiary', subsidiary);
		rec.setFieldValue('account', adjustAccount);
		rec.setFieldValue('memo', memo);
		nlapiLogExecution('debug', 'b');
		var count = recSR.getLineItemCount('recmachcustrecord_sampleid');
		var invadjcount = rec.getLineItemCount('inventory');
		if(invadjcount>0)
		{
			nlapiLogExecution('debug', 'c');
			for(var j=invadjcount; j>=1; j--)
				rec.removeLineItem('inventory', j);
		}

		for(var i=1; i<=count; i++)
		{
			nlapiLogExecution('debug', 'd');
			var itemid = recSR.getLineItemValue('recmachcustrecord_sampleid', 'custrecord_item', i);
				
				rec.selectNewLineItem('inventory');
				rec.setCurrentLineItemValue('inventory', 'item', itemid);
			var qty = recSR.getLineItemValue('recmachcustrecord_sampleid', 'custrecord_quantity', i);
				rec.setCurrentLineItemValue('inventory', 'adjustqtyby', qty * -1);
				
			var Relatedlocation = recSR.getFieldValue('custrecord_location');
				rec.setCurrentLineItemValue('inventory','location',Relatedlocation);
				rec.setCurrentLineItemText('inventory','units', recSR.getLineItemText('recmachcustrecord_sampleid', 'custrecord_uint', i));
				
			 {
		
				var filters = new Array();
				filters[0] = new nlobjSearchFilter( 'item', null, 'anyOf', itemid);
				filters[1] = new nlobjSearchFilter( 'quantityavailable', null, 'greaterthan', 0);

				filters[2] = new nlobjSearchFilter( 'location', null, 'anyOf', Relatedlocation);
				var columns = new Array();
				columns[0] = new nlobjSearchColumn('inventorynumber');
				columns[1] = new nlobjSearchColumn('expirationdate');
				columns[1].setSort(); 
				columns[2] = new nlobjSearchColumn('quantityavailable');
				var LotNumSearch = nlapiCreateSearch('inventorynumber', filters, columns);

				var Error_Count = 0;
				var LotNumSearchresultSet = LotNumSearch.runSearch();

				var LotNumSearchresults = LotNumSearchresultSet.getResults(0,100);
				nlapiLogExecution('debug', 'LotNumSearchresults.length', LotNumSearchresults.length);
				var LotNum = '';
				
				if(LotNumSearchresults[0])
				{
			
					var remainquantity = parseFloat(qty);
					
					
					var subrec = rec.createCurrentLineItemSubrecord('inventory', 'inventorydetail');
					for ( var m = 0; LotNumSearchresults.length > 0 && LotNumSearchresults && m<LotNumSearchresults.length; m++ )
					{
						nlapiLogExecution('debug', 'm', m);
						var inventoryNumID = LotNumSearchresults[m].getId();
						var ResultColumns = LotNumSearchresults[m].getAllColumns();
						LotNum = LotNumSearchresults[m].getValue(ResultColumns[0]);
						var lotquantity = parseFloat(LotNumSearchresults[m].getValue(ResultColumns[2]));
		
						nlapiLogExecution('debug', 'remainquantity:'+remainquantity, 'lotquantity:'+lotquantity);
						if(remainquantity<=lotquantity)
						
						{
						
						nlapiLogExecution('debug', 'subrec', 'subrec create');
						subrec.selectNewLineItem('inventoryassignment');
						subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
						subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', remainquantity * -1);
						subrec.commitLineItem('inventoryassignment');

						nlapiLogExecution('debug', 'SubRecord Committed', 'Yes');
						nlapiLogExecution('debug', 'inventorydetail Update', 'Yes');
						remainquantity = remainquantity - remainquantity;
						
						break;
						}
						else
						{
							nlapiLogExecution('debug', 'subrec', 'subrec create');
							subrec.selectNewLineItem('inventoryassignment');
							subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', LotNum);
							subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', lotquantity * -1);
							subrec.commitLineItem('inventoryassignment');
	
							nlapiLogExecution('debug', 'SubRecord Committed', 'Yes');
							nlapiLogExecution('debug', 'inventorydetail Update', 'Yes');
							remainquantity = parseFloat(remainquantity) - parseFloat(lotquantity);

						}
					}

					subrec.commit();
					
				}
			 }
				rec.commitLineItem('inventory');
		}
		rec.setFieldValue('custbody_relatedsamplerequest', SRid);
		var id = nlapiSubmitRecord(rec);
		
		nlapiLogExecution('debug', 'id', id);
		var fields = new Array();
		var values = new Array();
		fields[0] = 'custrecord_related_ivt';
		values[0] = id;
		fields[1] = 'custrecord_completed';
		values[1] = 'T';
		nlapiSubmitField('customrecord_samplerequest',SRid,fields,values);
		
	}
	
	var BillURL = nlapiResolveURL('RECORD','inventoryadjustment',id,'EDIT');
	var info = "Inventory Adjustment for the stock deduction is created based on " + recSR.getFieldValue('name') + "<br/>Please click ";
	info += '<a href="' + BillURL + '"><b><u> Inventory Adjustment </u></b></a>';
	info += ' to redirect to the created Inventory Adjustment';
	response.write(info);
}