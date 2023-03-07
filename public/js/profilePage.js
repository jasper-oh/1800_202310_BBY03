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


function insertNameFromFirestore(){
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged(user =>{
      if (user){
         console.log(user.uid); // let me to know who is the user that logged in to get the UID
         currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
         currentUser.get().then(userDoc=>{
             //get the user name
             var userName= userDoc.data().name;
             console.log(userName);
             //$("#name-goes-here").text(userName); //jquery
             document.getElementById("name-goes-here").innerText = userName;
         })    
     }    
  })
}
insertNameFromFirestore()