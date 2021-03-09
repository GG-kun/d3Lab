/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
.attr("width", 400)
.attr("height", 400);

d3.csv("data/ages.csv").then((data)=> {
    console.log(data);
}).catch((error) => {
    console.log(error);
});

d3.tsv("data/ages.tsv").then((data)=> {
    console.log(data);
}).catch((error) => {
    console.log(error);
});

d3.json("data/ages.json").then((data)=> {
    var circlesRadius = [];

    console.log(data);
    data.forEach((d)=>{
		circlesRadius.push(+d.age);
	});

    var circles = svg.selectAll("circle")
    .data(circlesRadius);
    
    circles.enter()
    .append("circle")
    .attr("cx", (d,i) => {
        return (i*50) + 25;
    })
    .attr("cy", 50)
    .attr("r", (d) => {
        return d;
    })
    .attr("fill", (circleRadius)=>{
        var color = "blue";
        if(circleRadius > 10){
            color = "green";
        }

        return color;
    });
}).catch((error) => {
    console.log(error);
});
