function UE_Auto999999_AS(type)
{
	if(type=='create' || type=='edit')
    //if(type=='create')
    {
      var executeid = nlapiGetRecordId();
      var context = nlapiGetContext();
      var params = new Array();
      params['custscript_executeid'] = executeid;
      nlapiScheduleScript('customscriptschedule_auto999999',null, params);
    }
	nlapiLogExecution('debug', 'executed');
}