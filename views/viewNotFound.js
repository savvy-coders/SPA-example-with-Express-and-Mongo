import html from 'html-literal';

const render = state => {
  return html`
  <h3>
    You be lost, go somewhere else!
  </h3>
`;
}

const beforeHook = (done, match) => {
  done();
};

// const alreadyHook = match => {};

const afterHook = match => {};

export default {
  render,
  beforeHook,
  alreadyHook: beforeHook,
  afterHook
}