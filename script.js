
var socket;

$(function() {

    socket = io.connect();
    
    socket.on('send client initial text', function(data) {
        $('#inputText').val(data); 
    })

    $('#analyzeButton').click(function() {
        var text = $('#inputText').val();
        // console.log(text); 

        if (text.split(" ").length < 100) {
            alert("please enter at least 100 words!"); 
        } else {
            socket.emit('send server text to analyze', {
                'text' : text
            });
        }
    });

    socket.on('send client analyzed text', function(data) {
        // console.log(data); 
        displayGraph(data); 
    })

});

// =============================================================================

var displayGraph = function(data) {

    console.log("displaying graph"); 

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = $('#graph').width() - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "%");

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:white'>" + d.text + "</span>";
      });


    d3.select("svg").remove(); 

    var svg = d3.select("#graph").append("svg");

    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.call(tip);

    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.sentiment; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        // .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        // .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");
        // .text("");

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) { return i * width/data.length; })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.sentiment); })
      .attr("height", function(d) { return height - y(d.sentiment); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    function type(d) {
        d.sentiment = +d.sentiment;
        return d;
    }

}
