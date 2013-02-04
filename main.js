/*global widget_controller*/
var widget_controller = new ContainerWaalWeelde ();


var MapControl = function () {
    "use strict";

    //holds map objects
    this.maps = [];
    //unique map ids
    this.map_count = 0;
    //holds objects for which pan/zoom scroll is turned on
    this.lockList = [];


    Proj4js.defs["EPSG:28992"] = "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs";

    this.initialize = true;
    this.map_store = {
        base: {
            url: "http://mapsrv.ubvu.vu.nl/proxy/pub/service?",
            layer: "Top 25 raster (2009)_top_raster",
            title: "TOP25NL"
        },
        ecotopen2005: {
            url: "http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms?",
            layer: "ecotopen:ecotopen_2005",
            title: "Ecotopen 2005",
            style: "ecotopen_2005"
        },
        ecotopen2005_ruwheid: {
            url: "http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms?",
            layer: "ecotopen:ecotopen_2005",
            title: "Ruwheid 2005",
            style: "ruwheid_2005"
        },
        ecotopen2005_biomassa: {
            url: "http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms?",
            layer: "ecotopen:ecotopen_2005",
            title: "Biomassa 2005",
            style: "biomassa_2005"
        }
    };


    this.initialize = function (){
        if (this.initialize) {
            var t = 140;
            this.addMap(this.map_store.ecotopen2005_ruwheid, t, 10);
            this.initialize = false;
        }
    };

    this.addMap = function(map_params, t, left) {
        var wms_url = map_params.url;
        var styles = map_params.style;
        var layer_title = map_params.title;
        var layer_name = map_params.layer;
        var wms_url_proxied = 'http://waalweelde.ndkv.nl/proxy.cgi?url=' + wms_url;
//        wms_url_proxied = 'http://localhost:8000/__ajaxproxy/' + wms_url
        

        var cont = widget_controller.mapContainer(layer_title, t, left);
        var map_id = cont[0];
        var map_container = cont[1];
        console.log(map_id);


//MAP        
        var map = new OpenLayers.Map('map'+map_id, {
        maxResolution: 1226.5625,
        maxExtent: new OpenLayers.Bounds(10000.0, 305000.0, 280000.0, 619000.0),
        projection: new OpenLayers.Projection("EPSG:28992")
        });

        //register map events
        map.events.register('moveend', map, function(e) {
            return function() {
                that.centerMaps(e, map_id, that);
            }()
        });

        //TODO: add remove functionality
        this.maps.push(map);

        map_container.draggable({stack:".ui-widget-content", cancel:"#map"+map_id }).resizable({stop: function(){map.updateSize();}, alsoResize: "#map"+map_id});
        //add legend
        //TODO: create own object and move functionality there
        var that = this;
        $("#legend_button"+map_id).button().click(function(event) {
            $('#legend'+ map_id +' img');
            return function () {
            //TODO: pass content object instead
                that.addLegend(layer_title, styles, map_id);
            }()
        });

        //lock button
        //TODO: crate map object and move functionality there
        $("#lock"+map_id).button().click(function(event) {
            return function() {
                if (that.lockList.indexOf(map_id) === -1) {
                    that.lockList.push(map_id);
                //$('#lock'+map_id).attr('checked', true)
                } else {
                that.lockList.splice(that.lockList.indexOf(map_id), 1);
                //$('#lock'+map_id).attr('checked', false);
            };  
        
            //console.log(that.lockList);
        }();
        });

//LAYER    
        var layer = new OpenLayers.Layer.WMS(
        "OpenLayers WMS",
            wms_url,
            {layers:layer_name, format: "image/png", srs:"EPSG:28992", styles:styles}, {singleTile:false, ratio: 1});
        
        map.addLayer(layer);
        map.zoomToMaxExtent();

        var center = new OpenLayers.LonLat(new Array(6.066243, 51.870927));
        var transformed = center.clone().transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:28992"));
        map.setCenter(transformed, 6);
    
    
        //getFeature  
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
                    console.log(wms_url_proxied);
                }
              } 
        });
        
        map.addControl(getFeatureControl);
        getFeatureControl.activate();

};

    this.addLegend = function(layer_name, style, map_id) {
        var proxy = 'http://waalweelde.ndkv.nl/proxy.cgi?url='
//        var proxy = "http://localhost:8000/__ajaxproxy/"
        var url = proxy + "http://ec2-23-22-59-21.compute-1.amazonaws.com:8080/geoserver/wms?request=getCapabilities";
        var parseXML = function() {
            return function(xml, testStatus) {
                var legend_url = $("Name:contains('"+style+"')", xml).filter(function(index) {return $(this).text() === style}).siblings("LegendURL").children("OnlineResource").get(0).attributes[2].nodeValue;
               
                var img = new Image();
                img.src = legend_url
                img.onload = function() {
                    alert(this.width + 'x' + this.height);
                    console.log($('#map'+map_id).width());
                    $("#map"+map_id).width($('#map'+map_id).width() - this.width);
                    $(img).appendTo($('#legend'+map_id));
                }
                

                //
                //var current_width = $('#map'+map_id).css('width');
            };
        };
    
        $.get(url, parseXML());
    };



    this.mapComposer = function(map) {
        switch(map) {
            case "ecotopen2005":
                this.addMap(this.map_store.ecotopen2005, 130, 240);
                
            break;
            case "ecotopen2005_ruwheid":
                this.addMap(this.map_store.ecotopen2005_ruwheid, 130, 240);
            break;
            
            case "ecotopen2005_biomassa":
                this.addMap(this.map_store.ecotopen2005_biomassa, 130, 240);
            break;
            case "top10nl":
                this.addMap(this.map_store.base, 130, 240);
            break;
            case "ecotopen2005_w":
                this.addWidget('area_2005');
            break;
            case "log":
                console.log('case log');
                this.addLog();
            break;
        }
            
        $(':nth-child(1)', $('select')).attr('selected', 'selected');
    };

    this.addWidget = function(data_source) {
        var widget = new PieChart(data_source).draw();
    };

    this.addLog = function() {
        //global widget_control
        var log = widget_controller.logContainer2();

        console.log('adding logger');

    }

    this.centerMaps = function(event, map_id, that) {
        if (that.lockList.indexOf(map_id) !== -1) {
            var map = that.maps[map_id];
            var center = map.getCenter()
            var zoom = map.getZoom()
            for (var i=0;  i < that.lockList.length; i++) {
                that.maps[that.lockList[i]].setCenter(center);
                that.maps[that.lockList[i]].zoomTo(zoom);
            }
        }
    };
};

$(document).ready(function() {
    OpenLayers.ProxyHost = 'http://waalweelde.ndkv.nl/proxy.cgi?url=';
    //OpenLayers.ProxyHost = 'localhost:8000/__ajaxproxy/'

    var map_control = new MapControl();

    $("#tabs").tabs({activate: function(event, ui) {map_control.initialize()}});
    

    $("#widget-selector").change(function(event) {
        map_control.mapComposer($(this).val());
    })

    $('#map-selector').change(function (event) {
        map_control.mapComposer($(this).val());
    });
    
});
