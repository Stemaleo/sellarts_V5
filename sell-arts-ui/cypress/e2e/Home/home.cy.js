/// <reference types="cypress" />

describe("Happy path", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load home page", () => {
    cy.get("#logo").should("be.visible");
  });

  it("Automatic redirect to lang route", () => {
    cy.url().should("contain", "/en");
  });

  it("Automatic redirect to lang route", () => {
    cy.contains("a", "Artists").click();
    cy.url().should("contain", "/artists");
  });

  it("should switch language", () => {
    cy.visit("/fr");
    cy.contains("a", "Accueil").should("be.visible");
  });
});
