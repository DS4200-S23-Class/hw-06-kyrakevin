// creating a frame
const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 400;
const MARGINS = {left: 40, right: 40, top: 40, bottom: 40};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;
let selectedSpecies = [];

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
        .domain([0, d3.max(data, d => {return parseFloat(d.Sepal_Length) + 1;})])
        .range([0, VIS_WIDTH])

      const y_scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => {return parseFloat(d.Petal_Length) + 1;})])
        .range([VIS_HEIGHT, 0]);

    FRAME1.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", (d) => {
            return MARGINS.left + x_scale(parseFloat(d.Sepal_Length));
          })
          .attr("cy", (d) => {
            return y_scale(parseFloat(d.Petal_Length));
          })
          .attr("r", 5)
          .attr("class", "point length")
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
        .domain([0, d3.max(data, d => {return parseFloat(d.Sepal_Width) + .5;})])
        .range([0, VIS_WIDTH])

      const y_scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => {return parseFloat(d.Petal_Width) + .25;})])
        .range([VIS_HEIGHT, 0]);

    FRAME2.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", (d) => {
            return MARGINS.left + x_scale(parseFloat(d.Sepal_Width));
          })
          .attr("cy", (d) => {
            return y_scale(parseFloat(d.Petal_Width));
          })
          .attr("r", 5)
          .attr("class", "point width")
          .attr("id", (d) => {
            return d.id;
          })
          .attr("fill", (d) => {
            return pickColor(d.Species);
          })

      // add axises/ticks
      FRAME2.append("g")
          .attr("transform", "translate("+ MARGINS.left +"," + VIS_HEIGHT + ")" )
              .call(d3.axisBottom(x_scale).ticks(8))
              .attr("font-size", "15px");

      FRAME2.append("g")
      .attr("transform", "translate("+ MARGINS.left +",0)" )
          .call(d3.axisLeft(y_scale))
          .attr("font-size", "15px");

          // adds d3 brush tool
  		FRAME2.call(d3.brush()
  			.extent([[MARGINS.left, 0], [VIS_WIDTH+MARGINS.left, VIS_HEIGHT]])
  			.on("start brush", brushed)
  		);

      // determines which points are being selected and highlights same
      // points on other charts
      function brushed(event) {
        const length_points = d3.selectAll('.length');
        const width_points = d3.selectAll('.width');
        const bars = d3.selectAll('.bar');

        extent = event.selection;
        width_points.classed("highlighted", function(d){
        	return highlight(extent,
            x_scale(d.Sepal_Width) + MARGINS.left, y_scale(d.Petal_Width))
        })
        length_points.classed("highlighted", function(d){
          return highlight(extent,
            x_scale(d.Sepal_Width) + MARGINS.left, y_scale(d.Petal_Width))
        })
          bars.classed("highlighted", function(d) {
          return highlight(extent,
            x_scale(d.Sepal_Width) + MARGINS.left, y_scale(d.Petal_Width))
        }) 
        };

      // determines if a point should be highlighted
      function highlight(extent, cx, cy) {
  		    let left = extent[0][0] <= cx;
  		    let right = extent[1][0] >= cx;
  		    let top = extent[0][1] <= cy;
  		    let bottom = extent[1][1] >= cy;
          return left && right && top && bottom;
  		};
  });
}

function visRight() {
    d3.csv("data/iris.csv").then((data) => {
      const x_scale = d3.scaleBand()
        .domain(data.map(function (d) {return d.Species;}))
        .range([0, VIS_WIDTH])

      const y_scale = d3.scaleLinear()
        .domain([0, 60])
        .range([VIS_HEIGHT, 0]);
  // adding frame for the first viz
  const FRAME3 = d3.select("#right")
                  .append("svg")
                      .attr("height", FRAME_HEIGHT)
                      .attr("width", FRAME_WIDTH)
                      .attr("class", "frame");

  const BAR_WIDTH = 60;

  FRAME3.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", (d) => {return 1.5 * MARGINS.left + x_scale(d.Species); })
      .attr("y", y_scale(50))
      .attr("width", BAR_WIDTH)
      .attr("height", function(d) { return VIS_HEIGHT - y_scale(50); })
      .attr("class", "bar")
      .attr("fill", (d) => {
        return pickColor(d.Species);
      });

    // add axises/ticks
    FRAME3.append("g")
          .attr("transform", "translate("+ MARGINS.left +"," + VIS_HEIGHT + ")" )
            .call(d3.axisBottom(x_scale))
                .attr("font-size", "15px");

    FRAME3.append("g")
          .attr("transform", "translate("+ MARGINS.left +",0)" )
            .call(d3.axisLeft(y_scale))
            .attr("font-size", "15px");
});
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
}


visLeft();
visRight();
visMid();
