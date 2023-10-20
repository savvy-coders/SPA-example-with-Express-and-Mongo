const request = require('supertest');
const app = require('../server/app'); // the express server


// Write a test for the POST /pizzas endpoint. This test should check that 
// the endpoint returns a status code of 201 and the newly created pizza.
describe('POST /pizzas', () => {
    it('should create a new pizza', async () => {
      const newPizza = {
        customer: 'John Doe',
        crust: 'thin',
        sauce: 'tomato',
        toppings: ['Tomato', 'Mozzarella', 'Basil']
      };
  
      const res = await request(app)
        .post('/pizzas')
        .send(newPizza);
  
      expect(res.statusCode).toEqual(201);
      expect(res.body.customer).toEqual(newPizza.customer);
      expect(res.body.crust).toEqual(newPizza.crust);
      expect(res.body.sauce).toEqual(newPizza.sauce);
      expect(res.body.toppings).toEqual(newPizza.toppings);
    });
  });
  
  

// Write a test for the GET /pizzas endpoint. This test should check 
// that the endpoint returns a status code of 200 and an array of pizzas.
describe('GET /pizzas', () => {
  it('should return a list of pizzas', async () => {
    const res = await request(app).get('/pizzas');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(pizza => {
      expect(pizza.customer).toBeDefined();
      expect(pizza.crust).toBeDefined();
      expect(pizza.sauce).toBeDefined();
      expect(pizza.toppings).toBeDefined();
    });
  });
});

