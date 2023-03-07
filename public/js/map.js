var script = document.createElement('script');
const GOOGLE_API = config.apiKey;
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API}&callback=initMap&libraries=places`
script.async = true;


window.initMap = function(){

  const map = new google.maps.Map(document.getElementById("map"), {
    center: {lat:49.2460, lng :-123.0018},
    zoom: 15,
    gestureHandling: "greedy",
  });
  
  const input = document.getElementById("location-search");
  const searchBox = new google.maps.places.SearchBox(input);

  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // // Bias the SearchBox results towards current map's viewport.
  // map.addListener("bounds_changed", () => {
  //   searchBox.setBounds(map.getBounds());
  // });

  searchBox.addListener("places_changed" , () => {
    const places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    
    const place = places[0];
    input.value = place.name;
    if (!place.geometry || !place.geometry.location) {
      console.log("Returned place contains no geometry");
      return;
    }
    
    // Need to send a location and automatically refresh the list in here.
    // Ajax is necessary!
    let long = place.geometry.viewport.Ka.lo;
    
    let lat = place.geometry.viewport.Va.lo;
    
    // let coords11 = coords1.replace("(","");
    // let coords2 = coords11.replace("," , " ")
    // let coords3 = coords2.replace(")", "")

    
    document.querySelector("#location-lat").setAttribute("value" , lat);
    document.querySelector("#location-long").setAttribute("value" , long);
    
    document.querySelector("#scoreList-location").innerHTML = place.name;

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  })
  

  const commentsList = [
    { label: "C", name: "haha", lat: 49.2446421, lng: -123.0057614 },
    { label: "C", name: "hehe", lat: 49.2447421, lng: -123.0057614 },
    { label: "C", name: "keke", lat: 49.2448421, lng: -123.0057614 },
    { label: "C", name: "shsh", lat: 49.2449421, lng: -123.0057614 },
    { label: "C", name: "jiji", lat: 49.2441421, lng: -123.0057614 },
    { label: "C", name: "jeje", lat: 49.2443421, lng: -123.0057614 },
    { label: "C", name: "juju", lat: 49.2444421, lng: -123.0057614 },
  ];

  commentsList.forEach(({label, name, lat, lng}) => {
    const marker = new google.maps.Marker({
      position: {lat, lng},
      label,
      map,
    });
  });
};

document.head.appendChild(script);