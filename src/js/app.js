require(["d3"], function (d3) {

    var minValue = -1;
    var maxValue = -1;

    d3.csv("./assets/KCLT.csv", function (row, b, c, d) {
        if (minValue == -1 || row.actual_mean_temp < minValue) {
            minValue = row.actual_mean_temp;
        }
        if (maxValue == -1 || row.actual_mean_temp > maxValue) {
            maxValue = row.actual_mean_temp;
        }
        return row;
    }).then(function (data) {

        var margin = { top: 20, right: 20, bottom: 40, left: 40 };
        var chartWidth = 840 - margin.left - margin.right;
        var chartHeight = 420 - margin.top - margin.bottom;

        var minDate = new Date(Date.parse(data[0].date));
        var maxDate = new Date(Date.parse(data[data.length - 1].date));
        // define the x (horizontal) scale
        var xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, chartWidth]);


        //define the y (vertical) scale
        var yScale = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([chartHeight, 0]);

        var redScale = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([24, 200]);
        var greenScale = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([80, 200]);
        var blueScale = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([200, 250]);

        var chart = d3.select('.chart')
            .attr("width", chartWidth + margin.left + margin.right)
            .attr("height", chartHeight + margin.top + margin.bottom);

        var xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%B"));
        var yAxis = d3.axisLeft(yScale);

        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + margin.left + "," + (chartHeight + margin.top + 20) + ")")
            .call(xAxis);

        chart.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (margin.left - 10) + "," + margin.top + ")")
            .call(yAxis);

        var innerChart = chart.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dot = innerChart.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr("class", "point")
            .attr('transform', function (d, i) {
                return "translate(" + xScale(new Date(Date.parse(d.date))) + ", " + yScale(d.actual_mean_temp) + ')';
            });

        dot.append("rect")
            .attr("width", 2)
            .attr("height", 2)
            .attr('fill', function (d, i) {
                return "rgb(" + redScale(d.actual_mean_temp) + ',' + greenScale(d.actual_mean_temp) + ', ' + blueScale(d.actual_mean_temp) + ')';
            });

        var animToggle = true;

        chart.on('click', function () {
            if (animToggle) {
                xScale = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .range([chartWidth, 0]);
            } else {
                xScale = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .range([0, chartWidth]);
            }

            xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%B"));
            chart.select('.x.axis')
                .transition()
                .duration(0)
                .delay(2000)
                .call(xAxis);

            var dot = innerChart.selectAll('g.point')
                .transition()
                .duration(2000)
                .ease(d3.easeCubic)
                .attr('transform', function (d, i) {
                    var x = xScale(new Date(Date.parse(d.date)));
                    return "translate(" + x + ", " + yScale(d.actual_mean_temp) + ')';
                });
            animToggle = !animToggle;
        })
    });

});


