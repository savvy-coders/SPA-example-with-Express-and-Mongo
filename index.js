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
  // Add to every view

  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );

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
  before: (done, { data, params }) => {
    // Check if data is null, view property exists, if not set view equal to "home"
    // using optional chaining (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
    const view = data?.view ? camelCase(data.view) : "home";

    // Add a switch case statement to handle multiple routes
    switch (view) {
      case "home": {
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}4&q=st%20louis`
          )
          .then((response) => {
            const kelvinToFahrenheit = (kelvinTemp) =>
              Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

            store.home.weather = {};
            store.home.weather.city = response.data.name;
            store.home.weather.temp = kelvinToFahrenheit(
              response.data.main.temp
            );
            store.home.weather.feelsLike = kelvinToFahrenheit(
              response.data.main.feels_like
            );
            store.home.weather.description = response.data.weather[0].main;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        break;
      }
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
      default: {
        done();
      }
    }
  },
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