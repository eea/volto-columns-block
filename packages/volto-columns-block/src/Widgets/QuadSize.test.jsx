import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import QuadSize from './QuadSize';

const mockStore = configureStore();

test('renders a quad size widget component', async () => {
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

  expect(await screen.findByText('QuadSize Widget')).toBeInTheDocument();
  expect(await screen.findByText(/Unit/)).toBeInTheDocument();
  expect((await screen.findAllByText(/Size/)).at(-1)).toBeInTheDocument();
  expect(await screen.findByText(/Customize/)).toBeInTheDocument();
});
