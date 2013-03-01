define(["lib/highcharts"], function () { 
    return function(data_source) {
    //TODO: make stand alone data source
    this.data_source = data_source;

    //0 ==> 1997
    this.data_sources = [[
        ['Akker', 813768],
        ['Bebouwd/verhard', 466461],
        ['Griend', 2853],
        ['Kale oeverwal', 50651],
        ['Kale plaat', 34007],
        ['Natuurlijk bos', 469230],
        ['Natuurlijk grasland', 533651],
        ['Ondiep water', 83796],
        ['Productiebos', 174078],
        ['Productiegrasland', 4785225],
        ['REST', 188594],
        ['Riet en overige helofyten', 47646],
        ['Rivierbegeleidend water', 3158007],
        ['Ruigte', 707099],
        ['Struweel', 402186]
        //['Zomerbed', 47819781]
    ],
    [
        ['Akker', 1175506],
        ['Bebouwd/verhard', 517399],
        ['Kale oeverwal', 4488],
        ['Kale plaat', 74432],
        ['Natuurlijk bos', 817818],
        ['Natuurlijk grasland', 136865],
        ['Ondiep water', 123568],
        ['Productie/natuurlijk grasland', 690985],
        ['Productiebos', 204986],
        ['Productiegrasland', 1963684],
        ['REST', 150007],
        ['Riet en overige helofyten', 46406],
        ['Rivierbegeleidend water', 3192387],
        ['Ruigte', 547646],
        ['Struweel', 409591],
        //['Zomerbed', 99571]
    ],
    [
        ['Akker', 1322749],
        ['Bebouwd/verhard', 546627],
        ['Natuurlijk bos', 905527],
        ['Natuurlijk grasland', 162999],
        ['Onbegroeid (antropogeen)', 168228],
        ['Onbegroeid (natuurlijk)', 35437],
        ['Ondiep water', 142330],
        ['Productie/natuurlijk grasland', 1033289],
        ['Productiebos', 137228],
        ['Productiegrasland', 1945427],
        ['Riet en overige helofyten', 19461],
        ['Rivierbegeleidend water', 3207761],
        ['Ruigte', 303459],
        ['Struweel', 309259],
        ['Vegetatie met lage bedekking (5-25%)', 44513],
        //['Zomerbed', 71003781]
    ]	
];


processdata = function (data){
	var categories= new Array();
	var values= new Array();
	var valuesPredict = new Array();
	for (var i=data.H10.length-1;i>data.H10.length-722;i=i-1){
		categories.unshift ( data.H10[i].datumdag+" - "+data.H10[i].datumtijd);
		values.unshift (parseFloat(data.H10[i].waarde));
		valuesPredict.unshift(null);
		}
	for (var i=0;i<data.H10V.length;i++){
		valuesPredict.push(parseFloat(data.H10V[i].waarde));
}
	var dayMonth = data.H10[(data.H10.length-1)].datumdag;
	dayMonth=dayMonth.split('/');
	var yearDate = new Date();
	var hourMinutes = data.H10[data.H10.length-1].datumtijd
	hourMinutes = hourMinutes.split(':');
	

	var day = parseInt(dayMonth[0]);
	var month = parseInt(dayMonth[1])-1;
	var year = yearDate.getFullYear();
	var hour = parseInt(hourMinutes[0]);
	var minutes = parseInt(hourMinutes[1]);

	
	var date = new Date (year,month,day,hour,minutes);
	date.setDate(date.getDate()-4)
	return {date: date, values:values, valuesPredict:valuesPredict};
};





// Method called in map-controller to draw chart 
this.draw = function(){
	if (this.data_source!='water_level'){
		var data = this.determineDataSource();
		this.drawpiechart(data);	
		}
	else{
	// $.proxy passes scope of the function 
	this.createLineChart($.proxy(function(output){
		var outputProcessed = processdata(output);
		this.drawLineChart(outputProcessed);	
},this));
	}
};	


this.determineDataSource = function() {
	var data_source = null;
        switch (this.data_source) {
                   case 'area_1997':
                data_source = this.data_sources[0];
            break;
                       case 'area_2005':
                data_source = this.data_sources[1];
            break;
            case 'area_2008':
                data_source = this.data_sources[2];
            break;
	    }
        return data_source;
};
    
// AJAX call to collect waterlevel data from RWS, with callback function
this.createLineChart=function(handleData){
	$.ajax({type:"GET", url:proxyurl+"http://www.rijkswaterstaat.nl/apps/geoservices/rwsnl/awd.php?mode=data%26loc=PANN%26net=LMW%26projecttype=waterstanden%26category=3",dataType:'json', success: function(data){handleData(data);}
});
};

// function to draw the linechart
this.drawLineChart=function (data) {
	//calling GLOBAL widet_controller defined in main.js 
	var renderTo = widget_controller.widgetContainer().attr('id');
	this.chart = new Highcharts.Chart({
	"chart": {
                renderTo: renderTo,
		zoomType: 'x',
		spacingRight : 20

	},
	"colors":[
	'#4572A7', 
	'#C9C9C9', 
	'#89A54E', 
	'#80699B', 
	'#3D96AE', 
	'#DB843D', 
	'#92A8CD', 
	'#A47D7C', 
	'#B5CA92'
],
	"title": {
                text: 'Waterstand t.o.v. NAP (in cm) Pannerdense Kop',
                x: -20 //center},
	    },
            "subtitle": {
                text: 'Klik en sleep om in te zoomen',
                x: -20
            },
	"xAxis": { type: 'datetime', maxZoom : 36000*6, title :{text:null}},
	 "yAxis": {
                title: {
                    text: 'cm NAP'
                },
                showFirstLabel: false
            },
	"tooltip": {
                shared: true
                }
            ,
	"legend": {
                enabled: false
            },
	'plotOptions': {
                area: {  
                    lineWidth: 2,
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true,
                                radius: 5
                            }
                        }
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

	"series": [{
		type: 'area',
		name: 'Waterstand',
		pointInterval: 600*1000,
                pointStart: Date.UTC(data.date.getFullYear(),data.date.getMonth(),data.date.getDate(),data.date.getHours(),data.date.getMinutes()),
		data: data.values
	},{type: 'area',
		name: 'Voorspelling waterstand',
		pointInterval: 600*1000,
                pointStart: Date.UTC(data.date.getFullYear(),data.date.getMonth(),data.date.getDate(),data.date.getHours(),data.date.getMinutes()),
		data: data.valuesPredict}]

});
};
	   
    this.drawpiechart = function (data) {
        //calling GLOBAL widet_controller defined in main.js 
        var renderTo = widget_controller.widgetContainer().attr('id');
        var data_source = data
        var title = 'Vegetatiestructuur totale oppervlakte' + this.data_source.split("_")[1];       
        this.chart = new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: true
            },
            title: {
                text: title 
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b> m^2',
                valueDecimals: 0
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Oppervlakte',
                data: data_source
            }]
        });
    }
};




var BarChart = function() {
    var renderTo = widget_controller.widgetContainer();
    $('<img src="media/plot.PNG"></img>').appendTo(renderTo);
};
});

