// Election Map, Primary 2018 NYC, precinct level


var margin = {top: 20, right: 40, bottom: 30, left: 50},
    width  = 640 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var maps = { 
    "citywide": {
        "section":"citywide",
        "objectName":"Election Districts", 
        "streetObject":"citywide-streets",
        "centerCoords":[-74.2179, 43.2994]
    },
    "bronx": {
        "section":"bronx",
        "objectName":"bronx-precincts2", 
        "streetObject":"bronx-streets",
        "centerCoords":[-73.8648, 40.8448]
    }, 
    "brooklyn": {
        "section":"brooklyn",
        "objectName":"brooklyn-precincts", 
        "streetObject":"brooklyn-streets",
        "centerCoords":[-73.9442, 40.6782]
    }, 
    "queens": {
        "section":"queens",
        "objectName":"what", 
        "streetObject":"queens-streets",
        "centerCoords":[-73.7949, 40.7282]
    },
    "manhattan": {
        "section":"manhattan",
        "objectName":"man2", 
        "streetObject":"manhattan-streets",
        "centerCoords":[-73.9712, 40.7831]
    },  
    "staten island": {
        "section":"staten-island",
        "objectName":"staten-island-precincts", 
        "streetObject":"staten-island-streets",
        "centerCoords":[-74.1502, 40.5795]
    }  
}

drawMap(maps["brooklyn"]);


function drawMap(mapObject) {

    var precinctData = "map-data/precinct-maps/" + mapObject["section"] + "-precincts.json";
    var streetData   = "map-data/street-maps/" + mapObject["section"] + "-streets.json";
    var objectName   = mapObject["objectName"];
    var centerCoords = mapObject["centerCoords"];
    var streetObject = mapObject["streetObject"];

    d3.json(streetData, function(error, streets) {

        var conus = topojson.feature(streets, {
            type: "GeometryCollection",
            geometries: streets.objects[streetObject].geometries
          });

        var projection = d3.geoMercator()
        .center(centerCoords)
        .fitSize([width, height], conus);

        var path = d3.geoPath().projection(projection);

        d3.json(precinctData, function(error, districts) {

            var nixonVotes = 0;
            var cuomoVotes = 0;

            var path = d3.geoPath().projection(projection);
            console.log(districts)
            console.log(topojson.feature(districts, districts.objects[objectName]).features)
            svg.selectAll('.precincts')
                .data(topojson.feature(districts, districts.objects[objectName]).features)
                .enter()
                .append('path')
                .attr('class', function(d) {

                    var district = String(d.properties.elect_dist);
                    var assemblyDistrict = district.slice(0,2);
                    var precinct = String(parseInt(district.slice(2,5)) + 100);

                    return "precinct" + assemblyDistrict + precinct;
                })
                .attr('d', path)
                .attr("stroke","#000")
                .attr("stroke-width",0)
                .attr("fill", "none")
                .attr("opacity", 0.9)
                .on("mouseover",function(d) {
                    console.log(d);
                });

            getResults();

            function getResults() {

                d3.json("results-data/2018-gub-election-results-final.json", function(data) {

                    data.forEach((precinctData) => {
                        var precinct = precinctData.countyNumber;

                        if(precinctData.voteCount > precinctData.voteCount1) {
                            d3.select(".precinct"+precinct).attr("fill","#8c6bb1"); // Nixon -> green
                        } else if(precinctData.voteCount1 > precinctData.voteCount) {
                            d3.select(".precinct"+precinct).attr("fill","#f46d43");
                        } else {
                            d3.select(".precinct"+precinct).attr("fill","#DDDDDD");
                        }
                    });
                });
            
            }  

            svg.selectAll('.streets')
                .data(topojson.feature(streets, streets.objects[streetObject]).features)
                .enter()
                .append('path')
                .attr('class', 'street')
                .attr('d', path)
                .attr("stroke","#DDD")
                .attr("stroke-opacity","0.5")
                .attr("stroke-width",0.3)
                .attr("fill", "none")

        });

    });

}




// console.log(district);
// console.log(assemblyDistrict);
// console.log(precinct);
// console.log(assemblyDistrict + precinct)
// console.log("******")
