import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWeatherData, fetchForecastData } from '../services/weatherApi'; // Fetching weather data
import { Spinner } from 'react-bootstrap';

// Define types for forecast data
interface ForecastItem {
    dt: number; // Unix timestamp
    main: {
        temp: number; // Temperature in Celsius
    };
    weather: {
        description: string; // Weather description
        icon: string; // Weather icon
    }[];
}

const Detail = () => {
    const { city } = useParams<{ city: string }>();
    const [weather, setWeather] = useState<any>(null);
    const [forecast, setForecast] = useState<ForecastItem[]>([]); // Use the forecast item type
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getWeather = async () => {
            setLoading(true);
            try {
                const weatherData = await fetchWeatherData(city!);
                const forecastData = await fetchForecastData(city!);

                setWeather(weatherData);

                // Get forecast data for 5 days
                const forecastFiltered = forecastData.list.filter((item: any, index: number) => index % 8 === 0); // Pick every 8th forecast (every 24 hours)
                setForecast(forecastFiltered);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (city) {
            getWeather();
        }
    }, [city]);

    const roundTemperature = (temp: number) => {
        return temp ? temp.toFixed(2) : '-'; // Round temperature to 2 decimal places
    };

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (!weather) {
        return <div>No weather data available</div>;
    }

    return (
        <div className="container">
            <h2 className="text-center">{city}</h2>

            {/* Current Weather */}
            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">Current Weather</h5>
                    <p />
                    <p className="card-text">
                        {roundTemperature(weather.temperatureC)}°C / {roundTemperature(weather.temperatureF)}°F - {weather.description}
                    </p>
                    <p>Humidity: {weather.humidity}%</p>
                    <p>Wind Speed: {roundTemperature(weather.windSpeedKmh)} km/h / {roundTemperature(weather.windSpeedMph)} mph</p>
                </div>
            </div>

            {/* Forecast */}
            <h4 className="text-center mt-4">5-Day Forecast</h4>
            <p />
            <div className="row">
                {forecast.map((day: ForecastItem, index: number) => (
                    <div key={index} className="col-md-2">
                        <div className="card text-center p-2">
                            <p>{new Date(day.dt * 1000).toLocaleDateString()}</p> {/* Format date */}
                            <img
                                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                                alt={day.weather[0].description}
                                className="weather-icon"
                            />
                            <p>{roundTemperature(day.main.temp)}°C / {roundTemperature((day.main.temp * 9 / 5) + 32)}°F</p> {/* Convert temp to Fahrenheit */}
                            <p>{day.weather[0].description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Detail;
