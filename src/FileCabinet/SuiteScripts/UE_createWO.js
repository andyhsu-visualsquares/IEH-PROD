function createWO(type)
{
	if(type == 'view')
	{
		var subsidiary = nlapiGetFieldValue('subsidiary');
		var WOcreated = nlapiGetFieldValue('custbodywogenerated');
		var SOstatus = nlapiGetFieldValue('orderstatus');
		nlapiLogExecution('debug','Para', "subsidiary: " + subsidiary + ', WOcreated: ' + WOcreated + ', SOstatus: ' + SOstatus);
		
		if (subsidiary == 11 && WOcreated == 'F' && SOstatus == 'B')
		{
			form.setScript('customscriptue_createwo');
			form.addButton('custpage_Add1','Create Work Order',"fxn_gen();");
			nlapiLogExecution('debug','Button Add');
		}
	}
}

function fxn_gen()
{
	var WOURL = nlapiResolveURL('SUITELET','customscript_suitlet_createwo','customdeploy_suitlet_createwo',false);
	
	WOURL += '&id=' + nlapiGetRecordId();

	newWindow = window.open(WOURL);
	nlapiLogExecution('debug','WO Creation Ran');
}
