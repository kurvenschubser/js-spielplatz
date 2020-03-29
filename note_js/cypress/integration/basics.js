context("basic navigation", () => {
  it("mimic click on first menu entry", () => {
    cy.visit("http://localhost:8080/OOP.html");
    cy.get("nav > section")
      .first()
      .trigger("mouseover");
    cy.get("#menu > section")
      .first()
      .click();
    cy.get("#left > ul > li")
      .first()
      .as("firstMenuEntry");
    cy.get("@firstMenuEntry")
      .click();
    cy.get("#right input").invoke("val").then(formval => {
      cy.get("@firstMenuEntry").invoke("text").should(menuval => {
        expect(formval).to.eq(menuval);
      });
    });
  });
});
