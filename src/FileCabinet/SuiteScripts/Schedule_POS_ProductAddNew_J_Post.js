function Schedule_POS_ProductAddNew_J_Post()
{	
	Logout();
	var LoginRes = Login();

	// CheckError();
	
	//Product_Modify_J
	var url = "http://ieh.softether.net:8888/erunapi/api.asmx/Product_Modify_J";
	
	// var header = {"Content-Type": "application/json"};
	var header = {"Content-Type": "application/json","cookie": LoginRes};
	
	var searchresults = nlapiSearchRecord('item', 'customsearchcreatetopos');
   
	if(searchresults)
    {
		for(var i = 0; i < searchresults.length; i++) 
		{
			var recid = searchresults[i].getId();
			nlapiLogExecution('debug', 'itemid', recid);
			var columns = searchresults[i].getAllColumns();
			
			var itemNum = searchresults[i].getValue(columns[0]);
			var UPC = searchresults[i].getValue(columns[1]);
			var DisplayName = searchresults[i].getValue(columns[2]);
			var Desc = searchresults[i].getValue(columns[3]);
			var BasePrice = searchresults[i].getValue(columns[4]);

				
			var data = {};
			var jProduct = {};
			
			jProduct.UBC = itemNum;
			jProduct.BC = UPC;
			jProduct.ABC = UPC;
			jProduct.PN2L = DisplayName;
			jProduct.PN1L = DisplayName;
			jProduct.SN1L = Desc;
			jProduct.SN2L = Desc;
			jProduct.RE = recid; // RE = remark : item internal ID
			jProduct.STS1 = 0;
			jProduct.STS2 = 0;
			jProduct.UN = 15;
			jProduct.MRQ = 1;
			jProduct.RUN = 15;
			jProduct.LN1L = "";
			jProduct.LN2L = "";
			jProduct.C1 = "1";
			jProduct.C1S1 = "0";
			jProduct.C2 = "";
			jProduct.C3 = "";
			jProduct.COLR = "";
			jProduct.SIZ = "";
			jProduct.LOC = "";
			jProduct.LP = 0;
			jProduct.PP = 0;
			jProduct.MMK = 0;
			jProduct.PFC1 = "0";
			jProduct.SEP = BasePrice;
			jProduct.SEP1 = BasePrice;
			jProduct.SEP2 = BasePrice;
			jProduct.SU = "0";
			jProduct.SREF = "";
			jProduct.MOQ = 1;
			jProduct.PUN = 15;
			jProduct.ROL = 0;
			jProduct.UN1 = 0;
			jProduct.UM1 = 0;
			jProduct.UN2 = 0;
			jProduct.UM2 = 0;
			jProduct.UN3 = 0;
			jProduct.UM3 = 0;
			jProduct.IVTP = 1;
			jProduct.RMM = "";
			jProduct.ND = 1;
			jProduct.AVPP = 99;
			jProduct.MODIFIER_D1L = "";
			jProduct.MODIFIER_D2L = "";
			jProduct.IVTP2 = "000000000";
			jProduct.FP = "false";
			jProduct.RDMF = "N";
			jProduct.IO = 0;
			jProduct.MDP = 0;
			jProduct.Combos = [];
			jProduct.Recipes = [];
			jProduct.ProdCS = "";

			var requestBody = {};
			requestBody.jProduct = jProduct;
			// nlapiLogExecution('debug', 'requestBody', requestBody);
			// nlapiLogExecution('debug', 'JSON.stringify(requestBody)', JSON.stringify(requestBody));
			
			var ProductAddNew_J_URL = url;
			var response = nlapiRequestURL(ProductAddNew_J_URL,JSON.stringify(requestBody),header,'POST');
			checkGovernance();
			var ResponseBody = response.getBody();
			nlapiLogExecution("debug","ResponseBody",ResponseBody);
			
			datain = JSON.parse(ResponseBody);
			nlapiLogExecution('debug','datain',datain);
			var d = datain['d'];
			nlapiLogExecution("debug","d",d);
			// var error = datain.error;
			// var TXid = datain['TransactionID'];
			CheckError();
		} 
		checkGovernance();
	}
	checkGovernance();

	
	
	
}

function CheckError()
{
	// Check Error URL
	var CheckErrorURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LastError"
	var CheckErrorResponse = nlapiRequestURL(CheckErrorURL,null,null,'GET');
	checkGovernance();
	var CheckErrorBody = CheckErrorResponse.getBody();
	nlapiLogExecution("debug","CheckErrorBody",CheckErrorBody);
}
function Login()
{
	// Login URL
	var LoginURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_Login?sUsername=999&sPassword=999"
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
	var LogoutURL = "http://ieh.softether.net:8888/erunapi/api.asmx/System_LogoutUser?sUsername=999"
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