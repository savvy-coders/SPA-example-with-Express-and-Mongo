import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";
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

function render(st = state.Home) {
  document.querySelector("#root").innerHTML = `
    ${Header(st)}
    ${Nav(state.Links)}
    ${Main(st)}
    ${Footer()}
  `;

  router.updatePageLinks();

  addEventListenersByView(st);
}

function addEventListenersByView(st) {
  // Add to every view
  // add event listeners to Nav items for navigation
  document.querySelectorAll("nav a").forEach(navLink =>
    navLink.addEventListener("click", event => {
      event.preventDefault();
      render(state[event.target.title]);
    })
  );
  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );

  // Add event listeners for the Form view
  if (st.view === "Form") {
    document.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      // convert HTML elements to Array
      let inputList = Array.from(event.target.elements);
      // remove submit button from list
      inputList.pop();
      // construct new picture object
      let newPic = inputList.reduce((pictureObject, input) => {
        pictureObject[input.name] = input.value;
        return pictureObject;
      }, {});
      // add new picture to state.Gallery.pictures
      state.Gallery.pictures.push(newPic);
      render(state.Gallery);
    });
  }
  if (st.view === "Order") {
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
          state.Pizza.pizzas.push(response.data);
          router.navigate("/Pizza");
        })
        .catch(error => {
          console.log("It puked", error);
        });
    });
  }
}

function fetchDataByView(done, st = state.Home) {
  console.log('matsinet-st.view:', st.view);
  switch (st.view) {
    case "Pizza":
      axios
        .get(`${API_URL}/pizzas`)
        .then(response => {
          state[st.view].pizzas = response.data;
          render(st);
          done();
        })
        .catch(error => {
          console.log("It puked", error);
          done();
        });
      break;
    case "Blog":
      state.Blog.posts = [];
      axios.get("https://jsonplaceholder.typicode.com/posts").then(response => {
        response.data.forEach(post => {
          state.Blog.posts.push(post);
          done();
        });
      });
      break;
    case "Home":
      axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?appid=fbb30b5d6cf8e164ed522e5082b49064&q=st.%20louis`
      )
      .then(response => {
        state.Home.weather = {};
        state.Home.weather.city = response.data.name;
        state.Home.weather.temp = response.data.main.temp;
        state.Home.weather.feelsLike = response.data.main.feels_like;
        state.Home.weather.description = response.data.weather[0].main;
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
    console.log('matsinet-state[page]:', state[page]);

    fetchDataByView(done, state[page]);
  }
});

router
  .on({
    "/": () => {
      render(state.Home);
    },
    ":view": params => {
      let view = capitalize(params.data.view);
      render(state[view]);
    }
  })
  .resolve();
