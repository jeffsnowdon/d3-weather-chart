'use strict';

var CHART_WIDTH = 840;
var CHART_HEIGHT = 420;
var CHART_MARGIN = { top: 20, right: 20, bottom: 40, left: 40 };
var DATA_POINT_SIZE = { width: 2, height: 2 };

define(["d3", "lodash"], function (d3, _) {

    // load the data from file
    d3.csv("./assets/KCLT.csv", function (row) {
        // make no modifications to the data format
        return row;
    }).then(function (data) {

        // determine sizing
        var chartDimensions = produceChartDimensions(CHART_WIDTH, CHART_HEIGHT, CHART_MARGIN);
        var chartMargin = CHART_MARGIN;

        // determine bounds
        var valueBound = determineValueBound(data);
        var dateBound = determineDateBound(data);

        // define the horizontal scale
        var xScale = d3.scaleTime()
            .domain([dateBound.min, dateBound.max])
            .range([0, chartDimensions.width]);

        // define the vertical scale
        var yScale = d3.scaleLinear()
            .domain([valueBound.min, valueBound.max])
            .range([chartDimensions.height, 0]);

        // define the color scales
        var rgbScales = produceRgbScales(valueBound);

        // render the chart
        var chart = renderChart(chartDimensions, chartMargin, xScale, yScale);
        var innerChart = renderInnerChart(chart, chartMargin);
        renderPoints(innerChart, data, xScale, yScale, rgbScales);

        // attach listener
        addAnimationEventListener(chart, innerChart, chartDimensions, xScale, yScale);
    });

    /**
     * Render the chart
     * @param {Object} chartDimensions width and height of the chart
     * @param {Object} chartMargin margin size
     * @param {Object} xScale x scale
     * @param {Object} yScale y scale
     */
    function renderChart(chartDimensions, chartMargin, xScale, yScale) {

        var chart = d3.select('.chart');

        chart.attr("width", chartDimensions.width + chartMargin.left + chartMargin.right)
            .attr("height", chartDimensions.height + chartMargin.top + chartMargin.bottom);

        var xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%B"));
        var yAxis = d3.axisLeft(yScale);

        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + chartMargin.left + "," + (chartDimensions.height + chartMargin.top + 20) + ")")
            .call(xAxis);

        chart.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (chartMargin.left - 10) + "," + chartMargin.top + ")")
            .call(yAxis);

        return chart;
    }

    /**
     * Render inner chart
     * @param {Object} chart selector for chart to contain the inner chart
     * @param {Object} chartMargin margin size
     */
    function renderInnerChart(chart, chartMargin) {
        return chart.append("g")
            .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");
    }

    /**
     * Render the data points
     * @param {Object} innerChart selector for inner chart to contain the data points
     * @param {Object} data data source
     * @param {Object} xScale x scale
     * @param {Object} yScale y scale
     * @param {Object} rgbScales red, green, and blue scales wrapper
     */
    function renderPoints(innerChart, data, xScale, yScale, rgbScales) {
        var dot = innerChart.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr("class", "point")
            .attr('transform', function (d, i) {
                return "translate(" + xScale(new Date(Date.parse(d.date))) + ", " + yScale(d.actual_mean_temp) + ')';
            });

        dot.append("rect")
            .attr("width", DATA_POINT_SIZE.width)
            .attr("height", DATA_POINT_SIZE.height)
            .attr('fill', function (d, i) {
                return "rgb(" + rgbScales.r(d.actual_mean_temp) + ','
                    + rgbScales.g(d.actual_mean_temp) + ', '
                    + rgbScales.b(d.actual_mean_temp) + ')';
            });
    }

    /**
     * Get the min and max value bounds from the data source
     * @param {Object} data to determine bound from
     * @return {Object} value bounds
     */
    function determineValueBound(data) {
        var minValue = -1;
        var maxValue = -1;
        _.each(data, function (row) {
            if (minValue == -1 || row.actual_mean_temp < minValue)
                minValue = row.actual_mean_temp;
            if (maxValue == -1 || row.actual_mean_temp > maxValue)
                maxValue = row.actual_mean_temp;
        })
        return {
            min: minValue,
            max: maxValue
        }
    }

    /**
     * Get the min and max date bounds from the data source
     * @param {Object} data to determine bounds from
     * @return {Object} date bounds
     */
    function determineDateBound(data) {
        return {
            min: new Date(Date.parse(data[0].date)),
            max: new Date(Date.parse(data[data.length - 1].date))
        }
    }

    /**
     * Calculate the total width and height of the chart
     * @param {Number} width chart width
     * @param {Number} height chart height
     * @param {Object} chartMargin chart margins
     * @return {Object} calculated dimensions
     */
    function produceChartDimensions(width, height, chartMargin) {
        return {
            width: width - chartMargin.left - chartMargin.right,
            height: height - chartMargin.top - chartMargin.bottom
        }
    }

    /**
     * Produce red, green, and blue scales for the given domain
     * @param {Object} domain domain to use in scale initialization
     * @return {Object} wrapper object container red, green, and blue scales
     */
    function produceRgbScales(domain) {
        var redScale = d3.scaleLinear()
            .domain([domain.min, domain.max])
            .range([24, 200]);
        var greenScale = d3.scaleLinear()
            .domain([domain.min, domain.max])
            .range([80, 200]);
        var blueScale = d3.scaleLinear()
            .domain([domain.min, domain.max])
            .range([200, 250]);
        return {
            r: redScale,
            g: greenScale,
            b: blueScale
        }
    }

    /**
     * Add click event listener on the chart which executes an animation and x scale inversion
     * @param {Object} chart chart selector
     * @param {Object} innerChart inner chart selector
     * @param {Object} chartDimensions chart size
     * @param {Object} xScale x scale
     * @param {Object} yScale y scale
     */
    function addAnimationEventListener(chart, innerChart, chartDimensions, xScale, yScale) {
        var animToggle = true;

        chart.on('click', function () {
            if (animToggle)
                xScale.range([chartDimensions.width, 0]);
            else
                xScale.range([0, chartDimensions.width]);

            var oneTime = true;
            var dot = innerChart.selectAll('g.point')
                .transition()
                .duration(2000)
                .ease(d3.easeCubic)
                .attr('transform', function (d, i) {
                    var x = xScale(new Date(Date.parse(d.date)));
                    return "translate(" + x + ", " + yScale(d.actual_mean_temp) + ')';
                })
                .on('end', function () {
                    if (oneTime) {
                        var xAxis = d3.axisBottom(xScale)
                            .tickFormat(d3.timeFormat("%B"));
                        chart.select('.x.axis')
                            .transition()
                            .duration(0)
                            .call(xAxis);
                        oneTime = false;
                    }
                })
            animToggle = !animToggle;
        })
    }

});


