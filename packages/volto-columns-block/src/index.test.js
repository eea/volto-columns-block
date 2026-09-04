import { vi } from 'vitest';
import applyConfig from './index';
import { COLUMNSBLOCK } from './constants';
vi.mock('./ColumnsBlock', () => ({
  ColumnsBlockView: () => null,
  ColumnsBlockEdit: () => null,
  ColumnsLayoutSchema: {
    properties: {
      allowedBlocks: {
        items: {
          choices: [],
        },
      },
    },
  },
}));

vi.mock('./Widgets', () => ({
  ColumnsWidget: () => null,
  LayoutSelectWidget: () => null,
  SliderWidget: () => null,
  QuadSizeWidget: () => null,
}));

vi.mock('./Widgets/SimpleColorPickerWidget.jsx', () => ({
  default: () => null,
}));
vi.mock('./grid', () => ({
  gridSizes: {},
  variants: [],
}));
vi.mock('./utils', () => ({
  cloneColumnsBlockData: vi.fn(),
}));
vi.mock('@plone/volto/helpers', () => ({
  getBlocks: vi.fn(),
}));

describe('applyConfig', () => {
  it('should include columns in allowed blocks schema choices', () => {
    const config = {
      blocks: {
        blocksConfig: {
          text: { title: 'Text', restricted: false },
          image: { restricted: false },
          image_test: { title: 'Image', restricted: true },
        },
      },
      widgets: {
        type: {},
        widget: {},
      },
    };

    const newConfig = applyConfig(config);

    expect(
      newConfig.blocks.blocksConfig[COLUMNSBLOCK].schema.properties
        .allowedBlocks.items.choices,
    ).toEqual([
      ['text', 'Text'],
      ['image', 'image'],
      [COLUMNSBLOCK, 'Columns'],
    ]);
  });
});
