import html from "html-literal";
import { kebabCase } from "lodash";

export default state => html`
  <form id="order" method="POST" action="">
    <h2>Order a pizza</h2>
    <div>
      <label for="customer">Customer Name:</label>
      <input type="text" name="customer" id="customer" placeholder="Enter Name" required />
    </div>
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
    <input type="submit" name="submit" value="Submit Pizza" />
  </form>
`;
