function UE_SO_redeem_email(type)
{
	if(type!='delete')
	{
	//	var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId());
		var count = nlapiGetLineItemCount('item');
		var flag = false;
      var emailflag = false;
		for(var i=1; i<=count; i++)
		{
			if(nlapiGetLineItemValue('item','itemtype',i) == 'InvtPart' ||nlapiGetLineItemValue('item','itemtype',i) == 'NonInvtPart')
              {
          var fields = ['custitemisredeemvoucher','custitemvoucherforemail']
		//	var redeemItem = nlapiLookupField('item', nlapiGetLineItemValue('item', 'item',i),'custitemisredeemvoucher');
			nlapiLogExecution('debug', 'redeemItem', redeemItem);
		//	var redeemEmail = nlapiLookupField('item', nlapiGetLineItemValue('item', 'item',i),'custitemvoucherforemail');
		var columns1 = nlapiLookupField('item',nlapiGetLineItemValue('item', 'item',i),fields);
		var redeemItem = columns1.custitemisredeemvoucher;
		var redeemEmail = columns1.custitemvoucherforemail;
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
			nlapiSetFieldValue('custbodyincluderedeemvoucher','F');
      else
        nlapiSetFieldValue('custbodyincluderedeemvoucher','T');
      if(emailflag == false)
			nlapiSetFieldValue('custbodyforemailredeemvoucher','F');
      else
        nlapiSetFieldValue('custbodyforemailredeemvoucher','T');
	//	nlapiSubmitRecord(rec);
	}
	}
}

function UE_SO_redeem_AS(type)
{
	if(type !='delete')
	{
		{
			var discountSearch = nlapiLoadSearch('salesorder','customsearch_sales_discount');
			var filters = new Array();
		//	filters[0] = new nlobjSearchFilter('type', null, 'anyof', 'estimate');
			filters[0] = new nlobjSearchFilter('internalid', null, 'is', nlapiGetRecordId());
			discountSearch.addFilters(filters);
			var result = discountSearch.runSearch().getResults(0,1);
			if(result[0])
			{
				var columns = result[0].getAllColumns();
				var flag = result[0].getValue(columns[0]);
				nlapiLogExecution('debug', flag);
				if(flag > 0)
					nlapiSubmitField('salesorder', nlapiGetRecordId(), 'custbody_two_level_approval','F');
				else
					nlapiSubmitField('salesorder', nlapiGetRecordId(), 'custbody_two_level_approval','F');
			}
          else
            nlapiSubmitField('salesorder', nlapiGetRecordId(), 'custbody_two_level_approval','F');
			
			var sorec = nlapiLoadRecord('salesorder', nlapiGetRecordId());
			
			var discountSearch = nlapiLoadSearch('salesorder','customsearch_sales_discount_print');
			var filters = new Array();
		//	filters[0] = new nlobjSearchFilter('type', null, 'anyof', 'estimate');
			filters[0] = new nlobjSearchFilter('internalid', null, 'is', nlapiGetRecordId());
			discountSearch.addFilters(filters);
			var result = discountSearch.runSearch().getResults(0,200);
			
			  
			if(result[0])
			{
              var columns = result[0].getAllColumns();
				for(var i=0; i<result.length; i++)
				{
					var lineid = result[i].getValue(columns[6]);
					nlapiLogExecution('debug','lineid',lineid);
					sorec.selectLineItem('item', lineid);
                  if(sorec.getCurrentLineItemValue('item','custcol_base_price') == null || sorec.getCurrentLineItemValue('item','custcol_base_price') == 'null' || sorec.getCurrentLineItemValue('item','custcol_base_price') == '')
				  {
					sorec.setCurrentLineItemValue('item','custcol_base_price',result[i].getValue(columns[3]));
					sorec.setCurrentLineItemValue('item','custcol_discount_percentage',result[i].getValue(columns[7]));
                    sorec.setCurrentLineItemValue('item','custcol_net_amount',result[i].getValue(columns[5]));
				  }
					sorec.commitLineItem('item')
				}
				nlapiSubmitRecord(sorec,true);
			}
              
		}
	}
	if(type!='delete' && type!='xedit')
	{
		nlapiLogExecution('debug', 'script start');
		if(nlapiGetFieldValue('custbodyincluderedeemvoucher')=='T'&& (nlapiGetFieldValue('custbody_assign_redeem_code')==1 || !nlapiGetFieldValue('custbody_assign_redeem_code')) && nlapiGetFieldValue('custbody_approval_status')==4)
		{
			nlapiSubmitField('salesorder', nlapiGetRecordId(), 'custbody_assign_redeem_code', 3);
		//  var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId());
		//  rec.setFieldValue('custbody_assign_redeem_code', 2);
		//  nlapiSubmitRecord(rec, true);
			nlapiLogExecution('debug', 'script step2');
		var param = new Array();
		param['custscript1'] = nlapiGetRecordId();
		nlapiLogExecution('debug', 'script step3',param['custscript1']);
		nlapiScheduleScript('customscript_schedule_so_redeem',null,param);
          nlapiLogExecution('debug', 'script run');
		}
		
	}
	
}

