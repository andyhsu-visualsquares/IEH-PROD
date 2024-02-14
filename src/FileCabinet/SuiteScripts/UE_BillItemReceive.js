function UE_ItemReceive_BL(type)
{
	if(type != 'delete' && type == 'view')
	{
		
		if(nlapiGetFieldValue('custbodybillcreated') == null || nlapiGetFieldValue('custbodybillcreated') == '' || nlapiGetFieldValue('custbodybillcreated') == 'null')
		{
			var createdfrom = nlapiGetFieldValue('createdfrom');
			if (createdfrom)
			{
				var isPO = nlapiGetFieldText('createdfrom').substring(0,2);
				// nlapiLogExecution('debug','isPO',isPO);
				if(isPO == 'Pu')
				{
					form.setScript('customscriptue_billitemreceive');
					form.addButton('custpage_Add1','Bill This Item Receive',"fxn_gen();");
					// nlapiLogExecution('debug','Button Add');
				}
			}
		}
	}
}

function fxn_gen()
{
	var BillURL = nlapiResolveURL('SUITELET','customscript_suitelet_billir','customdeploy_suitelet_billir',false);
	
	BillURL += '&id=' + nlapiGetRecordId();

	newWindow = window.open(BillURL);
	nlapiLogExecution('debug','Bill IR Ran');
	
}