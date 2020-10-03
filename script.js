"use strict";

window.onload = () => {
  getCountryData();
  getHistoricalData();
  getWorldCoronaData();
};

var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];
var casesTypeColors = {
  cases: '#1d2c4d',
  active: '#9d80fe',
  recovered: '#7dd71d',
  deaths: '#fb4443'
}

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

const changeDataSelection = (casesType) => {
  clearTheMap();
  showDataOnMap(coronaGlobalData, casesType);
}

const clearTheMap = () => {
  for(let circle of mapCircles) {
    circle.setMap(null);
  }
}


const getCountryData = () => {
  //Mengambil data dari api #1

  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      coronaGlobalData = data;
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

const showDataOnMap = (data, casesType="cases") => {

  //Mengeluarkan data untuk ditampilkan #2
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: casesTypeColors[casesType],
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: casesTypeColors[casesType],
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country[casesType] * 0.28,
    });

    mapCircles.push(countryCircle); //Menyimpan data countryCircle ke array mapCircles

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
