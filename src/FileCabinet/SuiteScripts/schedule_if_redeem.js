function schedule_if_redeem()
{
	var ifid = nlapiGetContext().getSetting('SCRIPT', 'custscript_ifid');
   nlapiLogExecution('debug','ifid',ifid)
	IF_fulfillcode(ifid);
  nlapiLogExecution('debug','ifid',ifid)
}


