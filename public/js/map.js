/*
Map.js included code in searchPage. 
this js file interact with searchPage.html

Map is showing with window.initMap function.

Written by : Jasper
*/

// Using script for insert Javascript code.
var script = document.createElement('script');

const GOOGLE_API = config.apiKey;
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API}&callback=initMap&libraries=places`
script.async = true;

//init the map
window.initMap = function(){
  
  // Initialize map setting.
  const map = new google.maps.Map(document.getElementById("map"), {
    center: {lat:49.2460, lng :-123.0018},
    zoom: 15,
    gestureHandling: "greedy",
  });
  
  // Using google searchbox with custom search input box.
  const input = document.getElementById("location-search");
  const searchBox = new google.maps.places.SearchBox(input);
  
  // The Logic that When user search and click the location that is given.
  searchBox.addListener("places_changed" , () => {
    
    const map = new google.maps.Map(document.getElementById("map"), {
      center: {lat:49.2460, lng :-123.0018},
      zoom: 15,
      gestureHandling: "greedy",
    });
  


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

    
    // Searched location's coordinate
    let lat = place.geometry.viewport.Wa.lo;
    let long = place.geometry.viewport.Ga.lo;
    
    // take to the searched location.
    const center = new firebase.firestore.GeoPoint(lat, long); //search location
    
    // Get the ratings list by the location.
    function getRatings(){

      // Data Structure that contain the rating list.
      let realDataSet = []

      // Get today's date.
      let today = new Date();
      today.setHours(0,0,0,0);      

      // Get the ratings (just for today) in the firebase.
      db.collection("ratings").where("uploadTime", ">=" , today ).get()
      .then( ratings => {
        ratings.forEach(doc => {    
          const point = doc.data().coords;
          const distance = distanceBetweenPoints(center , point);
          
          //range can be change! unit is "KM".
          if(distance <= 8){
            realDataSet.push(
              {
                ratingID : doc.id,
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
        
        // With the function generateData showing the lists.
        for(let j = 0 ; j < realDataSet.length ; j++){          
          generateData(realDataSet[j].curTemp , realDataSet[j].curHumidity , realDataSet[j].ratingID , realDataSet[j].userID)
        }

        // The DataStructure after filtering the realDataSet.
        let commentsList = [];

        // Pushing the filtered data in commentsList.
        for ( let i = 0 ; i < realDataSet.length ; i ++){          
          commentsList.push({
            label : i + "",
            name : realDataSet[i].userEmail,
            lat : parseFloat(realDataSet[i].lat),
            lng : parseFloat(realDataSet[i].long),
          })
        }
                
        // Put the Marker in map.
        commentsList.forEach(({label, name, lat, lng}) => {
          var marker = new google.maps.Marker({
            position: {lat, lng},
            name,
            label,            
          });

          marker.setMap(map)
        });
      })
    }
    
    // Run get Ratings.
    getRatings();
    
    
    // After search, map center the location.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  })
};

// Integer data(Temperature) convert to sentence.
function tempConvertToSentence(score){
  switch(score){
    case 1:
    case "1":
      return "Very cold";
    case 2:
    case "2":
      return "It feels colder";
    case 3:
    case "3":
      return "Exactly How it feels";
    case 4:
    case "4":
      return "It feels warmer";
    case 5:
    case "5":
      return "Very hot";
  }
}

// Integer data(Humidity) convert to sentence.
function humidityConvertToSentence(score){
  switch(score){
    case 1:
    case "1":
      return "Very dry";
    case 2:
    case "2":
      return "It feels less humid";
    case 3:
    case "3":
      return "Exactly how it feels";
    case 4:
    case "4":
      return "It feels more humid";
    case 5:
    case "5":
      return "Very damp";
  }
}

// Put the data in the table.
function generateData(temp, humid , id ,userId){
  const tbody = document.getElementById("tbody");
  const insertRow = tbody.insertRow();
  const imgData = insertRow.insertCell();
  const tempData = insertRow.insertCell()
  const humidData = insertRow.insertCell();
  const likeData = insertRow.insertCell();

  let imgTag = document.createElement("IMG")
  var user = db.collection("users").doc(userId)
  
  user.get().then(userDoc => {
    var userImg = userDoc.data().userImg;
    imgTag.setAttribute("src" , userImg);
    imgTag.setAttribute("width" , "40px");
    imgTag.classList.add(id)
    imgTag.setAttribute("data-toggle" , "modal")
    imgTag.setAttribute("data-target", "#myModal")
    imgTag.setAttribute("onclick" , "openModal(this.className);");
    imgTag.setAttribute("id" , userId)
    imgData.appendChild(imgTag);  
  })
    
  let tempDataText = document.createTextNode(tempConvertToSentence(temp));
  tempData.appendChild(tempDataText)
  let humidDataText = document.createTextNode(humidityConvertToSentence(humid));
  humidData.appendChild(humidDataText)

  //Like button logic will be here.
  let likesDataText = document.createElement("i");
  likesDataText.classList.add("fa-regular", "fa-thumbs-up")
  likesDataText.setAttribute("onclick","clickLikes(this.id);")
  likesDataText.setAttribute("id", id)
  likeData.appendChild(likesDataText)
}

// Logic that need to use in setting range.
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Logic that need to use in setting range.
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

// Clikable likes button logic
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

// Click the avatar and open modal.
function openModal(clickedClass){

  let writeUserID = $(".clickedClass").attr('id')
  console.log(writeUserID)

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var userID = user.uid
      
      var userData = db.collection("users").doc(userID)
      
      userData.get()
      .then(
        user => {
          const preferTemp = user.data().preferTemp;
          
          switch(preferTemp){
            case 1:
            case "1":
              $("#modal-animal").attr('src',"/images/bear.png" )
              break;
            case 2:
            case "2":
                $("#modal-animal").attr('src',"/images/squirrel.png")
                break;
            case 3:
            case "3":
                $("#modal-animal").attr('src', "/images/camel.png")
                break;
            }
                
        }
        )
              
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
            // $("#modal-animal").text(user.)
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
            // $("#modal-animal").text(ratingDoc.data().city)
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

// Delete the comment logic
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

// After edit the comment, save the edited comment logic
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


// Put the script in the html file.
document.head.appendChild(script);