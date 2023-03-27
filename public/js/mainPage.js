//open weather api key
const apiKey = "09493051d39bc31a23363d3b99bf7f81";

// Get the user's current location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

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
        const cityElement = document.getElementById("city");
        cityElement.textContent = cityName;

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

        document.getElementById("animal-name-goes-here").innerText =
          selectedAnimal;
      });
    }
  });
}

insertAnimalFromFirestore();

// insert animal image as card image
function insertAnimalImage() {
  let src = `images/${localStorage.getItem("animal")}.png`;
  const card2 = document.getElementById("content2Image");
  card2.src = src;
}
insertAnimalImage();

// Calculate the average of temp user rating when user selected the same animals
function insertTempUserRatings() {
  firebase.auth().onAuthStateChanged((user) => {
    const selectedAnimal = localStorage.getItem("animal");
    const tempUserRating = document.getElementById("temp-rating-goes-here");

    if (user) {
      const usersRef = db.collection("ratings");
      usersRef
        .where("animal", "==", selectedAnimal)
        .get()
        .then((querySnapshot) => {
          let sum = 0;
          let count = 0;

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            sum += data.curTemp;
            count++;
          });
          console.log(`temp sum is ${sum}`);
          console.log(`temp count is ${count}`);

          const tempAverageNum = count > 0 ? sum / count : 0;

          console.log(
            `Average temp rating for ${selectedAnimal}: ${tempAverageNum}`
          );

          if (tempAverageNum <= 5 && tempAverageNum > 4) {
            tempUserRating.innerText = "Very Hot!";
          } else if (tempAverageNum <= 4 && tempAverageNum > 3) {
            tempUserRating.innerText = "It feels warmer";
          } else if (tempAverageNum <= 3 && tempAverageNum > 2) {
            tempUserRating.innerText = "Exactly how I feel!";
          } else if (tempAverageNum <= 2 && tempAverageNum > 1) {
            tempUserRating.innerText = "It feels colder!";
          } else if (tempAverageNum <= 1) {
            tempUserRating.innerText = "Very cold";
          } else {
            tempUserRating.innerText = "Sorry, no rating yet";
          }
        });
    }
  });
}
insertTempUserRatings();

// Calculate the average of humidity user rating when user selected the same animals
function insertHumidtyUserRatings() {
  firebase.auth().onAuthStateChanged((user) => {
    const selectedAnimal = localStorage.getItem("animal");
    const humidityUserRating = document.getElementById(
      "humidity-rating-goes-here"
    );

    if (user) {
      const usersRef = db.collection("ratings");
      usersRef
        .where("animal", "==", selectedAnimal)
        .get()
        .then((querySnapshot) => {
          let sum = 0;
          let count = 0;

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            sum += data.curHumidity;
            count++;
          });
          console.log(`humidity sum is ${sum}`);
          console.log(`humidity count is ${count}`);

          const humidityAverageNum = count > 0 ? sum / count : 0;

          console.log(
            `Average humidity rating for ${selectedAnimal}: ${humidityAverageNum}`
          );

          if (humidityAverageNum <= 5 && humidityAverageNum > 4) {
            humidityUserRating.innerText = "Very Dry!";
          } else if (humidityAverageNum <= 4 && humidityAverageNum > 3) {
            humidityUserRating.innerText = "It feels less humid";
          } else if (humidityAverageNum <= 3 && humidityAverageNum > 2) {
            humidityUserRating.innerText = "Exactly how I feel!";
          } else if (humidityAverageNum <= 2 && humidityAverageNum > 1) {
            humidityUserRating.innerText = "It feels more humid!";
          } else if (humidityAverageNum <= 1) {
            humidityUserRating.innerText = "Very Damp";
          } else {
            humidityUserRating.innerText = "Sorry, no rating yet";
          }
        });
    }
  });
}
insertHumidtyUserRatings();
