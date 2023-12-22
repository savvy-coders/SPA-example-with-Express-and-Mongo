import axios from "axios";
import * as store from "../store/index.js";
import router from "../index.js";

async function before(done, match) {
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
}

async function after(match) {
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

export default {
  before,
  after
}