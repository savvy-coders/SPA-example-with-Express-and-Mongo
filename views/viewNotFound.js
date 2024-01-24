import html from "html-literal";
import "../assets/css/viewNotFound.css";
import * as images from "../assets/img/";

export default () => {
  return html`
    <div id="oops404">
      <img src="${images.oops404}" alt="View not found!">
      <div class="attribution">
        <a href="https://www.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_13315300.htm"
           target="_blank">Image by storyset</a> on Freepik
      </div>
    </div>
  `;
}
