var debug = false;
var API_URL = 'https://developer.cumtd.com/api/v2.2/json/';
var API_KEY = 'your_mtd_api_key_here';
var AUTOCOMPLETE_URL = 'https://www.cumtd.com/autocomplete/stops/v1.0/json/search';

function insertNavBar(title, leftIcon, leftTitle, rightIcon, rightTitle) {
    var navbarDiv = '<div class="nav-bar custom">';
    var leftIcon = '<i class="material-icons icon icon-left" id="nav-bar-item-left" title="' + leftTitle + '">' + leftIcon + '</i>';
    var rightIcon = '<i class="material-icons icon icon-right" id="nav-bar-item-right" title="' + rightTitle + '">' + rightIcon + '</i>';
    var appName = '<div class="app-name">' + title + '</div>';
    var navbar = $(navbarDiv + leftIcon + appName + rightIcon + '</div>');
    $('body').prepend(navbar);
}

function insertLogoBar() {
  var navbarDiv = '<div class="nav-bar">';
  var appName = '<div class="app-name">StopUp</div>';
  var navbarStr = navbarDiv + appName + '</div>';
  $('body').prepend($(navbarStr));
}
