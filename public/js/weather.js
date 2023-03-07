var script = document.createElement('script');
const weatherAPI= config.weatherApiKey;
script.src = `https://api.openweathermap.org/data/2.5/weather?lat=49.2492301&lon=-123.0059173&appid=${weatherAPI}`
script.async = true;

