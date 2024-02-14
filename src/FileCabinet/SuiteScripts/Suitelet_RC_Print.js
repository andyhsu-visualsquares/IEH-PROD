function Suitelet_RC_Print(request, response)
{
	var recId = request.getParameter('id');

	var rec = nlapiLoadRecord('customrecordrcmaster',recId);
	var generator = rec.getFieldValue('custrecordrcmastergennum');
	var code = rec.getFieldValue('name');
	var codeText = rec.getFieldValue('custrecordrcmasterrc');
	
	var topImage = nlapiLookupField('customrecordrcgenerator',generator,'custrecordrcgeneratortopimage');
	var leftImage = nlapiLookupField('customrecordrcgenerator',generator,'custrecordrcgeneratorleftimage');
	var rightImage = nlapiLookupField('customrecordrcgenerator',generator,'custrecordrcgeneratorrightimage');
	var bottomImage = nlapiLookupField('customrecordrcgenerator',generator,'custrecordrcgeneratorbottomimage');
	
	if (topImage)
	{
		var topImageURL = nlapiEscapeXML(nlapiLoadFile(topImage).getURL());
	}
	else
	{
		var topImageURL = 'http://shopping.na2.netsuite.com/core/media/media.nl?id=178&amp;c=5112262&amp;h=d4413d90916411315d7d';
	}
	nlapiLogExecution('debug', 'topImageURL',topImageURL);
	if (leftImage)
	{
		var leftImageURL = nlapiEscapeXML(nlapiLoadFile(leftImage).getURL());
	}
	else
	{
		var leftImageURL = 'http://shopping.na2.netsuite.com/core/media/media.nl?id=179&amp;c=5112262&amp;h=ff5366b851a0164bd2a3';
	}
	nlapiLogExecution('debug', 'leftImageURL',leftImageURL);
	if (rightImage)
	{
		var rightImageURL = nlapiEscapeXML(nlapiLoadFile(rightImage).getURL());
	}
	else
	{
		var rightImageURL = 'http://shopping.na2.netsuite.com/core/media/media.nl?id=181&amp;c=5112262&amp;h=1f78924146521272eaa8';
	}
	nlapiLogExecution('debug', 'rightImageURL',rightImageURL);
	if (bottomImage)
	{
		var bottomImageURL = nlapiEscapeXML(nlapiLoadFile(bottomImage).getURL());
	}
	else
	{
		var bottomImageURL = 'http://shopping.na2.netsuite.com/core/media/media.nl?id=180&amp;c=5112262&amp;h=e065da7e9529d294771e';
	}
	nlapiLogExecution('debug', 'bottomImageURL',bottomImageURL);
	var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
	xml += '<pdf>'
	xml += '<body width="505px" height="900px" style="padding:0 0 0 0">';
			xml += '<table align="center" vertical-align="top" style="width:506px; height:100%;border-collapse:collapse;" cellpadding="0" cellspacing="0" border="0" cellmargin="0">';
			xml += '<tr>';
			xml += '<td colspan="3"><img src="' + topImageURL + '" style="float: center;height:630px; width:506px" /> </td>';
			xml += '</tr>';
			xml += '<tr>';
			xml += '<td rowspan="2"><img src="' + leftImageURL + '" style="float: center;height:269px; width:294px" /> </td>';
			xml += '<td>';
			
			xml += '<table align="center" width="180px" height="180px">';
			xml += '<tr>';
			xml += '<td align="center" width="180px">';
			xml += '<barcode codetype="qrcode" width="150px" height="150px" showtext="true" value="';
			xml += code;
			xml += '"/>';
			xml += '</td>';
			xml += '</tr>';
			xml += '<tr>';
			xml += '<td align="center">';
			xml += codeText;
		xml += '</td>';
		xml += '</tr>';
		xml += '</table>';
		
		xml += '</td>';
		xml += '<td><img src="' + rightImageURL + '" style="float: center;height:182px; width:32px" /> </td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td colspan="2"><img src="' + bottomImageURL + '" style="height:87px; width:212px" /> </td>';
		
		xml += '</tr>';
		xml += '</table>';
	xml += '</body>';


	
	xml += '\n</pdf>';
	nlapiLogExecution('debug', 'XML', xml);
	nlapiLogExecution('debug', 'XML Finished');
	var file = nlapiXMLToPDF(xml);
	response.setContentType('PDF','Code.pdf','inline');
	response.write(file.getValue());
}


function ifnull(varstring)
{
	if (varstring == null)
	{
		return ''; 
	}
	else 
	{
		return varstring;
	}
}

function comma(x)
 {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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