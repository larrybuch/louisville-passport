var access_token;
function authenticateUser(){
	if (access_token === undefined) {
		OAuth.initialize('TGG7iuinPDYvSn25tZmo_OCBgEo');
		OAuth.popup('foursquare', function(error, result) {
	  	if (result.error === error) {
	  		$('body').html('Login error with Foursquare.');
	  	}
	  	access_token = result.access_token;
	  	redirect();
		});
	} else {
		redirect();
	}
}

function redirect(){
	window.location = "http://larrybuch.github.io/louisville-passport/success/index.html" + "?access_token=" + access_token;
}

$(document).ready(function(){
	$('#signin').click(function(){
		authenticateUser();
	})
});