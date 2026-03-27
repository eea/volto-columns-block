jest.mock('./ColumnsBlock', () => ({
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

jest.mock('./Widgets', () => ({
  ColumnsWidget: () => null,
  LayoutSelectWidget: () => null,
  SliderWidget: () => null,
  QuadSizeWidget: () => null,
}));

jest.mock('./Widgets/SimpleColorPickerWidget.jsx', () => () => null);
jest.mock('./grid', () => ({
  gridSizes: {},
  variants: [],
}));
jest.mock('./utils', () => ({
  cloneColumnsBlockData: jest.fn(),
}));
jest.mock('@plone/volto/helpers', () => ({
  getBlocks: jest.fn(),
}));

const applyConfig = require('./index').default;
const { COLUMNSBLOCK } = require('./constants');

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
