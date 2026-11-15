
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusMessage = document.getElementById("statusMessage");
const weatherContent = document.getElementById("weatherContent");

// Weather condition descriptions and icons
const weatherConditions = {
    0: { description: "Clear Sky", icon: "☀️" },
    1: { description: "Mainly Clear", icon: "🌤️" },
    2: { description: "Partly Cloudy", icon: "⛅" },
    3: { description: "Overcast", icon: "☁️" },
    45: { description: "Foggy", icon: "🌫️" },
    48: { description: "Depositing Rime Fog", icon: "🌫️" },
    51: { description: "Light Drizzle", icon: "🌦️" },
    53: { description: "Moderate Drizzle", icon: "🌦️" },
    55: { description: "Dense Drizzle", icon: "🌧️" },
    56: { description: "Freezing Drizzle", icon: "🌧️" },
    57: { description: "Heavy Freezing Drizzle", icon: "🌧️" },
    61: { description: "Slight Rain", icon: "🌧️" },
    63: { description: "Moderate Rain", icon: "🌧️" },
    65: { description: "Heavy Rain", icon: "🌧️" },
    66: { description: "Freezing Rain", icon: "🌧️" },
    67: { description: "Heavy Freezing Rain", icon: "🌧️" },
    71: { description: "Slight Snowfall", icon: "🌨️" },
    73: { description: "Moderate Snowfall", icon: "🌨️" },
    75: { description: "Heavy Snowfall", icon: "❄️" },
    77: { description: "Snow Grains", icon: "❄️" },
    80: { description: "Slight Rain Showers", icon: "🌦️" },
    81: { description: "Moderate Rain Showers", icon: "🌧️" },
    82: { description: "Violent Rain Showers", icon: "⛈️" },
    85: { description: "Slight Snow Showers", icon: "🌨️" },
    86: { description: "Heavy Snow Showers", icon: "❄️" },
    95: { description: "Thunderstorm", icon: "⛈️" },
    96: { description: "Thunderstorm with Hail", icon: "⛈️" },
    99: { description: "Heavy Thunderstorm with Hail", icon: "⛈️" }
};

// Handle form submission
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    await getWeather(city);
});

// Display loading message
function showLoading() {
    statusMessage.textContent = "Fetching weather data...";
    statusMessage.className = "status-message";
    statusMessage.hidden = false;

    weatherContent.hidden = true;
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
}

// Display error messages
function showError(message) {
    statusMessage.textContent = message;
    statusMessage.className = "status-message error";
    statusMessage.hidden = false;

    weatherContent.hidden = true;
}

// Main asynchronous weather function
async function getWeather(city) {
    showLoading();

    try {
        // STEP 1: Get city coordinates using Geocoding API

        const geoURL = new URL(
            "https://geocoding-api.open-meteo.com/v1/search"
        );

        geoURL.search = new URLSearchParams({
            name: city,
            count: 1,
            language: "en",
            format: "json"
        });

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const geoData = await geoResponse.json();

        // Check whether the city exists
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city name.");
        }

        const location = geoData.results[0];

        const { latitude, longitude, name, country } = location;

        // STEP 2: Fetch weather data using coordinates

        const weatherURL = new URL(
            "https://api.open-meteo.com/v1/forecast"
        );

        weatherURL.search = new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
            temperature_unit: "celsius",
            wind_speed_unit: "kmh",
            timezone: "auto"
        });

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to retrieve weather information.");
        }

        const weatherData = await weatherResponse.json();

        // STEP 3: Extract nested JSON weather data

        if (!weatherData.current) {
            throw new Error("Weather information is currently unavailable.");
        }

        const current = weatherData.current;

        // STEP 4: Display weather information

        displayWeather(location, current, weatherData.timezone);

    } catch (error) {

        console.error("Weather Fetch Error:", error);

        if (error instanceof TypeError) {
            showError("Network error. Please check your internet connection and try again.");
        } else {
            showError(error.message || "Something went wrong. Please try again.");
        }

    } finally {

        // Restore the search button
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
}

// Dynamically render weather information
function displayWeather(location, current, timezone) {

    const condition = weatherConditions[current.weather_code] || {
        description: "Weather information unavailable",
        icon: "🌍"
    };

    document.getElementById("cityName").textContent = location.name;

    document.getElementById("countryName").textContent =
        [location.admin1, location.country]
            .filter(Boolean)
            .join(", ");

    document.getElementById("temperature").textContent =
        Math.round(current.temperature_2m);

    document.getElementById("weatherIcon").textContent =
        condition.icon;

    document.getElementById("weatherDescription").textContent =
        condition.description;

    document.getElementById("feelsLike").textContent =
        Math.round(current.apparent_temperature);

    document.getElementById("humidity").textContent =
        current.relative_humidity_2m;

    document.getElementById("windSpeed").textContent =
        current.wind_speed_10m;

    // Display the weather observation time in the city's timezone
    const date = new Date(current.time);

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: timezone || "UTC"
    }).format(date);

    document.getElementById("weatherDate").textContent =
    current.time.replace("T", " · ");

    document.getElementById("lastUpdated").textContent =
        "Weather observation: " + current.time.replace("T", " ");

    // Show the completed dashboard
    weatherContent.hidden = false;
    statusMessage.hidden = true;
}

// Load default city when the page opens
window.addEventListener("DOMContentLoaded", () => {
    cityInput.value = "Bengaluru";
    getWeather("Bengaluru");
});
