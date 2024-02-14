function UE_itemDiscount(type)
{
	if(type !='delete')
	{
		nlapiLogExecution('debug', nlapiGetRecordType());
		if(nlapiGetRecordType()=='estimate')
		{
			var discountSearch = nlapiLoadSearch('estimate','customsearch_quotation_discount');
			var filters = new Array();
		//	filters[0] = new nlobjSearchFilter('type', null, 'anyof', 'estimate');
			filters[0] = new nlobjSearchFilter('internalid', null, 'is', nlapiGetRecordId());
			discountSearch.addFilters(filters);
			var result = discountSearch.runSearch().getResults(0,1);
			if(result[0])
			{
				var columns = result[0].getAllColumns();
				var flag = result[0].getValue(columns[0]);
				nlapiLogExecution('debug', 'flag', flag);
				if(flag > 0)
					nlapiSubmitField('estimate', nlapiGetRecordId(), 'custbody_two_level_approval','F');
				else
					nlapiSubmitField('estimate', nlapiGetRecordId(), 'custbody_two_level_approval','F');
			}
          else
            nlapiSubmitField('estimate', nlapiGetRecordId(), 'custbody_two_level_approval','F');
			
			var quoterec = nlapiLoadRecord('estimate', nlapiGetRecordId());
			var discountSearch = nlapiLoadSearch('estimate','customsearch_quotation_print');
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
					quoterec.selectLineItem('item', lineid);
                  	if(quoterec.getCurrentLineItemValue('item','custcol_base_price') == null || quoterec.getCurrentLineItemValue('item','custcol_base_price') == 'null' || quoterec.getCurrentLineItemValue('item','custcol_base_price') == '')
                      {
					quoterec.setCurrentLineItemValue('item','custcol_base_price',result[i].getValue(columns[3]));
					quoterec.setCurrentLineItemValue('item','custcol_discount_percentage',result[i].getValue(columns[7]));
                    quoterec.setCurrentLineItemValue('item','custcol_net_amount',result[i].getValue(columns[5]));
                      }
					quoterec.commitLineItem('item')
				}
				nlapiSubmitRecord(quoterec,true);
			}
			
			var itemCount = nlapiGetLineItemCount('item');
			for(var j = 1; j <= itemCount; j++)
			{
				var itemtype = nlapiGetLineItemValue('item','itemtype',j);
				nlapiLogExecution('debug', 'itemtype', itemtype);
				if(itemtype == 'NonInvtPart')
				{
					var recitem = nlapiLoadRecord('noninventoryitem',nlapiGetLineItemValue('item','item',j));
					var opit = recitem.getFieldValue('custitemopenitem');
					if(opit == 'T')
					{
						var itemDis = nlapiGetLineItemValue('item','custcol_discount_percentage',j);
						nlapiLogExecution('debug', 'itemDis', itemDis);
						if(parseFloat(itemDis) > 50)
						{
							nlapiSubmitField('estimate', nlapiGetRecordId(), 'custbody_two_level_approval','F');
						}
					}
				}
			}
			
			
		}
		else if(nlapiGetRecordType()=='opportunity')
		{
			var discountSearch = nlapiLoadSearch('transaction','customsearch_opp_discount');
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
					nlapiSubmitField('opportunity', nlapiGetRecordId(), 'custbody_two_level_approval','F');
				else
					nlapiSubmitField('opportunity', nlapiGetRecordId(), 'custbody_two_level_approval','F');
			}
          else
            nlapiSubmitField('opportunity', nlapiGetRecordId(), 'custbody_two_level_approval','F');
			
			var sorec = nlapiLoadRecord('opportunity', nlapiGetRecordId());
			
			var discountSearch = nlapiLoadSearch('transaction','customsearch_opp_print');
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
}

