function Suitelet_SO_assignCode()
{
	var recId = request.getParameter('id');
	var trantype = request.getParameter('trantype');
	var param = new Array();
		param['custscript_soid1'] = recId;
  		param['custscript_trantype'] = trantype;
		nlapiLogExecution('debug', 'script step3',trantype);
		nlapiScheduleScript('customscript_schedule_so_inventorydetail',null,param);
  response.write("Assigning...")
}