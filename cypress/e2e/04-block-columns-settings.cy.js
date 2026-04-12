import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Columns Block: Settings Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Columns Block: Change grid columns via sidebar', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Columns Grid Test');

    cy.getSlate().click();

    // Add columns block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.columnsBlock').click({ force: true });

    // Select layout
    cy.get('.columns-block .ui.card').eq(2).click();

    // Change grid columns via sidebar - just open and select first option
    cy.get('.field-wrapper-gridCols #field-gridCols').click();
    cy.get('.react-select__menu .react-select__option').first().click();

    // Type in column
    cy.get('.columns-block [contenteditable=true]').eq(0).focus().click().type('Grid content');

    // Save
    cy.get('#toolbar-save').click();
    cy.contains('Columns Grid Test');
  });

  it('Columns Block: Set column title', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Column Title Test');

    cy.getSlate().click();

    // Add columns block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.columnsBlock').click({ force: true });

    // Select layout
    cy.get('.columns-block .ui.card').eq(2).click();

    // Set column title
    cy.get('.field-wrapper-title #field-title').last().type('My Column Block');

    // Type in column
    cy.get('.columns-block [contenteditable=true]').eq(0).focus().click().type('Content with title');

    // Save
    cy.get('#toolbar-save').click();
    cy.contains('Column Title Test');
  });

  it('Columns Block: Add description block in column', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Columns Description Block');

    cy.getSlate().click();

    // Add columns block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.columnsBlock').click({ force: true });

    // Select layout
    cy.get('.columns-block .ui.card').eq(2).click();

    // Add description in first column
    cy.get('.columns-block [contenteditable=true]').eq(0).focus().click().type('/description{enter}A description block');

    // Save
    cy.get('#toolbar-save').click();
    cy.contains('Columns Description Block');
  });
});