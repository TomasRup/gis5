/*

    This is an 'in hurry' code, learning Open Layers 3 features.

 */

(function() {

    // Initializing 'Plotai' data layer
    var plotaiVector = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(plotaiGeoJSON)
    });

    var plotaiVectorLayer = new ol.layer.Vector({
        source: plotaiVector,
        style: styleFunction
    });


    // Initializing 'Keliai' data layer
    var keliaiVector = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(keliaiGeoJSON)
    });

    var keliaiVectorLayer = new ol.layer.Vector({
        source: keliaiVector,
        style: styleFunction
    });


    // Initializing 'Ukiai' data layer
    var ukiaiVector = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(ukiaiGeoJSON)
    });

    var ukiaiVectorLayer = new ol.layer.Vector({
        source: ukiaiVector,
        style: styleFunction,
    });


    var osmMapLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    // Rendering the map
    var map = new ol.Map({
        target: 'map',
        layers: [
            osmMapLayer,
            keliaiVectorLayer,
            ukiaiVectorLayer,
            plotaiVectorLayer,
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([25.132310732635958, 54.77458636163477]),
            zoom: 15
        })
    });


    // Toggle layers on / off
    var getOnOffLabel = function(vectorLayer) {
        return vectorLayer.get('visible') == true ? 'Išjungti' : 'Įjungti';
    }

    var resetLabel = function(domElementId, vectorLayer) {
        $('#' + domElementId).html(getOnOffLabel(vectorLayer));
    }

    resetLabel('ukiai-toggle-label', ukiaiVectorLayer);
    resetLabel('plotai-toggle-label', plotaiVectorLayer);
    resetLabel('keliai-toggle-label', keliaiVectorLayer);

    var toggleVectorLayerVisibility = function(vectorLayer) {
        var nextVisibility = !vectorLayer.get('visible');
        vectorLayer.set('visible', nextVisibility, false);
    }
    
    $('#ukiai-toggle').click(function() {
        toggleVectorLayerVisibility(ukiaiVectorLayer);
        resetLabel('ukiai-toggle-label', ukiaiVectorLayer);
    });

    $('#plotai-toggle').click(function() {
        toggleVectorLayerVisibility(plotaiVectorLayer);
        resetLabel('plotai-toggle-label', plotaiVectorLayer);
    });

    $('#keliai-toggle').click(function() {
        toggleVectorLayerVisibility(keliaiVectorLayer);
        resetLabel('keliai-toggle-label', keliaiVectorLayer);
    });


    // Information on farms
    var farmPointSelectInteraction = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        layers: [ ukiaiVectorLayer ]
    });

    farmPointSelectInteraction.on('select', function(event) {
        if (event.selected.length > 0) {
            $('#tooltip').css({ 
                display: 'table',
                position: 'absolute',
                top: event.mapBrowserEvent.originalEvent.clientY + 'px',
                left: '' + event.mapBrowserEvent.originalEvent.clientX + 'px',
                width: '140px',
                height: '70px',
                'z-index': '1000',
                'box-shadow': '0px 1px 7px 0px rgba(0, 0, 0, .9)'
            });

            $('#tooltip-text').css({ 
                display: 'table-cell',
                'vertical-align': 'middle',
                'text-align': 'left'
            });

            var selectedPoint = event.selected[0];

            var tooltipContent = (
                'Gyvulių: ' 
                    + (selectedPoint.get('Gyvuliai') == 'Y' ? 'Yra' : 'Ne')
                    + '<br>'
                    + 'Priklauso: '
                    + selectedPoint.get('Priklauso')
                    + '<br>'
                     + 'Ikurta: '
                    + selectedPoint.get('Ikurtas')
                    + '<br>');

            $('#tooltip-text').html(tooltipContent);

        } else if (event.deselected.length > 0) {
            $('#tooltip').css({ 
                display: 'none' 
            });
        }
    });

    map.addInteraction(farmPointSelectInteraction);


    // Weather information
    var changeWeatherInfo = function(weatherData) {
        
        var weatherDataContent = (
            'Stotelė: ' 
                + weatherData.name
                + ', vėjo greitis: ' 
                + weatherData.wind.speed
                + ' m/s'
                + ', vėjo kryptis: ' 
                + weatherData.wind.deg 
                + ' laipsniai.');

        $('#weather-info').html(weatherDataContent);
    };

    map.on('click', function(event) {
        
        var lanlon = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
        var lat = lanlon[1];
        var lon = lanlon[0];

        var queryUrl = ('http://api.openweathermap.org/data/2.5/weather?lat=' 
            + lat 
            + '&lon=' 
            + lon 
            + '&APPID=a6ee1902733e549a9f3fed288d100222'); 

        jQuery.get(queryUrl, function(response) {
            changeWeatherInfo(response);
        })
    });


    // Filtering points
    $('#farm-filter').keyup(function(e) {
        farmFilterText = e.currentTarget.value;
        ukiaiVectorLayer.changed();
    });

})();