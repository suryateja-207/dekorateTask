'use strict';

// Declare app level module which depends on views, and components
angular.module("dekorateApp", []).controller("expensesController",function($scope) {
  $scope.expensesTable = [
    { 'name':'Food',
      'type': 'cash',
      'price': '5000',
      'date' : '15/01/2016', 'color':'red'},
    { 'name':'Laptop Repair',
      'type': 'credit',
      'price': '10000',
      'date' : '16/01/2016',
    'color':'green'},
  ];
    // $scope.expensesTable = [];
    $scope.addRow = function(){
        if ($scope.name !== null && $scope.type !== null && $scope.price !==null && $scope.date !== null) {
            $scope.expensesTable.push({
                'name': $scope.name,
                'type': $scope.type,
                'price': $scope.price,
                'date': $scope.date
            });
        }
        console.log($scope.expensesTable);
    };
    $scope.removeRow = function(index){
        $scope.expensesTable.splice( index, 1 );
    };
    var width = 550;          //width
    var height = 350;        //height
    var radius = 300/ 2;
    var data = $scope.expensesTable;//radius of the pie-chart//builtin range of colors
    var color = d3.scale.category20b();

    var svg = d3.select('#pie_chart')        //create the SVG element inside the <body>
        .append('svg')
        .attr('width', width) //set the width and height of our visualization
        .attr('height', height) // attributes of the <svg> tag
        .append('g')              //create a group to hold our pie chart
        .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');//move the center of the pie chart from 0, 0 to specified value
    var total=0;
        for(var a=0;a<data.length;a++){
            total=total+parseInt(data[a].price); // simple logic to calculate total of data count value
            console.log(total);
        }
        var pie_data=[];
        for( var a=0;a<data.length;a++){ // simple logic to calculate percentage data for the pie
            pie_data[a]=(data[a].price/total)*100;
            console.log(pie_data[a]);
        }

        var arc = d3.svg.arc().outerRadius(radius);
// creating arc element.
        var pie = d3.layout.pie()
            .value(function(d,i) { return pie_data[i]; })
            .sort(null);
//Given a list of values, it will create an arc data for us
//we must explicitly specify it to access the value of each element in our data array
        var path = svg.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                console.log(color(i));
                //return data[i].color;
                return color(i);
            });
//set the color for each slice to be chosen, from the color defined in sample_data.json
//this creates the actual SVG path using the associated data (pie) with the arc drawing function
});
