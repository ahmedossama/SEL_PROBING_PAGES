//= require "_payloads.js"

/*
Please add new call tests to var services

**/
var storage = $.sessionStorage;
//storage.removeAll();

var environments = ['vsse','eweb5'];
if(!storage.isSet('ENV')) {
    storage.set('ENV', environments[1]); // set eweb5 as default
}

var credentials = {
    "vsse": {username: "smartic", password: "12345678"},
    //"eweb5": {username: "spapirny", password: "Test1234", msisdn: '015201843384', voID: 31004005}
    "eweb5": {username: "dev8", password: "Test1234", msisdn: '000000000000', voID: 31004005 }
};

var ENV = storage.get('ENV');
var API_BASE_URL = '';
var defaultVoID = storage.get('void');
if(ENV == 'vsse') {
    API_BASE_URL = "http://test.vsse.org/api";
    defaultVoID = "20011406";
} else if(ENV == 'eweb5') {
	//API_BASE_URL = "http://test.vsse.org/api";
    API_BASE_URL = "https://opweb5.vfd2-testnet.de/api";
   //API_BASE_URL = "http://localhost/api";
  //API_BASE_URL = "https://opweb5.vsse.org/api";
    
}

if(!storage.isSet('username')) {
    storage.set('username', credentials[ENV].username); 
}
if(!storage.isSet('void')) {
    storage.set('void', credentials[ENV].voID); 
}

// default requestHeader
var requestHeader = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8", 
    "Charset": "utf-8",
    "Authorization": "", // Bearer + access token    
    "x-vf-ext-bp-id": "OnePOS",
    "x-transaction-id": ""  
   
    //"x-vf-target-environment": "onepos_target_environment_preproduction_QA3"
};

var dataPanels = { 
    apiUrl: { label: "API URL", val: null },      
    header: { label: "Headers", val: null },
    payload: { label: "Payload", val: null },
    response: { label: "Response", val: null }
};

// to run at first for the user authentication
var authServices = {
     ACCESS_TOKEN:  {
        apiUrl: API_BASE_URL + '/extAuthInt/oauth2/token', 
        header: {            
            'Content-Type': 'application/x-www-form-urlencoded',            
            'x-vf-ext-bp-id': 'OnePOS'            
        },
        payload: {  
            grant_type: 'client_credentials', 
            //client_id: 'xq868G3h4VTIb1k3xkpAINtOUV7tXAJS', 
            //client_secret: 'mQGZGbCAGvSaF0fg', 
            apix_opcoid: '49', 
            scope: 'onepos_all' 
        },
        ajaxMethod: "POST",
        dataPanels: ["apiUrl","header","payload","response"]

    },
    ACCESS_TOKEN_SET_COOKIE: {
        apiUrl: API_BASE_URL + '/setcookie',
        header: {
            'x-vf-ext-bp-id': 'OnePOS', 
            'x-vf-seltoken': null
        },
        payload: null,
        ajaxMethod: "GET",
        dataPanels: ["apiUrl","header","payload","response"]
    },
    AUTHENTICATE:  {
        apiUrl: API_BASE_URL + '/pos-security-tokens/authentication-user',
        header: null,
        payload: {
            "securityTokenVBO": {
                "credentials": {
                    "username": credentials[ENV].username,
                    "password": credentials[ENV].password
                }
            }
        },
        ajaxMethod: "POST",
        dataPanels: ["apiUrl","header","payload","response"]   
    },
    MTAN_VERIFICATION:  {
        apiUrl: API_BASE_URL + '/pos-security-tokens/authentication-mtan',
        header: null,
        payload: {
            "securityTokenVBO": {
                "credentials": {
                    "mtan": null                
                }
            }
        },
        ajaxMethod: "POST",
        dataPanels: ["apiUrl","header","payload","response"],
        adjustHeader: { set: ["username"] }    
    }
    
};

/*
callback: function runs after API call to save some response data, that used for other calls (orderId ect.)
placeHolders: to replace placeholders in apiUrl used saved response data
urlExtension: will be added to apiUrl
adjustHeader: adjusting of the default requestHeader
**/
var services = { 
    USERS:  {
        apiUrl: API_BASE_URL + '/pos-user-accounts/user-data',
        header:null,
        payload: null,
        ajaxMethod: "GET",
        urlExtension: "username="+storage.get('username'), 
        dataPanels: ["apiUrl","header","payload","response"],
        adjustHeader: { unset:["Content-Type"],set: ["username"] },
        callback: 'setVOID'
    },


    ITEM_TASK_ENTITY_LIST_GET: {
        apiUrl: API_BASE_URL + '/pos-item-task/entities',
        header: null,
        payload: null,
        ajaxMethod: "GET",
        //urlExtension: "page-id=orderCapture&group-item-id=50",
        urlExtension: "page-id=dashboard",
        dataPanels: ["apiUrl","header","response"],
        adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    INTEM_TASK_RULESET_GET:{
       apiUrl: API_BASE_URL + '/pos-item-task/entities/ruleset', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       //urlExtension: "page-id=dashboard",
       urlExtension: urlExtensions.INTEM_TASK_RULESET_GET,
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: {unset:["Content-Type"], set: ["username"] }
    },
    
    // TOKEN_INVALIDATION_DELETE: {
    //     apiUrl: API_BASE_URL + '/technical/security-tokens/token',
    //     header: null,
    //     payload: {},
    //     ajaxMethod: "POST",        
    //     dataPanels: ["apiUrl","header","payload","response"],
    //     adjustHeader: { set: {"username":""} }
    // },    
    CART_GET:  {
        apiUrl: API_BASE_URL + '/pos-sales-orders/%ORDER_ID%/summary',
        header: null,
        payload: null,
        ajaxMethod: "GET",        
        dataPanels: ["apiUrl","header","response"],
        placeHolders: {"%ORDER_ID%": 'orderID' }, 
        adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    HARDWARE_OFFERS_GET:  {
        apiUrl: API_BASE_URL + '/pos-product/product-offerings/hardware',
        urlExtension: "order-lineitem-id=%ORDER_LINE_ITEM_ID%",
        header: null,
        payload: null,
        ajaxMethod: "GET",        
        dataPanels: ["apiUrl","header","response"],
        placeHolders: {"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
        adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    ORDER_LINE_ITEM_SUMMARY: {
       apiUrl: API_BASE_URL + '/pos-sales-order-line/sales-orders/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%/summary', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       urlExtension: "order-id=%ORDER_ID%",
       placeHolders: {"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    CUSTOMER_AGREEMENT_GET: {
       apiUrl: API_BASE_URL + '/pos-contract-customer-agreement/contracts/%ORDER_ID%/customer-agreements', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%ORDER_ID%": 'orderID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] },
       callbefore: "SALES_ORDER_CREATION_POST"
    },
    CUSTOMER_DOCUMENT_GET: { 
    	// 55/POST_PAY_ACTIVATION
       apiUrl: API_BASE_URL + '/pos-documents/customer-agreements/%DOCUMENT_ID%/%DOCUMENT_NAME%', ///pos-documents/customer-agreements/{0}/{1}
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%ID%": 'documentID', "%NAME%": 'documentName'},
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    
    CUSTOMER_DATA_FOR_ORDER_GET: {
       apiUrl: API_BASE_URL + '/pos-contract-customer-data/contracts/%ORDER_ID%/customer-account', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%ORDER_ID%": 'orderID'},
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: {unset:["Content-Type"],set: ["username"] },
       callbefore:"SALES_ORDER_CREATION_POST"
       
    },
    CUSTOMER_DATA_FOR_ORDER_PUT: {
       apiUrl: API_BASE_URL + '/pos-contract-customer-data/contracts/%ORDER_ID%/customer-account', 
       ajaxMethod: "PUT",
       header: null,
       payload: payloads.CUSTOMER_DATA_FOR_ORDER_PUT,
       placeHolders: {"%ORDER_ID%": 'orderID'},
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: {set: ["username"] }
       
    },

    CUSTOMER_SUMMARY_GET: {
       apiUrl: API_BASE_URL + '/pos-contract-customer-data/contracts/%ORDER_ID%/customer-account', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%ORDER_ID%": 'orderID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    CUSTOMER_DETAILED_VIEW_GET:{
      // apiUrl: API_BASE_URL + '/%TYPE%/customer/customer-accounts/%ACCOUNT_ID%/customer-account',

   // /pos-customer-accounts/mobile/2344001/customer-account
       apiUrl: API_BASE_URL+  '/pos-customer-accounts/mobile/%CUSTOMER_ID%/customer-account?market-code=MMC&password=%CUSTOMER_PASSWORD%',
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%CUSTOMER_ID%": '',"%CUSTOMER_PASSWORD%": '' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    CUSTOMER_OVERVIEW_GET:{
      // /pos-customer-accounts/overview
     //  apiUrl: API_BASE_URL + '/pos-customer-accounts/overview?id=102622185&password=12345',
       apiUrl: API_BASE_URL + '/pos-customer-accounts/overview?id=%CUSTOMER_ID%&password=%CUSTOMER_PASSWORD%',	 
       ajaxMethod: "GET",
       header: null, //{"id": "3280282"} password=12345
       payload: null,
       placeHolders: {"%CUSTOMER_ID%": '',"%CUSTOMER_PASSWORD%": '' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: {unset:["Content-Type"],set: ["username"] }
    },
    CUSTOMER_PARTY_BANK_DETAILS_GET:{
      // 
       apiUrl: API_BASE_URL + '/pos-customer-accounts/mobile/%CUSTOMER_ID%/customer-account?password=%CUSTOMER_PASSWORD%',           //'/mobile/customer/customer-parties/2400123/bank/details',
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%TYPE%": 'type',"%ACCOUNT_ID%": 'acountID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: {unset:["Content-Type"],set: ["username"] }
    },
    CUSTOMER_PARTY_BANK_DETAILS_PUT:{
      // /pos-customer-party/bank/iban
       apiUrl: API_BASE_URL + '/pos-customer-accounts/mobile/102622185/customer-account', 
       ajaxMethod: "PUT",
       header: null,
       payload: payloads.BANK_DETAILS_PUT,
       placeHolders: {"%TYPE%": 'type',"%ACCOUNT_ID%": 'acountID' },
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: {set: ["username"] }
    },
    CUSTOMER_IBAN_POST:{
      // /pos-customer-party/bank/iban
       apiUrl: API_BASE_URL + '/pos-customer-party/bank/iban', 
       ajaxMethod: "POST",
       header: null,
       payload: payloads.CUSTOMER_IBAN_POST,
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: {set: ["username"] }
    },
    INVOICE_BILLEDUSAGE_GET:{
      // /pos-invoices/%TYPE%/customer-parties/%ACCOUNT_ID%/billed-usage
       apiUrl: API_BASE_URL + '/pos-invoices/mobile/customer-parties/%CUSTOMER_ID%/billed-usage?password=%CUSTOMER_PASSWORD%', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%TYPE%": 'type',"%ACCOUNT_ID%": 'acountID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: {unset:["Content-Type"],set: ["username"] }
    }, //
    MARKETING_OFFER_NEXT_BEST_ACTIVITY_GET:{
    	// /pos-marketing/marketing-offers/491720410693/next-best-activity?mode=vvl&password=TEST&void=31004005
    	//  pos-marketing/marketing-offers/491720410632/next-best-activity?mode=vvl&password=12345&void=31004005
       apiUrl: API_BASE_URL + '/pos-marketing/marketing-offers/491720410632/next-best-activity?mode=vvl&password=12345&void=31004005', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: {unset:["Content-Type"],set: ["username"] }
    },
      POSTALCONTACTPOINT_ADDRESS_GET: { // check
      // /pos-customer-party-postal-contact-points/%type%/%accountId%/contact-medium/phone-and-email
      // /pos-customer-party-postal-contact-points/mobile/102622185/addresses
       apiUrl: API_BASE_URL + '/pos-customer-party-postal-contact-points/mobile/%CUSTOMER_ID%/contact-medium/phone-and-email', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%TYPE%": 'type',"%ACCOUNT_ID%": 'acountID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    POSTALCONTACTPOINT_ADDRESS_PUT: {
    	// /pos-customer-party-postal-contact-points/mobile/102622185/addresses

       apiUrl: API_BASE_URL + '/pos-customer-party-postal-contact-points/mobile/%CUSTOMER_ID%/addresses', 
       ajaxMethod: "PUT",
       header: null,
       payload: payloads.POSTALCONTACTPOINT_ADDRESS_PUT,
       placeHolders: {"%TYPE%": 'type',"%ACCOUNT_ID%": 'acountID' },
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: { set: ["username"] }
    }, 
    POSTALCONTACTPOINT_CONTACT_DATA_GET: {
       apiUrl: API_BASE_URL + '/pos-customer-party-postal-contact-points/mobile/%CUSTOMER_ID%/contact-medium/phone-and-email', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    POSTALCONTACTPOINT_CONTACT_DATA_PUT: {
    	// /pos-customer-party-postal-contact-points/mobile/102622185/contact-medium/phone-and-email
    	// /pos-customer-party-postal-contact-points/mobile/102622185/contact-medium/phone-and-email
       apiUrl: API_BASE_URL + '/pos-customer-party-postal-contact-points/mobile/%CUSTOMER_ID%/contact-medium/phone-and-email', 
       ajaxMethod: "PUT",
       header: null,
       payload: payloads.POSTALCONTACTPOINT_CONTACT_DATA_PUT,
       placeHolders: {"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: { set: ["username"] }
    },
    POSTALCONTACTPOINT_VALIDATION_ADDRESS_POST: {
       apiUrl: API_BASE_URL + '/pos-postal-contact-point/mobile/addresses/validated-address', 
       ajaxMethod: "POST",
       header: null,
       payload: payloads.POSTALCONTACTPOINT_VALIDATION_ADDRESS_POST,
       placeHolders: {"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: { set: ["username"] }
    },
    POSTALCONTACTPOINT_VALIDATION_LOCATION_POST: {
       apiUrl: API_BASE_URL + '/pos-postal-contact-point/mobile/addresses/validated-address', 
       ajaxMethod: "POST",
       header: null,
       payload: payloads.POSTALCONTACTPOINT_VALIDATION_ADDRESS_POST,
       placeHolders: {"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: {  set: ["username"] }
    }, 
    PRODUCT_OFFERING_HARDWARE_OFFERS_GET: {
      // /pos-product/product-offerings/hardware?order-lineitem-id=%ORDER_LINE_ITEM_ID%
       apiUrl: API_BASE_URL + '/pos-product/product-offerings/hardware?order-lineitem-id=%ORDER_LINE_ITEM_ID%', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    PRODUCT_OFFERING_PRODUCT_AVAILABILITY_GET: {
      // %TYPE%/subscriptions/products
       apiUrl: API_BASE_URL + '/pos-product/product-offerings?street=%STREET%&street-number=%STREET_NUMBER%&post-code=%POSTAL_CODE%&city=%CITY%', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%TYPE%": 'type' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    PRODUCT_OFFERING_PROMOTIONS_GET: {
       apiUrl: API_BASE_URL + '/vlux/promotions', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    
    SALES_ORDER_DELETE: {
      // /pos-sales-orders/%ORDER_ID%
       apiUrl: API_BASE_URL + '/pos-sales-orders/%ORDER_ID%', 
       ajaxMethod: "DELETE",
       header: null,
       payload: null,
       placeHolders: {"%ORDER_ID%": 'orderID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    }, 
    SALES_ORDER_CREATION_POST: {
      // /pos-sales-orders/%ORDER_ID%
       apiUrl: API_BASE_URL + '/pos-sales-orders', 
       ajaxMethod: "POST",
       header: null,
       payload: {"salesOrderVBO":[{"details":{"activationDateTime":"2015-08-13T15:06:44.848+02:00"},"roles":{"agent":{"voID":defaultVoID},"customer":{"type":"private"}},"parts":{"lineItems":[{"type":"modifyProduct","category":"post-pay"}]}}]},
       placeHolders: {"%ORDER_ID%": 'orderID' },
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: { set: ["username"] },
       callback: 'setNewOrder',
       callbefore:'USERS'
    },
    SALES_ORDER_LINEITEM_DELETE: {
      // /pos-sales-order-line/sales-orders/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%
       apiUrl: API_BASE_URL + '/pos-sales-order-line/sales-orders/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%', 
       ajaxMethod: "DELETE",
       header: null,
       payload: null,
       placeHolders: {"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] },
       callbefore: "SALES_ORDER_CREATION_POST"
    }, 
    SALES_ORDER_LINEITEM_CREATION_POST: {
      // /pos-sales-order-line/sales-orders/%ORDER_ID%/lineitems
       apiUrl: API_BASE_URL + '/pos-sales-order-line/sales-orders/%ORDER_ID%/lineitems', 
       ajaxMethod: "POST",
       header: null,
       placeHolders: {"%ORDER_ID%": 'orderID'},
       payload: payloads.SALES_ORDER_LINEITEM_CREATION_POST,
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: {  set: ["username"] }
    }, 
    SALES_ORDER_LINEITEM_SUMMARY_GET: {
      // /pos-sales-order-line/sales-orders/{order-id}/lineitems/{order-lineitem-id}/summary
       apiUrl: API_BASE_URL + '/pos-sales-order-line/sales-orders/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%/summary', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    SALES_ORDER_LINEITEM_UPDATE_POST: {
      // /pos-sales-orders/%ORDER_ID%
       apiUrl: API_BASE_URL + '/pos-sales-order-line/sales-orders/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%', 
       ajaxMethod: "POST",
       header: null,
       payload: payloads.SALES_ORDER_LINEITEM_UPDATE_POST,
       placeHolders: {"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: { set: ["username"] }
    },
    SALES_ORDER_OVERVIEW_GET: {
      // //pos-documents/sales-orders-overview
       apiUrl: API_BASE_URL + '/pos-documents/sales-orders-overview', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    

    SALES_ORDER_SUMMARY_GET: {
       // /pos-sales-orders/{order-id}/summary
       apiUrl: API_BASE_URL + '/pos-sales-orders/%ORDER_ID%/summary', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders: {"%ORDER_ID%": 'orderID'},
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: { unset:["Content-Type"], set: ["username"] },
       callbefore:'SALES_ORDER_CREATION_POST'
    },
    SALES_ORDER_UPDATE_POST: {
       // /pos-sales-orders/%ORDER_ID%
       apiUrl: API_BASE_URL + '/pos-sales-orders/%ORDER_ID%', 
       ajaxMethod: "POST",
       header: null,
       payload: payloads.SALES_ORDER_UPDATE_POST,
       placeHolders: {"%ORDER_ID%": 'orderID'},
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: {  set: ["username"] },
       callbefore: "SALES_ORDER_CREATION_POST"
    },
    SALES_ORDER_PRODUCT_GET: {
       // /order/sales-orders/contracts/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%/products
       // '/contracts/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%/products'
       apiUrl: API_BASE_URL + '/pos-sales-order-line/sales-orders/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%/products', 
       ajaxMethod: "GET",
       header: null,
       payload: null,
       dataPanels: ["apiUrl","header","response"],
       placeHolders: {"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       adjustHeader: { unset:["Content-Type"], set: ["username"] }
    },
    SALES_ORDER_PRODUCT_POST: {
        apiUrl: API_BASE_URL + '/pos-sales-order-line/sales-orders/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%/products',
        header: null,
        payload: payloads.SALES_ORDER_PRODUCT_POST,
        ajaxMethod: "POST",        
        dataPanels: ["apiUrl","header","payload","response"],
        placeHolders: {"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' }, 
        adjustHeader: { set: ["username"] }
    },
    SALES_ORDER_SIM_SWAP_POST: {
       apiUrl: API_BASE_URL + '/pos-sales-orders/mobile/order/sim', 
       ajaxMethod: "POST",
       header: null,
       payload: payloads.SALES_ORDER_SIM_SWAP_POST,
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: {  set: ["username"] }
    },
    ///{type}/order/sales-orders/ultracard-sim

    SUBSCRIPTION_PRODUCTSUBSCRIBTION_GET: {
    	// '%TYPE%/subscriptions/products'
       apiUrl: API_BASE_URL + 'fixednet/subscriptions/products?first-name=%FIRST_NAME%&family-name=%FAMILY_NAME%&street=%STREET%&street-number=%STREET_NUMBER%&post-code=%POST_CODE%&birth-date=%BIRTH_DATE%',
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders:{"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: {unset:["Content-Type"],  set: ["username"] }
    },
    //////////////////////////////////////////////
    SUBSCRIPTION_PUK_GET: {
    
       apiUrl: API_BASE_URL + '/mobile/subscriptions/102622185/puk',
       ajaxMethod: "GET",
       header: null,
       payload: null,
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: {unset:["Content-Type"],  set: ["username"] }
    },
    SUBSCRIPTION_SHARING_GROUP_GET: {
    	// /pos-subscriptions/%TYPE%/sharing-group
       apiUrl: API_BASE_URL + '/pos-subscriptions/mobile/sharing-group?market-code=MMC&mode=I&account-id=102622185',
       ajaxMethod: "GET",
       header: null,
       payload: null,
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: {unset:["Content-Type"],  set: ["username"] }
    },
    SUBSCRIPTION_SHARING_GROUP_POST: {
       // /pos-subscriptions/%TYPE%/sharing-group
       apiUrl: API_BASE_URL + '/pos-subscriptions/mobile/sharing-group',
       ajaxMethod: "POST",
       header: null,
       payload: payloads.SUBSCRIPTION_SHARING_GROUP_POST,
       dataPanels: ["apiUrl","header","payload","response"],
       adjustHeader: { set: ["username"] }
    },
    SUBSCRIPTION_SIM_GET: {
    	// '%TYPE%/subscriptions/products'  first-name=%FIRST_NAME%&family-name=%FAMILY_NAME%&street=%STREET%&street-number=%STREET_NUMBER%&post-code=%POST_CODE%&birth-date=%BIRTH_DATE%
       apiUrl: API_BASE_URL + 'fixednet/subscriptions/products?first-name=%FIRST_NAME%&family-name=%FAMILY_NAME%&street=%STREET%&street-number=%STREET_NUMBER%&post-code=%POST_CODE%&birth-date=%BIRTH_DATE%',
       ajaxMethod: "GET",
       header: null,
       payload: null,
       placeHolders:{"%ORDER_ID%": 'orderID',"%ORDER_LINE_ITEM_ID%": 'orderLineItemID' },
       dataPanels: ["apiUrl","header","response"],
       adjustHeader: {unset:["Content-Type"],  set: ["username"] }
    },
    SUBSCRIPTION_SUBSCRIBER_DATA_FOR_ORDER_GET: {
    	// /pos-contract-subscriber/contracts/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%/subscription
       apiUrl: API_BASE_URL + '/pos-contract-subscriber/contracts/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%/subscription',
       ajaxMethod: "GET",
       header: null,
       payload: null,
       dataPanels: ["apiUrl","header","response"],
       placeHolders: {"%ORDER_ID%": 'orderID' , "%ORDER_LINE_ITEM_ID%":'orderLineItemID' },
       adjustHeader: {unset:["Content-Type"],  set: ["username"] }
    },
    SUBSCRIPTION_SUBSCRIBER_DATA_FOR_ORDER_POST: {
    	// /pos-contract-subscriber/contracts/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%/subscription
       apiUrl: API_BASE_URL + '/pos-contract-subscriber/contracts/%ORDER_ID%/lineitems/%ORDER_LINE_ITEM_ID%/subscription',
       ajaxMethod: "POST",
       header: null,
       payload: payloads.SUBSCRIPTION_SUBSCRIBER_DATA_FOR_ORDER_POST,
       dataPanels: ["apiUrl","header","payload","response"],
       placeHolders: {"%ORDER_ID%": 'orderID' , "%ORDER_LINE_ITEM_ID%":'orderLineItemID' },
       adjustHeader: { set: ["username"] }
    },
    SUBSCRIPTION_SUBSCRIBER_DETAILED_VIEW_GET: {
    // '/{TYPE}/subscriptions/{SUBSCRIBER_ID}/subscription'
       apiUrl: API_BASE_URL + '/%TYPE%/subscriptions/%SUBSCRIBER_ID%/subscription',
       ajaxMethod: "GET",
       header: null,
       payload: null,
       dataPanels: ["apiUrl","header","response"],
       placeHolders: {"%ORDER_ID%": 'orderID' , "%ORDER_LINE_ITEM_ID%":'orderLineItemID' },
       adjustHeader: { set: ["username"] }
    },
    USER_ACCOUNT_PUID_CREATION_POST: {
    // '/{TYPE}/subscriptions/{SUBSCRIBER_ID}/subscription'
       apiUrl: API_BASE_URL + '/pos-user-accounts/users/',
       ajaxMethod: "POST",
       header: null,
       payload: payloads.USER_ACCOUNT_PUID_CREATION_POST,
       dataPanels: ["apiUrl","header","payload","response"],
      // placeHolders: {"%ORDER_ID%": 'orderID' , "%ORDER_LINE_ITEM_ID%":'orderLineItemID' },
       adjustHeader: { set: ["username"] }
    },
    USER_ACCOUNT_PUID_DEACTIVATION_POST: {
    // /identity/user-accounts/user-profile/{username}
       apiUrl: API_BASE_URL + '/pos-user-accounts/user-profile/Vodafone',
       ajaxMethod: "POST",
       header: null,
       payload: payloads.USER_ACCOUNT_PUID_DEACTIVATION_POST,
       dataPanels: ["apiUrl","header","payload","response"],
      // placeHolders: {"%ORDER_ID%": 'orderID' , "%ORDER_LINE_ITEM_ID%":'orderLineItemID' },
       adjustHeader: { set: ["username"] }
    },
    USER_ACCOUNT_PUID_UPDATE_POST: {
    // /identity/user-accounts/user-profile/{username}
       apiUrl: API_BASE_URL + '/pos-user-accounts/user-profile/Vodafone',
       ajaxMethod: "POST",
       header: null,
       payload: payloads.USER_ACCOUNT_PUID_UPDATE_POST,
       dataPanels: ["apiUrl","header","payload","response"],
      // placeHolders: {"%ORDER_ID%": 'orderID' , "%ORDER_LINE_ITEM_ID%":'orderLineItemID' },
       adjustHeader: { set: ["username"] }
    },
    CAPTCHA_GENERATION_POST: {
        apiUrl: API_BASE_URL + '/pos-user-accounts/captcha',
        header: null,
        payload: {},
        ajaxMethod: "POST",        
        dataPanels: ["apiUrl","header","payload","response"],
        adjustHeader: { set: {"username":""} }
    },
    CAPTCHA_VERIFICATION_GET: {
    	// '/pos-user-accounts/captcha/vodafone123'
        apiUrl: API_BASE_URL + '/pos-user-accounts/captcha?username=%USER_NAME%&captcha-text=%CAPTCHA_TEXT%',
        header: null,
        payload: null,
        ajaxMethod: "GET",        
        dataPanels: ["apiUrl","header","response"],
        placeHolders: {"%ORDER_ID%": 'orderID' , "%ORDER_LINE_ITEM_ID%":'orderLineItemID' },
        adjustHeader: {unset:["Content-Type"],  set: ["username"] }
    }

  
};