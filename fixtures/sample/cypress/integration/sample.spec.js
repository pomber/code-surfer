function testSlides() {
  // Keep moving right and snapshoting until the hash doesn't change
  cy.hash().then(currentHash => {
    cy.matchImageSnapshot(currentHash.replace(".", "-"));
    cy.get("body")
      .type("{rightarrow}")
      .wait(300)
      .hash()
      .then(nextHash => {
        if (currentHash !== nextHash) {
          testSlides();
        }
      });
  });
}

const url = "http://localhost:8080";

describe("Sample Deck", function() {
  it("shows the correct slides", function() {
    cy.visit(url);
    testSlides();
  });

  it("works in presenter mode", function() {
    cy.visit(`${url}/?mode=presenter#9`).wait(300);
    // cy.clock(new Date(2018).getTime());

    // Hide clock
    cy.get("button")
      .contains("start")
      .then(([button]) => {
        button.parentElement.style.display = "none";
      });

    cy.matchImageSnapshot("presenter-9");
  });

  it("works in grid mode", function() {
    cy.visit(`${url}/?mode=grid#0`).wait(300);
    cy.matchImageSnapshot("grid");
  });
});
