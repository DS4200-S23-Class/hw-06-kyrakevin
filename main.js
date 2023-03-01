// creating a frame
const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 400;
const MARGINS = {left: 40, right: 40, top: 40, bottom: 40};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

function visLeft() {
  // adding frame for the first viz
  const FRAME1 = d3.select("#left")
                  .append("svg")
                      .attr("height", FRAME_HEIGHT)
                      .attr("width", FRAME_WIDTH)
                      .attr("class", "frame");

  // LENGTH DATA
  d3.csv("data/iris.csv").then((data) => {
      const x_scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => {return parseFloat(d.Sepal_Length);})])
        .range([0, VIS_WIDTH])

      const y_scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => {return parseFloat(d.Petal_Length);})])
        .range([VIS_HEIGHT, 0]);

    FRAME1.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", (d) => {
            return MARGINS.left + x_scale(parseFloat(d.Sepal_Length));
          })
          .attr("cy", (d) => {
            return MARGINS.left + y_scale(parseFloat(d.Petal_Length));
          })
          .attr("r", 5)
          .attr("class", "point")
          .attr("id", (d) => {
            return d.id;
          })
          .attr("fill", (d) => {
            return pickColor(d.Species);
          })

      // add axises/ticks
      FRAME1.append("g")
          .attr("transform", "translate("+ MARGINS.left +"," + VIS_HEIGHT + ")" )
              .call(d3.axisBottom(x_scale))
              .attr("font-size", "15px");

      FRAME1.append("g")
      .attr("transform", "translate("+ MARGINS.left +",0)" )
          .call(d3.axisLeft(y_scale))
          .attr("font-size", "15px");

  });
}

function visMid() {
  // adding frame for the first viz
  const FRAME2 = d3.select("#mid")
                  .append("svg")
                      .attr("height", FRAME_HEIGHT)
                      .attr("width", FRAME_WIDTH)
                      .attr("class", "frame");

  // WIDTH DATA
  d3.csv("data/iris.csv").then((data) => {
      const x_scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => {return parseFloat(d.Sepal_Width);})])
        .range([0, VIS_WIDTH])

      const y_scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => {return parseFloat(d.Petal_Width);})])
        .range([VIS_HEIGHT, 0]);

    FRAME2.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", (d) => {
            return MARGINS.left + x_scale(parseFloat(d.Petal_Width));
          })
          .attr("cy", (d) => {
            return MARGINS.left + y_scale(parseFloat(d.Sepal_Width));
          })
          .attr("r", 5)
          .attr("class", "point")
          .attr("id", (d) => {
            return d.id;
          })
          .attr("fill", (d) => {
            return pickColor(d.Species);
          })

      // add axises/ticks
      FRAME2.append("g")
          .attr("transform", "translate("+ MARGINS.left +"," + VIS_HEIGHT + ")" )
              .call(d3.axisBottom(x_scale).ticks(6))
              .attr("font-size", "15px");

      FRAME2.append("g")
      .attr("transform", "translate("+ MARGINS.left +",0)" )
          .call(d3.axisLeft(y_scale))
          .attr("font-size", "15px");

  });

  // Add brushing and call the updateChart function
		FRAME2.call(d3.brush()
			.extent([[MARGINS.left, MARGINS.bottom], [VIS_WIDTH+MARGINS.left, VIS_HEIGHT+MARGINS.top]])
			.on("start brush", brushed)
		);
}

function visRight() {
  // adding frame for the first viz
  const FRAME3 = d3.select("#right")
                  .append("svg")
                      .attr("height", FRAME_HEIGHT)
                      .attr("width", FRAME_WIDTH)
                      .attr("class", "frame");


  species = ['setosa', 'versicolor', 'virginica']

  const x = d3.scaleBand()
    .range([0, VIS_WIDTH])
    .domain(species.map(d => d))
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, 54])
    .range([VIS_HEIGHT, 0]);

  FRAME3.selectAll("bars")
    .data(species)
    .enter()
    .append("rect")
      .attr("x", (d) => { return MARGINS.left + x(d); })
      .attr("y", y(50))
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return VIS_HEIGHT - y(50); })
      .attr("class", "bar")
      .attr("fill", (d) => {
        return pickColor(d);
      });

    // add axises/ticks
    FRAME3.append("g")
          .attr("transform", "translate("+ MARGINS.left +"," + VIS_HEIGHT + ")" )
            .call(d3.axisBottom(x))
                .attr("font-size", "15px");

    FRAME3.append("g")
          .attr("transform", "translate("+ MARGINS.left +",0)" )
            .call(d3.axisLeft(y))
            .attr("font-size", "15px");

}

function pickColor(species) {
  switch(species) {
    case 'setosa' :
      return 'Chartreuse';
      break;
    case 'versicolor' :
      return 'Cyan';
      break;
    case 'virginica' :
      return 'DarkOrchid';
      break;
    default :
      console.log('Unidentified species: ' + species)
  }

  function brushed({selection}) {
  if(selection) {
    const [[x0, y0], [x1, y1]] = selection;
    extent = d3.extent([[MARGINS.left, MARGINS.bottom], [VIS_WIDTH + MARGINS.left, VIS_HEIGHT + MARGINS.top]]);
    console.log(extent);
    console.log(d3.select(this));
    d3.select(this)
            .filter(d => x0 <= extent && extent < x1 && y0 <= extent && y(d.y) < extent)
            .classed("highlight");
  }
}

visLeft();
visRight();
visMid();
