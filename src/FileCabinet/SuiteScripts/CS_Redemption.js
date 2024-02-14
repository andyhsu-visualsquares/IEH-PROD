function CS_FieldChange(type, name)
{
	if(name == 'custrecordredeemproduct' && type == 'recmachcustrecordredemptionmain')
	{
		var itemId = nlapiGetCurrentLineItemValue('recmachcustrecordredemptionmain','custrecordredeemproduct');
		nlapiLogExecution('debug', 'itemId', itemId);
		if(itemId)
		{
			var recItem = nlapiLoadRecord('lotnumberedinventoryitem',itemId);
			var EngName = recItem.getFieldValue('custitem_bilingual_name');
			var ChiName = recItem.getFieldValue('stockdescription');
			nlapiSetCurrentLineItemValue('recmachcustrecordredemptionmain','custrecordredemptionsublistchiprodname', ChiName);
			nlapiSetCurrentLineItemValue('recmachcustrecordredemptionmain','custrecordredeemproductname', EngName);
		}
	}
}
function CS_PostSource(type, name)
{
	if(name == 'custrecordredeemvouchercode' && type == 'recmachcustrecordredemptionmain')
	{
		var VcodeID = nlapiGetCurrentLineItemValue('recmachcustrecordredemptionmain','custrecordredeemvouchercode');
		nlapiLogExecution('debug', 'VcodeID', VcodeID);
		if(VcodeID)
		{
			var recVcode = nlapiLoadRecord('customrecordrcmaster',VcodeID);
			var inactive = recVcode.getFieldValue('isinactive');
			var notEffective = recVcode.getFieldValue('custrecordredeemcodenoteffective');
			var vhrItem = recVcode.getFieldValue('custrecordrcmastervoucheritem');
			nlapiLogExecution('debug', 'vhrItem', vhrItem);
			var itemname = nlapiLookupField('item',vhrItem, 'itemid');
			nlapiLogExecution('debug', 'itemname', itemname);
			var phy = itemname.substring(0, 4);
			if(phy != 'MVAG' && phy != 'VVAG')
			{
				nlapiSetCurrentLineItemValue('recmachcustrecordredemptionmain','custrecordredemptionsubphy', 'T');
			}
			
			if(inactive == 'T' || notEffective == 'T')
			{
				nlapiSetCurrentLineItemValue('recmachcustrecordredemptionmain','custrecordredemptioncodeinactive', 'T');
			}
		}
	}
}

function CS_saveRecord()
{
	var lineCount = nlapiGetLineItemCount('recmachcustrecordredemptionmain');
	var memo = '';
	var error = 0;
	for (var x = 1; x <= lineCount; x ++)
	{
		var used = nlapiGetLineItemValue('recmachcustrecordredemptionmain','custrecordredeemcodeused',x);
		var inactive = nlapiGetLineItemValue('recmachcustrecordredemptionmain','custrecordredemptioncodeinactive',x);
		var redemptDatetime = nlapiGetLineItemValue('recmachcustrecordredemptionmain','custrecordredeptiondatetime',x);
		var phy = nlapiGetLineItemValue('recmachcustrecordredemptionmain','custrecordredemptionsubphy',x);
		if (used == 'T')
		{
			memo += 'Voucher line ' + x + ' is used at ' + redemptDatetime + ' . \n';
			error = 1;
		}
		if (inactive == 'T')
		{
			memo += 'Voucher line ' + x + ' is inactive. \n';
			error = 1;
		}
		if (phy == 'T')
		{
			memo += 'Voucher line ' + x + ' is Physical. \n';
			error = 1;
		}
		var Vcode =  nlapiGetLineItemValue('recmachcustrecordredemptionmain','custrecordredeemvouchercode',x);
		if(x > 1)
		{
			for (var y = 1; y < x; y ++)
			{
				var Vcode0 =  nlapiGetLineItemValue('recmachcustrecordredemptionmain','custrecordredeemvouchercode',y);
				if(Vcode0 == Vcode)
				{
					memo += 'Voucher line ' + y + ' and ' + x + ' are repeated. \n';
					error = 1;
				}
			}
		}
	}
	if (error ==1) 
	{
		memo += 'Please remove the Error line(s)!';
		alert(memo);
		return false;
	}
	return true;
} 

function CS_LineValid()
{
	var memo = '';
	memo += 'Press save to confirm redeem!\n';
	memo += '按Save完成兌換!';
	alert(memo);

	return true;
} 