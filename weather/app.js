// app.js
async function getWeather() {
    const city = document.getElementById('city-input').value;
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    const apiKey = 'YOUR_API_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod !== 200) {
            document.getElementById('weather-result').innerHTML = `Error: ${data.message}`;
            return;
        }
        
        const { main, weather, name } = data;
        const description = weather[0].description;
        const temp = main.temp;

        document.getElementById('weather-result').innerHTML = `
            <h2>${name}</h2>
            <p>${description}</p>
            <p>Temperature: ${temp}°C</p>
        `;
    } catch (error) {
        document.getElementById('weather-result').innerHTML = "Unable to fetch weather data.";
    }
}
