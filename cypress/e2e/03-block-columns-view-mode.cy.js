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

const saveAndAssertViewUrl = () => {
  cy.get('#toolbar-save').click();
  cy.url().should('eq', `${Cypress.config().baseUrl}/cypress/my-page`);
};

describe('Columns Block: View Mode Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('persists columns content across edit-view cycles', () => {
    setPageTitle('Columns View Persistence');
    addColumnsBlock();
    selectColumnsVariation('50 / 50');

    typeInColumn(0, 'Left column content');
    typeInColumn(1, 'Right column initial');

    saveAndAssertViewUrl();

    cy.get('#page-document .columns-view')
      .should('exist')
      .and('contain', 'Left column content')
      .and('contain', 'Right column initial');

    cy.visit('/cypress/my-page/edit');
    cy.get('.columns-block').should('contain', 'Left column content');
    cy.get('.columns-block').should('contain', 'Right column initial');

    saveAndAssertViewUrl();

    cy.get('#page-document .columns-view')
      .should('exist')
      .and('contain', 'Left column content')
      .and('contain', 'Right column initial');
  });

  it('renders three-column layout content in view mode', () => {
    setPageTitle('Three Columns View');
    addColumnsBlock();
    selectColumnsVariation('33 / 33 / 33');

    typeInColumn(0, 'First column text');
    typeInColumn(1, 'Second column text');
    typeInColumn(2, 'Third column text');

    saveAndAssertViewUrl();

    cy.get(
      '#page-document .columns-view .column-grid .column-blocks-wrapper',
    ).should('have.length', 3);
    cy.get('#page-document .columns-view')
      .should('contain', 'First column text')
      .and('contain', 'Second column text')
      .and('contain', 'Third column text');
  });
});
