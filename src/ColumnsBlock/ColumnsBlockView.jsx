import React from 'react';
import { Grid } from 'semantic-ui-react';
import { renderBlocks } from '@plone/volto/helpers';
import { getColumns, empty } from './utils';

const ColumnsBlockView = (props) => {
  const { coldata = empty(), block_title } = props.data;
  const columnList = getColumns(coldata);
  return (
    <div>
      {block_title ? <h3>{block_title}</h3> : ''}
      <Grid columns={columnList.length}>
        {columnList.map(([id, column], index) => {
          return (
            <Grid.Column className="demo-column" key={id}>
              <h4>{`Column ${index}`}</h4>
              {renderBlocks(column, props)}
            </Grid.Column>
          );
        })}
      </Grid>
    </div>
  );
};

export default ColumnsBlockView;
