import html from "html-literal";

const render = state => {
  return html`
    <dialog id="notification" ${state.visible ? 'open' : ''} ${state.type ? `class="dialog-${state.type}"` : ''}>
      ${state.message}
      ${state.dismissable ? html`<form method="dialog"><button>OK</button></form>` : ""}
    </dialog>
  `;
}

const beforeHook = (done, match) => {
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

const alreadyHook = ({ data, params }) => {};

const afterHook = (match) => {
  document.getElementById('notification').addEventListener('close', event => {
    store.notification.visible = false;
    store.notification.showCount = 0;
  });
}

export default {
  render,
  beforeHook,
  alreadyHook: beforeHook,
  afterHook
}