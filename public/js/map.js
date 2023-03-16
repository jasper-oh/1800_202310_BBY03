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

  // The Logic that When user search and click the location that is given.
  searchBox.addListener("places_changed" , () => {
    //Erase the list logic
    $("#tbody").empty()

    const places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    
    // Get the given one.
    const place = places[0];
    input.value = place.name;

    if (!place.geometry || !place.geometry.location) {
      console.log("Returned place contains no geometry");
      return;
    }

    // Give the search location value 
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

          //range can be change! unit is "KM".
          if(distance <= 20){
            realDataSet.push(
              {
                ratingID : doc.id,
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
        
        for(let j = 0 ; j < realDataSet.length ; j++){
          generateData(realDataSet[j].userImg , realDataSet[j].curTemp , realDataSet[j].curHumidity , realDataSet[j].userScore, realDataSet[j].ratingID )
        }
        let commentsList = [];

        for ( let i = 0 ; i < realDataSet.length ; i ++){
          commentsList.push({
            label : i + "",
            name : realDataSet[i].userEmail,
            lat : parseFloat(realDataSet[i].lat),
            lng : parseFloat(realDataSet[i].long),
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
      })
    }
    
    getRatings();
    
    function generateData(imgSrc ,temp, humid ,score , id){
      const tbody = document.getElementById("tbody");
      const insertRow = tbody.insertRow();
      const imgData = insertRow.insertCell();
      const tempData = insertRow.insertCell()
      const humidData = insertRow.insertCell();
      const scoreData = insertRow.insertCell();
      const likeData = insertRow.insertCell();
    
      let imgTag = document.createElement("IMG")
      imgTag.setAttribute("src" , imgSrc);
      imgTag.setAttribute("width" , "40px");
      imgTag.classList.add(id)
      imgTag.setAttribute("data-toggle" , "modal")
      imgTag.setAttribute("data-target", "#myModal")
      imgTag.setAttribute("onclick" , "openModal(this.className);");
      imgData.appendChild(imgTag);
      let tempDataText = document.createTextNode(temp);
      tempData.appendChild(tempDataText)
      let humidDataText = document.createTextNode(humid);
      humidData.appendChild(humidDataText)
      let scoreDataText = document.createTextNode(score);
      scoreData.appendChild(scoreDataText)
      //Like button logic will be here.
      let likesDataText = document.createElement("i");
      likesDataText.classList.add("fa-regular", "fa-thumbs-up")
      likesDataText.setAttribute("onclick","clickLikes(this.id);")
      likesDataText.setAttribute("id", id)
      likeData.appendChild(likesDataText)
    }
    

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  })

  
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


function clickLikes(cliked_id){
  
  let clickedEle = document.getElementById(cliked_id)
  
  if(clickedEle.classList.contains("fa-regular")){
    clickedEle.classList.remove("fa-regular")
    clickedEle.classList.add("fa-solid")
    // Firebase connect logic
    var setRatings = db.collection("ratings").doc(cliked_id)
    setRatings.get()
    .then(
      ratingDoc => {
        var curLikes = ratingDoc.data().likes + 1;
        db.collection("ratings").doc(cliked_id).update({
          likes : curLikes
        }).then(() => {
          console.log("save done!")
        })
      }
    )

  }else{
    clickedEle.classList.remove("fa-solid")
    clickedEle.classList.add("fa-regular")
    // Firebase connect logic
    var setRatings = db.collection("ratings").doc(cliked_id)
    setRatings.get()
    .then(
      ratingDoc => {
        var curLikes = ratingDoc.data().likes - 1;
        db.collection("ratings").doc(cliked_id).update({
          likes : curLikes
        }).then(() => {
          console.log("save done!")
        })
      }
    )
    
  }
}

// TODO make a logic that if the User click his own comment, 
// then put the edit or delete or save button.
function openModal(clickedClass){

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var userID = user.uid
      var getRatings = db.collection("ratings").doc(clickedClass)
      getRatings.get()
      .then(
        ratingDoc => {
          // If the comment is generate by user
          if(userID == ratingDoc.data().userID){
            $(".modal-btn-delete").css('display','inline-block');
            $(".modal-btn-delete").attr('id' , clickedClass);
            $(".modal-btn-save").css('display','inline-block');
            $(".modal-btn-save").attr('id' , clickedClass);
            $("#modal-title").text(ratingDoc.data().city)
            $("#modal-temp").val(ratingDoc.data().curTemp)
            $("#modal-humid").val(ratingDoc.data().curHumidity)
            $("#modal-comment").text(ratingDoc.data().comment)
            $("#modal-like").text(ratingDoc.data().likes)
            $("#modal-time").text(new Date(ratingDoc.data().uploadTime.seconds*1000))
          // If the comment is just showing
          }else{
            $(".modal-btn-delete").css('display','none');
            $(".modal-btn-save").css('display','none');
            $("#modal-title").text(ratingDoc.data().city)
            $("#modal-temp").val(ratingDoc.data().curTemp)
            $("#modal-humid").val(ratingDoc.data().curHumidity)
            $("#modal-comment").text(ratingDoc.data().comment)
            $("#modal-like").text(ratingDoc.data().likes)
            $("#modal-time").text(new Date(ratingDoc.data().uploadTime.seconds*1000))
          }

        }
      )
      
    }
  })
    $("#myModal").modal('show')
}

function deleteComment(clickedId){
  var userCheck = confirm("Do you want to delete it?");
  if (userCheck == true){
    db.collection("ratings").doc(clickedId).delete().then(() => {
      alert("Successfully deleted")
    })
  }else{
    return;
  }
}

function saveComment(clickedId){
  var userCheck = confirm("Do you want to save it?");
  var modifiedTemp = $("#modal-temp").val()
  console.log(modifiedTemp)
  var modifiedHumid = $("#modal-humid").val()
  if (userCheck == true){
    db.collection("ratings").doc(clickedId).update({
      curTemp : modifiedTemp,
      curHumidity : modifiedHumid
    }).then(() => {
      alert("Successfully saved")
      window.location.href = "/search"
    })
  }else{
    return;
  }

}



document.head.appendChild(script);