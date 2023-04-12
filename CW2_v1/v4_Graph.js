// set the dimensions and margins of the graph
var margin3 = {top: 30, right: 50, bottom: 30, left: 60},
    width3 = 600 - margin3.left - margin3.right,
    height3 = 820 - margin3.top - margin3.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#my_dataviz4")
  .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin3.left + "," + margin3.top + ")");

// read in the data
d3.csv("https://raw.githubusercontent.com/hj18/F20DV_CW2/main/vgsales.csv").then(function(data) {

  // filter the data to include only four genres
  var filtered_data = data.filter(function(d) {
    return d.Genre == "Action" || d.Genre == "Role-Playing" || d.Genre == "Shooter" || d.Genre == "Sports";
  });

  // setting up the domain and range for the x and y scales
  var x3 = d3.scaleLinear()
    .domain([0, d3.max(filtered_data, function(d) { return +d.Year; })]) // <--- here using the years as a domain
    .range([ 0, width3 ]);

  // the range of the y axis it depends on the Global_Sales
  var y3 = d3.scaleLinear()
    .domain([0, d3.max(filtered_data, function(d) { return +d.Global_Sales; })])
    .range([ height3, 0]);

  // Here I'm setting the sacale of each circle size later on will be used again for the radius of the circle down 
  var max_sales = d3.max(filtered_data, function(d) { return +d.Global_Sales; });
  var size = d3.scaleLinear()
    .domain([0, max_sales])
    .range([5, 30]);

  // Setting up the colours, I made sure that the colours contrast for accessibility 
  var color = d3.scaleOrdinal()
    .domain(["Action", "Role-Playing", "Shooter", "Sports"])
    .range(["#e41a1c","#377eb8","#4daf4a","#984ea3"]); // https://observablehq.com/@d3/color-schemes <-- went here to get some good colour schemes

  // add the x axis
  svg3.append("g")
    .attr("transform", "translate(0," + height3 + ")")
    .call(d3.axisBottom(x3).ticks(5));

  // add the y axis
  svg3.append("g")
    .call(d3.axisLeft(y3));

  // add the bubbles
  svg3.selectAll("circle")
    .data(filtered_data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x3(d.Year); } )
      .attr("cy", function (d) { return y3(d.Global_Sales); } )
      .attr("r", function (d) { return size(d.Global_Sales); } )
      .style("fill", function (d) { return color(d.Genre); } )
      .style("opacity", "0.7")
      .attr("stroke", "black")
      // When you hover over the circlers you get a text 
    .append("title") 
      .text(function(d) { return d.Genre + ": " + d.Global_Sales + " million copies"; });
});
