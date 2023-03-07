//----------------------------------------
//  Your web app's Firebase configuration

const firebaseConfig = {
  //----------------------------------------
  //  Your web app's Firebase configuration
  apiKey: "AIzaSyDMl_AloCkqNKHXVSi931bgErWsP13dK_M",
  authDomain: "howdy-weather-d2926.firebaseapp.com",
  projectId: "howdy-weather-d2926",
  storageBucket: "howdy-weather-d2926.appspot.com",
  messagingSenderId: "173705875311",
  appId: "1:173705875311:web:e5503ed577355fdc20229a",
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
