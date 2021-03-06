//set up tabletop

var venues;
window.onload = function() { init() };
  var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?key=0Au6tPA8zI59ndGFLMGNUajg4OWk3Q3E1V3V2X2hpZFE&single=true&gid=0&output=html';

  function init() {
    Tabletop.init( { key: public_spreadsheet_url,
                     callback: showInfo,
                     simpleSheet: true } )
  }

  function showInfo(data, tabletop) {
    venues = data;
    loupass();
  }


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

var category;
var badges = [{'category': 'art', 'link': "/img/art.svg", 'count': 0}, {'category': 'business', 'link': "/img/business.svg", 'count': 0}, {'category': 'civic', 'link': "/img/civic.svg", 'count': 0}, {'category': 'culture', 'link': "/img/culture.svg", 'count': 0}, {'category': 'festival', 'link': "/img/festival.svg", 'count': 0}, {'category': 'science', 'link': "/img/science.svg", 'count': 0}, {'category': 'sports', 'link': "/img/sports.svg", 'count': 0}]
function buildList(){
	$('.list table').append('<tr><td>Place</td><td>Been there?</td></tr>')
	for (var i=0; i<venues.length; i++){
		if (venues[i].beenHere === true) {
			// get the venues category and a
			for (var j=0; j<badges.length; j++){
				if (venues[i].category === badges[j].category) {
					badges[j].count ++
				}
			}
			$('.container').append(
				'<div class="venue one-third column"> <div class="tag"><img src="' + venues[i].badgelink +'" width="20" class="small-badge" /><p class="category-name">'+  venues[i].category + '</p></div> <img src="' + venues[i].photo + '" /><h2>' + venues[i].name + '</h2><p class="label">about</p><p class="description">' + venues[i].description + '</p><p class="label">address</p><p class="description">' + venues[i].address + '</p><div class="button checkin" data-venueid='+ venues[i].VenueID + '>check-in</div></div>');

		} else {
			$('.container').append(
				'<div class="venue one-third column"> <div class="tag"><img src="' + venues[i].badgelink +'" width="20" class="small-badge grayscale" /><p class="category-name">'+  venues[i].category + '</p></div> <img src="' + venues[i].photo +	'" /><h2>'+ venues[i].name + '</h2><p class="label">about</p><p class="description">' + venues[i].description + '</p><p class="label">address</p><p class="description">' + venues[i].address + '</p><div class="button checkin" data-venueid=' + venues[i].VenueID + '>check-in</div></div>');
		}
	}
	checkin();
}

function toggleViews(input){
	if (input === 'list') {
		$('.dashboard').css('display', 'none');
		$('.list').css('display', 'block');
		$('.venue').css('display', 'block');
	} else if (input === 'dashboard') {
		$('.venue').css('display', 'none');
		$('.list').css('display', 'none');
		$('.dashboard').css('display', 'block');
	}
};

function dashboard(){
	for (var i=0; i<venues.length; i++){
		if (venues[i].beenHere === true) {
			$(".visited ul").append('<li>' + venues[i].name + '</li>');
		}
	}
	for (var j=0; j<badges.length; j++){
		if (badges[j].count > 0){
			$('.myBadges').append('<img src=' + badges[j].link + ' width="200" />');
		} else {
			$('.moreBadges').append('<img src=' + badges[j].link + ' width="80" class="grayscale" style="opacity: 0.2" />');
		}
	}
	$('.badges').append('<br><div class="button print" onClick="printBadges()"><h5>Print My Badges!</h5></div>');
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

var oldPage;
function printBadges(){
  var badges = $('.myBadges').html();
  oldPage = $('body').html();
  $('body').html("<html><head><title></title></head><body>" + badges + "</body>");
  window.print();
  $('body').html(oldPage);
}

$(document).ready(function(){
	toggleViews();
});