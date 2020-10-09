import React from 'react';
import { Grid } from 'semantic-ui-react';
import { RenderBlocks } from '@eeacms/volto-blocks-form/components';
import { blocks } from '~/config';
import { COLUMNSBLOCK } from '@eeacms/volto-columns-block/constants';

import { getColumns } from './utils';
import { getStyle } from '@eeacms/volto-columns-block/Styles';

const ColumnsBlockView = (props) => {
  const { gridSizes } = blocks.blocksConfig[COLUMNSBLOCK];
  const { data = {}, gridSize = 12, gridCols = [], block_title } = props.data;
  const metadata = props.metadata || props.properties;
  const columnList = getColumns(data);
  return (
    <div className="columns-view">
      {block_title ? <h3>{block_title}</h3> : ''}
      <Grid columns={gridSize} className="column-grid">
        {columnList.map(([id, column], index) => {
          return (
            <Grid.Column
              key={id}
              {...(gridSizes[gridCols[index]] || gridCols[index])}
              className="column-blocks-wrapper"
              {...getStyle(column.settings || {})}
            >
              {/* <h4>{`Column ${index}`}</h4> */}
              <RenderBlocks {...props} metadata={metadata} content={column} />
            </Grid.Column>
          );
        })}
      </Grid>
    </div>
  );
};

export default ColumnsBlockView;
