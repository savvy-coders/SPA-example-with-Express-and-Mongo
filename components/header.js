import html from 'html-literal';

const render = state => {
  return html`
<header>
  <h1>${state.header}</h1>
</header>
`;
}

const beforeHook = (done, match) => {};

const alreadyHook = match => {};

const afterHook = match => {};

export default {
  render,
  beforeHook,
  alreadyHook,
  afterHook
}