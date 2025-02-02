/// <reference types="cypress" />
import "cypress-file-upload";
import { cp } from "fs";

const { faker } = require("@faker-js/faker");
const email = faker.internet.email();
describe("Login test", { includeShadowDom: true }, () => {
  before(() => {
    // cy.visit("/register");
    // cy.get("#name").should("be.visible").type(faker.person.firstName());

    // cy.get("#email").should("be.visible").type(email);
    // cy.get("#password").should("be.visible").type("password");
    // cy.get("#confirmPassword").should("be.visible").type("password");
    // cy.get("#submit").should("be.visible").click();
    // // cy.contains("div", "Registered").should("be.visible");
    // cy.wait(3000);
    cy.login("artist@app.com", "password");
    // cy.get("#profileMenu").click();
    // cy.contains("div", "View Profile").click();
    // cy.contains("button", "Create Your Artist Profile").click();
    // cy.get("#location").should("be.visible").type(faker.location.city());
    // cy.get("#portfolioUrl").should("be.visible").type(faker.internet.url());
    // cy.get("#bio").should("be.visible").type(faker.lorem.paragraph());
    // cy.get("select").select(1, { force: true });
    // cy.contains("button", "Create Profile").click();
    // cy.wait(3000);
    // cy.get("#profileMenu").click();
    // cy.contains("div", "My Artworks").should("be.visible");
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("should create a artwork", () => {
    cy.get("#profileMenu").click();
    cy.contains("div", "My Artworks").click();

    cy.get("#hamMenu").then((e) => {
      if (e.is(":visible")) cy.wrap(e).click();
      cy.wait(5000);
    });
    cy.get("a[href='/artist_app/arts']").last().should("be.visible").click();
    // cy.contains("a", "Arts").should("be.visible").click();
    cy.contains("h1", "My Art Works").should("be.visible");
    cy.contains("button", "Create New Art").should("be.visible").click();
    const title = faker.book.title();
    cy.get("#title").should("be.visible").type(title);
    cy.get("#description").should("be.visible").type(faker.lorem.paragraph());
    // cy.get("select[name='paintingTypeId']").select(1, { force: true });
    cy.get("select[name='paintingTypeId']").then(($select) => {
      const options = $select.find("option");
      const randomIndex = Math.floor(Math.random() * options.length);
      const randomValue = options.eq(randomIndex).val();

      cy.get("select[name='paintingTypeId']").select(randomValue as number, { force: true }); // Select the random option by its value
    });
    cy.get("select[name='materialTypeId']").then(($select) => {
      const options = $select.find("option");
      const randomIndex = Math.floor(Math.random() * options.length);
      const randomValue = options.eq(randomIndex).val();

      cy.get("select[name='materialTypeId']").select(randomValue as number, { force: true }); // Select the random option by its value
    });
    // cy.get("select[name='materialTypeId']").select(1, { force: true });
    cy.get("#width").should("be.visible").type("10");
    cy.get("#height").should("be.visible").type("30");
    cy.get("#price").should("be.visible").type("300");

    // Use `cy.get` to select the file input, and attach the file
    cy.get('input[type="file"]').attachFile("sample.jpg");

    cy.contains("button", "Create Artwork").click();
    cy.contains("div", "Created...").should("be.visible");

    cy.get("#hamMenu").then((e) => {
      if (e.is(":visible")) cy.wrap(e).click();
      cy.wait(5000);
    });
    cy.get("a[href='/artist_app/arts']").last().should("be.visible").click();
    cy.get('input[placeholder="Search Title"]').type(title);
    cy.contains("div", title).should("be.visible");
  });
});
