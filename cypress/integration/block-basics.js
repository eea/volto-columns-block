import { setupBeforeEach, tearDownAfterEach } from '../support';

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Block: Empty', () => {
    // without this the clear command below does nothing sometimes
    cy.wait(500);

    // Change page title
    cy.get('[contenteditable=true]').first().clear();

    cy.get('[contenteditable=true]').first().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.get('[contenteditable=true]').first().type('{enter}');

    // Add block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.columnsBlock')
      .contains('Columns')
      .click();

    cy.get('.columns-block .ui.card').eq(2).click();
    cy.get('.field-wrapper-title #field-title').last().type('Column test');
    cy.get('.field-wrapper-data .columns-area button').last().click();

    cy.get('.columns-area .drag.handle.wrapper').first().trigger('mousedown', { which: 1 }, { force: true }).trigger('mousemove', 0, 60, {force: true}).trigger('mouseup');

    cy.get('.field-wrapper-gridCols  #field-gridCols').click();
    cy.get('.react-select__menu').contains('25').click();


    cy.get('[contenteditable=true]').eq(1).click().type("First");
    cy.get('[contenteditable=true]').eq(2).click().type("Second");
    cy.get('[contenteditable=true]').eq(3).click().type("Third");
    cy.get('.block-toolbar button').eq(1).click();

    cy.get('.field-wrapper-grid_vertical_align  #field-grid_vertical_align').click();
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

