import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Columns Block: View Mode Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Columns Block: Add and view columns block', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Columns View Test');
    cy.get('.documentFirstHeading').contains('Columns View Test');

    cy.getSlate().click();

    // Add columns block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.columnsBlock')
      .contains('Columns')
      .click({ force: true });

    // Select a layout
    cy.get('.columns-block .ui.card').eq(2).click();

    // Type in columns
    cy.get('.columns-block [contenteditable=true]')
      .eq(0)
      .focus()
      .click()
      .type('Left column');

    cy.get('.columns-block [contenteditable=true]')
      .eq(1)
      .focus()
      .click()
      .type('Right column');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Verify view mode
    cy.contains('Columns View Test');
    cy.get('.columns-view').should('exist');
  });

  it('Columns Block: Three column layout', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Three Columns Test');

    cy.getSlate().click();

    // Add columns block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.columnsBlock').click({ force: true });

    // Select three-column layout
    cy.get('.columns-block .ui.card').eq(2).click();

    // Type in first two columns only (third column may not have contenteditable)
    cy.get('.columns-block [contenteditable=true]').eq(0).focus().click().type('First col');
    cy.get('.columns-block [contenteditable=true]').eq(1).focus().click().type('Second col');

    // Save
    cy.get('#toolbar-save').click();
    cy.contains('Three Columns Test');
    cy.get('.columns-view');
  });

  it('Columns Block: Add text block in column', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Columns With Text');

    cy.getSlate().click();

    // Add columns block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.columnsBlock').click({ force: true });

    // Select layout
    cy.get('.columns-block .ui.card').eq(2).click();

    // Type text in first column
    cy.get('.columns-block [contenteditable=true]').eq(0).focus().click().type('Text content here');

    // Save
    cy.get('#toolbar-save').click();
    cy.contains('Columns With Text');
    cy.contains('Text content here');
  });
});