function QuoPrint(type)
{
	if(type != 'delete' && type != 'edit')
	{
		form.setScript('customscriptue_quoprint');
      	form.addButton('custpage_Add0','Preview Quotation PDF',"fxn_gen0();");
		nlapiLogExecution('debug','Button Add');
	}
}

function fxn_gen0()
{
	var GenURL = nlapiResolveURL('SUITELET','customscript_suitlet_quo_print','customdeploy_suitlet_quo_print',false);
	
	GenURL += '&id=' + nlapiGetRecordId();

	newWindow = window.open(GenURL);
	nlapiLogExecution('debug','Quotation Start Printing');
}
