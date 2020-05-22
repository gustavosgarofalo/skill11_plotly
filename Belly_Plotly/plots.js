var data_path = "data/samples.json";

// Using D3 to Operate with json formatted data
d3.json(data_path).then((json_file) => {
    var data = json_file;

    //Getting id from the samples and appending them into the dropdown menu
    var samples = data.samples;
    var option = d3.select("select");
    samples.forEach((sample) => { option.append("option").text(sample.id) });

    // Storing the selected option value into a variable
    var selectedElement = d3.select("#selection");
    var selValue = selectedElement.property("value");

    //################################################################//    
    //Starting a function that will handle the Demographic information
    function demoData(selValue) {
        //assigning the metadata from file to a variable
        var metaData = data.metadata;

        //Selecting the selection value and assigning to a variable (current)
        var selElement = d3.select("#selection");
        var selValue = selElement.property("value");

        // Assigning the destination of information to a variable
        var sample = metaData.find(obj => obj.id == selValue);
        var demoPlace = d3.select("#demoData");
        demoPlace.html("");

        //getting key/value par of each sample
        Object.entries(sample).forEach(([key, value]) => { demoPlace.append("h6").text(`${key}: ${value}`); });
    }

    //################################################################// 
    //Starting function that will handle the bar plot
    function barPlot() {

        //Selecting the selection value and assigning to a variable (current)
        var selElement = d3.select("#selection");
        var selValue = selElement.property("value");

        // Finding the selected value and assigning to a variable
        var sample = samples.find(value => value.id == selValue);

        // Slicing the data to get only the first 10 values, assigning to variables to create plot
        var sample_values = sample.sample_values.slice(0, 10);
        var otu_ids = sample.otu_ids.slice(0, 10);
        var otu_labels = sample.otu_labels.slice(0, 10);

        //Creating the plot  with previous variables
        //Trace
        var trace = {
            x: sample_values,
            y: otu_ids,
            type: "bar",
            orientation: "h",
            text: otu_labels,
        };
        //Assigning trace to a variable called data
        var data = [trace];
        //Building plot layout
        var layout = {
                xaxis: {
                    title: "Sample Value"
                },
                yaxis: {
                    type: "category",
                    title: "OTU ID",
                    showgrid: "true",
                    side: "top"
                },
                title: `Test Subject: ${selValue}`,
                autosize: "true"
            }
            //Using plotly to create new plot
        Plotly.newPlot("plot1", data, layout), { responsive: true };
    }

    //################################################################// 
    //Creating function that will handle the bubble graph
    function bubbleChart(selValue) {

        //Selecting the selection value and assigning to a variable (current)
        var selElement = d3.select("#selection");
        var selValue = selElement.property("value");

        // Finding the selected value and assigning to a variable
        var sample = samples.find(val => val.id == selValue);
        var sample_values = sample.sample_values;
        var otu_ids = sample.otu_ids;
        var otu_labels = sample.otu_labels;

        //Creating the plot  with previous variables
        //Trace
        var trace = {
                x: otu_ids,
                y: sample_values,
                marker: {
                    size: sample_values,
                    color: otu_ids
                },
                text: otu_labels,
                mode: "markers"
            }
            //Assigning trace to a variable called data
        var data = [trace];
        //Building plot layout
        var layout = {
                title: `Test Subject: ${selValue}`,
                xaxis: {
                    title: "OTU ID"
                },
                yaxis: {
                    title: "Sample Value"
                },
                autosize: "true"
            }
            //Using plotly to create new plot
        Plotly.newPlot("plot2", data, layout, { responsive: true });
    }
    //Running all the functions that build the initial plots
    demoData(selValue);
    barPlot(selValue);
    bubbleChart(selValue);

    //####################################################//
    // Reset all the charts whenever a new value is chosen
    d3.select("select").on("change", function(selValue) {
        demoData(selValue);
        barPlot(selValue);
        bubbleChart(selValue);

    })
})