var map; // The map object
var myCentreLat = 53.7998;
var myCentreLng = -1.5482;
var initialZoom = 12;
var select;
// Create an empty marker list
var markers = [];

var currentInfoWindow; // This is the current opened info window

function infoCallback(infowindow, marker) {
	return function() {
		// Close any info window opened
		if(currentInfoWindow){
			currentInfoWindow.close();		
		}

		currentInfoWindow = infowindow; // Set the current info window

		infowindow.open(map, marker);
	};
}

function addMarker(myPos,myTitle,myInfo) {
	var marker = new google.maps.Marker({
		position: myPos,
		map: map,
		title: myTitle,
		icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
	});
   var infowindow = new google.maps.InfoWindow({content: myInfo});
   
   google.maps.event.addListener(marker,'click', infoCallback(infowindow, marker));

   return marker;
}

function initialize(){
   var latlng = new google.maps.LatLng(myCentreLat,myCentreLng);
   var myOptions = {
		zoom: initialZoom,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		options: {gestureHandling: 'greedy'}
	};
   
    map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);

	for (id in os_markers) {
		if(os_markers[id].easting == 0 || os_markers[id].northing == 0){
			continue;
		}
		var info = "<div class=infowindow>"
			+ "<h1>" + os_markers[id].title + "</h1>"
			+ "<p><span class='title'>Location: </span> " + os_markers[id].location + "</p>"
			+ "<p><span class='title'>Unveiler: </span>" + os_markers[id].unveiler + "</p>"
			+ "<p><span class='title'>Date: </span>" + os_markers[id].date + "</p>"
			+ "<p><span class='title'>Sponsor: </span>" + os_markers[id].sponser + "</p>"
			+ "<p id='image'>" + "<img src='./images/" + os_markers[id].icon + "' alt='Plaque image' /></p>"+
		"</div>";


		// Convert co-ords using JSCoord Lbrary
		var osPt = new OSRef(os_markers[id].easting,os_markers[id].northing);
		
		var llPt = osPt.toLatLng(osPt);llPt.OSGB36ToWGS84();

		var marker = addMarker(
			new google.maps.LatLng(llPt.lat,llPt.lng),
			os_markers[id].title,info
		);

		// Add the marker to the markers list
		markers.push(marker);
	}

	// Add the cluster
	new MarkerClusterer(
		map, 
		markers, 
		{
			imagePath: "images/m"
		}
	);

	var selectPlaque = document.getElementById("select");
		
	// loop through the markers. 
	for (id in os_markers){
		// create the variable for the string in the dropdown
		var dropOpt = os_markers[id].id +": " + os_markers[id].title;
		// Create an element within the dropdown menu created
		var ele = document.createElement("option");
		// Gets the text from the variable list just created. 
		ele.textContent = dropOpt;
		// Creates the value from text. 
		ele.value = dropOpt; 
		// Adds the text value of the markers id number and title  
		selectPlaque.appendChild(ele);
	}	
}

function searchPlaque(){
	
	// Link the search button to the html dropdown menu
	var dropDown = document.getElementById("select");
			
	// The variable equals the chosen dropdown plaque 
	var selectedPlaque = dropDown.options[dropDown.selectedIndex].value;
		
	// Loop through the markers array to search for the selected plaque title 
	for (id in os_markers) {
		// The marker title becomes the variable plaqueTitle
		var plaqueTitle = os_markers[id].id +": " + os_markers[id].title;
				
		// The map pans to the selected
		if (selectedPlaque ===  plaqueTitle) {
			// Convert co-ords
			var lat_lng = new OSRef(os_markers[id].easting, os_markers[id].northing);
			var pos = lat_lng.toLatLng(lat_lng);
			pos.OSGB36ToWGS84();
			// Increase zoom level
			map.setZoom(20);				
			// Pan to the selected plaques position. 
			map.panTo(pos);
			break;
		}	
	}
	
}   