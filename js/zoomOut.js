// Helper function for zooming out to see both player and destination

// get the outer boundaries of player and destination
function getZoomedOutBounds(origLatLng, destLatLng){
    var north = [origCoord.lat(),destCoord.lat()].sort()[0];
    var south = [origCoord.lat(),destCoord.lat()].sort()[1];
    var west = [origCoord.lng(),destCoord.lng()].sort()[0];
    var east = [origCoord.lng(),destCoord.lng()].sort()[1];
    return new google.maps.LatLngBounds(
        {lat: south, lng: west},
        {lat: north, lng: east}
    );
}

module.exports = getZoomedOutBounds;

/* EXAMPLE

// map object
var map = new google.maps.Map(
    document.getElementById('map'), {
    zoom: 12,
      	center: new google.maps.LatLng(38.7, -104.6),
      	mapTypeId: google.maps.MapTypeId.ROADMAP
    }
);

// LatLng objects
var origLatLng = new google.maps.LatLng({lat: 22, lng: 114});
var destLatLng = new google.maps.LatLng({lat: 23, lng: 113});

// Make map zoom out
map.fitBounds(getZoomedOutBounds(origLatLng, destLatLng));

// the .fitBounds() function should automatically add some padding
*/
