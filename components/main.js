import html from "html-literal";
import * as views from "../views";

function render(state) {
  return html`<div id="main">${views[state.view].render(state)}</div>`;
}

export default {
  render
}