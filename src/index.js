import columnSVG from './ColumnsBlock/icons/three-columns.svg';

import { ColumnsBlockView, ColumnsBlockChooser } from './ColumnsBlock';
import { ColumnsWidget, LayoutSelectWidget } from './Widgets';
import ColorPickerWidget from './Widgets/SimpleColorPickerWidget.jsx';
import { gridSizes, variants } from './grid';
import { COLUMNSBLOCK } from './constants';
import { cloneColumnsBlockData } from './utils';

export default function install(config) {
  config.blocks.blocksConfig[COLUMNSBLOCK] = {
    id: 'columnsBlock',
    title: 'Columns',
    icon: columnSVG,
    group: 'common',
    view: ColumnsBlockView,
    edit: ColumnsBlockChooser,
    restricted: false,
    mostUsed: true,
    blockHasOwnFocusManagement: true,
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
