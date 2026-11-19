import { vi } from 'vitest';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { blocksConfig } from '@plone/volto/config/Blocks';
import installSlate from '@plone/volto-slate/index';

global.jest = vi;

const mockSemanticComponents = await vi.importActual('semantic-ui-react');
const mockComponents = await vi.importActual('@plone/volto/components');
const config = (await vi.importActual('@plone/volto/registry')).default;

config.blocks.blocksConfig = {
  ...blocksConfig,
  ...config.blocks.blocksConfig,
};

vi.doMock('semantic-ui-react', () => ({
  __esModule: true,
  ...mockSemanticComponents,
  Popup: ({ content, trigger }) => (
    <div className="popup">
      <div className="trigger">{trigger}</div>
      <div className="content">{content}</div>
    </div>
  ),
}));

vi.doMock('@plone/volto/components', () => ({
  __esModule: true,
  ...mockComponents,
  SidebarPortal: ({ children }) => <div id="sidebar">{children}</div>,
}));

vi.doMock('@plone/volto/registry', () => ({
  __esModule: true,
  default: [installSlate].reduce((acc, apply) => apply(acc), config),
}));

const mockStore = configureStore([thunk]);

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
);

global.store = mockStore({
  intl: {
    locale: 'en',
    messages: {},
    formatMessage: vi.fn(),
  },
  content: {
    create: {},
    subrequests: [],
  },
  connected_data_parameters: {},
  screen: {
    page: {
      width: 768,
    },
  },
});
