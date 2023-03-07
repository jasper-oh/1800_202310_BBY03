//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
  apiKey: "AIzaSyAoTbBaZgJTT-p4LjPjifkF3_5oQbG2QUE",
  authDomain: "fir-comp1800-295c1.firebaseapp.com",
  projectId: "fir-comp1800-295c1",
  storageBucket: "fir-comp1800-295c1.appspot.com",
  messagingSenderId: "54295633992",
  appId: "1:54295633992:web:2d10921d8c244b286a387d"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

