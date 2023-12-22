import html from "html-literal";

export default state => {
  return html`
    <dialog id="notification" ${state.visible ? 'open' : ''} ${state.type ? `class="dialog-${state.type}"` : ''}>
      ${state.message}
      ${state.dismissable ? html`<form method="dialog"><button>OK</button></form>` : ""}
    </dialog>
  `;
}
