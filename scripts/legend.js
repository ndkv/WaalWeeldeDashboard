define([],function () { 
    return function(layer_name,style, map_id, map, wms_url) {



                //var legend_url = $("Name:contains('"+style+"')", xml).filter(function(index) {return $(this).text() === style}).siblings("LegendURL").children("OnlineResource").get(0).attributes[2].nodeValue;	
                var img = new Image();
		if (wms_url.charAt(wms_url.length-1)=="?"){
			wms_url=wms_url.slice(0,wms_url.length-1);			
		}
                var url = wms_url+"?request=getLegendGraphic&service=WMS"+"&layer="+layer_name+"&format=image/png"
		if (style!=""){
		url+="&style="+style		
		}		
		img.src=url
                img.onload = function() {
                    console.log($('#map'+map_id).width());
                    $("#map"+map_id).width($('#map'+map_id).width() - this.width);
                    $(img).appendTo($('#legend'+map_id));
                    map.updateSize();
                }
                

                //
                //var current_width = $('#map'+map_id).css('width');


    
        
    };
});




