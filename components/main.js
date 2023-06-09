import * as views from "../views";
import html from 'html-literal';

// Could we pass in the view with the state already populated?
const render = state => {
  return html`<div id="main">${views[state.view].render(state)}</div>`;
}

const beforeHook = (done, { data, params }) => {};

const alreadyHook = ({ data, params }) => {};

const afterHook = ({ data, params }) => {};

export default {
  render,
  beforeHook,
  alreadyHook,
  afterHook
}