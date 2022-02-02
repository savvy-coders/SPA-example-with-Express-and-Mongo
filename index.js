import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import axios from "axios";
import Navigo from "navigo";
import capitalize from "lodash";
import dotenv from "dotenv";

dotenv.config();

let API_URL;

if (process.env.API_URL) {
  API_URL = process.env.API_URL || "http://localhost:4040";
} else {
  console.error("Please create the .env file with a value for API_URL");
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
        .post(`${API_URL}/pizzas`, requestData)
        .then(response => {
          store.Pizza.pizzas.push(response.data);
          router.navigate("/Pizza");
        })
        .catch(error => {
          console.log("It puked", error);
        });
    });
  }
}

function fetchDataByView(done, state = store.Home) {
  switch (store.view) {
    case "Pizza":
      axios
        .get(`${API_URL}/pizzas`)
        .then(response => {
          store[state.view].pizzas = response.data;
          render(st);
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
        `https://api.openweathermap.org/data/2.5/weather?appid=fbb30b5d6cf8e164ed522e5082b49064&q=st.%20louis`
      )
      .then(response => {
        store.Home.weather = {};
        store.Home.weather.city = response.data.name;
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
}


router.hooks({
  before: (done, params) => {
    // Because not all routes pass params we have to guard against is being undefined
    const page = params && params.data && params.data.hasOwnProperty("view") ? capitalize(params.data.view) : "Home";

    fetchDataByView(done, store[page]);
  }
});

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
