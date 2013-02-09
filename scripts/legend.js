define(function () { 
    return function(layer_name, style, map_id, map, wms_url) {
        var proxy = 'http://waalweelde.ndkv.nl/proxy.cgi?url='
//        var proxy = "http://localhost:8000/__ajaxproxy/"
        var url = proxy + wms_url + 'request=getCapabilities';
        var parseXML = function() {
            return function(xml, testStatus) {
                var legend_url = $("Name:contains('"+style+"')", xml).filter(function(index) {return $(this).text() === style}).siblings("LegendURL").children("OnlineResource").get(0).attributes[2].nodeValue;
               
                var img = new Image();
                img.src = legend_url
                img.onload = function() {
                    console.log($('#map'+map_id).width());
                    $("#map"+map_id).width($('#map'+map_id).width() - this.width);
                    $(img).appendTo($('#legend'+map_id));
                    map.updateSize();

                }
                

                //
                //var current_width = $('#map'+map_id).css('width');
            };
        };
    
        $.get(url, parseXML());
    };
});

