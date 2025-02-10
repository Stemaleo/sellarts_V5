/// <reference types="cypress" />
const { faker } = require("@faker-js/faker");

describe("Setup account", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should register normal user", () => {
    cy.visit("/register");
    cy.get("#name").should("be.visible").type(faker.person.firstName());
    cy.get("#email").should("be.visible").type("user@app.com");
    cy.get("#password").should("be.visible").type("password");
    cy.get("#confirmPassword").should("be.visible").type("password");
    cy.get("#submit").should("be.visible").click();
    // cy.contains("div", "Registered").should("be.visible");
    cy.wait(3000);
    cy.url().should("contain", "/login");
  });

  it("should register artist user", () => {
    cy.visit("/register");
    cy.get("#name").should("be.visible").type(faker.person.firstName());
    cy.get("#email").should("be.visible").type("artist@app.com");
    cy.get("#password").should("be.visible").type("password");
    cy.get("#confirmPassword").should("be.visible").type("password");
    cy.get("#submit").should("be.visible").click();
    // cy.contains("div", "Registered").should("be.visible");
    cy.wait(3000);
    cy.url().should("contain", "/login");
    cy.login("artist@app.com", "password");
    cy.get("#profileMenu").click();
    cy.contains("div", "View Profile").click();
    cy.contains("button", "Create Your Artist Profile").click();
    cy.get("#location").should("be.visible").type(faker.location.city());
    cy.get("#portfolioUrl").should("be.visible").type(faker.internet.url());
    cy.get("#bio").should("be.visible").type(faker.lorem.paragraph());
    cy.get("select").select(1, { force: true });
    cy.contains("button", "Create Profile").click();
    cy.wait(3000);
    cy.get("#profileMenu").click();
    cy.contains("div", "My Artworks").should("be.visible");
  });
});
