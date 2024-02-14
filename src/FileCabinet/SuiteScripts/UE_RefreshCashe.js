function beforeLoadScript(type, form, request) 
{
	nlapiLogExecution('debug', 'type', type);
	if(type == 'create')
	{
		form.setScript('customscript_cs_refreshcashe'); //reference the Client SuiteScript
		form.setScript('customscript_ue_refreshcashe');
		// RefreshCache1();
		// nlapiLogExecution('debug', 'refreshed', '');
		
		form.addButton('custpage_clearthatcache', 'Refresh Cache', 'RefreshCache1()' ); //add button
	}
}

function RefreshCache1()
{
	nlapiLogExecution('debug', 'button clicked', '');
	nlapiLogExecution('debug', 'start');
	var status1 = nlapiScheduleScript('customscript_schedule_so_inv',null,param);
						nlapiLogExecution('debug', 'status', status1);
	{
		
		{
			
			{
				var SOid = nlapiGetFieldValue('createdfrom');
				nlapiLogExecution('debug', 'SOid', SOid);
				var SOnum = nlapiGetFieldText('createdfrom');
				nlapiLogExecution('debug', 'SOnum', SOnum);
				if(SOnum)
				{
					if(SOnum.substring(0,5) == 'Sales')
					{
						var param = new Array();
						param['custscript2'] = SOid;
						nlapiLogExecution('debug', "param['custscript2']aa",param['custscript2']);
						var status1 = nlapiScheduleScript('customscript_schedule_so_inv',null,param);
						nlapiLogExecution('debug', 'status', status1);
						
					}
				}
			}
		}
	}
	nlapiLogExecution('debug', 'end');
	
	RefreshCache();
	nlapiLogExecution('debug', 'refreshed', '');
	
	
}