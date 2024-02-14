function Quo2Profrom(type)
{
	if(type != 'delete' && type != 'edit')
	{
		var approval = nlapiGetFieldValue('custbody_approval_status');
		if(approval == 4)
		{
			form.setScript('customscriptue_quo2proform');
			form.addButton('custpage_Add1','Generate Proforma Invoice',"fxn_gen1();");
			nlapiLogExecution('debug','Button Add');
		}
	}
}

function fxn_gen1()
{
	var GenURL = 'https://5112262.app.netsuite.com/app/accounting/transactions/estimate.nl?memdoc=0&transform=opprtnty&e=T&id=';
	
	GenURL += nlapiGetRecordId();
	GenURL += '&whence=';

	newWindow = window.open(GenURL);
	nlapiLogExecution('debug','Quotation Generating');
}
