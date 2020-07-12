const requestOptions = {
  method: "GET",
  redirect: "follow",
};

var resultJson = {};

fetch("https://api.covid19api.com/summary", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    resultJson = JSON.parse(result);
  })
  .then((r) => {
    //loading geocharts with API
    google.charts.load("current", {
      packages: ["geochart"],
      // Note: you will need to get a mapsApiKey for your project.
      // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
      mapsApiKey: "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY",
    });

    //calling method on google.charts
    google.charts.setOnLoadCallback(drawRegionsMap);
    const countries = resultJson["Countries"];
    console.log(countries);
    //an array is initialized and all the country names and TotalCases are pushed in that arrary
    //so that later it could be passed on to google.visualization method
    const infoArray = [];
    // console.log(infoArray);
    countries.forEach((country) => {
      infoArray.push([country["Country"], country["TotalConfirmed"]]);
    });
    console.log(infoArray); //test console log

    function drawRegionsMap() {
      //variable infoArray gets processed by visualization method and assigned into data
      var data = google.visualization.arrayToDataTable([
        ["Country", "Total Confirmed"],
        ...infoArray,
      ]);

      //options for colouring
      var options = {
        colorAxis: { colors: ["#52fa74", "#f7fa52", "#cc0000"] },
        backgroundColor: "#81d4fa",
        // datalessRegionColor: "pink",
      };

      //new chart instance is created where the div is passed where chart is to be loaded
      var chart = new google.visualization.GeoChart(
        document.getElementById("regions_div")
      );

      chart.draw(data, options);
      //'data' is the array which needs to be shown and 'options' are supporting properties
    }
  });
