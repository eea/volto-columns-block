import React from 'react';
import { useLocation } from 'react-router-dom';
import config from '@plone/volto/registry';
import { Grid } from 'semantic-ui-react';
import { RenderBlocks } from '@plone/volto/components';
import { COLUMNSBLOCK } from '@eeacms/volto-columns-block/constants';
import cx from 'classnames';

import { getColumns } from './utils';
import { getStyle } from '@eeacms/volto-columns-block/Styles';

const getSide = (side, v) => {
  return `${v?.[side] ? `${v[side]}${v.unit ? v.unit : 'px'}` : '0'}`;
};

const getSides = (v) => {
  return `${getSide('top', v)} ${getSide('right', v)} ${getSide(
    'bottom',
    v,
  )} ${getSide('left', v)}`;
};

const ColumnsBlockView = (props) => {
  const location = useLocation();
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
      <Grid
        columns={gridSize}
        className={
          props.data.reverseWrap ? 'column-grid reverse-wrap' : 'column-grid'
        }
      >
        {columnList.map(([id, column], index) => {
          return (
            <Grid.Column
              key={id}
              {...(gridSizes[gridCols[index]] || gridCols[index])}
              className={cx(
                'column-blocks-wrapper',
                column.settings?.column_class,
              )}
              {...getStyle(column.settings || {})}
            >
              <div
                style={
                  column.settings?.padding
                    ? {
                        padding: getSides(column.settings?.padding),
                      }
                    : {}
                }
              >
                <RenderBlocks
                  {...props}
                  location={location}
                  metadata={metadata}
                  content={column}
                />
              </div>
            </Grid.Column>
          );
        })}
      </Grid>
    </div>
  );
};

export default ColumnsBlockView;
