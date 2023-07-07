// This is identical to the other Cypress spec file. Once you understand the commentary 
// from the other file, you can delete that one and run this going forward if so desired.

describe('Verify primary site functionality', () => {
    it('validates all primary functionality of home view', () => {
      cy.visit('http://localhost:1234');
      cy.get('#jumbotron > a').should('not.be.disabled');
    });
  
    it('validates all primary functionality of bio view', () => {
      cy.visit('http://localhost:1234');
      cy.get('.hidden--mobile > :nth-child(2) > a').click();
      cy.get('h1').should('contain', 'About Me');
      cy.get('h2').should('contain', 'Vivamus ac justo eu nisi');
      cy.get('img').should('be.visible').and('have.attr', 'src');
    });
  
    it('verifies link to homepage works', () => {
      cy.visit('http://localhost:1234');
      cy.get(':nth-child(1) > a').click();
      cy.get('h1').should('contain', 'My home page')
    });
  
    it('validates all primary functionality of Pizza! view', () => {
      cy.visit('http://localhost:1234');
      cy.intercept('GET', '/pizzas').as('delivery');
      cy.get(':nth-child(3) > a').click();
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
      cy.get('.hidden--mobile > :nth-child(4) > a').click();
      cy.get('#customer').type(`Tester Name`);
      cy.get('#crust').select('thin');
      cy.get('#cheese').type('Asiago and Parmesan');
      cy.get('#sauce').type('bbq');
      cy.get('#id_of_checkbox1').click();
      cy.intercept('POST', '/pizzas').as('sendZa');
      cy.get('[type="submit"]').click();
      cy.wait('@sendZa').then(pkg => {
        let pizzaId;
        const respDetail = pkg.response.body;
        pizzaId = pkg.response.body._id;
        cy.get(':nth-child(3) > a').click();
        cy.get('#pizzas').then(zaTable => {
          expect(zaTable[0].lastChild.lastElementChild.innerText).include(respDetail.customer)
          expect(zaTable[0].lastChild.lastElementChild.innerText).include(respDetail.crust)
          expect(zaTable[0].lastChild.lastElementChild.innerText).include(respDetail.cheese)
          expect(zaTable[0].lastChild.lastElementChild.innerText).include(respDetail.sauce)
          expect(zaTable[0].lastChild.lastElementChild.innerText).include(respDetail.toppings)
        });
        cy.request({
          method: 'DELETE',
          url: `http://localhost:4040/pizzas/${pizzaId}`,
          headers: {
            "Content-Type":"application/json"
          },
          body: {
          }
        });
      });
      cy.get('h1').should('contain', 'List of Pizzas');
      cy.get('footer > a').should('contain', 'Savvy Coders')
      cy.get('footer').should('contain', '2023');
    });
  });
  