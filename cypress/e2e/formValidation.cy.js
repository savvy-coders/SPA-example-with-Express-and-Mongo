describe('Pizza Order Form Validation', () => {
  
    beforeEach(() => {
      cy.visit('http://localhost:1234/Order'); 
    });
    
    it('should display error messages for required fields', () => {
      // Click the submit button without filling out the form
      cy.get('input[type="submit"]').click();
  
      // Check for the default browser validation message for each required field
      cy.get('input[name="customer"]').should('have.attr', 'required');
      cy.get('input[name="cheese"]').should('have.attr', 'required');
      cy.get('input[name="sauce"]').should('have.attr', 'required');
      // For the select dropdown, check if the user hasn't selected a valid option
      cy.get('select[name="crust"]').should('have.value', '');
    });
  
    it('should successfully submit the form with valid input', () => {
      cy.get('input[name="customer"]').type('John Doe');
      cy.get('select[name="crust"]').select('Thin');
      cy.get('input[name="cheese"]').type('Mozzarella');
      cy.get('input[name="sauce"]').type('Tomato');
      cy.get('input[id="id_of_checkbox1"]').check(); // Checking 'Chicken' topping
      
// Submit the form
cy.get('[type="submit"]').click();

// Wait for the redirection to complete. It's good to add some assertions or waits to ensure the page has loaded.
cy.url().should('include', '/Pizza');

// Select the last row of the pizza table
cy.get('table tbody tr').last().within(() => {
    // Now within this row, we can verify the contents of each column
    cy.get('td').eq(0).should('contain', 'thin');
    cy.get('td').eq(1).should('contain', 'Mozzarella');
    cy.get('td').eq(2).should('contain', 'Tomato');
    cy.get('td').eq(3).should('contain', 'Chicken');
    cy.get('td').eq(4).should('contain', 'John Doe');
});

    });
  
  });
  