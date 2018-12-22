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

        var chartWidth = 840;
        var chartHeight = 420;

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

        var rgbScale = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([0, 255]);

        var chart = d3.select('.chart')
            .attr('width', chartWidth)
            .attr('height', chartHeight);

        var dot = chart.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
                return "translate(" + xScale(new Date(Date.parse(d.date))) + ", " + yScale(d.actual_mean_temp) + ')';
            });

        dot.append("rect")
            .attr("width", 2)
            .attr("height", 2)
            .attr('fill', function (d, i) {
                return "rgb(0" + ',' + rgbScale(d.actual_mean_temp) + ', 255)';
            });

        setTimeout(function () {
            var dot = chart.selectAll('g')
                .transition()
                .duration(2000)
                .ease(d3.easeCubic)
                .attr('transform', function (d, i) {
                    return "translate(" + (chartWidth - xScale(new Date(Date.parse(d.date)))) + ", " + yScale(d.actual_mean_temp) + ')';
                })

        }, 3000)
    });

});


