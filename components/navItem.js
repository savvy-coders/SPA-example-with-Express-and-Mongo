import html from "html-literal";

function render(item) {
  return html`<li><a href="${item.url}" title="${item.text}" data-navigo>${item.text}</a></li>`;
}

export default {
  render
}