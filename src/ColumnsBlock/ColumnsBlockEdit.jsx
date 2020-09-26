import React from 'react';
import { Grid } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { Icon, SidebarPortal, InlineForm } from '@plone/volto/components'; // BlocksForm
import { emptyBlocksForm } from '@plone/volto/helpers';
import { BlocksForm } from '@eeacms/volto-blocks-form/components';

import { ColumnsBlockSchema } from './schema';
import { getColumns, empty } from './utils';
import ColumnVariations from './ColumnVariations';
import { blocks } from '~/config';
import { COLUMNSBLOCK } from '@eeacms/volto-columns-block/constants';
import EditBlockWrapper from './EditBlockWrapper';

import dragSVG from '@plone/volto/icons/drag.svg';
// import dotsSVG from '@plone/volto/icons/drag.svg';

import './styles.less';

class ColumnsBlockEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colSelections: {},
    };

    // This special variable is needed because of the onChangeField(block...) is
    // immediately followed by onChangeField(blocks_layout...), we want to save
    // this incoming information as data for the block, but because it is only
    // partial, we'll overwrite it in the second request. So we take advantage
    // of what happens between batched updates, we know that there will be two
    // calls, so even if we overwrite the state improperly on the first pass,
    // it will be fixed on the second pass if we have access to the proper
    // value from the first pass.
    //
    // We have volto-slate that does:
    // ReactDOM.unstable_batchedUpdates(() => {
    //    this.onChangeField(blocks, {})
    //    this.onChangeField(blocks_layout, {})
    // }
    // volto-slate needs to be neutral, to work in the main Volto form, but
    // also these types of subforms, so it should continue to use batched
    // onChangeField, as that works fine. So volto-columns-block needs that
    // blockState trick to overcome this. If there would be a onChangeBlocks or
    // onChangeFormData in Volto core, then BlocksForm could match that API
    // and this wouldn't be needed (together with the unstable_batchedUpdates
    // calls.
    this.blocksState = {};
  }

  createFrom = (initialData) => {
    const { gridCols, gridSize } = initialData;
    return {
      coldata: empty(gridCols.length),
      gridSize,
      gridCols,
    };
  };

  render() {
    const {
      block,
      data,
      onChangeBlock,
      onChangeField,
      pathname,
      selected,
    } = this.props;
    const { gridSizes, variants } = blocks.blocksConfig[COLUMNSBLOCK];

    const { coldata, gridCols, gridSize } = data;
    const columnList = getColumns(coldata);
    // console.log('data', gridCols);

    return (
      <ColumnVariations
        variants={variants}
        data={data}
        onChange={(initialData) => {
          onChangeBlock(block, { ...data, ...this.createFrom(initialData) });
        }}
      >
        <div className="columns-block">
          <Grid columns={gridSize} stackable>
            {columnList.map(([colId, column], index) => {
              return (
                <Grid.Column
                  className="block-column"
                  key={colId}
                  {...(gridSizes[gridCols[index]] || gridCols[index])}
                >
                  <div className="column-header"></div>
                  <BlocksForm
                    properties={isEmpty(column) ? emptyBlocksForm() : column}
                    blockWrapper={EditBlockWrapper}
                    selectedBlock={
                      selected ? this.state.colSelections[colId] : null
                    }
                    onSelectBlock={(id) =>
                      this.setState({
                        colSelections: {
                          // this invalidates selection in all other columns
                          [colId]: id,
                        },
                      })
                    }
                    onChangeFormData={(newFormData) => {
                      onChangeBlock(block, {
                        ...data,
                        coldata: {
                          ...coldata,
                          columns: {
                            ...coldata.columns,
                            [colId]: newFormData,
                          },
                        },
                      });
                    }}
                    onChangeField={(id, value) => {
                      // special handling of blocks and blocks_layout
                      if (['blocks', 'blocks_layout'].indexOf(id) > -1) {
                        this.blocksState[id] = value;
                        onChangeBlock(block, {
                          ...data,
                          coldata: {
                            ...coldata,
                            columns: {
                              ...coldata.columns,
                              [colId]: {
                                ...coldata.columns?.[colId],
                                ...this.blocksState,
                              },
                            },
                          },
                        });
                      } else {
                        onChangeField(id, value);
                      }
                    }}
                    pathname={pathname}
                  />
                </Grid.Column>
              );
            })}
          </Grid>
        </div>
        <SidebarPortal selected={selected}>
          <InlineForm
            schema={ColumnsBlockSchema}
            title={ColumnsBlockSchema.title}
            onChangeField={(id, value) => {
              onChangeBlock(block, {
                ...data,
                [id]: value,
              });
            }}
            formData={data}
          />
        </SidebarPortal>
      </ColumnVariations>
    );
  }
}

export default ColumnsBlockEdit;
//
// import DeviceSelect from './DeviceSelect';
// import ColumnControls from './ColumnControls';
//
// import moreIcon from '@plone/volto/icons/more.svg';
// {/* <DeviceSelect /> */}
// {/* {<h3>{data.block_title}</h3>} */}
// { /* <h4>{`Column ${index}`}</h4> */ }
