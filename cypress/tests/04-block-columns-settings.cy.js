import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const setPageTitle = (title) => {
  cy.clearSlateTitle();
  cy.getSlateTitle().type(title);
  cy.get('.documentFirstHeading').contains(title);
};

const addColumnsBlock = () => {
  cy.getSlate().click();
  cy.get('.ui.basic.icon.button.block-add-button').first().click();
  cy.get('.blocks-chooser .title').contains('Common').click();
  cy.get('.content.active.common .button.columnsBlock')
    .contains('Columns')
    .click({ force: true });
};

const selectColumnsVariation = (label) => {
  cy.contains('.columns-block .ui.card .content p', label)
    .should('be.visible')
    .click({ force: true });
};

const openColumnsSettings = () => {
  cy.get('.columns-block .columns-header').first().click({ force: true });
};

const typeInColumn = (index, text) => {
  cy.get('.columns-block .block-column')
    .eq(index)
    .within(() => {
      cy.get('[contenteditable=true]')
        .first()
        .focus()
        .click({ force: true })
        .type(text);
    });
};

const openFirstColumnSettings = () => {
  cy.get(
    '.field-wrapper-data .columns-area button[title="Go to Column settings"]',
  )
    .first()
    .click({ force: true });
};

const setColumnVerticalAlign = (label) => {
  cy.get('body').then(($body) => {
    if (
      $body.find('.field-wrapper-grid_vertical_align .react-select__control')
        .length
    ) {
      cy.get('.field-wrapper-grid_vertical_align .react-select__control')
        .first()
        .click({ force: true });
      cy.contains('.react-select__option', label).click({ force: true });
      return;
    }

    if (
      $body.find('.field-wrapper-grid_vertical_align select:visible').length
    ) {
      cy.get('.field-wrapper-grid_vertical_align select:visible')
        .first()
        .select(label, { force: true });
      return;
    }

    cy.get('.field-wrapper-grid_vertical_align #field-grid_vertical_align')
      .first()
      .click({ force: true });
    cy.contains('.menu .item, .item', label).first().click({ force: true });
  });
};

const setCheckbox = (field, checked) => {
  cy.get(`input#field-${field}`).then(($input) => {
    const isChecked = $input.prop('checked');
    if (isChecked !== checked) {
      cy.wrap($input)[checked ? 'check' : 'uncheck']({ force: true });
    }
  });
  cy.get(`input#field-${field}`).should(
    checked ? 'be.checked' : 'not.be.checked',
  );
};

const saveAndAssertViewUrl = () => {
  cy.get('#toolbar-save').click();
  cy.url().should('eq', `${Cypress.config().baseUrl}/cypress/my-page`);
};

describe('Columns Block: Settings Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('applies column style settings in view mode', () => {
    setPageTitle('Columns Column Settings');
    addColumnsBlock();
    selectColumnsVariation('50 / 50');

    typeInColumn(0, 'Primary column');
    typeInColumn(1, 'Secondary column');
    openColumnsSettings();
    openFirstColumnSettings();
    setColumnVerticalAlign('Middle');

    saveAndAssertViewUrl();

    cy.get('#page-document .columns-view .column-grid .column-blocks-wrapper')
      .first()
      .should('have.css', 'vertical-align', 'middle');
    cy.get('#page-document .columns-view')
      .should('contain', 'Primary column')
      .and('contain', 'Secondary column');
  });

  it('toggles reverse wrap in view mode across edit-view cycle', () => {
    setPageTitle('Columns Reverse Wrap');
    addColumnsBlock();
    selectColumnsVariation('50 / 50');

    typeInColumn(0, 'Column A');
    typeInColumn(1, 'Column B');

    openColumnsSettings();
    setCheckbox('reverseWrap', true);

    saveAndAssertViewUrl();

    cy.get('#page-document .columns-view .column-grid')
      .should('have.class', 'reverse-wrap')
      .and('contain', 'Column A')
      .and('contain', 'Column B');

    cy.visit('/cypress/my-page/edit');
    openColumnsSettings();
    setCheckbox('reverseWrap', false);
    saveAndAssertViewUrl();

    cy.get('#page-document .columns-view .column-grid').should(
      'not.have.class',
      'reverse-wrap',
    );
  });
});
