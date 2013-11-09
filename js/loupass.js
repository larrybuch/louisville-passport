var user_access_token = window.location.search.substring(14);
var user_info, user_id, first_name, last_name, venue_history;

var venues = ['Galt House Hotel'];
var matches = {
	'Galt House Hotel': 0
}

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
			getHistory();
		}
	})
};

function getHistory(){
	$.ajax({
		type: "GET",
		url: "https://api.foursquare.com/v2/users/" + user_id + "/venuehistory?oauth_token=" + user_access_token,
		dataType: "json",
		success:function(data){
			venue_history = data.response.venues.items;
			checkPlace();
		}
	})
};

function checkPlace(){
	for (var i=0; i<venue_history.length; i++) {
		for (var j=0; j<venues.length; j++){
			if (venue_history[i].venue.name === venues[j]){
				matches.venues[j] = venue_history[i].beenHere;
			}
		}
	}
}


$(document).ready(function(){
	getUser();
});