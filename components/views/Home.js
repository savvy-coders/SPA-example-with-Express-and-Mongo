import html from "html-literal";

export default (state) => html`
  <h3>
    Weather in ${state.weather.city} ${state.weather.temp}F, feels like
    ${state.weather.feelsLike}F
  </h3>
  <section id="jumbotron">
    <h2>SavvyCoders JavaScript Fullstack Bootcamp</h2>
    <a href="/" onClick="alert('Hello! You clicked the Button!')"
      >"Call to Action" "Button"</a
    >
  </section>
`;
