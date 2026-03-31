import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_KEY = "2403aaf3c9be07229a28656287b5832e";

  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      setWeather(data);
    }
    catch (error) {
      setError(error.message);
      setWeather(null);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Weather Finder</h1>

        <div className="search-box">
          <input
            type="text"
            className="search-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}  
            onKeyUp={(e) => e.key === "Enter" && fetchWeather()}
            placeholder="Enter a city name..."
          />
          <button
            className="search-button"
            onClick={fetchWeather}
            disabled={!city.trim() || loading}  
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Loading State */}
        {
          loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Fetching Weather data...</p>
            </div>
          )
        }

        {/* Error State */}
        {error && (
          <div className="error">
            <p>❌ {error}</p>
            <p className="error-hint">Try checking the spelling or try another city</p>
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (   
          <div className="weather-card">
            <div className="weather-header">
              <h2 className="city-name">{weather.name},{weather.sys.country}</h2>
              <p className="weather-description">{weather.weather[0].description}</p>
            </div>

            <div className="weather-main">
              <div className="temperature">
                <span className="temp-value">{Math.round(weather.main.temp - 273.15)}</span>
                <span className="temp-unit">°C</span>
              </div>

              <div className="weather-icon">
                {weather.weather[0].main === 'Clear' && '☀️'}
                {weather.weather[0].main === 'Clouds' && '☁️'}
                {weather.weather[0].main === 'Rain' && '🌧️'}
                {weather.weather[0].main === 'Snow' && '❄️'}
                {weather.weather[0].main === 'Thunderstorm' && '⛈️'}
                {!['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'].includes(weather.weather[0].main) && '🌤️'}
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">{Math.round(weather.main.feels_like - 273.15)}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.main.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.wind.speed} m/s</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weather.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !weather && (  
          <div className="empty-state">
            <p className="empty-icon">🌍</p>
            <p className="empty-text">Search for a city to see weather information</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
