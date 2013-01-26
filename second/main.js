$(function() {
    $( "#draggable" ).draggable({stack:".ui-widget-content", cancel:"#map"}).resizable({stop: function(){google.maps.event.trigger(map, "resize");}, alsoResize: "#map"});

    $( "#draggable2" ).draggable({stack:".ui-widget-content", cancel:"#map2" }).resizable({stop: function(){google.maps.event.trigger(map2, "resize");}, alsoResize: "#map2"});
    
    $("#draggable3" ).draggable({stack:".ui-widget-content", cancel:"#map3" }).resizable({stop: function(){map3.updateSize();}, alsoResize: "#map3"});
    
    $("#draggable4" ).draggable({stack:".ui-widget-content", cancel:"#map4" }).resizable({stop: function(){map4.updateSize();}, alsoResize: "#map4"});

	$( "#tabs" ).tabs();
	
    $("#draggable5" ).draggable({stack:".ui-widget-content", cancel: "container"}); //.resizable({stop: function(){map4.updateSize();}, alsoResize: "#container"});
    $("#draggable5").draggable( {cancel: "#contaimer"});

    var lat_lng = new google.maps.LatLng(51.879193,5.772886);
    var options = {
        zoom: 14,
        center: lat_lng,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        disableDoubleClickZoom: true
    };
    
    var map = new google.maps.Map(document.getElementById("map"), options);

//    console.log(options);

    options.mapTypeId = google.maps.MapTypeId.SATELLITE;

    var map2 = new google.maps.Map(document.getElementById("map2"), options);
    
    var map3 = new OpenLayers.Map('map3', {
      maxResolution: 1226.5625,
      maxExtent: new OpenLayers.Bounds(10000.0, 305000.0, 280000.0, 619000.0),
      projection: new OpenLayers.Projection("EPSG:28992")
    });
    
        
    var historic = new OpenLayers.Layer.WMS(
        "OpenLayers WMS",
        "http://mapsrv.ubvu.vu.nl/proxy/pub/service?",
        {layers:"Nederland 17e eeuw (Blaeu)_blaeu", format: "image/png", srs:"EPSG:28992"}, {singleTile:false, ratio: 1});
    map3.addLayer(historic);
    map3.zoomToMaxExtent();
    
    var map4 = new OpenLayers.Map('map4', {
      maxResolution: 1226.5625,
      maxExtent: new OpenLayers.Bounds(10000.0, 305000.0, 280000.0, 619000.0),
      projection: new OpenLayers.Projection("EPSG:28992")
    });
    
    var wms = new OpenLayers.Layer.WMS(
        "OpenLayers WMS",
        "http://mapsrv.ubvu.vu.nl/proxy/pub/service?",
        {layers:"Top 25 raster (2009)_top_raster", format: "image/png", srs:"EPSG:28992"}, {singleTile:false, ratio: 1});

    var wet = new OpenLayers.Layer.WMS(
        "OpenLayers WMS wet",
        "http://geodata.nationaalgeoregister.nl/digitaaltopografischbestand/ows?",
        {layers:"digitaaltopografischbestand:vlakken", transparent: true, format: "image/png", srs:"EPSG:28992"}, {singleTile:false, ratio: 1}, {isBaseLayer: false} );


    Proj4js.defs["EPSG:28992"] = "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs";

    var center = new OpenLayers.LonLat(new Array(5.772886, 51.879193));
    var transformed = center.clone().transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:28992"));


//    map4.addLayer(wms);
    map4.addLayers([wms, wet]);
    map4.addControl(new OpenLayers.Control.LayerSwitcher());
    map4.setCenter(transformed, 8);
//    map4.zoomToMaxExtent();


    //CHARTS
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'spline',
            marginRight: 10,
            events: {
                load: function() {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function() {
                        var x = (new Date()).getTime(), // current time
                            y = Math.random();
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            }
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Random data',
            data: (function() {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: Math.random()
                    });
                }
                return data;
            })()
        }]
    });

});
