// Helper function for zooming out to see both player and destination

/* // FOR JASMINE TESTING ONLY
var google = {maps: {LatLngBounds: class LatLngBounds {
    constructor(sw, ne) {
        this.south = sw.lat;
        this.west = sw.lng;
        this.north = ne.lat;
        this.east = ne.lng;
    }
}}};
*/

// get the outer boundaries of player and destination
function getZoomedOutBounds(origLatLng, destLatLng){
    var south = [origLatLng.lat(),destLatLng.lat()].sort((a, b) => a - b)[0];
    var north = [origLatLng.lat(),destLatLng.lat()].sort((a, b) => a - b)[1];
    var west = [origLatLng.lng(),destLatLng.lng()].sort((a, b) => a - b)[0];
    var east = [origLatLng.lng(),destLatLng.lng()].sort((a, b) => a - b)[1];
    return new google.maps.LatLngBounds(
        {lat: south, lng: west},
        {lat: north, lng: east}
    );
}

// module.exports = getZoomedOutBounds;

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
