var id, target, options;
    var wanchai = {lat: 22.2760, lng: 114.1751};
    function success(pos) {
      var crd = pos.coords;
      var wanchai2 = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      marker.setPosition(wanchai2);
      map.setCenter(wanchai2);
      console.log(pos.coords.latitude, pos.coords.longitude)
      }

    function error(err) {
        var wanchai2 = new google.maps.LatLng( 22.2860, 114.1751);
        marker.setPosition(wanchai2);
        map.setCenter(wanchai2);
        // console.warn('ERROR(' + err.code + '): ' + err.message);
    }

        options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
              zoom: 15,
              center: wanchai
            });

            marker = new google.maps.Marker({
              position: wanchai,
              map: map
            });
            console.log(map.center);
            console.log(marker.position);
            if(map){
            id = navigator.geolocation.watchPosition(success, error, options)
        }
        }
        function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

        function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}
