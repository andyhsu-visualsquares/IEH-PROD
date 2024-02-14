function CS_ProformaInvoice_PageInit()
{
	nlapiLogExecution('debug', 'script start');
	var OppID = nlapiGetFieldValue('opportunity');
	nlapiLogExecution('debug', 'OppID', OppID);
	if (OppID) 
	{
		var recOpp = nlapiLoadRecord('opportunity',OppID);
		nlapiLogExecution('debug', 'Opp Loaded', OppID);
		var OppStatus = recOpp.getFieldValue('custbody_approval_status');
		nlapiLogExecution('debug', 'OppStatus', OppStatus);
		if(OppStatus != 4)
		{
			alert("Quotation have not been approved.");
		}
	}
	nlapiLogExecution('debug', 'script end');
}

function CS_ProformaInvoice_SaveRecord()
{
	nlapiLogExecution('debug', 'script start');
	var OppID = nlapiGetFieldValue('opportunity');
	nlapiLogExecution('debug', 'OppID', OppID);
	if (OppID) 
	{
		var recOpp = nlapiLoadRecord('opportunity',OppID);
		nlapiLogExecution('debug', 'Opp Loaded', OppID);
		var OppStatus = recOpp.getFieldValue('custbody_approval_status');
		nlapiLogExecution('debug', 'OppStatus', OppStatus);
		if(OppStatus != 4)
		{
			alert("Quotation have not been approved.");
			return false;
		}
	}
	nlapiLogExecution('debug', 'script end');
	return true;
}