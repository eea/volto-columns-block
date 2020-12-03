import columnSVG from './ColumnsBlock/icons/three-columns.svg';

import {
  ColumnsBlockView,
  ColumnsBlockEdit,
  ColumnsLayoutSchema,
} from './ColumnsBlock';
import { ColumnsWidget, LayoutSelectWidget } from './Widgets';
import ColorPickerWidget from './Widgets/SimpleColorPickerWidget.jsx';
import { gridSizes, variants } from './grid';
import { COLUMNSBLOCK } from './constants';
import { cloneColumnsBlockData } from './utils';

const extendedSchema = (config) => {
  const choices = Object.keys(config.blocks.blocksConfig)
    .map((key) => {
      if (config.blocks.blocksConfig[key]?.restricted) {
        return false;
      } else {
        const title = config.blocks.blocksConfig[key]?.title || key;
        return [key, title];
      }
    })
    .filter((val) => !!val);

  choices.push(['accordion', 'Accordion']);

  return {
    ...ColumnsLayoutSchema,
    properties: {
      ...ColumnsLayoutSchema.properties,
      allowedBlocks: {
        ...ColumnsLayoutSchema.properties.allowedBlocks,
        items: {
          choices: choices,
        },
      },
    },
  };
};

export default function install(config) {
  config.blocks.blocksConfig[COLUMNSBLOCK] = {
    id: 'columnsBlock',
    title: 'Columns',
    icon: columnSVG,
    group: 'common',
    view: ColumnsBlockView,
    edit: ColumnsBlockEdit,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    schema: extendedSchema(config),
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    gridSizes,
    variants,
    available_colors: [
      // '#B80000',
      // '#DB3E00',
      // '#FCCB00',
      // '#008B02',
      // '#006B76',
      // '#1273DE',
      // '#004DCF',
      // '#5300EB',
      '#EFEFEF',
      '#EB9694',
      '#FAD0C3',
      '#FEF3BD',
      '#C1E1C5',
      '#BEDADC',
      '#C4DEF6',
      '#BED3F3',
      '#D4C4FB',
    ],
    cloneData: cloneColumnsBlockData,
  };

  config.widgets.type.columns = ColumnsWidget;
  config.widgets.widget.simple_color_picker = ColorPickerWidget;
  config.widgets.widget.layout_select = LayoutSelectWidget;

  return config;
}
