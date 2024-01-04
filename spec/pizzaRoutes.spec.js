import app from "../server/app"
import pizzas from "../server/routers/pizzas"
import orders from "../server/routers/orders"
import pizza from "../server/models/pizza"
import order from "../server/models/order"


describe('GET /pizzas', () => {
    it('should return a 200 status and at least one pizza', async () => {
    // Send a GET request to retrieve pizzas
    const response = await agent
        .get('/pizzas')
        .set('Accept', 'application/json');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThan(0);
    // Add more assertions as needed
    });
});

describe('DELETE /pizzas/:id', () => {
     it('should return a 200 status and delete the pizza', async () => {
       // Create a pizza first (similar to the POST test)
       // ...

       // Get the ID of the created pizza
       let pizzaId  // Replace with assignment of the actual ID, like const pizzaID = "11477293" or something similar

       // Send a DELETE request to remove the pizza
       const deleteResponse = await agent
         .delete(`/pizzas/${pizzaId}`)
         .set('Accept', 'application/json');

       // Assertions
       expect(deleteResponse.status).toBe(200);

       // Confirm that the pizza is deleted by sending a GET request with the same ID
       const getResponse = await agent
         .get(`/pizzas/${pizzaId}`)
         .set('Accept', 'application/json');

       // Expect a 404 status code indicating the pizza is not found
       expect(getResponse.status).toBe(404);
       // Add more assertions as needed
    });
});
