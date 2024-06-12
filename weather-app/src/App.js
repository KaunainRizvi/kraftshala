import React, { useState, useEffect } from 'react';
import './App.css';
import { FaSearch, FaSun, FaMoon } from 'react-icons/fa';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherData = async (location) => {
    const apiKey = '99c2f9ee06c5f246d17bf7483fdd246f';
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
      const data = await response.json();
      if (data.cod === 200) {
        setWeatherData(data);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  const handleSearch = () => {
    if (location) {
      fetchWeatherData(location);
      setLocation('');
    }
  };

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  return (
    <div className="app">
      <div className="header">
        <h1>KraftShala Weather App</h1>
        <button onClick={handleToggle} className="toggle-button">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city name or zip code"
        />
        <button onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-card">
          <h2>{weatherData.name}</h2>
          <p>{new Date().toLocaleString()}</p>
          <h3>{weatherData.main.temp}°C</h3>
          <p>{weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default App;
