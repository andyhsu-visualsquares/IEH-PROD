function Suitlet_BillIR(request, response)
{
	
	var IRid = request.getParameter('id');
	
	nlapiLogExecution('debug', 'IRid', IRid);
	var recIR = nlapiLoadRecord('itemreceipt',IRid);
	var BillID = recIR.getFieldValue('custbodybillcreated');
	if(BillID == null || BillID == '' || BillID == 'null')
	{
		var POid = recIR.getFieldValue('createdfrom');
		nlapiLogExecution('debug', 'POid', POid);
		
		
		var IRlineCount = recIR.getLineItemCount('item');
		nlapiLogExecution('debug', 'IRlineCount', IRlineCount);
		
		// var recBill = nlapiTransformRecord('purchaseorder',POid, 'vendorbill' , { recordmode : 'dynamic' });
		var recBill = nlapiTransformRecord('purchaseorder',POid, 'vendorbill');
		recBill.setFieldValue('trandate', recIR.getFieldValue('trandate'));
		for (var x = 1; x <= IRlineCount; x++)
		{
			nlapiLogExecution('debug', 'IR line', x);
			var IRitem = recIR.getLineItemValue('item','item',x);
			var IRitemisLot = nlapiLookupField('item',IRitem,'islotitem');
			nlapiLogExecution('debug', 'IR line ' + x, 'IRitem = ' + IRitem + ' IRitemisLot = ' + IRitemisLot);
			var BilllineCount = recBill.getLineItemCount('item');
			nlapiLogExecution('debug', 'BilllineCount', BilllineCount);
			var startLine = 1;
			for (var y = startLine; y <= BilllineCount; y++)
			{
				nlapiLogExecution('debug', 'Bill line', y);
				var Billitem = recBill.getLineItemValue('item','item',y);
				var BillitemisLot = nlapiLookupField('item',Billitem,'islotitem');
				nlapiLogExecution('debug', 'Bill line ' + x, 'Billitem = ' + Billitem + ' BillitemisLot = ' + BillitemisLot);
				if(IRitem == Billitem)
				{
					if(BillitemisLot == 'T')
					{
						recIR.selectLineItem('item',x);
						var IRsubrec = recIR.viewCurrentLineItemSubrecord('item', 'inventorydetail');
						var IRsubRecLineCount = IRsubrec.getLineItemCount('inventoryassignment');
						for (var a = 1; a <= IRsubRecLineCount; a++)
						{
							IRsubrec.selectLineItem('inventoryassignment', a);
							var IRLotNum = IRsubrec.getCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber');
							var IRLotQty = IRsubrec.getCurrentLineItemValue('inventoryassignment', 'quantity');
							nlapiLogExecution('debug', 'IR Lot line ' + a, 'IRLotNum = ' + IRLotNum + ' IRLotQty = ' + IRLotQty);

							// recBill.setLineItemValue('item','quantity',y, IRLotQty);
							
							recBill.selectLineItem('item',y);
							recBill.setCurrentLineItemValue('item','quantity', IRLotQty);
							// recBill.removeCurrentLineItemSubrecord('item', 'inventorydetail');
							// recBill.commitLineItem('item');
							// nlapiLogExecution('debug', 'inventorydetail removed', y);

							// recBill.selectLineItem('item',y);
							
							var subrec = recBill.createCurrentLineItemSubrecord('item', 'inventorydetail');
							var subrecLineCount = subrec.getLineItemCount('inventoryassignment');
							nlapiLogExecution('debug', 'inventorydetail subrecLineCount', subrecLineCount);
							for (var b = subrecLineCount; b >= 1; b--)
							{
								subrec.selectLineItem('inventoryassignment', b);
								var billLot = subrec.getCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber');
								var billQty = subrec.getCurrentLineItemValue('inventoryassignment', 'quantity');
								nlapiLogExecution('debug', 'Bill Lot line ' + b, 'billLot = ' + billLot + ' billQty = ' + billQty);
								if(billLot == IRLotNum)
								{
									subrec.setCurrentLineItemValue('inventoryassignment', 'quantity',IRLotQty);
									subrec.commitLineItem('inventoryassignment');
								}
								else
								{
									// subrec.commitLineItem('inventoryassignment');
									subrec.removeLineItem('inventoryassignment',b);
								}
								
							}
							// subrec.selectNewLineItem('inventoryassignment');
							// subrec.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', IRLotNum);
							// subrec.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', IRLotNum);
							// subrec.setCurrentLineItemValue('inventoryassignment', 'quantity', IRLotQty);
							// subrec.commitLineItem('inventoryassignment');
							subrec.commit();
							
							nlapiLogExecution('debug', 'inventorydetail created', y);
							recBill.commitLineItem('item');
							
							recBill.setLineItemValue('item','custcolbillirmatched',y,'T');
							
						}
						startLine = y;
						break;
					}
					else
					{
						recBill.setLineItemValue('item','quantity', y, recIR.getLineItemValue('item','quantity',x));
						recBill.setLineItemValue('item','custcolbillirmatched',y,'T');
					}
				}
			}
		}
		var BilllineCount = recBill.getLineItemCount('item');
		nlapiLogExecution('debug', 'BilllineCount', BilllineCount);
		for (var z = BilllineCount; z >= 1; z--)
		{
			var matched = recBill.getLineItemValue('item','custcolbillirmatched',z);
			if(matched != 'T')
			{
				recBill.removeLineItem('item',z);
				nlapiLogExecution('debug', 'Removed', z);
			}
			else
			{
				
				var Billitem = recBill.getLineItemValue('item','item',z);
				var BillitemisLot = nlapiLookupField('item',Billitem,'islotitem');
				if(BillitemisLot == 'T')
				{
				
					recBill.selectLineItem('item',z);
					var Billsubrec = recBill.viewCurrentLineItemSubrecord('item', 'inventorydetail');
					var BillsubRecLineCount = Billsubrec.getLineItemCount('inventoryassignment');
					nlapiLogExecution('debug', 'BillsubRecLineCount', BillsubRecLineCount);
					for (var c = 1; c <= BillsubRecLineCount; c++)
					{
						Billsubrec.selectLineItem('inventoryassignment', c);
						var BillLotNum = Billsubrec.getCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber');
						var BillLotQty = Billsubrec.getCurrentLineItemValue('inventoryassignment', 'quantity');
						nlapiLogExecution('debug', 'Bill Lot line ' + c, 'BillLotNum = ' + BillLotNum + ' BillLotQty = ' + BillLotQty);
					}
				}
			}
		}
		
		
		recBill.setFieldValue('custbodyfromitemreceive',IRid);
		var BillID = nlapiSubmitRecord(recBill);
		nlapiSubmitField('itemreceipt',IRid,'custbodybillcreated',BillID);
	}
	
	var BillURL = nlapiResolveURL('RECORD','vendorbill',BillID);
	var info = "Vendor Bill is created based on " + recIR.getFieldValue('tranid') + "<br/>Please click ";
	info += '<a href="' + BillURL + '"><b><u> Vendor Bill </u></b></a>';
	info += ' to redirect to the created vendor bill';
	response.write(info);
}