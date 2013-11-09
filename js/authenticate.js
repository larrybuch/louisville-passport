var access_token;
function authenticateUser(){
	// let user login
	if (access_token === undefined) {
		OAuth.initialize('TGG7iuinPDYvSn25tZmo_OCBgEo');
		OAuth.popup('foursquare', function(error, result) {
	  	//handle error with error
	  	//use result.access_token in your API request
	  	access_token = result.access_token;
	  	redirect();
		});
	} else {
		redirect();
	}
}

function redirect(){
	window.location = "/louisville-passport/success/index.html" + "?access_token=" + access_token;
}

$(document).ready(function(){
	$('#signin').click(function(){
		authenticateUser();
	})
});