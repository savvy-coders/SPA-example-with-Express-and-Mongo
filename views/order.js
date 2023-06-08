import html from "html-literal";
import { kebabCase } from "lodash";

export default state => html`
  <form id="order" method="POST" action="">
    <h2>Order a pizza</h2>
    <div>
      <label for="crust">Crust:</label>
      <select id="crust" name="crust">
        <option value="">Select a Crust</option>
        <option value="thin">Thin</option>
        <option value="chicago">Chicago</option>
        <option value="deep-dish">Deep Dish</option>
        <option value="thick">Thick</option>
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
      ${state.availableToppings.map(topping => {
          const id = kebabCase(topping) + `-checkbox`;
          return html`<input
            type="checkbox"
            id="${id}"
            name="toppings"
            value="${topping}"
          />
          <label for="${id}" class="topping-label">${topping}</label>`
        }).join("")}
    </div>
    <input
        type="hidden"
        name="customer"
        id="customer"
        value="<Your Name>"
      />
    <input type="submit" name="submit" value="Submit Pizza" />
  </form>
`;
