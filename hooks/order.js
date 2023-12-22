import axios from "axios";
import * as store from "../store/index.js";
import router from "../index.js";

async function after(match) {
  if (!process.env.PIZZA_PLACE_API_URL) {
    console.error(
      "Please create the .env file with a value for PIZZA_PLACE_API_URL"
    );
  }

  document.querySelector("form").addEventListener("submit", async event => {
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

    await axios
      .post(`${process.env.PIZZA_PLACE_API_URL}/pizzas`, requestData)
      .then(response => {
        // Push the new pizza to the store so we don't have to reload from the API
        store.pizza.pizzas.push(response.data);

        router.navigate("/pizza");
      })
      .catch(error => {
        console.error("Error storing new pizza", error);

        store.notification.type = "error";
        store.notification.visible = true;
        store.notification.message = "Error storing new pizza";

        router.navigate('/order');
      });
  });
}

export default {
  after
}