import html from "html-literal";

const kelvinToFahrenheit = kelvinTemp =>
  Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

export default state => html`
  <h3>
    Weather in ${state.weather.city} ${kelvinToFahrenheit(state.weather.temp)}F, feels
    like ${kelvinToFahrenheit(state.weather.feelsLike)}F
  </h3>
  <section id="jumbotron">
    <h2>Savvy Coders Jan. 2020 Cohort</h2>
    <a href="">"Call to Action" "Button"</a>
  </section>
`;
