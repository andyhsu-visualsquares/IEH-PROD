function UE_SO_assignCode_BL(type)
{
	if(type=='view' && nlapiGetFieldValue('custbodyautoassignlot')=='F')
	{
		form.setScript('customscript_ue_so_assigncode');
		form.addButton('custpage_assigncode', 'Assign Code', 'assigncode()' );
	}
}

function assigncode()
{
	var POURL = nlapiResolveURL('SUITELET','customscript_suitelet_so_assigncode','customdeploy_suitelet_so_assigncode',false);
	
	var trantype = nlapiGetRecordType();
	
	POURL += '&id=' + nlapiGetRecordId()+'&trantype='+trantype;

	newWindow = window.open(POURL);
}