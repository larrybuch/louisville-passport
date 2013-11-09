var user_access_token = window.location.search.substring(14);
var user_info, user_id, first_name, last_name, venue_history;

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
			$('.info').html('<h1>Hi, ' + first_name + '!</h1>');
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
	dashboard();
}

function buildList(){
	$('.list table').append('<tr><td>Place</td><td>Been there?</td></tr>')
	for (var i=0; i<venues.length; i++){
		if (venues[i].beenHere === true) {
			$('.container').append(
				'<div class="venue one-third column"> <div class="tag"> <p>been there?</p> <p class="yes">yes</p> </div> <img src="' +
				venues[i].Photo +
				'" /><h2>' +
				venues[i].name +
				'</h2><p class="label">about</p><p class="description">' +
				venues[i].Description
				+ '</p><div class="button checkin" data-venueid=' 
				+ venues[i].VenueID
				+ '>check-in</div></div>');

		} else {
			$('.container').append(
				'<div class="venue one-third column"> <div class="tag"> <p>been there?</p> <p class="no">no</p> </div> <img src="' +
				venues[i].Photo +
				'" /><h2>'+
				venues[i].name +
				'</h2><p class="label">about</p><p class="description">' +
				venues[i].Description
				+ '</p><div class="button checkin" data-venueid=' 
				+ venues[i].VenueID
				+ '>check-in</div></div>');
		}
	}
	checkin();
}

function toggleViews(){
	$('#list').click(function(){
		$('.dashboard').css('display', 'none');
		$('.list').css('display', 'block');
		$('.venue').css('display', 'block');
	});
	$('#dashboard').click(function(){
		$('.venue').css('display', 'none');
		$('.list').css('display', 'none');
		$('.dashboard').css('display', 'block');
	});
}

function dashboard(){
	for (var i=0; i<venues.length; i++){
		if (venues[i].beenHere === true) {
			$(".visited ul").append('<li>' + venues[i].name + '</li>');
			$('.badges').append('<img src=' + venues[i].link + ' width="80" />');
		}
	}
}

var checkin_id, check;
function checkin() {
	$('.checkin').click(function(){
		checkin_id = $(this).data("venueid");
		$.ajax({
			type: "GET",
			method: "post",
			url: "https://api.foursquare.com/v2/checkins/add?venueId=" + checkin_id + "&oauth_token=" + user_access_token,
			dataType: "json",
			success:function(data){
				check = data;
				alert('you checked in to here!');
			}
		})
	})
}

$(document).ready(function(){
	loupass();
	toggleViews();
});