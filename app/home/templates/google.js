
        google.charts.load('current', {packages: ['corechart', 'bar', 'table']});

        google.charts.setOnLoadCallback(drawTable);

        function drawTable() {
           var data = new google.visualization.DataTable();
           data.addColumn('string', 'Industry');
           data.addColumn('number', 'Invested $');
        data.addColumn('number', 'Count of Invested $');

           data.addRows(dataSet);

           var formatter = new google.visualization.NumberFormat({prefix: '$'});
           formatter.format(data, 1); // Apply formatter to second column
           var view = new google.visualization.DataView(data);
           view.setColumns([0, 1]);

        table = new google.visualization.Table(document.getElementById('table_div'));
        table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});

           chart = new google.charts.Bar(document.getElementById('chart_div'));
           var chartOptions = {
               'title': 'Invested $ by Industry',
               'width': 500,
               'height': 800,
               bars: 'horizontal',
               legend: 'none'
           };
           chart.draw(data, chartOptions);

        function tableSelectHandler(e) {
           console.log('Table Selected')
           table_selection = table.getSelection()
           chart.setSelection(table_selection);

        // When the orgchart is selected, update the table chart.
        google.visualization.events.addListener(table, 'select', tableSelectHandler);


        function chartSelectHandler(e) {
           chart_selection = chart.getSelection()
           console.log(dataSet[chart_selection[0].row]);
           new_url = "/industry/"+ dataSet[chart_selection[0].row][0];
           console.log(new_url);
           // onclick event is assigned to the #button element.
           window.location.href = new_url;

        google.visualization.events.addListener(chart, 'select', chartSelectHandler);
        document.getElementById("button").onclick = function () {
        google.visualization.events.addListener(materialChart, 'select', selectHandler);


        function selectHandler() {
           var selection = materialChart.getSelection();
           var message = '';

           for (var i = 0; i < selection.length; i++) {
               var item = selection[i];
               if (item.row != null && item.column != null) {
                   var str = data.getFormattedValue(item.row, item.column);
                   message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
               } else if (item.row != null) {
                   var str = data.getFormattedValue(item.row, 0);
                   message += '{row:' + item.row + ', column:none}; value (col 0) = ' + str + '\n';
               } else if (item.column != null) {
                   var str = data.getFormattedValue(0, item.column);
                   message += '{row:none, column:' + item.column + '}; value (row 0) = ' + str + '\n';
               }
           }
           if (message == '') {
               message = 'nothing';
           }
           alert('You selected ' + message);

        }
