/*
*    main.js
*/

var margin = {
    left:100,
    right: 10,
    top: 10,
    bottom: 100,
};

var width = 600 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;
var flag = true; 
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom);

var g = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
// X Label
g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width/2)
    .attr("y", height+40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .style("fill","black")
    .text("Month");    
// Y Label
var yLabel = g.append("text")
                .attr("class", "y axis-label")
                .attr("x", -(height/2))
                .attr("y", -60)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .style("fill","black")
                .text("Revenue (dlls.)")
                .attr("transform", "rotate(-90)");

var x = d3.scaleBand().range([0,width]).padding(0.2);
var y = d3.scaleLinear().range([height,0]);

var xAxisGroup = g.append("g")    
    .attr("class", "x axis")    
    .attr("transform", "translate(0, " + height + ")");
var yAxisGroup = g.append("g")
    .attr("class", "y axis");

var kDollsFormatter = d3.format("$.0s");

d3.json("data/revenues.json").then((data)=> {    
    data.forEach((d) => {
        d.revenue = +d.revenue;    
        d.profit= +d.profit;    
    });
    console.log(data);

    d3.interval( ( ) => {        
	    var newData = flag ? data : data.slice(1);
		update(newData);
        flag = !flag;
	}, 1000);
    update(data);
}).catch((error) => {
    console.log(error);
});

var t = d3.transition().duration(250);

function update(data) {
    var value = flag ? "revenue" : "profit";

    var rectangles = g.selectAll("rect")
        .data(data, (d) => { return d.month; });

    rectangles.exit()
        .transition(t)
            .attr("y", y(0))
            .attr("height", 0)
        .remove();

    x.domain(data.map((d)=>{
        return d.month;
    }))

    var maxRevenueHeight = d3.max(data, (d) =>{
        return d[value];
    });
    y.domain([0,maxRevenueHeight])

    var bottomAxis = d3.axisBottom(x);
    xAxisGroup.transition(t).call(bottomAxis);

    var leftAxis = d3.axisLeft(y).ticks(5)
        .tickFormat((d) => { return kDollsFormatter(d); });
    yAxisGroup.call(leftAxis);

    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label);

    rectangles.enter().append("rect")
        .attr("fill", "cyan")
        .attr("y", y(0))    
        .attr("height", 0)
        .attr("x", (d) => { 
            return x(d.month); 
        })
        .attr("width", x.bandwidth())
        .merge(rectangles)
        .transition(t)
            .attr("x", (d) => { 
                return x(d.month); 
            })
            .attr("width", x.bandwidth())
            .attr("y", (d) => { 
                return y(d[value]); 
            } )
            .attr("height", (d) => { 
                return height-y(d[value]); 
            });    
}