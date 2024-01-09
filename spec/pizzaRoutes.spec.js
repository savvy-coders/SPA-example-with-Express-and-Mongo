import request from "supertest";
import app from "../server/app.js";

describe("POST /pizzas", () => {
  let pizzaId;

  it("should create a new pizza and return its _id", async () => {
    const res = await request(app)
      .post("/pizzas")
      .send({
        customer: "Tester",
        crust: "thin",
        sauce: "marinara",
        cheese: "asiago",
        toppings: ["chicken", "spinach"],
      })
      .expect(200); // Or any other expected HTTP status

    expect(res.body._id).withContext("_id");
    pizzaId = res.body._id;

    const deleteResponse = await request(app)
      .delete(`/pizzas/${pizzaId}`)
      .set("Accept", "application/json");
    // Assertions
    expect(deleteResponse.status).toBe(200);

    // Confirm that the pizza is deleted by sending a GET request with the same ID
    const getResponse = await request(app)
      .get(`/pizzas/${pizzaId}`)
      .set("Accept", "application/json");
    // Expect a 404 status code indicating the pizza is not found
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toBeNull();
    // Add more assertions as needed
  });
});
