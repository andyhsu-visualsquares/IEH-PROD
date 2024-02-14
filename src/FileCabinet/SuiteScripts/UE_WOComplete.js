function WO_Complete(type)
{
	if(type != 'delete' && type == 'view')
	{
		var ready2Sales = nlapiGetFieldValue('custbodyready2sales');
		var converted = nlapiGetFieldValue('custbodyassconversiontransacti');
		
		if(!converted)
		{
			form.setScript('customscriptue_wocomplete');
			form.addButton('custpage_Add1','Convert to Sales Item',"fxn_gen();");
			nlapiLogExecution('debug','Button Add');
		}
	}
}

function fxn_gen()
{
	var BuildURL = nlapiResolveURL('SUITELET','customscript_suitlet_wocomplete','customdeploy_suitlet_wocomplete',false);
	
	BuildURL += '&id=' + nlapiGetRecordId();

	newWindow = window.open(BuildURL);
	nlapiLogExecution('debug','WO Completion Ran');
}
