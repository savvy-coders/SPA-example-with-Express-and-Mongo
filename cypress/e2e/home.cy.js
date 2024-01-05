// Here we're setting up this test suite. A "Describe"
describe("Verify Home View Elements", () => {
  // The first thing we do is set up our it statement, just like in Jasmine, and then, unlike Jasmine, we navigate to the homepage of our project.
  // That means we need also to ensure we have a local instance up and running before we can run our tests, and we need to point our tests at 
  // the localhost port we have our project served up on.
  it("verifies alert button functionality", () => {
    cy.visit("http://localhost:1234");
    // Because what we're checking here is that the Alert pops up and displays the correct text,
    // and because Cypress is checking DOM elements in a real browser, there is some trickiness here. Cypress needs to 
    //  perform an actual mouseclick to trigger the behavior, but it won't be able to actually see the Alert Box itself.
    //  To get around this, we can use stubbing. This is a deep rabbit hole to go down later, but for now, you can think of it as being 
    //  a way to "emulate" a behavior using the source code rather than actually looking at the literal execution, in order to verify
    // things that don't actually occur "in" the window object. Here we use it for alerts, but later, you'll likely use it for mocking API calls
    cy.window().then((win) => {
      // here we are effectively grabbing the window object and storing the "alert" method from it as a method in cypress locally for this session and scope
      cy.stub(win, "alert").as("alertStub");
    });
    // Now, when we click on the button in our Jumbotron to inspect our Alert...
    cy.get("#jumbotron > a")
      .click()
      // we can tell Cypress to pause at that point, and instead invoke the active state of the alert method we stored earlier. Now, since we're working 
      // with our own copy of that method outside of the DOM, we can see what the code execution WOULD output, and verify that it's what we expect.
      .then(() => {
        cy.get("@alertStub").should(
          "have.been.calledWith",
          "Hello! You clicked the Button!"
        );
      });
  });
// This test is a great example of how the syntax of Cypress can make it nearly self-documenting!
  it("verifies header content for homepage", () => {
    cy.visit("http://localhost:1234");
    cy.get("h1").should("have.text", "My home page");
  });
//  Same here - it does exactly what it looks like it does!
  it("verifies correct display of jumbotron background", () => {
    cy.visit("http://localhost:1234");
    cy.get("#jumbotron").should("have.css", "background-image", 'url("http://localhost:1234/photo-1528334713982-2d1fe11a157a.b47d623e.jpg")');
  });
  // This is a test that's truly trickier, and not self-documenting at all really.
  it('verifies primary nav elements', ()=> {
    cy.visit("http://localhost:1234");
    // Because all of our nav elements are list items and we have no other list items, we can use that selector to gather all nav links
    cy.get('li').then($foundLinks => {
      // what the above line does is to then store that collection of elements as an object-like data structure that we can then iteratively inspect
      // In order to give us something to compare the list of actual found nav links to the list of links we expect to find, we'll create a simple array 
      // of all nav links we would expect should be found
      const expectedNav = ['Home', 'Bio', 'Pizza!', 'Order Pizza']
      // then we can use a for/of loop to iterate over the items in the $foundLinks object - note, the $ convention is a convention of Cypress. 
      // Check out the docs if you want to learn more.
      for(let realLink of $foundLinks){
        //  finally, it's important to note that what we did above - wrapping found elements into a new data structure in Node - changes the 
        // ability of Cypress to interact directly with it, because it's no longer looking at a DOM element, it's looking at a JS data structure 
        // describing DOM elements. 
        // For this reason, we have to revert now to using Chai and Mocha type conventions. 
        // Thankfully, we already know these - it's the same logic and syntax we used in Jasmine!
        expect(expectedNav).to.contain(realLink.innerText)
      }
      });
  });
});

// We've included copious commentary here to truly breakdown all that's happening for novice developers.
//  It may be helpful to copy paste all of the code into a new file and look at it there to get a better sense for the logical flow in practice.
