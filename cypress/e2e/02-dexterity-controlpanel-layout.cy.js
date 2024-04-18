import { slateLayoutBeforeEach, slateLayoutAfterEach } from '../support/e2e';

describe('ControlPanel: Dexterity Content-Types Layout', () => {
  beforeEach(slateLayoutBeforeEach);
  afterEach(slateLayoutAfterEach);

  it('Edit Blocks Layout for Book', () => {
    cy.visit('/controlpanel/dexterity-types');

    cy.get('a[href="/controlpanel/dexterity-types/book"]').should(
      'have.text',
      'book',
    );

    cy.visit('/controlpanel/dexterity-types/book/layout');
    cy.get('#page-controlpanel-layout').contains(
      'Can not edit Layout for book',
    );
    cy.get('#page-controlpanel-layout button').click();

    // Wait a bit for draftjs to load, without this the title block
    // custom placeholder is missing and cypress gives a timeout error
    cy.wait(1000);
    cy.get('input[id="field-placeholder"]').type('Book title');
    cy.get('label[for="field-required"]').click();
    cy.get('label[for="field-fixed"]').click();

    cy.getSlate().click();

    cy.get('.ui.basic.icon.button.block-add-button:visible').click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.columnsBlock')
      .contains('Columns')
      .click({ force: true });
    cy.get('.block.inner.columnsBlock .cards .card:nth-child(1)').click();

    cy.get('#field-allowedBlocks.react-select-container')
      .click()
      .type('Image{enter}');
    cy.get('#field-allowedBlocks.react-select-container')
      .click()
      .type('Text{enter}');

    cy.get('.columns-block .grid .column:nth-child(1) .block-editor-slate')
      .click({ force: true })
      .type('Text 1{enter}');

    cy.get('#toolbar-save').click();

    cy.visit('/cypress');

    cy.get('button[class="add"]').click();
    cy.get('#toolbar-add-book').click();
    cy.get('.block.title').contains('Book title');

    // Change book title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My First Book');
    cy.get('.documentFirstHeading').contains('My First Book');

    cy.get(
      '.columns-block .grid .column:nth-child(2) .block-editor-slate',
    ).click();
    cy.get('.ui.basic.icon.button.block-add-button:visible').click();
    cy.get('.content.active.mostUsed .button.image')
      .contains('Image')
      .click({ force: true });

    cy.get('.block.image input[type="text"]')
      .click()
      .type(
        'https://eea.github.io/volto-eea-design-system/img/eea_icon.png{enter}',
      );

    cy.get('#toolbar-save').click();
    cy.get('.documentFirstHeading').contains('My First Book');
    cy.get('.columns-view .column-grid .column:nth-child(1)').contains(
      'Text 1',
    );
    cy.get('.columns-view .column-grid .image img').should(
      'have.attr',
      'src',
      'https://eea.github.io/volto-eea-design-system/img/eea_icon.png',
    );
  });
});
