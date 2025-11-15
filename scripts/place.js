// scripts/place.js
// Function to calculate wind chill
function calculateWindChill(temperature, windSpeed) {
    // Formula for metric wind chill (temperature in °C, wind speed in km/h)
    // Wind chill formula: 13.12 + 0.6215*T - 11.37*(V^0.16) + 0.3965*T*(V^0.16)
    return 13.12 + (0.6215 * temperature) - (11.37 * Math.pow(windSpeed, 0.16)) + 
           (0.3965 * temperature * Math.pow(windSpeed, 0.16));
}
// Calculate and display wind chill
const temperature = 9; // Static value in °C
const windSpeed = 8; // Static value in km/h

const windChillElement = document.getElementById('wind-chill');
const temperature_element = document.getElementById('temperature');
const windspeed_element = document.getElementById('wind-speed');

windspeed_element.textContent=windSpeed;
temperature_element.textContent=temperature;

// Check conditions for viable wind chill calculation
if (temperature <= 10 && windSpeed > 4.8) {
    const windChill = calculateWindChill(temperature, windSpeed);
    windChillElement.textContent = `${windChill.toFixed(1)} °C`;
} else {
    windChillElement.textContent = "N/A";
}
