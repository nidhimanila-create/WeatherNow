
# WeatherNow – Real-Time Weather Dashboard

## About the Project
WeatherNow is a responsive real-time weather dashboard developed as part of Task 4 of the Thiranex Internship.

The application retrieves live weather information for cities around the world using public REST APIs and displays it dynamically.

## Features
- Search weather by city name.
- Display real-time temperature.
- Show feels-like temperature.
- Display humidity levels.
- Display wind speed.
- Show weather conditions with icons.
- Handle invalid city names and network errors.
- Responsive design for desktop and mobile devices.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Fetch API
- Async/Await
- Open-Meteo Weather API
- Open-Meteo Geocoding API

## API Integration
The project uses two APIs:
1. Geocoding API – Retrieves geographical coordinates based on the city name.
2. Weather API – Fetches current weather information using latitude and longitude.

## Project Structure
```text
Thiranex-Task4-WeatherDashboard/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run
1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Open `index.html` using Live Server or a browser.
4. Search for any city to view its current weather.

## Internship
**Organization:** Thiranex  
**Task:** Task 4 – Asynchronous JavaScript & RESTful APIs  
**Project:** Real-Time Weather Dashboard

## Data Source
[Open-Meteo](https://open-meteo.com/)
