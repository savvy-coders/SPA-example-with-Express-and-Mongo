// import the request object from supertest library
import request from 'supertest';

// import the app.js from our server folder to get access to it's functions
import app from '../server/app.js';

// set a default timeout - otherwise, if you have a ton of records and/or a bad internet connection, your tests just hang forever at the GET all method!
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
// set up our test
describe('Pizza Routes', function() {

  // First, to make things easier later, let's begin by creating a variable to  store a pizza id for GET, PUT and DELETE tests
  let pizzaId; 

  // Next, we'll start setting up our first spec. This one will test an acceptable POST request to the pizza route
  it('POST /pizzas - Create a new pizza', function(done) {

    // In order to do that, we'll need the data to send to the endpoint, so let's write a minimal package which fulfills only the absolute base requirements from the DB model:
    const pizzaData = {
      customer: 'John Doe',
      crust: 'thin',
      sauce: 'tomato'
    };

    // now we have what we need - a data package, a package handler (request by supertest), and a route. Let's test it!
    request(app)

        // Selects the endpoint
      .post('/pizzas')

      // Selects the data to send as the body
      .send(pizzaData)

      // Sets the headers for the request package
      .set('Accept', 'application/json')

      //  Sets the first expectation - that we get a json object back as verification, a common convention of most APIs, including ours
      .expect('Content-Type', /json/)

      // Sets the second expectation - that we get a 200 http response back, which is essentially the "all clear" code that confirms the call worked
      .expect(200)

      // Sets up our ability to inspect the response package we received back from the endpoint
      .then(response => {

        console.log("Log Message: " + response.body);
        // Sets the third expectation - that the customer value is actually what we sent
        expect(response.body.customer).toEqual('John Doe');

        // We do the same for each value we sent, confirming it's in the response body, since the backend builds that from what it sent to the DB, not from what it received directly, making it a good check for whether our endpoint is communicating accurately with our database.
        expect(response.body.crust).toEqual('thin');

        // Same for our sauce - this is our sixth spec
        expect(response.body.sauce).toEqual('tomato');

        // Remember that pizzaId we created at the beginning? Now that we have a record confirmed by the DB, we can grab it's ID from the response body and store it to use in our later PUT and DELETE and GET:ID requests:
        pizzaId = response.body._id;
        console.log("Log Message: " + pizzaId + " " + pizzaData)
        // The done statement essentially just closes this spec so we can begin a fresh one of a different type, or on a different object or function
        done();
      });
  });

  // On to the next one! A simple GET request for all records. Most of this will be the same as the previous test, except where it is perhaps simpler and more self-explanatory.
  it('GET /pizzas - Get all pizzas', function(done) {
    request(app)
      .get('/pizzas')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  // A bit more interesting is our GET:ID request. We're fetching a specific record this time, so we'll use our test record from our POST request earlier - and the pizzaId we subsequently stored near the end of that test - to search for that exact record, that way the rest of our testing only affects the test record - this is a very common convention and best practice for testing in general - we never want to be running test functions on "real" data, or we run the risk of corrupting that data, and possibly far worse. We always want to start by testing whatever method will produce a new, bespoke record, and that way we can test all other functions on that record. As long as the test for our "DELETE" method is last, that means we have effectively zero cleanup to do  at the end; if not, we'll need to artificially create a DELETE call at the end of our test to ensure we have not left dummy data in our live db!
  it('GET /pizzas/:id - Get a single pizza by ID', function(done) {
    console.log("Log Message: " + pizzaId);
    // just like previously, we'll start by executing the "request" method on our app.js which is stored as "app" in this file.
    request(app)

    // then, just like when we use the endpoint in production, we'll pass in an id after a slash at the end of our route path:
      .get(`/pizzas/${pizzaId}`)

      // thanks to the pizzaId we stored earlier, we can write that as a template literal so that as long as test 1 passes, that ID will exist, will be assigned, and will be dummy data - the three checkboxes we need to tick for safely and efficiently testing our app routes
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

      // the rest is pretty much the same aside from, of course, the need to verify that the ID is also what we expect it to be, and has not been changed, and we have not accidentally performed the operation on the wrong record.
      .then(response => {
        console.log("Log Message: " + response.body);
        expect(response.body._id).toEqual(pizzaId);
        done();
      });
  });

  // since we have a record ID and we know what the data assigned to it already is, we can now use it in a PUT request test:
  it('PUT /pizzas/:id - Update a single pizza by ID', function(done) {
    const updatedPizzaData = {
      crust: 'deep-dish',
      sauce: 'bbq'
    };

    request(app)
      .put(`/pizzas/${pizzaId}`)
      .send(updatedPizzaData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

      // now we simply verify that the two fields we changed are reflecting the new values:
      .then(response => {
        expect(response.body.crust).toEqual('deep-dish');
        expect(response.body.sauce).toEqual('bbq');
        done();
      });
  });

  // finally, we'll test the DELETE method - and we do it last, so that our test record is available for the duration of our spec file execution, but does not persist after the test closes. Thus, our data integrity is absolutely protected.
  it('DELETE /pizzas/:id - Delete a pizza by ID', function(done) {
    request(app)
      .delete(`/pizzas/${pizzaId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body._id).toEqual(pizzaId);
        done();
      });
  });
});
