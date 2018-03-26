var width = window.innerWidth * 0.8,
    height = window.innerHeight;

var svg = d3.select("#canvas").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.01)
    .distance(100)
    .charge(-70)
    .size([width, height]);

d3.json("composers.json", function (json) {
    force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    var link = svg.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) {
            return d.weight;
        });

    var node = svg.selectAll(".node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    node.append("circle")
        .attr("r", "30")

    node.append("image")
        .attr("href", function (d) {
            return 'img/' + d.name + '.png';
        })
        .attr('x', '-30px')
        .attr('y', '-30px');

    node.append("text")
        .attr("dx", -30)
        .attr("dy", "3em")
        .text(function (d) {
            return d.name
        });

    force.on("tick", function () {
        link.attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
});
