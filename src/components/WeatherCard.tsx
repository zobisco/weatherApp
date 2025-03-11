import React from "react";

interface WeatherData {
    name: string;
    main: { temp: number };
    weather: { description: string; icon: string }[];
}

interface WeatherCardProps {
    weather: WeatherData;
    unit: "metric" | "imperial";
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, unit }) => {
    return (
        <div className="col-md-4">
            <div className="card text-center p-3 mb-3">
                <h5>{weather.name}</h5>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather Icon" />
                <p>{weather.main.temp}°C</p>
                <p>{weather.weather[0].description}</p>
                {weather.main.temp}°{unit === "metric" ? "C" : "F"} - {weather.weather[0].description}
            </div>
        </div>
    );
};

export default WeatherCard;
