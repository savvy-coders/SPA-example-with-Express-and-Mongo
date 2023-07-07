// Import Mongoose middleware for validation testing and model to be tested
import mongoose from "mongoose";
import Pizza from "../server/models/pizza.js";

// the test itself
describe('Pizza model', function() {

  // we need to pass in the "async" argument to allow us to run try/catch blocks
    it('should require a customer', async function() {

      // create a new local Pizza object with no data
      const pizza = new Pizza();

      // try block to "await" the result of "try" to "validate" "pizza"
      try {
        await pizza.validate();
        // "catch" the error as "err" and assert that an error WAS thrown
      } catch (err) {
        // because the expect is that there IS an error, an error here produces a passing result
        expect(err.errors.customer).toBeDefined();
      }
    });
  // second spec
    it('should require a crust and it should be one of the predefined values', async function() {

      // new pizza object, this one with an undefined crust value
      const pizza = new Pizza({
        customer: 'John Doe',
        crust: 'unknown'
      });
  // validates the input
      try {
        await pizza.validate();
        // expects the result to be an error
      } catch (err) {
        expect(err.errors.crust).toBeDefined();
      }
    });
  // third spec
    it('should require a sauce', async function() {

      // new Pizza object without sauce
      const pizza = new Pizza({
        customer: 'John Doe',
        crust: 'thin'
      });
  // try to validate input
      try {
        await pizza.validate();
        // expect this to produce an error
      } catch (err) {
        expect(err.errors.sauce).toBeDefined();
      }
    });
  // fourth spec
    it('should not allow special characters in the customer field', async function() {

      // new Pizza object with invalid characters in the customer field
      const pizza = new Pizza({
        customer: 'John Doe@',
        crust: 'thin',
        sauce: 'tomato'
      });
  // try to validate input
      try {
        await pizza.validate();
        // expect this to return an error
      } catch (err) {
        expect(err.errors.customer).toBeDefined();
      }
    });
  });
  