import html from "html-literal";
import "../assets/css/order.css";
import { toppingInput } from "../components";

export default state => {
  return html`
    <form id="order" method="POST" action="">
      <h2>Order a pizza</h2>
      <div>
        <label for="customer-name">Customer Name:</label>
        <input type="text" name="customer-name" id="customer-name" placeholder="Enter Name" required/>
      </div>
      <div>
        <label for="customer-postal-code">Customer Postal Code:</label>
        <input type="text" name="customer-postal-code" id="customer-postal-code" placeholder="Enter Postal Code" required/>
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
            // Example of using a component inside another component
            return html`<li>${toppingInput(topping)}</li>`
          }).join("")}
        </ul>
      </div>
      <input type="submit" name="submit" value="Submit Pizza"/>
    </form>
  `;
}
