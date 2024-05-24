import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import axios from "axios";
import Navigo from "navigo";
import { capitalize } from "lodash";

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

function render(state = store.Home) {
  document.querySelector("#root").innerHTML = `
    ${Header(state)}
    ${Nav(store.Links)}
    ${Main(state)}
    ${Footer()}
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

  if (state.view === "Order") {
    document.getElementById("form").addEventListener("submit", (event) => {
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
        .then((response) => {
          store.Pizza.pizzas.push(response.data);
          router.navigate("/Pizza");
        })
        .catch((error) => {
          console.log("It puked", error);
        });
    });
  }
}

router.hooks({
  before: (done, params) => {
    let view = "Home";
    console.log(params);
    if (params && params.data && params.data.view) {
      view = capitalize(params.data.view);
    }

    // Add a switch case statement to handle multiple routes
    switch (view) {
      case "Home": {
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=st%20louis`
          )
          .then((response) => {
            const kelvinToFahrenheit = (kelvinTemp) =>
              Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

            store.Home.weather = {};
            store.Home.weather.city = response.data.name;
            store.Home.weather.temp = kelvinToFahrenheit(
              response.data.main.temp
            );
            store.Home.weather.feelsLike = kelvinToFahrenheit(
              response.data.main.feels_like
            );
            store.Home.weather.description = response.data.weather[0].main;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        break;
      }
      case "Pizza": {
        axios
          .get(`${PIZZA_PLACE_API_URL}/pizzas`)
          .then((response) => {
            store.Pizza.pizzas = response.data;
            done();
          })
          .catch((error) => {
            console.log("It puked", error);
            done();
          });
        break;
      }
      case "Chat": {
        const chatForm = document.getElementById("query-form");
        if (chatForm) {
          chatForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const chatId = params.data.id;

            const formData = new FormData(event.target);
            const requestData = {};
            formData.forEach((value, key) => {
              requestData[key] = value;
            });

            let promise;
            if (chatId) {
              promise = axios.put(
                `${PIZZA_PLACE_API_URL}/chats/${chatId}`,
                requestData
              );
            } else {
              promise = axios.post(`${PIZZA_PLACE_API_URL}/chats`, requestData);
            }

            promise
              .then((response) => {
                store.Chat.chats.push(response.data);
                location.reload();
              })
              .catch((error) => {
                console.log("It puked", error);
              });
          });
        }

        done();
        break;
      }

      default: {
        if (store.Viewnotfound) {
          render(store.Viewnotfound);
        } else {
          console.log(`View ${view} not defined`);
        }
        done();
        break;
      }
    }
  },
  already: (params) => {
    console.log(params);
    const view = params && params.data && params.data.view ? capitalize(params.data.view) : "Home";
    if (store.hasOwnProperty(view)) {
      render(store[view]);
    } else {
      if (store.Viewnotfound) {
        render(store.Viewnotfound);
      } else {
        console.log(`View ${view} not defined`);
      }
    }
  },
after: (done, params) => {
  console.log(params);
  if (params && params.data && params.data.view === "Chat" && params.data.id) {
    const chatId = params.data.id;
    const message = store.Chat.messages[store.Chat.messages.length - 1];
    axios
      .put(`${PIZZA_PLACE_API_URL}/chats/${chatId}`, {
        message,
      })
      .then((response) => {
        store.Chat.messages.push(response.data);
        render(store.Chat);
        done();
      })
      .catch((error) => {
        console.log("It puked", error);
        done();
      });
  } else if (params && params.data && params.data.view === "Chat" && !params.data.id) {
    axios
      .get(`${PIZZA_PLACE_API_URL}/chats`)
      .then((response) => {
        store.Chat.chats = response.data;
        done();
      })
      .catch((error) => {
        console.log("It puked", error);
        done();
      });
  } else {
    render(store.Home);
  }
},
      notfound: () => {
        render(store.Viewnotfound);
        done();
      }
});


router
  .on({
    "/": () => render(),
    ":view": (params) => {
      let view = capitalize(params.data.view);
      if (store.hasOwnProperty(view)) {
        render(store[view]);
      } else {
        if (store.Viewnotfound) {
          render(store.Viewnotfound);
        } else {
          console.log(`View ${view} not defined`);
        }
      }
    },
    ":view/:id": (params) => {
      let view = capitalize(params.data.view);
      if (store.hasOwnProperty(view)) {
        render(store[view]);
      } else {
        if (store.Viewnotfound) {
          render(store.Viewnotfound);
        } else {
          console.log(`View ${view} not defined`);
        }
      }
    },
  })
  .resolve();


