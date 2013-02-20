define(["lib/jquery.jqGrid.min", "lib/grid.locale-nl" ], function ( _,_) {

	return function () {
		"use strict";

		this.initialized = false;
			
		this.cswserver = "http://waalweelde.geocat.net/geonetwork/srv/dut/";	

		this.initialize = function (){
		
			if (!this.initialized) {
			
				$("#mdSuggest").autocomplete({  
				//define callback to format results  
				source: function(request, response){  
								$.ajax({
									url: "proxy.php?url=http://waalweelde.geocat.net/geonetwork/srv/dut/main.search.suggest?field=any%26q="+request.term,
									dataType: "json",
									success: function(data) {
										//map the data into a response that will be understood by the autocomplete widget
										response($.map(data[1], function(item) {
											return {
												label: item,
												value: item
											}
										}));
									}
								});
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
		}		
		
		this.query = function(val){
		//let container create a result panel
		var renderTo = widget_controller.resultsContainer().attr('id');

		$('#'+renderTo).jqGrid({
			url:'proxy.php?url=http://waalweelde.geocat.net/geonetwork/srv/dut/q?fast=index%26from=1%26to=50%26any='+val,
			datatype: "xml",
			colNames:['id','titel','organisatie','samenvatting'],
			colModel:[
				//set the uuid field as link, better to use the link field here probably
				{name:'uuid',index:'uuid', width:80,  xmlmap:"uuid", formatter:'showlink', formatoptions:{baseLinkUrl:"javascript:void(console.log('", addParam: "'))"},sortable:false},
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

})
