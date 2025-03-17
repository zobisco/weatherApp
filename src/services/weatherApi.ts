import axios from 'axios';

const API_KEY = 'apiKey';
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export const fetchForecastData = async (city: string) => {
  const response = await fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
  if (!response.ok) throw new Error("Forecast data not found");
  return response.json();
};

export const fetchWeatherData = async (location: string) => {
  try {
    const currentWeatherResponse = await axios.get(`${BASE_URL}/weather?q=${location}&units=metric&appid=${API_KEY}`);
    const forecastData = await fetchForecastData(location);

    return {
      temperatureC: currentWeatherResponse.data.main.temp,
      temperatureF: currentWeatherResponse.data.main.temp * 9 / 5 + 32,  // Convert to Fahrenheit
      description: currentWeatherResponse.data.weather[0].description,
      icon: currentWeatherResponse.data.weather[0].icon,
      humidity: currentWeatherResponse.data.main.humidity,
      windSpeedKmh: currentWeatherResponse.data.wind.speed * 3.6, // Convert from m/s to km/h
      windSpeedMph: currentWeatherResponse.data.wind.speed * 2.237, // Convert from m/s to mph

      forecast: forecastData.list.map((forecast: any) => ({
        date: forecast.dt_txt,
        temperatureC: forecast.main.temp,
        temperatureF: forecast.main.temp * 9 / 5 + 32, // Convert to Fahrenheit
        description: forecast.weather[0].description,
        icon: forecast.weather[0].icon
      }))
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {
      temperatureC: null,
      temperatureF: null,
      description: "Error loading data",
      icon: "01d", // Default sunny icon
      humidity: null,
      windSpeedKmh: null,
      windSpeedMph: null,
      forecast: []
    };
  }
};
