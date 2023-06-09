import html from 'html-literal';
import axios from "axios";
import * as store from "../store";

const render = state => {
  return html`
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
}

const beforeHook = async (done, { data, params }) => {
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
};

// const alreadyHook = ({ data, params }) => {};

const afterHook = ({ data, params }) => {
  document.querySelectorAll('.delete-button')
    .forEach(domElement => {
      domElement.addEventListener('click', event => {
        const id = event.target.dataset.id;

        if (window.confirm(`Are you sure you want to delete this pizza (${id})`)) {
          axios
            .delete(`${process.env.PIZZA_PLACE_API_URL}/pizzas/${id}`)
            .then(deleteResponse => {
              if (deleteResponse.status === 200) {
                store.notification.type = "success";
                store.notification.visible = true;
                store.notification.dismissable = true;
                store.notification.message = `Pizza ${id} was successfully deleted`;
              }

              // Update the list of pizza after removing the pizza
              axios
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
};

export default {
  render,
  beforeHook,
  alreadyHook: beforeHook,
  afterHook
}