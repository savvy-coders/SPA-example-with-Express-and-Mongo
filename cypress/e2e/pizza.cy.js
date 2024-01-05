describe("Pizza API end-to-end testing", () => {
  it("verifies page load", () => {
    cy.visit("http://localhost:1234/Order");
    // by verifying the headings, we can verify the page view is correct
    cy.get("h1").should("have.text", "Order a Pizza");
    // here is a spot where, where the spelling diff unintentional, this test would catch
    // our error - in the h1 Pizza is capitalized, and it is not in the h2. Since it's intentional, we've simply
    // written a separate test with the correct spelling.
    cy.get("h2").should("have.text", "Order a pizza");
  });

  // now that we're sure we're on the right page, let's ensure the form elements exist, and go ahead and fill them out.
  it("verifies form fields and function", () => {
    cy.visit("http://localhost:1234/Order");
    cy.get("#customer").type("Bob");
    cy.get("#crust").select("hella-thick");
    cy.get("#cheese").type("Manchego");
    cy.get("#sauce").type("alfredo");
    cy.get("input").then((input) => {
      expect(input[3]).to.have.value("Chicken");
      expect(input[4]).to.have.value("Onion");
      expect(input[5]).to.have.value("Spinach");
      expect(input[6]).to.have.value("Extra cheese");
      expect(input[7]).to.have.value("Red Pepper");
    });

    // We'll also create an object to refer back to later for verifying the data was what it should be.
    // Later, we could iterate toward a more sustainable test suite by moving this into fixtures and referring to it
    // each time we want to use it by referring to the globally scoped fixture instead!
    const pizzaReq = {
      customer: "Bob",
      crust: "hella-thick",
      cheese: "Manchego",
      sauce: "alfredo",
      toppings: ["Red Pepper"],
    };
    cy.get("#id_of_checkbox5").click();

    // first, we need to allow Cypress to spy on something other than what visibly renders in the window. We can do
    // this by telling it to "intercept" any call of a specific type to a specific endpoint, and that allows us to examine
    // pretty much anything in the outgoing or returning packages. Giving it an Alias is what allows us to use the alias
    // name to refer to the packages using dot notation, like a standard object.
    cy.intercept("POST", "http://localhost:4040/pizzas").as("pizzaPost");

    // Before we actually submit it, let's also create a top level scoped variable to store the id from the response body,
    // that way we can test our real database with an entry and delete it afterward so we aren't bloating with test records.
    let testRecID;
    cy.get('[type="submit"]').click().then(event => {

       cy.wait("@pizzaPost").then((pizzaCall) => {
      expect(pizzaReq.toppings).to.deep.equal(pizzaCall.request.body.toppings);
      console.log(testRecID);

      // now let's  verify that the app state changed and rendered the Pizza view, and that our new pizza is
      // displayed properly there.
      cy.url().should("include", "/Pizza");
      cy.get("h1").should("have.text", "List of Pizzas");

    //   next, we'll get the pizza table and verify that the data we sent is indeed what's listed as the most recent 
    // entry at the bottom. Also note that we're still nested inside of the cy.wait statement above; that's because Cypress 
    // is asynchronous and we need to make sure this section is "wait"ing until the dust settles before we assess things
    //  that change only in response to previous actions - like our post record showing up in the table.
      cy.get("table")
        .find("tr")
        .last()
        .as("finalEntry");

        // now that we stored the whole thing, we can dynamically compare each cell with each pizza detail to ensure it's right
      cy.get("@finalEntry").find('td').then(dataItems => {
        expect(dataItems[0]).to.have.text(pizzaReq.crust)
        expect(dataItems[1]).to.have.text(pizzaReq.cheese)
        expect(dataItems[2]).to.have.text(pizzaReq.sauce)
        expect(dataItems[3]).to.have.text(`${pizzaReq.toppings}`)
        expect(dataItems[4]).to.have.text(pizzaReq.customer)
      })

    //   Finally, now that we know the API is working correctly, and pizza requests are both posting to our backend, and
    // also being reflected in pulls FROM that backend, it's time to clean house. As we test more often, we'll start bloating
    // our database with dummy test data unless we delete that all. We could just go do it manually, but that's a huge
    // hassle, so we'll ask cypress to clean up after itself and use the dynamically populated id for that record to send a 
    //  DELETE "request" to the pizzas endpoint and remove the record we created in this test - as long as all tests pass,
    // our DB stays clean.
      testRecID = pizzaCall.response.body._id;
      cy.log(testRecID)
      cy.request('DELETE', `http://localhost:4040/pizzas/`+testRecID).then(delPizza => {
        expect(delPizza.status).to.equal(200)
      })
    });
}) 
  });
});
