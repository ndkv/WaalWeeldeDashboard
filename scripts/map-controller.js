define(["lib/proj4js-combined", "create-map", "legend",], function (_, createMap, addLegend) {

return function () {
    "use strict";
    //holds map objects
    this.maps = [];
    //unique map ids
    this.map_count = 0;
    //holds objects for which pan/zoom scroll is turned on
    this.lockList = [];

    Proj4js.defs["EPSG:28992"] = "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs";

    this.initialized = false;

    this.amazon_serv = 'http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms?';
    this.map_store = {
        "top25nl": {
            url: "http://mapsrv.ubvu.vu.nl/proxy/pub/service?",
            layer: "Top 25 raster (2009)_top_raster",
            title: "TOP25NL" 
        },
        "ecotopen2008": {
            url: this.amazon_serv,
            layer: "ecotopen:ecotopen_2008",
            title: "Vegetatiestructuur 2008",
            style: "vegetatiestructuur",
            legend: true
        },
        "ecotopen2008_ruwheid": {
            url: this.amazon_serv,
            layer: "ecotopen:ecotopen_2008",
            title: "Ruwheid 2008",
            style: "ruwheid_2008",
            legend: true
        },
        "ecotopen2008_biomassa": {
            url: this.amazon_serv,
            layer: "ecotopen:ecotopen_2008",
            title: "Biomassa 2008",
            style: "biomassa_2008",
            legend: true
        },
        "ecotopen2005": {
            url: this.amazon_serv,
            layer: "ecotopen:ecotopen_2005",
            title: "Vegetatiestructuur 2005",
            style: "vegetatiestructuur",
            legend: true
        },
        "ecotopen2005_ruwheid": {
            url: this.amazon_serv,
            layer: "ecotopen:ecotopen_2005",
            title: "Ruwheid 2005",
            style: "ruwheid_2005",
            legend: true
        },
        "ecotopen2005_biomassa": {
            url: this.amazon_serv,
            layer: "ecotopen:ecotopen_2005",
            title: "Biomassa 2005",
            style: "biomassa_2005",
            legend: true
        },
        "ecotopen1997": {
            url: this.amazon_serv,
            layer: "ecotopen:ecotopen_1997",
            title: "Vegetatiestructuur 1997",
            style: "vegetatiestructuur",
            legend: true
        },
        "ecotopen1997_ruwheid": {
            url: this.amazon_serv,
            layer: "ecotopen:ecotopen_1997",
            title: "Ruwheid 1997",
            style: "ruwheid_1997",
            legend: true
        },
        "ecotopen1997_biomassa": {
            url: this.amazon_serv,
            layer: "ecotopen:ecotopen_1997",
            title: "Biomassa 1997",
            style: "biomassa_1997",
            legend: true
        },
        "bebouwdeuiterwaard": {
            url: this.amazon_serv,
            layer: "ecotopen:ecotopen_2005",
            title: "Bebouwde uiterwaard",
            style: "bebouwdeuiterwaard",
            legend: true
        },
        "satellite": {
            url: "http://gdsc.nlr.nl/wms/dkln2006",
            layer: "dkln2006-1m",
            title: "NLR luchtfoto's 2006",
            legend: false
            //http://gdsc.nlr.nl/wms/dkln2006?LAYERS=dkln2006-1m&TRANSPARENT=TRUE&VERSION=1.1.1&FORMAT=image%2Fpng&SERVICE=WMS&REQUEST=GetMap&STYLES=&SRS=EPSG%3A28992&BBOX=185750.72,429023.68,185965.76,429238.72&WIDTH=256&HEIGHT=256
        }
    };

    this.initialize = function (){
        if (!this.initialized) {
            var t = 140;
            this.addMap(this.map_store.ecotopen2005_ruwheid, t, 10);
            this.addMap(this.map_store.ecotopen2005_biomassa, t, 450);
            this.addMap(this.map_store.top25nl, t, 890);
            this.initialized = true;


	    $.post(proxyurl+'http://geoplaza.ubvu.vu.nl/gpzviewer/resources/getViews.php', {type: 'cms'}, function (data) {
            $.each($.parseJSON(data), function (index, value)  {
                    $('#geoplaza').append('<option value="' + value.idmap_view  + '">' + value.name+ '</option>');
                }); 
            });
        }
    };

    this.synchronizedMovementControl = function (map, map_num) {
        var that = this;
        map.events.register('moveend', map, function(e) {
            return function() {
                that.centerMaps(e, map_num, that);
            }()
        });

    }
    
    this.legendButton = function (map_id,styles, layer_title, map, wms_url) {
        //add legend
        //TODO: create own object and move functionality there
        $("#legend_button"+map_id).button().click(function(event) {
            $('#legend'+ map_id +' img');
            return function () {
            //TODO: pass content object instead
                addLegend(layer_title,styles, map_id, map, wms_url);
            }()
        });

    };

    this.lockButton = function (map_id, map_num) {
        var that = this;
        //TODO: crate map object and move functionality there
        $("#lock"+map_id).button().click(function(event) {
            return function() {
                if (that.lockList.indexOf(map_num) === -1) {
                    that.lockList.push(map_num);
                //$('#lock'+map_id).attr('checked', true)
                } else {
                that.lockList.splice(that.lockList.indexOf(map_num), 1);
                //$('#lock'+map_id).attr('checked', false);
            };  
        
            //console.log(that.lockList);
        }();
        });
    }

    this.getFeatureControl = function (wms_url, layer, map) {
        var getFeatureControl = new OpenLayers.Control.WMSGetFeatureInfo({
            url: wms_url,
            drillDown: false,
            hover: false,
            layers: [layer],
            queryVisible: true,
            eventListeners: {
                getfeatureinfo: function (event) {
                    if ($('.logger').length !== 0) {
                        var table = $('<table></table>').prependTo($('.logger'));

                        var header = $('tr', $(event.text))[0]; 
                        var content = $('tr', $(event.text))[1]; 

                        table.prepend(content); 
                        table.prepend(header); 
                    }

                    //TODO: style differently 
                    var pop = new OpenLayers.Popup.FramedCloud(
                        "chicken", 
                        map.getLonLatFromPixel(event.xy),
                        null,
                        //change this value to remove big table
                        'Ecotoop:' + $('tr', $(event.text))[1].children[2].innerText,
                        null,
                        true
                    )
                    pop.panMapIfOutOfView = false;
                    map.addPopup(pop);
                    
                },
                beforegetfeatureinfo: function(event) {
                    //console.log('what');
                },
                nogetfeatureinfo: function(event) {
                    console.log("Cannot find queryable layers");
                }
              } 
        });

        map.addControl(getFeatureControl);
        getFeatureControl.activate();
    };

    this.graticuleControl = function (map) {
        var graticuleCtl1 = new OpenLayers.Control.Graticule({
            numPoints: 3, 
            labelled: false
        });
        
        map.addControl(graticuleCtl1);
        graticuleCtl1.activate();
    };

    this.addMap = function(map_params, t, left) {
        var wms_url = map_params.url;
        var styles = map_params.style;
        var layer_title = map_params.title;
        var layer_name = map_params.layer;
	var wms_url_proxied = proxyurl + wms_url;
        
//MAP 
        //TODO: fix this..
        var map_cont = createMap(layer_title, t, left, map_params.legend);
        var map = map_cont[0];
        var map_id = map_cont[1];
        this.maps.push(map);
        var map_num = this.maps.length - 1;

        this.lockButton(map_id, map_num);
        this.synchronizedMovementControl(map, map_num);

        //LAYER    
        var layer = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            wms_url,
            {layers:layer_name, format: "image/png", srs:"EPSG:28992", styles:styles, transparent: true}, {singleTile:false, ratio: 1});

	var backgroundLayer = new OpenLayers.Layer.WMS(
	"BRT achtergrondkaart","http://geodata.nationaalgeoregister.nl/wmsc?",{layers: 'brtachtergrondkaart', transparent: 'true', false: 'image/png'}, {isBaseLayer: true, projection: 'EPSG:28992',units: 'm', maxExtent: new OpenLayers.Bounds(-285401.92,22598.08,595401.92,903401.92), maxResolution:3440.64, resolutions:[3440.64,1720.32,860.16,430.08,215.04,107.52,53.76,26.88,13.44,6.72,3.36,1.68,0.84]});
	var aerialLayer = 	new OpenLayers.Layer.WMS(
	"Luchtfoto Eurosense 2006","http://gdsc.nlr.nl/wms/dkln2006?",{layers: 'dkln2006-1m', false: 'image/png'}, {isBaseLayer: true, projection: 'EPSG:28992',units: 'm', maxExtent: new OpenLayers.Bounds(-285401.92,22598.08,595401.92,903401.92), maxResolution:3440.64, resolutions:[3440.64,1720.32,860.16,430.08,215.04,107.52,53.76,26.88,13.44,6.72,3.36,1.68,0.84]});

	var blankLayer = new OpenLayers.Layer("Blank",{isBaseLayer: true});

        map.addLayers([layer, backgroundLayer,aerialLayer, blankLayer]);
	map.addControl(new OpenLayers.Control.LayerSwitcher());

        this.legendButton(map_id,styles, layer_name, map, wms_url);
        this.getFeatureControl(wms_url, layer, map);
        this.graticuleControl(map);

        //center map
        var center = new OpenLayers.LonLat(new Array(6.066243, 51.870927));
        var transformed = center.clone().transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:28992"));
        map.setCenter(transformed, 6);

};

    this.addMapFromWMS = function(wmsURL,layerName,layerTitle) {
	var t = 130;
	var left =  240; 
        var legend = true;      
//MAP 
        //TODO: fix this..
        var map_cont = createMap(layerTitle, t, left, legend);
        var map = map_cont[0];
        var map_id = map_cont[1];
        this.maps.push(map);
        var map_num = this.maps.length - 1;

        this.lockButton(map_id, map_num);
        this.synchronizedMovementControl(map, map_num);

        //LAYER    
        var layer = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            wmsURL,
            {layers:layerName, format: "image/png", srs:"EPSG:28992",transparent: 'true'}, {singleTile:false, ratio: 1});
	
	var backgroundLayer = new OpenLayers.Layer.WMS(
	"BRT achtergrondkaart","http://geodata.nationaalgeoregister.nl/wmsc?",{layers: 'brtachtergrondkaart', transparent: 'true', false: 'image/png'}, {isBaseLayer: true, projection: 'EPSG:28992',units: 'm', maxExtent: new OpenLayers.Bounds(-285401.92,22598.08,595401.92,903401.92), maxResolution:3440.64, resolutions:[3440.64,1720.32,860.16,430.08,215.04,107.52,53.76,26.88,13.44,6.72,3.36,1.68,0.84]});

	var aerialLayer = 	new OpenLayers.Layer.WMS(
	"Luchtfoto Eurosense 2006","http://gdsc.nlr.nl/wms/dkln2006?",{layers: 'dkln2006-1m', false: 'image/png'}, {isBaseLayer: true, projection: 'EPSG:28992',units: 'm', maxExtent: new OpenLayers.Bounds(-285401.92,22598.08,595401.92,903401.92), maxResolution:3440.64, resolutions:[3440.64,1720.32,860.16,430.08,215.04,107.52,53.76,26.88,13.44,6.72,3.36,1.68,0.84]});


	var blankLayer = new OpenLayers.Layer("Blank",{isBaseLayer: true});
	
	map.addLayers([layer, backgroundLayer,aerialLayer, blankLayer]);	
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	var styles = "";
        this.legendButton(map_id,styles,layerName, map,wmsURL);
        this.getFeatureControl(wmsURL, layer, map);
        this.graticuleControl(map);

        //center map
        var center = new OpenLayers.LonLat(new Array(6.066243, 51.870927));
        var transformed = center.clone().transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:28992"));
        map.setCenter(transformed, 6);
};






    this.mapComposer = function(map) {
        switch(map) {
            case "ecotopen1997_w":
                this.addWidget('area_1997');
            break;
            case "ecotopen2005_w":
                this.addWidget('area_2005');
            break;
            case "ecotopen2008_w":
                this.addWidget('area_2008');
            break;
            case "biomassa":
                new BarChart('biomassa');
            break;
	    case "waterstand":
		this.addWidget('water_level');
	    break;
            case "log":
                console.log('case log');
                this.addLog();
            break;
            default:
                this.addMap(this.map_store[map], 130, 240);
        }
            
        $(':nth-child(1)', $('select')).attr('selected', 'selected');
    };

    this.addMapExternal= function(id, name) {
        var map = this.createMap(name, 240, 240, false);
	$.post(proxyurl+'http://geoplaza.ubvu.vu.nl/gpzviewer/resources/getViews.php', {id: id}, function (data) {
    
            var map_params = $.parseJSON(data);

            $.each(map_params.sources, function (index, item) {
                
                var layer = new OpenLayers.Layer.WMS(
                    "OpenLayers WMS",
                    item.proxyurl,
                    {layers:item.sourcename, format: "image/png", srs:"EPSG:28992"}, {singleTile:false, ratio: 1});
                
                map.addLayer(layer);
            });
            
            var center = new OpenLayers.LonLat(new Array(6.066243, 51.870927));
            var transformed = center.clone().transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:28992"));
            map.setCenter(transformed, 6);
        
        });
    };
    
    this.addWidget = function(data_source) {
        require(["charts"], function (PieChart) {
            var widget = new PieChart(data_source).draw();
        });
    };

    this.addLog = function() {
        /*global widget_control*/
        var log = widget_controller.logContainer2();
    }

    this.centerMaps = function(event, map_id, that) {
        if (that.lockList.indexOf(map_id) !== -1) {
            var map = that.maps[map_id];
            console.log("getCenter")
            var center = map.getCenter()
            var zoom = map.getZoom()
            for (var i=0;  i < that.lockList.length; i++) {
                that.maps[that.lockList[i]].setCenter(center);
                that.maps[that.lockList[i]].zoomTo(zoom);
            }
        }
    };
    }
})

