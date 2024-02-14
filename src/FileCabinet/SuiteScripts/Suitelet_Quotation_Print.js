function Suitelet_Quo_Print(request, response)
{
	var recId = request.getParameter('id');

	//var templateId = '337424';//Sandbox
  var templateId = '338333';//Production
  
	var template = nlapiLoadFile(templateId);
	var content = template.getValue();
	var record = nlapiLoadRecord('opportunity',recId);
	
	var subsidiary = record.getFieldValue('subsidiary');
	var recSubsid = nlapiLoadRecord('subsidiary',subsidiary);
	var logoID = recSubsid.getFieldValue('logo');
	nlapiLogExecution('debug','logoID',logoID);
	var file = nlapiLoadFile(logoID);
    var ImgURL = nlapiEscapeXML(file.getURL());
	
	var renderer = nlapiCreateTemplateRenderer();
	renderer.setTemplate(content);
	renderer.addRecord('record',record);
	var renderPDF = renderer.renderToString();
	
	
	var logoHtml = '';
	logoHtml += '<img src="';
	logoHtml += ImgURL;
	logoHtml += '" height="60%" width="60%" />' 
	// if (logoHtml)
	{
		nlapiLogExecution('debug','logoHtml',logoHtml);
		renderPDF = renderPDF.replace('<!--$Logo-->',logoHtml);
	}
	
	
	
	nlapiLogExecution('debug','xml',renderPDF);
	nlapiLogExecution('debug', 'XML Finished');
	var file = nlapiXMLToPDF(renderPDF);
	response.setContentType('PDF',record.getFieldValue('tranid')+'.pdf', 'inline');
  	var FileName = record.getFieldValue('tranid');
	FileName += '_';
	FileName += 'Quotation';
	FileName += '.pdf';
	var fileCreated = nlapiCreateFile(FileName, 'PDF', file.getValue());
	fileCreated.setFolder('1448607');
	var fileId = nlapiSubmitFile(fileCreated);
	nlapiLogExecution('error', 'fileId', fileId);
	record.setFieldValue('custbodyquotationfile', fileId);
	
	var id = nlapiSubmitRecord(record);
	response.write(file.getValue());
}