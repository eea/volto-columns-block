import { vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';

import ColumnsWidget from './ColumnsWidget';

vi.mock('@plone/volto/components/theme/Icon/Icon', () => ({
  default: () => <span>Icon</span>,
}));

vi.mock('@plone/volto/components/manage/Widgets/FormFieldWrapper', () => ({
  default: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock('@plone/volto/components/manage/DragDropList/DragDropList', () => ({
  default: ({ childList, children }) => (
    <div>
      {childList.map(([childId], index) => (
        <div key={childId}>
          {children({
            childId,
            index,
            draginfo: {
              innerRef: vi.fn(),
              draggableProps: {},
              dragHandleProps: {},
            },
          })}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@plone/volto/helpers/Blocks/Blocks', () => ({
  emptyBlocksForm: vi.fn(() => ({
    blocks: {},
    blocks_layout: {
      items: [],
    },
  })),
}));

vi.mock('@plone/volto/icons/drag.svg', () => ({ default: 'drag.svg' }), {
  virtual: true,
});
vi.mock('@plone/volto/icons/delete.svg', () => ({ default: 'delete.svg' }), {
  virtual: true,
});
vi.mock(
  '@plone/volto/icons/circle-plus.svg',
  () => ({ default: 'circle-plus.svg' }),
  {
    virtual: true,
  },
);
vi.mock('@plone/volto/icons/pencil.svg', () => ({ default: 'pencil.svg' }), {
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
    const setActiveColumn = vi.fn();

    render(
      <IntlProvider locale="en" messages={{}}>
        <ColumnsWidget
          id="data"
          title="Columns"
          value={singleColumnValue}
          intl={intl}
          onChange={vi.fn()}
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
