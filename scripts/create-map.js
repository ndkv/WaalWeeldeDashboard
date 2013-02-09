define(function () {
    return function (map_title, t, left, legend) {
        var cont = widget_controller.mapContainer(map_title, t, left, legend);
        var map_id = cont[0];
        var map_container = cont[1];

        var map = new OpenLayers.Map('map'+map_id, {
        maxResolution: 1226.5625,
        maxExtent: new OpenLayers.Bounds(10000.0, 305000.0, 280000.0, 619000.0),
        projection: new OpenLayers.Projection("EPSG:28992")
        });

        map_container.draggable({stack:".ui-widget-content", cancel:"#map"+map_id }).resizable({stop: function(){map.updateSize();}, alsoResize: "#map"+map_id});

        return [map, map_id];
    }
}
);
