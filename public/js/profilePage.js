// Auto update slider label when drag

var slider1 = document.getElementById("slider1");
var sliderLabel1 = document.getElementById("sliderValueLabel1");
slider1.addEventListener("input", function () {
  sliderLabel1.innerHTML = slider1.value;
});

var slider2 = document.getElementById("slider2");
var sliderLabel2 = document.getElementById("sliderValueLabel2");
slider2.addEventListener("input", function () {
  sliderLabel2.innerHTML = slider2.value;
});

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------

function handleWeatherPreferenceSet(){
  let tempPreference = document.getElementById("slider1").value;
  let humidityPreference = document.getElementById("slider2").value;
  
  if( userCheck == true){
    firebase.auth().onAuthStateChanged(user =>{
        if (user){
           console.log(user.uid); // let me to know who is the user that logged in to get the UID
           currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
          currentUser.get().then(userDoc=>{
              db.collection("users").doc(user.uid).update({
                preferTemp : tempPreference,
                preferHumid : humidityPreference,
              }).then(()=>{
                var userCheck = confirm("Do you want to save?");
  
              })
          })    
      }    
    })
    location.href = "/main"
  }else{
    return;
  }
}


function insertNameFromFirestore(){
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged(user =>{
      if (user){
        console.log(user.uid); // let me to know who is the user that logged in to get the UID
        currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
        currentUser.get().then(userDoc=>{
            //get the user name
            var userName= userDoc.data().name;
            localStorage.setItem("name", userName);
            $(".edit-profile-photo-btn").attr('id', user.uid)
            $(".save-profile-img-btn").attr('id', user.uid)

            //get the user Img
            var userImg = userDoc.data().userImg;

            //get The user prefer Temp
            var userPreferTemp = userDoc.data().preferTemp;
            var userPreferHumid = userDoc.data().preferHumid;

            //$("#name-goes-here").text(userName); //jquery
            document.getElementById("name-goes-here").innerText = userName;
            document.getElementById("slider2").setAttribute("value", userPreferTemp);
            document.getElementById("slider1").setAttribute("value", userPreferHumid);
            document.getElementById('sliderValueLabel2').innerText = userPreferHumid;
            document.getElementById('sliderValueLabel1').innerText = userPreferTemp;

            $(".user-photo").attr("src" , userImg)

        })    
      }    
  })
}

insertNameFromFirestore()

function editClick(EditUserId){
  db.collection("users").doc(EditUserId).get().then( userDoc => {
    var userImg = userDoc.data().userImg
    var radioId = "#" + trimImgName(userImg)    
    $(radioId).prop("checked" , true)
  })
  $("#profileModal").modal("show")
}

function saveUserProfileImg(EditUserId){
  var getCheckedImg = $('input[name=profile]:checked').val();
  
  var userCheck = confirm("Do you want to save it?");

  if (userCheck == true){
    db.collection("users").doc(EditUserId).update({
      userImg : getCheckedImg,
    }).then(() => {
      alert("Successfully Saved")
      window.location.href = "/profile"
    })
  }else{
    return
  }
}

function trimImgName(name){
  var checkRadioId1 =  name.replace("/images/" , "")
  var checkRadioId2 =  checkRadioId1.replace(".png" , "")

  return checkRadioId2;
}

//checking streaks 
// Assuming that "latestSubmissionDate", "currentStreak", "oneDayStreak", "threeDayStreak", "oneWeekStreak", and "twoWeekStreak" are fields in the Firestore document
const userRef = db.collection("users").doc(user.uid);

// Get the Firestore document for the user
userRef.get().then(userDoc => {
  if (userDoc.exists) {
    // Retrieve the latest submission date from the Firestore document
    const latestSubmissionDate = userDoc.data().latestSubmissionDate.toDate();

    // Calculate the time difference between the latest submission and the current time
    const timeDiffInMs = Date.now() - latestSubmissionDate.getTime();

    // Convert the time difference to days
    const timeDiffInDays = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24));

    // Check if the user has a current streak
    if (timeDiffInDays <= 1) {
      // User has a 1 day streak
      const newStreak = userDoc.data().currentStreak + 1;

      // Update the "currentStreak" field in Firestore
      userRef.update({ currentStreak: newStreak });

      // Check if the user has a 1 day streak
      if (newStreak >= 1) {
        // User has a 1 day streak
        userRef.update({ oneDayStreak: true });
      }

      // Check if the user has a 3 day streak
      if (userDoc.data().currentStreak >= 3) {
        // User has a 3 day streak
        userRef.update({ threeDayStreak: true });
      }

      // Check if the user has a 1 week streak
      if (timeDiffInDays <= 7 && userDoc.data().currentStreak >= 7) {
        // User has a 1 week streak
        userRef.update({ oneWeekStreak: true });
      }

      // Check if the user has a 2 week streak
      if (timeDiffInDays <= 14 && userDoc.data().currentStreak >= 14) {
        // User has a 2 week streak
        userRef.update({ twoWeekStreak: true });
      }
    } else {
      // User does not have a current streak
      // Update the "currentStreak" field in Firestore to 0
      userRef.update({ currentStreak: 0 });
    }
  } else {
    console.log("User does not exist in Firestore.");
  }
}).catch(error => {
  console.log("Error getting user document: ", error);
});

//showing badge

// Get the Firestore document for the user
userRef.get().then(userDoc => {
  if (userDoc.exists) {
    const oneDayStreakBadge = document.getElementById("oneDayStreakBadge");
    const threeDayStreakBadge = document.getElementById("threeDayStreakBadge");
    const oneWeekStreakBadge = document.getElementById("oneWeekStreakBadge");
    const twoWeekStreakBadge = document.getElementById("twoWeekStreakBadge");

    // Check if the user has achieved the 1 day streak
    if (userDoc.data().oneDayStreak) {
      // Show the 1 day streak badge
      oneDayStreakBadge.style.display = "inline-block";
    } else {
      // Hide the 1 day streak badge
      oneDayStreakBadge.style.display = "none";
    }

    // Check if the user has achieved the 3 day streak
    if (userDoc.data().threeDayStreak) {
      // Show the 3 day streak badge
      threeDayStreakBadge.style.display = "inline-block";
    } else {
      // Hide the 3 day streak badge
      threeDayStreakBadge.style.display = "none";
    }

    // Check if the user has achieved the 1 week streak
    if (userDoc.data().oneWeekStreak) {
      // Show the 1 week streak badge
      oneWeekStreakBadge.style.display = "inline-block";
    } else {
      // Hide the 1 week streak badge
      oneWeekStreakBadge.style.display = "none";
    }

    // Check if the user has achieved the 2 week streak
    if (userDoc.data().twoWeekStreak) {
      // Show the 2 week streak badge
      twoWeekStreakBadge.style.display = "inline-block";
    } else {
      // Hide the 2 week streak badge
      twoWeekStreakBadge.style.display = "none";
    }
  } else {
    console.log("User does not exist in Firestore.");
  }
}).catch(error => {
  console.log("Error getting user document: ", error);
});

