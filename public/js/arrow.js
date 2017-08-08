/* NOTE:

1. Parameters ending in `LatLng` mean they are LatLng objects, created in one of two ways:

    > var latLngObject = new google.maps.LatLng(22, 114);
    > var latLngObject = new google.maps.LatLng({lat:22, lng:114});

2. `origLatLng` = the coordinates of the player/user as a LatLng object
3. `destLatLng` = the coordinates of the destination/goal as a LatLng object

4. NOTE: The arrow may not display correctly if zoomed out too much
         (i.e., google maps zoom value of approx. 4 or lower)
         - Okay for our purposes for now

*/

// Arrow configurations (in `setArrow()` function)
var ARROW_COLOR = "#008080"; // (#008080 = teal) (color names not accepted, use hex)
var ARROW_BORDER = 4; // Thickness (recommend minimum of 4; 7 will fill the arrow but make the points rounded
                      // Google's FORWARD_CLOSED_ARROW doesn't allow filling in
var ARROW_OPACITY = 0.75;
var ARROW_SIZE = 4; // (higher = bigger)

// in `getArrowCoords()` function
var PADDING_DIV = 12; // Spacing between arrow and map border (higher = closer)

function getArrowCoords(origLatLng, destLatLng, map) {

    var geo = google.maps.geometry.spherical;
    var bounds = map.getBounds();
    var N = bounds.f.f, W = bounds.b.b, S = bounds.f.b, E = bounds.b.f;
    var heading = geo.computeHeading(origLatLng, destLatLng);
    var headingNE = geo.computeHeading(origLatLng, new google.maps.LatLng(N,E));
    var headingNW = geo.computeHeading(origLatLng, new google.maps.LatLng(N,W));
    var headingSE = geo.computeHeading(origLatLng, new google.maps.LatLng(S,E));
    var headingSW = geo.computeHeading(origLatLng, new google.maps.LatLng(S,W));
    var padding, adjacent, hypotenuse;

    if ((heading < 0 && heading >= headingNW) || (heading >= 0 && heading <= headingNE)) {  // north quadrant
        padding = (N-S)/PADDING_DIV;
        adjacent = geo.computeDistanceBetween(
            origLatLng, new google.maps.LatLng(N - padding, origLatLng.lng())
        );
        hypotenuse = Math.abs(adjacent / Math.cos(Math.abs(heading) * Math.PI / 180));
    } else if (headingSW < heading && heading < headingNW) {  // west quadrant
        padding = Math.abs((E-W)/PADDING_DIV);
        adjacent = geo.computeDistanceBetween(
            origLatLng, new google.maps.LatLng(origLatLng.lat(), W + padding)
        );
        hypotenuse = Math.abs(adjacent / Math.cos(Math.abs(Math.abs(heading)-90) * Math.PI / 180));
    } else if (heading <= headingSW || heading >= headingSE) {  // south quadrant
        padding = (N-S)/PADDING_DIV;
        adjacent = geo.computeDistanceBetween(
            origLatLng, new google.maps.LatLng(S + padding, origLatLng.lng())
        );
        hypotenuse = Math.abs(adjacent / Math.cos(Math.abs(heading) * Math.PI / 180));
    } else if (headingSE > heading && heading > headingNE) {  // east quadrant
        padding = (E-W)/PADDING_DIV;
        adjacent = geo.computeDistanceBetween(
            origLatLng, new google.maps.LatLng(origLatLng.lat(), E - padding)
        );
        hypotenuse = Math.abs(adjacent / Math.cos(Math.abs(Math.abs(heading)-90) * Math.PI / 180));
    }

    var arrowCoords = geo.computeOffset(origLatLng, hypotenuse, heading);
    var toArrowCoords = geo.computeOffset(origLatLng, hypotenuse-0.001, heading);
    return [toArrowCoords, arrowCoords];

}

function setArrow(origLatLng, destLatLng, map) {

    var arrowSymbol = { // Just the arrow icon itself
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        strokeColor: ARROW_COLOR,
        strokeWeight: ARROW_BORDER
    };

    // Combined with polyline to orient arrow direction
    return new google.maps.Polyline({
        path: getArrowCoords(origLatLng, destLatLng, map),
        icons: [{icon: arrowSymbol}],
        map: map,
        strokeColor: ARROW_COLOR,
        strokeWeight: ARROW_SIZE,
        strokeOpacity: ARROW_OPACITY
    });
}

module.exports.setArrow = setArrow;
module.exports.getArrowCoords = getArrowCoords;

/* NOTE: HOW TO USE

// To create an arrow:
var arrow = setArrow(originLatLng, destinationLatLng, map);

// To update the arrow's location/direction
//    --> call setArrow() again (without `var`)
arrow = setArrow(newOriginLatLng, newDestinationLatLng, map);

*/
