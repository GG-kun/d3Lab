/*
*    main.js
*/

var margin = {
    left:100,
    right: 10,
    top: 10,
    bottom: 100,
};

var width = 600;
var height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("data/buildings.json").then((data)=> {    
    console.log(data);

    var buildingsName = data.map((d)=>{
        return d.name;
    });
    var x = d3.scaleBand()
	.domain(buildingsName)
	.range([0,width])
	.paddingInner(0.3)
	.paddingOuter(0.3);

    var maxBuildingHeight = d3.max(data, (d) =>{
        return d.height;
    });
    var y = d3.scaleLinear()
	.domain([0,maxBuildingHeight])
	.range([height-margin.bottom,0]);

    var colors = d3.scaleOrdinal()
    .domain(buildingsName)
    .range(d3.schemeSet3)

    var rectangles = g.selectAll("rect")
    .data(data);

    var fixedHeight = height-margin.bottom;

    var bottomAxis = d3.axisBottom(x);
    g.append("g")    
        .attr("class", "bottom axis")    
        .attr("transform", "translate(0, " + fixedHeight + ")")    
        .call(bottomAxis)        
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");
    // X Label
    g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width/2)
    .attr("y", height+40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .style("fill","black")
    .text("The word's tallest buildings");

    var leftAxis = d3.axisLeft(y).ticks(5)
    .tickFormat((d) => { return d + "m"; });
    g.append("g")
        .attr("class", "left axis")
        .call(leftAxis);
    // Y Label
    g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height/2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .style("fill","black")
    .text("Height (m)")
	.attr("transform", "rotate(-90)");

    rectangles.enter()
    .append("rect")
    .attr("x", (d) => { 
        return x(d.name); 
    })
    .attr("y", (d) => { 
        return y(d.height); 
    } )
    .attr("width", x.bandwidth())
    .attr("height", (d) => { 
        return fixedHeight-y(d.height); 
    })
    .attr("fill", (d) => { 
        return colors(d.name); 
    });
}).catch((error) => {
    console.log(error);
});
