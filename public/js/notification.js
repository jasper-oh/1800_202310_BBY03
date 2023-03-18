// Read from the ratings collection
const ratingsRef = db.collection("ratings");
let notificationText = document.getElementById("notification-goes-here");

let coldCount = 0;
let hotCount = 0;
let superDryCount = 0;
let superHumidCount = 0;
let city = ""; // variable to store the current city being processed
const today = new Date().toISOString().substring(0, 10); //  to get today's date

// Retrieve all documents from the ratings collection
ratingsRef.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const milliseconds =
      data.uploadTime.seconds * 1000 + data.uploadTime.nanoseconds / 1000000;
    const date = new Date(milliseconds).toISOString().substring(0, 10);
    console.log(date);
    if (city === data.city && today === date) {
      if (data.cold === true) {
        coldCount++;
      }
      if (data.hot === true) {
        hotCount++;
      }
      if (data.superDry === true) {
        superDryCount++;
      }
      if (data.superHumid === true) {
        superHumidCount++;
      }
    } else {
      city = data.city;
    }

    if (coldCount >= 5) {
      notificationText.textContent = `Extreme cold weather now in ${city}.`;
      console.log(`Extreme cold weather now in ${city}.`);
    }
    if (hotCount >= 5) {
      notificationText.textContent = `Extreme hot weather now in ${city}.`;
      console.log(`Extreme hot weather now in ${city}.`);
    }
    if (superDryCount >= 5) {
      notificationText.textContent = `Extreme dry weather now in ${city}.`;
      console.log(`Extreme dry weather now in ${city}.`);
    }
    if (superHumidCount >= 5) {
      notificationText.textContent = `Extreme humid weather now in ${city}.`;
      console.log(`Extreme humid weather now in ${city}.`);
    }
  });
});
