const fs = require("fs");
const chartExporter = require("highcharts-export-server");
// Initialize the exporter
chartExporter.initPool();
// Chart details object specifies chart type and data to plot
const chartDetails = {
   type: "png",
   options: {
       chart: {
           type: "pie"
       },
       title: {
           text: "Heading of Chart"
       },
       plotOptions: {
           pie: {
               dataLabels: {
                   enabled: true,
                   format: "<b>{point.name}</b>: {point.y}"
               }
           }
       },
       series: [
           {
               data: [
                   {
                       name: "a",
                       y: 100
                   },
                   {
                       name: "b",
                       y: 20
                   },
                   {
                       name: "c",
                       y: 50
                   }
               ]
           }
       ]
   }
};

chartExporter.export(chartDetails, (err, res) => {
   // Get the image data (base64)
   let imageb64 = res.data;

   // Filename of the output
   let outputFile = "bar.png";

   // Save the image to file
   fs.writeFileSync(outputFile, imageb64, "base64", function(err) {
       if (err) console.log(err);
   });

   console.log("Saved image!");
   chartExporter.killPool();
});