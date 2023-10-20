// Write a test for the user form. This test should fill out the form, 
// submit it, and check that the new user appears in the list.
describe('Pizza form', function() {
  it('should add a new pizza', function() {
    cy.visit('http://localhost:5500');

    cy.get('#name').type('Margherita');
    cy.get('#toppings').type('Tomato, Mozzarella, Basil');
    cy.get('#submit').click();

    cy.get('.pizza-list')
      .children()
      .should('contain', 'Margherita')
      .and('contain', 'Tomato, Mozzarella, Basil');
  });
});


describe('Pizza list', function() {
  it('should contain a specific pizza', function() {
    cy.visit('/');

    cy.get('.pizza-list')
      .children()
      .should('contain', 'Pepperoni')
      .and('contain', 'Pepperoni, Mozzarella');
  });
});

