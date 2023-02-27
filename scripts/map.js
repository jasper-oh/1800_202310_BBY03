console.log("Work?")
var script = document.createElement('script');
const GOOGLE_API = config.apiKey;
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API}&callback=initMap`
script.async = true;


window.initMap = function(){
  const map = new google.maps.Map(document.getElementById("map"), {
    center: {lat:49.2460, lng :-123.0018},
    zoom: 10,
  });
  
};

document.head.appendChild(script);