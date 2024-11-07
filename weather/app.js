let url = "";
let descriptions = "";

// initialize on page load
window.onload = function () {
    fetchDescriptions();
};

// get weather for a given city
function getWeather() {
    const city = document.getElementById('city-input').value;
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    fetchLatLong();
    url = `https://api.open-meteo.com/v1/forecast?latitude=48.552392&longitude=-123.397192&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,wind_speed_10m,wind_direction_10m&timezone=America%2FLos_Angeles&forecast_days=14`;
    fetchWeather();
}

// get lat long of search request
fetchLatLong() {
    fetch('https://geocode.maps.co/search?q=Victoria+BC')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          const { lat, lon } = data[0]; // Take the first result
          console.log(`Latitude: ${lat}, Longitude: ${lon}`);
        } else {
          console.log('Location not found');
        }
      })
      .catch(error => {
        console.error('Error fetching coordinates:', error);
      });
} // fetchLatLong

// get weather forecast for Victoria
function fetchWeather() {
  fetch(url)
    .then(response => response.json())
    .then(data => updateWeather(data))
    .catch(error => console.error("Unable to fetch data:", error));
} // fetchWeather

function updateWeather(data) {
    console.log(data);
    const {current, current_units} = data;
    const weather_code = current.weather_code;
    document.getElementById('weather-result').innerHTML = current.temperature_2m + " " + current_units.temperature_2m + "<br><img src='" + descriptions[weather_code]["day"]["image"] + "'><br>" + descriptions[weather_code]["day"]["description"] ;
} // updateWeather
  
// read in descriptions for WMO Weather codes
function fetchDescriptions() {
  fetch("descriptions.json")
    .then(response => response.json())
    .then(data => setDescriptions(data))
    .catch(error => console.error("Unable to fetch descriptions :", error));
} // fetchDescriptions

function setDescriptions(data) {
    console.log(data);
    descriptions = data;
}  // setDescriptions
