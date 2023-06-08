import html from "html-literal";

export default state => html`
<table id="pizzas">
<tr><th>Crust</th><th>Cheese</th><th>Sauce</th><th>Toppings</th><th>Customer</th><th>Actions</th></tr>
${state.pizzas
  .map(pizza => {
    return `<tr>
    <td>${pizza.crust}</td>
    <td>${pizza.cheese}</td>
    <td>${pizza.sauce}</td>
    <td>${pizza.toppings.join(" & ")}</td>
    <td>${pizza.customer}</td>
    <td><button class="delete-button" data-id="${pizza._id}">Delete</button></td>
    </tr>`;
  })
  .join("")}
</table>
`;
