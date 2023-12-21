import html from "html-literal";

function render(state) {
  return html`
    <dialog id="notification" ${state.visible ? 'open' : ''} ${state.type ? `class="dialog-${state.type}"` : ''}>
      ${state.message}
      ${state.dismissable ? html`<form method="dialog"><button>OK</button></form>` : ""}
    </dialog>
  `;
}
export default {
  render
}