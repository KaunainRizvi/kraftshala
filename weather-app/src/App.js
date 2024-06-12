import React, { useState, useEffect } from 'react';
import './App.css';
import { FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import bydefaultGif from './bydefault.gif';
import summerGif from './summer.gif';
import winterGif from './winter.gif';
import rainGif from './rain.gif';


const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [gif, setGif] = useState(bydefaultGif);

  const apiKey = '99c2f9ee06c5f246d17bf7483fdd246f';

  const fetchWeatherData = async (location) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
      const data = await response.json();
      if (data.cod === 200) {
        setWeatherData(data);
        setError('');
        updateGif(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  const fetchLocationWeather = async (lat, lon) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
      const data = await response.json();
      if (data.cod === 200) {
        setWeatherData(data);
        setError('');
        updateGif(data);
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
    if (!darkMode) {
      document.body.className = 'night-mode';
      
    } else {
      document.body.className = '';
      if (weatherData) {
        updateGif(weatherData);
      } else {
        setGif(bydefaultGif);
      }
    }
  };

  const updateGif = (data) => {
    if (data.weather[0].main.toLowerCase().includes('rain')) {
      setGif(rainGif);
      document.body.className = 'rainy-mode';
    } else if (data.main.temp > 20) {
      setGif(summerGif);
      document.body.className = 'summer-mode';
    } else if (data.main.temp < 15) {
      setGif(winterGif);
      document.body.className = 'winter-mode';
    } else {
      setGif(bydefaultGif);
      document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    }
  };

  useEffect(() => {
    if (!weatherData) {
      fetchWeatherData('London'); // Default city
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchLocationWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeatherData('London');
        }
      );
    }
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
      <div className="weather-card">
        <img src={gif} alt="Weather animation" className="weather-gif" />
        {weatherData && (
          <>
            <h2>{weatherData.name}</h2>
            <p>{new Date().toLocaleString()}</p>
            <h3>{weatherData.main.temp}°C</h3>
            <p>{weatherData.weather[0].description}</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
