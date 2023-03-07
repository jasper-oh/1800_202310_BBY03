
// get reference to the submit button
const submitBtn = document.getElementById('submit-btn');

// add event listener to the submit button

function submitBtnClicked() {
    //Get the data from user input
    const cold = document.getElementById("cold").value;
    const coords = document.getElementById("coords").value;
    const curHumidity = document.getElementById("curHumidity").value;
    const curTemp = document.getElementById("curTemp").value;
    const userEmail = firebase.auth().currentUser.email;
    const hot = document.getElementById("hot").value;
    const superDry = document.getElementById("superDry").value;
    const superHumid = document.getElementById("superHumid").value;
    console.error('Element value got.');

  // get the current user
  const user = firebase.auth().currentUser;

  // check if user is signed in
  if (user) {
    // write the user input to the Firestore database
    db.collection('ratings').add({
        cold: cold,
        coords: coords,
        curHumidity: curHumidity,
        curTemp: curTemp,
        email: userEmail,
        hot: hot,
        likes: 0,          //default value
        superDry: superDry,       
        superHumid: superHumid,
        uploadTime: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    })
    .then(function() {
      console.log('User input written to Firestore.');
    })
    .catch(function(error) {
      console.error('Error writing user input to Firestore: ', error);
    });
  } else {
    console.error('User not signed in.');
  }
};