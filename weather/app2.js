// Replace with your actual API keys
const locationIQKey = 'pk.6f2e275cd0c550039a21742db37051f4';

// Global vars
let descriptions = "";
let lat = 0;
let long = 0;

// initialize on page load
window.onload = function () {

    // get descriptions and images for weather codes
    fetchDescriptions();

    // Add event listener to the input field
    document.getElementById('city-input').addEventListener('input', autocomplete);
};


// read in descriptions for WMO Weather codes
function fetchDescriptions() {
  fetch("descriptions.json")
    .then(response => response.json())
    .then(data => {descriptions = data;})
    .catch(error => console.error("Unable to fetch descriptions :", error));
} // fetchDescriptions



// get weather for a given city from search field
function getWeather() {
   
    city = document.getElementById('city-input').value;
    if (!city) {
        alert("Please enter a city name.");
        return;
    }
    getWeatherForLocation(city);
}

// Function to perform all the fetch requests
function getWeatherForLocation(query) {
  // Step 1: Fetch Lat/Lon from LocationIQ based on the search query (Geocoding)
  const geoUrl = `https://us1.locationiq.com/v1/search.php?key=${locationIQKey}&q=${encodeURIComponent(query)}&format=json`;

  fetch(geoUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching geocode data');
      }
      return response.json();
    })
    .then(data => {
      // Step 2: Extract latitude and longitude from the geocode response
      lat = data[0].lat; // Take the first result
      lon = data[0].lon; 
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);

      // Step 3: Fetch Timezone information based on lat/lon (LocationIQ Timezone API)
      const timezoneUrl = `https://us1.locationiq.com/v1/timezone.php?key=${locationIQKey}&lat=${lat}&lon=${lon}`;
      
      return fetch(timezoneUrl); // Return the promise from the next fetch
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching timezone data');
      }
      return response.json();
    })
    .then(data => {
      const timezone = data.timezone.name;
      console.log(`Timezone: ${timezone}`);

      // Step 4: Fetch the weather based on lat, lon, and timezone (you can use Open-Meteo or other weather API)
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=${timezone}`;
      
      return fetch(weatherUrl); // Return the weather data fetch promise
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching weather data');
      }
      return response.json();
    })
    .then(weatherData => {
      // Step 5: Process and display the weather data
      const {current, current_units} = weatherData;
      const weather_code = current.weather_code;
      document.getElementById('weather-result').innerHTML = current.temperature_2m + " " + current_units.temperature_2m + "<br><img src='" + descriptions[weather_code]["day"]["image"] + "'><br>" + descriptions[weather_code]["day"]["description"] ;

      const { daily } = weatherData;
      console.log('Weather for the next 7 days:');
      daily.time.forEach((date, index) => {
        console.log(`${date}: Max Temp: ${daily.temperature_2m_max[index]}°C, Min Temp: ${daily.temperature_2m_min[index]}°C`);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


let debounceTimer; // used to limit number of requests made to autocomplete api

function autocomplete() {
  const input = document.getElementById('city-input').value;  // Get the input value
 
  if (input.length < 3) {
    // Only perform the search if the input is at least 3 characters
    return;
  }

  // Clear the previous debounce timer if the user is typing quickly
  clearTimeout(debounceTimer);

  // Set a new debounce timer to wait 500ms after the last keystroke
  debounceTimer = setTimeout(() => {
    // Construct the URL for the LocationIQ Geocoding API (search endpoint)
    const url = `https://us1.locationiq.com/v1/search.php?key=${locationIQKey}&q=${encodeURIComponent(input)}&format=json&limit=5&tag=place:city`;

    // Fetch the data from LocationIQ API
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching autocomplete data');
        }
        return response.json();
      })
      .then(data => {
        // Clear any existing autocomplete suggestions
        const suggestionList = document.getElementById('suggestions');
        suggestionList.innerHTML = '';

        // Check if data exists and iterate through the results to display suggestions
        console.log(data);
        if (data && data.length > 0) {
          data.forEach(result => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = result.display_name; // Display the place name
            suggestionItem.addEventListener('click', () => {
              // Set the input field value when a suggestion is clicked
              document.getElementById('city-input').value = result.display_name;
              // Optionally, trigger further actions like fetching weather for the selected location
              suggestionList.innerHTML = '';  // Clear suggestions
            });
            suggestionList.appendChild(suggestionItem); // Add suggestion to the list
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, 500);  // 500ms delay after the user stops typing
}


  

  
