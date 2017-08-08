// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to locate you.

var map, arrow, player, destination, playerLatLng, destLatLng;

function initMap() {

    if (!navigator.geolocation) {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        reject("Browser doesn't support Geolocation");
    } else {
        navigator.geolocation.getCurrentPosition(function(position) {
            playerLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            destLatLng = new google.maps.LatLng(22.2988, 114.1722);

            var distance =  google.maps.geometry.spherical
                .computeDistanceBetween(playerLatLng, destLatLng);
            console.log(distance);

            map = new google.maps.Map(document.getElementById('map'), {
                center: playerLatLng,
                zoom: 17,
                disableDefaultUI: true,
                styles: mapLayout
            });

            var image = 'art/batman.png';
            var image2 = 'art/batmancall.png';

            player = new google.maps.Marker({
                position: playerLatLng,
                map: map,
                icon: image,
                draggable: true
            });
            destination = new google.maps.Marker({
                position: destLatLng,
                map: map,
                icon: image2
            });

            var service = new google.maps.places.PlacesService(map);
            map.setCenter(playerLatLng);

            google.maps.event.addListener(map, 'bounds_changed', function() {
                if (arrow) arrow.setMap(null);
                arrow = setArrow(
                    new google.maps.LatLng(
                        player.getPosition().lat(),
                        player.getPosition().lng()
                    ),
                    destLatLng,
                    map
                );
                arrow.setMap(map);

                if (destinationInMap(destLatLng)) {
                    arrow.setMap(null);
                } else {
                    arrow.setMap(map);
                }
            });

            player.addListener('drag', function() {
                arrow.setMap(null);
                arrow = setArrow(
                    new google.maps.LatLng(
                        player.getPosition().lat(),
                        player.getPosition().lng()
                    ),
                    destLatLng,
                    map
                );
                arrow.setMap(map);
            });
        },
        function(error) {
            // debugger;
            //handleLocationError(true, infoWindow, map.getCenter());
            console.log(error);
        });
    }
}


    // window.initMap = initMap
