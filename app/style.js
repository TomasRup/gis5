var farmFilterText = '';

var styles = {
    '_EmptyPoint': new ol.style.Style({}),
    'Point': new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 0.5],
            src: 'img/3d_farm.png',
            scale: 0.09
        })
    }),
    'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#7E8AA2',
            width: 3
        })
    }),
    'Polygon': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#263248',
            lineDash: [4],
            width: 0.5
        }),
        fill: new ol.style.Fill({
            color: 'rgba(38, 50, 72, 0.1)'
        })
    })
};


var styleFunction = function(feature) {
    
    var type = feature.getGeometry().getType();

    if (farmFilterText && type == 'Point' && farmFilterText.length > 0) {

        return (feature.get('Priklauso').indexOf(farmFilterText) > -1
            ? styles['Point']
            : styles['_EmptyPoint']);

    }

    return styles[type];
};