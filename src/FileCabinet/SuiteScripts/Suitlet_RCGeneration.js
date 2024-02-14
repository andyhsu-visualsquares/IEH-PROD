function Suitlet_rcgeneration(request, response)
{
	var info = 'Code(s) is/are sending out in the background. Please closed this page.';
	response.write(info);
	var recId = request.getParameter('id');
	var params = new Array();
//	var recId = nlapiGetRecordId();
	nlapiLogExecution('debug', 'recId', recId);
	params['custscript_Genid'] = recId;
	nlapiScheduleScript('customscript_schedule_rcgeneration','customdeploy_schedule_epayment_email', params);
}