import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';
import ColumnsBlockEdit from './ColumnsBlockEdit';
import { COLUMNSBLOCK } from '../constants';

jest.mock(
  '@eeacms/volto-columns-block/constants',
  () => ({
    COLUMNSBLOCK: 'columnsBlock',
  }),
  { virtual: true },
);

jest.mock('../Styles', () => ({
  makeStyleSchema: jest.fn(() => ({})),
  getStyle: jest.fn(() => ({})),
}));

jest.mock('./schema', () => ({
  ColumnsBlockSchema: jest.fn(() => ({
    properties: {
      gridCols: {
        choices: [],
      },
    },
  })),
}));

jest.mock('./utils', () => ({
  getColumns: jest.fn((data) =>
    (data?.blocks_layout?.items || []).map((id) => [id, data.blocks?.[id]]),
  ),
  empty: jest.fn(),
  defaultNewColumn: jest.fn(() => ({
    blocks: {},
    blocks_layout: {
      items: [],
    },
  })),
  hasColumns: jest.fn((data) => !!data?.blocks_layout?.items?.length),
  forEachColumn: jest.fn((data, callback) => {
    (data?.blocks_layout?.items || []).forEach((id) =>
      callback([id, data.blocks?.[id]]),
    );
  }),
  columnIsEmpty: jest.fn(
    (colData) => !(colData?.blocks_layout?.items?.length > 0),
  ),
}));

jest.mock('./ColumnVariations', () => () => <div>ColumnVariations</div>);

jest.mock('@plone/volto/helpers', () => ({
  emptyBlocksForm: jest.fn(() => ({
    blocks: {},
    blocks_layout: {
      items: [],
    },
  })),
  getBlocksLayoutFieldname: jest.fn(() => 'blocks_layout'),
}));

jest.mock('@plone/volto/components', () => ({
  BlocksForm: jest.fn(
    ({ multiSelected, onSelectBlock, properties, selectedBlock }) => {
      const blockList = properties.blocks
        ? Object.entries(properties.blocks)
        : [];

      return (
        <div
          data-testid="column-blocks-form"
          data-multi-selected={(multiSelected || []).join(',')}
          data-selected-block={selectedBlock || ''}
        >
          {blockList.map(([blockId]) => (
            <button
              key={blockId}
              type="button"
              aria-label={`Select ${blockId}`}
              onClick={(event) => onSelectBlock?.(blockId, null, event)}
            >
              Select {blockId}
            </button>
          ))}
        </div>
      );
    },
  ),
  BlocksToolbar: ({ onSelectBlock, selectedBlock, selectedBlocks }) => (
    <div
      data-testid="blocks-toolbar"
      data-selected-block={selectedBlock || ''}
      data-selected-blocks={(selectedBlocks || []).join(',')}
    >
      <button type="button" onClick={() => onSelectBlock?.(null)}>
        Clear selection
      </button>
    </div>
  ),
  SidebarPortal: ({ children }) => <div>{children}</div>,
  Icon: () => <div>Icon</div>,
  BlockDataForm: () => <div>BlockDataForm</div>,
}));

jest.mock('../less/columns.less', () => ({}), { virtual: true });
jest.mock('./icons/eraser.svg', () => 'eraser.svg', { virtual: true });
jest.mock('@plone/volto/icons/up.svg', () => 'up.svg', { virtual: true });

const mockStore = configureStore();
const store = mockStore({
  intl: {
    locale: 'en',
    messages: {},
  },
});

const mockData = {
  title: 'Columns',
  gridCols: ['halfWidth'],
  gridSize: 12,
  data: {
    blocks: {
      col1: {
        blocks: {
          block1: {
            '@type': 'text',
          },
          block2: {
            '@type': 'text',
          },
        },
        blocks_layout: {
          items: ['block1', 'block2'],
        },
        settings: {},
      },
    },
    blocks_layout: {
      items: ['col1'],
    },
  },
};

describe('ColumnsBlockEdit', () => {
  beforeEach(() => {
    config.blocks.blocksConfig[COLUMNSBLOCK] = {
      ...config.blocks.blocksConfig[COLUMNSBLOCK],
      gridSizes: {
        halfWidth: {},
      },
      variants: [],
      available_colors: [],
    };
    config.settings = {
      ...config.settings,
      defaultBlockType: 'text',
    };
  });

  it('forwards nested multi selection and clears it cleanly from the toolbar', () => {
    render(
      <Provider store={store}>
        <ColumnsBlockEdit
          block="columns-block"
          blockNode={{ current: document.createElement('div') }}
          data={mockData}
          errors={{}}
          manage={true}
          metadata={{}}
          onAddBlock={jest.fn()}
          onChangeBlock={jest.fn()}
          onChangeField={jest.fn()}
          onFocusNextBlock={jest.fn()}
          onFocusPreviousBlock={jest.fn()}
          pathname="/"
          selected={true}
        />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select block1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Select block2' }), {
      shiftKey: true,
    });

    expect(screen.getByTestId('column-blocks-form')).toHaveAttribute(
      'data-multi-selected',
      'block1,block2',
    );
    expect(screen.getByTestId('blocks-toolbar')).toHaveAttribute(
      'data-selected-blocks',
      'block1,block2',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));

    expect(screen.getByTestId('column-blocks-form')).toHaveAttribute(
      'data-multi-selected',
      '',
    );
    expect(screen.getByText('BlockDataForm')).toBeInTheDocument();
  });
});
