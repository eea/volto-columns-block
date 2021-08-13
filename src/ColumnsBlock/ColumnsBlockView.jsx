import React from 'react';
import config from '@plone/volto/registry';
import { Grid } from 'semantic-ui-react';
import { RenderBlocks } from '@plone/volto/components';
import { COLUMNSBLOCK } from '@eeacms/volto-columns-block/constants';

import { getColumns } from './utils';
import { getStyle } from '@eeacms/volto-columns-block/Styles';

const ColumnsBlockView = (props) => {
  const { gridSizes } = config.blocks.blocksConfig[COLUMNSBLOCK];
  const { data = {}, gridSize = 12, gridCols = [] } = props.data;
  const metadata = props.metadata || props.properties;
  const columnList = getColumns(data);
  const customId = props.data?.title
    ?.toLowerCase()
    ?.replace(/[^a-zA-Z-\s]/gi, '')
    ?.trim()
    ?.replace(/\s+/gi, '-');
  return (
    <div className="columns-view" id={customId}>
      <Grid columns={gridSize} className="column-grid">
        {columnList.map(([id, column], index) => {
          return (
            <Grid.Column
              key={id}
              {...(gridSizes[gridCols[index]] || gridCols[index])}
              className="column-blocks-wrapper"
              {...getStyle(column.settings || {})}
            >
              <RenderBlocks {...props} metadata={metadata} content={column} />
            </Grid.Column>
          );
        })}
      </Grid>
    </div>
  );
};

export default ColumnsBlockView;
