import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import axios from "axios";
import Navigo from "navigo";
import capitalize from "lodash";
import dotenv from "dotenv";

dotenv.config();

let PIZZA_PLACE_API_URL;

if (process.env.PIZZA_PLACE_API_URL) {
  PIZZA_PLACE_API_URL = process.env.PIZZA_PLACE_API_URL || "http://localhost:4040";
} else {
  console.error("Please create the .env file with a value for PIZZA_PLACE_API_URL");
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

  addEventListenersByView(state);
}

function addEventListenersByView(state) {
  // Add to every view
  // add event listeners to Nav items for navigation
  document.querySelectorAll("nav a").forEach(navLink =>
    navLink.addEventListener("click", event => {
      event.preventDefault();
      render(store[event.target.title]);
    })
  );
  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );

  
  if (state.view === "Order") {
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
        toppings: toppings
      };

      axios
        .post(`${PIZZA_PLACE_API_URL}`, requestData)
        .then(response => {
          console.log(response.data);
          store.Pizza.pizzas.push(response.data);
          router.navigate("/Pizza");
        })
        .catch(error => {
          console.log("It puked", error);
        });
    });
  }
}

/*function fetchDataByView(done, state = store.Home) {
  switch (store.view) {
    case "Pizza":
      axios
        .get(`${PIZZA_PLACE_API_URL}/pizzas`)
        .then(response => {
          store[state.view].pizzas = response.data;
          console.log(response.data);
          render(state);
          done();
        })
        .catch(error => {
          console.log("It puked", error);
          done();
        });
      break;
    case "Home":
      axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?appid=${OPEN_WEATHER_MAP_API_KEY}&q=st.%20louis`
      )
      .then(response => {
        store.Home.weather = {};
        store.Home.weather.city = response.data.name;
        console.log(store.Home.weather.city);
        store.Home.weather.temp = response.data.main.temp;
        store.Home.weather.feelsLike = response.data.main.feels_like;
        store.Home.weather.description = response.data.weather[0].main;
        done();
      })
      .catch(err => console.log(err));
      break;
    default:
      done();
  }
}*/


router.hooks({
  before: (done, params) => {
    const page = params && params.hasOwnProperty("page") ? capitalize(params.page) : "Home";
    if (page === "Home") {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=st.%20louis`)
        .then(response => {
          store.Home.weather = {};
          store.Home.weather.city = response.data.name;
          store.Home.weather.temp = response.data.main.temp;
          store.Home.weather.feelsLike = response.data.main.feels_like;
          store.Home.weather.description = response.data.weather[0].main;
          done();
        })
        .catch(err => console.log(err));
    }
    if (page === "Pizza") {
      axios
        .get(`${process.env.PIZZA_PLACE_API_URL}`)
        .then(response => {
          store.Pizza.pizzas = response.data;
          done();
        })
        .catch(error => {
          console.log("It puked", error);
        });
    }
  }
})

router
  .on({
    "/": () => {
      render();
    },
    ":view": params => {
      let view = capitalize(params.data.view);
      render(store[view]);
    }
  })
  .resolve();
