var ContainerWaalWeelde = function () {
    this.widget_id = 0;


    this.mapContainer = function (layer_title, t, left) {
        var map_id = this.widget_id++;
        var t = t;
        var left = left;
        var layer_title = layer_title;

        //construct widget window
        //TODO: put in a separate function
        var map_container = $('<div id="draggable'+map_id+'"class="container ui-widget-content ">').appendTo("#tabs-2");
        map_container.css("top", t+"px");
        map_container.css("left", left+"px");
        
        map_container.append('<p class="ui-widget-header">'+layer_title+' </p>');
        var map_toolbar = $('<div id="map_toolbar"></div>').appendTo(map_container);
        map_toolbar.append('<input type="checkbox" id="legend_button' + map_id + '" /><label for="legend_button' + map_id + '">Legenda</label>');
        map_toolbar.append('<input type="checkbox" id="lock'+ map_id +'" /><label for="lock'+ map_id + '">Lock</label>');
        map_toolbar.append('<div class="close-button"  id="close'+map_id+'">Close</div>')
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
        this.widget_id++;
        var id = this.widget_id;
        var t = 240;
        var left = 240;
        var layer_title = "";

        var container = $('<div id="draggable'+id+'"class="container ui-widget-content ">').appendTo("#tabs-2");
        container.draggable({stack:".ui-widget-content"});
        container.css("top", t+"px");
        container.css("left", left+"px");
        container.css("width", "600px");
        container.css("height", "290px");
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
        var t = 240;
        var left = 240;
        var layer_title = "";

        var container = $('<div id="draggable'+id+'"class="container ui-widget-content ">').appendTo("#tabs-2");
        container.draggable({stack:".ui-widget-content"});
        container.css("top", t+"px");
        container.css("left", left+"px");
        container.css("width", "600px");
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
        var t = 240;
        var left = 240;
        var layer_title = "";

        var container = $('<div id="draggable'+id+'"class="ui-widget-content ">').appendTo("body");
//        container.draggable({stack:".ui-widget-content"});
//        container.css("top", t+"px");
//        container.css("left", left+"px");
        container.width($('#tabs-2').width());
        container.css("height", "200px");
        var toolbar = $('<div id="map_toolbar"></div>').appendTo(container);
        toolbar.append('<div class="close-button"  id="close'+id+'">Close</div>')
        var table = $('<div id="logger'+id+'" class="logger" ></div>').appendTo(container);
        table.css('height', '160px');

        $("#close"+id).button().click(function(event) {
            $(this).parent().parent().remove();
        });

        return table;

    }
};
