import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWeatherData } from '../services/weatherApi';
import { Spinner } from 'react-bootstrap';

const WeatherDashboard = () => {
    const [locations, setLocations] = useState<string[]>([
        'New York',
        'San Francisco',
        'Chicago',
    ]);
    const [weatherData, setWeatherData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");

    const toggleUnit = () => {
        setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
    };

    const addLocation = () => {
        const newLocation = prompt('Enter a new location');
        if (newLocation && !locations.includes(newLocation)) {
            setLocations([...locations, newLocation]);
        } else if (locations.includes(newLocation || '')) {
            alert('Location already exists!');
        }
    };

    const removeLocation = () => {
        const locationToRemove = prompt('Enter the location to remove');
        if (locationToRemove && locations.includes(locationToRemove)) {
            setLocations(locations.filter((location) => location !== locationToRemove));
        } else {
            alert('Location not found!');
        }
    };

    useEffect(() => {
        const getWeather = async () => {
            setLoading(true);
            try {
                const data = await Promise.all(
                    locations.map(async (location) => {
                        const weather = await fetchWeatherData(location);
                        return weather ? weather : { current: null }; // Prevents undefined errors
                    })
                );
                setWeatherData(data);
            } catch (error) {
                console.error("Error fetching weather data:", error);
                setWeatherData([]);
            } finally {
                setLoading(false);
            }
        };

        getWeather();
    }, [locations]);

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    return (
        <div className="container">
            <h1 className="text-center">Weather App</h1>
            <p />
            <h2 className="text-center">Weather Dashboard</h2>

            <div className="text-center mb-3">
                {/* Buttons for adding and removing locations */}
                <button className="btn btn-success me-2" onClick={addLocation}>
                    Add Location
                </button>
                <button className="btn btn-danger me-2" onClick={removeLocation}>
                    Remove Location
                </button>
                {/* Unit Toggle Button */}
                <button onClick={toggleUnit} className="btn btn-secondary">
                    Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
                </button>
            </div>

            {/* Display Weather Cards */}
            <div className="row">
                {weatherData.length > 0 ? (
                    weatherData.map((weather, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card">
                                <img
                                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                                    alt={weather.description}
                                    className="card-img-top"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'contain',
                                        margin: 'auto',
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{locations[index]}</h5>
                                    {weather.temperatureC != null ? (
                                        <p className="card-text">
                                            {unit === "metric"
                                                ? `${weather.temperatureC}°C`
                                                : `${weather.temperatureF}°F`} - {weather.description}
                                        </p>
                                    ) : (
                                        <p className="card-text text-danger">Error loading weather data</p>
                                    )}
                                    <Link to={`/detail/${locations[index]}`} className="btn btn-primary">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-danger">No weather data available.</p>
                )}
            </div>
        </div>

    );
};

export default WeatherDashboard;
