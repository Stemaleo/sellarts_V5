/// <reference types="cypress" />

// const { faker } = require("@faker-js/faker");

describe("Login test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should login user", () => {
    cy.visit("/register");
    cy.get("#name").should("be.visible").type(faker.person.firstName());
    const email = faker.internet.email();
    cy.get("#email").should("be.visible").type(email);
    cy.get("#password").should("be.visible").type("password");
    cy.get("#confirmPassword").should("be.visible").type("password");
    cy.get("#submit").should("be.visible").click();
    // cy.contains("div", "Registered").should("be.visible");

    cy.wait(3000);
    cy.url().should("contain", "/login");
    cy.get("#email").should("be.visible").type(email);
    cy.get("#password").should("be.visible").type("password");
    cy.contains("button", "Sign in").should("be.visible").click();
    cy.wait(3000);
    cy.url().should("contain", "/");
  });
});
