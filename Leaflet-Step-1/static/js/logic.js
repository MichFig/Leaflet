// Create the map & set height in style.css 
var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 5
});

// Add the light mode tile layer
var lightmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}
);

// Add lightmap tile layer to the map.
lightmap.addTo(map);

// // Add the dark tile layer
// var darkmap = L.tileLayer(
//   "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/dark-v10",
//   accessToken: API_KEY
// }
// );

// Add dark tile layer to the map.
// darkmap.addTo(map);    


// // Add the satellite tile layer
// var satmap = L.tileLayer(
//   "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/satellite-v9",
//   accessToken: API_KEY
// }
// );

// Add satellite tile layer to the map.
// satmap.addTo(map);  

// // Add the streets tile layer
// var streetmap = L.tileLayer(
//   "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/streets-v11",
//   accessToken: API_KEY
// }
// );

// Add streets tile layer to the map.
// streetmap.addTo(map);      

// // Add the outdoors tile layer
// var outdoorsmap = L.tileLayer(
//   "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/outdoors-v11",
//   accessToken: API_KEY
// }
// );

// Add outdoor tile layer to the map.
// outdoorsmap.addTo(map); 

// Retrieves our earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function (data) {

  // Style marker color 
  function getColor(depth) {
    switch (true) {
      case depth > 139:
        return "#C80000";
      case depth > 75:
        return "#FF9100";
      case depth > 40:
        return "#7AFF93";
      case depth > 6.2:
        return "#7DFFFF";
      case depth > 2.8:
        return "#A0E6FF";
      case depth > 0.03:
        return "#BFCCFF";
      case depth < 0.05:
        return "#FFFFFF";
    }
  }
  // Style marker fill 
  function styleInfo(feature) {
    return {
      fillColor: getColor(feature.geometry.coordinates[2]),
      radius: getRadius(feature.properties.mag),
      weight: .5,
      opacity: 5,
      color: "#000000",
      stroke: true,
      fillOpacity: 0.7

    };
  }

  // Style marker magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 0;
    }
    return magnitude * 5;
  }
  // GeoJSON layer 
  L.geoJson(data, {
    // Circle conversion
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Style for each circleMarker 
    style: styleInfo,
    // Pop up
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(map);

  // Legend
  var legend = L.control({
    position: "bottomright"

  });
  // Then add all the details for the legend
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-0.05, 0.03, 2.8, 6.2, 40, 75, 139];
    var colors = [

      "#C80000",
      "#FF9100",
      "#7AFF93",
      "#7DFFFF",
      "#A0E6FF",
      "#BFCCFF",
      "#FFFFFF"
    ];

    
    // Looping through intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);
});
