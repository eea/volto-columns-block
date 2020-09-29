import React from 'react';
import { Grid } from 'semantic-ui-react';
import { RenderBlocks } from '@plone/volto/components';
import { blocks } from '~/config';
import { COLUMNSBLOCK } from '@eeacms/volto-columns-block/constants';

import { getColumns } from './utils';
import { getStyle } from '@eeacms/volto-columns-block/Styles';

const ColumnsBlockView = (props) => {
  const { gridSizes } = blocks.blocksConfig[COLUMNSBLOCK];
  const {
    coldata = {},
    gridSize = 12,
    gridCols = [],
    block_title,
  } = props.data;
  const columnList = getColumns(coldata);
  return (
    <div className="columns-view">
      {block_title ? <h3>{block_title}</h3> : ''}
      <Grid columns={gridSize} className="column-grid">
        {columnList.map(([id, column], index) => {
          return (
            <Grid.Column
              className="demo-column"
              key={id}
              {...(gridSizes[gridCols[index]] || gridCols[index])}
            >
              <div className="column-bocks-wrapper"
                   style={getStyle(column.settings || {})}>
                {/* <h4>{`Column ${index}`}</h4> */}
                <RenderBlocks {...props} content={column} />
              </div>
            </Grid.Column>
          );
        })}
      </Grid>
    </div>
  );
};

export default ColumnsBlockView;
