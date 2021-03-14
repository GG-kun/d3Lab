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
    .text("GDP Per Capita ($)");    
// Y Label
g.append("text")
	.attr("class", "y axis-label")
	.attr("x", -(height/2))
	.attr("y", -60)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.style("fill","black")
	.text("Life Expectancy (Years)")
	.attr("transform", "rotate(-90)");
// Year Label
var yearLabel = g.append("text")
	.attr("class", "x axis-label")
	.attr("x", width-35)
	.attr("y", height)
	.attr("font-size", "35px")
	.attr("text-anchor", "middle")
	.style("fill","black");


var continents = ["europe", "asia", "americas", "africa"];

var x = d3.scaleLog().domain([142, 150000]).range([0, width]);
var y = d3.scaleLinear().domain([90, 0]).range([0,height]);
var area = d3.scaleLinear()
	.domain([2000, 1400000000])
	.range([25*Math.PI, 1500*Math.PI]);
var color = d3.scaleOrdinal()
    .domain(continents)
    .range(d3.schemePastel1);

var moneyFormatter = d3.format("$");
var bottomAxis = d3.axisBottom(x).tickValues([400, 4000, 40000])
.tickFormat((d) => { return moneyFormatter(d);});
g.append("g")    
    .attr("class", "x axis")    
    .attr("transform", "translate(0, " + height + ")")
    .call(bottomAxis);

var leftAxis = d3.axisLeft(y);
g.append("g")
    .attr("class", "y axis")
    .call(leftAxis);

// Continent Labels
var legend = g.append("g")
	.attr("transform", "translate(" + (width - 10) + "," + (height - 125) + ")");

continents.forEach((continent, i) => {
    var legendRow = legend.append("g")
        .attr("transform", "translate(0, " + (i * 20) + ")");
    legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color(continent));
    legendRow.append("text")    
        .attr("x", -10)    
        .attr("y", 10)    
        .attr("text-anchor", "end")    
        .style("text-transform", "capitalize")    
        .text(continent);    
});

d3.json("data/data.json").then(function(data){
	const formattedData = data.map((year) => {
		return year["countries"].filter((country) => {	
			var dataExists = (country.income && country.life_exp);
			return dataExists;
		}).map((country) => {	
			country.income = +country.income;	
			country.life_exp = +country.life_exp;	
			return country;	
		})	
	});

    var years = data.map((d) => {
        return d.year;
    });
    d3.interval( (miliSeconds) => {
        var index = Math.min(Math.round(miliSeconds/1000),years.length-1);
		update(formattedData[index], years[index]);
	}, 1000);
    update(formattedData[0], years[0]);
})

var t = d3.transition().duration(1000);

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function update(data, year) {
    yearLabel.text(year);

    var circles = g.selectAll("circle")
        .data(data, (d) => { return d.country; });

    circles.exit()
        .transition(t)
        .remove();

    circles.enter().append("circle")
        .attr("fill", (d) => {
            return color(d.continent);
        })
        .attr("cy", (d) => { 
            return y(d.life_exp); 
        })
        .attr("cx", (d) => { 
            return x(d.income); 
        })
        .attr("r", (d) => {
            return Math.sqrt(area(d.population) / Math.PI);
        })
        .merge(circles)
        .transition(t)            
            .attr("fill", (d) => {
                return color(d.continent);
            })
            .attr("cy", (d) => { 
                return y(d.life_exp); 
            })
            .attr("cx", (d) => { 
                return x(d.income); 
            })
            .attr("r", (d) => {
                return Math.sqrt(area(d.population) / Math.PI);
            })  
}