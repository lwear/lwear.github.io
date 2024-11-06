// app.js
async function getWeather() {
    const city = document.getElementById('city-input').value;
    if (!city) {
        alert("Please enter a city name.");
        return;
    }
    fetchWeather();
}

// get weather forecast for Victoria
const url = `https://api.open-meteo.com/v1/forecast?latitude=48.552392&longitude=-123.397192&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,wind_speed_10m,wind_direction_10m&timezone=America%2FLos_Angeles&forecast_days=14`;

function fetchWeather() {
  fetch(url)
    .then(response => response.json())
    .then(data => updateWebsite(data) 
    );
} // fetchWeather

function updateWeather(data) {
    document.getElementById('weather-result').innerHTML = "<pre>" + data + "</pre>";
} // updateWeather
  
    
   /* try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod !== 200) {
            document.getElementById('weather-result').innerHTML = `Error: ${data.message}`;
            return;
        }*/
        
       /* const { main, weather, name } = data;
        const description = weather[0].description;
        const temp = main.temp;

        document.getElementById('weather-result').innerHTML = `
            <h2>${name}</h2>
            <p>${description}</p>
            <p>Temperature: ${temp}°C</p>
        `;*/
  /*  } catch (error) {
        document.getElementById('weather-result').innerHTML = "Unable to fetch weather data.";
    }
}*/
