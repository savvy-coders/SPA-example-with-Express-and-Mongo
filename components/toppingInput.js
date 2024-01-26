import html from "html-literal";
import { kebabCase } from "lodash";

export default name => {
  const id = kebabCase(name) + `-checkbox`;
  return html`
    <input type="checkbox" id="${id}" name="toppings" value="${name}"/>
    <label for="${id}" class="topping-label">${name}</label></li>
  `;
}
