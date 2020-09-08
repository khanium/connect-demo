
async function load_cluster() {
    console.log("loading svg...");

    let content = document.getElementById("cluster-info");
    let response = await fetch("/connect/simulator/info");
    let data = await response.json();
    console.log(data);
    console.log(JSON.stringify(data,null, 2));
  /* const data = {
        clusters: [{
            name: "Cluster1",
            nodes: [
                {name: "cbnode1", services: ["Data"], status: "HEALTHY"},
                {name: "cbnode2", services: ["Data"], status: "HEALTHY"},
                {name: "cbnode3", services: ["Data"], status: "HEALTHY"},
                {name: "cbnode4", services: ["Query", "Index"], status: "HEALTHY"},
                {name: "cbnode5", services: ["Query", "Index"], status: "HEALTHY"}
            ],
            status: "healthy",
            active: true
        }, {
            name: "Cluster2",
            nodes: [
                {name: "cb2node1", services: ["Data"], status: "HEALTHY"},
                {name: "cb2node2", services: ["Data"], status: "HEALTHY"},
                {name: "cb2node3", services: ["Data"], status: "HEALTHY"},
                {name: "cb2node4", services: ["Query", "Index"], status: "HEALTHY"},
                {name: "cb2node5", services: ["Query", "Index"], status: "HEALTHY"}
            ],
            status: "healthy",
            active: false
        }],
        appName: "App"
    };

*/
    content.innerHTML= create_cluster_svg(data);
}

function create_cluster_svg(data) {
    let clusterNumber=0;
    let offsetX = 0;
    let layout = calculate_clusters_layouts(data);
    let svg = svg_definitions();

    // adding clusters

     //TODO use layout parameter  svg += create_cluster(layout.clusters[clusterNumber], c);
        svg += create_cluster(data.cluster, offsetX, clusterNumber, data.cluster.active);
        clusterNumber +=1;
        offsetX += calculate_cluster_width(data.cluster.nodes.length)+10;

    console.log("width: ", offsetX);
    svg = "<svg width=\""+offsetX+"\" height=\"200\">\n" + svg;
    let app_x = (offsetX/2 - 50);
  //TODO  svg += create_app_svg(data.appName, app_x);
  //TODO  svg += create_operation_svg(data, app_x );
    svg += "                        Sorry, your browser does not support inline SVG.\n" +
    "                    </svg>";
    return svg;
}

function calculate_clusters_layouts(data) {
    let layout = {
        clusters: [],
        clusters_max_height: 140,
        height: 380,
        weight: 0,
        app: { x: 0}
    };
    let update_height = false;

        let height = Math.max(...data.cluster.nodes.map(node => node.services.lenght))*20 + 100;
        update_height = update_height || height > layout.clusters_max_height;
        layout.clusters_max_height = Math.max(height, layout.clusters_max_height);
        let cluster_layout = { x: layout.weight, y: 10, width: calculate_cluster_width(data.cluster.nodes.length), height: layout.clusters_max_height};
        layout.clusters.push(cluster_layout);


    layout.height = layout.clusters_max_height + 240;

    if(update_height) {
        layout.clusters.forEach(c => c.height=layout.clusters_max_height);
    }

    return layout;
}

function svg_definitions(){
    return "                        <defs>\n" +
        "                            <filter id=\"filter\" x=\"0\" y=\"0\">\n" +
        "                                <feGaussianBlur stdDeviation=\"5\" />\n" +
        "                                <feOffset dx=\"5\" dy=\"5\" />\n" +
        "                            </filter>\n" +
        "                            <marker id=\"arrow\" markerWidth=\"10\" markerHeight=\"10\" refX=\"0\" refY=\"3\" orient=\"auto\" markerUnits=\"strokeWidth\" viewBox=\"0 0 20 20\">\n" +
        "                                <path d=\"M0,0 L0,6 L9,3 z\" fill=\"#3CB21A\" />\n" +
        "                            </marker>\n" +
        "                            <marker id=\"arrow-read\" markerWidth=\"10\" markerHeight=\"10\" refX=\"0\" refY=\"3\" orient=\"auto\" markerUnits=\"strokeWidth\" viewBox=\"0 0 20 20\">\n" +
        "                                <path d=\"M0,0 L0,6 L9,3 z\" fill=\"#DA9E27\" />\n" +
        "                            </marker>\n" +
        "                            <marker id=\"arrow-disable\" markerWidth=\"10\" markerHeight=\"10\" refX=\"0\" refY=\"3\" orient=\"auto\" markerUnits=\"strokeWidth\" viewBox=\"0 0 20 20\">\n" +
        "                                <path d=\"M0,0 L0,6 L9,3 z\" fill=\"#FBF9FA\" />\n" +
        "                            </marker>\n" +
        "                        </defs>";
}

function create_app_svg(appName, app_x) {

    return  "                        <svg id=\"app\" x=\""+app_x+"\" y=\"240\">\n" +
        "                            <text x=\"36\" y=\"100\" font-family=\"Verdana\" font-size=\"12\" font-weight=\"bold\" fill=\"midnightblue\">"+appName+"</text>\n" +
        "                            <image x=\"0\" y=\"0\" width=\"100\" height=\"100\" xlink:href=\"images/app.png\" />\n" +
        "                        </svg>\n";
}

function create_operation_svg(data, appX) {
    let offset = 0;

    let svg = "<svg id=\"hideMe\" x=\""+0+"\" y=\"0\">";
    let order = 0;

        let width = calculate_cluster_width(data.cluster.nodes.length);
        let clusterX = ((offset+width-40) - appX) > 0 ? offset + width*0.30 : (offset + width*0.70) ;
        let app_x = (offset - appX) > 0 ? appX + 50 : (appX + 20) ;
        if(data.cluster.active) {
            svg += "                        <line id=\"cb" + order + "-write\" x1=\"" + (app_x) + "\" y1=\"240\" x2=\"" + clusterX + "\" y2=\"200\" class=\"hideMe\" style=\"stroke:rgb(60,178,26);stroke-width:4\" marker-end=\"url(#arrow)\" />\n" +
                "                        <line id=\"cb" + order + "-read\" x2=\"" + (app_x + 10) + "\" y2=\"240\" x1=\"" + (clusterX + 10) + "\" y1=\"200\" class=\"hideMe\" style=\"stroke:rgb(218,158,39);stroke-width:4\" marker-end=\"url(#arrow-read)\" />\n";
        } else {
            svg += "                        <line id=\"cb" + order + "-write\" x1=\"" + (app_x) + "\" y1=\"240\" x2=\"" + clusterX + "\" y2=\"200\" class=\"hideMe\" style=\"stroke:rgb(251,249,250);stroke-width:4\" marker-end=\"url(#arrow-disable)\" />\n" +
                "                        <line id=\"cb" + order + "-read\" x2=\"" + (app_x + 10) + "\" y2=\"240\" x1=\"" + (clusterX + 10) + "\" y1=\"200\" class=\"hideMe\" style=\"stroke:rgb(251,249,250);stroke-width:4\" marker-end=\"url(#arrow-disable)\" />\n";

        }
        order += 1;
        offset += width;

    svg += "<svg/>"
    return  svg;
}


function calculate_cluster_width(num_nodes) {
   return num_nodes * 100;
}

/**
 * Output example:
   "                            <rect x=\"10\" y=\"10\" rx=\"20\" ry=\"20\" width=\""+borderWidth+"\" height=\"140\" fill=\"grey\" filter=\"url(#filter)\" />\n" +
   "                            <rect x=\"10\" y=\"10\" rx=\"20\" ry=\"20\" width=\""+borderWidth+"\" height=\"140\" style=\"fill:white;stroke:firebrick;stroke-width:5;opacity:1.0\" />\n";
   "                            <svg id=\"cb2node1\" x=\"10\" y=\"0\" width=\"80\" height=\"120\">\n" +
   "                                <text x=\"35\" y=\"100\" font-family=\"Verdana\" font-size=\"12\" font-weight=\"bold\" fill=\"firebrick\">Data</text>\n" +
   "                                <image x=\"10\" y=\"10\" width=\"80\" height=\"80\" xlink:href=\"images/node.svg\" />\n" +
   "                            </svg>\n" +
   "                            <svg id=\"cb2node2\" x=\"100\" y=\"0\" width=\"80\" height=\"120\">\n" +
   "                                <text x=\"35\" y=\"100\" font-family=\"Verdana\" font-size=\"12\" font-weight=\"bold\" fill=\"firebrick\">Data</text>\n" +
   "                                <image x=\"10\" y=\"10\" width=\"80\" height=\"80\" xlink:href=\"images/node.svg\" />\n" +
   "                            </svg>\n" +
   "                            <svg id=\"cb2node3\" x=\"190\" y=\"0\" width=\"80\" height=\"120\">\n" +
   "                                <text x=\"35\" y=\"100\" font-family=\"Verdana\" font-size=\"12\" font-weight=\"bold\" fill=\"firebrick\">Data</text>\n" +
   "                                <image x=\"10\" y=\"10\" width=\"80\" height=\"80\" xlink:href=\"images/node.svg\" />\n" +
   "                            </svg>\n" +
   "                            <svg id=\"cb2node4\" x=\"280\" y=\"0\" width=\"80\" height=\"120\">\n" +
   "                                <text x=\"32\" y=\"100\" font-family=\"Verdana\" font-size=\"12\" font-weight=\"bold\" fill=\"firebrick\">Query</text>\n" +
   "                                <text x=\"32\" y=\"120\" font-family=\"Verdana\" font-size=\"12\" font-weight=\"bold\" fill=\"firebrick\">Index</text>\n" +
   "                                <image x=\"10\" y=\"10\" width=\"80\" height=\"80\" xlink:href=\"images/node.svg\" />\n" +
   "                            </svg>\n" +
   "                            <svg id=\"cb2node5\" x=\"370\" y=\"0\" width=\"80\" height=\"120\">\n" +
   "                                <text x=\"32\" y=\"100\" font-family=\"Verdana\" font-size=\"12\" font-weight=\"bold\" fill=\"firebrick\">Query</text>\n" +
   "                                <text x=\"32\" y=\"120\" font-family=\"Verdana\" font-size=\"12\" font-weight=\"bold\" fill=\"firebrick\">Index</text>\n" +
   "                                <image x=\"10\" y=\"10\" width=\"80\" height=\"80\" xlink:href=\"images/node.svg\" />\n" +
   "                            </svg>\n" ;
   "                            <line id=\"c"+order+"-active-status\" x1=\"30\" y1=\""+(borderHeight+30)+"\" x2=\""+(borderWidth-30)+"\" y2=\""+(borderHeight+30)+"\" style=\"stroke:"+activeColor+";stroke-width:8\" />\n" +
 *
 **/
function create_cluster(cluster, offsetX, order, active) {
    let clusterName = cluster.name;
    let healthy = cluster.status === "healthy";  // TODO changing colors based on state
    let clusterWidth = calculate_cluster_width(cluster.nodes.length);
    let borderWidth = clusterWidth - (cluster.nodes.length * 10) -10;
    let borderHeight = 170;
    let activeColor = active ? "rgb(178,34,34)" :"rgb(251,249,250)";
    let svg = " <svg id=\"cluster2\" x=\""+offsetX+"\" y=\"10\" width=\""+clusterWidth+"\" height=\"400\">\n";
    svg += add_border(borderWidth, borderHeight);
    svg += add_name(clusterName);
    let position = 0;
    cluster.nodes.forEach(n => {
        svg += add_node(n, position);
        position += 1;
    });

  //  svg += add_active_cluster_line("c"+order+"-active-status", activeColor, borderWidth, borderHeight);
    svg += "                        </svg>";
    return svg;
}


function add_name(name) {
    let width = 20+name.length*10;
    let height = 15;
    let offsetX = 20;
    let offsetY = 10;
    console.log("name: ",name);
    let svg = "                            <rect x=\"5\" y=\"0\" rx=\"2\" ry=\"2\" width=\""+width+"\" height=\""+height+"\" style=\"fill:black;stroke:black;stroke-width:0;opacity:1.0\" />\n";
       svg += "                            <text x=\""+offsetX+"\" y=\""+offsetY+"\" font-family=\"Verdana\" font-size=\"10\" font-weight=\"bold\" fill=\"white\">"+name+"</text>\n";

    return svg;
}

function add_active_cluster_line(id,color,width, height) {
    let offsetY = height+30;
    return    "                            <line id=\""+id+"\" x1=\"30\" y1=\""+offsetY+"\" x2=\""+(width-30)+"\" y2=\""+offsetY+"\" style=\"stroke:"+color+";stroke-width:8\" />\n" ;
}

function add_border(width, height) {
    let svg =     "                            <rect x=\"10\" y=\"10\" rx=\"20\" ry=\"20\" width=\""+width+"\" height=\""+height+"\" fill=\"grey\" filter=\"url(#filter)\" />\n" +
                  "                            <rect x=\"10\" y=\"10\" rx=\"20\" ry=\"20\" width=\""+width+"\" height=\""+height+"\" style=\"fill:white;stroke:firebrick;stroke-width:5;opacity:1.0\" />\n";
    return svg;
}

function add_node(node, position) {
    let id= node.name;
    let positionX = position * 90;
    let order = 0;
    let height = 100 + 20* node.services.length;
    let svg =  "                            <svg id=\""+id+"\" x=\""+positionX+"\" y=\"10\" width=\"90\" height=\""+height+"\">\n" ;
    svg += add_node_name(node.name);

    node.services.forEach(s => {
       svg += add_node_service(s,order);
       order +=1;
    });

    svg += "                                <image x=\"10\" y=\"10\" width=\"80\" height=\"70\" preserveAspectRatio=\"none\" xlink:href=\"images/node.svg\" />\n" +
        "                            </svg>\n";
    return svg;
}

function add_node_name(name) {
   let text_size = Math.min(name.length, 15);
   let offsetX = 47 - 2*text_size;
   let shortname = name.substring(0, text_size);
   let offsetY = 15;
   return "                                <text x=\""+offsetX+"\" y=\""+offsetY+"\" font-family=\"Verdana\" font-size=\"7\" font-weight=\"bold\" fill=\"darkgray\">"+shortname+"</text>\n";

}

function add_node_service(service, order) {
   let offsetX = 47 - 3 * service.length;
   let offsetY= 90+order*20;
   return "                                <text x=\""+offsetX+"\" y=\""+offsetY+"\" font-family=\"Verdana\" font-size=\"12\" font-weight=\"bold\" fill=\"firebrick\">"+service+"</text>\n";
}

