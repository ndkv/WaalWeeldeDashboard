define(["lib/OpenLayers-2.12/OpenLayers"], {ContainerWaalWeelde : function () {
    this.widget_id = 0;

    this.mapContainer = function (layer_title, t, left, legend) {
        var map_id = this.widget_id++;
        var t = t;
        var left = left;
        var layer_title = layer_title;
        console.log(this.widget_id);

        //construct widget window
        //TODO: put in a separate function
        var map_container = $('<div id="draggable'+map_id+'"class="container ui-widget-content ">').appendTo("#tabs-2");
        map_container.css("top", t+"px");
        map_container.css("left", left+"px");
        map_container.css("zIndex", 3000);
        
        map_container.append('<p class="ui-widget-header">'+layer_title+' </p>');
        var map_toolbar = $('<div id="map_toolbar"></div>').appendTo(map_container);
        
        if (legend) {
            map_toolbar.append('<input type="checkbox" id="legend_button' + map_id + '" /><label for="legend_button' + map_id + '">Legenda</label>');
        };

        map_toolbar.append('<input type="checkbox" id="lock'+ map_id +'" /><label for="lock'+ map_id + '">Op slot</label>');
        map_toolbar.append('<div class="close-button"  id="close'+map_id+'">Sluit</div>')
        var content = $('<div class="content"></div>').appendTo(map_container);
        //TODO ------ to here
    
        var legend_pane = $('<div class="legend" id="legend'+map_id+'"></div>').appendTo(content);
        var map_pane = $('<div id="map'+map_id+'" class="map"></div></div>').appendTo(content);

        //map toolbar buttons
        $("#close"+map_id).button().click(function(event) {
            $(this).parent().parent().remove();
        });

        //legend

        return [map_id, map_container];

    }

    this.widgetContainer = function () {
        var id = this.widget_id++;
        var t = 240;
        var left = 240;
        var layer_title = "";
        console.log(this.widget_id);

        var container = $('<div id="draggable'+id+'"class="widget ui-widget-content ">').appendTo("#tabs-2");
        container.draggable({stack:".ui-widget-content"});
        container.css("top", t+"px");
        container.css("left", left+"px");
//        container.css("height", "290px");
        container.css("zIndex", 5000);

        var toolbar = $('<div id="map_toolbar"></div>').appendTo(container);
        toolbar.append('<div class="close-button"  id="close'+id+'">Close</div>')
        var chart = $('<div id="chart'+id+'"></div>').appendTo(container);
        chart.css('height', '260px');

        $("#close"+id).button().click(function(event) {
            $(this).parent().parent().remove();
        });

        return chart;
    }


    this.logContainer= function () {
        var id = this.widget_id++;
        var t = $('window').height() - 160;
        console.log(t);
        var left = 240;
        var layer_title = "";

        var container = $('<div id="draggable'+id+'"class="logger ui-widget-content ">').appendTo("#tabs-2");
        container.draggable({stack:".ui-widget-content"});
        container.css("top", t+"px");
        container.css("left", left+"px");
        container.css("height", "290px");
        var toolbar = $('<div id="map_toolbar"></div>').appendTo(container);
        toolbar.append('<div class="close-button"  id="close'+id+'">Close</div>')
        var table = $('<div id="logger'+id+'" class="logger" ></div>').appendTo(container);
        table.css('height', '260px');

        $("#close"+id).button().click(function(event) {
            $(this).parent().parent().remove();
        });

        return table;

    }
    
    this.logContainer2 = function () {
        var id = this.widget_id++;
        //var t = 240;
        var t = $(window).height() - 220;
        var layer_title = "";

        var container = $('<div id="draggable'+id+'"class="logger-container">').appendTo("body");
//        container.draggable({stack:".ui-widget-content"});
        container.css("top", t+"px");
//        container.css("left", left+"px");
        container.width($('#tabs-2').width());
        var toolbar = $('<div id="map_toolbar"></div>').appendTo(container);
        toolbar.append('<div class="close-button"  id="close'+id+'">Close</div>')
        var table = $('<div id="logger'+id+'" class="logger" ></div>').appendTo(container);

        $("#close"+id).button().click(function(event) {
            $(this).parent().parent().remove();
        });

        return table;

    }
}
})
