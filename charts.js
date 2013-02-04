var PieChart = function(data_source) {
    //TODO: make stand alone data source
    this.data_source = data_source;

    //0 ==> 2005
    this.data_sources = [
        [['Akker in oever', 17756],
        ['Bebouwde oeverwal of uiterwaard', 20053],
        ['Bebouwde uiterwaard', 25739],
        ['Dynamisch zoet tot zwak brak ondiep water', 123568],
        ['Matig diep', 833025],
        ['Matig diep zomerbed', 90173],
        ['Matig tot sterk dynamisch hard substraat onder invloed van zoet of brak wat', 17846],
        ['Moerasruigte', 166486],
        ['Moerassig overstromingsgrasland', 17165],
        ['Moerassig overstromingsgrasland/produktiegrasland', 102032],
        ['Natuurlijk uiterwaardbos', 183239],
        ['Natuurlijk uiterwaardgrasland', 66209],
        ['Oeverwal of uiterwaard grasland (natuurlijk of productie)', 26464],
        ['Oeverwal of uiterwaard natuurlijk bos', 5635],
        ['Oeverwal of uiterwaard natuurlijk grasland', 14323],
        ['Oeverwal of uiterwaard productiegrasland', 58056],
        ['Oeverwal of uiterwaard ruigte', 13639],
        ['Oeverwal of uiterwaard struweel', 3225],
        ['Onbegroeide oeverwal', 4488],
        ['Ondiep', 52746],
        ['Ondiep zomerbed', 9398],
        ['Overstromingsvrij bebouwd', 453759],
        ['Overstromingsvrij grasland (natuurlijk of productie)', 294784],
        ['Overstromingsvrij natuurlijk bos', 304046],
        ['Overstromingsvrij natuurlijk grasland', 39165],
        ['Overstromingsvrij productiebos', 42258],
        ['Overstromingsvrij productiegrasland', 1156013],
        ['Overstromingsvrij struweel', 181353],
        ['Overstromingsvrij tijdelijk kaal', 124014],
        ['Overstromingsvrije akker', 852545],
        ['Overstromingsvrije ruigte', 180706],
        ['Productiebos in oever', 64039],
        ['Productiegrasland', 47251],
        ['Soortenarm helofytenmoeras/soortenrijk riet met moerasplanten', 35941],
        ['Tijdelijk kaal', 6598],
        ['Uiterwaard riet', 10465],
        ['Uiterwaard tijdelijk kaal', 19394],
        ['Uiterwaardakker', 305204],
        ['Uiterwaardgrasland (natuurlijk of productie)', 267703],
        ['Uiterwaardproductiebos', 98687],
        ['Uiterwaardproductiegrasland', 702362],
        ['Uiterwaardruigte', 186814],
        ['Uiterwaardstruweel', 105786],
        ['Zachthout struweel of pionier zachthoutooibos', 119225],
        ['Zachthoutooibos', 324897],
        ['Zeer diep', 2306614],
        ['Zoete zandplaten', 74432]],
        [],
        []
    ];
		
    this.determineDataSource = function() {
        var data_source = null;
        switch (this.data_source) {
            case 'area_2005':
                data_source = this.data_sources[0];
            break;
        }

        return data_source;
    };
   
    this.draw = function () {
        //calling GLOBAL widet_controller defined in main.js 
        var renderTo = widget_controller.widgetContainer().attr('id');
        console.log(renderTo);
        var data_source = this.determineDataSource();
        Highcharts.setOptions({
            global: {
                thousandsSep: ""
            }
        });
        this.chart = new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: true
            },
            title: {
                text: 'Ecotopen oppervlakte 2005'
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
