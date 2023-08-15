import html from "html-literal";
import { kebabCase } from "lodash";
import "../assets/css/views/order.css"

export default state => html`
  <form id="order" method="POST" action="">
    <h2>Order a pizza</h2>
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
      <input type="text" name="cheese" id="cheese" placeholder="Enter Cheese" required />
    </div>
    <div>
      <label for="sauce">Sauce:</label>
      <input type="text" name="sauce" id="sauce" placeholder="Enter Sauce" required />
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
    <div>
      <label for="customer">Customer:</label>
      <input type="text" name="customer" id="customer" value="Student"/>
    </div>
    <input type="submit" name="submit" value="Submit Pizza" />
  </form>
`;
