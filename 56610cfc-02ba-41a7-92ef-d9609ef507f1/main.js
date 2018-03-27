margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
};

var width = 960,
    height = 500

var tooltip;

var projection = d3.geoConicConformal()
    .rotate([98, 0])
    .center([0, 60])
    .parallels([-10, 85.5])
    .scale(1400)

var svg = d3.select(".map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var formatComma = d3.format(",")

var path = d3.geoPath()
    .projection(projection);

var line_path = d3.geoPath()
    .projection(null);

var radius = d3.scaleSqrt()
    .domain([0, 3600])
    .range([0, 50]);

var line_size = d3.scaleLinear()
    .domain([32, 14103])
    .range([2, 30])


var migration, test, net;

var line_data = [];




g = svg.append("g")

var defs = svg.append('svg:defs');
defs.append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 0)
    .attr('refY', 0)
    .attr('stroke', 'none')
    .attr('markerWidth', 9)
    .attr('markerHeight', 3)
    .attr("markerUnits", "strokeWidth")
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#3f51b5');

var defs = svg.append('svg:defs');
defs.append('svg:marker')
    .attr('id', 'end-arrow-neg')
    .attr('stroke', 'none')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 0)
    .attr('refY', 0)
    .attr('markerWidth', 9)
    .attr('markerHeight', 3)
    .attr("markerUnits", "strokeWidth")
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#D32F2F');

var prov_lookup = {
    'N.L.': 'Newfoundland and Labrador',
    'P.E.I.': 'Prince Edward Island',
    'N.S.': 'Nova Scotia',
    'N.B.': 'New Brunswick',
    'Que.': 'Quebec',
    'Ont.': 'Ontario',
    'Man.': 'Manitoba',
    'Sask.': 'Saskatchewan',
    'Alta.': 'Alberta',
    'B.C.': 'British Columbia',
    'Y.T.': 'Yukon',
    'N.W.T.': 'Northwest Territories',
    'Nvt.': 'Nunavut'
};
// https://stackoverflow.com/questions/11121465/scaling-an-arrowhead-on-a-d3-force-layout-link-marker

// svg.append("defs").append("pattern")
//     .attr('id','myPattern')
//     .attr('markerWidth', 16)
//     .attr('markerHeight', 16)
//     .attr('patternUnits',"userSpaceOnUse")
//     .append('path')
//     .attr('fill','none')
//     .attr('stroke','#335553')
//     .attr('stroke-width','3') 
//     .attr('d','M-5,0 L-15,15 L15,0 L-15,-15 Z');


function highlight(highlightData) {
    // console.log(highlightData)
         if (highlightData.properties.PRENAME != "British Columbia") {
                curr_net = migration.filter(function(j) {

                    return prov_lookup[j.Province] == highlightData.properties.PRENAME
                })
                // console.log(curr_net)
                if (curr_net[0].Province != 'B.C.') {

                    if(curr_net[0].net > 0){
                        svg.append("text")
                        .attr("x", width - 204)
                        .attr("y", 100.5)
                        .attr("dy", "0.32em")
                        .attr("class", 'lab')
                        .attr("fill",'#3f51b5')
                        .text(highlightData.properties.PRENAME);

                    svg.append("text")
                        .attr("x", width - 204)
                        .attr("y", 120.5)
                        .attr("dy", "0.32em")
                        .attr('class', 'lab')
                        .attr("fill",'#3f51b5')
                        .text('Net change: ' + (curr_net[0].net))
                    }else{

                    svg.append("text")
                        .attr("x", width - 204)
                        .attr("y", 100.5)
                        .attr("dy", "0.32em")
                        .attr("class", 'lab')
                        .attr("fill",'#D32F2F')
                        .text(highlightData.properties.PRENAME);

                    svg.append("text")
                        .attr("x", width - 204)
                        .attr("y", 120.5)
                        .attr("dy", "0.32em")
                        .attr("fill",'#D32F2F')
                        .attr('class', 'lab')
                        .text('Net change: ' + (curr_net[0].net))
                    }



                    }
                }
    var highlightLine = highlightData.properties.PRENAME;
    if (highlightLine != 'British Columbia') {
        svg.selectAll('.route')
            .classed('subdued', function(d) {
                // console.log(d.Province)
                return prov_lookup[d.Province] != highlightLine;
            })
    }

}

function highlightLines(highlightData) {
    // console.log(highlightData)

    var highlightLine = highlightData.Province;
    svg.selectAll('.route')
        .classed('subdued', function(d) {
            // console.log(d.Province)
            return d.Province != highlightLine;
        })
}

function unHighlight() {
    d3.selectAll(".lab").remove();
    tooltip.style("display", "none");

    d3.selectAll('.selected')
        .classed('selected', false);

    d3.selectAll('.subdued')
        .classed('subdued', false);
}



// function getData(currYear, currQ){


// }
var legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(['net gain', 'net loss'])
    .enter().append("g")
    .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
    });

legend.append("rect")
    .attr("x", width - 50)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", function(d, i) {
        // console.log(d)
        if (d == 'net gain') {
            return "#3f51b5";
        } else {
            return "#D32F2F";
        }
    })

legend.append("text")
    .attr("x", width - 54)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) {
        return d;
    });

d3.json("can_no_projs.json", function(error, canada) {
    if (error) throw error;

    map = g.append("g")
        .attr("id", "provinces")
        .selectAll("path")
        .data(topojson.feature(canada, canada.objects.cangeo).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", "prov-borders")
        .attr('fill', function(d) {
            if (d.properties.PRENAME == 'British Columbia') {
                return '#f9c932'
            }
        }).on('mouseover', highlight)
        .on('mouseout',unHighlight);

    var tot;
    var int, yearMenu, bc_data;

    // var currYear = '2017'
    // var currQ = '4'
    var international;

    // var data = {
    //     resource_id: '2aa0f35f-8db4-46f7-98ef-8913b7c06dca', // the resource id
    //     limit: 5000, // get 5 results
    //     filters: '{"Year":' + currYear + ',"Quarter":"' + currQ + '"}'
    // };
    // $.ajax({
    //     url: 'https://cat.data.gov.bc.ca/api/3/action/datastore_search',
    //     data: data,
    //     dataType: 'json',
    //     success: function(data) {
    //         international = data.result.records;
    //         // console.log(international)
    //          bc_data = []

    //         var data = {
    //             resource_id: '8bc04574-3b36-4d22-9b36-5a177ba0bcc3', // the resource id
    //             limit: 5000,
    //             filters: '{"Year":' + currYear + ',"Quarter":"' + currQ + '"}'
    //         };
    //         $.ajax({
    //             url: 'https://cat.data.gov.bc.ca/api/3/action/datastore_search',
    //             data: data,
    //             dataType: 'json',
    //             success: function(data) {
    //                 // console.log(data.result.records.filter(function(d) {
    //                 //     return d.Origin == "B.C. - C.-B.";
    //                 // }))
    //                 // bc = data.result.records.filter(function(d) {
    //                 //     return d.Origin == "B.C.";
    //                 // })
    //                 // console.log(bc)
    //                 // if(d.Origin = "B.C. - C.-B."){
    //                 //     Province:
    //                 // }
    //                 // test = data.result.records)
    //                 // console.log(data.result.records)
    //                 data.result.records.forEach(d =>
    //                 {bc=data.result.records.filter(j => {
    //                     return j.Origin == "B.C." && j.Year == d.Year && j.Quarter == d.Quarter})
    //                     bc_data.push({
    //                         Province: d.Origin,
    //                         Origin: d["B.C."],
    //                         Destination: bc[0][d.Origin],
    //                         Year: d.Year,
    //                         Quarter: d.Quarter
    //                     })
    //                 }
    //                 )

    var yr = [];
    for (var i = 1971; i <= 2017; i++) {
        yr.push(i);
    }

    function getQuarter(d) {
        d = d || new Date(); // If no date supplied, use today
        var q = [4, 1, 2, 3];
        return q[Math.floor(d.getMonth() / 3)] - 1;
    }

    // test = bc_data
    // console.log(getQuarter())
    // var yr = d3.map(bc_data, function(d) {
    //     return d.Year;
    // }).keys()
    // var Qrt = d3.map(bc_data, function(d) {
    //     return d.Quarter;
    // }).keys()
    // console.log(yr[yr.length - 1])
    //    yr.forEach(function(d){
    //     var option = $('<option />').text(d);

    //     $("#year").append(option);
    // })     
    yearMenu = d3.select("#yearDropdown");
    yearMenu
        // .append("select")
        // .attr("id", "locationMenu")
        .selectAll("option")
        .data(yr)
        .enter()
        .append("option")
        .attr("value", function(d, i) {
            // console.log(d)
            return d;
        })
        .text(function(d) {
            return d;
        })
        .property("selected", function(d) {
            return yr[yr.length - 1];
        });

    var Qrt = [1, 2, 3, 4]
    QMenu = d3.select("#QDropdown");
    // console.log(Qrt)
    default_option = getQuarter()
    Qrt = Qrt.sort()
    // console.log(Qrt)
    QMenu
        // .append("select")
        // .attr("id", "locationMenu")
        .selectAll("option")
        .data(Qrt)
        .enter()
        .append("option")
        .attr("value", function(d, i) {
            // console.log(d)
            return d;
        })
        .text(function(d) {
            return d;
        })
        .property("selected", function(d) {
            return d == default_option;
        });
    // migration = alldata.filter(function(d) {
    //     return d.time_period == currYear;
    // })
    currYear = $('#yearDropdown').val();
    currQ = $('#QDropdown').val();
    console.log(currQ)
    // console.log(bc_data)

    // International data
    var data = {
        resource_id: 'c99d63f6-5ec4-4ac0-9c07-c0352f2f1928', // the resource id
        limit: 5000, // get 5 results
        filters: '{"year":' + currYear + ',"quarter":"' +'Q' +currQ + '"}'
    };
    $.ajax({
        url: 'https://catalogue.data.gov.bc.ca/api/3/action/datastore_search',
        data: data,
        dataType: 'json',
        success: function(data) {
            international = data.result.records;
            console.log(international)
            var bc_data = [];
            // var international;

            // Provincial data
            var data = {
                resource_id: '95579825-bfa2-4cab-90fa-196e0ecc8626', // the resource id
                limit: 5000,
                filters: '{"Year":' + currYear + ',"Quarter":"' + currQ + '"}'
            };
            $.ajax({
                url: 'https://catalogue.data.gov.bc.ca/api/3/action/datastore_search',
                data: data,
                dataType: 'json',
                success: function(data) {
                    console.log(data)

                    data.result.records.forEach(d => {
                        bc = data.result.records.filter(j => {
                            return j.Origin == "B.C." && j.Year == d.Year && j.Quarter == d.Quarter
                        })
                        bc_data.push({
                            Province: d.Origin,
                            Origin: d["B.C."],
                            Destination: bc[0][d.Origin],
                            Year: d.Year,
                            Quarter: d.Quarter
                        })
                    })
                    migration = bc_data.filter(function(d) {
                        return d.Year == currYear && d.Quarter == currQ && d.Province != "B.C.";
                    })
                    int = international.filter(function(d) {
                        return d.year == currYear && d.quarter == 'Q'+currQ;
                    })
                    // console.log(int)
                    // migration.net_int = int[0]['Total net migration']
                    migration.push({
                        Province: 'International',
                        Origin: Number(int[0]['Immigrants'])+Number(int[0]['Net_non_permanent_residents']),
                        Destination: Number(int[0]['Emigrants'])+Number(int[0]['Net_temporary_emigrants'])-Number(int[0]['Returning_emigrants']),
                        Quarter: currQ,
                        Year: currYear
                        // net1: int[0]['Total net migration']
                    })
                    update(migration, currYear, currQ);

                }
            })
        }
    })


    //             }
    //         });
    //     }
    // });

    function getData(currYear, currQ) {
        var data = {
            resource_id: 'c99d63f6-5ec4-4ac0-9c07-c0352f2f1928', // the resource id
            limit: 5000, // get 5 results
            filters: '{"year":' + currYear + ',"quarter":"' +'Q' +currQ + '"}'
        };
        $.ajax({
            url: 'https://catalogue.data.gov.bc.ca/api/3/action/datastore_search',
            data: data,
            dataType: 'json',
            success: function(data) {
                international = data.result.records;
                // console.log(international)
                var bc_data = [];
                var international;

                var data = {
                    resource_id: '95579825-bfa2-4cab-90fa-196e0ecc8626', // the resource id
                    limit: 5000,
                    filters: '{"Year":' + currYear + ',"Quarter":"' + currQ + '"}'
                };
                $.ajax({
                    url: 'https://catalogue.data.gov.bc.ca/api/3/action/datastore_search',
                    data: data,
                    dataType: 'json',
                    success: function(data) {

                        data.result.records.forEach(d => {
                            bc = data.result.records.filter(j => {
                                return j.Origin == "B.C." && j.Year == d.Year && j.Quarter == d.Quarter
                            })
                            bc_data.push({
                                Province: d.Origin,
                                Origin: d["B.C."],
                                Destination: bc[0][d.Origin],
                                Year: d.Year,
                                Quarter: d.Quarter
                            })
                        })
                        migration = bc_data.filter(function(d) {
                            return d.Year == currYear && d.Quarter == currQ && d.Province != "B.C.";
                        })
                        int = international.filter(function(d) {
                        return d.year == currYear && d.quarter == 'Q'+currQ;
                        })
                        // console.log(int)
                        // migration.net_int = int[0]['Total net migration']
                        migration.push({
                            Province: 'International',
                            Origin: Number(int[0]['Immigrants'])+Number(int[0]['Net_non_permanent_residents']),
                        Destination: Number(int[0]['Emigrants'])+Number(int[0]['Net_temporary_emigrants'])-Number(int[0]['Returning_emigrants']),
                            Quarter: currQ,
                            Year: currYear
                            // net1: int[0]['Total net migration']
                        })
                        update(migration, currYear, currQ);

                    }
                })
            }
        })
    }
    // d3.csv("Quarterly_2017.csv", function(error, dat) {

    // })

        $('#QDropdown').on('change', function(data) {
            currQ = $('#QDropdown').val();
            console.log(currQ)
            bc_data = getData(currYear, currQ)
            update(migration, currYear, currQ)
        })

        $('#yearDropdown').on('change', function(data) {
            currYear = $('#yearDropdown').val();
            console.log(currYear)
            bc_data = getData(currYear, currQ)
            // update(migration, currYear, currQ)
        })

    function update(migration, currYear, currQ) {
        // migration = migration.filter(function(d) {
        //     return d.Year == currYear && d.Quarter == currQ && d.Province != "B.C.";
        // })
        // int = international.filter(function(d) {
        //     return d.Year == currYear && d.Quarter == currQ;
        // })
        // // migration.net_int = int[0]['Total net migration']
        // migration.push({
        //     Province: 'International',
        //     Origin: int[0]['Total immigration'],
        //     Destination: int[0]['Total emigration'],
        //     Quarter: currQ,
        //     Year: currYear
        //     // net1: int[0]['Total net migration']
        // })
        console.log('here')
        // console.log(int[0]['Total net migration'])

        d3.selectAll('.route').remove()
        d3.selectAll('.annotation-group').remove()
        $('#orders-table').bootstrapTable("destroy");
        // d3.selectAll('.bootstrap-table').remove()
        int = 0;
        tot = 0;
        migration.forEach(function(d) {

            d.net = Number(d.Origin) - Number(d.Destination)
            if (d.Province != 'International') {
                tot += d['Origin'] - d['Destination']
            } else {
                int = d['Origin'] - d['Destination']
            }

        })
        // console.log(migration)

        flow_dat = topojson.feature(canada, canada.objects.cangeo).features
        flow_dat.forEach(function(d) {
            // define where arrow start/ends in other provinces
            cen = line_path.centroid(d)
            if (d.properties.PRENAME == 'Alberta') {
                cen[0] += 1
                cen[1] = cen[1] - 3.2
            }
            if (d.properties.PRENAME == 'Saskatchewan') {
                cen[1] = cen[1] - 1.2
                console.log(cen)
            }
            if (d.properties.PRENAME == 'Manitoba') {
                cen[1] = cen[1] - 2.2
                console.log(cen)
            }
            if (d.properties.PRENAME == 'New Brunswick') {
                cen[1] = cen[1] - 1
            }
            if (d.properties.PRENAME == 'Nunavut') {
                cen[1] = cen[1] - 5
                cen[0] += -6
            }

            // console.log(line_path.centroid(d))
            line_data.push({
                prov: d.properties,
                coords: cen
            })
        })
        // console.log(flow_dat)
        // currYear = $('#yearDropdown').val();
        // $(document).ready(function() {





        // yearMenu.on('change', function() {
        //     var currYear = d3.select(this)
        //         .select('select')
        //         .property('value');
        //     console.log(currYear)
        //     update(bc_data,international, currYear, currQ)
        // })


        // var tooltip = d3.select("body").append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);
        tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        route_path = g.selectAll(".route")
            // .data(migration.filter(function(d) {
            //     return d.Province != 'International';
            // }))
            .data(migration)
            .enter()
            .append("path")
            .attr("class", "route")
            .attr('d', function(d, i) {
                // console.log(d)
                line_data.forEach(function(j) {
                    // console.log(j.prov.PRENAME)
                    if (j.prov.PRENAME == prov_lookup[d.Province]) {
                        d.coords = j.coords
                    }
                    if (d.Province == 'International') {
                        d.coords = [-139.75635246400601, 53.75809690349844]
                    }
                })
                // console.log(d)
                d.net = Number(d.Origin) - Number(d.Destination)
                // define the location for arrow to start/end in bc here
                bc_coords = [-122.75635246400601, 54.75809690349844];
                if (prov_lookup[d.Province] == 'Nunavut') {
                    bc_coords = [-122.75635246400601, 57.75809690349844]
                } else if (prov_lookup[d.Province] == 'Alberta') {
                    bc_coords = [-121.245605, 52.263570]
                } else if (prov_lookup[d.Province] == 'Yukon') {
                    bc_coords = [-130.417969, 59.562099]
                } else if (prov_lookup[d.Province] == 'Saskatchewan') {
                    bc_coords = [-121.394922, 53.469826]
                } else if (prov_lookup[d.Province] == 'Manitoba') {
                    bc_coords = [-121.146484, 54.262016]
                } else if (prov_lookup[d.Province] == 'Ontario') {
                    bc_coords = [-121.146484, 54.462016]
                } else if (prov_lookup[d.Province] == 'Northwest Territories') {
                    bc_coords = [-122.167969, 59.462099]
                } else if (prov_lookup[d.Province] == 'Newfoundland and Labrador') {
                    bc_coords = [-122.146484, 56.386543]
                } else if (d.Province == 'International') {
                    bc_coords = [-138.346484, 53.76543]
                } else if (prov_lookup[d.Province] == 'Quebec') {
                    bc_coords = [-122.046484, 55.586543]
                }


                if (d.net < 0) {

                    return path({
                        type: "LineString",
                        coordinates: [
                            bc_coords,
                            // [-122.75635246400601, 54.75809690349844], // BC
                            d.coords
                        ]
                    })
                    // }
                } else {
                    // if (d.Province == 'Alberta') {
                    return path({
                        type: "LineString",
                        coordinates: [
                            d.coords, bc_coords // BC

                        ]
                    })
                    // }

                }

            })
            // .style("stroke-dasharray", ("5, 3"))
            .attr("stroke", function(d, i) {
                // console.log(d)
                if (Number(d.Origin) - Number(d.Destination) > 0) {
                    return "#3f51b5";
                } else {
                    return "#D32F2F";
                }
            })
            .style("stroke-width", function(d) {
                // console.log(Math.abs((Number(d.Origin) - Number(d.Destination))))
                return line_size(Math.abs((Number(d.Origin) - Number(d.Destination))));
            }).on('mouseover', highlightLines)
            .on('mouseout', unHighlight)
        // .style("opacity", .8)

        // .on("mouseout", function(d) {
        //     tooltip.style("display", "none");
        // })

        // .on("mousemove", function(d) {
        //       tooltip
        //           .style("left", d3.event.pageX - 50 + "px")
        //           .style("top", d3.event.pageY - 70 + "px")
        //           .style("display", "inline")
        //           .style("opacity", 1)
        //           .html(d.Province + "<br>" + 'Net change: ' + (d.net))
        //           // .html('Net: ' + (d.net) + "<br>" + 'Loss: ' + (d.Destination));
        //   })
        // .raise()

        // map.on("mouseover", function(d) {
        //     if (d.properties.PRENAME != "British Columbia"){
        //         curr_net = migration.filter(function(j) {

        //         return prov_lookup[j.Province] == d.properties.PRENAME
        //     })
        //     // console.log(curr_net)
        //     if (curr_net[0].Province != 'B.C.') {

        //    svg.append("text")
        //             .attr("x", width - 204)
        //             .attr("y", 100.5)
        //             .attr("dy", "0.32em")
        //             .attr("class",'lab')
        //             .text(d.properties.PRENAME );

        //   svg.append("text")
        //             .attr("x", width - 204)
        //             .attr("y", 120.5)
        //             .attr("dy", "0.32em")
        //             .attr('class', 'lab')
        //             .text('Net change: ' + (curr_net[0].net))

        //             // .attr("x", (width / 4))   ;

        //     }
        //     }
        //     // .html('Net: ' + (d.net) + "<br>" + 'Loss: ' + (d.Destination));
        // }).on("mouseout",function(d){
        //     // tooltip.style("display", "none");
        //     d3.selectAll(".lab").remove()
        // })


        function pointAtLength(path, l) {
            var xy = path.getPointAtLength(l);
            return [xy.x, xy.y];

        }

        function angleAtLength(path, l) {

            var a = pointAtLength(path, Math.max(l - 0.01, 0)), // this could be slightly negative
                b = pointAtLength(path, l + 0.01); // browsers cap at total length

            return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;

        }
        // add arrows!
        route_path.each(function(j) {
            // console.log(j)
            pa = this;
            totalLength = this.getTotalLength();
            // console.log(totalLength);

            g.selectAll("arrow")
                .data([.99])
                .enter()
                .append("g")
                .attr("transform", d => {
                    var p = pointAtLength(pa, pa.getTotalLength() * d);
                    // if(j.net >0){
                    // var p = pointAtLength(pa, pa.getTotalLength() * .75);
                    // }

                    return "translate(" + p + ") rotate( " + angleAtLength(pa, pa.getTotalLength() * d) + ")";
                });

            // .append("path")
            // .attr('d', 'M0,-5L10,0L0,5')
            // .style('fill', function(d) {
            //     // console.log(d)
            //     if (j.net > 0) {
            //         return "#3f51b5";
            //     } else {
            //         return "#D32F2F";
            //     }
            // })
            // .style("opacity", .9)
            // .attr('id', 'arrow')
            // .raise()
            // .style('z-index',-1);

        });

        var markers = route_path.attr("marker-end", function(d) {
            // console.log(d)
            if (d.net > 0) {
                return "url(#end-arrow)"
            } else {
                return "url(#end-arrow-neg)"
            }
        });


        // var markers1 = route_path.attr("marker1", function(d){
        //     // console.log(d)
        //     return "url(#arrow)"})

        // console.log(migration)
        // migration.push({
        //     Province: "British Columbia",
        //     Destination: 0,
        //     Origin: tot,
        //     coords: [-124.75635246400601, 54.75809690349844]
        // })


        // Markers = g.selectAll("circle")
        //     .data(migration.filter(function(d) {
        //         return d.Province == 'British Columbia';
        //     }));

        // var elemEnter = Markers.enter()
        //     .append('g');

        // var circle = elemEnter.append("circle")
        //     .attr("class", "bubble")
        //     .attr("cx", function(d, i) {
        //         // if (d.Province == 'International') {
        //         //     d.coords = [-128.75635246400601, 42.75809690349844]
        //         // }
        //         return projection(d.coords)[0]
        //     })
        //     .attr("cy", function(d, i) {
        //         // console.log(d)
        //         // console.log(line_data[i])
        //         return projection(d.coords)[1]
        //     })
        //     .attr("r", function(d) {
        //         d.net = Number(d.Origin) - Number(d.Destination)
        //         // console.log(d.net)
        //         if (prov_lookup[d.Province] == 'British Columbia') {

        //             return radius(Math.abs(d.net));
        //         }
        //         // migration.forEach(function(a) {
        //         // if (a.Province == d.properties.PRENAME) {

        //     })
        //     .attr("fill", "#3f51b5")
        //     .style('z-index', 1000000)
        //     .style("z-index", "")
        //     .on("mousemove", function(d) {
        //         console.log(d)
        //         tooltip
        //             .style("left", d3.event.pageX - 50 + "px")
        //             .style("top", d3.event.pageY - 70 + "px")
        //             .style("display", "inline")
        //             .style("opacity", 1)
        //             .html('InFlow: ' + (d.Origin) + "<br>" + 'OutFlow: ' + (d.Destination));
        //     })
        //     .on("mouseout", function(d) {
        //         tooltip.style("display", "none");
        //     })

        // elemEnter.append('text')
        //     .attr('id', 'label')
        //     .attr("dx", function(d, i) {
        //         // if (d.Province == 'International') {
        //         //     d.coords = [-128.75635246400601, 42.75809690349844]
        //         // }
        //         return projection(d.coords)[0]
        //     })
        //     .attr("dy", function(d, i) {
        //         // console.log(d)
        //         // console.log(line_data[i])
        //         return projection(d.coords)[1]
        //     })
        //     .style("text-anchor", "middle")
        //     .style("fill",'white')

        //     .text(function(d) {
        //         console.log(d)
        //         return '+ ' +d.net
        //     });
        // .raise()
        // .raise()

        // annotation
        const type = d3.annotationCallout

        const annotations = [{
                type: d3.annotationCustomType(
                    d3.annotationCallout, {
                        "className": "custom",
                        "note": {
                            "lineType": "horizontal",
                            "align": "middle"
                        }
                    }),
                note: {
                    label: "net migration to BC from outside Canada",
                    title: formatComma(int)
                },
                //can use x, y directly instead of data
                x: 118,
                y: 250.02,
                dy: 157,
                dx: 42
            },
            {
                note: {
                    label: "net migration to BC from other provinces",
                    title: formatComma(tot)
                },
                //can use x, y directly instead of data
                x: 245,
                y: 343.02,
                dy: 87,
                dx: 23
            }
        ]

        const parseTime = d3.timeParse("%d-%b-%y")
        const timeFormat = d3.timeFormat("%d-%b-%y")

        //Skipping setting domains for sake of example
        const x = d3.scaleTime().range([0, 800])
        const y = d3.scaleLinear().range([300, 0])

        const makeAnnotations = d3.annotation()
            // .editMode(true)
            .type(type)
            //accessors & accessorsInverse not needed
            //if using x, y in annotations JSON
            // .accessors({
            //   x: d => x(parseTime(d.date)),
            //   y: d => y(d.close)
            // })
            // .accessorsInverse({
            //    date: d => timeFormat(x.invert(d.x)),
            //    close: d => y.invert(d.y)
            // })
            .annotations(annotations)

        d3.select("svg")
            .append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations)



        maketable(migration);
        // d3.selectAll('route').remove()

    }




})