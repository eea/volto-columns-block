import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import QuadSize from './QuadSize';

const mockStore = configureStore();

test('renders a quad size widget component', () => {
  const store = mockStore({
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  render(
    <Provider store={store}>
      <QuadSize
        id="quadsize-widget"
        title="QuadSize Widget"
        fieldSet="default"
        onChange={() => {}}
        onBlur={() => {}}
        onClick={() => {}}
      />
    </Provider>,
  );

  expect(screen.getByText('QuadSize Widget')).toBeInTheDocument();
  expect(screen.getByText(/Unit/)).toBeInTheDocument();
  expect(screen.getAllByText(/Size/)[1]).toBeInTheDocument();
  expect(screen.getByText(/Customize/)).toBeInTheDocument();
});
