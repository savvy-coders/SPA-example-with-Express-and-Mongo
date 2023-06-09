import html from 'html-literal';

const render = state => {
  return html`
<footer>
  &copy;${state.year} <a href="https://savvycoders.com/">Savvy Coders</a>
</footer>`;
}

const beforeHook = (done, { data, params }) => {
  store.footer.year = new Date().getFullYear();
};

const alreadyHook = ({ data, params }) => {};

const afterHook = ({ data, params }) => {};

export default {
  render,
  beforeHook,
  alreadyHook,
  afterHook
}