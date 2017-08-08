var id, options;
var map, arrow, currentPosition, destinationPosition;
var playerMarker, destMarker;
var distance;

var wanchai = {lat: 22.2760, lng: 114.1751};

function success(pos) {
    currentPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    playerMarker.setPosition(currentPosition);
    if (arrow) arrow.setMap(null);
    arrow = setArrow(currentPosition, destinationPosition, map);
    if (destinationInMap(destinationPosition)) {
        arrow.setMap(null);
    } else {
        arrow.setMap(map);
    }
    distance = Math.round(google.maps.geometry.spherical
        .computeDistanceBetween(currentPosition, destinationPosition));
    document.getElementById('distanceText').textContent = distance + ' meters to go!';
    console.log(pos.coords.latitude, pos.coords.longitude);
}

function error(err) {
    // currentPosition = new google.maps.LatLng( 22.2860, 114.1751);
    // playerMarker.setPosition(currentPosition);
    // map.setCenter(currentPosition);
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
}

options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
};

function initMap() {

    if (!navigator.geolocation) {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    } else {
        navigator.geolocation.getCurrentPosition(function(pos) {
            currentPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            destinationPosition = new google.maps.LatLng(22.2988, 114.1722);

            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: currentPosition,
                disableDefaultUI: true,
                styles: mapLayout
            });

            var playerImage = 'public/art/batman.png';
            var destImage = 'public/art/batmancall.png';

            playerMarker = new google.maps.Marker({
                position: currentPosition,
                map: map,
                icon: playerImage,
                draggable: true
            });
            destMarker = new google.maps.Marker({
                position: destinationPosition,
                map: map,
                icon: destImage
            });

            var service = new google.maps.places.PlacesService(map);

            google.maps.event.addListener(map, 'bounds_changed', function() {
                if (arrow) arrow.setMap(null);
                arrow = setArrow(
                    new google.maps.LatLng(
                        playerMarker.getPosition().lat(),
                        playerMarker.getPosition().lng()
                    ),
                    destinationPosition,
                    map
                );
                arrow.setMap(map);

                if (destinationInMap(destinationPosition)) {
                    arrow.setMap(null);
                } else {
                    arrow.setMap(map);
                }
            });

            // NOTE: This drag listener is for testing and demonstration purposes only
            playerMarker.addListener('drag', function() {
                if (arrow) arrow.setMap(null);
                arrow = setArrow(
                    new google.maps.LatLng(
                        playerMarker.getPosition().lat(),
                        playerMarker.getPosition().lng()
                    ),
                    destinationPosition,
                    map
                );
                if (destinationInMap(destinationPosition)) {
                    arrow.setMap(null);
                } else {
                    arrow.setMap(map);
                }
                distance = Math.round(google.maps.geometry.spherical
                    .computeDistanceBetween(new google.maps.LatLng(
                        playerMarker.getPosition().lat(),
                        playerMarker.getPosition().lng()
                    ), destinationPosition));
                document.getElementById('distanceText').textContent = distance;
            });

            id = navigator.geolocation.watchPosition(success, error, options);

        },
        function(error) {
            console.log(error);
        });
    }
}

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}
