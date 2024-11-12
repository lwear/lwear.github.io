// Base URL and API keys
const openMeteoUrl = 'https://api.open-meteo.com/v1/forecast';
const locationIQKey = 'pk.6f2e275cd0c550039a21742db37051f4';

// Global vars
let descriptions = "";
let lat = 0;
let long = 0;
let city = "";

// initialize on page load
window.onload = function () {

  // get descriptions and images for weather codes
  fetchDescriptions();

  // Add event listener to the input field
  document.getElementById('city-input').addEventListener('input', autocomplete2);
  document.getElementById('city-input').setAttribute("autocomplete", "off");



};


// read in descriptions for WMO Weather codes
async function fetchDescriptions() {
  try {
    const response = await fetch("descriptions.json");
    const data = await response.json();
    descriptions = data;
  } catch (error) {
    console.error("Unable to fetch descriptions:", error);
  }
} // fetchDescriptions



// get weather for a given city from search field
function startSearch() {

  city = document.getElementById('city-input').value;
  if (!city) {
    alert("Please enter a city name.");
    return;
  }
  getWeatherForLocation(city);
}



// Main function to get weather for a specific location
async function getWeatherForLocation(query) {
  try {
    // Step 1: Get latitude and longitude from LocationIQ based on the search query
    const { lat, lon } = await getLatLon(query);
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);

    // Step 2: Get timezone information based on latitude and longitude
    const timezone = await getTimezone(lat, lon);
    console.log(`Timezone: ${timezone}`);

    // Step 3: Get weather data based on latitude, longitude, and timezone
    const weatherData = await getWeather(lat, lon, timezone);

    // Step 4: Display weather data
    displayWeather(weatherData);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to get latitude and longitude from LocationIQ
async function getLatLon(query) {
  const geoUrl = `https://us1.locationiq.com/v1/search.php?key=${locationIQKey}&q=${encodeURIComponent(query)}&format=json`;
  const response = await fetch(geoUrl);
  if (!response.ok) throw new Error('Error fetching geocode data');
  const data = await response.json();
  return { lat: data[0].lat, lon: data[0].lon };
}

// Function to get timezone from LocationIQ
async function getTimezone(lat, lon) {
  const timezoneUrl = `https://us1.locationiq.com/v1/timezone.php?key=${locationIQKey}&lat=${lat}&lon=${lon}`;
  const response = await fetch(timezoneUrl);
  if (!response.ok) throw new Error('Error fetching timezone data');
  const data = await response.json();
  return data.timezone.name;
}

// Function to get weather data from Open-Meteo
async function getWeather(lat, lon, timezone) {
  const weatherUrl = `${openMeteoUrl}?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=${timezone}`;
  const response = await fetch(weatherUrl);
  if (!response.ok) throw new Error('Error fetching weather data');
  return await response.json();
}

// Function to display weather data
function displayWeather(weatherData) {
  console.log(weatherData);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const { current, current_units } = weatherData;
  const weather_code = current.weather_code;

  // current weather
  let d = new Date(current.time);
  let wd = d.getDay();

  let elem = document.getElementById("currentWeather");
  elem.innerHTML = `
    <div class="city"><b>${city}</b></div>
    <div class="weathericon"><img src="${descriptions[weather_code].day.image}"></div>
    <div><span class="temp">${current.temperature_2m}</span><sup>${current_units.temperature_2m}</sup></div>
    </div>
    <div>${descriptions[weather_code].day.description}<br>Feels ${current.apparent_temperature}</div>
  `;
  document.getElementById("currentWeatherContainer").style.display = "block";
  
  // forecast
  console.log('Weather for the next 7 days:');
  const { daily } = weatherData;
  daily.time.forEach((date, index) => {
    console.log(`${date}: Max Temp: ${daily.temperature_2m_max[index]}°C, Min Temp: ${daily.temperature_2m_min[index]}°C`);
  });

  elem = document.getElementById("forecastWeather");
  elem.innerHTML = "";
  daily.time.forEach((date, index) => {
    d = new Date(date);
    wd = d.getDay();
   // let weekDay = wee
    let newDiv = document.createElement("div");
    newDiv.style.display = "inline-block";
    newDiv.innerHTML += `
      ${days[wd]}
      <br>
      <img src="${descriptions[daily.weather_code[index]].day.image}">
      <br>
      <b>${descriptions[daily.weather_code[index]].day.description}</b><br>
      H: ${daily.temperature_2m_max[index]}°C,<br>L: ${daily.temperature_2m_min[index]}°C
      `;
      elem.append(newDiv);
  });

  

  document.getElementById("forecastContainer").style.display = "block";

} // displayWeather


let debounceTimer; // used to limit number of requests made to autocomplete api


async function autocomplete() {
  const input = document.getElementById('city-input').value;  // Get the input value

  // Only perform the search if the input is at least 3 characters
  if (input.length < 3) {
    return;
  }

  // Clear the previous debounce timer if the user is typing quickly
  clearTimeout(debounceTimer);

  // Set a new debounce timer to wait 500ms after the last keystroke
  debounceTimer = setTimeout(async () => {
    // Construct the URL for the LocationIQ Geocoding API (search endpoint)
    const url = `https://us1.locationiq.com/v1/search.php?key=${locationIQKey}&q=${encodeURIComponent(input)}&format=json&limit=5&dedupe=1&tag=type:city,town,municipality&countrycodes=CA`;

    try {
      // Fetch the data from LocationIQ API
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error fetching autocomplete data');
      }
      const data = await response.json();
      console.log(data);

      // Clear any existing autocomplete suggestions
      const suggestionList = document.getElementById('autocomplete-items');
      suggestionList.innerHTML = '';

      // Check if data exists and iterate through the results to display suggestions
      if (data && data.length > 0) {
        data.forEach(result => {
          const suggestionItem = document.createElement('div');
          suggestionItem.innerHTML = result.display_name; // Display the place name
          suggestionItem.addEventListener('click', () => {
            // Set the input field value when a suggestion is clicked
            document.getElementById('city-input').value = result.display_name;
            // Optionally, trigger further actions like fetching weather for the selected location
            suggestionList.innerHTML = '';  // Clear suggestions
          });
          suggestionList.appendChild(suggestionItem); // Add suggestion to the list
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, 300);  // 300ms delay after the user stops typing
} // autocomplete

// this one prioritizes results from US/Canada
async function autocomplete2() {
  const query = document.getElementById('city-input').value;  // Get the input value

  // Only perform the search if the input is at least 3 characters
  if (query.length < 3) {
    return;
  }

  // Clear the previous debounce timer if the user is typing quickly
  clearTimeout(debounceTimer);

  // Set a new debounce timer to wait 500ms after the last keystroke
  debounceTimer = setTimeout(async () => {


    // Fetch primary (Canada/US) results
    const primaryResponse = await fetch(`https://us1.locationiq.com/v1/autocomplete.php?key=${locationIQKey}&q=${query}&countrycodes=ca,us&dedupe=1&tag=place:city&limit=5&format=json`);
    const primaryData = await primaryResponse.json();

    // Fetch global results as fallback
    const globalResponse = await fetch(`https://us1.locationiq.com/v1/autocomplete.php?key=${locationIQKey}&q=${query}&dedupe=1&tag=place:city&limit=5&format=json`);
    const globalData = await globalResponse.json();

    // Combine results, prioritizing Canada/US
    const combinedResults = [...primaryData, ...globalData];

    // Remove exact duplicates
    const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.place_id, item])).values());

    // Clean up display text and filter out low-importance or obscure results if necessary
    // Process and clean up unique results
    const cleanedResults = [];
    for(current of uniqueResults){
      let obj = {
          name: current.address.name, 
          state:current.address.state, 
          country:current.address.country
      };
      cleanedResults.push(obj);
    }


    // Clear any existing autocomplete suggestions
    const suggestionList = document.getElementById('autocomplete-items');
    suggestionList.innerHTML = '';
    
    // Check if data exists and iterate through the results to display suggestions
    if (cleanedResults && cleanedResults.length > 0) {
      cleanedResults.forEach(result => {
        const suggestionItem = document.createElement('div');
        let display_name = result.name + ", ";
        display_name += (result.state) ? result.state + ", " : "";
        display_name += (result.country) ? result.country : "";
        suggestionItem.innerHTML = display_name;
        suggestionItem.addEventListener('click', () => {
          // Set the input field value when a suggestion is clicked
          document.getElementById('city-input').value = display_name;
          // Optionally, trigger further actions like fetching weather for the selected location
          suggestionList.innerHTML = '';  // Clear suggestions
        });
        suggestionList.appendChild(suggestionItem); // Add suggestion to the list
      });
    }



  }, 500);  // 300ms delay after the user stops typing

} // autocomplete
