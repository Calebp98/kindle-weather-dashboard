# Weather Dashboard

A simple, responsive weather dashboard designed for mobile devices. Displays current weather conditions and a 5-day forecast.

## Features

- Current temperature and weather conditions
- Feels like temperature, humidity, and wind speed
- 5-day weather forecast
- Responsive design optimized for mobile
- Auto-refresh every 10 minutes
- Geolocation support (falls back to Cambridge, UK)

## Setup

1. **Get an API Key**

   - Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
   - Copy your API key

2. **Configure the API Key**

   - Copy `config.example.js` to `config.js`
   - Replace `YOUR_API_KEY_HERE` with your actual API key

3. **Serve the Application**

   ```bash
   python3 -m http.server 8080
   ```

4. **Access on Your Phone**
   - Make sure your phone is on the same WiFi network
   - Open your browser and go to: `http://[YOUR_COMPUTER_IP]:8080/weather.html`
   - To find your computer's IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`

## File Structure

- `weather.html` - Main application file
- `config.js` - API configuration (not in git)
- `config.example.js` - Example configuration file
- `.gitignore` - Git ignore rules

## API

Uses the OpenWeatherMap API for weather data. The app will fall back to demo data if the API is unavailable.

## License

MIT License
