var user_access_token = window.location.search.substring(14);
var user_info, user_id, first_name, last_name, venue_history;
var venues = [
	{name: 'Galt House Hotel', beenHere: 0},
	{name: "Muhammad Ali Center", beenHere: 0},
	{name: "Kentucky Museum of Art and Craft (KMAC)", beenHere: 0},
	{name: "Churchill Downs", beenHere: 0}, 
	{name: "Joe Huber's Family Farm & Rest.", beenHere: 0},
	{name: "Louisville Slugger Museum & Factory", beenHere: 0}, 
	{name: "Belle of Louisville", beenHere: 0}, 
	{name: "Cave Hill National Cemetery", beenHere: 0}, 
	{name: "Kentucky Derby Museum", beenHere: 0},
	{name: "Kentucky Science Center", beenHere: 0}, 
	{name: "Louisville Mega Cavern", beenHere: 0}
]

function loupass(){
	getUser();
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
			if (venue_history[i].venue.name === venues[j].name){
				venues[j].beenHere = true;
			}
		}
	}
	for (var i=0; i<venues.length; i++){
		if(venues[i].beenHere === 0) {
			venues[i].beenHere = false;
		}
	}
	buildList();
}

function buildList(){
	$('.list table').append('<tr><td>Place</td><td>Been there?</td></tr>')
	for (var i=0; i<venues.length; i++){
		$('.list table').append('<tr><td>' + venues[i].name + '</td><td>' + venues[i].beenHere + '</td></tr>')
	}
}

$(document).ready(function(){
	loupass();
});