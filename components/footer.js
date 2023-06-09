import html from 'html-literal';
import "../assets/css/components/footer.css"

const render = state => {
  return html`
<footer>
  &copy;${state.year} <a href="https://savvycoders.com/">Savvy Coders</a>
</footer>`;
}

const beforeHook = (done, match) => {
  store.footer.year = new Date().getFullYear();
};

const alreadyHook = match => {};

const afterHook = match => {};

export default {
  render,
  beforeHook,
  alreadyHook,
  afterHook
}