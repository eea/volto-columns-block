import React from 'react';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import '@testing-library/jest-dom/extend-expect';

import ColumnVariations from './ColumnVariations';

const mockStore = configureStore();

test('renders column variations component', () => {
  const store = mockStore({
    intl: {
      locale: 'en',
      formatMessage: () => 'Select layout',
      messages: {},
    },
  });

  render(
    <Provider store={store}>
      <ColumnVariations
        id="column-variations"
        title="Column variations"
        fieldSet="default"
        variants={[
          {
            icon: {},
            defaultData: {
              gridSize: 12,
              gridCols: ['halfWidth', 'halfWidth'],
            },
            common: true,
            title: '50 / 50',
          },
        ]}
        onChange={() => {}}
        onClick={() => {}}
      />
    </Provider>,
  );

  expect(screen.getByText(/Select layout/)).toBeInTheDocument();
  expect(screen.getByText('50 / 50')).toBeInTheDocument();
});
