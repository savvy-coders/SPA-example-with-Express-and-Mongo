import html from "html-literal";
import "../assets/css/views/pizza.css"
import axios from "axios";
import * as store from "../store/index.js";
import router from "../index.js";

function render(state) {
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

const hooks = {
  before: async (done, match) => {
    const {data, params} = match;

    try {
      const response = await axios.get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`);

      store.pizza.pizzas = response.data;

      done();
    } catch(error) {
      console.log("Error retrieving pizza data", error);

      store.notification.type = "error";
      store.notification.visible = true;
      store.notification.message = "Error retrieving pizza data";

      done();
    }
  },
  after: async (match) => {
    document.querySelectorAll('.delete-button')
      .forEach(domElement => {
        domElement.addEventListener('click', async event => {
          const id = event.target.dataset.id;

          if (confirm(`Are you sure you want to delete this pizza (${id})`)) {
            await axios
              .delete(`${process.env.PIZZA_PLACE_API_URL}/pizzas/${id}`)
              .then(async deleteResponse => {
                if (deleteResponse.status === 200) {
                  store.notification.type = "success";
                  store.notification.visible = true;
                  store.notification.dismissable = true;
                  store.notification.message = `Pizza ${id} was successfully deleted`;
                }

                // Update the list of pizza after removing the pizza
                await axios
                  .get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`)
                  .then((response) => {
                    store.pizza.pizzas = response.data;
                    // Reload the existing page, thus firing the already hook
                    router.navigate('/pizza');
                  })
                  .catch((error) => {
                    console.error("Error retrieving pizzas", error);

                    store.notification.type = "error";
                    store.notification.visible = true;
                    store.notification.message = "Error retrieving pizzas";
                    router.navigate('/pizza');
                  });
              })
              .catch(error => {
                console.error("Error deleting pizza", error);

                store.notification.type = "error";
                store.notification.visible = true;
                store.notification.message = "Error deleting pizza";

                router.navigate('/pizza');
              })
          }
        });
      });
  }
}

export default {
  render,
  hooks
}