import mongoose from "mongoose";
import Pizza from "../server/models/pizza.js";

describe('Pizza model', function() {
    it('should require a customer', async function() {
      const pizza = new Pizza();
      try {
        await pizza.validate();
      } catch (err) {
        expect(err.errors.customer).toBeDefined();
      }
    });
  
    it('should require a crust and it should be one of the predefined values', async function() {
      const pizza = new Pizza({
        customer: 'John Doe',
        crust: 'unknown'
      });
  
      try {
        await pizza.validate();
      } catch (err) {
        expect(err.errors.crust).toBeDefined();
      }
    });
  
    it('should require a sauce', async function() {
      const pizza = new Pizza({
        customer: 'John Doe',
        crust: 'thin'
      });
  
      try {
        await pizza.validate();
      } catch (err) {
        expect(err.errors.sauce).toBeDefined();
      }
    });
  
    it('should not allow special characters in the customer field', async function() {
      const pizza = new Pizza({
        customer: 'John Doe@',
        crust: 'thin',
        sauce: 'tomato'
      });
  
      try {
        await pizza.validate();
      } catch (err) {
        expect(err.errors.customer).toBeDefined();
      }
    });
  });
  