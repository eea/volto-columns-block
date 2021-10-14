import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import ColumnVariations from './ColumnVariations';

const mockStore = configureStore();

test('renders column variations component', () => {
  const store = mockStore({
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  const component = renderer.create(
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
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
