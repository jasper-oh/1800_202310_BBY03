//read name into mainPage after Howdy
document.getElementById(
  "animal-name-goes-here"
).innerText = `${localStorage.getItem("animal")}, `;

// insert animal image as card image
function insertAnimalImage() {
  let src = `images/${localStorage.getItem("animal")}.png`;
  const card2 = document.getElementById("content2Image");
  card2.src = src;
}
insertAnimalImage();

// toggle1
const slider1 = document.getElementById("my-slider1");
const toggleLeft1 = document.getElementById("switch-left1");
const toggleRight1 = document.getElementById("switch-right1");

slider1.addEventListener("input", () => {
  if (slider1.value == slider1.min) {
    toggleLeft1.style.display = "block";
  } else {
    toggleLeft1.style.display = "none";
  }

  if (slider1.value == slider1.max) {
    toggleRight1.style.display = "block";
  } else {
    toggleRight1.style.display = "none";
  }
});

// Auto update slider label1 when drag

var sliderLabel1 = document.getElementById("temp-rating-label-goes-here");

slider1.addEventListener("input", function () {
  let slider1Value = parseInt(slider1.value);
  switch (slider1Value) {
    case 1:
      sliderLabel1.innerHTML = "Very cold!";
      break;
    case 2:
      sliderLabel1.innerHTML = "It feels colder";
      break;
    case 3:
      sliderLabel1.innerHTML = "Exactly how it feels!";
      break;
    case 4:
      sliderLabel1.innerHTML = "It feels warmer";
      break;
    case 5:
      sliderLabel1.innerHTML = "Very hot!";
      break;
  }
});

//toggle 2
var slider2 = document.getElementById("my-slider2");
const toggleLeft2 = document.getElementById("switch-left2");
const toggleRight2 = document.getElementById("switch-right2");
slider2.addEventListener("input", () => {
  if (slider2.value == slider2.min) {
    toggleLeft2.style.display = "block";
  } else {
    toggleLeft2.style.display = "none";
  }

  if (slider2.value == slider2.max) {
    toggleRight2.style.display = "block";
  } else {
    toggleRight2.style.display = "none";
  }
});

// Auto update slider label1 when drag
var sliderLabel2 = document.getElementById("humidity-rating-label-goes-here");

slider2.addEventListener("input", function () {
  let slider2Value = parseInt(slider2.value);
  switch (slider2Value) {
    case 1:
      sliderLabel2.innerHTML = "Very Dry!";
      break;
    case 2:
      sliderLabel2.innerHTML = "It feels less humid";
      break;
    case 3:
      sliderLabel2.innerHTML = "Exactly how it feels!";
      break;
    case 4:
      sliderLabel2.innerHTML = "It feels more humid";
      break;
    case 5:
      sliderLabel2.innerHTML = "Very Damp!";
      break;
  }
});

// get reference to the submit button
const submitBtn = document.getElementById("submit-btn");

// Lat and long data convert to GeoPoint
const lat = localStorage.getItem("lat");
const long = localStorage.getItem("long");
var coords = new firebase.firestore.GeoPoint(lat, long);

// add event listener to the submit button
function submitBtnClicked() {
  //Get the data from user input
  const city = localStorage.getItem("location");
  const curTemp = document.getElementById("my-slider1").value;
  const curHumidity = document.getElementById("my-slider2").value;
  const comment = document.getElementById("commentArea").value;

  // Get the toggle data
  const extremeCold = document.getElementById("mySwitchLeft1").checked;
  const extremeHot = document.getElementById("mySwitchRight1").checked;
  const extremeDry = document.getElementById("mySwitchLeft2").checked;
  const extremeWet = document.getElementById("mySwitchRight2").checked;

  // Save the data to ratings collection
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;

      currentUser.get().then((userDoc) => {
        var userEmail = userDoc.data().email;
        var userImg = userDoc.data().userImg;
        db.collection("ratings")
          .add({
            city: city,
            cold: extremeCold,
            comment: comment,
            coords: coords,
            curHumidity: curHumidity,
            curTemp: curTemp,
            email: userEmail,
            hot: extremeHot,
            likes: 0,
            superDry: extremeDry,
            superHumid: extremeWet,
            uploadTime: firebase.firestore.FieldValue.serverTimestamp(),
            userID: userID,
            userImg: userImg,
            animal: localStorage.getItem("animal"),
          })
          .then(() => {
            // create alert window
            alert("Your Howdy Score submitted!");
            //Save Done logic!
            console.log("save done");
          });
      });
    } else {
      console.log("unsaved");
    }
  });
}

//open weather api key
const apiKey = "09493051d39bc31a23363d3b99bf7f81";

// Get the user's current location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    localStorage.setItem("lat", latitude);
    localStorage.setItem("long", longitude);

    // Use the latitude and longitude coordinates to fetch the weather data from the OpenWeather API
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Extract the temperature, location, humidity from API
        const temperature = data.main.temp;
        const cityName = data.name;
        const humidity = data.main.humidity;

        //store city name into localStorage
        localStorage.setItem("location", cityName);

        // Convert temperature from Kelvin to Celsius
        const celsiusTemperature = temperature - 273.15;

        //display the location on the webpage
        // const cityElement = document.getElementById("city");
        // cityElement.textContent = cityName;

        //display the temp on the webpage
        const forecastTempElement = document.getElementById("forecastTemp");
        forecastTempElement.textContent = `${celsiusTemperature.toFixed(1)}°C`;

        // Display the humidity on the webpage
        const forecastHumidityElement =
          document.getElementById("forecastHumidity");
        forecastHumidityElement.textContent = `${humidity}%`;
      })
      .catch((error) => console.error(error));
  },
  (error) => {
    console.error(error);
  }
);


//date
// const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   const now = new Date();
//   const month = months[now.getMonth()];
//   const day = now.getDate();
//   const formattedDate = `${month} ${day}`;

//   document.getElementById("current-date").textContent = formattedDate;

  //time
  // function displayTime() {
  //   var now = new Date();
  //   var hours = now.getHours();
  //   var minutes = now.getMinutes();
  //   var seconds = now.getSeconds();
  //   var timeString = hours + ':' + minutes + ':' + seconds;
  //   document.getElementById('time').innerHTML = timeString;
  // }
  // setInterval(displayTime, 1000); // update the time every second