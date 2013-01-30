var MapControl = function() {
	this.maps = {};
    this.map_count = 0;
	Proj4js.defs["EPSG:28992"] = "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs";
    this.initialize = true;

    this.loadDefaults = function(){
        if (this.initialize) {
            var t = 120;
            this.addMap("http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms", "ecotopen:ecotopen_2005", "Ruwheid 2005", t+"px", "10px", "ruwheid_2005");
            this.addMap("http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms", "ecotopen:ecotopen_2005", "Biomassa 2005", t+"px", "470px", "biomassa");
            //this.addMap("http://mapsrv.ubvu.vu.nl/proxy/pub/service?", "",  "Nederland 17e eeuw (Blaeu)_blaeu", t+"px", "900px", "default");
            this.initialize = false;

        }
    };

	this.addMap = function(wms_url, layer_name, title, t, left, styles) {	
		this.map_count++;
		var map_id = this.map_count;
		
        var map_container = $('<div id="draggable'+map_id+'"class="container ui-widget-content ">').appendTo("#tabs-2");
        map_container.append('<p class="ui-widget-header">'+title+' </p>');
        var map_toolbar = $('<div id="map_toolbaar"></div>').appendTo(map_container);
        map_toolbar.append('<div class="legend" id="legend'+map_id+'">Legenda</div>');
        map_toolbar.append('<div class="close-button"  id="close'+map_id+'">Close</div>')
        map_container.append('<div id="map'+map_id+'" class="map"></div></div>');
		map_container.draggable({stack:".ui-widget-content", cancel:"#map"+map_id }).resizable({stop: function(){map.updateSize();}, alsoResize: "#map"+map_id});
        //map_container.css("width","450px");

        console.log(wms_url);
        console.log(layer_name);
        console.log(t);
        console.log(left);

        if ((top !== undefined) && (left !== undefined)) {
            map_container.css("top", t);
            map_container.css("left", left);
            map_container.css("position","absolute");
        }
        
        $("#close"+map_id).click(function(event) {
           $(this).parent().remove();
        });


        var that = this;
        $("#legend"+map_id).click(function(event) {
            
            return function () {
                that.addLegend(layer.layer_name);
            }()
        });
	

		var map = new OpenLayers.Map('map'+map_id, {
		  maxResolution: 1226.5625,
		  maxExtent: new OpenLayers.Bounds(10000.0, 305000.0, 280000.0, 619000.0),
		  projection: new OpenLayers.Projection("EPSG:28992")
		});
		
		var layer = new OpenLayers.Layer.WMS(
			"OpenLayers WMS",
			wms_url,
			{layers:layer_name, format: "image/png", srs:"EPSG:28992", styles:styles}, {singleTile:false, ratio: 1});
		map.addLayer(layer);
		map.zoomToMaxExtent();		

51.870927,6.066243

        var center = new OpenLayers.LonLat(new Array(6.066243, 51.870927));
        var transformed = center.clone().transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:28992"));
        map.setCenter(transformed, 6);

        this.maps[map_id] = map;
	};

    this.addLegend = function(layer_name) {
        var url = "http://localhost:8080/geoserver/wms?request=geacapabilities&format=text/json";
		//var url = "http://localhost:8000/__ajaxproxy/http://localhost:8080/geoserver/wms?request=getcapabilities"

		
		
		//$.get(url, {format: 'text/xml'}, parseXML);
		//$.get(url, parseXML);
		
		$.ajax({
			dataType: "jsonp xml",
			url: url,
			//data: data,
			success: parseXML
		});

        function parseXML(xml) {
            console.log("Got XML");
			console.log(xml);
            console.log($(xml).find(layer_name));

        }

    }
    
	this.addMapExt = function(wms_url, layer_name) {
		//var map_container = $('<span>"gx_mappanel"</span>').appendTo("#tabs-2");
	
		new Ext.Window({
			title: "GeoExt in Action",
			height: 280, width: 450, layout: "fit",
			items: [{
				xtype: "gx_mappanel",
				layers: [new OpenLayers.Layer.WMS(
					"Global Imagery",
					wms_url,
					{layers: layer_name, format: "image/png", srs:"EPSG:28992"}, {singleTile:false, ratio:1}
				)],
				zoom: 1
			}]
		}).show();	
	};
}

$(document).ready(function() {
    var map_control = new MapControl();

    $("#tabs").tabs({activate: function(event, ui) {map_control.loadDefaults()}});
	
   // map_control.loadDefault();

	$("#add-map").button().click(function(event) {
		map_control.addMap("http://mapsrv.ubvu.vu.nl/proxy/pub/service?", "Nederland 17e eeuw (Blaeu)_blaeu");
		//map_control.addMapExt("http://mapsrv.ubvu.vu.nl/proxy/pub/service?", "Nederland 17e eeuw (Blaeu)_blaeu");
		//$("#dialog-modal").dialog("open");
    });

    $("#add-widget").button().click(function(event) {
        alert("Add widget");
//        widget_control.addWidget();
    })
	
/*    $("#dialog-modal").dialog({
		autoOpen:false,
		height: 300,
		modal: true
	});
*/
});
