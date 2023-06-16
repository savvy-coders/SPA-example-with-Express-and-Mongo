import * as components from "./components";
import * as views from "./views";
import * as store from "./store";
import Navigo from "navigo";
import { camelCase } from "lodash";

window.router = new Navigo("/");
window.store = store

const hookComponents = [
  "header",
  "nav",
  "main",
  "footer",
  "notification"
];

function render(state = store.home) {
  document.querySelector("#root").innerHTML = `
    ${components.header.render(state)}
    ${components.notification.render(store.notification)}
    ${components.nav.render(store.nav)}
    ${components.main.render(state)}
    ${components.footer.render(store.footer)}
  `;

  router.updatePageLinks();
}

async function runComponentHook(hookName, match, done = null) {
  // Check if data is null, view property exists, if not set view equal to "home"
  // using optional chaining (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
  const view = match?.data?.view ? camelCase(match.data.view) : "home";

  try {
    if (hookName === 'beforeHook') {
      await header.beforeHook(done, match);
      await nav.beforeHook(done, match);
      await main.beforeHook(done, match);
      await footer.beforeHook(done, match);
      await notification.beforeHook(done, match);

      // hookComponents.forEach(async componentName => {
      //   await components[componentName].beforeHook(done, match);
      // });

      await views[view].beforeHook(done, match);
    } else {
      // await header[hookName](match);
      // await nav[hookName](match);
      // await main[hookName](match);
      // await footer[hookName](match);
      // await notification[hookName](match);

      hookComponents.forEach(async componentName => {
        await components[componentName][hookName](match);
      });

      await views[view][hookName](match);
    }
  } catch (error) {
    console.error(error);
  }
}

router.hooks({
  // Use object deconstruction to store the data and (query)params from the Navigo match parameter
  // Runs before a route handler that the match is hasn't been visited already
  before: (done, match) => {
    runComponentHook('beforeHook', match, done);
  },
  // Runs before a route handler that is already the match is already being visited
  already: (match) => {
    runComponentHook('alreadyHook', match);

    render(store[match?.data?.view || "home"]);
  },
  after: (match) => {
    runComponentHook('afterHook', match);
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