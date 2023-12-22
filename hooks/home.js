import '../assets/css/views/home.css';
import axios from "axios";
import * as store from "../store";
import router from "../index.js";


async function before (done, match) {
    const {data, params} = match;

    // store.notification.visible = true;
    // store.notification.message = "Testing the notification dialog";

    const kelvinToFahrenheit = kelvinTemp => Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

    try {
      const positionResponse = await new Promise((resolve, reject) => {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }

        return navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const location = {latitude: positionResponse.coords.latitude, longitude: positionResponse.coords.longitude};

      const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${location.latitude}8&lon=${location.longitude}&limit=3&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`);

      const city = geoResponse.data[0];

      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=${city.name},${city.state}`);

      store.home.weather = {
        city: weatherResponse.data.name,
        temp: kelvinToFahrenheit(weatherResponse.data.main.temp),
        feelsLike: kelvinToFahrenheit(weatherResponse.data.main.feels_like),
        description: weatherResponse.data.weather[0].main
      };

      done();
    } catch(error) {
      console.error("Error retrieving weather data", error);

      store.notification.type = "error";
      store.notification.visible = true;
      store.notification.message = "Error retrieving weather data";

      done();
    }
}

async function after(match) {
    document.getElementById('action-button').addEventListener('click', event => {
      event.preventDefault();

      alert('Hello! You clicked the action button! Redirecting to the pizza view');

      router.navigate('/pizza');
    });
  }


export default {
 before,
 after
}