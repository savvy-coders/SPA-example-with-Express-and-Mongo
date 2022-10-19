import html from "html-literal";

export default () => html`
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
      <input
        type="checkbox"
        id="id_of_checkbox1"
        class="items1"
        name="toppings"
        value="Chicken"
      />
      <label for="top1">Chicken</label>
      <input
        type="checkbox"
        id="id_of_checkbox2"
        class="items1"
        name="toppings"
        value="Onion"
      />
      <label for="top2">Onion</label>
      <input
        type="checkbox"
        id="id_of_checkbox3"
        class="items1"
        name="toppings"
        value="Spinach"
      />
      <label for="top3">Spinach</label>
      <input
        type="checkbox"
        id="id_of_checkbox4"
        class="items1"
        name="toppings"
        value="Extra cheese"
      />
      <label for="top4">Extra Cheese</label>
      <input
        type="checkbox"
        id="id_of_checkbox5"
        class="items1"
        name="toppings"
        value="Red Pepper"
      />
      <label for="top5">Red Pepper</label>
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
