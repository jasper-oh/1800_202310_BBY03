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
      });
    }
  });
}


insertAnimalFromFirestore();
