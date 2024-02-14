function UE_IF_redeem_BS(type) {
	nlapiLogExecution('audit', 'entity', nlapiGetFieldValue('entity'));
	if (nlapiGetFieldValue('entity') != 334 && nlapiGetFieldValue('entity') != '' && nlapiGetFieldValue('entity') != null && nlapiGetFieldValue('entity') != 'null') {
		nlapiLogExecution('audit', 'UE_IF_redeem_BS', 'start');
		for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) {
			// var redeemItem = nlapiLookupField('item', nlapiGetLineItemValue('item', 'item',i),'custitemredeemingitem');
			// var redeemValue = nlapiLookupField('item', nlapiGetLineItemValue('item', 'item',i),'custitemredeemingvalue');
			var voucherforemail = nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', i), 'custitemvoucherforemail');
			if (voucherforemail == 'T') {
				nlapiSetFieldValue('custbodyincluderedeemvoucher', 'T');
				nlapiSetFieldValue('custbodyforemailredeemvoucher', 'T');

			}
			if (nlapiGetFieldValue('custbodyincluderedeemvoucher') == 'T')
				nlapiSetFieldValue('custbody_assign_redeem_code', 4);
		}
	}

}



function UE_IF_redeem_AS(type) {
	nlapiLogExecution('audit', 'enter AS');
	if (type != 'delete') {

		nlapiLogExecution('debug', 'voucher', nlapiGetFieldValue('custbodyincluderedeemvoucher'));
		nlapiLogExecution('debug', 'code', nlapiGetFieldValue('custbody_assign_redeem_code'));
		nlapiLogExecution('debug', 'remark', !nlapiGetFieldValue("custbodyredremark"));
		if (nlapiGetFieldValue('custbodyincluderedeemvoucher') == 'T' && nlapiGetFieldValue('custbody_assign_redeem_code') == 4 && nlapiGetFieldValue('custbody_not_assign_code') == 'F' && nlapiGetFieldValue("custbodyvoucheremailtempate") && !nlapiGetFieldValue("custbodyredremark")) {
			nlapiSubmitField('itemfulfillment', nlapiGetRecordId(), 'custbody_assign_redeem_code', 4);
			var param = new Array();
			param['custscript_ifid'] = nlapiGetRecordId();

			var s = nlapiScheduleScript('customscript_schedule_if_redeem', null, param);
			nlapiLogExecution('audit', 'script status', s + nlapiGetRecordId());
		}
		try {
			nlapiSubmitField('salesorder', nlapiGetFieldValue('createdfrom'), 'custbody_item_fulfillment_number', nlapiGetFieldValue('tranid'));
		}
		catch (e) {

		}
	}
}

function UE_IF_email_BL(type) {
	if (type == 'create') {
		// nlapiSetFieldValue('custbodyvoucheremailtempate',9);
		// nlapiSetFieldValue('custbodycoucheremailcontent', nlapiLookupField('customrecordvoucheremailtemplate',9,'custrecordvoucheremailtextarea'));
		// nlapiSetFieldValue('custbodyvoucheremailsubject', nlapiLookupField('customrecordvoucheremailtemplate',9,'custrecordvoucheremailsubject'));

	}
	if (nlapiGetFieldValue('createdfrom'))
		nlapiSetFieldValue('custbody_reference_num', nlapiLookupField('salesorder', nlapiGetFieldValue('createdfrom'), 'otherrefnum'));
}