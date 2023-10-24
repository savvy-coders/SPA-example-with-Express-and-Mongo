describe('Test Navigation and Form Submission', () => {
beforeEach(()=> {
  cy.visit('http://localhost:1234'); // starts at the home page
})

  it('should navigate to different routes and update content', () => {
      cy.contains('My home page'); // checks if header is correct

      cy.get('nav').contains('Pizza').click();
      cy.url().should('include', '/Pizza');
      cy.contains('List of Pizzas'); // checks if content updates

      cy.get('nav').contains('Order').click();
      cy.url().should('include', '/Order');
      cy.contains('Order a Pizza'); // checks if content updates
  });

  it('should submit the pizza order form', () => {
    cy.get('nav').contains('Order').click();
      cy.get('input[name="customer"]').type('John Doe');
      cy.get('select[name="crust"]').select('Thin');
      cy.get('input[name="cheese"]').type('Asiago and Romano');
      cy.get('input[name="toppings"]').check(['Chicken', 'Spinach']);
      cy.get('form').submit();
  });
});
