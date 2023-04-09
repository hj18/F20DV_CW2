//Double circular barplot
const margin = { top: 40, right: 0, bottom: 0, left: 0 },
  width1 = 600 - margin.left - margin.right,
  height1 = 600 - margin.top - margin.bottom,
  innerRadius = 100,
  outerRadius = Math.min(width1, height1) / 2;

const svg1 = d3
  .select("#my_dataviz2")
  .append("svg")
  .attr("width", width1 + margin.left + margin.right)
  .attr("height", height1 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${width1 / 2 + margin.left}, ${height1 / 2 + margin.top})`);

// Define ybis outside the d3.csv function
const ybis = d3.scaleRadial()
  .range([innerRadius, 5]) // Domain will be defined later.
  .domain([0, 13000]);

d3.csv("https://raw.githubusercontent.com/hj18/F20DV_CW2/main/games.csv").then(function (data) {
    data = data.filter(d => d.Rating > 4.2);

  const x = d3
    .scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(data.map((d) => d.Genres));

  const y = d3
    .scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([0, 13000]);

  svg1
    .selectAll(".bar")
    .data(data)
    .join("path")
    .attr("class", "bar")
    .attr("d", d3.arc()
      .innerRadius((d) => i % 2 === 0 ? innerRadius : y(0))
      .outerRadius((d) => i % 2 === 0 ? y(d["Rating"]) : ybis(d["Rating"]))
      .startAngle((d) => x(d.Genres))
      .endAngle((d) => x(d.Genres) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius)
    );

  svg1
    .selectAll(".label")
    .data(data)
    .join("g")
    .attr("class", "label")
    .attr("text-anchor", (d) => (x(d.Genres) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
    .attr("transform", (d) => `rotate(${((x(d.Genres) + x.bandwidth() / 2) * 180) / Math.PI - 90})translate(${y(d["Rating"]) + 10},0)`)
    .append("text")
    .text((d) => d.Genres)
    .attr("transform", (d) => (x(d.Genres) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");

});
