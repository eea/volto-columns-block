import React from 'react';
// import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';
import installColumnsBlock from '@eeacms/volto-columns-block';
import { waitFor, render, screen } from '@testing-library/react';

import ColumnsBlockView from './ColumnsBlockView';

const mockStore = configureStore();

// const blockId = '1234';

const blocks = {
  '1234': {
    '@type': 'columnsBlock',
    data: {
      blocks: {
        '9d3b36b7-bc2c-4fd5-80f4-88d104443304': {
          blocks: {
            '421f925b-b89f-4a30-b691-3ee14625101e': {
              '@type': 'text',
              text: 'right',
            },
          },
          blocks_layout: {
            items: ['421f925b-b89f-4a30-b691-3ee14625101e'],
          },
        },
        'b80e32c4-dbd9-481e-a98a-ba42b377e593': {
          blocks: {
            '6cae4500-c1e2-408c-adee-ce87913b072f': {
              '@type': 'text',
              text: 'left marker',
            },
          },
          blocks_layout: {
            items: ['6cae4500-c1e2-408c-adee-ce87913b072f'],
          },
        },
      },
      blocks_layout: {
        items: [
          'b80e32c4-dbd9-481e-a98a-ba42b377e593',
          '9d3b36b7-bc2c-4fd5-80f4-88d104443304',
        ],
      },
    },
    gridCols: ['halfWidth', 'halfWidth'],
    gridSize: 12,
  },
};

const Nop = (props) => <div></div>;
const TextView = ({ data }) => {
  return data.text;
};

test('renders 2 columns', async () => {
  installColumnsBlock(config);
  config.blocks.blocksConfig.text = {
    id: 'text',
    title: 'Text',
    icon: Nop,
    group: 'common',
    view: TextView,
    edit: TextView,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  const store = mockStore({
    content: {
      create: {},
      data: {},
      subrequests: {},
    },
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  const { container } = render(
    <Provider store={store}>
      <ColumnsBlockView data={blocks['1234']} metadata={{ blocks }} />
    </Provider>,
  );
  await waitFor(() => screen.getByText('left marker'));
  expect(container).toMatchSnapshot();
});
