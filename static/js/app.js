// Load data using D3
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(data => {
    const samples = data.samples;
    const metadata = data.metadata;

    // Populate dropdown options
    const dropdown = document.getElementById("selDataset");
    samples.forEach(sample => {
      const option = document.createElement("option");
      option.value = sample.id;
      option.text = sample.id;
      dropdown.appendChild(option);
    });

    // Function to update charts and metadata based on selected sample
    function updateCharts(selectedSample) {
      // Find the selected sample data
      const selectedData = samples.find(sample => sample.id === selectedSample);
      
      // Create bubble chart
      const bubbleChart = {
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        text: selectedData.otu_labels,
        mode: "markers",
        marker: {
          size: selectedData.sample_values,
          color: selectedData.otu_ids,
          colorscale: "Viridis"
        }
      };
      Plotly.newPlot("bubble", [bubbleChart]);

      // Create horizontal bar chart
      const barChart = {
        x: selectedData.sample_values.slice(0, 10).reverse(),
        y: selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: selectedData.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };
      Plotly.newPlot("bar", [barChart]);

      // Display sample metadata
      const selectedMetadata = metadata.find(entry => entry.id === +selectedSample);
      const metadataHtml = Object.entries(selectedMetadata)
        .map(([key, value]) => `<p><b>${key}:</b> ${value}</p>`)
        .join("");
      document.getElementById("sample-metadata").innerHTML = metadataHtml;
    }

    // Event listener for dropdown change
    dropdown.addEventListener("change", event => {
      const selectedSample = event.target.value;
      updateCharts(selectedSample);
    });

    // Initialize with the first sample
    const initialSample = samples[0].id;
    updateCharts(initialSample);
  })
  .catch(error => console.error("Error loading data:", error));

  