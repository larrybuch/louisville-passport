var user_access_token = window.location.search.substring(14);
var user_info, user_id, first_name, last_name;

function getUser(){
	$.ajax({
		type: "GET",
		url: "https://api.foursquare.com/v2/users/self?oauth_token=" + user_access_token,
		dataType: "json",
		success:function(data){
			user_info = data;
			user_id = user_info.response.user.id;
			first_name = user_info.response.user.firstName;
			last_name = user_info.response.user.lastName;
			$('.info').html('<h1>Hi ' + first_name + " " + last_name + "!</h1>");
		}
	})
}

$(document).ready(function(){
	getUser();
});