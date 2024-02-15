function Schedule_POS_UpdateStock_INV()
{
	checkGovernance();
	Logout();
	checkGovernance();
	var LoginRes = Login();
checkGovernance();
	// CheckError();
	
	//Product_Modify_J
	var url = "https://5d18-210-6-231-122.ngrok-free.app/erunapi_imperial_test/api.asmx/Product_UpdateStock";
	// https://1882-118-140-205-250.ngrok-free.app/erunapi_imperial_test/api.asmx
  //https://de16-210-6-231-122.ngrok-free.app/erunapi_imperial_test/api.asmx
  //https://5d18-210-6-231-122.ngrok-free.app/erunapi_imperial_test/api.asmx
	
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/json","cookie": LoginRes};
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custbody_sync_pos', null, 'is', 'T');
	filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	
	filters[2] = new nlobjSearchFilter('custbody_if_pos_flag', null, 'is', 'F');
//	filters[3] = new nlobjSearchFilter('custcol_pos_status', null, 'noneof', 1);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('internalid').setSort();;
//	columns[1] = new nlobjSearchColumn('item');
	//columns[2] = new nlobjSearchColumn('quantity');
	//columns[3] = new nlobjSearchColumn('custitem_barcode', 'item');
	//columns[4] = new nlobjSearchColumn('linesequencenumber');
	columns[1] = new nlobjSearchColumn('type');
//	columns[6] = new nlobjSearchColumn('quantityshiprecv');
//	columns[7] = new nlobjSearchColumn('custcol_pos_status');
checkGovernance();
	var search = nlapiCreateSearch('invoice', filters, columns);
  //customsearch653
checkGovernance();
//var search = nlapiCreateSearch('itemfulfillment', filters, columns);
checkGovernance();
	var resultSet = search.runSearch();
	checkGovernance();
	var indexID = 0;
	do{
		checkGovernance();
		var result = resultSet.getResults(indexID, indexID+999);
		checkGovernance();
		if(result[0])
		{
			for(var i=0; i < result.length; i++)
			{
				checkGovernance();
				nlapiLogExecution('error', 'type', result[i].getValue(columns[1]));
				nlapiLogExecution('error', 'internalid', result[i].getValue(columns[0]));
				// nlapiLogExecution('debug',result[i].getValue(columns[7]));
	
				var type='';
				var line = '';
				var linequantity = '';
				if(result[i].getValue(columns[1]) == 'InvAdjst')
				{
					type = 'inventoryadjustment';
					line = 'inventory';
					linequantity = 'adjustqtyby';
				}
				else if(result[i].getValue(columns[1]) == 'ItemRcpt')
				{
					type = 'itemreceipt';
					line = 'item';
					linequantity = 'quantity';
				}
				else if(result[i].getValue(columns[1]) == 'ItemShip')
				{
					type = 'itemfulfillment';
					line = 'item';
					linequantity = 'quantity';
				}
				else if(result[i].getValue(columns[1]) == 'CustInvc')
				{
					type = 'invoice';
					line = 'item';
					linequantity = 'quantity';
				}
				checkGovernance();
				var rec = nlapiLoadRecord(type, result[i].getId());
              checkGovernance();
				var flag = false;
				for(var k=1; k<=rec.getLineItemCount(line) ; k++)
			//	nlapiLogExecution('debug', 'count', rec.getLineItemCount(line));
				//	for(var k=1; k<=rec.getLineItemCount(line) ; k++)
				if(rec.getLineItemValue(line, 'custcol_pos_status', k)!=1)
				{
					var stockUpdate = {};
					checkGovernance();
					stockUpdate.SN = nlapiLookupField('location',rec.getFieldValue('location'),'custrecordlocationposid');
					checkGovernance();
					var itemid = rec.getLineItemValue(line, 'item', k);
					if(itemid == 513)
					{
						itemid = rec.getLineItemValue(line, 'custcolposremarks', k);
					}
					
					var barcode = nlapiLookupField('item', itemid, 'custitem_barcode');
					// var barcode = nlapiLookupField('item', rec.getLineItemValue(line, 'item', k), 'custitem_barcode');
					checkGovernance();
					stockUpdate.BC = barcode;
					if(type=='itemfulfillment' || type=='invoice')
						stockUpdate.QU = (rec.getLineItemValue(line, linequantity, k))*(-1);
					else
						stockUpdate.QU = (rec.getLineItemValue(line, linequantity, k));
					nlapiLogExecution('debug', 'stockUpdate.BC',stockUpdate.BC);
					nlapiLogExecution('debug', 'stockUpdate.QU',stockUpdate.QU);
					var requestBody = {};
					requestBody.jStockAdj = stockUpdate;
					checkGovernance();
					if (barcode != null && barcode != 'null' && barcode != '')
					{
						checkGovernance();
						
						
						var response = nlapiRequestURL(url, JSON.stringify(requestBody),header,'POST');
						checkGovernance();
						var responseBody = JSON.parse(response.getBody());
						checkGovernance();
						nlapiLogExecution('debug', 'responseBody', response.getBody());
						nlapiLogExecution('debug', 'responseBodyd', responseBody['d']);
						if(responseBody['d'] == 'success')
							rec.setLineItemValue(line, 'custcol_pos_status', k, 1);
						else
						{
							rec.setLineItemValue(line, 'custcol_pos_status', k, 2);
							flag = true;
						}
						
					}
					else
					{
						rec.setLineItemValue(line, 'custcol_pos_status', k, 1);
					}						
				}
					if(flag == false)
					rec.setFieldValue('custbody_if_pos_flag','T');
              checkGovernance();
					nlapiSubmitRecord(rec);
				checkGovernance();
				indexID++;
			}
		}
		else
		{
			nlapiLogExecution('debug', 'no result');
		}
	}while(result.length>=999)
	
}

function Login()
{
	// Login URL
	var LoginURL = "https://5d18-210-6-231-122.ngrok-free.app/erunapi_imperial_test/api.asmx/System_Login?sUsername=999&sPassword=999"
	var LoginResponse = nlapiRequestURL(LoginURL,null,null,'GET');
	checkGovernance();
	// var LoginBody = LoginResponse.getBody();
	var LoginBody = LoginResponse.getHeader('Set-Cookie');
	nlapiLogExecution("debug","LoginBody",LoginBody);
	return LoginBody;
}
function Logout()
{
	// Logout URL
	var LogoutURL = "https://5d18-210-6-231-122.ngrok-free.app/erunapi_imperial_test/api.asmx/System_LogoutUser?sUsername=999"
	var LogoutResponse = nlapiRequestURL(LogoutURL,null,null,'GET');
	checkGovernance();
	var LogoutBody = LogoutResponse.getBody();
	nlapiLogExecution("debug","LogoutBody",LogoutBody);
}

function checkGovernance()
{
	var myGovernanceThreshold = 100;
	var context = nlapiGetContext();
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
