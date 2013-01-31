var MapControl = function() {
	this.maps = {};
    this.map_count = 0;
	Proj4js.defs["EPSG:28992"] = "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs";
    this.initialize = true;
	
	this.map_store = {
		ecotopen2005: {
			url:"http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms",
			layer: "ecotopen:ecotopen_2005",
			title: "Ecotopen 2005",
			style: "ecotopen_2005",
		},
		ecotopen2005_ruwheid: {
			url:"http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms",
			layer: "ecotopen:ecotopen_2005",
			title: "Ruwheid 2005",
			style: "ruwheid_2005",
		},
		ecotopen2005_biomassa: {
			url: "http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms",
			layer: "ecotopen:ecotopen_2005",
			title: "Biomassa 2005",
			style: "biomassa"
		},
	}

    this.loadDefaults = function(){
        if (this.initialize) {
            var t = 140;
            this.addMap(this.map_store.ecotopen2005_ruwheid, t, 10);
            //this.addMap("http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms", "ecotopen:ecotopen_2005", "Biomassa 2005", t, 470, "biomassa");
            //this.addMap("http://mapsrv.ubvu.vu.nl/proxy/pub/service?", "",  "Nederland 17e eeuw (Blaeu)_blaeu", t+"px", "900px", "default");
            this.initialize = false;

        }
    };

	this.addMap = function(map_params, t, left) {	
		this.map_count++;
		var map_id = this.map_count;
		
		wms_url = map_params.url;
		styles = map_params.style;
		layer_title = map_params.title;
		layer_name = map_params.layer;
		
		
        var map_container = $('<div id="draggable'+map_id+'"class="container ui-widget-content ">').appendTo("#tabs-2");
        map_container.append('<p class="ui-widget-header">'+layer_title+' </p>');
        var map_toolbar = $('<div id="map_toolbar"></div>').appendTo(map_container);
        map_toolbar.append('<div class="legend" id="legend_button'+map_id+'">Legenda</div>');
        map_toolbar.append('<div class="close-button"  id="close'+map_id+'">Close</div>')
		var content = $('<div class="content"></div>').appendTo(map_container);
		content.append('<div class="legend" id="legend'+map_id+'"></div>');
        content.append('<div id="map'+map_id+'" class="map"></div></div>');
		map_container.draggable({stack:".ui-widget-content", cancel:"#map"+map_id }).resizable({stop: function(){map.updateSize();}, alsoResize: "#map"+map_id});

        map_container.css("top", t+"px");
        map_container.css("left", left+"px");
        
        $("#close"+map_id).click(function(event) {
           $(this).parent().parent().remove();
        });

        var that = this;
        $("#legend_button"+map_id).click(function(event) {
            return function () {
                that.addLegend(layer_title, styles, map_id);
            }()
        });

		var map = new OpenLayers.Map('map'+map_id, {
		  maxResolution: 1226.5625,
		  maxExtent: new OpenLayers.Bounds(10000.0, 305000.0, 280000.0, 619000.0),
		  projection: new OpenLayers.Projection("EPSG:28992")
		});
		
		map.events.register('moveend'
		
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

    this.addLegend = function(layer_name, style, map_id) {
		
		
		var proxy = "http://localhost:8000/__ajaxproxy/"
		var url = proxy + "http://localhost:8080/geoserver/wms?request=getCapabilities"

		var parseXML = function() {
			return function(xml, testStatus) {
				var legend_url = $("Name:contains('ruwheid')", xml).filter(function(index) {return $(this).text() === "ruwheid"}).siblings("LegendURL").children("OnlineResource").get(0).attributes[2].nodeValue;		
				
				$('<img src="'+ proxy+legend_url +'" />').appendTo($('#legend'+map_id));
				$("#map"+map_id).css('width', '340px');
			};
		};
		$.get(url, parseXML());
    };
   
	this.mapComposer = function(map) {
		
		switch(map) {
			case "ecotopen2005":
				this.addMap(this.map_store.ecotopen2005, 130, 240)
				
			break;
			case "ecotopen2005_ruwheid":
				this.addMap(this.map_store.ecotopen2005_ruwheid, 130, 240)
			break;
			
			case "ecotopen2005_biomassa":
				this.addMap(this.map_store.ecotopen2005_biomassa, 130, 240)
			break;
		}
			
		$(':nth-child(1)', $('select')).attr('selected', 'selected');
	};
};

$(document).ready(function() {
    var map_control = new MapControl();

    $("#tabs").tabs({activate: function(event, ui) {map_control.loadDefaults()}});
	
	//$("#add-map").button().click(function(event) {
		//map_control.addMap("http://mapsrv.ubvu.vu.nl/proxy/pub/service?", "Nederland 17e eeuw (Blaeu)_blaeu", "Nederland 17de eeuw", 240, 120, "");
	//	console.log($('select').val());
    //});

    $("#add-widget").button().click(function(event) {
        alert("Add widget");
//        widget_control.addWidget();
    })

	$('select').change(function (event) {
		map_control.mapComposer($(this).val());
	});
	
	//$('#map-selector').delegate('option', 'click', map_control.mapComposer());
});
