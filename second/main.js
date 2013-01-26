var MapControl = function() {
	this.map_count = 0;
	Proj4js.defs["EPSG:28992"] = "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs";

    this.loadDefaults = function() {
        this.addMap("http://ec2-50-16-181-24.compute-1.amazonaws.com:8080/geoserver/wms", "ecotopen:Ecotopen", "100px", "10px");
        this.addMap("http://mapsrv.ubvu.vu.nl/proxy/pub/service?", "Nederland 17e eeuw (Blaeu)_blaeu", "100px", "470px");
        this.addMap("http://mapsrv.ubvu.vu.nl/proxy/pub/service?", "Nederland 17e eeuw (Blaeu)_blaeu", "100px", "900px");

    }
	
	this.addMap = function(wms_url, layer_name, t, left) {	
		this.map_count++;
		var map_id = this.map_count;
		
        var map_container = $('<div id="draggable'+map_id+'"class="container ui-widget-content ">').appendTo("#tabs-2");
        map_container.append('<p class="ui-widget-header">'+layer_name+' <button id="close'+map_id+'">Close</button></p>');
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
        
        $("#close"+map_id).button().click(function(event) {
           var test = $(this).parent().parent();
           $(test).remove();
        });
	

		var map = new OpenLayers.Map('map'+map_id, {
		  maxResolution: 1226.5625,
		  maxExtent: new OpenLayers.Bounds(10000.0, 305000.0, 280000.0, 619000.0),
		  projection: new OpenLayers.Projection("EPSG:28992")
		});
		
		var layer = new OpenLayers.Layer.WMS(
			"OpenLayers WMS",
			wms_url,
			{layers:layer_name, format: "image/png", srs:"EPSG:28992"}, {singleTile:false, ratio: 1});
		map.addLayer(layer);
		map.zoomToMaxExtent();
	}
}

$(document).ready(function() {
    var map_control = new MapControl();

    $("#tabs").tabs({activate: function(event, ui) {map_control.loadDefaults()}});
	
   // map_control.loadDefault();

	$("#add_map").button().click(function(event) {
		map_control.addMap("http://mapsrv.ubvu.vu.nl/proxy/pub/service?", "Nederland 17e eeuw (Blaeu)_blaeu");
		//$("#dialog-modal").dialog("open");
    });
	
/*    $("#dialog-modal").dialog({
		autoOpen:false,
		height: 300,
		modal: true
	});
*/
});
