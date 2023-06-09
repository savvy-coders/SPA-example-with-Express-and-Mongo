import html from "html-literal";
import { kebabCase } from "lodash";
import axios from "axios";
import "../assets/css/views/order.css"

const render = state => {
  return html`
  <form id="order" method="POST" action="">
    <h2>Order a pizza</h2>
    <div>
      <label for="crust">Crust:</label>
      <select id="crust" name="crust">
        <option value="">Select a Crust</option>
        <option value="thin">Thin</option>
        <option value="chicago">Chicago</option>
        <option value="deep-dish">Deep Dish</option>
        <option value="hella-thick">Hella Thick</option>
      </select>
    </div>
    <div>
      <label for="cheese">Cheese:</label>
      <input
        type="text"
        name="cheese"
        id="cheese"
        placeholder="Enter Cheese"
        required
      />
    </div>
    <div>
      <label for="sauce">Sauce:</label>
      <input
        type="text"
        name="sauce"
        id="sauce"
        placeholder="Enter Sauce"
        required
      />
    </div>
    <div>
      <label for="toppings">Toppings:</label>
      <ul class="topping-list">
        ${state.availableToppings.map(topping => {
          const id = kebabCase(topping) + `-checkbox`;
          return html`<li><input
            type="checkbox"
            id="${id}"
            name="toppings"
            value="${topping}"
          />
          <label for="${id}" class="topping-label">${topping}</label></li>`
        }).join("")}
      </ul>

    </div>
    <input
        type="hidden"
        name="customer"
        id="customer"
        value="${state.customer}"
      />
    <input type="submit" name="submit" value="Submit Pizza" />
  </form>
`;
}

const beforeHook = (done, match) => {
  done();
};

// const alreadyHook = match => {};

const afterHook = match => {
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
};

export default {
  render,
  beforeHook,
  alreadyHook: beforeHook,
  afterHook
}