function handleWeatherPreferenceSet() {
  var db = firebase.firestore();
  var user = firebase.auth().currentUser;
  var selectedAnimal = document.getElementById("animal-names").value;
  var preferTemp;
  var preferHumid;

  if (selectedAnimal == "camel") {
    preferTemp = 3;
    preferHumid = 3;
  } else if (selectedAnimal == "squirrel") {
    preferTemp = 2;
    preferHumid = 2;
  } else if (selectedAnimal == "bear") {
    preferTemp = 1;
    preferHumid = 1;
  }

  // Confirmation alert
  var confirmation = confirm("Are you sure?");

  if (confirmation) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          db.collection("users")
            .doc(user.uid)
            .update({
              preferTemp: preferTemp,
              preferHumid: preferHumid,
            })
            .then(() => {
              //show alert
              alert("Your weather preferences have been saved!");
              // Display animal image
              displayAnimalImage();
            });
        } else {
          db.collection("users")
            .doc(user.uid)
            .set({
              animal: selectedAnimal,
              preferTemp: preferTemp,
              preferHumid: preferHumid,
            })
            .then(() => {
              //show alert
              alert("Your weather preferences have been saved!");
              // Display animal image
              displayAnimalImage();
            });
        }
      });
  }
}

function getImageUrlForAnimal(animal) {
  if (animal == "camel") {
    return "/images/camel.png";
  } else if (animal == "squirrel") {
    return "/images/squirrel.png";
  } else if (animal == "bear") {
    return "/images/bear.png";
  }
}

function displayAnimalImage() {
  var db = firebase.firestore();
  var user = firebase.auth().currentUser;

  if (user) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          var preferTemp = doc.data().preferTemp;
          var animal;
          if (preferTemp == 3) {
            animal = "camel";
          } else if (preferTemp == 2) {
            animal = "squirrel";
          } else if (preferTemp == 1) {
            animal = "bear";
          }
          var animalImage = document.getElementById("animal-goes-here");
          animalImage.src = getImageUrlForAnimal(animal);
        }
      });
  } else {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              var preferTemp = doc.data().preferTemp;
              var animal;
              if (preferTemp == 3) {
                animal = "camel";
              } else if (preferTemp == 2) {
                animal = "squirrel";
              } else if (preferTemp == 1) {
                animal = "bear";
              }
              var animalImage = document.getElementById("animal-goes-here");
              animalImage.src = getImageUrlForAnimal(animal);
            }
          });
      }
    });
  }
}

window.onload = function () {
  displayAnimalImage();
};

//disable the "save changes" button if the default option is selected
function handleAnimalSelectionChange() {
  var animalDropdown = document.getElementById("animal-names");
  var saveChangesBtn = document.getElementById("save-changes-btn");
  if (animalDropdown.value === "") {
    saveChangesBtn.disabled = true;
  } else {
    saveChangesBtn.disabled = false;
  }
}

function insertNameFromFirestore() {
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid); // let me to know who is the user that logged in to get the UID
      currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
      currentUser.get().then((userDoc) => {
        //get the user name
        var userName = userDoc.data().name;
        localStorage.setItem("name", userName);
        $(".edit-profile-photo-btn").attr("id", user.uid);
        $(".save-profile-img-btn").attr("id", user.uid);

        //get the user Img
        var userImg = userDoc.data().userImg;

        // //get The user prefer Temp
        var userPreferTemp = userDoc.data().preferTemp;
        var userPreferHumid = userDoc.data().preferHumid;

        //$("#name-goes-here").text(userName); //jquery
        document.getElementById("name-goes-here").innerText = userName;
        // document.getElementById("slider2").setAttribute("value", userPreferTemp);
        // document.getElementById("slider1").setAttribute("value", userPreferHumid);
        // document.getElementById('sliderValueLabel2').innerText = userPreferHumid;
        // document.getElementById('sliderValueLabel1').innerText = userPreferTemp;

        $(".user-photo").attr("src", userImg);
      });
    }
  });
}

insertNameFromFirestore();

function editClick(EditUserId) {
  db.collection("users")
    .doc(EditUserId)
    .get()
    .then((userDoc) => {
      var userImg = userDoc.data().userImg;
      var radioId = "#" + trimImgName(userImg);
      $(radioId).prop("checked", true);
    });
  $("#profileModal").modal("show");
}

function saveUserProfileImg(EditUserId) {
  var getCheckedImg = $("input[name=profile]:checked").val();

  var userCheck = confirm("Do you want to save it?");

  if (userCheck == true) {
    db.collection("users")
      .doc(EditUserId)
      .update({
        userImg: getCheckedImg,
      })
      .then(() => {
        alert("Successfully Saved");
        window.location.href = "/profile";
      });
  } else {
    return;
  }
}

function trimImgName(name) {
  var checkRadioId1 = name.replace("/images/", "");
  var checkRadioId2 = checkRadioId1.replace(".png", "");

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
    const ratingsRef = db
      .collection("ratings")
      .where("userID", "==", user.uid)
      .orderBy("uploadTime", "desc")
      .get()
      .then((querySnapshot) => {
        const ratings = querySnapshot.docs.map((doc) => doc.data());

        let streak = 0;
        let currentDate = new Date();
        //iterate through every rating they posted
        for (let i = 0; i < ratings.length; i++) {
          const ratingDate = ratings[i].uploadTime.toDate();
          const timeDiff = Math.floor(
            (currentDate - ratingDate) / (1000 * 60 * 60 * 24)
          );
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
          document.getElementById("oneDayStreakBadge").style.display =
            "inline-block";
        } else {
          document.getElementById("oneDayStreakBadge").style.display = "none";
        }

        if (hasThreeDayStreak) {
          console.log("3 day streak");
          document.getElementById("threeDayStreakBadge").style.display =
            "inline-block";
        } else {
          document.getElementById("threeDayStreakBadge").style.display = "none";
        }

        if (hasOneWeekStreak) {
          console.log("1 week streak");
          document.getElementById("oneWeekStreakBadge").style.display =
            "inline-block";
        } else {
          document.getElementById("oneWeekStreakBadge").style.display = "none";
        }

        if (hasTwoWeekStreak) {
          console.log("2 week streak");
          document.getElementById("twoWeekStreakBadge").style.display =
            "inline-block";
        } else {
          document.getElementById("twoWeekStreakBadge").style.display = "none";
        }
      })
      .catch((error) => {
        console.log("Error getting ratings: ", error);
      });
  } else {
    console.log("User is not logged in.");
  }
}
