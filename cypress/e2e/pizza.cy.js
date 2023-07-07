describe('Verify primary site functionality', () => {
  it('validates all primary functionality of home view', () => {
    // land on homepage
    cy.visit('http://localhost:1234');
    // check that the Call to Action button appears to be functional
    cy.get('#jumbotron > a').should('not.be.disabled');
  });

  it('validates all primary functionality of bio view', () => {
    cy.visit('http://localhost:1234');
    // click on the Bio link
    cy.get('.hidden--mobile > :nth-child(2) > a').click();
    // verify headings
    cy.get('h1').should('contain', 'About Me');
    cy.get('h2').should('contain', 'Vivamus ac justo eu nisi');
    // verify image
    cy.get('img').should('be.visible').and('have.attr', 'src');
  });

  
  it('verifies link to homepage works', () => {
    cy.visit('http://localhost:1234');
    // click on Home link
    cy.get(':nth-child(1) > a').click();
    // verify Home heading
    cy.get('h1').should('contain', 'My home page')
  });

    it('validates all primary functionality of Pizza! view', () => {
    cy.visit('http://localhost:1234');
    // click on the Pizza! link
    cy.intercept('GET', '/pizzas').as('delivery');
    cy.get(':nth-child(3) > a').click();
    // let's get fancy and verify that the full data package is displayed to the user as expected!
    cy.wait('@delivery').then(call => {
      const reply = call.response;
      cy.get('#pizzas').then(za => {
        expect(za[0].children[0].children[0].innerText).include('Crust');
        expect(za[0].children[0].children[0].innerText).include('Cheese' );
        expect(za[0].children[0].children[0].innerText).include('Sauce' );
        expect(za[0].children[0].children[0].innerText).include('Toppings' );
        expect(za[0].children[0].children[0].innerText).include('Customer' );
      })
    });
  });

  it('validates all primary functionality of order view', () => {
    cy.visit('http://localhost:1234');
    // click on the Order view link
    cy.get('.hidden--mobile > :nth-child(4) > a').click();
    // fill out form fields
    cy.get('#customer').type(`Tester Name`);
    cy.get('#crust').select('thin');
    cy.get('#cheese').type('Asiago and Parmesan');
    cy.get('#sauce').type('bbq');
    cy.get('#id_of_checkbox1').click();
    // intercept the outgoing call to ensure the FE is sending the correct data -
    //  then we can verify it shows up in as being added to the list afterward!
    cy.intercept('POST', '/pizzas').as('sendZa');
    // click submit on the form to fire off the call for which we just arranged an intercept
    cy.get('[type="submit"]').click();
    // wait for the intercept to catch the call
    cy.wait('@sendZa').then(pkg => {

      // Since we're creating a test record, we want to be able to delete it afterward so we don't leave any junk records in 
      // our production database. We can do this by creating a variable, then assigning the "._id" value from the 
      // response.body package as its value. This way, we can call that value later dynamically by using this variable
      //  name and delete the record at the end.
      let pizzaId;
      
      // save the response body to a variable for comparison later on
      const respDetail = pkg.response.body;

      // assign the id from the new record to our variable to delete this record later
      pizzaId = pkg.response.body._id;

      // click on the pizzas view to ensure the button refreshes the page and the new pizza is there
      cy.get(':nth-child(3) > a').click();

      // select the pizzas table and verify that all entries from the package display in the table
      // please note this is NOT best practice as based on our specific project, it's very probable we'll
      // have multiple entries that meet this criteria; we would need more robust testing in production, but this
      // should give you the idea.
      cy.get('#pizzas').then(zaTable => {
        expect(zaTable[0].lastChild.lastElementChild.innerText).include(respDetail.customer)
        expect(zaTable[0].lastChild.lastElementChild.innerText).include(respDetail.crust)
        expect(zaTable[0].lastChild.lastElementChild.innerText).include(respDetail.cheese)
        expect(zaTable[0].lastChild.lastElementChild.innerText).include(respDetail.sauce)
        expect(zaTable[0].lastChild.lastElementChild.innerText).include(respDetail.toppings)
      });

        // Finally, let's clean up our test record so we don't leave junk data in the real database!
        cy.request({
          method: 'DELETE',

          //Here, we send a simple DELETE request using the ".request()" cypress method and using 
          // template literals to add the pizzaId value at the end of our URL, so we're selecting the 
          // correct record to delete.
          url: `http://localhost:4040/pizzas/${pizzaId}`,
          headers: {
            "Content-Type":"application/json"
          },

          // based on our model and routes, we DELETE by sending an empty body to our base 
          // URL+endpoint route+ID to be deleted. In some cases, you'd do this with a colon between 
          // the route and the ID, like this: 'http://localhost:4040/pizzas:${pizzaId}' or in other cases,
          // the id might be passed in the body. Always verify with your API docs what format your endpoint
          // expects before creating these tests as a general rule!
          body: {
          }
        });
    });
    // double check the header on this Pizza view as well
    cy.get('h1').should('contain', 'List of Pizzas');
    // check footer displays as intended
    cy.get('footer > a').should('contain', 'Savvy Coders')
    cy.get('footer').should('contain', '2023');
  });
});
