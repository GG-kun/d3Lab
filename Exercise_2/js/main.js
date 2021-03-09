/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
.attr("width", 400)
.attr("height", 400);

var data = [25, 20, 15, 10, 5];

var rectangles = svg.selectAll("rect")
.data(data);

rectangles.enter()
.append("rect")
.attr("x", (d, i) => { 
    var count = data.length;
    var svgHeight = svg.attr("height");

    return i*(svgHeight / count);
 })
.attr("y", (d) => { 
    var svgHeight = svg.attr("height");
    return svgHeight-d; 
})
.attr("width", 40)
.attr("height", (height) => { return height; } )
.attr("fill", "blue");
