'use strict'

const trailUrl = "https://www.trailrunproject.com/data/get-trails";
const trailKey = "200417972-9dc9a277ef8cb3c883310ed069aec132";
const geoCodeUrl = "https://maps.googleapis.com/maps/api/geocode/json";
const googleApi = "AIzaSyDg4-ORDFbZJ9J7LASnL5qecmn78pHB3mo";
let resultsLoc = {};
let trailLength = '';
let trailName = '';
let trailSummary = '';
let trailAscent = '';
let searchLat = '';
let searchLong = '';

function buildResults(trails){
    //set returned data
    $(".results").append(`<h1>${trails.length} trails found:</h1>`);
    for(let i = 0; i < trails.length; i++){
        let trailPic = trails[i].imgSmallMed;
        //placeholder pic if trail does not have an image.
        if(trailPic === ''){
            trailPic = "http://cdn.slipstick.com/images/2011/08/file-does-not-exist.png";
        }
        trailLength = trails[i].length;
        trailName = trails[i].name;
        trailSummary = trails[i].summary;
        trailAscent = trails[i].ascent;
        resultsLoc[i] = {name: `${trailName}`, latitude: `${trails[i].latitude}`, longitude: `${trails[i].longitude}`, zInd: (i+1)};
        let resultsList = `
        <img class="js-trail-image" src="${trailPic}">
        <div class="js-single-result">
        <p class="js-name">${trailName}<p>
        <p>${trailSummary}<p>
        <p>Length: ${trailLength} miles, Ascent: ${trailAscent}<p>
       </div>
       <div></div>`;
        $(".results").append(resultsList); 
    }
    let resultsNum = trails.length;
    initMap(resultsNum);
}
    
function initMap(resultsNum) {
    if(searchLat != ''){
        let map;
        map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {lat: searchLat, lng: searchLong},
        });
        for(let i = 0; i<resultsNum;i++){
            let marker = new google.maps.Marker({
                position: {lat: parseFloat(resultsLoc[i].latitude), lng: parseFloat(resultsLoc[i].longitude)},
                map: map,
                title: resultsLoc[i].name,
                zIndex: resultsLoc[i].zInd,
            });
        }
        $('#map').removeClass('hidden');
    }
}
function getTrails(lat, long){
    let latLong = `lat=${lat}&lon=${long}`;
    searchLat = lat;
    searchLong = long;
    const searchRadius = $("#in-radius").val();
    let url2 = trailUrl+'?'+latLong+'&maxDistance='+searchRadius+'&key='+trailKey;
    fetch(url2)
        .then(resp =>resp.json())
        .then(respJson => {
            //call function to loop through the results and push them to the DOM.
            buildResults(respJson.trails);
        })
        .catch(error => alert(`something went wrong: ${error.message}`));
}

function getLatLong(searchLocation){
    searchLocation = "?address=" + searchLocation.replace(" ", "+");
    let url = geoCodeUrl + searchLocation + "&key=" + googleApi;
    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            let lat = responseJson.results[0].geometry.location.lat;
            let long = responseJson.results[0].geometry.location.lng;
            //now we need to fetch the trail data.
            getTrails(lat, long);
        })
        .catch(err => alert(`something went wrong: ${err.message}`));
}

function handleForm(){
    $(".search-form").submit(event =>{
        event.preventDefault();
        let searchLocation = $("#in-city").val();
        $(".results").empty();
        getLatLong(searchLocation);
    });
}

$(handleForm());