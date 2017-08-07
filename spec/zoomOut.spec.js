/*jshint esversion:6*/

var getZoomedOutBounds = require('../js/zoomOut');

describe('getZoomedOutBouds()', function(){

    it('all positive coordinates, origin is SW of destination', function(){
        origLatLng = {lat: () => 23, lng: () => 56};
        destLatLng = {lat: () => 45, lng: () => 78};
        expect(getZoomedOutBounds(origLatLng, destLatLng).south).toEqual(23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).west).toEqual(56);
        expect(getZoomedOutBounds(origLatLng, destLatLng).north).toEqual(45);
        expect(getZoomedOutBounds(origLatLng, destLatLng).east).toEqual(78);
    });

    it('all positive coordinates, origin is SE of destination', function(){
        origLatLng = {lat: () => 23, lng: () => 78};
        destLatLng = {lat: () => 45, lng: () => 56};
        expect(getZoomedOutBounds(origLatLng, destLatLng).south).toEqual(23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).west).toEqual(56);
        expect(getZoomedOutBounds(origLatLng, destLatLng).north).toEqual(45);
        expect(getZoomedOutBounds(origLatLng, destLatLng).east).toEqual(78);
    });

    it('all positive coordinates, origin is NW of destination', function(){
        origLatLng = {lat: () => 45, lng: () => 56};
        destLatLng = {lat: () => 23, lng: () => 78};
        expect(getZoomedOutBounds(origLatLng, destLatLng).south).toEqual(23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).west).toEqual(56);
        expect(getZoomedOutBounds(origLatLng, destLatLng).north).toEqual(45);
        expect(getZoomedOutBounds(origLatLng, destLatLng).east).toEqual(78);
    });

    it('all positive coordinates, origin is NE of destination', function(){
        origLatLng = {lat: () => 45, lng: () => 78};
        destLatLng = {lat: () => 23, lng: () => 56};
        expect(getZoomedOutBounds(origLatLng, destLatLng).south).toEqual(23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).west).toEqual(56);
        expect(getZoomedOutBounds(origLatLng, destLatLng).north).toEqual(45);
        expect(getZoomedOutBounds(origLatLng, destLatLng).east).toEqual(78);
    });

    it('all negative coordinates', function(){
        origLatLng = {lat: () => -23, lng: () => -56};
        destLatLng = {lat: () => -45, lng: () => -78};
        expect(getZoomedOutBounds(origLatLng, destLatLng).south).toEqual(-45);
        expect(getZoomedOutBounds(origLatLng, destLatLng).west).toEqual(-78);
        expect(getZoomedOutBounds(origLatLng, destLatLng).north).toEqual(-23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).east).toEqual(-56);
    });

    it('same latitude', function(){
        origLatLng = {lat: () => -23, lng: () => -56};
        destLatLng = {lat: () => -23, lng: () => -78};
        expect(getZoomedOutBounds(origLatLng, destLatLng).south).toEqual(-23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).west).toEqual(-78);
        expect(getZoomedOutBounds(origLatLng, destLatLng).north).toEqual(-23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).east).toEqual(-56);
    });

    it('same longitude', function(){
        origLatLng = {lat: () => -23, lng: () => -56};
        destLatLng = {lat: () => -45, lng: () => -56};
        expect(getZoomedOutBounds(origLatLng, destLatLng).south).toEqual(-45);
        expect(getZoomedOutBounds(origLatLng, destLatLng).west).toEqual(-56);
        expect(getZoomedOutBounds(origLatLng, destLatLng).north).toEqual(-23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).east).toEqual(-56);
    });

    it('same coordinates', function(){
        origLatLng = {lat: () => -23, lng: () => -56};
        destLatLng = {lat: () => -23, lng: () => -56};
        expect(getZoomedOutBounds(origLatLng, destLatLng).south).toEqual(-23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).west).toEqual(-56);
        expect(getZoomedOutBounds(origLatLng, destLatLng).north).toEqual(-23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).east).toEqual(-56);
    });

    it('mixed positive and negative coordinates', function(){
        origLatLng = {lat: () => 23, lng: () => -56};
        destLatLng = {lat: () => -45, lng: () => 78};
        expect(getZoomedOutBounds(origLatLng, destLatLng).south).toEqual(-45);
        expect(getZoomedOutBounds(origLatLng, destLatLng).west).toEqual(-56);
        expect(getZoomedOutBounds(origLatLng, destLatLng).north).toEqual(23);
        expect(getZoomedOutBounds(origLatLng, destLatLng).east).toEqual(78);
    });

});
