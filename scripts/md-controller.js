define(["lib/jquery.jqGrid.min", "lib/grid.locale-nl" ], function ( _,_) {
	displayThumb = true;

	return function () {
		//"use strict";

		this.initialized = false;
			
		this.cswserver = "http://waalweelde.geocat.net/geonetwork/srv/dut/";	

		this.initialize = function (){
		
			if (!this.initialized) {
			
				$("#mdSuggest").autocomplete({  
				//define callback to format results  
				source: function(request, response){  
								$.ajax({
									url: proxyurl+"http://waalweelde.geocat.net/geonetwork/srv/dut/main.search.suggest?field=any%26q="+request.term,
									dataType: "json",
									success: function(data) {
										//map the data into a response that will be understood by the autocomplete widget
										response($.map(data[1], function(item) {
return {label: item,value: item}
}));

}});
						},
						//start looking at 3 characters because mysql's limit is 4
						minLength: 3,
						//when you have selected something
						select: function(event, ui) {
							this.close
						},
						open: function() {
							$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
						},
						close: function() {
							$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
						}
				});
				
				this.initialized = true;
}
};	

function splitLink(linkNode){
var data=linkNode.split("|");
var result={}
try{
var wmsString = data[3];
if (wmsString=="OGC:WMS"){
result.isWMS= true;
}
else{
result.isWMS = false;
}
}
catch(err){
result.isWMS=false;
}
try{
result.url= data[2];
}
catch(err){
result.title="";
}
try{
result.layerTitle=data[0];
}
catch(err){
result.layerTitle="";
}
try{
result.layerName=data[1];
}
catch(err){
result.layerName="";
}
return result;
}

function createRow(metaJson){
var thumbnailHTML="<td style='width:50px;'>"+"<div><img src='"+metaJson.image+"' width='50px'/></div></td>"

var row = "<tr valign='top'>"
if (displayThumb){
row+=thumbnailHTML
}
row+="<td width='80%'><b>"+metaJson.title+"</b><br/><div id='abstract' title='"+metaJson.abstract+"'>"+metaJson.abstract.substring(0,270);

if (metaJson.abstract.length>270){
row+="<b>...</b>"
}
row+="</div></td>"+'<td><button type="button" style="float:right;"   onclick="javascript:void(map_control.addMapFromWMS('+"'"+escape(metaJson.url)+"'"+','+"'"+metaJson.layerName+"'"+','+"'"+metaJson.layerTitle+"'"+'));">+Kaart</button></td>'+"</tr>"

return row;
}

function ValidUrl(str) {
  if(str.indexOf("http://")==0) {
    return true;
  } else {
    return false;
  }
}



function processdata( data ) {
result="<table>"
$(data).find("response").each(function(){
//For each record
$(this).find("metadata").each(function(){
// Check if link is defined
if ($(this).find("link").text()){
var linkJson = splitLink($(this).find("link").first().text());
//Check if record has WMS url and layername defined >if so: create entry in table
if (linkJson.isWMS && linkJson.layerName!=""){
linkJson.title=$(this).find("title").text();
linkJson.abstract=$(this).find("abstract").text();
if (displayThumb){
try{
console.log($(this).find("image").text().split("|"));
linkJson.image=$(this).find("image").first().text().split("|")[1];
if (linkJson.image=='' || !linkJson.image || !ValidUrl(linkJson.image)){
linkJson.image="./media/default_thumbnail.png"
}
}
catch(err){
linkJson.image="./media/default_thumbnail.png"
}
}
result+=createRow(linkJson);
}
}})
})
result+="</table>"
return result;
}






		


this.query = function(val){	
		this.ajaxRequest($.proxy(function(output){

			var outputProcessed = processdata(output);
			this.drawResults(outputProcessed);
}, this), val);
};
	
this.drawResults=function(data){
		//let container create a result panel
		var renderTo = widget_controller.resultsContainer().attr('id');
		$("#"+renderTo).append(data);
};



this.ajaxRequest= function(handleData, val){
	$.ajax({type:"GET", url:proxyurl+'http://test.ngr.nationaalgeoregister.nl/geonetwork/srv/dut/q?fast=index%26from=1%26to=100%26any_OR_geokeyword_OR_title_OR_keyword='+val+"*&dynamic=true", datatype:"xml", success: function(data){handleData(data);}
});
};



};

})



/*		$('#'+renderTo)..jqGrid({
			url:proxyurl+'http://waalweelde.geocat.net/geonetwork/srv/dut/q?fast=index%26from=1%26to=50%26any='+val,
			datatype: "xml",
			colNames:['id','titel','organisatie','samenvatting'],
			colModel:[
				//set the uuid field as link, better to use the link field here probably
				{name:'uuid',index:'uuid', width:80,  xmlmap:"uuid", formatter:'showlink', formatoptions:{baseLinkUrl:"javascript:void(map_control.addMapFromWMS()); //"}, sortable:false},
				{name:'title',index:'title', width:120,  xmlmap:"title",sortable:false},
				{name:'name',index:'name', width:150,xmlmap:"responsibleParty",sortable:false},
				{name:'abstract',index:'abstract', width:250,  xmlmap:"abstract",sortable:false}
				//hier wil je waarschijnlijk ook de datum en de geobbox zien
				//eventueel een link om het volledige record te zien
				//een thumbnail? (veld heet 'image')
			],
			rowNum:10,
			autowidth: true,
			rowList:[10,20,30],
			height:'420px',
			width:'600px',
			//pager: jQuery('#pager1'),
			//sortname: 'title',
			xmlReader: {
					root : "response",
					row: "metadata",
					repeatitems: false,
					id: "uuid"
			},
			viewrecords: true,
			sortorder: "desc",
			caption:"Zoek resultaten"
		})
               
		
		}
		 
	}

})*/
