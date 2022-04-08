// Create variable to hold map element, give initial settings to map
var map = L.map('map', {
    center: [10.53, -61.41],
    zoom: 13,
    minZoom: 13,
    scrollWheelZoom: false,
});

map.once('focus', function() { map.scrollWheelZoom.enable(); });

L.easyButton('<img src="images/fullscreen.png">', function (btn, map) {
    var cucu = [10.53, -61.41];
    map.setView(cucu, 13);
}).addTo(map);


var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
    '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
    'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
    'GIS User Community';
var esriAerial = new L.TileLayer(esriAerialUrl,
    {maxZoom: 18, attribution: esriAerialAttrib}).addTo(map);


var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        'Community ' + props.COMM_NAME + '<br />' + 
        'Population ' + props.P_TOTAL.toFixed(0) + '<br />' + 
        'Dwelling ' + props.NO_DWELL + '<br />' +  '<br />' + 

        '<b>Affordable, quality, serviced housing </b>' + '<br />' +
        'Unmet Basic Needs for Housing: ' + props.NBI_VIV_D + '<br />' +
        'Overcrowded households: ' + props.V_HACINA_D + '<br />' +
        'Unmet Basic Needs for Water: ' + props.NBI_AGUA_D + '<br />' +
        'Unmet Basic Needs for Sanitation: ' + props.NBI_SAN_D + '<br />' +
        'Unmet Basic Needs for Light: ' + props.NBI_ELEC_D + '<br />' +
        'Internet: ' + props.A_INTER.toFixed(0) + ' %' + '<br />' +  '<br />' +  

        '<b>Health and wellness</b>' + '<br />' +
        'Proximity to health centers: ' + props.D_SALUD.toFixed(0) + ' m' + '<br />' +  
        'Unmet Basic Needs for Refuse Collection: ' + props.NBI_RECB_D + '<br />' +  '<br />' +    
        
        '<b>Access to education, culture and diversity </b>' + '<br />' +
        'Proximity to educational centers: ' + props.D_EDU.toFixed(0) + ' m' + '<br />' +  '<br />' +  

        '<b>Employment and economic opportunities </b>' + '<br />' +
        'Proximity to commerce and services: ' + props.D_SER.toFixed(0) + ' m' + '<br />' +
        'Persons seeking work: ' + props.DESOCU_D + '<br />' +
        'Persons in work: ' + props.OCU.toFixed(0) + ' %'  : 'Seleccione una manzana');
};
info.addTo(map);

function stylec(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0,
        dashArray: '3',
    };
}

var loc = L.geoJson(localidad, {
    style: stylec,
    onEachFeature: popupText,
}).addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#494949',
        dashArray: '',
        fillOpacity: 0.7,
        opacity: 0.8
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 11px"><strong>${props.title}</strong></p>
            <p style="font-size: 10px">${props.subtitle}</p>
            <p id='colors'>
                ${props.elem1}
                ${props.elem2}
                ${props.elem3}
                ${props.elem4}
                ${props.elem5}
                ${props.elem6}
                ${props.elem7}<br>
                <span style='color:#000000'>Fuente: </span>${props.elem8}<br>
            </p>` :
        `<p style="font-size: 12px"><strong>Área urbana</strong></p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Manzanas<br>
            </p>`);
}

var legends = {
    NBI_VIV: {
        title: "Unmet Basic Needs for Housing",
        subtitle: "%", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>1.14 - 1.56</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.57 - 4.87</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>4.88 - 6.79</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>6.80 - 9.34</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>9.35 - 11.88</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Without Data</div>',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    V_HACINA: {
        title: "Overcrowded households",
        subtitle: "(>=3 persons per bedroom) %", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.62 - 1.23</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.24 - 5.79</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>5.80 - 7.44</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>7.45 - 9.50</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>9.51 - 13.04</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Without Data</div>',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    NBI_AGUA: {
        title: "Unmet Basic Needs for Water",
        subtitle: "%", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.00 - 0.33</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.34 - 1.32</div>',
        elem3: '<div><span  style= "color:#c3bfc2">▉</span>Without Data</div>',
        elem4: '',
        elem5: '',
        elem6: '',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    NBI_SAN: {
        title: "Unmet Basic Needs for Sanitation",
        subtitle: "%", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.55 - 1.64</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.65 - 3.13</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>3.14 - 8.44</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>8.45 - 12.35</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>12.36 - 19.71</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Without Data</div>',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    NBI_ELEC: {
        title: "Unmet Basic Needs for Light",
        subtitle: "%", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.00 - 0.43</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.44 - 1.38</div>',
        elem3: '<div><span  style= "color:#c3bfc2">▉</span>Without Data</div>',
        elem4: '',
        elem5: '',
        elem6: '',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    A_INTER: {
        title: "Internet",
        subtitle: "%", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>65.50 - 87.27</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>56.48 - 65.49</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>49.45 - 56.47</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>41.76 - 49.44</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>49.04 - 41.75</div>',
        elem6: '',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    D_EDU: {
        title: "Proximity to educational centers",
        subtitle: "m", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>9 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>502 - 1000</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>1002 - 2000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>2003 - 3000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>3000 - 3937</div>',
        elem6: '',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    D_SER: {
        title: "Proximity to commerce and services",
        subtitle: "m", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>40 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>502 - 1000</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>1002 - 2000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>2003 - 3000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>3000 - 4897</div>',
        elem6: '',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    D_SALUD: {
        title: "Proximity to health centers",
        subtitle: "m", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>32 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>502 - 1000</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>1002 - 2000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>2003 - 3000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>3000 - 4681</div>',
        elem6: '',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    DESOCU: {
        title: "Persons seeking work",
        subtitle: "%", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.80 - 1.12</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.13 - 1.94</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>2.26 - 2.56</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>2.57 - 3.46</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>3.47 - 4.18</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Without Data</div>',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    OCU: {
        title: "Persons in work",
        subtitle: "%", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>60.65 - 69.12</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>58.21 - 60.64</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>56.02 - 58.20</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>49.22 - 56.01</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>47.22 - 49.21</div>',
        elem6: '',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
    NBI_REC_BA: {
        title: "Unmet Basic Needs for Refuse Collection",
        subtitle: "%", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.00 - 1.10</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.11 - 3.26</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>3.27 - 5.91</div>',
        elem4: '<div><span  style= "color:#c3bfc2">▉</span>Without Data</div>',
        elem5: '',
        elem6: '',
        elem7: '',
        elem8: "Trinidad & Tobago 2011 Housing and Population Census",
    },
}

var indi;

function resetHighlight(e) {
    indi.setStyle(fillColor);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

indi = L.geoJson(Manzana, {
    style: legends.NBI_VIV,
    onEachFeature: onEachFeature
}).addTo(map);

var currentStyle = 'NBI_VIV';


function setProColor(d) {
    if (currentStyle === 'NBI_VIV') {
        return d > 11.88 ? '#c3bfc2' :
        d > 9.34 ? '#d7191c' :
            d > 6.79 ? '#fdae61' :
                d > 4.87 ? '#f4f466' :
                    d > 1.56 ? '#a6d96a' :
                        '#1a9641';
    }
    if (currentStyle === 'V_HACINA') {
        return d > 13.04 ? '#c3bfc2' :
        d > 9.50 ? '#d7191c' :
            d > 7.44 ? '#fdae61' :
                d > 5.79 ? '#f4f466' :
                    d > 1.23 ? '#a6d96a' :
                        '#1a9641';
    }
    if (currentStyle === 'NBI_AGUA') {
        return d > 1.32 ? '#c3bfc2' :
        d > 0.33 ? '#a6d96a' :
        '#1a9641';
    }
    if (currentStyle === 'NBI_SAN') {
        return d > 19.71 ? '#c3bfc2' :
        d > 12.35 ? '#d7191c' :
            d > 8.44 ? '#fdae61' :
                d > 3.13 ? '#f4f466' :
                    d > 1.64 ? '#a6d96a' :
                        '#1a9641';
    }
    if (currentStyle === 'NBI_ELEC') {
        return d > 1.38 ? '#c3bfc2' :
        d > 0.43? '#a6d96a' :
        '#1a9641';
    }
    if (currentStyle === 'NBI_REC_BA') {
        return d > 5.91 ? '#c3bfc2' :
            d > 3.26 ? '#f4f466' :
                d > 1.10? '#a6d96a' :
                    '#1a9641';
    }
    if (currentStyle === 'A_INTER') {
        return d > 65.49 ? '#1a9641' :
            d > 56.47 ? '#a6d96a' :
                d > 49.44? '#f4f466' :
                    d > 41.75 ? '#fdae61' :
                        '#d7191c';
    }
    if (currentStyle === 'D_EDU') {
        return d > 3000 ? '#d7191c' :
            d > 2000 ? '#fdae61' :
                d > 1000 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                        '#1a9641';
    }
    if (currentStyle === 'DESOCU') {
        return d > 4.18 ? '#c3bfc2' :
        d > 3.46 ? '#d7191c' :
            d > 2.56 ? '#fdae61' :
                d > 1.94 ? '#f4f466' :
                    d > 1.12 ? '#a6d96a' :
                        '#1a9641';
    }
    if (currentStyle === 'OCU') {
        return d > 60.64 ? '#1a9641' :
            d > 58.20 ? '#a6d96a' :
                d > 56.01 ? '#f4f466' :
                    d > 49.21 ? '#fdae61' :
                        '#d7191c';
    }
    else {
        return d > 3000 ? '#d7191c' :
            d > 2000 ? '#fdae61' :
                d > 1000 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                        '#1a9641';
    }

}


function fillColor(feature) {
    return {
        fillColor:  setProColor(feature.properties[currentStyle]),
        weight: 0.6,
        opacity: 0.1,
        color: (currentStyle) ? '#ffffff00' : '#c3bfc2', 
        fillOpacity: (currentStyle) ? 0.9 : 0.5,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            
        });
}

var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};

// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    //'Comunas': comu,
    //'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'NBI_VIV'});

function popupText(feature, layer) {
    layer.bindPopup('Comunidad ' + feature.properties.COMM_NAME + '<br />')
}
