import * as views from "./views";

export default st => `
<div id="main">${views[st.view](st)}</div>`;
