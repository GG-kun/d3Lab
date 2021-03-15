/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
.attr("width", 750)
.attr("height", 1000);

d3.json("data/buildings.json").then((data)=> {
    var buildingsHeight = [];

    console.log(data);
    data.forEach((d)=>{
		buildingsHeight.push(+d.height);
	});

    var rectangles = svg.selectAll("rect")
    .data(buildingsHeight);

    rectangles.enter()
    .append("rect")
    .attr("x", (d, i) => { 
        var count = buildingsHeight.length;
        var svgWidth = svg.attr("width");
    
        return i*(svgWidth / count);
     })
    .attr("y", (d) => { 
        var svgHeight = svg.attr("height");
        return svgHeight-d; 
    })
    .attr("width", 40)
    .attr("height", (height) => { return height; } )
    .attr("fill", "gray");
}).catch((error) => {
    console.log(error);
});
