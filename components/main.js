import * as views from "./views";

export default state => `
<div id="main">${views[state.view](state)}</div>`;
