'use strict'


const trailUrl = "https://www.trailrunproject.com/data/get-trails";
const trailKey = "200417972-9dc9a277ef8cb3c883310ed069aec132";
const geoCodeUrl = "https://maps.googleapis.com/maps/api/geocode/json";
const googleApi = "AIzaSyDg4-ORDFbZJ9J7LASnL5qecmn78pHB3mo";
let trailName = 'Lake Houston Loop';
let trailSummary = 'A beautiful and quiet loop on a mix of singletrack and fire road through old forest and swamp.';
let trailPic = "https://cdn-files.apstatic.com/hike/7032190_smallMed_1497129814.jpg";
let trailLength = 10;
let trailAscent = 115;
//let trailUrl = "https://www.trailrunproject.com/trail/7023352/lake-houston-loop";


function getTrails(lat, long){
    let latLong = `lat=${lat}&lon=${long}`;
    const searchRadius = $("#in-radius").val();
    let url2 = trailUrl+'?'+latLong+'&maxDistance='+searchRadius+'&key='+trailKey;
    console.log(url2);
    fetch(url2)
        .then(resp =>resp.json())
        .then(respJson => {
            console.log(respJson);
        })
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
function getResults(searchLocation){
    //get location into lat/long
    getLatLong(searchLocation);
    //this is going to mve
    let resultsList = `<img class="js-trail-image" src="${trailPic}">
                        <div class="js-single-result">
                        <p class="js-name">${trailName}<p>
                        <p>${trailSummary}<p>
                        <p>Length: ${trailLength} miles, Ascent: ${trailAscent}<p>
                       </div>
                       <div class="js-all-results">
                        <h3>Map of All Results</h3>
                        <img class="js-results-map" src="TrailHead.png">
                       </div>`;
     $(".results").append(resultsList);               
}

function handleForm(){
    $(".search-form").submit(event =>{
        event.preventDefault();
        console.log('button press');
        let searchLocation = $("#in-city").val();
        getResults(searchLocation);
    });
}

$(handleForm());