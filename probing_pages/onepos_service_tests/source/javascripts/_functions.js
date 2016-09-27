/*
	Show first window for request mTAN
**/
function showMtanRequest() {
	console.log("showMtanRequest");
	$(".container").hide();
	var modal = $("#mtanRequest");	
	$('.mtan-request-btn').click(function() {
		console.log("request done");		
		requestMtan();		 
	});
	modal.modal({backdrop: 'static', keyboard: false});
}


/*
	Show second window for enter mTAN
**/
function showMtanResponse() {
	$(".container").hide();
	var modal = $("#mtanResponse");	
	$('.mtan-response-btn').click(function() {		
		var mtan = $("#mtan-input").val();
		if(mtan) {				
			checkMtan(mtan);
		}	 
	});
	modal.modal({backdrop: 'static', keyboard: false});
	modal.on('shown.bs.modal', function () {
	    $('#mtan-input').focus();
	});	
}


/*
	Make request token, set coockie and authenticate
**/
function requestMtan() {
	$("#id_modal-title").html("loading...");
	var request = $.ajax({			   
	    url: authServices.ACCESS_TOKEN.apiUrl,
	    headers: authServices.ACCESS_TOKEN.header,
	    method: 'POST',
	    dataType: 'json',
	    data: authServices.ACCESS_TOKEN.payload,
	    beforeSend: function(){			        
	        time = new Date();
	    }
	}).then(function( data,status,xhr ) { 

		sleep(1000);
  		var accessTokenData = authServices.ACCESS_TOKEN;
  		accessTokenData.status = xhr.status;
  		accessTokenData.response = data;
  		accessTokenData.loadingTime = new Date() - time;
   		console.log("access_token : " + data.access_token);
  		storage.set('ACCESS_TOKEN',accessTokenData);
  		storage.set('access_token',data.access_token);


  		authServices.ACCESS_TOKEN_SET_COOKIE.header['x-vf-seltoken'] = data.access_token;
  		
  		$.ajax({			   
		    url: authServices.ACCESS_TOKEN_SET_COOKIE.apiUrl,
		    headers: authServices.ACCESS_TOKEN_SET_COOKIE.header,
		    method: 'GET'		    
		});
  		
  	}).then(function(){
  		sleep(1000);
  		console.log("Inside then of second response: ");
  	 return	$.ajax({			   
		    url: authServices.AUTHENTICATE.apiUrl,
		    headers: getRequestHeader(),
		    method: "POST",
		    dataType: "json",	    
		    data: JSON.stringify(authServices.AUTHENTICATE.payload),
		    beforeSend: function(){			        
		        time = new Date();
		    }
  		});
  	}).done(function( data,status,xhr ) { 
  		sleep(1000);
		console.log("Inside done");	
		var authData = authServices.AUTHENTICATE;
		authData.header = getRequestHeader();
		authData.status = xhr.status; 
		authData.response = data;
		authData.loadingTime = new Date() - time; 
	  	storage.set('AUTHENTICATE',authData);
	  	console.log("x-transaction-id: ");
	  	console.log(xhr.getResponseHeader('x-transaction-id'));
	  	storage.set('x-transaction-id',xhr.getResponseHeader('x-transaction-id'));

	  	if(authData.response.securityTokenVBO.credentials.authenticationStatus == 'fullyAuthenticated') {
	  		//Only by development! It can be removed later, keep only else case 
	  		var mtanData = authServices.MTAN_VERIFICATION;
	  		mtanData.payload = { info: 'Login without MTAN due to already fullyAuthenticated' };
	  		mtanData.status = 200;
	  		storage.set('MTAN_VERIFICATION',mtanData);
	  		//getUserData();
	  		location.reload();
		    		    
	  	} else {
	  		showMtanResponse();
	  	}
  			  	
	}).fail(function(data,status,xhr) { 
		console.log("inside fail");		
		var authData = authServices.AUTHENTICATE;
		authData.header = getRequestHeader();
		authData.status = data.status; 
		authData.response = data.responseJSON; 		
	  	storage.set('AUTHENTICATE',authData);

	  	$("#id_modal-title").html("request failed");
	  	$("#id_mtan-request-btn").html("retry");
	  	storage.removeAll();
	  	deleteAllCookies();		

	   // location.reload();
	 }).always(function(data,status,xhr) { 
	 	var authData = authServices.AUTHENTICATE;
	 	setUsername(); 
	  });

	 console.log("Request: ");
	 console.log(request);

}
/*
	Make mTAN verification
**/
function checkMtan(mtan) {
	if(storage.isSet('access_token')) {		
		storage.set('mtan',mtan);		

		var mtanData = authServices.MTAN_VERIFICATION;
		mtanData.payload.securityTokenVBO.credentials.mtan = mtan;
		mtanData.header = getRequestHeader(mtanData.adjustHeader);		

		$.ajax({			   
		    url: authServices.MTAN_VERIFICATION.apiUrl + "?username="+getUsername(), //TODO: check foe eweb5
		    headers: mtanData.header,
		    method: "POST",
		    dataType: "json",	    
		    data: JSON.stringify(mtanData.payload),
		    beforeSend: function(){			        
		        time = new Date();
		    },
		    success: function(data,status,xhr){  
		    	mtanData.response = data;
		    	mtanData.status = xhr.status;
		    	mtanData.loadingTime = new Date() - time;
		    	storage.set('MTAN_VERIFICATION',mtanData);		    	
		    	getUserData();
		    },
		    error: function(data){
		      	mtanData.response = data;
		      	mtanData.status = data.status;
		      	mtanData.loadingTime = new Date() - time;
		      	storage.set('MTAN_VERIFICATION',mtanData);
		      	//location.reload();
			}
		});
	}
}

/*
	Make calls from services (second group) 
**/
function runTest(k,v) {
	var testData = v;

	//cases a bug
	if(testData.urlExtension !== undefined) {
		testData.apiUrl += "?"+v.urlExtension;
	}
	
	if(testData.apiUrl.indexOf("%") > 0) {				
		testData.apiUrl = replacePlaceHolders(testData.apiUrl,testData.placeHolders,k);
	}


	testData.header = getRequestHeader(testData.adjustHeader);

	//testData.header= storage.get('AUTHENTICATE').header;

	var params = {			    
	    method: testData.ajaxMethod,
	    url: testData.apiUrl,
	    headers: testData.header,
	    beforeSend: function(){			        
	        time = new Date();
	    },
	};
	
	if(testData.ajaxMethod !== undefined && testData.ajaxMethod == "POST") {				
		params.data = JSON.stringify(testData.payload);
		params.dataType = 'json';				
	}

	$.ajax(params).done(function(data,status,xhr ) { 
		console.log("----------Inside done");
		testData.response = data;
		testData.status = xhr.status; 						
		$.each(v.dataPanels, function( kk, vv ) { 
	    	$('#data-'+k).find('.data-'+vv).find('pre').text(JSON.stringify(testData[vv], null, 4)); 
	    });
		setStatus(k,xhr.status);
		if(testData.callback) {
			window[testData.callback](data,status,xhr);
		}				
	}).fail(function(data,status,xhr) {
		console.log("----------Inside fail"); 		
		testData.response = data;
		testData.status = data.status;
		setStatus(k,data.status);


		//  set data panels or hide if empty
		$.each(v.dataPanels, function( kk, vv ) { 
			if(testData[vv] === undefined || testData[vv] === null) {
				$('#data-'+k).find('.data-'+vv).hide();
			} else {
				$('#data-'+k).find('.data-'+vv).find('pre').text(JSON.stringify(testData[vv], null, 4));
			}			    	 
	    });

	}).always(function(data,status,xhr) { 
	 	$("#row-"+k).find(".service-name").find("a").attr("data-toggle","collapse");	    
  		//storage.set(k,testData);
  		testData.loadingTime = new Date() - time;
		setLoadingTime(k,testData.loadingTime);
	});	
}





// CALLBACKS
/*
	Callback save orderID and orderLineItemID after create new order (ORDER_CREATION)
**/
function setNewOrder(data,status,xhr) {
	if(data.salesOrderVBO[0].orderID !== undefined) {
		storage.set('orderID', data.salesOrderVBO[0].orderID);
	}
	if(data.salesOrderVBO[0].parts.lineItems[0].orderLineItemID !== undefined) {
		storage.set('orderLineItemID', data.salesOrderVBO[0].parts.lineItems[0].orderLineItemID);
	}
}

/*
	Callback save default voID after response user data
**/
function setVOID(data,status,xhr) {
	setDefaultVoid(data.userAccountVBO[0].permissions.voIDList[0].voID);
}


/*
	Save username
**/
function setUsername(username) {
	if(username !== undefined) {
		storage.set('username', username);
	} else {
		storage.set('username', authServices.AUTHENTICATE.payload.securityTokenVBO.credentials.username);		
	}
	
}

/*
	Get username
**/
function getUsername() {
	return storage.get('username');
}

/*
	Save default voID after response user data
**/
function setDefaultVoid(voID) {
	storage.set('void', voID);
	$('#header-void').text(voID);
	defaultVoID = voID;
}


/*
	Show only first group calls (authServices) in case failure one of them 
**/
function showAuthTests() {
	$.each(authServices, function( k, v ) {
		var data = storage.get(k); 
		if(data !== null) { 
			var row = getPanelRow(k, v);		
			$('#accordion').append(row);
			if(data.status) {
				setStatus(k,data.status); //console.log(k,data);
			}			
			
			$('#data-'+k).find('.data-apiUrl').find('pre').text(data.apiUrl);
			$('#data-'+k).find('.data-header').find('pre').text(JSON.stringify(data.header, null, 4));
			$('#data-'+k).find('.data-payload').find('pre').text(JSON.stringify(data.payload, null, 4));
			$('#data-'+k).find('.data-response').find('pre').text(JSON.stringify(data.response, null, 4));
			setLoadingTime(k,data.loadingTime);	
		}		
		$("#row-"+k).find(".service-name").find("a").attr("data-toggle","collapse"); 	

	});
}

/*
	Show all calls (authServices + services) 
**/
function showFullTests() {
	showAuthTests();

	$.each(services, function( k, v ) {
		var row = getPanelRow(k,v);
		$('#accordion').append(row);

		setStatus(k,false);

		$("#row-"+k).find(".service-name").find("a").click(function(e) {
			e.preventDefault();
		});

		$("#row-"+k).find(".btn-run").click(function() {						
			runTest(k,v);								 
		});
		//$("#row-"+k).find(".service-name").find("a").attr("data-toggle","collapse");	
	});
	
}


/*
	Get partial for data panel box
**/
function getDataPanel(k,v) { 
	return '<div class="panel panel-default">'+
			  '<div class="panel-heading"><h5 class="panel-title">'+v.label+'</h5></div>'+
			  '<div class="panel-body data-'+k+'"><pre>'+(v.val !== null ? v.val : "")+'</pre></div>'+			  
			'</div>';
}

/*
	Get partial for data panel row
**/
function getPanelRow(service,requestData) {


	//output for normal services
	var output = '<div class="panel" id="row-'+service+'">'+
      '<div class="panel-heading service-heading clearfix">'+
      '<span class="label label-default labes-status"></span>'+
        '<h4 class="panel-title service-name">'+
          '<a data-parent="#accordion" href="#data-'+service+'">'+getServiceName(service)+'</a>'+
        '</h4>'+
        '<button type="button" class="btn btn-custom pull-right btn-run">Run test</button>'+
        '<div class="loading-time"></div>'+
      '</div>'+
      '<div id="data-'+service+'" class="panel-collapse collapse">'+
        '<div class="panel-body">';

    if(requestData !== undefined) {
    	$.each(requestData.dataPanels, function( k, v ) { 
	    	output += getDataPanel(v,dataPanels[v]);
	    });
    }    

    output += '</div>'+
    '</div>';


    //output for services that needs customerId and password

    var output2 = '<div class="panel" id="row-'+service+'">'+
      '<div class="panel-heading service-heading clearfix">'+
      '<span class="label label-default labes-status"></span>'+
        '<h4 class="panel-title service-name">'+
          '<a data-parent="#accordion" href="#data-'+service+'">'+getServiceName(service)+'</a>'+
        '</h4>'+
        '<button type="button" class="btn btn-custom pull-right btn-run">Run test</button>'+
        '<input type="text" id="input_password_'+service+'" name="password"   class="pull-right" style="margin: 2px;border:2px;border-raduis:4px" placeholder="password">'+
        '<input type="text" id="input_customerId_'+service+'" name="customerId" class="pull-right" style="margin: 2px;border:2px;border-raduis:4px" placeholder="customer ID">'+
        
        '<div class="loading-time"></div>'+
      '</div>'+
      '<div id="data-'+service+'" class="panel-collapse collapse">'+
        '<div class="panel-body">';

    if(requestData !== undefined) {
    	$.each(requestData.dataPanels, function( k, v ) { 
	    	output2 += getDataPanel(v,dataPanels[v]);
	    });
    }    

    output2 += '</div>'+
    '</div>';

    //output for services that needs customerId only and not password

    var output3 = '<div class="panel" id="row-'+service+'">'+
      '<div class="panel-heading service-heading clearfix">'+
      '<span class="label label-default labes-status"></span>'+
        '<h4 class="panel-title service-name">'+
          '<a data-parent="#accordion" href="#data-'+service+'">'+getServiceName(service)+'</a>'+
        '</h4>'+
        '<button type="button" class="btn btn-custom pull-right btn-run">Run test</button>'+
        '<input type="text" id="input_customerId_'+service+'" name="customerId" class="pull-right" style="margin: 2px;border:2px;border-raduis:4px;margin-right:180px" placeholder="customer ID">'+
        
        '<div class="loading-time"></div>'+
      '</div>'+
      '<div id="data-'+service+'" class="panel-collapse collapse">'+
        '<div class="panel-body">';

    if(requestData !== undefined) {
    	$.each(requestData.dataPanels, function( k, v ) { 
	    	output3 += getDataPanel(v,dataPanels[v]);
	    });
    }    

    output3 += '</div>'+
    '</div>';


    //output for services that needs customerId only and not password

    var output4 = '<div class="panel" id="row-'+service+'">'+
      '<div class="panel-heading service-heading clearfix">'+
      '<span class="label label-default labes-status"></span>'+
        '<h4 class="panel-title service-name">'+
          '<a data-parent="#accordion" href="#data-'+service+'">'+getServiceName(service)+'</a>'+
        '</h4>'+
        '<button type="button" class="btn btn-custom pull-right btn-run">Run test</button>'+
        '<input type="text" id="input_subscriberId_'+service+'" name="customerId" class="pull-right" style="margin: 2px;border:2px;border-raduis:4px" placeholder="Subscriber ID">'+
        '<input type="text" id="input_subscriberType_'+service+'" name="customerId" class="pull-right" style="margin: 2px;border:2px;border-raduis:4px" placeholder="type">'+
        '<div class="loading-time"></div>'+
      '</div>'+
      '<div id="data-'+service+'" class="panel-collapse collapse">'+
        '<div class="panel-body">';

    if(requestData !== undefined) {
    	$.each(requestData.dataPanels, function( k, v ) { 
	    	output4 += getDataPanel(v,dataPanels[v]);
	    });
    }    

    output4 += '</div>'+
    '</div>';


    //output for services that needs customerId only and not password

    var output5 = '<div class="panel" id="row-'+service+'">'+
      '<div class="panel-heading service-heading clearfix">'+
      '<span class="label label-default labes-status"></span>'+
        '<h4 class="panel-title service-name">'+
          '<a data-parent="#accordion" href="#data-'+service+'">'+getServiceName(service)+'</a>'+
        '</h4>'+
        '<button type="button" class="btn btn-custom pull-right btn-run">Run test</button>'+
        '<input type="text" id="input_documentId_'+service+'" name="customerId" class="pull-right" style="margin: 2px;border:2px;border-raduis:4px" placeholder="Document ID">'+
        '<input type="text" id="input_documentName_'+service+'" name="customerId" class="pull-right" style="margin: 2px;border:2px;border-raduis:4px" placeholder="Document Name">'+
        '<div class="loading-time"></div>'+
      '</div>'+
      '<div id="data-'+service+'" class="panel-collapse collapse">'+
        '<div class="panel-body">';

    if(requestData !== undefined) {
    	$.each(requestData.dataPanels, function( k, v ) { 
	    	output5 += getDataPanel(v,dataPanels[v]);
	    });
    }    

    output5 += '</div>'+
    '</div>';

    //output for services that needs caddress info

    var output6 = '<div class="panel" id="row-'+service+'">'+
      '<div class="panel-heading service-heading clearfix">'+
      '<span class="label label-default labes-status"></span>'+
        '<h4 class="panel-title service-name">'+
          '<a data-parent="#accordion" href="#data-'+service+'">'+getServiceName(service)+'</a>'+
        '</h4>'+
        '<button type="button" class="btn btn-custom pull-right btn-run">Run test</button>'+
        '<div style = "float: bottom; margin-left:155px">'+
        '<input type="text" id="input_street_'+service+'" name="customerId" class="pull-down" style="margin: 2px;border:2px;border-raduis:4px" placeholder="Street">'+
        '<input type="text" id="input_streetNumber_'+service+'" name="customerId" class="pull-down" style="margin: 2px;border:2px;border-raduis:4px" placeholder="Street Number">'+
        '<input type="text" id="input_postalCode_'+service+'" name="customerId" class="pull-down" style="margin: 2px;border:2px;border-raduis:4px" placeholder="Postal Code">'+
        '<input type="text" id="input_city_'+service+'" name="customerId" class="pull-down" style="margin: 2px;border:2px;border-raduis:4px" placeholder="City">'+
        '</div>'+
        '<div class="loading-time"></div>'+
      '</div>'+
      '<div id="data-'+service+'" class="panel-collapse collapse">'+
        '<div class="panel-body">';

    if(requestData !== undefined) {
    	$.each(requestData.dataPanels, function( k, v ) { 
	    	output6 += getDataPanel(v,dataPanels[v]);
	    });
    }    

    output6 += '</div>'+
    '</div>';

    //output for subscription_productSubscription_get

    var output7 = '<div class="panel" id="row-'+service+'">'+
      '<div class="panel-heading service-heading clearfix">'+
      '<span class="label label-default labes-status"></span>'+
        '<h4 class="panel-title service-name">'+
          '<a data-parent="#accordion" href="#data-'+service+'">'+getServiceName(service)+'</a>'+
        '</h4>'+
        '<button type="button" class="btn btn-custom pull-right btn-run">Run test</button>'+
        '<div style="float:bottom">'+
        '<input type="text" id="input_firstName_'+service+'" name="customerId" class="pull-down" style="margin: 2px;border:2px;border-raduis:4px" placeholder="first-name">'+
        '<input type="text" id="input_familyName_'+service+'" name="customerId" class="pull-down" style="margin: 2px;border:2px;border-raduis:4px" placeholder="family-name">'+
        '<input type="text" id="input_street_'+service+'" name="customerId" class="pull-down" style="margin: 2px;border:2px;border-raduis:4px" placeholder="street">'+
        '<input type="text" id="input_streetNumber_'+service+'" name="customerId" class="pull-down" style="margin: 2px;border:2px;border-raduis:4px" placeholder="street-number">'+
        '<input type="text" id="input_postCode_'+service+'" name="customerId" class="pull-down" style="margin: 2px;border:2px;border-raduis:4px" placeholder="post-code">'+
        '<input type="text" id="input_birthDate_'+service+'" name="customerId" class="pull-down" style="margin: 2px;border:2px;border-raduis:4px" placeholder="birth-date">'+
        '</div>'+
        '<div class="loading-time"></div>'+
      '</div>'+
      '<div id="data-'+service+'" class="panel-collapse collapse">'+
        '<div class="panel-body">';

    if(requestData !== undefined) {
    	$.each(requestData.dataPanels, function( k, v ) { 
	    	output7 += getDataPanel(v,dataPanels[v]);
	    });
    }    

    output7 += '</div>'+
    '</div>';



    //output for captcha verification

    var output8 = '<div class="panel" id="row-'+service+'">'+
      '<div class="panel-heading service-heading clearfix">'+
      '<span class="label label-default labes-status"></span>'+
        '<h4 class="panel-title service-name">'+
          '<a data-parent="#accordion" href="#data-'+service+'">'+getServiceName(service)+'</a>'+
        '</h4>'+
        '<button type="button" class="btn btn-custom pull-right btn-run">Run test</button>'+
        '<input type="text" id="input_userName_'+service+'" name="customerId" class="pull-right" style="margin: 2px;border:2px;border-raduis:4px" placeholder="user name">'+
        '<input type="text" id="input_captcha_'+service+'" name="customerId" class="pull-right" style="margin: 2px;border:2px;border-raduis:4px" placeholder="captcha">'+     
        '<div class="loading-time"></div>'+
      '</div>'+
      '<div id="data-'+service+'" class="panel-collapse collapse">'+
        '<div class="panel-body">';

    if(requestData !== undefined) {
    	$.each(requestData.dataPanels, function( k, v ) { 
	    	output8 += getDataPanel(v,dataPanels[v]);
	    });
    }    

    output8 += '</div>'+
    '</div>';


    var name = getServiceName(service);
    if(name === 'CUSTOMER DETAILED VIEW GET'|| name === 'CUSTOMER OVERVIEW GET' ||
    	name === 'CUSTOMER PARTY BANK DETAILS GET' || name === 'INVOICE BILLED USAGE GET' ||
    	name === 'POSTALCONTACTPOINT CONTACT DATA GET' || 	name === 'POSTALCONTACTPOINT CONTACT DATA PUT' ||
    	name === 'INVOICE BILLEDUSAGE GET'){
    	return output2;
    }else if(name === 'POSTALCONTACTPOINT ADDRESS GET' || name === 'POSTALCONTACTPOINT ADDRESS PUT' ){
    	return output3;
    }else if(name === 'SUBSCRIPTION SUBSCRIBER DETAILED VIEW GET'){
    	return output4;
    }else if(name === 'CUSTOMER DOCUMENT GET'){
    	return output5;
    }else if(name === 'PRODUCT OFFERING PRODUCT AVAILABILITY GET'){
    	return output6;
    }else if(name === 'SUBSCRIPTION PRODUCTSUBSCRIBTION GET' || name === 'SUBSCRIPTION SIM GET'){
    	return output7;
    }else if(name === 'CAPTCHA VERIFICATION GET'){
    	return output8;
    }else{
    	return output;

    }


}


/*
	Get service name for display in data panel
**/
function getServiceName(service) {
	var stringParts = service.split("_"); 	
	return stringParts.join(' ');
}


/*
	Set status, row background and disabling of the run button
**/
function setStatus(service,status) {
	var target = $('#row-'+service);
	if(status == 200 || status == 201 || status == 204) { 
		target.addClass('panel-success');
		target.find('.labes-status').removeClass('label-default').addClass('label-success').text(status);
		target.find('.btn-run').attr('disabled','disabled');
	} 
	else if(status === false) {
		target.addClass('panel-default');
		target.find('.labes-status').html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
	} else {
		target.addClass('panel-danger');
		target.find('.labes-status').removeClass('label-default').addClass('label-danger').text(status);
	}
	
}

/*
	Display call loading time
**/
function setLoadingTime(service,loadingTime) {
	var target = $('#row-'+service);
	if(loadingTime !== undefined) {
		target.find('.panel-heading').find('div').text('Loading time: '+loadingTime+' ms');
	}
}

/*
	Get call headers
**/
function getRequestHeader(data) { 
	var header =  JSON.parse(JSON.stringify(requestHeader)); 
	var access_token = storage.get('access_token');
	header.Authorization = "Bearer " + access_token;
	var xTransactionId = storage.get('x-transaction-id');
	header["x-transaction-id"] = xTransactionId;
	if(data !== undefined) {
		
		if(data.unset !== undefined) {
	    	$.each(data.unset, function( k, v ) { 
		    	header[v] = undefined;
		    });
	    }
	    if(data.set !== undefined) {
	    	$.each(data.set, function( k, v ) {  
	    		if(v == "username") {
	    			header.username = storage.get('username');	
	    		} 
	    		///header.Authorization = storage.get('access_token');
	    		// + other special cases to implement here
	    		
		    });
	    }
	}	
	return header;

}

/*
	Replace placeholders in call URI
**/
function replacePlaceHolders(str, data,service) { 
	var newData = {};
	$.each(data, function( k, v ) {  		
		newData[k] = storage.get(v);		
    });

	var output = str.replace(/%[^%]+%/g, function(match) {


		if(match === '%USER_NAME%'){
			var username = '#input_userName_'+service+'';
			return $(username).val().split(' ').join('%');
		}else if(match === '%CAPTCHA_TEXT%'){
			var captchatext = '#input_captcha_'+service+'';
			return $(captchatext).val();
		}else if(match === '%FIRST_NAME%'){
			var firstName = '#input_firstName_'+service+'';
			return $(firstName).val().split(' ').join('%');
		}else if(match === '%FAMILY_NAME%'){
			var famName = '#input_familyName_'+service+'';
			return $(famName).val().split(' ').join('%');
		}else if(match === '%BIRTH_DATE%'){
			var birthdate = '#input_birthDate_'+service+'';
			return $(birthdate).val();
		}else if(match === '%POST_CODE%'){
			var postCode = '#input_postCode_'+service+'';
			return $(postCode).val().split(' ').join('%');
		}else if(match === '%STREET%'){
			var street = '#input_street_'+service+'';
			return $(street).val().split(' ').join('%');
			//return output;

		}else if(match === '%STREET_NUMBER%'){
			var streetNum = '#input_streetNumber_'+service+'';
			return $(streetNum).val();
		}else if(match === '%POSTAL_CODE%'){
			var postalCode = '#input_postalCode_'+service+'';
			return $(postalCode).val();
		}else if(match === '%CITY%'){
			var city = '#input_city_'+service+'';
			return $(city).val();
		}else if(match === '%DOCUMENT_NAME%'){
			var docname = '#input_documentName_'+service+'';
			return $(docname).val();
		}else if(match === '%DOCUMENT_ID%'){
			var docid = '#input_documentId_'+service+'';
			return $(docid).val();
		}else if(match === '%TYPE%'){
			var type = '#input_subscriberType_'+service+'';
			return $(type).val();
		}else if(match === '%SUBSCRIBER_ID%'){
			var subsc = '#input_subscriberId_'+service+'';
			return $(subsc).val();
		}else if(match === '%CUSTOMER_ID%' ){
			var cust = '#input_customerId_'+service+'';
			console.log("cust = " +cust);
			return $(cust).val();
		}else if(match === '%CUSTOMER_PASSWORD%'){
			var pass = '#input_password_'+service+'';
			console.log(pass);
			return $(pass).val();
		}else if (match in newData && newData[match] !== null) {
	        return(newData[match]);
	    } else {
	        return("");
	    }
	});
	return(output);
}


  function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }

  function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}