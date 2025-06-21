// Weather API Configuration Example
// Copy this file to config.js and add your actual API key
const config = {
  apiKey: "YOUR_API_KEY_HERE", // Get your free API key from https://openweathermap.org/api
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = config;
}
