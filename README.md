# Kindle Weather Dashboard

A minimalist, server-rendered weather dashboard optimized for the low-refresh, e-ink displays of Kindle devices. It provides a clean, high-contrast, and text-focused interface to quickly view the most important weather information for a fixed location (Cambridge, UK).

## Core Functionality

- **Weather Data**: Fetches and displays weather data from the OpenWeatherMap One Call API 3.0.
- **Dynamic Forecast**:
  - Before 8 PM, it shows the forecast for the current day.
  - After 8 PM, it automatically switches to show the forecast for the next day.
- **Kindle-Optimized UI**: The interface is built with large fonts, high contrast (black and white), and a simple, static layout to ensure readability and performance on e-ink screens.
- **Data Caching**: Weather data is cached on the server and refreshed every 15 minutes to provide up-to-date information while minimizing API calls.
- **Zero Client-Side JavaScript**: The entire HTML page is rendered on the server, ensuring maximum compatibility with the limited browsers on Kindle devices.

## Technical Specification

- **Backend**: Node.js with the Express framework.
- **Frontend**: Server-side rendered HTML5 and CSS3. No client-side JavaScript is used.
- **Dependencies**:
  - `express`: For the web server.
  - `node-fetch`: To make requests to the OpenWeatherMap API.
- **API**: [OpenWeatherMap One Call API 3.0](https://openweathermap.org/api/one-call-3)
- **Deployment**: Configured for deployment on Vercel, utilizing environment variables for API key management.

## Project Structure

```
.
├── kindle-server.js    # Main Node.js/Express server logic
├── index.html          # The HTML template for the dashboard
├── kindle.css          # The CSS stylesheet for the Kindle UI
├── package.json        # Project dependencies and metadata
├── vercel.json         # Vercel deployment configuration
├── build.sh            # Build script for Vercel
└── README.md           # This file
```

## Setup and Running Locally

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- OpenWeatherMap API key

### Installation

1. **Clone or download the project files**

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set API Key**:
   The application expects the OpenWeatherMap API key to be available as an environment variable named `OPENWEATHER_API_KEY`. You can set this in your shell or use a `.env` file with a library like `dotenv`.

   **Option 1: Set environment variable**

   ```bash
   export OPENWEATHER_API_KEY="your_openweathermap_api_key"
   ```

   **Option 2: Create a .env file (requires dotenv package)**

   ```bash
   echo "OPENWEATHER_API_KEY=your_openweathermap_api_key" > .env
   npm install dotenv
   ```

   Then add `require('dotenv').config();` at the top of `kindle-server.js`

   **Option 3: Hardcode for testing (not recommended for production)**
   Edit `kindle-server.js` and replace `process.env.OPENWEATHER_API_KEY` with your actual API key.

4. **Run the Server**:
   ```bash
   node kindle-server.js
   ```

The dashboard will be available at `http://localhost:3000`.

## Getting an OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Navigate to your API keys section
4. Generate a new API key
5. Note: Free tier allows 1000 calls per day, which is sufficient for this application

## Deployment on Vercel

1. **Install Vercel CLI** (optional):

   ```bash
   npm install -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   In your Vercel dashboard, go to your project settings and add the `OPENWEATHER_API_KEY` environment variable.

4. **Alternative: Deploy via GitHub**:
   - Push your code to a GitHub repository
   - Connect the repository to Vercel
   - Set the environment variables in Vercel dashboard

## Features

### Weather Information Displayed

- **Current Weather**:

  - Temperature (current and feels like)
  - Weather condition with emoji icon
  - Humidity percentage
  - Wind speed in m/s

- **Daily Forecast**:
  - High and low temperatures
  - Weather condition with emoji icon
  - Humidity percentage
  - Wind speed in m/s
  - UV index
  - Sunrise and sunset times

### Kindle Optimization

- **High Contrast**: Black text on white background for maximum readability
- **Large Fonts**: Optimized font sizes for e-ink displays
- **Simple Layout**: Minimal design with clear sections
- **No Animations**: Static content to prevent refresh issues
- **Auto-refresh**: Page refreshes every 15 minutes via meta tag
- **Responsive**: Adapts to different screen sizes

### Data Management

- **Caching**: Weather data is cached for 15 minutes to reduce API calls
- **Error Handling**: Graceful fallback to cached data if API is unavailable
- **Time-based Logic**: Automatically switches between current day and next day forecast based on time

## API Endpoints

- `GET /` - Main dashboard page
- `GET /kindle.css` - CSS stylesheet
- `GET /health` - Health check endpoint

## Customization

### Changing Location

To change the location from Cambridge, UK to another location:

1. Update the coordinates in `kindle-server.js`:

   ```javascript
   const LAT = 52.2053; // Replace with your latitude
   const LON = 0.1218; // Replace with your longitude
   ```

2. Update the location name in the template data:
   ```javascript
   location: "Your City, Country";
   ```

### Modifying the Time Logic

The dashboard switches from current day to next day forecast at 8 PM. To change this:

1. Edit the `getTargetDay()` function in `kindle-server.js`:

   ```javascript
   function getTargetDay() {
     const now = new Date();
     const hour = now.getHours();

     // Change 20 to your desired hour (24-hour format)
     if (hour < 20) {
       return 0; // Current day
     } else {
       return 1; // Next day
     }
   }
   ```

### Styling Changes

The CSS is optimized for e-ink displays. Key considerations when modifying:

- Use high contrast colors (black/white)
- Avoid gradients or complex backgrounds
- Keep fonts large and readable
- Minimize use of colors
- Test on actual e-ink devices if possible

## Troubleshooting

### Common Issues

1. **"OPENWEATHER_API_KEY environment variable is required"**

   - Make sure you've set the `OPENWEATHER_API_KEY` environment variable
   - Check that the variable name is exactly `OPENWEATHER_API_KEY`

2. **Weather data not loading**

   - Verify your API key is valid
   - Check your OpenWeatherMap account for API call limits
   - Ensure you have an active internet connection

3. **Page not refreshing**

   - The page auto-refreshes every 15 minutes
   - You can manually refresh by reloading the page
   - Check that your Kindle's browser supports meta refresh

4. **Styling issues on Kindle**
   - The CSS is optimized for e-ink displays
   - Some Kindle browsers may have limited CSS support
   - Test with different Kindle models if possible

### Debug Mode

To enable debug logging, add this to the top of `kindle-server.js`:

```javascript
process.env.DEBUG = "true";
```

## License

MIT License - feel free to use and modify as needed.

## Contributing

This is a simple, focused application. If you find bugs or have suggestions for improvements, please open an issue or submit a pull request.

## Support

For issues related to:

- **OpenWeatherMap API**: Check their [documentation](https://openweathermap.org/api)
- **Vercel Deployment**: Check their [documentation](https://vercel.com/docs)
- **Kindle Browser**: Test on actual Kindle devices as browser capabilities vary
