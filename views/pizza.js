import html from "html-literal";
import "../assets/css/views/pizza.css"

export default state => {
  return html`
    <table id="pizzas">
      <thead>
      <th>Crust</th>
      <th>Cheese</th>
      <th>Sauce</th>
      <th>Toppings</th>
      <th>Customer</th>
      <th id="action-column">Actions</th>
      </thead>
      ${state.pizzas
        .map(pizza => {
          return `<tr>
    <td>${pizza.crust}</td>
    <td>${pizza.cheese}</td>
    <td>${pizza.sauce}</td>
    <td>${pizza.toppings.join(" & ")}</td>
    <td>${pizza.customer}</td>
    <td class="text-center"><button class="delete-button" data-id="${pizza._id}">Delete</button></td>
    </tr>`;
        })
        .join("")}
    </table>
  `;
}
