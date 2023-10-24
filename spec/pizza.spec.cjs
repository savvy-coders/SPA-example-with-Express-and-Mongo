const request = require('supertest');
let app;

beforeAll(async () => {
    app = await import('../server/app.js');
});

describe('Pizza Order API', () => {
    let newOrder;
    it('should get all pizzas and grab an ID', async () => {
        const res = await request(app.default).get('/pizzas');
        newOrder = res.body[1]._id;
        expect(newOrder).toBeTruthy;
        expect(res.statusCode).toBe(200 || 201);
    });

    it('updates pizza toppings', async () => {
        const newToppings = ["gorgonzola", "anchovies"];
        const res = (await request(app.default)
            .put(`/pizzas/${newOrder}`)
            .send({toppings: newToppings})
            );
        expect(res.statusCode).toEqual(200 || 201);
        expect(res.body.toppings).toEqual(newToppings);
    })

    it('deletes the pizza', async () => {
        const res = (await request(app.default)
            .delete(`/pizzas/${newOrder}`)
            );
        expect(res.statusCode).toEqual(200 || 201);
    })
});
