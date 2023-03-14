var script = document.createElement('script');
const GOOGLE_API = config.apiKey;
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API}&callback=initMap&libraries=places`
script.async = true;

//init the map
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
    //Erase the list logic
    $("#tbody").empty()

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
    document.getElementById("scoreList-location").innerHTML = place.name;
    let lat = place.geometry.viewport.Va.lo;
    let long = place.geometry.viewport.Ja.lo;

    const center = new firebase.firestore.GeoPoint(lat, long); //search location
    
    let realDataSet = []

    function getRatings(){
      db.collection("ratings").where("coords", "!=" , null).get()
      .then( ratings => {
        ratings.forEach(doc => {    
          const point = doc.data().coords;
          const distance = distanceBetweenPoints(center , point);
          if(distance <= 20){
            realDataSet.push(
              {
                userImg : "/images/logoWhite.png",
                userID : doc.data().userID,
                userEmail : doc.data().email,
                curHumidity : doc.data().curHumidity,
                curTemp : doc.data().curTemp,
                long : doc.data().coords.longitude,
                lat : doc.data().coords.latitude
              }
            )
          }
        })
        console.log(realDataSet[0])
        
        for(let j = 0 ; j < Object.keys(realDataSet[0]).length ; j++){
          generateData(realDataSet[j].userImg , realDataSet[j].curTemp , realDataSet[j].curHumidity , realDataSet[j].userScore )
        }
        setPin()
      })
    }
    
    getRatings();
    
    function generateData(imgSrc ,temp, humid ,score){
      const tbody = document.getElementById("tbody");
      const insertRow = tbody.insertRow();
      const imgData = insertRow.insertCell();
      const tempData = insertRow.insertCell()
      const humidData = insertRow.insertCell();
      const scoreData = insertRow.insertCell();
    
      let imgTag = document.createElement("IMG")
      imgTag.setAttribute("src" , imgSrc);
      imgTag.setAttribute("width" , "40px");
      imgData.appendChild(imgTag);
      let tempDataText = document.createTextNode(temp);
      tempData.appendChild(tempDataText)
      let humidDataText = document.createTextNode(humid);
      humidData.appendChild(humidDataText)
      let scoreDataText = document.createTextNode(score);
      scoreData.appendChild(scoreDataText)
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  })

  function setPin(){
    let commentsList = [];

    for ( let i = 0 ; i < Object.keys(realDataSet[0]).length ; i ++){
      commentsList.push({
        label : i,
        name : realDataSet[i].userEmail,
        lat : realDataSet[i].lat,
        long : realDataSet[i].long,
      })
    }

    console.log(commentsList)

    //Will make a for loop with this function.
    commentsList.forEach(({label, name, lat, lng}) => {
      const marker = new google.maps.Marker({
        position: {lat, lng},
        name,
        label,
        map,
      });
    });

  
  }
};

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceBetweenPoints(point1, point2) {
  const earthRadius = 6371; // in kilometers

  const lat1 = degreesToRadians(point1.latitude);
  const lon1 = degreesToRadians(point1.longitude);
  const lat2 = degreesToRadians(point2.latitude);
  const lon2 = degreesToRadians(point2.longitude);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance;
}

document.head.appendChild(script);