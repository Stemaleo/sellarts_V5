describe("Can view artworks", () => {
  it("should display filter options", () => {
    cy.visit("/");
    cy.viewport(1920, 1080);
    cy.contains("a", "Arts").click();
    cy.get("#hamMenu").then((e) => {
      if (e.is(":visible")) cy.wrap(e).click();
      cy.wait(500);
    });
    cy.get("#paintTypeFilter").should("be.visible").children().should("have.length.gt", 1);

    cy.get("#artGrid")
      .should("be.visible")
      .children()
      .then((children) => {
        const len = children.length;

        cy.contains("label", "Other").click();
        cy.get("#artGrid").children().should("have.length.lt", len);
      });
  });
});
