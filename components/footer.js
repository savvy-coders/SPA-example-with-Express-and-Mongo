import html from "html-literal";
import "../assets/css/footer.css";

export default () => {
  return html`
    <footer>
      &copy;${new Date().getFullYear()} <a href="https://savvycoders.com/">Savvy Coders</a>
    </footer>
  `;
}
