

// helper function to calculate price of our portfolio based on historical prices for each instrument
function calculateDataForStock(proportion_data, historical_data) {
    var result = [];
    var hist = historical_data[proportion_data[0]['ticker']];

    for (var i = 0; i < hist.length; i++) {
        var sum = 0;
        for (var j = 0; j < proportion_data.length; j++) {
            sum = sum + (parseFloat(proportion_data[j]['amount']) * parseFloat(historical_data[proportion_data[j]['ticker']][i]['value']))
        }
        result.push({'date': hist[i].date, 'value': sum});
    }
    return result;
}

// helper function to recalculate indexes
function calculateIndexPrices(data, initial_sum) {
    var amount = parseFloat(initial_sum / data[data.length - 1].value).toFixed(2);
    var result = [];
    for (var i = 0; i < data.length; i++) {
        result.push({'date': data[i].date, 'value': data[i].value * amount});
    }
    return result
}

function drawDonutChart(container_id) {
    var chart = anychart.pie();
    chart.interactivity('single');
    chart.legend(false);
    chart.radius('40%');
    chart.innerRadius('60%');
    chart.padding(0);
    chart.margin(0);
    chart.explode(0);
    chart.labels(false);
    var dataset = anychart.data.set();
    chart.data(dataset);
    var stage = anychart.graphics.create(container_id);
    chart.container(stage);
    var path = stage.path().stroke(null).zIndex(10);
    chart.draw();
    return {'chart': chart, 'path': path, 'dataset': dataset};
}

function drawStockChart(container_id) {
    var stock = anychart.stock();
    var plot = stock.plot();
    plot.yAxis(1).orientation('right');
    stock.padding()
        .top(0)
        .right(80)
        .left(70);

    stock.container(container_id);

    var mainTable = anychart.data.table('date');
    var mainMapping = mainTable.mapAs({'value': {'column': 'value', 'type': 'close'}});
    plot.line(mainMapping).name('Portfolio').stroke('2 #1976d2');

    var SP500Table = anychart.data.table('date');
    var SP500Mapping = SP500Table.mapAs({'value': {'column': 'value', 'type': 'close'}});
    var SP500Series = plot.line(SP500Mapping).name('S&P 500').stroke('1 #ef6c00');

    var DowTable = anychart.data.table('date');
    var DowMapping = DowTable.mapAs({'value': {'column': 'value', 'type': 'close'}});
    var DowSeries = plot.line(DowMapping).name('Dow').stroke('1 #ffa000');

    var NasdaqTable = anychart.data.table('date');
    var NasdaqMapping = NasdaqTable.mapAs({'value': {'column': 'value', 'type': 'close'}});
    var NasdaqSeries = plot.line(NasdaqMapping).name('NASDAQ').stroke('1 #ffd54f');

    stock.scroller().line(mainMapping);

    var rangeSelector = anychart.ui.rangeSelector();

    stock.draw();

    rangeSelector.render(stock);

    return {
        'stock': stock, 'mainTable': mainTable,
        'SP500Table': SP500Table, 'DowTable': DowTable, 'NasdaqTable': NasdaqTable,
        'SP500': SP500Series, 'Dow': DowSeries, 'NASDAQ': NasdaqSeries
    };
}

function changeStockChart(stockData) {
    stockData['mainTable'].remove();
    var initial_sum = stockData['mainData'][stockData['mainData'].length - 1].value;
    stockData['mainTable'].addData(stockData['mainData']);
    stockData['SP500Table'].addData(calculateIndexPrices(stockData['indexesData']['S&P 500'], initial_sum));
    stockData['DowTable'].addData(calculateIndexPrices(stockData['indexesData']['Dow'], initial_sum));
    stockData['NasdaqTable'].addData(calculateIndexPrices(stockData['indexesData']['NASDAQ'], initial_sum));
}

function getDataInProportion(data, proportion) {
    var sumProp = (proportion[0][0] + proportion[1][0]);
    proportion[0][2] = the_sum * proportion[0][0] / sumProp;
    proportion[1][2] = the_sum * proportion[1][0] / sumProp;

    var consts = [[0, 1, 1, 2, 3, 3, 4, 6, 7, 8, 10], [0, 1, 2, 2, 3, 5, 6, 6, 7, 8, 10]];

    var result = {"data": [], "proportion": proportion};
    for (var group = 0; group < proportion.length; group++) {
        var group_palette = anychart.palettes.distinctColors(anychart.color.singleHueProgression(groupsColors[group], proportion[group][0] + 1));
        var groupName = proportion[group][1];
        var dataForGroup = data[groupName];
        var groupItemsCount = consts[group][proportion[group][0]];
        var totalRisk = 0;
        var tickerIndex;
        for (tickerIndex = 0; tickerIndex < groupItemsCount; tickerIndex++) {
            totalRisk += 1 / dataForGroup[tickerIndex]['risks'];
        }
        for (tickerIndex = 0; tickerIndex < groupItemsCount; tickerIndex++) {
            var dataPoint = dataForGroup[tickerIndex];
            var point = {};
            point['group'] = groupName;
            point['price'] = dataPoint['value'];
            point['coefficient'] = dataPoint['coefficient'];
            point['ticker'] = dataPoint['ticker'];
            point['name'] = dataPoint['name'];
            point['fill'] = group_palette.itemAt(proportion[group][0] - tickerIndex);
            point['stroke'] = null;
            point['hovered'] = {
                'fill': anychart.color.lighten(anychart.color.lighten(group_palette.itemAt(proportion[group][0] - tickerIndex))),
                'stroke': null
            };
            point['value'] = (proportion[group][2] / dataPoint['risks'] / totalRisk).toFixed(2);
            point['amount'] = Math.floor(point['value'] / point['price']);
            point['percent'] = (point['value'] * 100 / the_sum).toFixed(2);
            result["data"].push(point);
        }
    }

    return result
}

var updateDonutData = function (data, stocks_amount, bonds_amount) {
    var updateLabel = function (index) {
        donutData['chart'].label(index).text(
            '<span style="font-size: 24px;">' + donutData['proportion'][index][0] * 10 + '%</span><br/>' +
            '<span style="font-size: 14px; font-weight: normal">' + donutData['proportion'][index][1].toUpperCase() + '</span>');
    };
    var updated_data = getDataInProportion(data, [[stocks_amount, "stocks"], [bonds_amount, "bonds"]]);

    donutData['data'] = updated_data['data'];
    donutData['proportion'] = updated_data['proportion'];
    donutData['dataset'].data(updated_data['data']);
    updateLabel(0);
    updateLabel(1);
};

anychart.onDocumentReady(function () {

    var proportionsChange = function () {
        var stocks = parseInt($('#proportionsSlider .slider-track .max-slider-handle').attr('aria-valuemax')) / 10 + proportionsResult.getValue() / 10;
        var bonds = donutData['initial_data']['stocks'].length - stocks;
        if (proportionsResult.getValue() == 0) {
            stocks = donutData['initial_data']['stocks'].length / 2;
            bonds = donutData['initial_data']['stocks'].length / 2;
        }

        updateDonutData(donutData['initial_data'], stocks, bonds);
        stockData['mainData'] = calculateDataForStock(donutData['data'], stockData['historical']);
        changeStockChart(stockData);
    };

    var timeLineChange = function () {
        forecastData['length'] = timeLine.getValue();
        $('.time-value').text('(' + timeLine.getValue() + ' years)');
        if (timeLine.getValue() == 1) $('.time-value').text('(' + timeLine.getValue() + ' year)');
        updateForecastData(forecastData);
    };

    donutData = drawDonutChart('donut-chart-container');
    $.getJSON("https://raw.githubusercontent.com/anychart-solutions/investment-portfolio-dashboard/master/src/data/financialQuotes.json", function (parsed_data) {
        stockData = drawStockChart('stock-container');
        stockData['indexesData'] = parsed_data;
    });

});

$.getJSON("https://raw.githubusercontent.com/anychart-solutions/investment-portfolio-dashboard/master/src/data/StocksViaBonds.json", function (parsed_data) {
    donutData['initial_data'] = parsed_data;
    updateDonutData(parsed_data, 5, 5);
    $.getJSON("https://raw.githubusercontent.com/anychart-solutions/investment-portfolio-dashboard/master/src/data/historical.json", function (parsed_data) {
        stockData['historical'] = parsed_data;
        stockData['mainData'] = calculateDataForStock(donutData['data'], parsed_data);
        changeStockChart(stockData);
        stockData['stock'].selectRange("MTD");
    });
});

