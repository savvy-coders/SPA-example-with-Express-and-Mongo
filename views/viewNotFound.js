import html from 'html-literal';

const render = state => {
  return html`
  <h3>
    You be lost, go somewhere else!
  </h3>
`;
}

const beforeHook = (done, { data, params }) => {
  done();
};

// const alreadyHook = ({ data, params }) => {};

const afterHook = ({ data, params }) => {};

export default {
  render,
  beforeHook,
  alreadyHook: beforeHook,
  afterHook
}