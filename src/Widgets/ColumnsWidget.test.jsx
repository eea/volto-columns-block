import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';

import ColumnsWidget from './ColumnsWidget';

jest.mock('@plone/volto/components/theme/Icon/Icon', () => () => (
  <span>Icon</span>
));

jest.mock(
  '@plone/volto/components/manage/Widgets/FormFieldWrapper',
  () =>
    ({ children, className }) => <div className={className}>{children}</div>,
);

jest.mock(
  '@plone/volto/components/manage/DragDropList/DragDropList',
  () =>
    ({ childList, children }) => (
      <div>
        {childList.map(([childId], index) => (
          <div key={childId}>
            {children({
              childId,
              index,
              draginfo: {
                innerRef: jest.fn(),
                draggableProps: {},
                dragHandleProps: {},
              },
            })}
          </div>
        ))}
      </div>
    ),
);

jest.mock('@plone/volto/helpers/Blocks/Blocks', () => ({
  emptyBlocksForm: jest.fn(() => ({
    blocks: {},
    blocks_layout: {
      items: [],
    },
  })),
}));

jest.mock('@plone/volto/icons/drag.svg', () => 'drag.svg', {
  virtual: true,
});
jest.mock('@plone/volto/icons/delete.svg', () => 'delete.svg', {
  virtual: true,
});
jest.mock('@plone/volto/icons/circle-plus.svg', () => 'circle-plus.svg', {
  virtual: true,
});
jest.mock('@plone/volto/icons/pencil.svg', () => 'pencil.svg', {
  virtual: true,
});

const intl = {
  formatMessage: ({ defaultMessage, id }) => defaultMessage || id,
};

const singleColumnValue = {
  blocks: {
    col1: {
      blocks: {},
      blocks_layout: {
        items: [],
      },
    },
  },
  blocks_layout: {
    items: ['col1'],
  },
};

describe('ColumnsWidget', () => {
  it('shows column settings for a single-column block', () => {
    const setActiveColumn = jest.fn();

    render(
      <IntlProvider locale="en" messages={{}}>
        <ColumnsWidget
          id="data"
          title="Columns"
          value={singleColumnValue}
          intl={intl}
          onChange={jest.fn()}
          blockData={{ setActiveColumn }}
        />
      </IntlProvider>,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Go to Column settings' }),
    );

    expect(setActiveColumn).toHaveBeenCalledWith('col1');
  });
});
