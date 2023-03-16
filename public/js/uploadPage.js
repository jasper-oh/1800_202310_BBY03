// get reference to the submit button
const submitBtn = document.getElementById('submit-btn');

// Lat and long data convert to GeoPoint
const lat = localStorage.getItem("lat");
const long =  localStorage.getItem("long")
var coords = new firebase.firestore.GeoPoint(lat,long)




// add event listener to the submit button
function submitBtnClicked() {
    //Get the data from user input
    const city = localStorage.getItem("location")
    const curTemp = document.getElementById("howdyTemp").value;
    const curHumidity = document.getElementById("howdyHumid").value;
    const comment = document.getElementById("exampleFormControlTextarea1").value
    // TODO later
    // const hot = document.getElementById("hot").value;
    // const cold = document.getElementById("cold").value;
    // const superDry = document.getElementById("superDry").value;
    // const superHumid = document.getElementById("superHumid").value;

  // Save the data to ratings collection
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid)
      var userID = user.uid

      currentUser.get()
        .then(userDoc => {
          var userEmail = userDoc.data().email;
          var userImg = userDoc.data().userImg;
          db.collection("ratings").add({
            city : city,
            // cold : cold,
            comment : comment,
            coords : coords,
            curHumidity : curHumidity,
            curTemp : curTemp,
            email : userEmail,
            // hot : hot,
            likes : 0,
            // superDry : superDry,
            // superHumid : superHumid,
            uploadTime: firebase.firestore.FieldValue.serverTimestamp(),
            userID : userID,
            userImg : userImg
          }).then(() => {
            //Save Done logic!
            console.log("save done")
          })

        })
    }else{
      console.log("unsaved")
    }
  })
};