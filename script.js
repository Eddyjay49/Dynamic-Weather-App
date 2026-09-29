
const input = document.getElementById("input");

const cityElement = document.getElementById("city");

const temperature = document.getElementById("temperature");

const condition = document.getElementById("condition");

const weatherIcon = document.getElementById("weather-icon");

const feelsLike = document.getElementById("feels-like");

const humidity = document.getElementById("humidity");

const wind = document.getElementById("wind");

const date = document.getElementById("date");

const searchBox = document.querySelector(".search-box");

const myStrongs = document.querySelectorAll(".myStrong")




//  EventListener for the search form
searchBox.addEventListener("submit", (e) => {
    // prevents the browser's default form submission
    e.preventDefault();

    // checking if input is empty
    const cityName = input.value.trim();
    if (cityName === "") {
        alert("Please, enter a city name");
        return;
    }

    // getweather
    getWeather(cityName);

});


// async function for get weather
const getWeather = async function (cityName) {
    try {
       // the geolocation API link
    const locationUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`
    // Ask the API for a response/fetch response from API
    const locationResponse = await fetch(locationUrl);
    // Take that response and convert/read its JSON data so JavaScript can work with it
    const locationData = await locationResponse.json();
    console.log(locationData);

    // logitude and latitude 
    const location = locationData.results[0];
    const longitude = location.longitude;
    const latitude = location.latitude;

    // the weather API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,is_day,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min`;
    // Ask the API for a response/fetch response from API
    const weatherResponse = await fetch(weatherUrl);
    // Take that response and convert/read its JSON data so JavaScript can work with it
    const weatherData = await weatherResponse.json();
    console.log(weatherData)


    // CHANGING TEXT CONTEXTS OF ELEMENTS;

    // city name
    cityElement.textContent = cityName;

    // city date/time
    const now = new Date();

    const currentDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
    });

    // time
    const currentTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
    });
    date.textContent = currentDate + " | " + currentTime;


    // temperature
    temperature.textContent = Math.round(weatherData.current.temperature_2m);
    // feelsLike
    feelsLike.textContent = Math.round(weatherData.current.apparent_temperature) + "°C";
    // humidity
    humidity.textContent = weatherData.current.relative_humidity_2m + "%";
    // wind
    wind.textContent = Math.round(weatherData.current.wind_speed_10m) + " km/h";


    // WEATHER CONDITIONS
    const weatherCode = weatherData.current.weather_code;
    condition.textContent = getWeatherCondition(weatherCode);

    // WEATHER ICONS
    weatherIcon.textContent = geatherWeatherIcon(weatherCode);

    // DAILY/WEEK DAYS
    const daily = weatherData.daily;
        showForecast(daily);
       
            // active class
    myStrongs.forEach((myStrong) => {
       myStrong.classList.add("active")
   })
    }
    catch (error) {
        consolog.log(error)
    }
    finally {
        
    }
  
}



// function for the weather codes that translates to the condition
function getWeatherCondition(code) {
    if (code === 0) {
        return "Clear sky";
    } else if (code === 1 || code === 2) {
        return "Partly cloudy";
    }else if (code === 3) {
        return "Cloudy";
    }else if (code >= 45 && code <= 48) {
        return "Foggy";
    }else if (code >= 51 && code <= 67) {
        return "Rainy";
    }else if (code >= 80 && code <= 82) {
        return "Rain showers";
    }else if (code >= 95) {
        return "Thunderstorm";
    }else {
        return "Unknown";
    }
}

// function for get weather icon
function geatherWeatherIcon(code) {
     if (code === 0) {
        return "☀️";
    } else if (code === 1 || code === 2) {
        return "⛅";
    }else if (code === 3) {
        return "☁️";
    }else if (code >= 45 && code <= 48) {
        return "🌫️";
    }else if (code >= 51 && code <= 67) {
        return " 🌧️";
    }else if (code >= 80 && code <= 82) {
        return "🌦️";
    }else if (code >= 95) {
        return "⛈️";
    }else {
        return "Unknown";
    }
}


//  getWeatherForecast
function showForecast(daily) {
    // 1. Get the day
    for (let i = 0; i < 5; i++){
        //Take the date I received from the API and turn it into something JavaScript can work with as a date.
        const day = new Date(daily.time[i]);
        //Take this Date object and tell me the full name of the weekday
        const dayName = day.toLocaleDateString("en-US", { weekday: "long" })
        // Update day1, day2, day3, etc. with the actual day name from the API
        document.getElementById("day" + (i + 1)).textContent = dayName;


        // 2. Get the weather icon
        const forecastIcon = geatherWeatherIcon(daily.weather_code[i])
        // update icon1, icon2, icon3 etec
        document.getElementById("icon" + (i + 1)).textContent =
            forecastIcon;
        
         //3 Get the maximum and minimum temperature for this day
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        // Update temp1, temp2, temp3, etc. with the temperatures
        document.getElementById("temp" + (i + 1)).textContent =
            maxTemp + "° / " + minTemp + "°";
        
        // 5. Get condition
        // Convert the weather code into a readable condition
        const forecastCondition = getWeatherCondition(daily.weather_code[i]);
        // Update condition1, condition2, condition3, etc.
        document.getElementById("condition" + (i + 1)).textContent =
            forecastCondition;
    }

}