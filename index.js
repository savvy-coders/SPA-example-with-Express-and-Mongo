import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import axios from "axios";
import Navigo from "navigo";
import { capitalize } from "lodash";
import OpenAI from "openai";

let PIZZA_PLACE_API_URL =
  process.env.PIZZA_PLACE_API_URL || "http://localhost:4040";

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
  document.querySelector(".fa-bars").addEventListener("click", () => {
    document.querySelector("nav > ul").classList.toggle("hidden--mobile");
  });

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
          console.log("It puked posting or reloading the pizzas path", error);
        });
    });
  }
  // another view if statement similar to the previous one
  // which listens for the submit event on the form in the chat view
  // and sends the message to the OpenAI API, then sends the
  // response to the mongoDb Database /chats collection
  // and then redirects the user to the chat view
  if (state.view === "Chat") {
    document
      .getElementById("query-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const inputList = event.target.elements;
        const message = inputList.queryInput.value;
        const userId = inputList.userIdInput.value;
        const apiKey = process.env.OPENAI_API_KEY;

        const openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true,
        });
        const pizzas = store.Pizza.pizzas;
        const pizzasListed = 
          pizzas.map((pizza) => ({
            role: "system",
            content: `- ${pizza.name}`,
          }));
        const messageList = [
          { role: "system", content: `You're a helpful assistant at a pizza parlor. Here is a list of current orders, please answer questions about them, and stay on task! No discussing topics unrelated to pizza!` },
          ...pizzasListed,
          { role: "system", content: `${message}` }
        ]

        async function main(messages, pizzas) {
          const completion = await openai.chat.completions.create({
            messages: messageList,
            model: "gpt-3.5-turbo"
          });
          console.log(`The completion response body is:`);
          console.log(completion);
          return completion.choices[0].message.content;
        }

        // waits for OpenAI's api call to respond, then maps the response into the data
        // object being sent to the database
        axios.get(`${PIZZA_PLACE_API_URL}/pizzas`).then((response) => {
          state.pizzas = response.data;
          console.log("The pizzas array is now:");
          console.log(state.pizzas);
          return state.pizzas;
        }).then(async () => {
          await main(message).then((data) => {
            console.log(`This is the result of the "main" function: ${data}`);
            const requestData = {
              userId: userId,
              message: message,
              response: data,
            };
            axios
              .post(`${PIZZA_PLACE_API_URL}/chats`, requestData)
              .then((response) => {
                console.log(`This is the response from the database: ${response}`);
                router.navigate("/Chat");
              })
              .catch((error) => {
                console.log("It puked on Axios post to chats endpoint", error);
              });
          });
        })
      });
  }
}

router.hooks({
  before: (done, params) => {
    let view = "Home";
    if (params && params.data && params.data.view) {
      view = capitalize(params.data.view);
    }

    switch (view) {
      case "Home": {
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=st%20louis`
          )
          .then((response) => {
            const kelvinToFahrenheit = (kelvinTemp) =>
              Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

            store.Home.weather = {
              city: response.data.name,
              temp: kelvinToFahrenheit(response.data.main.temp),
              feelsLike: kelvinToFahrenheit(response.data.main.feels_like),
              description: response.data.weather[0].main,
            };
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
            console.log("It puked getting the pizzas", error);
            done();
          });
        break;
      }

      case "Chat": {
        axios
          .get(`${PIZZA_PLACE_API_URL}/chats`)
          .then((response) => {
            console.log(`The response data from chats is:`);
            console.log(response.data);
            store.Chat.conversations = response.data;
            done();
          })
          .catch((error) => {
            console.log("It puked getting the chats", error);
            done();
          });
        break;
      }
      default: {
        done();
        break;
      }
    }
  },
});

router
  .on({
    "/": () => render(store.Home),
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
