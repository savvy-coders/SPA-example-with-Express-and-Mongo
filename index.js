import { header, nav, main, footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { camelCase } from "lodash";
import axios from "axios";

let PIZZA_PLACE_API_URL;

if (process.env.PIZZA_PLACE_API_URL) {
  PIZZA_PLACE_API_URL = process.env.PIZZA_PLACE_API_URL ?? "http://localhost:4040";
} else {
  console.error(
    "Please create the .env file with a value for PIZZA_PLACE_API_URL"
  );
}

const router = new Navigo("/");

function render(state = store.home) {
  document.querySelector("#root").innerHTML = `
    ${header(state)}
    ${nav(store.nav)}
    ${main(state)}
    ${footer()}
  `;

  router.updatePageLinks();
}

router.hooks({
  // Use object deconstruction to store the data and (query)params from the Navigo match parameter
  // Runs before a route handler that the match is hasn't been visited already
  before: async (done, match) => {
    // Check if data is null, view property exists, if not set view equal to "home"
    // using optional chaining (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    switch (view) {
      case "home":
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

          const location = { latitude: positionResponse.coords.latitude, longitude: positionResponse.coords.longitude };

          const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${location.latitude}8&lon=${location.longitude}&limit=3&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`);

          const city = geoResponse.data[0];

          const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=${city.name},${city.state}`);
          console.log('matsinet- weatherResponse',  weatherResponse);

          store.home.weather = {
            city: weatherResponse.data.name,
            temp: kelvinToFahrenheit(weatherResponse.data.main.temp),
            feelsLike: kelvinToFahrenheit(weatherResponse.data.main.feels_like),
            description: weatherResponse.data.weather[0].main
          };

          done();
        } catch (error) {
          console.error("Error retrieving weather data", error);

          done();
        }
        break;
      case "pizza":
        try {
          const response = await axios.get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`);

          store.pizza.pizzas = response.data;

          done();
        } catch(error) {
          console.log("Error retrieving pizza data", error);

          done();
        }
        break;
      default:
        done();
    }
  },
  // Runs before a route handler that is already the match is already being visited
  already: async (match) => {
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    render(store[view]);
  },
  after: async (match) => {
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    switch (view) {
      case "home":
        document.getElementById('action-button').addEventListener('click', event => {
          event.preventDefault();

          alert('Hello! You clicked the action button! Redirecting to the pizza view');

          router.navigate('/pizza');
        });
        break;
      case "order":
        document.querySelector("form").addEventListener("submit", async event => {
          event.preventDefault();

          const inputList = event.target.elements;
          console.log('matsinet-inputList', inputList);

          const toppings = [];
          for (let input of inputList.toppings) {
            if (input.checked) {
              toppings.push(input.value);
            }
          }

          const requestData = {
            crust: inputList.crust.value,
            cheese: inputList.cheese.value,
            sauce: inputList.sauce.value,
            toppings: toppings,
            customer: {
              name: inputList['customer-name'].value,
              postalCode: inputList['customer-postal-code'].value
            },
          };

          await axios
            .post(`${PIZZA_PLACE_API_URL}/pizzas`, requestData)
            .then(response => {
              // Push the new pizza to the store so we don't have to reload from the API
              store.pizza.pizzas.push(response.data);

              router.navigate("/pizza");
            })
            .catch(error => {
              console.error("Error storing new pizza", error);

              router.navigate('/order');
            });
        });
        break;
      case "pizza":
        document.querySelectorAll('.delete-button')
          .forEach(domElement => {
            domElement.addEventListener('click', async event => {
              const { id, name } = event.target.dataset;


              if (confirm(`Are you sure you want to delete this pizza for ${name}`)) {
                await axios
                  .delete(`${process.env.PIZZA_PLACE_API_URL}/pizzas/${id}`)
                  .then(async deleteResponse => {
                    if (deleteResponse.status === 200) {
                      console.log(`Pizza ${id} was successfully deleted`);
                    }

                    // Update the list of pizza after removing the pizza
                    await axios
                      .get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`)
                      .then((response) => {
                        store.pizza.pizzas = response.data;
                        // Reload the existing page, thus firing the already hook
                        router.navigate('/pizza');
                      })
                      .catch((error) => {
                        console.error("Error retrieving pizzas", error);

                        router.navigate('/pizza');
                      });
                  })
                  .catch(error => {
                    console.error("Error deleting pizza", error);

                    router.navigate('/pizza');
                  })
              }
            });
          });
        break;
    }
    // Add menu toggle to bars icon in nav bar which is rendered on every page
    document
      .querySelector(".fa-bars")
      .addEventListener("click", () =>
        document.querySelector("nav > ul").classList.toggle("hidden--mobile")
      );
  }
});

router
  .on({
    "/": () => render(),
    // Use object destructuring assignment to store the data and (query)params from the Navigo match parameter
    // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
    // This reduces the number of checks that need to be performed
    ":view": ({ data, params }) => {
      // Change the :view data element to camel case and remove any dashes (support for multi-word views)
      const view = data?.view ? camelCase(data.view) : "home";
      if (view in store) {
        render(store[view]);
      } else {
        console.log(`View ${view} not defined`);
        render(store.viewNotFound);
      }
    }
  })
  .resolve();

export default router;