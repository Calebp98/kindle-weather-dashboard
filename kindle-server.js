const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Cambridge, UK coordinates
const LAT = 52.2053;
const LON = 0.1218;

// Cache for weather data
let weatherCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Function to fetch weather data from OpenWeatherMap API
async function fetchWeatherData() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY environment variable is required");
  }

  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&exclude=minutely,alerts&units=metric&appid=${apiKey}`;

  try {
    // Use dynamic import for node-fetch v3
    const { default: fetch } = await import("node-fetch");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

// Function to get cached weather data or fetch new data
async function getWeatherData() {
  const now = Date.now();

  // Return cached data if it's still valid
  if (weatherCache && now - lastFetchTime < CACHE_DURATION) {
    return weatherCache;
  }

  // Fetch new data
  try {
    weatherCache = await fetchWeatherData();
    lastFetchTime = now;
    return weatherCache;
  } catch (error) {
    // Return cached data if available, even if expired
    if (weatherCache) {
      console.warn("Using expired cache due to API error");
      return weatherCache;
    }
    throw error;
  }
}

// Function to get peak and min temperatures from 8AM to 10PM
function getPeakMinTemps(hourlyData, targetDay) {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + targetDay);

  // Get the start and end of the target day in local time
  const targetDateStart = new Date(targetDate);
  targetDateStart.setHours(0, 0, 0, 0);
  const targetDateEnd = new Date(targetDate);
  targetDateEnd.setHours(23, 59, 59, 999);

  // Convert to timestamps for comparison
  const startTimestamp = targetDateStart.getTime() / 1000;
  const endTimestamp = targetDateEnd.getTime() / 1000;

  // Filter hourly data for the target day
  const dayHourlyData = hourlyData.filter((hour) => {
    return hour.dt >= startTimestamp && hour.dt <= endTimestamp;
  });

  // Filter for 8AM to 10PM (hours 8-22) in local time
  const dayTemps = dayHourlyData
    .filter((hour) => {
      const hourDate = new Date(hour.dt * 1000);
      const hourOfDay = hourDate.getHours();
      return hourOfDay >= 8 && hourOfDay <= 22;
    })
    .map((hour) => hour.temp);

  if (dayTemps.length === 0) {
    // Fallback to daily min/max if no hourly data available
    return { peak: null, min: null };
  }

  return {
    peak: Math.max(...dayTemps),
    min: Math.min(...dayTemps),
  };
}

// Function to determine which day's forecast to show
function getTargetDay() {
  const now = new Date();
  const hour = now.getHours();

  // Before 8 PM, show current day; after 8 PM, show next day
  if (hour < 20) {
    return 0; // Current day
  } else {
    return 1; // Next day
  }
}

// Function to format temperature
function formatTemperature(temp) {
  return Math.round(temp);
}

// Function to get weather icon
function getWeatherIcon(weatherCode) {
  // Return a simple dash as a placeholder, no emoji
  return "-";
}

// Function to format time
function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Function to format date
function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// Main route
app.get("/", async (req, res) => {
  try {
    const weatherData = await getWeatherData();
    const targetDay = getTargetDay();

    const current = weatherData.current;
    const daily = weatherData.daily[targetDay];

    // Get peak and min temperatures from 8AM to 10PM
    const peakMinTemps = getPeakMinTemps(weatherData.hourly, targetDay);

    // Use peak/min temps if available, otherwise fallback to daily min/max
    const dailyHigh =
      peakMinTemps.peak !== null
        ? formatTemperature(peakMinTemps.peak)
        : formatTemperature(daily.temp.max);
    const dailyLow =
      peakMinTemps.min !== null
        ? formatTemperature(peakMinTemps.min)
        : formatTemperature(daily.temp.min);

    // Prepare data for template
    const templateData = {
      location: "Cambridge, UK",
      currentDate: formatDate(current.dt),
      currentTime: formatTime(current.dt),
      currentTemp: formatTemperature(current.temp),
      currentFeelsLike: formatTemperature(current.feels_like),
      currentHumidity: current.humidity,
      currentWindSpeed: Math.round(current.wind_speed),
      currentWeatherIcon: getWeatherIcon(current.weather[0].icon),
      currentWeatherDesc: current.weather[0].description,
      dailyHigh: dailyHigh,
      dailyLow: dailyLow,
      dailyWeatherIcon: getWeatherIcon(daily.weather[0].icon),
      dailyWeatherDesc: daily.weather[0].description,
      dailyHumidity: daily.humidity,
      dailyWindSpeed: Math.round(daily.wind_speed),
      dailyUvi: Math.round(daily.uvi * 10) / 10,
      sunrise: formatTime(daily.sunrise),
      sunset: formatTime(daily.sunset),
      lastUpdated: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    // Read and render the HTML template
    const fs = require("fs");
    const path = require("path");
    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "index.html"),
      "utf8"
    );

    // Replace placeholders with actual data
    let renderedHtml = htmlTemplate;
    Object.keys(templateData).forEach((key) => {
      const placeholder = `{{${key}}}`;
      renderedHtml = renderedHtml.replace(
        new RegExp(placeholder, "g"),
        templateData[key]
      );
    });

    res.setHeader("Content-Type", "text/html");
    res.send(renderedHtml);
  } catch (error) {
    console.error("Error serving dashboard:", error);
    res.status(500).send(`
            <html>
                <head>
                    <title>Weather Dashboard - Error</title>
                    <link rel="stylesheet" href="/kindle.css">
                </head>
                <body>
                    <div class="container">
                        <h1>Weather Dashboard</h1>
                        <p class="error">Unable to load weather data. Please try again later.</p>
                        <p class="error-details">${error.message}</p>
                    </div>
                </body>
            </html>
        `);
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Only start the server if not running through Vercel
if (!process.env.VERCEL && !process.env.VERCEL_DEV) {
  app.listen(PORT, () => {
    console.log(`Kindle Weather Dashboard running on port ${PORT}`);
    console.log(`Dashboard available at: http://localhost:${PORT}`);
    console.log(`Health check at: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
