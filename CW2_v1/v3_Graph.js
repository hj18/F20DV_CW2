// set the dimensions and margins of the graph
const margin1 = { top: 10, right: 30, bottom: 90, left: 40 },
  width2 = 460 - margin1.left - margin1.right,
  height2 = 450 - margin1.top - margin1.bottom;

// append the svg object to the body of the page
const svg2 = d3
  .select("#my_dataviz3")
  .append("svg")
  .attr("width", width2 + margin1.left + margin1.right)
  .attr("height", height2 + margin1.top + margin1.bottom)
  .append("g")
  .attr("transform", `translate(${margin1.left},${margin1.top})`);

// Parse the Data
d3.csv(
  "https://raw.githubusercontent.com/hj18/F20DV_CW2/main/res.csv"
).then(function (data) {
  // X axis
  const x1 = d3
    .scaleBand()
    .range([0, width2])
    .domain(data.map((d) => d.Feel_After))
    .padding(0.2);
  svg2
    .append("g")
    .attr("transform", `translate(0,${height2})`)
    .call(d3.axisBottom(x1))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  const y1 = d3.scaleLinear().domain([0, 10]).range([height2, 0]);
  svg2.append("g").call(d3.axisLeft(y1));

  // Bars
  svg2
    .selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", (d) => x1(d.Feel_After))
    .attr("width", x1.bandwidth())
    .attr("fill", "#2E564E")
    // no bar at the beginning thus:
    .attr("height", (d) => height2 - y1(0)) // always equal to 0
    .attr("y", (d) => y1(0));

  // Animation
  svg2
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", (d) => y1(d.Playing_Hours))
    .attr("height", (d) => height2 - y1(d.Playing_Hours))
    .delay((d, i) => {
      console.log(i);
      return i * 100;
    });
});
