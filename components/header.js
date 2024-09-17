import html from "html-literal";

function render(state) {
  return html`
    <header>
      <h1>${state.header}</h1>
    </header>
  `;
}

export default {
  render
}
