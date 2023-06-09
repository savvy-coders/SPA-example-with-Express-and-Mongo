import html from 'html-literal';

const render = state => {
  return html`
<header>
  <h1>${state.header}</h1>
</header>
`;
}

const beforeHook = (done, { data, params }) => {};

const alreadyHook = ({ data, params }) => {};

const afterHook = ({ data, params }) => {};

export default {
  render,
  beforeHook,
  alreadyHook,
  afterHook
}