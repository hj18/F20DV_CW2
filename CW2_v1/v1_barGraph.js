// Dimension of the whole chart. Only one size since it has to be square
const marginWhole = { top: 10, right: 10, bottom: 10, left: 10 },
  sizeWhole = 740 - marginWhole.left - marginWhole.right;

// Create the svg area
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", sizeWhole + marginWhole.left + marginWhole.right)
  .attr("height", sizeWhole + marginWhole.top + marginWhole.bottom)
  .append("g")
  .attr("transform", `translate(${marginWhole.left},${marginWhole.top})`);

d3.csv(
  "https://raw.githubusercontent.com/hj18/F20DV_CW2/main/vgsales.csv"
).then(function (data) {
  // What are the numeric variables in this dataset? How many do I have
  const allVar = ["NA_Sales", "EU_Sales", "JP_Sales", "Global_Sales"]; // an array of strings representing the names of the numeric variables in the dataset.
  const numVar = allVar.length; // the number of numeric variables in the dataset

  // Now I can compute the size of a single chart
  mar = 20; // variable is used to represent the margin size around each chart
  size = sizeWhole / numVar;

  // ----------------- //
  // Scales
  // ----------------- //

  // Create a scale: gives the position of each pair each variable
  const position = d3
    .scalePoint()
    .domain(allVar)
    .range([0, sizeWhole - size]);

  // Color scale: give me a specie name, I return a color
  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.Platform)) // include all unique platform values
    .range(["#402D54", "#D18975", "#8FD175"]);

  // Create a legend group
  const legend = svg
    .append("g")
    .attr("transform", `translate(${sizeWhole - 100},${sizeWhole - 100})`);

  // Add legend items
  legend
    .selectAll("legend")
    .data(color.domain())
    .join("circle")
    .attr("cx", 0)
    .attr("cy", (d, i) => i * 20)
    .attr("r", 5)
    .style("fill", color);

  // Add legend labels
  legend
    .selectAll("legend")
    .data(color.domain())
    .join("text")
    .attr("x", 10)
    .attr("y", (d, i) => i * 20)
    .text((d) => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  // ------------------------------- //
  // Add charts
  // ------------------------------- //
  for (i in allVar) {
    for (j in allVar) {
      // Get current variable name
      const var1 = allVar[i];
      const var2 = allVar[j];

      // If var1 == var2 i'm on the diagonal, I skip that
      if (var1 === var2) {
        continue;
      }

      // Add X Scale of each graph
      xextent = d3.extent(data, function (d) {
        return +d[var1];
      });
      const x = d3
        .scaleLinear()
        .domain(xextent)
        .nice()
        .range([0, size - 2 * mar]);

      // Add Y Scale of each graph
      yextent = d3.extent(data, function (d) {
        return +d[var2];
      });
      const y = d3
        .scaleLinear()
        .domain(yextent)
        .nice()
        .range([size - 2 * mar, 0]);

      // Add a 'g' at the right position
      const tmp = svg
        .append("g")
        .attr(
          "transform",
          `translate(${position(var1) + mar},${position(var2) + mar})`
        );

      // Add X and Y axis in tmp
      tmp
        .append("g")
        .attr("transform", `translate(0,${size - mar * 2})`)
        .call(d3.axisBottom(x).ticks(3));
      tmp.append("g").call(d3.axisLeft(y).ticks(3));

      // Add circle
      tmp
        .selectAll("myCircles")
        .data(data)
        .join("circle")
        .attr("cx", function (d) {
          return x(+d[var1]);
        })
        .attr("cy", function (d) {
          return y(+d[var2]);
        })
        .attr("r", 3)
        .attr("fill", function (d) {
          return color(d.Platform);
        });
    }
  }

  // ------------------------------- //
  // Add variable names = diagonal
  // ------------------------------- //
  for (i in allVar) {
    for (j in allVar) {
      // If var1 == var2 i'm on the diagonal, otherwisee I skip
      if (i != j) {
        continue;
      }
      // Add text
      const var1 = allVar[i];
      const var2 = allVar[j];
      svg
        .append("g")
        .attr("transform", `translate(${position(var1)},${position(var2)})`)
        .append("text")
        .attr("x", size / 2)
        .attr("y", size / 2)
        .text(var1)
        .attr("text-anchor", "middle");
    }
  }
});

  
