require.config({
    shim: {
        "OpenLayers": {
            "exports": "OpenLayers"
        }
    //    "highcharts": {
    //        "exports": "Highcharts"
     //   }
    }
});

require(["lib/jquery"], function() {
    require(["lib/jquery-ui-1.10.0/js/jquery-ui-1.10.0.custom.min", "app"], function(_, App) {
        $(document).ready(function() {
            App.initialize();
        });
    });
});
