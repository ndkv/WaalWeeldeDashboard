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
   
    this.draw = function () {
        //calling GLOBAL widet_controller defined in main.js 
        var renderTo = widget_controller.widgetContainer().attr('id');
        var data_source = this.determineDataSource();
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
