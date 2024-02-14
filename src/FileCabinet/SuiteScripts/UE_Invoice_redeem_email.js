function UE_Invoice_redeem_email(type)
{
	if(type == 'create' && nlapiGetFieldValue('custbodypossalesid'))
//	if(nlapiGetFieldValue('custbodypossalesid'))
	{
	//	var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId());
		var count = nlapiGetLineItemCount('item');
		var flag = false;
		for(var i=1; i<=count; i++)
		{
			var redeemItem = nlapiLookupField('item', nlapiGetLineItemValue('item', 'item',i),'custitemisredeemvoucher');
			nlapiLogExecution('debug', 'redeemItem', redeemItem);
			var redeemEmail = nlapiLookupField('item', nlapiGetLineItemValue('item', 'item',i),'custitemvoucherforemail');
			nlapiLogExecution('debug', 'redeemEmail', redeemEmail);
			if(redeemItem == 'T')
			{
				nlapiSetFieldValue('custbodyincluderedeemvoucher','T');
				flag = true;
				nlapiSetFieldValue('custbody_assign_redeem_code', 1);
			}
			else
				nlapiSetFieldValue('custbodyincluderedeemvoucher','F');
		/*	if(redeemEmail=='T')
				nlapiSetFieldValue('custbodyforemailredeemvoucher','T');
			else
				nlapiSetFieldValue('custbodyforemailredeemvoucher','F');
			*/
		}
		if(flag == false)
			nlapiSetFieldValue('custbodyincluderedeemvoucher','F');
	//	nlapiSubmitRecord(rec);
	}
}

function UE_Invoice_redeem_AS(type)
{
	if(type=='create' && nlapiGetFieldValue('custbodypossalesid'))
//	if(nlapiGetFieldValue('custbodypossalesid'))
	{
		if(nlapiGetFieldValue('custbodyincluderedeemvoucher')=='T'&&nlapiGetFieldValue('custbody_assign_redeem_code')==1)
		{
			nlapiSubmitField('salesorder', nlapiGetRecordId(), 'custbody_assign_redeem_code', 2);
			var param = new Array();
			param['custscript_invoiceid'] = nlapiGetRecordId();
			nlapiScheduleScript('customscript_schedule_invoice_redeem','customdeploy1',param);
			nlapiLogExecution('debug', 'script run');
		}
		
	}
}

