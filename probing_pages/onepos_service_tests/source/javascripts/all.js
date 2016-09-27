//= require jquery 
//= require "jquery.storageapi.min"  
//= require bootstrap-sprockets
//= require "bootstrap-select.min"
//= require "_config"
//= require "_functions"
//= require_tree .

$(function() {

	$('#id_mtan_send_button').click(function(){
		location.reload();	
	});

	$('#clear-storage').click(function() {			
		storage.removeAll();
		deleteAllCookies();
		location.reload();					 
	});

	// $(window).unload(function(){
 //  		//localStorage.removeItem(key);
 //  		storage.removeAll();
	// });


	
	defaultVoID = storage.get('void');
	$('#header-mtan-msisdn').text(credentials[ENV].msisdn);
	$('#header-username').text(credentials[ENV].username);
	$('#header-void').text(defaultVoID !== null?defaultVoID:'');	


	var accessTokenData = storage.get('ACCESS_TOKEN'); 
	if(accessTokenData !== null) { 
		
		if(accessTokenData.status == 200) { 
			
			var authData = storage.get('AUTHENTICATE');
			if(authData !== null) {
				
				if(authData.status == 200 || authData.status == 201) { 
					var mtanData = storage.get('MTAN_VERIFICATION');
					if(mtanData !== null) {
						if(mtanData.status == 200) {
							showFullTests();
						} else {
							showAuthTests();
							//showFullTests();
						}
					} else {
						showMtanResponse();
						//showFullTests();
					}
				} else { 
					showAuthTests();
					//showFullTests();
				}
			} else { 
				showMtanRequest();
			}
		} else { 
			showAuthTests();
		}
	} else { 
		showMtanRequest();
	}
});

