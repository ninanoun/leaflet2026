// Configuration carte 
var map = L.map('map', {
center: [48.114, -1.676], 
zoom: 12 });


// Appel des fonds de carte

var baselayers = {
  
OrthoRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'raster:ortho2021', attribution : 'Rennes Métropole'}),

  
OSM: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}),
  
ESRI: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}),
  
Carto: L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
})

};
baselayers.OSM.addTo(map);



// Ajouter l'echelle cartographique
L.control.scale().addTo(map);

// Contenu popup SIGAT
var popupSIGAT = `
  <h1>Promotion SIGAT 2025</h1>
  <br>
  <img src="https://esigat.wordpress.com/wp-content/uploads/2025/11/whatsapp-image-2025-09-19-a-15.39.53_ec27dad0.jpg" width="350px">
  <br>
  <a href="https://esigat.wordpress.com/2025/11/08/2025-2026-master-2/">Découvrez la promotion 2025 !</a>
  <br>
  <iframe
    src="https://flo.uri.sh/visualisation/26741679/embed"
    title="Interactive or visual content"
    class="flourish-embed-iframe"
    frameborder="0"
    scrolling="no"
    style="width:100%; height:300px;"
    sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation">
  </iframe>
`;


// Dimensions des popups
var customOptions = {'maxWidth': '400', 'className' : 'custom'}

// Picto marqueur SIGAT
var PitcoSIGAT = L.icon({
iconUrl: 'https://images.seeklogo.com/logo-png/46/1/esri-logo-png_seeklogo-468390.png',
iconSize: [30, 30] });

// Ajout Marqueur SIGAT
var Rennes2 = L.marker([48.1184, -1.7026], {icon: PitcoSIGAT}).bindPopup(popupSIGAT,customOptions);


// Picto Maison
var PitcoMaison = L.icon({
iconUrl: 'https://www.iconarchive.com/download/i139575/microsoft/fluentui-emoji-flat/House-With-Garden-Flat.1024.png',
iconSize: [30, 30] });

// Ajout Marqueur SIGAT
var Maison = L.marker([48.12, -1.6026], {icon: PitcoMaison});


var Traffic = L.tileLayer.wms(
  'https://public.sig.rennesmetropole.fr/geoserver/ows?',
  {
    layers: 'trp_rout:v_rva_trafic_fcd',
    format: 'image/png',
    transparent: true
  }
).addTo(map);


var batiments = L.tileLayer.wms(
  'https://public.sig.rennesmetropole.fr/geoserver/ows?',
  {
    layers: 'ref_cad:batiment',
    format: 'image/png',
    transparent: true
  }
);


var Parking = L.tileLayer.wms(
  'https://public.sig.rennesmetropole.fr/geoserver/ows?',
  {
    layers: 'trp_statio:v_parking',
    format: 'image/png',
    transparent: true
  }
);


// Ajout des Stations de vélos
var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson,{
// Transformer les marqueurs en point
pointToLayer: function (geoJsonPoint, latlng) {
return L.circleMarker(latlng);
},
// Modifier la symbologie des points
style: function (geoJsonFeature) {
return {
fillColor: '#001f3f',
radius: 6,
fillOpacity: 0.7,
stroke: false};
},
}
).addTo(map);
  
  // Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h2> Station : "+velos.feature.properties.nom+"</h2>"+"<hr><h3>" 
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h3>" ;
});
  
  
});



var couches = {
  "Trafic en temps réel": Traffic,
  "Batiments" : batiments,
  "Parkings": Parking,
  "Maison" : Maison,
  "Salle SIGAT" : Rennes2,
  
};




L.control.layers(baselayers, couches, {
  position: 'topleft',
  collapsed: false
}).addTo(map);