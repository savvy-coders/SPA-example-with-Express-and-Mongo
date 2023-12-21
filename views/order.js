import html from "html-literal";
import { kebabCase } from "lodash";
import "../assets/css/views/order.css"
import axios from "axios";
import * as store from "../store/index.js";
import router from "../index.js";

function render(state) {
  return html`
    <form id="order" method="POST" action="">
      <h2>Order a pizza</h2>
      <div>
        <label for="customer">Customer Name:</label>
        <input type="text" name="customer" id="customer" placeholder="Enter Name" required/>
      </div>
      <div>
        <label for="crust">Crust:</label>
        <select id="crust" name="crust" required>
          <option value="">Select a Crust</option>
          <option value="Thin">Thin</option>
          <option value="Hand Tossed">Hand Tossed</option>
          <option value="Chicago">Chicago</option>
          <option value="Deep Dish">Deep Dish</option>
        </select>
      </div>
      <div>
        <label for="cheese">Cheese:</label>
        <input type="text" name="cheese" id="cheese" placeholder="Enter Cheese" required/>
      </div>
      <div>
        <label for="sauce">Sauce:</label>
        <input type="text" name="sauce" id="sauce" placeholder="Enter Sauce" required/>
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
      <input type="submit" name="submit" value="Submit Pizza"/>
    </form>
  `;
}

const hooks = {
  before: async (done, match) => {
    const {data, params} = match;

  },
  after: async (match) => {
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
        .post(`${PIZZA_PLACE_API_URL}/pizzas`, requestData)
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
}

export default {
  render,
  hooks
}