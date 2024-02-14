/**
 * @NApiVersion 2.x
 * @NScriptType restlet
 */
define([ 'N/record', 'N/search' ], function(record, search) {
	return {
		post : function(restletBody) {
			log.debug('restletBody',restletBody);
						
			var restletData = restletBody;
			log.debug('restletData',restletData);
			var recordId = '';
				
			var lastName = restletData.lastName;
			var firstName = restletData.firstName;
			var phone = restletData.phone;
			var email = restletData.email;
			var birthday = restletData.birthday;
			var wechat = restletData.wechat;
			var country = restletData.country;
			log.debug('lastName',lastName);
			log.debug('firstName',firstName);
			log.debug('phone',phone);
			log.debug('email',email);
			log.debug('birthday',birthday);
			log.debug('wechat',wechat);
			log.debug('country',country);
			

			if (phone)
			{

				var mySearch = search.create({
				type: search.Type.CUSTOMER,
				filters: [
					['custentityposphone', 'is', phone]
					],
				columns: [
					search.createColumn({
						name: 'internalid'
						}),
					search.createColumn({
						name: 'custentity_to_be_updated'
						})
				]
				});
				
				var to_update = false;
				
				var searchResult = mySearch.run().getRange({
				start:0,
				end:1
				});
				
				if(searchResult[0])
				{
					var internalid = searchResult[0].getValue({
						name: 'internalid'
					});
					to_update = searchResult[0].getValue({
						name: 'custentity_to_be_updated'
					});
					log.debug('to_update', to_update);
				}
				else
				{
					var internalid = 'notexist';
				}
			}
			log.debug('internalid',internalid);
			
			if (phone != '' && phone != 'null' && phone != null) 
			{
				if (lastName != '' && lastName != 'null' && lastName != null) 
				{
					if (firstName != '' && firstName != 'null' && firstName != null) 
					{
						
						if (internalid == 'notexist' || (internalid!='notexist'&&to_update==true) )
						{
							if(internalid=='notexist')
							var recCus = record.create({
							   type : record.Type.CUSTOMER,
							   isDynamic : true
							});
							else
							{
								var recCus = record.load({
									type: record.Type.CUSTOMER,
									id: internalid,
									isDynamic : true
								});
							}
							recCus.setValue({
							 fieldId : 'isperson',
							 value : 'T'
							});
							recCus.setValue({
							 fieldId : 'custentity_to_be_updated',
							 value : false
							});
							recCus.setValue({
							 fieldId : 'lastname',
							 value : lastName
							});
							recCus.setValue({
							 fieldId : 'firstname',
							 value : firstName
							});
							recCus.setValue({
							 fieldId : 'category',
							 value : '2'
							});
							recCus.setValue({
							 fieldId : 'custentity_customer_sub_category',
							 value : 28
							});
							recCus.setValue({
							 fieldId : 'custentityposphone',
							 value : phone
							});
							recCus.setValue({
							 fieldId : 'custentityposemail',
							 value : email
							});
							recCus.setValue({
							 fieldId : 'custentityposwechatid',
							 value : wechat
							});
							
							if(birthday)
							{
								log.debug('MM',birthday.substring(3,5));
								log.debug('MM int',parseFloat(birthday.substring(3,5)));
								log.debug('MM int -1',parseFloat(birthday.substring(3,5))-1);
								var DOB = new Date(1900,parseFloat(birthday.substring(3,5))-1,01);
								log.debug('DOB',DOB);
								recCus.setValue({
								 fieldId : 'custentityposdob',
								 value : DOB
								});
							}
							recCus.setValue({
							 fieldId : 'custentityposcity',
							 value : country
							});
							recCus.setValue({
							 fieldId : 'subsidiary',
							 value : 10
							});
							recCus.setValue({
							 fieldId : 'custentity_approve',
							 value : true
							});
							recCus.setValue({
							 fieldId : 'custentity_pending_complete',
							 value : true
							});
							recCus.setValue({
							 fieldId : 'cseg1',
							 value : 3
							});
							recCus.setValue({
							 fieldId : 'pricelevel',
							 value : 4
							});
							
							
							
							NSCustomerID = recCus.save({
							   enableSourcing : false,
							   ignoreMandatoryFields : false
							});
							log.debug('NSCustomerID',NSCustomerID);
							
							return {"success":true, "NSCustomerID":NSCustomerID};
						}
						
						else
						{	
							return {"success":false, "Details":"Customer Phone Number Existed, NSCustomerID:" + internalid};
						}
					}
					else
					{
						return {"success":false, "Details":"First Name Cannot Be Empty"};
					}
				}
				else
				{
					return {"success":false, "Details":"Last Name Cannot Be Empty"};
				}
			}
			else
			{
				return {"success":false, "Details":"Phone Number Cannot Be Empty"};
			}
		}
	}
}
);
