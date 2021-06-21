const api = {
  key: "8113f680c18a956c3caaa8a05c72ed2f",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.key == 'Enter') {
    getResults(searchbox.value);
  }
}

function getResults (query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    })
    .then(displayResults)
    .catch(displayOfflineData)
}

function displayResults (weather) {
  let offlineDataElement = document.querySelector('.offline');
  offlineDataElement.style.visibility="hidden";
  
  let errorMessageElement = document.querySelector('.error');
  if(weather instanceof Error || weather.cod === '404' || weather.cod === '400') {
    errorMessageElement.style.visibility="visible";
    let mainElement = document.querySelector('.main');
    mainElement.style.visibility="hidden";
    return;
  }

  errorMessageElement.style.visibility="hidden";
  let mainElement = document.querySelector('.main');
  mainElement.style.visibility="visible";

  let cityElement = document.querySelector('.location .city');
  cityElement.innerText = `${weather.name}, ${weather.sys.country}`;

  let dateElement = document.querySelector('.location .date');
  dateElement.innerText = dateBuilder(new Date());

  let temperatureElement = document.querySelector('.current .temperature');
  temperatureElement.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let descriptiveWeatherElement = document.querySelector('.current .weather');
  descriptiveWeatherElement.innerText = weather.weather[0].main;

  let highLowElement = document.querySelector('.high-low');
  highLowElement.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function displayOfflineData (weather) {
  let offlineDataElement = document.querySelector('.offline');
  offlineDataElement.style.visibility="visible";

  let mainElement = document.querySelector('.main');
  mainElement.style.visibility="hidden";
}

function dateBuilder (d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

// init results
getResults('Belgrade');
// Registering Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}