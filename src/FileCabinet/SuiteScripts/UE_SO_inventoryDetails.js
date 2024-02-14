function fxn_gen()
{
	nlapiLogExecution('debug', 'Script Start');
	var auto = nlapiGetFieldValue('custbodyautoassignlot');
	if(auto == 'T')
	{
		
		var SOID = nlapiGetRecordId();
		nlapiLogExecution('debug', 'SOID',SOID);
		var param = new Array();
		param['custscript2'] = SOID;
		nlapiLogExecution('debug', "param['custscript2']",param['custscript2']);
		nlapiScheduleScript('customscript_schedule_so_inv','customdeploy_schedule_so_invdet',param);
		nlapiLogExecution('debug', 'script run');

	}
}
