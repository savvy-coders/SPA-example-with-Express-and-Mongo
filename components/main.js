import html from "html-literal";
import * as views from "../views";

export default state => {
  return html`<div id="main">${views[state.view](state)}</div>`;
}
