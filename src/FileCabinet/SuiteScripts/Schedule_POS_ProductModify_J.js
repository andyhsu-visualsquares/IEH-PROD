function Schedule_POS_ProductModify_J_Post()
{	
	Logout();
	var LoginRes = Login();

	// CheckError();
	
	//Product_AddNew_J
	// var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Product_Modify_JV2";
	var url = "https://ithpos.app/erunapi/api.asmx/Product_Modify_JV2";
	
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/json","cookie": LoginRes};
	
	// var searchresults = nlapiSearchRecord('item', 'customsearchcreatetopos_2');
   
   
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'custitemcreatedtopos', null, 'is', true);
	filters[1] = new nlobjSearchFilter( 'isinactive', null, 'is', false);
	// filters[2] = new nlobjSearchFilter( 'internalid', null, 'anyof', '214');
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('itemid');
	columns[1] = new nlobjSearchColumn('custitem_barcode');
	columns[2] = new nlobjSearchColumn('displayname');
	columns[3] = new nlobjSearchColumn('salesdescription');
	columns[4] = new nlobjSearchColumn('baseprice');
	columns[5] = new nlobjSearchColumn('type');
	columns[6] = new nlobjSearchColumn('islotitem');
	columns[7] = new nlobjSearchColumn('class');
	columns[8] = new nlobjSearchColumn('custitem_bilingual_name');
	
	// columns[8] = new nlobjSearchColumn('custrecordposmaincate','class');
	// columns[9] = new nlobjSearchColumn('custrecordpossubcate','class');
	
	
	var itemSearch = nlapiCreateSearch('item', filters, columns);
	checkGovernance();
	var Error_Count = 0;
	var itemSearchresultSet = itemSearch.runSearch();
	var itemSearchresults = itemSearchresultSet.getResults(0,999);
	nlapiLogExecution('error', 'itemSearchresults.length', itemSearchresults.length);
	 checkGovernance();
	 
	if(itemSearchresults)
    {
		for(var i = 0; i < itemSearchresults.length; i++) 
		{
			var recid = itemSearchresults[i].getId();
			nlapiLogExecution('debug', 'itemid', recid);
			var columns = itemSearchresults[i].getAllColumns();
			
			var itemNum = itemSearchresults[i].getValue(columns[0]);
			var UPC = itemSearchresults[i].getValue(columns[1]);
			var DisplayName = itemSearchresults[i].getValue(columns[2]);
			var Desc = itemSearchresults[i].getValue(columns[3]);
			var BasePrice = itemSearchresults[i].getValue(columns[4]);
			var itemType = itemSearchresults[i].getValue(columns[5]);
			var isLotNum = itemSearchresults[i].getValue(columns[6]);
			var Class = itemSearchresults[i].getValue(columns[7]);
			var custitem_bilingual_name = itemSearchresults[i].getValue(columns[8]);
			// var MainCate = itemSearchresults[i].getValue(columns[8]);
			if (Class)
			{
			var MainCate = nlapiLookupField('classification', Class, 'custrecordposmaincate');
			checkGovernance();
			// var SubCate = itemSearchresults[i].getValue(columns[9]);
			var SubCate = nlapiLookupField('classification', Class, 'custrecordpossubcate');
			checkGovernance();
			}
			else
			{
				var MainCate = 7;
				checkGovernance();
				// var SubCate = itemSearchresults[i].getValue(columns[9]);
				var SubCate = 0;
				checkGovernance();
			}
			
			var data = {};
			var jProduct = {};
			
			// jProduct.UBC = itemNum;
			jProduct.BC = UPC;
			jProduct.SEP = BasePrice;
			jProduct.C1 = MainCate;
			jProduct.C1S1 = SubCate;
			jProduct.SN1L = Desc;
			jProduct.SN2L = custitem_bilingual_name;
			jProduct.PN1L = Desc;
			jProduct.PN2L = custitem_bilingual_name;
			// jProduct.LN1L = Desc;
			// jProduct.LN2L = custitem_bilingual_name;

			var requestBody = {};
			requestBody.jProduct = jProduct;
			nlapiLogExecution('debug', 'UPC', UPC);
			// nlapiLogExecution('debug', 'requestBody', requestBody);
			// nlapiLogExecution('debug', 'JSON.stringify(requestBody)', JSON.stringify(requestBody));
			
			var ProductAddNew_J_URL = url;
			var response = nlapiRequestURL(ProductAddNew_J_URL,JSON.stringify(requestBody),header,'POST');
			checkGovernance();
			var ResponseBody = response.getBody();
			nlapiLogExecution("debug","ResponseBody",ResponseBody);
			
			datain = JSON.parse(ResponseBody);
			// nlapiLogExecution('debug','datain',datain);
			var d = datain['d'];
			// nlapiLogExecution("debug","d",d);
			// var error = datain.error;
			// var TXid = datain['TransactionID'];
			checkGovernance();
			CheckError();
			if (d == 'success' || d == '條碼已使用')
			{
				if (itemType == 'InvtPart' && isLotNum == 'T')
				{
					nlapiSubmitField('lotnumberedinventoryitem',recid,'custitemcreatetopos','F');
					checkGovernance();
					nlapiSubmitField('lotnumberedinventoryitem',recid,'custitemcreatedtopos','T');
					checkGovernance();
					nlapiLogExecution("debug","custitemcreatetopos Lot invtpart",'updated');
				}
				if (itemType == 'InvtPart' && isLotNum == 'F')
				{
					nlapiSubmitField('inventoryitem',recid,'custitemcreatetopos','F');
					checkGovernance();
					nlapiSubmitField('inventoryitem',recid,'custitemcreatedtopos','T');
					checkGovernance();
					nlapiLogExecution("debug","custitemcreatetopos invtpart",'updated');
				}
				if (itemType == 'NonInvtPart')
				{
					nlapiSubmitField('noninventoryitem',recid,'custitemcreatetopos','F');
					checkGovernance();
					nlapiSubmitField('noninventoryitem',recid,'custitemcreatedtopos','T');
					checkGovernance();
					nlapiLogExecution("debug","custitemcreatetopos noninvtpart",'updated');
				}
			}
			
		} 
		checkGovernance();
	}
	checkGovernance();

	
	nlapiLogExecution("debug","Script End");
	
}

function CheckError()
{
	// Check Error URL
	// var CheckErrorURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LastError"
	var CheckErrorURL = "https://ithpos.app/erunapi/api.asmx/System_LastError";
	var CheckErrorResponse = nlapiRequestURL(CheckErrorURL,null,null,'GET');
	checkGovernance();
	var CheckErrorBody = CheckErrorResponse.getBody();
	// nlapiLogExecution("debug","CheckErrorBody",CheckErrorBody);
}
function Login()
{
	// Login URL
	// var LoginURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_Login?sUsername=998&sPassword=998"
	var LoginURL = "https://ithpos.app/erunapi/api.asmx/System_Login?sUsername=998&sPassword=998";
	var LoginResponse = nlapiRequestURL(LoginURL,null,null,'GET');
	checkGovernance();
	// var LoginBody = LoginResponse.getBody();
	var LoginBody = LoginResponse.getHeader('Set-Cookie');
	// nlapiLogExecution("debug","LoginBody",LoginBody);
	return LoginBody;
}
function Logout()
{
	// Logout URL
	// var LogoutURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LogoutUser?sUsername=998"
	var LogoutURL = "https://ithpos.app/erunapi/api.asmx/System_LogoutUser?sUsername=998";
	var LogoutResponse = nlapiRequestURL(LogoutURL,null,null,'GET');
	checkGovernance();
	var LogoutBody = LogoutResponse.getBody();
	// nlapiLogExecution("debug","LogoutBody",LogoutBody);
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