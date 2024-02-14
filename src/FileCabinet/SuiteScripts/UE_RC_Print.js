function RCPrint(type)
{
	if(type!='delete')
	{
		form.setScript('customscriptue_rcprint');
      	form.addButton('custpage_Add1','Preview QR Code',"fxn_gen();");
		nlapiLogExecution('debug','Button Add');
	}
}

function fxn_gen()
{
	var GenURL = nlapiResolveURL('SUITELET','customscript_suitlet_re_print','customdeploy_suitlet_re_print',false);
	
	GenURL += '&id=' + nlapiGetRecordId();

	newWindow = window.open(GenURL);
	nlapiLogExecution('debug','Redeem Code Start Printing');
}
