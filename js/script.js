  // Note: This example requires that you consent to location sharing when
  // prompted by your browser. If you see the error "The Geolocation service
  // failed.", it means you probably did not give permission for the browser to locate you.

  function initMap() {
      var map, marker, marker2, infoWindow, currentPosition, destinationPosition

       if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(function(position) {
               var pos = {
                   lat: position.coords.latitude,
                   lng: position.coords.longitude
               };

            currentPosition = {lat: pos.lat, lng: pos.lng};

            destinationPosition = {lat: 22.2988, lng: 114.1722};

            var distance =  google.maps.geometry.spherical
                .computeDistanceBetween(
                  new google.maps.LatLng(pos.lat,pos.lng),
                  new google.maps.LatLng(22.2988,114.1722)
                );

            console.log(distance)

            $.getJSON("mapLayout/mapLayout.js",function(mapLayout){
                var map = new google.maps.Map(document.getElementById('map'), {
                    center: currentPosition,
                    zoom: 17,
                    disableDefaultUI: true,
                    styles: mapLayout
                })

                 var image = 'art/batman.png'
                 var image2 = 'art/batmancall.png'

                     marker = new google.maps.Marker({
                     position: currentPosition,
                     map: map,
                     icon: image
                  })

                     marker2 = new google.maps.Marker({
                     position: destinationPosition,
                     map: map,
                     icon: image2
                  })

                    infoWindow = new google.maps.InfoWindow({
                     content: 'I\'m Batman',
                     position: currentPosition
                 })

                 var service = new google.maps.places.PlacesService(map);

                 marker.addListener('click', function(){
                     infoWindow.open(map, marker);
                 })

                 map.setCenter(pos);
            })
           },

           function(error) {
               debugger;
               handleLocationError(true, infoWindow, map.getCenter());
              });
       }
       else {
      // Browser doesn't support Geolocation
       handleLocationError(false, infoWindow, map.getCenter());
       }
   }

   function handleLocationError(browserHasGeolocation, infoWindow, pos) {
       infoWindow.setPosition(pos);
       infoWindow.setContent(browserHasGeolocation ?
           'Error: The Geolocation service failed.' :
           'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
// window.initMap = initMap
