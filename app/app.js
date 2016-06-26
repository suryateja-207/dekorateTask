'use strict';

// Declare app level module which depends on views, and components
angular.module("dekorateApp", ['nvd3','ngMaterial']).controller("expensesController",function($scope) {
    $scope.expensesTable = [
        { 'name':'Rent',
            'type': 'cash',
            'price': '500',
            'date' : '2016-04-11'
        },
        { 'name':'Insurance',
            'type': 'credit',
            'price': '100',
            'date' : '2016-04-11'
        },
        { 'name':'Automobile',
            'type': 'credit',
            'price': '100',
            'date' : '2016-04-11'
            },
        { 'name':'utilities',
            'type': 'cash',
            'price': '100',
            'date' : '2016-03-11'
        },
        { 'name':'Insurance',
            'type': 'credit',
            'price': '100',
            'date' : '2016-01-11'
        }
    ];

    $scope.addRow = function(){
        if ($scope.name != null && $scope.type != null && $scope.price != null && $scope.date != null) {
            $scope.expensesTable.push({
                'name': $scope.name,
                'type': $scope.type,
                'price': $scope.price,
                'date': $scope.date
            });
            var form = document.getElementsByName('expense-form')[0];
            form.reset();  // Reset
        }
        $scope.expensesTable.sort(custom_sort);
        barChartDataGenerator();
        pieChartDataGenerator();
    };
    $scope.removeRow = function(index){
        $scope.expensesTable.splice( index, 1 );
    };
    $scope.pieChartOptions = {
        "chart": {
            "type": "pieChart",
            "height": 500,
            "showLabels": true,
            "duration": 500,
            x: function(d){return d.name;},
            y: function(d){return d.amount;},
            "labelThreshold": 0.01,
            "labelSunbeamLayout": true,
            "legend": {
                "margin": {
                    "top": 5,
                    "right": 35,
                    "bottom": 5,
                    "left": 0
                }
            },
            labelType:'percent',
            valueFormat:function (d) {
                return d3.format(',.5f')(d);
            }
        },
        title:{
            enable:true,
            text:'Expense Summary'
        }
    };

    $scope.barChartOptions = {
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
            grouped :true,
            xAxis: {
                axisLabel: 'Month-Year',
                showMaxMin: false,
                tickFormat: function(d){
                    return $scope.dateData[d].key;
                }
            },
            yAxis: {
                axisLabel: 'Price',
                axisLabelDistance: -20,
                tickFormat: function(d){
                    return d3.format(',.1f')(d);
                }
            }
        },
        title:{
            enable:true,
            text:'Expenses by Month'
        }
    };
    function custom_sort(a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    function pieChartDataGenrator()
    {
        var categoryData =d3.nest()
            .key(function (d) {
                return d.name;
            }).entries($scope.expensesTable);
        $scope.cummulativeCategoryData  = [];
        for(var i = 0;i < categoryData.length; i++)
        {
            var amount = 0;
            for(var j = 0 ;j < categoryData[i].values.length;j++)
            {
                amount += parseInt(categoryData[i].values[j].price);
            }
            var element = {};
            element.name = categoryData[i].key;
            element.amount = amount;
            $scope.cummulativeCategoryData.push(element);
        }
    };
    function generateData() {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var nest = d3.nest()
            .key(function (d) {
                return months[(new Date(d.date)).getUTCMonth()] + '-' + new Date(d.date).getUTCFullYear();
            }).entries($scope.expensesTable);
        return nest;
    };
    var barChartDataGenerator = function () {
        $scope.dateData = generateData();
        $scope.typeDate = d3.nest()
            .key(function (d) {
                return d.type;
            })
            .entries($scope.expensesTable);
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
        var k = 0;
        var type = ['cash','credit'];
        $scope.barData = d3.range(2).map(function () {
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
    };
    function stream_index(d, i) {

        return {x: i, y: d.price};
    }
    $scope.expensesTable.sort(custom_sort);
    pieChartDataGenrator();
    barChartDataGenerator();
});

