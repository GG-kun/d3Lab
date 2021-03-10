/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
.attr("width", 500)
.attr("height", 500);

d3.json("data/buildings.json").then((data)=> {    
    console.log(data);

    var buildingsName = data.map((d)=>{
        return d.name;
    });
    var x = d3.scaleBand()
	.domain(buildingsName)
	.range([0,svg.attr("width")])
	.paddingInner(0.3)
	.paddingOuter(0.3);

    var buildingsHeight = data.map((d)=>{
		return +d.height;
	});
    var maxBuildingHeight = d3.max(data, (d) =>{
        return d.height;
    });
    var y = d3.scaleLinear()
	.domain([0,maxBuildingHeight])
	.range([0,svg.attr("height")]);

    var colors = d3.scaleOrdinal()
    .domain(buildingsName)
    .range(d3.schemeSet3)

    var rectangles = svg.selectAll("rect")
    .data(data);

    rectangles.enter()
    .append("rect")
    .attr("x", (d) => { 
        return x(d.name); 
    })
    .attr("y", (d) => { 
        var svgHeight = svg.attr("height");
        return svgHeight-y(d.height); 
    } )
    .attr("width", x.bandwidth())
    .attr("height", (d) => { 
        return y(d.height); 
    })
    .attr("fill", (d) => { 
        return colors(d.name); 
    });
}).catch((error) => {
    console.log(error);
});
