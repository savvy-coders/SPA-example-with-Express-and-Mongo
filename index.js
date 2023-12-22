import { header, nav, main, footer, notification } from "./components";
import { home, order, pizza } from "./hooks";
// Could also be import in bulk similar to the store
import * as hooks from "./hooks";
import * as store from "./store";
import Navigo from "navigo";
import { camelCase } from "lodash";

const router = new Navigo("/");

function render(state = store.home) {
  document.querySelector("#root").innerHTML = `
    ${header(state)}
    ${notification(store.notification)}
    ${nav(store.nav)}
    ${main(state)}
    ${footer()}
  `;

  router.updatePageLinks();
}

function updateNotification() {
  // Hide the notification component if it is visible and not dismissable
  if (store.notification.visible && store.notification.dismissable === false) {
    if (store.notification.showCount >= 1) {
      // Hide the notification after it has been shown once
      store.notification.visible = false;
      store.notification.showCount = 0;
    } else {
      store.notification.showCount += 1;
    }
  }
}

router.hooks({
  // Use object deconstruction to store the data and (query)params from the Navigo match parameter
  // Runs before a route handler that the match is hasn't been visited already
  before: async (done, match) => {
    // Check if data is null, view property exists, if not set view equal to "home"
    // using optional chaining (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    updateNotification();

    switch(view) {
      case "home":
        home.before(done, match);
        break;
      case "pizza":
        pizza.before(done, match);
        break;
      default:
        done();

      // The above code could simplified if imported in bulk
      // if (view in hooks && 'before' in hooks[view]) {
      //   hooks[view].before(done, match);
      // } else {
      //   done();
      // }
    }
  },
  // Runs before a route handler that is already the match is already being visited
  already: async (match) => {
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    updateNotification();

    render(store[view]);
  },
  after: async (match) => {
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    // Add menu toggle to bars icon in nav bar which is rendered on every page
    document
      .querySelector(".fa-bars")
      .addEventListener("click", () =>
        document.querySelector("nav > ul").classList.toggle("hidden--mobile")
      );

    document.getElementById('notification').addEventListener('close', event => {
      store.notification.visible = false;
      store.notification.showCount = 0;
    });

    switch(view) {
      case "home":
        home.after(match);
        break;
      case "pizza":
        pizza.after(match);
        break;
      case "order":
        order.after(match);
        break;
    }
  }
});

router
  .on({
    "/": () => render(),
    // Use object destructuring assignment to store the data and (query)params from the Navigo match parameter
    // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
    // This reduces the number of checks that need to be performed
    ":view": ({ data, params }) => {
      // Change the :view data element to camel case and remove any dashes (support for multi-word views)
      const view = data?.view ? camelCase(data.view) : "home";
      if (view in store) {
        render(store[view]);
      } else {
        console.log(`View ${view} not defined`);
        render(store.viewNotFound);
      }
    }
  })
  .resolve();

export default router;