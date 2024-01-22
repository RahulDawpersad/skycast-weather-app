const apiKey = "1da550247f2ed8a45a02dda55086b7a2"; //My API_KEYs
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherDataContainer = document.getElementById("weatherData");

// Function to set and get the city name and weather data from localStorage
function setWeatherData(city, weatherData) {
  localStorage.setItem("userCity", city);
  localStorage.setItem("weatherData", JSON.stringify(weatherData));
}

function getCityName() {
  return localStorage.getItem("userCity") || "";
}

function getWeatherData() {
  const storedWeatherData = localStorage.getItem("weatherData");
  return storedWeatherData ? JSON.parse(storedWeatherData) : null;
}

// Set the initial value of the input field
cityInput.value = getCityName();

weatherForm.addEventListener("submit", function (event) {
  event.preventDefault();
  getWeatherAndUpdate();
});

// Function to refresh the weather data
function refreshWeather() {
  getWeatherAndUpdate();
}

// Function to set and display weather data
function setAndDisplayWeatherData(city, weatherData) {
  const temperature = weatherData.main.temp.toFixed(1);
  const maxTemp = weatherData.main.temp_max.toFixed(1);
  const minTemp = weatherData.main.temp_min.toFixed(1);
  const humidity = weatherData.main.humidity;
  const windSpeedMetersPerSecond = weatherData.wind.speed;
  const windSpeedKilometersPerHour = (windSpeedMetersPerSecond * 3.6).toFixed(
    2
  );
  const precipitation =
    weatherData.rain?.["1h"] || weatherData.snow?.["1h"] || 0;
  const isDayTime = isDay(weatherData.sys.sunrise, weatherData.sys.sunset);

  // Get the current time and date
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const currentDate = currentTime.toDateString();

  // Display detailed weather data in the HTML element
  weatherDataContainer.innerHTML = `
        <p>${temperature}°C temperature from ${minTemp} to ${maxTemp}°C</p>
        <p>Weather: ${weatherData.weather[0].description}</p>
        <p>Rain Amount: ${precipitation} mm</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind: ${windSpeedKilometersPerHour} km/h</p>
        <p>${
          isDayTime
            ? `Day <i class="fa-solid fa-sun"></i>`
            : `Night: <i class="fa-solid fa-moon"></i>`
        }</p>
        <p>Date: ${currentDate}</p>
        <p>Time: ${hours}:${minutes}:${seconds}</p>
`;

  // Store the city name and weather data in localStorage
  setWeatherData(city, weatherData);
}

// Function to check if it's currently day or night
function isDay(sunriseTimestamp, sunsetTimestamp) {
  const now = Date.now() / 1000; // Convert current time to seconds
  return now >= sunriseTimestamp && now < sunsetTimestamp;
}

// Function to get weather data and update the display
function getWeatherAndUpdate() {
  const city = cityInput.value;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  // Fetch data from the OpenWeatherMap API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((weatherData) => {
      setAndDisplayWeatherData(city, weatherData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Check for stored weather data and display if available
const storedWeatherData = getWeatherData();
if (storedWeatherData) {
  setAndDisplayWeatherData(getCityName(), storedWeatherData);
}

// Preloader Functionality
setTimeout(function () {
  $(".wrapper").fadeOut();
}, 5000);
