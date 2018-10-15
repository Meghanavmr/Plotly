//init function to execute on first load of index.html.
function init() {
  // Grab a reference to the dropdown select element
  console.log("check in db")
  var selector = d3.select("#selDataset");
// Use the list of sample names to populate the select options

  Plotly.d3.json("/names",function(error,response){
    if(error) console.warn(error);
    var dropdown_select = Plotly.d3.select("#selDataset");

    
   for(var i=0;i<response.length;i++){
       dropdown_select.append("option").attr("value",response[i]).text(response[i]);
   }
   optionChanged(response[0]);

    // Use the first sample from the list to build the initial plots
    // const firstSample = sampleNames[0];
    // buildMetadata(firstSample);
    // Plotpie(firstSample);
  });
}
 // @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
  
   // Use `d3.json` to fetch the metadata for a sample
  var url="/metadata/"+sample;
  console.log(url);

  // Use d3 to select the panel with id of `#sample-metadata`

  d3.json(url).then(function(response){
    
    console.log(response);
    var metadata_Sample= d3.select("#sample-metadata");
    // Remove old metadata
    metadata_Sample.selectAll("p").remove();

    for(var key in response){
        if(response.hasOwnProperty(key)){
            metadata_Sample.append("p").text(key + ":   " + response[key]);
        }
    }
    console.log("check metadata")
});

}  

    

function buildCharts(sample) {

}

//function to build a pie chart based on 10 samples. 

function Plotpie(sample){
  console.log("create pie plot");
  var descriptions=[];

  d3.json("/samples/" + sample).then(function(response){
    
    console.log('Plot Pie Inside');
    console.log(response);
      var pielabels=response['otu_ids'].slice(0,11);
      var pievalues=response['sample_values'].slice(0,10);
      var piedescription=response['otu_labels'].slice(0,10);


      var trace1 = { 
          values: pievalues,
          labels: pielabels,
          type:"pie",
          name:"Top 10 Samples",
          textinfo:"percent",
          text: piedescription,
          textposition: "inside",
          hoverinfo: 'label+value+text+percent'
      }
      var data=[trace1];
      var layout={
          title: "<b>Top 10 Samples: " + sample + "</b>", 
          height: 400,
          width: 500,
          margin: {
              l: 10,
              r: 10,
              b: 10,
              t: 10,
              pad: 10
            },
      }
      console.log("ready to plot pie chart")
      Plotly.newPlot("pie",data,layout);
  })
}

function Plotscatter(sample){
  console.log("Plotting Scatter Plot");

      d3.json("/samples/"+sample).then(function(response){
      //if(error) console.warn(error);
      console.log("In plotscatter, logging response next")
      console.log(response)
      var scatter_description = response['otu_labels'];
      console.log("logging scatter_description list")
      console.log(scatter_description.slice(0,10))

      var trace1 = {
          x: response['otu_ids'],
          y: response['sample_values'],
          marker: {
              size: response['sample_values'],
              color: response['otu_ids'].map(d=>100+d*20),
              colorscale: "Earth"
          },
          type:"scatter",
          mode:"markers",
          text: scatter_description,
          hoverinfo: 'x+y+text',
      };

      var data = [trace1];
      console.log(data)
      var layout = {
          xaxis:{title:"OTU ID",zeroline:true, hoverformat: '.2r'},
          yaxis:{title: "Samples",zeroline:true, hoverformat: '.2r'},
          height: 500,
          width:800,
          margin: {
              l: 100,
              r: 10,
              b: 70,
              t: 10,
              pad: 5
            },
          hovermode: 'closest',
      };
      console.log(layout)
      console.log("starting scatter plot/bubble chart")
      Plotly.newPlot("bubble",data,layout);
      
  })
}

function optionChanged(newSample) {
  console.log("optionchanged detected and new sample selected")
  console.log("new sample: " + newSample )
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);

  // Plot the updated pie chart
  Plotpie(newSample);
  
  //Update the scatter plot for the new sample selected.
  Plotscatter(newSample);
}

  

// Initialize the dashboard
init();