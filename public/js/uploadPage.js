// get reference to the submit button
const submitBtn = document.getElementById('submit-btn');

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
    // const cold = document.getElementById("howdyHumid").value;
    // const superDry = document.getElementById("superDry").value;
    // const superHumid = document.getElementById("superHumid").value;

  // get the current user
  // const user = firebase.auth().currentUser;

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid)
      var userID = user.uid

      currentUser.get()
        .then(userDoc => {
          var userEmail = userDoc.data().email;
          db.collection("ratings").add({
            city : city,
            userID : userID,
            city : city,
            coords : coords,
            curTemp : curTemp,
            curHumidity : curHumidity,
            userEmail : userEmail,
            comment : comment,
            uploadTime: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            console.log("save done")
          })

        })
    }else{
      console.log("unsaved")
    }
  })
};