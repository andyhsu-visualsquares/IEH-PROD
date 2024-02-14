function UE_CreateUnit(type)
{
	if(type!='delete' && !nlapiGetFieldValue('custrecord_link_unit'))
	{
		var rec = nlapiCreateRecord('unitstype');
		rec.setFieldValue('name', nlapiGetFieldValue('name'));
		rec.selectNewLineItem('uom');
		rec.setCurrentLineItemValue('uom', 'unitname', nlapiGetFieldValue('custrecord_base_unit'));
		rec.setCurrentLineItemValue('uom', 'pluralname', nlapiGetFieldValue('custrecord_base_unit'));
		rec.setCurrentLineItemValue('uom', 'abbreviation', nlapiGetFieldValue('custrecord_base_unit'));
		rec.setCurrentLineItemValue('uom', 'pluralabbreviation', nlapiGetFieldValue('custrecord_base_unit'));
		rec.setCurrentLineItemValue('uom', 'baseunit', 'T');
		rec.setCurrentLineItemValue('uom', 'conversionrate', 1);
		rec.commitLineItem('uom');
		if(nlapiGetFieldValue('custrecord_unit1'))
		{
		rec.selectNewLineItem('uom');
		rec.setCurrentLineItemValue('uom', 'unitname', nlapiGetFieldValue('custrecord_unit1'));
		rec.setCurrentLineItemValue('uom', 'pluralname', nlapiGetFieldValue('custrecord_unit1'));
		rec.setCurrentLineItemValue('uom', 'abbreviation', nlapiGetFieldValue('custrecord_unit1'));
		rec.setCurrentLineItemValue('uom', 'pluralabbreviation', nlapiGetFieldValue('custrecord_unit1'));
		rec.setCurrentLineItemValue('uom', 'baseunit', 'F');
		rec.setCurrentLineItemValue('uom', 'conversionrate', nlapiGetFieldValue('custrecord_unit1_conversion'));
		rec.commitLineItem('uom');
		}
		if(nlapiGetFieldValue('custrecord_unit2'))
		{
		rec.selectNewLineItem('uom');
		rec.setCurrentLineItemValue('uom', 'unitname', nlapiGetFieldValue('custrecord_unit2'));
		rec.setCurrentLineItemValue('uom', 'pluralname', nlapiGetFieldValue('custrecord_unit2'));
		rec.setCurrentLineItemValue('uom', 'abbreviation', nlapiGetFieldValue('custrecord_unit2'));
		rec.setCurrentLineItemValue('uom', 'pluralabbreviation', nlapiGetFieldValue('custrecord_unit2'));
		rec.setCurrentLineItemValue('uom', 'baseunit', 'F');
		rec.setCurrentLineItemValue('uom', 'conversionrate', nlapiGetFieldValue('custrecord_unit2_conversion'));
		rec.commitLineItem('uom');
		}
		var recid = nlapiSubmitRecord(rec, true);
		nlapiSubmitField('customrecord_unit_type',nlapiGetRecordId(), 'custrecord_link_unit', recid);
		nlapiLogExecution('debug', 'recid', recid);
	}
}