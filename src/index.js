import codeSVG from '@plone/volto/icons/code.svg';

import { ColumnsBlockView, ColumnsBlockEdit } from './ColumnsBlock';
import ColumnsWidget from './ColumnsWidget';

export default function install(config) {
  config.blocks.blocksConfig.columnsBlock = {
    id: 'columnsBlock',
    title: 'Columns',
    icon: codeSVG,
    group: 'common',
    view: ColumnsBlockView,
    edit: ColumnsBlockEdit,
    restricted: false,
    mostUsed: true,
    blockHasOwnFocusManagement: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  config.widgets.type.columns = ColumnsWidget;

  return config;
}
