insertLogoBar();

function handleFavorites(data) {
  if (data.favoriteIds) {
    if (data.favoriteIds.length > 0) {
      $("#favorites > .stops > .stop.none").hide();
    }
    for (var i = 0; i < data.favoriteIds.length; i++) {
      chrome.storage.local.get(data.favoriteIds[i], addFavorite);
    }
  }
}

function addFavorite(data) {
  for (var favoriteId in data) {
    var stopStr = '<div class="stop" data-stopId="' + favoriteId + '" data-stopName="' + data[favoriteId] + '">' + data[favoriteId] + '</div>';
    var stop = $(stopStr);
    $('#favorites > .stops').append(stop);
    stop.click(function (event) {
      var stop = $(event.target);
      window.location.href = 'stop.html?stopId=' + stop.attr('data-stopId') + "&stopName=" + stop.attr('data-stopName');
    });
  }
}

function handlePosition(position) {
  if (!debug) {
    $.getJSON(
      API_URL + 'getstopsbylatlon',
      {
        "key": API_KEY,
        "lat": position.coords.latitude,
        "lon": position.coords.longitude,
        "count": 5
      },
      function (data) {
        clearNearbyStops();
        $('#nearby > .progress').hide();
        setNearbyStops($('#nearby'), data.stops);
      }
    );
  }
}

function handlePositionError(positionError) {
  console.log(positionError);
}

function clearNearbyStops() {
  $('#nearby > .stops > .stop').remove();
}

function clearSearchStops() {
  $('#search > .stops > .stop').remove();
}

function setNearbyStops(card, stops) {
  for (var i = 0; i < stops.length; i++) {
    var stopStr = '<div class="stop" data-stopId="' + stops[i].stop_id + '" data-stopName="' + stops[i].stop_name + '">' + stops[i].stop_name + '</div>';
    var stop = $(stopStr);
    $('.stops', card).append(stop);
  }
  $('.stops > .stop', card).click(function (event) {
    var stop = $(event.target);
    window.location.href = 'stop.html?stopId=' + stop.attr('data-stopId') + "&stopName=" + stop.attr('data-stopName');
  });
  $('.stops', card).show(300);
}

function setAutocompleteStops(card, stops) {
  for (var i = 0; i < stops.length; i++) {
    var stopStr = '<div class="stop" data-stopId="' + stops[i].i + '" data-stopName="' + stops[i].n + '">' + stops[i].n + '</div>';
    var stop = $(stopStr);
    $('.stops', card).append(stop);
  }
  $('.stops > .stop', card).click(function (event) {
    var stop = $(event.target);
    window.location.href = 'stop.html?stopId=' + stop.attr('data-stopId') + "&stopName=" + stop.attr('data-stopName');
  });
  $('.stops', card).show(300);
}

function loadSuggestions(query) {
  $.getJSON(
    AUTOCOMPLETE_URL,
    {
      "query": query,
    },
    function (data) {
      clearSearchStops();
      setAutocompleteStops($('#search'), data);
    }
  );
}

chrome.storage.local.get("favoriteIds", handleFavorites);

$('#search-field').on('input', function (event) {
  if (event.target.value.length >= 2) {
    loadSuggestions(event.target.value);
  } else if (event.target.value.length == 0) {
    clearSearchStops();
  }
});

navigator.geolocation.getCurrentPosition(handlePosition, handlePositionError);
