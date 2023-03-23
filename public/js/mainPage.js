//read name into mainPage after Howdy
document.getElementById("welcomeText1").innerText = `Howdy, ${localStorage.getItem("name")}`

//open weather api key
const apiKey = '09493051d39bc31a23363d3b99bf7f81';

// Get the user's current location
navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    localStorage.setItem("lat", latitude);
    localStorage.setItem("long", longitude);

    // Use the latitude and longitude coordinates to fetch the weather data from the OpenWeather API
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Extract the temperature, location, humidity from API
            const temperature = data.main.temp;
            const cityName = data.name;
            const humidity = data.main.humidity;

            //store city name into localStorage
            localStorage.setItem('location', cityName);

            // Convert temperature from Kelvin to Celsius
            const celsiusTemperature = temperature - 273.15;

            //display the location on the webpage
            const cityElement = document.getElementById('city');
            cityElement.textContent = cityName;

            //display the temp on the webpage
            const forecastTempElement = document.getElementById('forecastTemp');
            forecastTempElement.textContent = `${celsiusTemperature.toFixed(1)}°C`;

            // Display the humidity on the webpage
            const forecastHumidityElement = document.getElementById('forecastHumidity');
            forecastHumidityElement.textContent = `${humidity}%`;

        })
        .catch(error => console.error(error));
}, error => {
    console.error(error);
});


// This adds some nice ellipsis to the description:
document.querySelectorAll(".projcard-description").forEach(function(box) {
    $clamp(box, {clamp: 6});
  });