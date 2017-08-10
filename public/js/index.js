var id, options;
var map, arrow, currentPosition, destinationPosition;
var playerMarker, destMarker;
var distance, destinationCounter = 0;
var huntId, itineraryLength;
var currentTask, currentChallenge = 0;

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
    if (distance <= 15 && currentChallenge === 0) {
        currentChallenge = 1;
        openChallenge();
    }
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

function getDestTask() {
    if (destinationCounter >= itineraryLength) {
        $.get('/gameend');
    } else {
        $.get('/itineraryIndex', function(data) {
            destinationCounter = parseInt(data);

            $.get('/itinerary?counter=' + destinationCounter, function(data){
                destinationPosition = new google.maps.LatLng(data.destination.latitude, data.destination.longitude);
                $('#challenge').find('p:first').html(data.task.question);
                currentTask = data.task;
                var destImage = 'public/art/batmancall.png';
                if (!destMarker) {
                    destMarker = new google.maps.Marker({
                        position: destinationPosition,
                        map: map,
                        icon: destImage
                    });
                } else {
                    destMarker.setPosition(destinationPosition);
                }
                map.fitBounds(getZoomedOutBounds(currentPosition, destinationPosition));
                destinationCounter++;
                $.post('/itineraryIndex?newIndex=' + destinationCounter);
            });
        });
    }
}

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
            playerMarker = new google.maps.Marker({
                position: currentPosition,
                map: map,
                icon: playerImage,
                draggable: true
            });

            $.get('/itinerary', function(data){
                itineraryLength = parseInt(data);
            });

            getDestTask();

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
                document.getElementById('distanceText').textContent = distance + " meters to go!";
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

function openChallenge() {
    document.getElementById("challenge").style.width = "100%";
}

function closeChallenge() {
    document.getElementById("challenge").style.width = "0%";
}

function checkAnswer() {
    var submitted = $('#answer').val();
    $('#answer').val('');
    console.log("I was called!");
    if (submitted.toLowerCase() === currentTask.answer.toString().toLowerCase()) {
        console.log("correct answer!");
        closeChallenge();
        $('#tries').text('3');
        $('#score>h1').html("You earned " + currentTask.score + " points!");
        $.post('/updatescore?add=' + currentTask.score);
        $('#score').css('z-index', '1');
        setTimeout(function(){
            $('#score>h1').html('');
            $('#score').css('z-index', '-1');
        }, 4000);
        getDestTask(huntId);
        currentChallenge = 0;
    } else {
        console.log("wrong answer!");
        var tries = parseInt($('#tries').text());
        if (tries > 1) {
            $('#tries').text(tries-1);
        } else {
            closeChallenge();
            $('#tries').text('3');
            $('#score>h1').html("You failed! Next destination...");
            $('#score').css('z-index', '1');
            setTimeout(function(){
                $('#score>h1').html('');
                $('#score').css('z-index', '-1');
            }, 4000);
            getDestTask(huntId);
        }
    }
}

function giveUp(){
    closeChallenge();
    $('#tries').html('3');
    $('#score>h1').html("You gave up?! Oh well, next destination.");
    $('#score').css('z-index', '1');
    setTimeout(function(){
        $('#score>h1').html('');
        $('#score').css('z-index', '-1');
    }, 4000);
    getDestTask(huntId);
    currentChallenge = 0;
}
