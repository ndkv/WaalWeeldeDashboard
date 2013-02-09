define(["lib/jquery", "lib/jquery-ui-1.10.0/js/jquery-ui-1.10.0.custom.min", "lib/OpenLayers-2.12/OpenLayers", "map-controller", "container"], function(_, _, _, MapControl, ContainerWaalWeelde) {
    
    return { initialize: function () {
        $("#tabs").tabs({activate: function(event, ui) {map_control.initialize()}});
        widget_controller = new ContainerWaalWeelde.ContainerWaalWeelde ();
        
        OpenLayers.ProxyHost = 'http://waalweelde.ndkv.nl/proxy.cgi?url=';
        //OpenLayers.ProxyHost = 'localhost:8000/__ajaxproxy/'
        
        var map_control = new MapControl();

        $("#widget-selector").change(function(event) {
            map_control.mapComposer($(this).val());
        })

        $('#map-selector').change(function (event) {
            map_control.mapComposer($(this).val());
        });

        $('#geoplaza').change(function (event) {
            map_control.addMapExternal($(this).val(), $('option[value='+$(this).val()+']', $(this)).text());
        });
    }
    }
});
