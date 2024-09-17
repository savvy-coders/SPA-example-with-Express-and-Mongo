import html from "html-literal";
import "../assets/css/views/aboutMe.css";
/*
  Import an image directly from assets/img folder
  import dogPic from "../assets/img/dog-with-flower.jpg";
*/
// Import all images using the aggregator
import * as images from "../assets/img/";

function render(state) {
  return html`
    <section id="about-me">
      <h2>Vivamus ac justo eu nisi</h2>
      <img src="${images.dogWithFlower}" alt="me" />
      <h3>Dynamic paragraph loaded from state</h3>
      <p>${state.paragraph}</p>
      <hr>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sagittis
        nulla. Etiam semper mauris a quam tempus, non feugiat massa posuere. Morbi
        vitae nisi aliquam, semper diam id, molestie leo. In hac habitasse platea
        dictumst. Nulla et enim vel elit dictum viverra. Nunc pharetra lacinia
        arcu sit amet dignissim. Pellentesque ut mi nulla.
      </p>
      <p>
        Quisque at hendrerit libero, eget interdum lectus. Etiam facilisis leo
        nulla, sit amet imperdiet nunc molestie vel. Orci varius natoque penatibus
        et magnis dis parturient montes, nascetur ridiculus mus. Curabitur
        consectetur felis a purus volutpat, sed finibus magna iaculis.
        Pellentesque tristique tristique turpis nec vehicula. Maecenas varius quis
        tellus id mollis. Vivamus ut ultrices ligula.
      </p>
      <p>
        Etiam egestas consectetur gravida. Nulla mollis suscipit sapien sed
        fermentum. Integer vitae eros a magna vulputate aliquam. Suspendisse sed
        pulvinar augue, auctor mollis lectus. Class aptent taciti sociosqu ad
        litora torquent per conubia nostra, per inceptos himenaeos. Duis eleifend
        diam quis libero sollicitudin efficitur. Nullam sapien eros, tempor eget
        vulputate ut, interdum vel orci. Donec sit amet tempor mi. Nam feugiat
        cursus egestas. Suspendisse eget orci et ex mattis ornare tempor non
        tellus. Suspendisse gravida neque in urna congue bibendum. Duis dui odio,
        pharetra nec odio ac, ornare vulputate nibh.
      </p>
    </section>
  `;
}

const hooks = {
  before: async (done, match) => {
    const {data, params} = match;

  },
  after: async (match) => {

  }
}

export default {
  render,
  hooks
}