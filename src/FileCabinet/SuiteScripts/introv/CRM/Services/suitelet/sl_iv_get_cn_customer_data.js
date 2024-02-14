/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * 
 */

define(['N/https', '../ChinaDBServices.js', '../../DAO/TemporaryCustomerDAO'], function (https, ChinaDBServices, CustomerDAO) {
  function onRequest(context) {
    if (context.request.method === 'GET') {
      var chinaDBServices = new ChinaDBServices();

      // Fetch data using chinaDBServices
      var searchData = {
        customerId: context.request.parameters.CUSTOMER_ID,
        phone: null,
        email: null
      };
      var response = chinaDBServices.findCustomerByKey(searchData);

      // Pass the fetched data to the client script
      var responseObj = JSON.parse(response.body);
      var dataToSend = responseObj.result[0];
      if (!dataToSend) {
        const tempCustomerDAO = new CustomerDAO()
        dataToSend = tempCustomerDAO.getCNCustomerInSatging(searchData.customerId)
      }
      log.debug("dataToSend", dataToSend)

      // Send the response with the fetched data
      context.response.write(JSON.stringify(dataToSend));
    }
  }

  return {
    onRequest: onRequest
  };
});