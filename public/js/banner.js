// insert user animal
function insertAnimalFromFirestore() {
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid); // let me to know who is the user that logged in to get the UID
      currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
      currentUser.get().then((userDoc) => {
        //get the user name
        var userName = userDoc.data().name;
        const selectedAnimal = userDoc.data().animal;

        localStorage.setItem("name", userName);
        localStorage.setItem("animal", selectedAnimal);

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

insertAnimalFromFirestore();
