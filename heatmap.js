/**
 * Heatmap jQuery plugin 1.0
 *
 * Copyright (c) 2014, AIWSolutions
 * License: GPL2
 * Project Website: http://wiki.aiwsolutions.net/f1fkZ
 **/

jQuery.fn.heatmap = function(targetDivId, multiplier) {

    var heatData = {};
    var source = this;
    var loadedLibCount;
    var geocoder;
    var map;

    function renderMap() {
        var options = {
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            draggable: false,
            keyboardShortcuts: false,
            mapTypeControl: false,
            panControl: false,
            rotateControl: false,
            scaleControl: false,
            scrollwheel: false,
            zoomControl: false
        };
        map = new google.maps.Map(document.getElementById(targetDivId), options);
        map.fitBounds(processHeatData());
    }

    function processHeatData() {
        var bounds = new google.maps.LatLngBounds();
        $.each(heatData, function(key, value) {
            addHeadMap(key, value);
            bounds.extend(value.location);
        });
        return bounds;
    }

    function addHeadMap(key, value) {
        var pointArray = new google.maps.MVCArray([value.location]);
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: pointArray
        });
        heatmap.setMap(map);
        heatmap.set('radius', parseInt(value.data) * multiplier);
    }

    function readData() {
        var counter = 0;
        source.find('tbody tr').each(function() {
            counter++;
            var tr = $(this);
            var geoName = tr.find('.source').text().trim();
            var geoVal = tr.find('.value').text().trim();
            geocoder.geocode({'address': geoName}, function(result, status) {
                heatData[geoName] = {
                    'location' : result[0].geometry.location,
                    'data' : geoVal
                }
                counter--;
                if (counter === 0) {
                    renderMap();
                }
            });
        });
    }

    function initialize() {
        geocoder = new google.maps.Geocoder();
        readData();
    }

    $.getScript('https://www.google.com/jsapi').done(function() {
        loadedLibCount = 2;
        google.load('maps', '3', {'other_params': 'libraries=visualization', 'callback': initialize});
    });
}