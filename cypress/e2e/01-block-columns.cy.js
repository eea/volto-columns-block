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

    cy.get('.field-wrapper-gridCols  #field-gridCols').click();
    cy.get('.react-select__menu').contains('25').click();

    cy.get('.columns-block .columns-header')
      .click()
      .trigger('keydown', { keyCode: 38, which: 38 });

    cy.get('.columns-block .columns-header')
      .click()
      .trigger('keydown', { keyCode: 40, which: 40 });

    cy.get('.columns-block .columns-header')
      .click()
      .trigger('keydown', { keyCode: 13, which: 13 });

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
      .type('/description{enter}Third');

    cy.get('.block-toolbar button').eq(1).click();

    cy.get(
      '.field-wrapper-grid_vertical_align  #field-grid_vertical_align',
    ).click();
    cy.get('.react-select__menu').contains('Middle').click();

    cy.get('.field-wrapper-backgroundColor .ui.huge.button').click();
    cy.get('.github-picker.color-picker span').eq(3).click();
    cy.get('.field-wrapper-backgroundColor .ui.compact.button').click();
    cy.get('.field-wrapper-backgroundColor .ui.huge.button').click();
    cy.get('.github-picker.color-picker span').eq(3).click();

    cy.get(
      '.inline.field.field-wrapper-padding-slider .slider-widget-wrapper .slider-knob.single',
    ).dblclick();
    cy.get(
      '.inline.field.field-wrapper-padding-slider .slider-widget-wrapper input',
    ).type('3{enter}');
    cy.get(
      '.inline.field.field-wrapper-padding-slider .slider-widget-wrapper .slider-knob.single',
    ).trigger('mousedown', { which: 1 });
    cy.get(
      '.inline.field.field-wrapper-padding-slider .slider-widget-wrapper .semantic_ui_range_inner',
    )
      .trigger('mousemove', { clientX: 500 })
      .trigger('mouseup');

    cy.get(
      '.inline.field.field-wrapper-padding-lockSize .wrapper .checkbox label[for="field-padding-lockSize"]',
    ).click();

    cy.get('.slider-widget-wrapper .slider-knob.single').eq(0).dblclick({
      force: true,
    });
    cy.get('.slider-widget-wrapper .slider-knob.single').eq(0).dblclick({
      force: true,
    });
    cy.get('.slider-widget-wrapper .slider-knob.single').eq(0).dblclick({
      force: true,
    });
    cy.get('.slider-widget-wrapper .slider-knob.single').eq(0).dblclick({
      force: true,
    });

    cy.get('#field-padding-unit .react-select__control').click();
    cy.get('.react-select__menu-list').contains('percentage').click();

    cy.get('#field-padding-unit .react-select__control').click();
    cy.get('.react-select__menu-list').contains('em').click();

    cy.get('#field-padding-unit .react-select__control').click();
    cy.get('.react-select__menu-list').contains('rem').click();

    cy.get('#field-padding-unit .react-select__control').click();
    cy.get('.react-select__menu-list').contains('No value').click();

    cy.get('.columns-block [contenteditable=true]').eq(0).focus().click();
    cy.get('.block-toolbar button').eq(1).click();

    cy.get(
      '.field-wrapper-grid_vertical_align  #field-grid_vertical_align',
    ).click();
    cy.get('.react-select__menu').contains('Middle').click();

    cy.get('.field-wrapper-backgroundColor .ui.huge.button').click();
    cy.get('.github-picker.color-picker span').eq(3).click();

    cy.get('.sidebar-container #sidebar-properties .ui.segment button')
      .eq(1)
      .click();

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
