// get the data
d3.csv("data.csv", function (error, links) {

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function (link) {
        link.source = nodes[link.source] ||
            (nodes[link.source] = {
                name: link.source
            });
        link.target = nodes[link.target] ||
            (nodes[link.target] = {
                name: link.target
            });
        link.value = link.value;
    });

    var width = window.innerWidth * 0.8,
        height = window.innerHeight - 12,
        radius = 30;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(100)
        .charge(-600)
        .on("tick", tick)
        .start();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"]) // Different link/path types can be defined here
        .enter().append("svg:marker") // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 36)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .attr("fill", "#b4b4b4")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    // add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        .attr("class", function (d) {
            return "link " + d.type;
        })
        .attr("marker-end", "url(#end)")
        .on("mouseover", function (d) {
            tooltip.html("<div class='tooltip-inner'>" + d.value + "</div>");
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () {
            return tooltip
                .attr("x", d3.event.clientX - 322 + "px")
                .attr("y", d3.event.clientY + "px");
        })
        .on("mouseout", function () {
            return tooltip.style("visibility", "hidden");
        });

    // define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    // add the nodes
    node.append("circle")
        .attr("r", radius)

    node.append("image")
        .attr("href", function (d) {
            return './img/' + d.name + '.png';
        })
        .attr('height', '60')
        .attr('width', '60')
        .attr('x', '-30px')
        .attr('y', '-30px');

    // add the text
    node.append("text")
        .attr("x", 36)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        });

    function tick() {
        path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = 0;
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }

    var tooltip = svg.append("foreignObject")
        .attr("class", "tooltip-svg")
        .attr("width", "180px")
        .attr("height", "200px")
});
