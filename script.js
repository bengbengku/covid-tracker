"use strict";

window.onload = () => {
  getCountryData();
  getHistoricalData();
  getWorldCoronaData();
};

var map;
var infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: -5,
      lng: 120,
    },
    zoom: 3.2,
    minZoom: 3,
    styles: mapStyle, //var dari mapStyle.js
    scrollwheel: false,
  });

  infoWindow = new google.maps.InfoWindow();
}

const getCountryData = () => {
  //Mengambil data dari api #1

  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataOnMap(data); // passing data
      showDataInTable(data);
    });
};

const getWorldCoronaData = () => {
  fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      buildPieChart(data);
    });
};

const getHistoricalData = () => {
  //Mengambil data historical dari api

  fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data);
      buildChart(chartData);
    });
};

const buildChartData = (data) => {
  let chartData = [];
  for (let date in data.cases) {
    let newDataPoint = {
      x: date,
      y: data.cases[date],
    };
    chartData.push(newDataPoint);
  }

  return chartData;
};

const buildPieChart = (data) => {
  var ctx = document.getElementById("myPieChart").getContext("2d");
  var myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [
        {
          data: [data.active, data.recovered, data.deaths],
          backgroundColor: [
            '#9d80fe',
            '#7dd71d',
            '#fb4443'
          ]
        },
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ["Kasus Aktif", "Sembuh", "Meninggal"],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    }
  });
};

const buildChart = (chartData) => {
  var timeFormat = "MM/DD/YY";
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "🤢Total Kasus",
          borderColor: "#1287f5",
          data: chartData,
        },
      ],
    },

    // Configuration options go here && Import moment.js
    options: {
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: "ll",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              // Mengubah format dengan numeral
              callback: function (value, index, values) {
                return numeral(value).format("0,0");
              },
            },
          },
        ],
      },
    },
  });
};

const showDataOnMap = (data) => {
  //Mengeluarkan data untuk ditampilkan #2
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    const countryCircle = new google.maps.Circle({
      strokeColor: "#fc3c3c",
      strokeOpacity: 0.5,
      strokeWeight: 3,
      fillColor: "#fc3c3c",
      fillOpacity: 0.35,
      map,
      center: countryCenter,
      radius: country.cases * 0.28,
    });

    var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag})"></div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total Kasus: ${country.cases}
                </div>
                <div class="info-deaths">
                   Meninggal: ${country.deaths} 
                </div>
                <div class="info-recovered">
                   Sembuh: ${country.recovered}        
                </div>                
            </div>
          `;
    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });

    google.maps.event.addListener(countryCircle, "mouseover", function () {
      infoWindow.open(map);
    });

    google.maps.event.addListener(countryCircle, "mouseout", function () {
      infoWindow.close();
    });
  });
};

const showDataInTable = (data) => {
  var html = "";
  data.forEach((country) => {
    html += `
            <tr>
                <td id="img-flexbox"><div class="country-img" style="background-image: url(${country.countryInfo.flag})"></div>${country.country}</td>
                <td>${country.cases}</td>
                <td>${country.recovered}</td>
                <td>${country.deaths}</td>
            </tr>
        `;
    document.getElementById("table-data").innerHTML = html;
  });
};
