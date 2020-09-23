"use strict";

window.onload = () => {
    getCountryData();
}

var map;
var infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: -5,
      lng: 120,
    },
    zoom: 4,
  });

  infoWindow = new google.maps.InfoWindow();
}

const getCountryData = () => {
    //Mengambil data dari api #1

    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
        return response.json();
    }).then((data) => {
        showDataOnMap(data); // passing data
        showDataInTable(data);
    })
}

const showDataOnMap = (data) => {
    //Mengeluarkan data untuk ditampilkan #2
    data.map((country) => {

        let countryCenter = {
            lat: country.countryInfo.lat,
            lng : country.countryInfo.long
        }

        const countryCircle = new google.maps.Circle({
            strokeColor: "#810000",
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: "#F32013",
            fillOpacity: 0.35,
            map,
            center: countryCenter,
            radius: country.cases * 0.28
          });

          var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag})"></div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${country.cases}
                </div>
                <div class="info-deaths">
                   Deaths: ${country.deaths} 
                </div>
                <div class="info-recovered">
                   Recovered: ${country.recovered}        
                </div>                
            </div>
          `
          var infoWindow = new google.maps.InfoWindow({
                content: html,
                position: countryCircle.center
          });


          google.maps.event.addListener(countryCircle, 'mouseover', function() {
            infoWindow.open(map);
          });

          google.maps.event.addListener(countryCircle, 'mouseout', function(){
            infoWindow.close();
          });


    })


}

const showDataInTable = (data) => {
    var html = '';
    data.forEach((country) => {
        
        html += `
            <tr>
                <td>${country.country}</td>
                <td>${country.cases}</td>
                <td>${country.recovered}</td>
                <td>${country.deaths}</td>
            </tr>
        `
        document.getElementById('table-data').innerHTML = html;

    });
}