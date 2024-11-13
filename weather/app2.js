/*  TTD  
    - get more data (% precipitaiton, amount precip, wind)
    - hourly


*/


// Base URL and API keys
const openMeteoUrl = 'https://api.open-meteo.com/v1/forecast';
const locationIQKey = 'pk.6f2e275cd0c550039a21742db37051f4';

// Global Data
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const statesAndProvinces = [
  { name: 'Alberta', abbreviation: 'AB' }, { name: 'British Columbia', abbreviation: 'BC' }, { name: 'Manitoba', abbreviation: 'MB' }, { name: 'New Brunswick', abbreviation: 'NB' }, { name: 'Newfoundland and Labrador', abbreviation: 'NL' }, { name: 'Northwest Territories', abbreviation: 'NT' }, { name: 'Nova Scotia', abbreviation: 'NS' }, { name: 'Nunavut', abbreviation: 'NU' }, { name: 'Ontario', abbreviation: 'ON' }, { name: 'Prince Edward Island', abbreviation: 'PE' }, { name: 'Quebec', abbreviation: 'QC' }, { name: 'Saskatchewan', abbreviation: 'SK' }, { name: 'Yukon Territory', abbreviation: 'YT' },
    { name: 'ALABAMA', abbreviation: 'AL'},
    { name: 'ALASKA', abbreviation: 'AK'},
    { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
    { name: 'ARIZONA', abbreviation: 'AZ'},
    { name: 'ARKANSAS', abbreviation: 'AR'},
    { name: 'CALIFORNIA', abbreviation: 'CA'},
    { name: 'COLORADO', abbreviation: 'CO'},
    { name: 'CONNECTICUT', abbreviation: 'CT'},
    { name: 'DELAWARE', abbreviation: 'DE'},
    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
    { name: 'FLORIDA', abbreviation: 'FL'},
    { name: 'GEORGIA', abbreviation: 'GA'},
    { name: 'GUAM', abbreviation: 'GU'},
    { name: 'HAWAII', abbreviation: 'HI'},
    { name: 'IDAHO', abbreviation: 'ID'},
    { name: 'ILLINOIS', abbreviation: 'IL'},
    { name: 'INDIANA', abbreviation: 'IN'},
    { name: 'IOWA', abbreviation: 'IA'},
    { name: 'KANSAS', abbreviation: 'KS'},
    { name: 'KENTUCKY', abbreviation: 'KY'},
    { name: 'LOUISIANA', abbreviation: 'LA'},
    { name: 'MAINE', abbreviation: 'ME'},
    { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
    { name: 'MARYLAND', abbreviation: 'MD'},
    { name: 'MASSACHUSETTS', abbreviation: 'MA'},
    { name: 'MICHIGAN', abbreviation: 'MI'},
    { name: 'MINNESOTA', abbreviation: 'MN'},
    { name: 'MISSISSIPPI', abbreviation: 'MS'},
    { name: 'MISSOURI', abbreviation: 'MO'},
    { name: 'MONTANA', abbreviation: 'MT'},
    { name: 'NEBRASKA', abbreviation: 'NE'},
    { name: 'NEVADA', abbreviation: 'NV'},
    { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
    { name: 'NEW JERSEY', abbreviation: 'NJ'},
    { name: 'NEW MEXICO', abbreviation: 'NM'},
    { name: 'NEW YORK', abbreviation: 'NY'},
    { name: 'NORTH CAROLINA', abbreviation: 'NC'},
    { name: 'NORTH DAKOTA', abbreviation: 'ND'},
    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
    { name: 'OHIO', abbreviation: 'OH'},
    { name: 'OKLAHOMA', abbreviation: 'OK'},
    { name: 'OREGON', abbreviation: 'OR'},
    { name: 'PALAU', abbreviation: 'PW'},
    { name: 'PENNSYLVANIA', abbreviation: 'PA'},
    { name: 'PUERTO RICO', abbreviation: 'PR'},
    { name: 'RHODE ISLAND', abbreviation: 'RI'},
    { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
    { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
    { name: 'TENNESSEE', abbreviation: 'TN'},
    { name: 'TEXAS', abbreviation: 'TX'},
    { name: 'UTAH', abbreviation: 'UT'},
    { name: 'VERMONT', abbreviation: 'VT'},
    { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
    { name: 'VIRGINIA', abbreviation: 'VA'},
    { name: 'WASHINGTON', abbreviation: 'WA'},
    { name: 'WEST VIRGINIA', abbreviation: 'WV'},
    { name: 'WISCONSIN', abbreviation: 'WI'},
    { name: 'WYOMING', abbreviation: 'WY' }
] ;

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
  document.getElementById('city-input').addEventListener('input', autocomplete);
  document.getElementById('city-input').setAttribute("autocomplete", "off");

  document.getElementById("city-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("btn").click();
    }
  });

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

  // Clear any existing autocomplete suggestions
  const suggestionList = document.getElementById('autocomplete-items');
  suggestionList.innerHTML = '';
    
  getWeatherForLocation(city);
  
} // startSearch



// Main function to get weather for a specific location
async function getWeatherForLocation(query) {
  
  try {
    // Get latitude and longitude from LocationIQ based on the search query
    const { lat, lon } = await getLatLon(query);
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);

    // Get timezone information based on latitude and longitude
    const timezone = await getTimezone(lat, lon);
    console.log(`Timezone: ${timezone}`);

    // Get weather data based on latitude, longitude, and timezone
    const weatherData = await getWeather(lat, lon, timezone);

    // Display weather data
    displayWeather(weatherData);

  } catch (error) {
    console.error('Error:', error);
  }
} // getWeatherForLocation

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
  const { current, current_units } = weatherData;
  const weather_code = current.weather_code;

  // current weather
  let d = new Date(current.time);
  let wd = d.getDay();

  // get display name for location
  let location = city.split(", ");  
  let displayName = location[0];
  console.log(location);
  if (location[2] && location[2] == "Canada" || location[2] == "United States of America"){
    let state;// = statesAndProvinces.find(o => o.name === location[1]);
    for (s of statesAndProvinces){
      console.log(s);
      if (s.name.toLowerCase() == location[1].toLowerCase()) {
        state = s;
        break;
      }
    }
    console.log("state");
    console.log(state);
    displayName += ", " + state.abbreviation;
  } else if (location[2]) {
    displayName += ", " + location[2];
  } else if (location[1]) {
    displayName += ", " + location[1]
  }
    
  console.log(displayName); 

  let elem = document.getElementById("currentWeather");

  elem.innerHTML = `
    <div class="city"><b>${displayName}</div>
    <div class="weathericon"><img src="${descriptions[weather_code].day.image}"></div>
    <div><span class="temp">${Math.round(current.temperature_2m)}<sup class="tempUnits">${current_units.temperature_2m}</sup></span></div>
    </div>
    <div>${descriptions[weather_code].day.description}<br>Feels ${Math.round(current.apparent_temperature)}</div>
  `;
  document.getElementById("currentWeatherContainer").style.display = "block";
  
  // forecast
  console.log('Weather for the next 7 days:');
  const { daily } = weatherData;
  daily.time.forEach((date, index) => {
    console.log(`${date}: Max Temp: ${Math.round(daily.temperature_2m_max[index])}°C, Min Temp: ${Math.round(daily.temperature_2m_min[index])}°C`);
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
      <b>${descriptions[daily.weather_code[index]].day.description}</b>
      <div class="high-low">
      H: ${Math.round(daily.temperature_2m_max[index])}°C<br>L: ${Math.round(daily.temperature_2m_min[index])}°C</div>
      `;
      elem.append(newDiv);
  });

  

  document.getElementById("forecastContainer").style.display = "block";

} // displayWeather


let debounceTimer; // used to limit number of requests made to autocomplete api



// this one prioritizes results from US/Canada
async function autocomplete() {
  
  const query = document.getElementById('city-input').value;  // Get the input value

  // Only perform the search if the input is at least 3 characters
  if (query.length < 3) {
    return;
  }

  // Clear the previous debounce timer if the user is typing quickly
  clearTimeout(debounceTimer);

  // Set a new debounce timer to wait 500ms after the last keystroke
  debounceTimer = setTimeout(async () => {
    console.log("autocmplete");

    // Fetch primary (Canada/US) results
    //const primaryResponse = await fetch(`https://api.locationiq.com/v1/autocomplete.php?key=${locationIQKey}&q=${query}&countrycodes=ca,us&dedupe=1&tag=place:city&limit=5&format=json`);
    const primaryResponse = await fetch(`https://api.locationiq.com/v1/autocomplete.php?key=${locationIQKey}&q=${query}&countrycodes=ca,us&dedupe=1&limit=5&format=json`);
    const primaryData = await primaryResponse.json();

    // Fetch global results as fallback
    //const globalResponse = await fetch(`https://api.locationiq.com/v1/autocomplete.php?key=${locationIQKey}&q=${query}&dedupe=1&tag=place:city&limit=5&format=json`);
    const globalResponse = await fetch(`https://api.locationiq.com/v1/autocomplete.php?key=${locationIQKey}&q=${query}&dedupe=1&limit=5&format=json`);
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
          // Fetch weather for the selected location
          startSearch();
          suggestionList.innerHTML = '';  // Clear suggestions
        });
        suggestionList.appendChild(suggestionItem); // Add suggestion to the list
      });
    }



  }, 500);  // 300ms delay after the user stops typing

} // autocomplete
