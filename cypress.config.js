import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    ROOT_URL: "http://localhost:1234",
    PIZZA_PLACE_API_URL: "http://localhost:4040",
    OPEN_WEATHER_MAP_API_KEY: "process.env.OPEN_WEATHER_MAP_API_KEY",
  }
});
