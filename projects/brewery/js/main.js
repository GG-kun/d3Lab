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

d3.json("data/revenues.json").then((data)=> {    
    console.log(data);

    var revenueMonths = data.map((d)=>{
        return d.month;
    });
    var x = d3.scaleBand()
	.domain(revenueMonths)
	.range([0,width])
	.paddingInner(0.3)
	.paddingOuter(0.3);

    var maxBuildingHeight = d3.max(data, (d) =>{
        return d.revenue;
    });
    var y = d3.scaleLinear()
	.domain([0,maxBuildingHeight])
	.range([height,0]);

    var rectangles = g.selectAll("rect")
    .data(data);

    var bottomAxis = d3.axisBottom(x);
    g.append("g")    
        .attr("class", "bottom axis")    
        .attr("transform", "translate(0, " + height + ")")    
        .call(bottomAxis)        
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "10")
        .attr("text-anchor", "end")
    // X Label
    g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width/2)
    .attr("y", height+40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .style("fill","black")
    .text("Month");

    var kDollsFormatter = d3.format("$.0s");

    var leftAxis = d3.axisLeft(y).ticks(5)
    .tickFormat((d) => { return kDollsFormatter(d); });
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
    .text("Revenue (dlls.)")
	.attr("transform", "rotate(-90)");

    rectangles.enter()
    .append("rect")
    .attr("x", (d) => { 
        return x(d.month); 
    })
    .attr("y", (d) => { 
        return y(d.revenue); 
    } )
    .attr("width", x.bandwidth())
    .attr("height", (d) => { 
        return height-y(d.revenue); 
    })
    .attr("fill", "cyan");
}).catch((error) => {
    console.log(error);
});
