

var payloads = {
		
	CUSTOMER_DATA_FOR_ORDER_PUT: {  
   "customerAccountVBO":[  
      {  
         "category":"private",
         "details":{  
            "password":"TEST"
         },
         "parts":{  
            "individual":{  
               "salutation":"Herr",
               "firstName":"test",
               "familyName":"test",
               "birthDate":"2016-08-01"
            },
            "idCard":{  
               "idCardNumber":"1234567890",
               "idCardType":"GID"
            },
            "contactPoints":[  
               {  
                  "contactPerson":{  
                     "contactName":"test"
                  },
                  "postal":{  
                     "type":"CUSTOMER",
                     "street":"test",
                     "streetNumber":"1",
                     "postCode":"40567",
                     "city":"test",
                     "countryCode":"D"
                  },
                  "email":{  
                     "fullAddress":"daniel.schiffer@vodafone.com"
                  },
                  "telephone":{  
                     "countryCode":"049",
                     "subscriberNumber":"1234567",
                     "localAreaCode":"0211",
                     "fullNumber":"02111234567"
                  }
               }
            ],
            "preferences":{  
               "hasMessageForBackOffice":true,
               "manualCheck":false
            },
            "billingAccount":{  
               "invoiceDeliveryType":"EMAIL",
               "sameAsCustAddress":true,
               "hasSMSNotification":false,
               "contactPerson":"test",
               "paymentMethod":{  
                  "modeOfPayment":"DD",
                  "bankPayment":{  
                     "accountOwnerName":"BankInhaber",
                     "iban":"DE20300209001901733215",
                     "reasonForPayment":"VodafoneRechnung"
                  },
                  "bankAddress":{  
                     "street":"test",
                     "streetNumber":"1",
                     "postCode":"40567",
                     "city":"test",
                     "countryCode":"D"
                  }
               },
               "individual":{  
                  "firstName":"test",
                  "familyName":"test"
               },
               "billingAddress":{  
                  "street":"test",
                  "streetNumber":"1",
                  "postCode":"40567",
                  "city":"test",
                  "countryCode":"D"
               },
               "telephone":{  
                  "subscriberNumber":"1234567",
                  "localAreaCode":"0211",
                  "fullNumber":"02111234567",
                  "countryCode":"049"
               }
            }
         }
      }
   ]
},
BANK_DETAILS_PUT: {
     "customerPartyVBO":[
      {
        "type":"mobile",
        "details":{
          "accountId":"102622185",
          "marketCode":"MMC"
        },
        "paymentMethod":{
          "bank":{
            "accountNumber":"9290701",
            "accountOwnerName":"Clark",
            "bankCode":"26060184",
            "bankName":"Deutsche Bank AG",
            "iban":"FI1350001540000056",
            "bic":"OKOYFIHH"
          },
          "preferences":{
            "modeOfPayment":"CA"
          }
        }
      }
    ]
},
CUSTOMER_IBAN_POST: {
        "customerPartyVBO": [
            {
                "paymentMethod": {
                    "bank": {
                        "accountNumber": "9290701",
                        "bankCode": "26060184",
                        "countryCode": "DE"
                    }
                }
            }
        ]
 },
 POSTALCONTACTPOINT_VALIDATION_ADDRESS_POST : {
    "postalContactPointVBO": [
        {
            "contactPoints": {
                "contactPoint": [
                    {
                        "addressDetails": {
                            "street": "Am deestern",
                            "streetNumber": "78a",
                            "postCode": "40557",
                            "city": "Dusseldorfer"
                        }
                    }
                ]
            }
        }
    ]
},
SALES_ORDER_CREATION_POST : {
            "salesOrderVBO": [
                {
                    "details": {
                        "activationDateTime": "2015-08-13T15:06:44.848+02:00"
                    },
                    "roles": {
                        "agent": {
                            "voID": "" 
                        },
                        "customer": {
                            "type": "private"
                        }
                    },
                    "parts": {
                        "lineItems": [
                            {
                                "type": "activation",
                                "category": "post-pay"
                            }
                        ]
                    }
                }
            ]
        },
SALES_ORDER_LINEITEM_CREATION_POST: {  
   "salesOrderVBO":[  
      {  
         "parts":{  
            "lineItems":[  
               {  
                  "type":"activation",
                  "category":"post-pay"
               }
            ]
         }
      }
   ]
},
SALES_ORDER_LINEITEM_UPDATE_POST : {  
   "salesOrderVBO":[  
      {  
         "parts":{  
            "lineItems":[  
               {  
                  "type":"activation",
                  "category":"post-pay"
               }
            ]
         }
      }
   ]
},
SALES_ORDER_UPDATE_POST : {
    "salesOrderVBO": [
        {
            "actionCode": "update",
            "roles": {
                "customer": {
                    "type": "business"
                }
            }
        }
    ]
},
SALES_ORDER_PRODUCT_POST :
{
    "salesOrderVBO": [
        {
            "parts": {
                "lineItems": [
                    {
                        "productOffering": {
                            "code": "RED",
                            "specification": "tariff_group",
                            "characteristicValue": [
                                {
                                    "name": "SubsidyLevel",
                                    "value": "Subsidy-1"
                                }
                            ],
                            "product": [
                                {
                                    "actionCode" : "add",
                                    "specification": "mf_hardware",
                                    "characteristicValue": [
                                        {
                                            "name": "IMEI",
                                            "value": "6543987654675431"
                                        },
                                        {
                                            "name": "DeliveryMode",
                                            "value": "Delivery"
                                        }
                                    ]
                                },
                                {
                                    "actionCode" : "add",
                                    "specification": "mf_hardware_sim",
                                    "characteristicValue": [
                                        {
                                            "name": "simSerialNumber",
                                            "value": "10120410200031"
                                        }
                                    ]
                                },
                                {
                                    "actionCode" : "add",
                                    "code": "VFDISC1",
                                    "specification": "discount"
                                },
                                {
                                    "actionCode" : "add",
                                    "code": "VFDISC2",
                                    "specification": "discount"
                                },
                                {
                                    "actionCode" : "add",
                                    "code": "JWLPROMO1",
                                    "specification": "promotion"
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
},
SALES_ORDER_SIM_SWAP_POST : {
    "salesOrderVBO": [
        {
            "orderItems": {
                "orderItem": [
                    {
                        "details": {
                            "accountId": "114",
                            "marketCode": "MMO",
                            "type": "mobile",
                            "msisdn": "4915209001105",
                            "dealerCode": "49900004"
                        },
                        "specification": {
                            "simNumber": "10210549828686",
                            "newSIMCardSize": "NP",
                            "newSIMCardType": "064",
                            "simSwapReason": "GE",
                            "waiveChargeIndicator": true,
                 "newSIMNumber": "",
                            "swapMethod": "P"
                        },
                        "shipment": {
                            "contactPoints": {
                                "addressType": "U"
                            }
                        }                 
   }
                ]
            }
        }
    ]
},
POSTALCONTACTPOINT_ADDRESS_PUT :{"postalContactPointVBO":[{"details":{"accountId":"102622185","msisdn":"491720410632","marketCode":"MMC"},"contactPoints":{"contactPoint":[{"addressType":"CUSTOMER","addressDetails":{"street":"Achenbachstr.","streetNumber":"55","postCode":"40237","city":"Düsseldorf","country":"Deutschland"},"copyLegalToBillingAddress":false,"copyLegalToSubscrAddress":false}]}}]},
POSTALCONTACTPOINT_CONTACT_DATA_PUT:{"postalContactPointVBO":[{"details":{"accountId":"102622185","msisdn":"491720410632","marketCode":"MMC"},"contactPoints":{"contactPoint":[{"contactMedium":{"contactName":"Emma Emma","contactType":"CUSTOMER","emailAddress":"emma6@emma.de"}}]}}]},
SUBSCRIPTION_SHARING_GROUP_POST:{
    "subscriptionVBO": {
        "sharingGroup": {
            "activityCode": "RMG",
            "sharingGroupList": [
                {
                    "groupID": "500000011533354",
                    "groupType": "DS_NS",
                    "groupName": "MyVFREDGroup",
                    "marketCode": "MMC",
                    "memberList": [
                        {
                            "accountID": "102622185",
                            "groupTariffType": "DSM1N",
                            "subscriptionID": "491740347443",
                            "tariffCode": "REDPLVH5",
                            "effectiveDate": "2016-01-19"
                        }
                    ]
                }
            ]
        }
    }
},
SUBSCRIPTION_SUBSCRIBER_DATA_FOR_ORDER_POST: {
    "subscriptions": [
        {
            "details": {
                "reservedPhoneNumber": {
                    "ndc": "172",
                    "subscriberNumber": "46578976"
                }
            },
            "contractDetails": {
                "startDate": "2015-01-01",
                "duration": "24"
            },
            "specification": {
                "ultraCardCount" : 2,
                "ultraCards": [
                    {
                        "simNumber": "10210549828686" 
                    },
                    {
                        "simNumber": "10210549828687"
                     }
                 ]
            },
            "security": {
                "password": "Test123456"
            },
            "preferences": {
                "copyLegalToSubscrAddress": true,
                "copyBillingToSubscrAddress": false,
                "desiredOverview": "Mini",
                "desiredNumber": "Complete",
                "displayedNumber": "EnableCaseToCase"
            },
            "porting": {
                "individual": {
                    "firstName": "Jonh",
                    "familyName": "Johnson",
                    "birthDate": "1990-01-01"
                },
                "oldServiceProvider": "TMOB",
                "oldCustomerNumber": "10033232",
                "quickPorting": true,
                "telephone": {
                    "countryCode": "49",
                    "localAreaCode": "172",
                    "subscriberNumber": "1234567"
                },
                "belatedPorting": "false",
                "phoneNumbers": [
                    {
                        "localAreaCode": "172"
                    }
                ]
            },
            "specialPorting": {
                "individual": [
                    {
                        "firstName": "Sarah",
                        "familyName": "Connor"
                    },
                    {
                        "firstName": "Max",
                        "familyName": "Connor"
                    },
                    {
                        "firstName": "Jonh",
                        "familyName": "Connor"
                    }
                ],
                "address": {
                    "type": "HOMEZONE",
                    "street": "Roadstraße",
                    "streetNumber": "23",
                    "postCode": "12345",
                    "city": "Citystadt",
                    "countryCode": "D"
                },
                "numberOfAnalogLines": 5,
                "numberOfDigitalLines": 5,
                "landPorting": {
                    "provider": "TMOB",
                    "desiredPortingDate": "2015-01-02",
                    "numbers": {
                        "countryCode": "49",
                        "localAreaCode": "172",
                        "mainPhoneNumber": "12233443222",
                        "additionalPhoneNumber": [
                            "0211123450",
                            "0211123451",
                            "0211123452"
                        ],
                        "portAllNumbers": true
                    }
                }
            },
            "address": {
                "type": "SUBSCRIBER",
                "street": "Roadstraße",
                "streetNumber": "23",
                "streetNumberSuffix": "a",
                "postCode": "12345",
                "city": "Citystadt",
                "countryCode": "D"
            },
            "phoneBook": {
                "individual": {
                    "title": "Dr",
                    "salutation": "Herr",
                    "firstname": "Stephanie",
                    "familyName": "Müller",
                    "prefix": "Vande",
                    "suffix": "jun.",
                    "aristocraticTitle": "Grafvon",
                    "occupation": "doctor"
                },
                "address": {
                    "street": "Musterstraße",
                    "streetNumber": "23",
                    "streetNumberSuffix": "a",
                    "postCode": "12345",
                    "city": "CityStadt",
                    "subLocality": "KreisStadthausen",
                    "countryCode": "D"
                },
                "searchTerm": "Feuerwehr",
                "entries" : [ 
                           {
                               "accessNumber": "23456761",
                               "entryType": "CommericalDatabase",
                               "usageType": "Phone",
                               "inverseSearch": true
                            } 
                ],
                "publicationMedia": "Printed",
                "publicationType": "CityAndStreet",
                "informationExchange": "Complete",
                "advertisingIndicator": false
            }
        }
    ]
},
USER_ACCOUNT_PUID_CREATION_POST: {
    "userAccountVBO": [
        {
            "credential": {
                "username": "Vodafone"
            },
            "permissions": {
                "businessRole":"Agent",
                "voIDList": [
                    {
                        "voID": "31004005"
                    }
                ]
            },
            "onlineUser": {
             "mtanPhoneNumber": "4915201849666", //4915201849656
                "title": "eShopUser",
                "firstName": "Jack",
                "familyName": "Dawson"
            },
            "shop": {
                "rmsID": "200527591" //200527593 200527591
            }
        }
    ]
},
USER_ACCOUNT_PUID_UPDATE_POST: 
{
    "userAccountVBO": [
        {
            "onlineUser": {
                "mtanPhoneNumber": "4915220450510",
                "title": "eShopUser",
                "firstName": "Jack",
                "familyName": "Dawson"
            },
            "shop": {
                "rmsID": "672893721"
            }
        }
    ]
},
USER_ACCOUNT_PUID_DEACTIVATION_POST: null,






};

var urlExtensions = {
	INTEM_TASK_RULESET_GET :  "entity-name=newCustomer_CTA,ordersOverView_CTA,customerSearch_CTA,otelo_CTA,kabelDE_CTA,salesChannelRights,businessRights,voidList,mdd_newCustomer_CTA,mdd_customerSearch_CTA,mdd_ordersOverview_CTA,mdd_otelo_CTA,mdd_kabelDE_CTA,mdd_vodafoneDE_CTA,mdd_FHOnline_CTA,mdd_VFInfoworld_CTA,mdd_customerBackofficeTool_CTA,mdd_WORE_CTA,mdd_statistics_CTA,mdd_userManager_CTA",

};