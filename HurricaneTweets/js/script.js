var map;
var tweetData;

var myIcon = L.icon({
	iconUrl : './image/twitter.png',
	iconSize:[16,16],
	iconAnchor: [10, 10],
	popupAnchor: [0, -14]
});


function initialize()	{
	map = L.map('map').setView([51.505, -0.09], 2);
	
	//Load basemap 
	L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery ©CloudMade',
		maxZoom: 18
		//add the basetiles to the map object	
	}).addTo(map);
	
	//Define array to hold results returned from server
	tweetData = new Array();
	
	//AJAX request to server; accepts a URL to which the request is sent 
	//and a callback function to execute if the request is successful. 
	$.getJSON("fetchData.php", function(results){ 
		//Populate tweetData with results
		for (var i = 0; i < results.length; i++ ){
			tweetData.push ({
				id: results[i].id, 
				body: results[i].body, 
				lat: results[i].lat, 
				lon: results[i].lon
			}); 
		}
	});
};

function fetchData(){	
	//create a cluster for each marker
	var cluster = L.markerClusterGroup();

	//Loop through tweetData to create marker at each location 
	for (var i = 0; i< tweetData.length; i++)	{ 
		var markerLocation = new L.LatLng(tweetData[i].lat, tweetData[i].lon);
		var marker = new L.marker(
			markerLocation,
			{icon:myIcon})
			.bindPopup(
				'<br/><b>Tweet Message:</b>' + tweetData[i].body +
              	'<br/><b>Latitude is :</b> ' + tweetData[i].lat +
              	'<br/><b>Longitude is :</b> ' + tweetData[i].lon
			);
		cluster.addLayer(marker);
	}
	map.addLayer(cluster);
};

function clearData()	{
	map.eachLayer(function (layer) {
		map.removeLayer(layer);
	});
	L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery ©CloudMade',
		maxZoom: 18
	//add the basetiles to the map object	
	}).addTo(map);
}