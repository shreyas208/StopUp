$('#departures > .departures').hide();

var mockData = {
    "time":"2013-03-28T11:24:57-05:00",
	"new_changeset":true,
	"status":{
	    "code":200,
		"msg":"ok"
	},
   "rqst":{
       "method":"GetDeparturesByStop",
       "params":{
           "stop_id":"iu"
       }
   },
   "departures":[
      {
          "stop_id":"IU:1",
          "headsign":"13N Silver",
          "route":{
              "route_color":"cccccc",
              "route_id":"SILVER",
              "route_long_name":"Silver",
              "route_short_name":"13",
              "route_text_color":"000000"
          },
          "trip":{
              "trip_id":"[@12.0.42199629@][3][1246896440906]/11__SV3",
              "trip_headsign":"NORTH - LINCOLN SQUARE",
              "route_id":"SILVER",
              "block_id":"SV3",
              "direction":"North",
              "service_id":"SV3",
              "shape_id":"SILVER 2"
          },
          "vehicle_id":"0108",
          "origin":{
              "stop_id":"PAR:2"
          },
          "destination":{
              "stop_id":"LSE:8"
          },
          "is_monitored":true,
          "is_scheduled":true,
          "is_istop":true,
          "scheduled":"2013-03-28T11:23:00-05:00",
          "expected":"2013-03-28T11:25:15-05:00",
          "expected_mins":0,
          "location":{
              "lat":40.108617,
              "lon":-88.22875
          }
      },
      {
          "stop_id":"IU:2",
          "headsign":"5W GreenHOPPER",
          "route":{
              "route_color":"00a638",
              "route_id":"GREENHOPPER",
              "route_long_name":"Greenhopper",
              "route_short_name":"5",
              "route_text_color":"000000"
          },
          "trip":{
              "trip_id":"[@7.0.41101146@][4][1237930167062]/20__GNX4_UIMF",
              "trip_headsign":"WEST - PROSPECT",
              "route_id":"GREENHOPPER",
              "block_id":"GNX4 UIMF",
              "direction":"West",
              "service_id":"GNX4 UIMF",
              "shape_id":"5W HOPPER 81"
          },
          "vehicle_id":"1171",
          "origin":{
              "stop_id":"WASHLRMN:7"
          },
          "destination":{
              "stop_id":"SPFLDPSPCT:2"
          },
          "is_monitored":true,
          "is_scheduled":true,
          "is_istop":false,
          "scheduled":"2013-03-28T11:29:00-05:00",
          "expected":"2013-03-28T11:27:49-05:00",
          "expected_mins":3,
          "location":{
              "lat":40.11058,
              "lon":-88.217
          }
      },
      {
          "stop_id":"IU:2",
          "headsign":"12W Teal",
          "route":{
              "route_color":"006991",
              "route_id":"TEAL",
              "route_long_name":"Teal",
              "route_short_name":"12",
              "route_text_color":"ffffff"
          },
          "trip":{
              "trip_id":"[@7.0.41893871@][4][1243540851671]/13__T4UIMF",
              "trip_headsign":"WEST - ILLINOIS TERMINAL",
              "route_id":"TEAL",
              "block_id":"T4UIMF",
              "direction":"West",
              "service_id":"T4UIMF",
              "shape_id":"12W TEAL 12"
          },
          "vehicle_id":"0314",
          "origin":{
              "stop_id":"ODSS:1"
          },
          "destination":{
              "stop_id":"IT:5"
          },
          "is_monitored":true,
          "is_scheduled":true,
          "is_istop":true,
          "scheduled":"2013-03-28T11:28:00-05:00",
          "expected":"2013-03-28T11:28:24-05:00",
          "expected_mins":3,
          "location":{
              "lat":40.10051,
              "lon":-88.222833
          }
      }
   ]
};

var stopId = new URL(window.location.href).searchParams.get('stopId');
var stopName = new URL(window.location.href).searchParams.get('stopName');

insertNavBar(stopName, "arrow_back", "Back", "", "Favorite");
$('#nav-bar-item-left').click(function () {window.location.href='main.html';});
$('#nav-bar-item-right').click(function () {
  var fav = !($('#nav-bar-item-right').hasClass('favorite'));
  if (fav) {
    $('#nav-bar-item-right').addClass('favorite');
  } else {
    $('#nav-bar-item-right').removeClass('favorite');
  }

  favoriteIds = [];
  chrome.storage.local.get("favoriteIds", function (data) {
    if (data.favoriteIds) {
      favoriteIds = data.favoriteIds;
    }

    if (fav) {
      favoriteIds.push(stopId);
      chrome.storage.local.set({[stopId]: stopName});
    } else {
      favoriteIds.splice(favoriteIds.indexOf(stopId));
    }

    chrome.storage.local.set({'favoriteIds': favoriteIds});
  });
});

chrome.storage.local.get("favoriteIds", function (data) {
  if (data.favoriteIds) {
    if (data.favoriteIds.indexOf(stopId) > -1) {
      $('#nav-bar-item-right').addClass('favorite');
    }
  }
});

function setDepartures(departures) {
  if (departures.length == 0) {
    var dep = $('<div class="departure">No upcoming departures.</div>');
    $('#content > .departures').append(dep);
  } else {
    for (var i = 0; i < departures.length; i++) {
      var depStr = '<div class="departure">';
      var routeStr = '<div class="route">' + departures[i].headsign + '</div>';
      var timeStr = '<div class="time">' + departures[i].expected_mins + ' min</div>';
      var dep = $(depStr + routeStr + timeStr + "</div>");
      if (departures[i].is_istop) dep.addClass('istop');
      dep.css({"background-color": "#" + departures[i].route.route_color, "color": "#" + departures[i].route.route_text_color});
      $('#content > .departures').append(dep);
    }
  }
  $('#content > .departures').show(300);
}

$.getJSON(
  API_URL + 'getdeparturesbystop',
  {
    "key": API_KEY,
    "stop_id": stopId,
    "pt": 60,
    "count": 20
  },
  function (data) {
    $('#content > .progress').hide();
    setDepartures(data.departures);
  }
);
