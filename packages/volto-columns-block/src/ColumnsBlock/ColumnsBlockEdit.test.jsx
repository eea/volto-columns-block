import { vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';
import ColumnsBlockEdit from './ColumnsBlockEdit';
import { COLUMNSBLOCK } from '@eeacms/volto-columns-block/constants';

vi.mock(
  '@eeacms/volto-columns-block/constants',
  () => ({
    COLUMNSBLOCK: 'columnsBlock',
  }),
  { virtual: true },
);

vi.mock('@eeacms/volto-columns-block/Styles', () => ({
  makeStyleSchema: vi.fn(() => ({})),
  getStyle: vi.fn(() => ({})),
}));

vi.mock('./schema', () => ({
  ColumnsBlockSchema: vi.fn(() => ({
    properties: {
      gridCols: {
        choices: [],
      },
    },
  })),
}));

vi.mock('./utils', () => ({
  getColumns: vi.fn((data) =>
    (data?.blocks_layout?.items || []).map((id) => [id, data.blocks?.[id]]),
  ),
  empty: vi.fn(),
  defaultNewColumn: vi.fn(() => ({
    blocks: {},
    blocks_layout: {
      items: [],
    },
  })),
  hasColumns: vi.fn((data) => !!data?.blocks_layout?.items?.length),
  forEachColumn: vi.fn((data, callback) => {
    (data?.blocks_layout?.items || []).forEach((id) =>
      callback([id, data.blocks?.[id]]),
    );
  }),
  columnIsEmpty: vi.fn(
    (colData) => !(colData?.blocks_layout?.items?.length > 0),
  ),
}));

vi.mock('./ColumnVariations', () => ({
  default: () => <div>ColumnVariations</div>,
}));

vi.mock('@plone/volto/helpers/Blocks/Blocks', () => ({
  emptyBlocksForm: vi.fn(() => ({
    blocks: {},
    blocks_layout: {
      items: [],
    },
  })),
  getBlocksLayoutFieldname: vi.fn(() => 'blocks_layout'),
}));

const MockBlocksForm = vi.fn(
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
);

vi.mock('@plone/volto/components/manage/Blocks/Block/BlocksForm', () => ({
  __esModule: true,
  default: (props) => MockBlocksForm(props),
}));

vi.mock('@plone/volto/components/manage/Form/BlocksToolbar', () => ({
  __esModule: true,
  default: ({ onSelectBlock, selectedBlock, selectedBlocks }) => (
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
}));

vi.mock('@plone/volto/components/manage/Form/BlockDataForm', () => ({
  __esModule: true,
  default: () => <div>BlockDataForm</div>,
}));

vi.mock('@plone/volto/components/manage/Sidebar/SidebarPortal', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('@plone/volto/components/theme/Icon/Icon', () => ({
  default: () => <div>Icon</div>,
}));

vi.mock('@eeacms/volto-columns-block/less/columns.less', () => ({}), {
  virtual: true,
});
vi.mock('./icons/eraser.svg', () => ({ default: 'eraser.svg' }), {
  virtual: true,
});
vi.mock('@plone/volto/icons/up.svg', () => ({ default: 'up.svg' }), {
  virtual: true,
});

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
          onAddBlock={vi.fn()}
          onChangeBlock={vi.fn()}
          onChangeField={vi.fn()}
          onFocusNextBlock={vi.fn()}
          onFocusPreviousBlock={vi.fn()}
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
