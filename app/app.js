'use strict';

// Declare app level module which depends on views, and components
angular.module("dekorateApp", ['nvd3','ngMaterial']).controller("expensesController",function($scope) {
    $scope.expensesTable = [
        { 'name':'Food',
            'type': 'cash',
            'price': '500',
            'date' : '2016-04-11'
        },
        { 'name':'Laptop Repair',
            'type': 'credit',
            'price': '100',
            'date' : '2016-04-11'
        },
        { 'name':'Laptop Repair',
            'type': 'credit',
            'price': '100',
            'date' : '2016-04-11'
            },
        { 'name':'Laptop Repair',
            'type': 'cash',
            'price': '100',
            'date' : '2016-03-11'
        }
    ];
    console.log($scope.expensesTable);
    // $scope.expensesTable = [];
    $scope.addRow = function(){
        if ($scope.name != null && $scope.type != null && $scope.price != null && $scope.date != null) {
            $scope.expensesTable.push({
                'name': $scope.name,
                'type': $scope.type,
                'price': $scope.price,
                'date': $scope.date
            });
            var frm = document.getElementsByName('expense-form')[0];
            // Submit
            frm.reset();  // Reset
        }
        console.log($scope.expensesTable);
        $scope.expensesTable.sort(custom_sort);
        s();
    };
    $scope.removeRow = function(index){
        $scope.expensesTable.splice( index, 1 );
    };
    $scope.options = {
        "chart": {
            "type": "pieChart",
            "height": 500,
            "showLabels": true,
            "duration": 500,
            x: function(d){return d.name;},
            y: function(d){return d.price;},
            "labelThreshold": 0.01,
            "labelSunbeamLayout": true,
            "legend": {
                "margin": {
                    "top": 5,
                    "right": 35,
                    "bottom": 5,
                    "left": 0
                }
            }
        }
    };

    $scope.barOptions = {
        chart: {
            type: 'multiBarChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 45,
                left: 45
            },
            clipEdge: true,
            //staggerLabels: true,
            duration: 500,
            stacked: true,
            xAxis: {
                axisLabel: 'Month-Year',
                showMaxMin: false,
                tickFormat: function(d){
                    console.log(d, "vinodh");
                    console.log($scope.dateData[d].key,"sury");
                    return $scope.dateData[d].key;
                    //return d3.format(',f')(d);
                }
            },
            yAxis: {
                axisLabel: 'Price',
                axisLabelDistance: -20,
                tickFormat: function(d){
                    return d3.format(',.1f')(d);
                }
            }
        }
    };
    $scope.axisValue = '';
    // $scope.nest = d3.nest()
    //     .key(function (d) {
    //         return d.type;
    //     })
    //     .entries($scope.expensesTable);
    console.log($scope.nest);
    //console.log(nest.map(stream_index));
    // $scope.bardata = $scope.nest.map(stream_index).map(function(data, i) {
    //     return {
    //         key: 'Stream' + i,
    //         values: data
    //     };});
    //console.log(finalData, "finalData");
    function custom_sort(a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    $scope.expensesTable.sort(custom_sort);
    var s = function () {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        function generateData() {
            var nest = d3.nest()
                .key(function (d) {
                    return months[(new Date(d.date)).getUTCMonth()] + '-' + new Date(d.date).getUTCFullYear();
                }).entries($scope.expensesTable);
            return nest;
        };
        $scope.dateData = generateData();
        console.log($scope.dateData ,"datedata");
        $scope.typeDate = d3.nest()
            .key(function (d) {
                return d.type;
            })
            .entries($scope.expensesTable);
        console.log($scope.typeDate);
        var finalData = [];
        var element = {};
        element.key = 'cash';
        element.values = [];
        finalData.push(element);
        var element = {};
        element.key = 'credit';
        element.values = [];
        finalData.push(element);
        for(var i = 0; i < $scope.dateData.length ; i++)
        {
            var cash = 0;
            var credit = 0;
            console.log($scope.dateData[i].values.length, "rere");
            for (var j = 0; j<$scope.dateData[i].values.length;j++)
            {
                if($scope.dateData[i].values[j].type == "cash")
                {
                    cash+= parseInt($scope.dateData[i].values[j].price);
                }
                else
                {
                    credit+= parseInt($scope.dateData[i].values[j].price);
                }
            }
            var element = {};
            element.date =  $scope.dateData[i].key;
            element.price = cash;
            finalData[0].values.push(element);
            var element = {};
            element.date =  $scope.dateData[i].key;
            element.price = credit;
            finalData[1].values.push(element);
        }
        var nest = finalData;
        console.log(nest, "sdds");
        var k = 0;
        var type = ['cash','credit'];
        $scope.bardata = d3.range(2).map(function () {
            var a = nest[k];
            console.log(nest[k]);
            k++;
            return a.values.map(stream_index);
        }).map(function (data, i) {
            return {
                key: type[i],
                values: data
            };
        });
        console.log($scope.bardata);
    };
    // $scope.sdata = generateData();
    // /* Random Data Generator (took from nvd3.org) */
    // function generateData() {
    //     return stream_layers(3,50+Math.random()*50,.1).map(function(data, i) {
    //         return {
    //             key: 'Stream' + i,
    //             values: data
    //         };
    //     });
    // }
    // /* Inspired by Lee Byron's test data generator. */
    // function stream_layers(n, m, o) {
    //     if (arguments.length < 3) o = 0;
    //     function bump(a) {
    //         var x = 1 / (.1 + Math.random()),
    //             y = 2 * Math.random() - .5,
    //             z = 10 / (.1 + Math.random());
    //         for (var i = 0; i < m; i++) {
    //             var w = (i / m - y) * z;
    //             a[i] += x * Math.exp(-w * w);
    //         }
    //     }
    //     return d3.range(n).map(function() {
    //         var a = [], i;
    //         for (i = 0; i < m; i++) a[i] = o + o * Math.random();
    //         for (i = 0; i < 5; i++) bump(a);
    //         return a.map(stream_index);
    //     });
    // }
    function stream_index(d, i) {

        return {x: i, y: d.price};
    }
    s();

    //console.log($scope.sdata);
});

