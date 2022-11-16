import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Empty', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.getSlate().click();

    // Add block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.columnsBlock')
      .contains('Columns')
      .click({ force: true });

    cy.get('.columns-block .ui.card').eq(2).click();
    cy.get('.field-wrapper-title #field-title').last().type('Column test');
    cy.get('.field-wrapper-data .columns-area button').last().click();

    cy.get('.columns-area .drag.handle.wrapper')
      .first()
      .trigger('mousedown', { which: 1 }, { force: true })
      .trigger('mousemove', 0, 60, { force: true })
      .trigger('mouseup');

    cy.get('.field-wrapper-gridCols  #field-gridCols').click();
    cy.get('.react-select__menu').contains('25').click();

    cy.get('[contenteditable=true]').first().focus().click();
    cy.get('.columns-block [contenteditable=true]')
      .eq(0)
      .focus()
      .click()
      .type('First');
    cy.get('.columns-block [contenteditable=true]')
      .eq(1)
      .focus()
      .click()
      .type('Second');
    cy.get('.columns-block [contenteditable=true]')
      .eq(2)
      .focus()
      .click()
      .type('Third');
    cy.get('.block-toolbar button').eq(1).click();

    cy.get(
      '.field-wrapper-grid_vertical_align  #field-grid_vertical_align',
    ).click();
    cy.get('.react-select__menu').contains('Middle').click();
    cy.get('.field-wrapper-backgroundColor .ui.huge.button').click();
    cy.get('.github-picker.color-picker span').eq(3).click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.contains('First');
    cy.contains('Second');
    cy.contains('Third');
    cy.get('.columns-view');
  });
});
