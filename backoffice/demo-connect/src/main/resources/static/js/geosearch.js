function searchExtent(bounds, cb) {
	$.ajax({
        url: "/connect/geospatial/searchextent",
        data: { 
        	minLon: bounds.getWest(),
        	minLat: bounds.getSouth(),
        	maxLon: bounds.getEast(),
        	maxLat: bounds.getNorth()
        }
    }).then(cb)
}

function find_customers(map, markersCluster) {
	
	markersCluster.clearLayers();
	
	function callback(data) {
		for (i = 0; i < data.length; i++) {
			coord = data[i].geo;
			var marker = L.marker([coord[1], coord[0]]);
			marker.bindPopup(data[i].name);
			marker.on('mouseover', function(e) {
				this.openPopup();
			});
    		markersCluster.addLayer(marker);
		}
    }

	searchExtent(map.getBounds(), callback);
}


function find_customers_in_rectangle(bounds, drawLayer) {
	
	function callback(data) {
		for (i = 0; i < data.length; i++) {
			coord = data[i].geo;
			var marker = L.marker([coord[1], coord[0]]); // TODO : amettre en rouge : https://stackoverflow.com/questions/23567203/leaflet-changing-marker-color
			//        var myIcon = L.icon(
			//          iconUrl: 'res/marker-icon-red.png',
			//          shadowUrl: 'res/marker-shadow.png'
			//        });

			drawLayer.addLayer(marker);
		}
    }

	searchExtent(bounds, callback);
}


function searchPolygon(latlngs, cb) {
	coords = [];
	for(i=0; i<latlngs[0].length; i++) {
		coords.push(latlngs[0][i].lat + ',' + latlngs[0][i].lon);
	}
	$.ajax({
        url: "/connect/geospatial/searchpolygon", // TODO : a implementer 
        data: coords
    }).then(cb)
}

function find_customers_in_polygon(latlngs, drawLayer) {
	
	function callback(data) {
		for (i = 0; i < data.length; i++) {
			coord = data[i].geo;
			var marker = L.marker([coord[1], coord[0]]);

			drawLayer.addLayer(marker);
		}
    }

	searchPolygon(latlngs, callback);
}

function load_map() {
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib }),
            map = new L.Map('map', { center: new L.LatLng(51.505, -0.04), zoom: 13 }),
            drawnItems = L.featureGroup().addTo(map);
	L.control.locate({
	    strings: {
	        title: "Center at your current location"
	    }
	}).addTo(map);
    L.control.layers({
        'osm': osm.addTo(map),
        "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
            attribution: 'google'
        })
    }, { 'drawlayer': drawnItems }, { position: 'topleft', collapsed: false }).addTo(map);
    map.addControl(new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            polyline: {
                allowIntersection: false
            }
        },
        draw: {
            polyline: false, // Turns off this drawing tool
            circle: false, // Turns off this drawing tool
            polygon: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                },
                shapeOptions: {
                    color: '#bada55'
                }
            },
            rectangle: {
                shapeOptions: {
                    clickable: false
                }
            }
        }
    }));
  

    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;

        console.log("drawing finsihed !");
        if(event.layerType === 'rectangle'){
        	find_customers_in_rectangle(event.layer._bounds, drawnItems);
        }
        else if(event.layerType === 'polygon'){
        	find_customers_in_polygon(event.layer._latlngs, drawnItems);
        }
        drawnItems.addLayer(layer);
    });
    
    var markersCluster = new L.MarkerClusterGroup({
        iconCreateFunction: function(cluster) {
            var digits = (cluster.getChildCount()+'').length;
            return L.divIcon({ 
                html: cluster.getChildCount(), 
                className: 'cluster digits-'+digits,
                iconSize: null 
            });
        }
    });
    map.addLayer(markersCluster);
    
    // map.on('zoomend', function() { console.log("map zoom ended") });
    map.on('load', find_customers(map, markersCluster)); 
    map.on('moveend', function (event) {
    	find_customers(map, markersCluster)
    });
}
