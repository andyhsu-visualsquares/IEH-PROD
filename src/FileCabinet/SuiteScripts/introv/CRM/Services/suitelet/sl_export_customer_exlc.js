/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 * Script Name: SL Export Customer Data
 * script Id: customscript_iv_export_customer_data_sl
 * deployment Id: customdeploy_iv_export_customer_data_sl
 */
define(["N", 'N/file', 'N/encode', '../../Constants/Constants.js'], function (N_1, file, encode, const_1) {

    function onRequest(context) {
        let processing = "idle"
        let excelIds = []
        const { request, response } = context
        let requestBody = JSON.parse(request.body)
        log.debug('requestBody', requestBody);
        let customerData = requestBody.combinedCustomerDataFullArr
        let savingTimeStamp = requestBody.savingTimeStamp
        if (requestBody.hasOwnProperty('combinedCustomerDataFullArr')) {
            customerData = requestBody.combinedCustomerDataFullArr
            var splitedResult = splitArray(customerData, 8000)
            log.debug("splitedResult", splitedResult.length)
            log.debug("splitedResult2", splitedResult[0].length)
            // let savingTimeStamp = moment().tz('Asia/Hong_Kong').format("YYYYMMDD_HHmmss")
            for (let i = 0; i < splitedResult.length; i++) {
                processing = "busy"
                log.debug('processing', processing);
                let xlsxFileObj = generateXLS(splitedResult[i], i, savingTimeStamp);
                // response.writeFile({
                //     file: xlsxFileObj
                // });
                xlsxFileObj.folder = const_1.BULK_EXPORT_FOLDER;
                var intFileId = xlsxFileObj.save();
                let fileObj = file.load(intFileId)
                let fileUrl = fileObj.url
                excelIds.push(fileUrl)
            }
            log.debug('excelIds', excelIds);
            if (excelIds.length == splitedResult.length) processing = "idle"
            log.debug("Finish SAVE XLS File")
        }
        response.write(JSON.stringify({ processing: processing, excelIds: excelIds }));

    }

    function returnStatus() {

    }


    function generateXLS(customerData, partIndex, savingTimeStamp) {
        // Create the XLS file template //GPT Approach
        // var xlsxTemplate = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        //     '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        //     '<sheetData>' +
        //     '<row><c t="inlineStr"><is><t>Customer ID</t></is></c><c t="inlineStr"><is><t>First Name</t></is></c><c t="inlineStr"><is><t>Last Name</t></is></c></row>' +
        //     customerData.map(function (customer) {
        //         return '<row><c t="inlineStr"><is><t>' + customer.customerID + '</t></is></c><c t="inlineStr"><is><t>' + customer.firstName + '</t></is></c><c t="inlineStr"><is><t>' + customer.lastname + '</t></is></c></row>';
        //     }).join('') +
        //     '</sheetData>' +
        //     '</worksheet>';

        // // Create the XLSX file
        // var xlsxData = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        //     '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        //     '<Default Extension="xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        //     '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        //     '</Types>';
        // var workbookData = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        //     '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        //     '<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>' +
        //     '<definedNames/>' +
        //     '</workbook>';
        // var workbookRelsData = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        //     '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        //     '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
        //     '</Relationships>';
        // var sheetData = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        //     '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        //     '<sheetData/>' +
        //     '</worksheet>';
        // var sheetRelsData = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        //     '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        //     '</Relationships>';
        // var contentTypesFile = file.create({
        //     name: 'content_types.xml',
        //     fileType: file.Type.XMLDOC,
        //     contents: xlsxData
        // });
        // var workbookFile = file.create({
        //     name: 'workbook.xml',
        //     fileType: file.Type.XMLDOC,
        //     contents: workbookData
        // });
        // var workbookRelsFile = file.create({
        //     name: '_rels/workbook.xml.rels',
        //     fileType: file.Type.XMLDOC,
        //     contents: workbookRelsData
        // });
        // var sheetFile = file.create({
        //     name: 'sheet1.xml',
        //     fileType: file.Type.XMLDOC,
        //     contents: sheetData
        // });
        // var sheetRelsFile = file.create({
        //     name: 'worksheets/_rels/sheet1.xml.rels',
        //     fileType: file.Type.XMLDOC,
        //     contents: sheetRelsData
        // });
        // var sharedStringsFile = file.create({
        //     name: 'sharedStrings.xml',
        //     fileType: file.Type.XMLDOC,
        //     contents: xlsxTemplate
        // });

        // Create the final XLSX file

        var xmlStr = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
        xmlStr = genHeaderXmlString(xmlStr);
        xmlStr = genDataXmlString(xmlStr, customerData)
        xmlStr += '</Table></Worksheet></Workbook>';

        var strXmlEncoded = encode.convert({
            string: xmlStr,
            inputEncoding: encode.Encoding.UTF_8,
            outputEncoding: encode.Encoding.BASE_64
        });

        var xlsxFileObj = file.create({
            name: `ImperialClub_MemberExport_${savingTimeStamp}_${partIndex + 1}.xls`,
            fileType: file.Type.EXCEL,
            contents: strXmlEncoded
        });

        return xlsxFileObj;
    }

    function genHeaderXmlString(xmlStr) {
        xmlStr += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
        xmlStr += 'xmlns:o="urn:schemas-microsoft-com:office:office" ';
        xmlStr += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
        xmlStr += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ';
        xmlStr += 'xmlns:html="http://www.w3.org/TR/REC-html40">';

        xmlStr += '<Styles>'
            + '<Style ss:ID="s63">'
            + '<Font x:CharSet="204" ss:Size="12" ss:Color="#000000" ss:Bold="1" ss:Underline="Single"/>'
            + '</Style>' + '</Styles>';

        xmlStr += '<Worksheet ss:Name="Customer">';
        xmlStr += '<Table>'
            + '<Row>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Customer ID </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> First Name </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Last Name </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Salutation </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Birthday Month </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Age </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Phone </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Email </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Default Language </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Residential Region </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Referral Ref </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Accept Marketing Prmote </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Accept TC </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Dummy Date 1 </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Dummy Date 2 </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Dummy Text 1 </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Member Type </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Registration Date </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Effective Date </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Effective To Date </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Welcome Gift Date </Data></Cell>'
            + '<Cell ss:StyleID="s63"><Data ss:Type="String"> Outstanding Points </Data></Cell>'
            + '</Row>';
        return xmlStr;
    }
    function genDataXmlString(xmlStr, customerData) {
        for (let customer of customerData) {
            xmlStr += '<Row>'
                + `<Cell><Data ss:Type="String">${customer.customerID}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.firstName}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.lastName}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.salutation}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.birthdayMonth}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.age}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.phone}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.email}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.defaultLanguage}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.residentialRegion}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.referralRef}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.marketingPromote}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.tc}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.dummyDate1}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.dummyDate2}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.dummyText1}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.memberType}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.registrationDate}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.effectiveDate}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.effectiveToDate}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.welcomeGiftDate}</Data></Cell>`
                + `<Cell><Data ss:Type="String">${customer.outstandingPoint}</Data></Cell>`
                + '</Row>';
        }
        return xmlStr;
    }

    function splitArray(arr, maxLength) {
        var result = [];
        for (var i = 0; i < arr.length; i += maxLength) {
            result.push(arr.slice(i, i + maxLength));
        }
        return result;
    }

    return {
        onRequest: onRequest
    }
});
