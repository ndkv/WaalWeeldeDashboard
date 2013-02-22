define(["lib/jquery", "lib/jquery-ui-1.10.0/js/jquery-ui-1.10.0.custom.min", "lib/OpenLayers-2.12/OpenLayers", "map-controller", "container", "md-controller"], function(_, _, _, MapControl, ContainerWaalWeelde, MdControl) {
    
    return { initialize: function () {
        $("#tabs").tabs({activate: function(event, ui) {
			map_control.initialize();
			md_control.initialize();
		}});
        widget_controller = new ContainerWaalWeelde.ContainerWaalWeelde ();

	proxyurl='http://localhost/cgi-bin/proxy.cgi?url=';
            
        var map_control = new MapControl();
		var md_control = new MdControl();
		
		$("#mdQuery").click(function(event) {
            md_control.query($("#mdSuggest").val());
        })
        
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
