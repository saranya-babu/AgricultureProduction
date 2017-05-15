var margin = {top: 40, right: 50, bottom: 30, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width],0.1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Aggregate Value:</strong> <span style='color:red'>" + d.aggregateVal + "</span>";
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.json("../output/ComercialCropsData.json", function(error, data) {

	  if(error) console.log("Error: data not loaded");

  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return d.aggregateVal; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height+5) + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "translate(" + width + ",0)")
      .attr("dy","0.9em")
      .attr("dx","0.5em")
      .style("font-size","15px")
      .style("color","black")
      .text("Year");
    

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -200)
      .attr("y", -40)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Production in Ton mn");

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.aggregateVal); })
      .attr("height", function(d) { return height - y(d.aggregateVal); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});
