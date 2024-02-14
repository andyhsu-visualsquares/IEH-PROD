function RCGeneration(type)
{
//	if(type!='delete')
	if(type == 'view')
	{
      	
		form.setScript('customscriptue_rcgeneration');
    //  	if(nlapiGetFieldValue('custrecordrcgeneratorstatus')==3)
      	form.addButton('custpage_Add1','Generation',"fxn_gen();");
		nlapiLogExecution('debug','Button Add');
	}
}

function fxn_gen()
{
	var GenURL = nlapiResolveURL('SUITELET','customscript_suitlet_rcgeneration','customdeploy_suitlet_rcgeneration',false);
	
	GenURL += '&id=' + nlapiGetRecordId();

	newWindow = window.open(GenURL);
	nlapiLogExecution('debug','Redeem Code Start Generating');
    nlapiSubmitField('customrecordrcgenerator',nlapiGetRecordId(),'custrecordrcgeneratorstatus',1);
}
