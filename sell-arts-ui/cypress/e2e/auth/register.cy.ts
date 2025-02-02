/// <reference types="cypress" />

describe("Register test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should register user", () => {
    cy.visit("/register");
    cy.get("#name").should("be.visible").type(faker.person.firstName());
    cy.get("#email").should("be.visible").type(faker.internet.email());
    cy.get("#password").should("be.visible").type("password");
    cy.get("#confirmPassword").should("be.visible").type("password");
    cy.get("#submit").should("be.visible").click();
    cy.contains("div", "Registered").should("be.visible");
    cy.wait(3000);
    cy.url().should("contain", "/login");
  });

  it("should validate fields", () => {
    cy.visit("/register");
    cy.get("#name").should("be.visible").type(faker.person.firstName());
    cy.get("#email").should("be.visible").type(faker.internet.email());
    cy.get("#password").should("be.visible").type("pass");
    cy.get("#confirmPassword").should("be.visible").type("123");
    cy.get("#submit").should("be.visible").click();
    cy.contains("div", "Min 6 characters required").should("be.visible");
  });
});
