import { header, nav, main, footer } from "./components";
import * as store from "./store";
import axios from "axios";
import Navigo from "navigo";
import { camelCase } from "lodash";

let PIZZA_PLACE_API_URL;

if (process.env.PIZZA_PLACE_API_URL) {
  PIZZA_PLACE_API_URL =
    process.env.PIZZA_PLACE_API_URL || "http://localhost:4040";
} else {
  console.error(
    "Please create the .env file with a value for PIZZA_PLACE_API_URL"
  );
}

const router = new Navigo("/");

function render(state = store.home) {
  document.querySelector("#root").innerHTML = `
    ${header(state)}
    ${nav(store.links)}
    ${main(state)}
    ${footer()}
  `;

  router.updatePageLinks();

  afterRender(state);
}

function afterRender(state) {
  // Add menu toggle to bars icon in nav bar which is rendered on every page
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );

  // Run this code if the home view is requested
  if (state.view === "home") {
    document.getElementById('action-button').addEventListener('click', event => {
      event.preventDefault();

      alert('Hello! You clicked the action button! Redirecting to the pizza view');

      router.navigate('/pizza');
    });
  }

  // Run this code if the pizza view is requested
  if (state.view === "pizza") {
    document.querySelectorAll('.delete-button')
      .forEach(domElement => {
        domElement.addEventListener('click', event => {
          const id = event.target.dataset.id;

          if (window.confirm(`Are you sure you want to delete this pizza (${id})`)) {
            axios
              .delete(`${process.env.PIZZA_PLACE_API_URL}/pizzas/${id}`)
              .then(deleteResponse => {
                if (deleteResponse.status === 200) {
                  alert(`Pizza ${id} was successfully deleted`)
                }

                // Update the list of pizza after removing the pizza
                axios
                  .get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`)
                  .then((response) => {
                    store.pizza.pizzas = response.data;
                    // Reload the existing page, thus firing the already hook
                    router.navigate('/pizza');
                  })
                  .catch((error) => {
                    console.log("It puked", error);
                  });
              })
              .catch(error => {
                alert(`Error deleting pizza ${id}\n${error}`);
              })
          }
        });
      });
  }

  // Run this code if the order view is requested
  if (state.view === "order") {
    document.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();

      const inputList = event.target.elements;

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
        customer: inputList.customer.value,
      };

      axios
        .post(`${PIZZA_PLACE_API_URL}/pizzas`, requestData)
        .then(response => {
          // Push the new pizza to the store so we don't have to reload from the API
          store.pizza.pizzas.push(response.data);
          router.navigate("/pizza");
        })
        .catch(error => {
          console.log("It puked", error);
        });
    });
  }
}

router.hooks({
  // Use object deconstruction to store the data and (query)params from the Navigo match parameter
  // Runs before a route handler that the match is hasn't been visited already
  before: async (done, { data, params }) => {
    // Check if data is null, view property exists, if not set view equal to "home"
    // using optional chaining (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
    const view = data?.view ? camelCase(data.view) : "home";

    // Add a switch/case statement to handle multiple routes
    // Use a switch/case since we must execute done() regardless of the view being requested
    switch (view) {
      // Run this code if the home view is requested
      case "home": {
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
        }

        // This is the traditional nested promises aka callback hell scenario 
        /*
        navigator.geolocation.getCurrentPosition(
          positionResponse => {
            const location = {latitude: positionResponse.coords.latitude, longitude: positionResponse.coords.longitude};

            axios
              .get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${location.latitude}8&lon=${location.longitude}&limit=3&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`)
              .then(geoResponse => {
                const city = geoResponse.data[0];
                axios
                  .get(
                    `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=${city.name},${city.state}`
                  )
                  .then((response) => {
                    const kelvinToFahrenheit = kelvinTemp => Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

                    store.home.weather = {
                      city: response.data.name,
                      temp: kelvinToFahrenheit(response.data.main.temp),
                      feelsLike: kelvinToFahrenheit(response.data.main.feels_like),
                      description: response.data.weather[0].main
                    };
                    done();
                  })
                  .catch((error) => {
                    console.log("Error retrieving weather", error);
                    done();
                  });
              })
              .catch((error) => {
                console.log("Error finding city name", error);
                done();
              });
          },
          error => {
            console.log("Error finding curront location", error);
            done();
          },
          options
        );
        */

        break;
      }
      // Run this code if the pizza view is requested
      case "pizza": {
        axios
          .get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`)
          .then((response) => {
            store.pizza.pizzas = response.data;
            done();
          })
          .catch((error) => {
            console.log("It puked", error);
            done();
          });
        break;
      }
      // Run this code if the view is not listed above
      default: {
        done();
      }
    }
  },
  // Runs before a route handler that is already the match is already being visited
  already: ({ data, params }) => {
    const view = data?.view ? camelCase(data.view) : "home";

    render(store[view]);
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