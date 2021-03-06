 // current location
var mymap;
 function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        // x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    // alert("this is location" + position.coords.latitude+position.coords.longitude) ;

    ///coord api call

    $.getJSON("https://api.coord.co/v1/sv/location?latitude=38.995719&longitude=-77.038405&radius_km=100&access_key=lo_qtNC8fHHmJOTkvZnPSv3-aWFdker4UEn5z4LGqzU", function (data) {
        // add GeoJSON layer to the map once the file is loaded
        L.geoJson(data).addTo(mymap);
        // var jsonData = JSON.parse(data);
        console.log(data.features.length);
        for (var i = 0; i < data.features.length; i++) {
                var bikeData = data.features[i].properties;
                console.log("bikeData: "+ bikeData);
                var popUp = L.popup({className: 'popup'}).setContent('<div class="popupDiv">' + bikeData.system_id + '<br>' + bikeData.name + '<br>Bikes Available: ' + bikeData.num_bikes_available +'<br>Docks Available: ' + bikeData.num_docks_available+  '</div>')
                // L.popUp(bikeData, { //dockless bikes first
                //     onEachFeature: function (bikeData, layer) {
                //         layer.bindPopup(bikeData.system_id)
                //     }
                // })
                marker = new L.marker([bikeData.lat, bikeData.lon])
                .bindPopup(popUp)
                .addTo(mymap);
    }});
    ///leaflet and current location cord
    var mymap = L.map("mapid").setView([position.coords.latitude, position.coords.longitude], 50);
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: "pk.eyJ1Ijoibm9taW5iIiwiYSI6ImNqbTk4enhqdTBkazEzcG4xMnF2d2hhMHUifQ.FR4IlfSjVgCaXe4MtqsomQ"
    }).addTo(mymap);
    // x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;


    ///toner layout 
L.tileLayer( 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    attribution: '&copy; <a id="home-link" target="_top" href="../">Map tiles</a> by <a target="_top" href="http://stamen.com">Stamen Design</a>, under <a target="_top" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
  }).addTo(mymap);
    
}


///Coord api

var url = "https://api.coord.co/v1/sv/location?latitude=38.995719&longitude=-77.038405&radius_km=100&access_key=lo_qtNC8fHHmJOTkvZnPSv3-aWFdker4UEn5z4LGqzU";
mymap.on("load", function () {
    window.setInterval(function () {
        map.getSource("bike").setData(url);
    }, 2000);

    map.addSource("bike", { type: "geojson", data: url });
    map.addLayer({
        "id": "bike",
        "type": "symbol",
        "source": "bike",
        "layout": {
        "icon-image": "rocket-15"
        }
    });
});





// for (var i = 0; i < jsonData.features.length; i++) {
//     var bikeData = jsonData.features[i].properties;
//     console.log(bikeData);
//     L.geoJson(jsonData, { //dockless bikes first
//         onEachFeature: function (feature, layer) {
//             layer.bindPopup(bikeData.system_id)
//         }
//     }).addTo(map);