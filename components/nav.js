import html from 'html-literal';

const render = links => {
  return html`
  <nav>
    <i class="fas fa-bars"></i>
    <ul class="hidden--mobile nav-links">
    ${links
      .map(link => {
        const linkAttribute = link.external
          ? 'target="_blank"'
          : "data-navigo";
        return `<li>
          <a href="${link.url}" title="${link.text}" ${linkAttribute}>
            ${link.text}
          </a>
        </li>`;
      })
      .join("")}
    </ul>
  </nav>
  `;;
}

const beforeHook = (done, match) => {};

const alreadyHook = match => {};

const afterHook = match => {
  // Add menu toggle to bars icon in nav bar which is rendered on every page
  document.querySelector(".fa-bars").addEventListener("click", () =>
    document.querySelector("nav > ul").classList.toggle("hidden--mobile")
  );
};

export default {
  render,
  beforeHook,
  alreadyHook,
  afterHook
};