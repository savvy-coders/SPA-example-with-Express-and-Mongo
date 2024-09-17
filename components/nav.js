import html from "html-literal";
import navItem from "./navItem.js";

function render(navItems) {
  return html`
    <nav>
      <i class="fas fa-bars"></i>
      <ul class="hidden--mobile nav-links">
        ${navItems.map(item => navItem.render(item)).join("")}
      </ul>
    </nav>
  `;
}

export default {
  render
}