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

function handleWeatherPreferenceSet() {
  let tempPreference = document.getElementById("slider1").value;
  let humidityPreference = document.getElementById("slider2").value;

  if (userCheck == true) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.uid); // let me to know who is the user that logged in to get the UID
        currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
        currentUser.get().then(userDoc => {
          db.collection("users").doc(user.uid).update({
            preferTemp: tempPreference,
            preferHumid: humidityPreference,
          }).then(() => {
            var userCheck = confirm("Do you want to save?");

          })
        })
      }
    })
    location.href = "/main"
  } else {
    return;
  }
}


function insertNameFromFirestore() {
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log(user.uid); // let me to know who is the user that logged in to get the UID
      currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
      currentUser.get().then(userDoc => {
        //get the user name
        var userName = userDoc.data().name;
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

        $(".user-photo").attr("src", userImg)

      })
    }
  })
}

insertNameFromFirestore()

function editClick(EditUserId) {
  db.collection("users").doc(EditUserId).get().then(userDoc => {
    var userImg = userDoc.data().userImg
    var radioId = "#" + trimImgName(userImg)
    $(radioId).prop("checked", true)
  })
  $("#profileModal").modal("show")
}

function saveUserProfileImg(EditUserId) {
  var getCheckedImg = $('input[name=profile]:checked').val();

  var userCheck = confirm("Do you want to save it?");

  if (userCheck == true) {
    db.collection("users").doc(EditUserId).update({
      userImg: getCheckedImg,
    }).then(() => {
      alert("Successfully Saved")
      window.location.href = "/profile"
    })
  } else {
    return
  }
}

function trimImgName(name) {
  var checkRadioId1 = name.replace("/images/", "")
  var checkRadioId2 = checkRadioId1.replace(".png", "")

  return checkRadioId2;
}


firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    //user is signed in, pass user into checkStreak
    checkStreak(user);
    console.log(user.uid);

  } else {
    //not signed in
    console.log("not signed in");
  }
});



function checkStreak(user) {
  if (user) {
    const ratingsRef = db.collection("ratings")
      .where("userID", "==", user.uid)
      .orderBy("uploadTime", "desc")
      .get()
      .then(querySnapshot => {
        const ratings = querySnapshot.docs.map(doc => doc.data());

        let streak = 0;
        let currentDate = new Date();
        //iterate through every rating they posted
        for (let i = 0; i < ratings.length; i++) {
          const ratingDate = ratings[i].uploadTime.toDate();
          const timeDiff = Math.floor((currentDate - ratingDate) / (1000 * 60 * 60 * 24));
          if (timeDiff <= 1) {
            streak++;
            currentDate = ratingDate;
          } else {
            break;
          }
        }

        const hasOneDayStreak = streak >= 1;
        const hasThreeDayStreak = streak >= 3;
        const hasOneWeekStreak = streak >= 7;
        const hasTwoWeekStreak = streak >= 14;

        if (hasOneDayStreak) {
          console.log("1 day streak");
          document.getElementById("oneDayStreakBadge").style.display = "inline-block";
        } else {
          document.getElementById("oneDayStreakBadge").style.display = "none";
        }

        if (hasThreeDayStreak) {
          console.log("3 day streak");
          document.getElementById("threeDayStreakBadge").style.display = "inline-block";
        } else {
          document.getElementById("threeDayStreakBadge").style.display = "none";
        }

        if (hasOneWeekStreak) {
          console.log("1 week streak");
          document.getElementById("oneWeekStreakBadge").style.display = "inline-block";
        } else {
          document.getElementById("oneWeekStreakBadge").style.display = "none";
        }

        if (hasTwoWeekStreak) {
          console.log("2 week streak");
          document.getElementById("twoWeekStreakBadge").style.display = "inline-block";
        } else {
          document.getElementById("twoWeekStreakBadge").style.display = "none";
        }
      })
      .catch(error => {
        console.log("Error getting ratings: ", error);
      });
  } else {
    console.log("User is not logged in.");
  }
}
