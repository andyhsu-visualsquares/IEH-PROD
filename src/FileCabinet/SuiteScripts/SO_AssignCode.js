function SO_AssignCode(recid)
{
	var rec = nlapiLoadRecord('salesorder', recid);
	nlapiLogExecution('debug','soid', recid);
	checkGovernance();
	var count = rec.getLineItemCount('item');
	var flag = false;
	nlapiLogExecution('audit', 'Assign Redeem Code Start');
	for(var i=1; i<=count; i++)
	{	
		var channel = rec.getFieldValue('cseg1');
		var redeemItem = nlapiLookupField('item', rec.getLineItemValue('item', 'item',i),'custitemredeemingitem');
		checkGovernance();
		var redeemValue = nlapiLookupField('item', rec.getLineItemValue('item', 'item',i),'custitemredeemingvalue');
		checkGovernance();
		nlapiLogExecution('debug', 'redeemItem', redeemItem);
		nlapiLogExecution('debug', 'redeemItem', redeemValue);
		// if(redeemItem || redeemValue)
		if((redeemItem || redeemValue) && (rec.getLineItemValue('item', 'item',i) != '1885' || rec.getFieldValue('entity') ==1537))
		{
			var itemid = rec.getLineItemValue('item', 'item',i);
			var redeemcount = rec.getLineItemValue('item', 'quantity', i);
			var price = rec.getLineItemValue('item','rate', i);
			var flagcount = 0;
		do	{
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecordrcmastervoucheritem', null, 'anyof', itemid);//custrecordrcmastervoucheritem
			filters[1] = new nlobjSearchFilter('custrecordrcmastersalestransaction', null, 'is', '@NONE@');
			filters[2] = new nlobjSearchFilter('custrecordrcmastersentorsold', null, 'is', 'F');
			filters[3] = new nlobjSearchFilter('custrecordrcmasterused', null, 'is', 'F');
			filters[4] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
			if(channel)
			filters[5] = new nlobjSearchFilter('custrecordrcmasterchannel', null, 'anyof', channel);
			var columns = new Array();
			columns[0] = new nlobjSearchColumn('internalid').setSort();
			var search = nlapiCreateSearch('customrecordrcmaster', filters, columns);
			checkGovernance();
            
            
		  //  var search = nlapiLoadSearch('customrecordrcmaster', 'customsearch53');
		//	search.addFilter(filters[0]);
			
			var resultSet = search.runSearch();
			checkGovernance();
			var indexID = 0;
			do{
				var result = resultSet.getResults(indexID,indexID+999);
				checkGovernance();
            	nlapiLogExecution('debug', 'search length', result.length);
				if(result[0])
				{
					for(var k=0; result && k<result.length && flagcount<redeemcount; k++)
					{
						checkGovernance();
						var fields = new Array();
						fields[0] = 'custrecordrcmastersalestransaction';
						fields[1] = 'custrecordrcmaster';
						var values = new Array();
						values[0] = recid;
						values[1] = price;
						nlapiSubmitField('customrecordrcmaster',result[k].getId(), fields, values);
						checkGovernance();
						indexID++;
						flagcount++;
						
					}
					if(flagcount>=redeemcount)
						break;
				}
				else
				{
					nlapiLogExecution('debug', 'no search result');
                  break;
				}
				
			}while(result.length>=999 && flagcount>0);
		}while(redeemcount>flagcount && flagcount>0);
			nlapiLogExecution('audit', 'Assgin Redeem to this item Finished');
		}
	}

		nlapiLogExecution('audit', 'Redeem Code Task Complete');
	/*	checkGovernance();
			var count = rec.getLineItemCount('item');
			nlapiLogExecution('audit', count, recid);
		var flag = false;
      var emailflag = false;
	  var custbodyincluderedeemvoucher;
	  var custbodyforemailredeemvoucher;
		for(var i=1; i<=count; i++)
		{
			var redeemItem = nlapiLookupField('item', rec.getLineItemValue('item', 'item',i),'custitemisredeemvoucher');
			nlapiLogExecution('debug', 'redeemItem', redeemItem);
			var redeemEmail = nlapiLookupField('item', rec.getLineItemValue('item', 'item',i),'custitemvoucherforemail');
			nlapiLogExecution('debug', 'redeemEmail', redeemEmail);
			if(redeemItem == 'T')
			{
			//	nlapiSetFieldValue('custbodyincluderedeemvoucher','T');
				flag = true;
			}
		//	else
		//		nlapiSetFieldValue('custbodyincluderedeemvoucher','F');
			if(redeemEmail=='T')
			//	nlapiSetFieldValue('custbodyforemailredeemvoucher','T');
			 emailflag = true;
		//	else
		//		nlapiSetFieldValue('custbodyforemailredeemvoucher','F');
		}
		if(flag == false)
			custbodyincluderedeemvoucher = 'F';
      else
        custbodyincluderedeemvoucher = 'T';
      if(emailflag == false)
			custbodyforemailredeemvoucher = 'F';
      else
       custbodyforemailredeemvoucher = 'T';
		
		var fields = new Array();
		var values = new Array();
		fields[0] = 'custbodyincluderedeemvoucher',
		values[0] = custbodyincluderedeemvoucher;
		fields[1] = 'custbodyforemailredeemvoucher';
		values[1] = custbodyforemailredeemvoucher;
		fields[2] = 'custbody_assign_redeem_code';
		values[2] = 3;
		
	//	nlapiLogExecution('audit', 'recid', recid);
	//	nlapiSubmitField('salesorder', recid, fields, values);
	//	nlapiSubmitField('salesorder', recid, 'custbody_assign_redeem_code',3);
	//	nlapiSubmitField('salesorder', recid, 'custbodyincluderedeemvoucher','T');
	//	nlapiSubmitField('salesorder', recid, 'custbodyforemailredeemvoucher','T');
	*/
//	var rec = nlapiLoadRecord('salesorder', recid);
//	checkGovernance();
//	rec.setFieldValue('custbody_assign_redeem_code',3);
//	nlapiSubmitRecord(rec,true);
	checkGovernance();
}

function checkGovernance()
{
	var myGovernanceThreshold = 300;
	var context = nlapiGetContext();
  	nlapiLogExecution('debug', 'remainingUsage',context.getRemainingUsage());
	if( context.getRemainingUsage() < myGovernanceThreshold )
	{
		var state = nlapiYieldScript();
		if( state.status == 'FAILURE')
	{
		nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
		throw "Failed to yield script";
	} 
		else if ( state.status == 'RESUME' )
	{
		nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
	}
		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
	}
}