import React from 'react';
import { Grid } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { SidebarPortal, Icon, InlineForm } from '@plone/volto/components'; // BlocksForm, Icon,
import { emptyBlocksForm } from '@plone/volto/helpers';
import { setSidebarTab } from '@plone/volto/actions';
import { connect } from 'react-redux';
import { BlocksForm } from '@eeacms/volto-blocks-form/components';
import { Button } from 'semantic-ui-react';
import { blocks } from '~/config';

import { COLUMNSBLOCK } from '@eeacms/volto-columns-block/constants';
import { ColumnsBlockSchema } from './schema';
import { getColumns, empty } from './utils';
import ColumnVariations from './ColumnVariations';
import EditBlockWrapper from './EditBlockWrapper';
import tuneSVG from '@plone/volto/icons/tune.svg';

import './styles.less';

/*
 * not pretty, there's a lot of render props passing, to please React
 * reconciliation algos
 *
ColumnsBlockEdit ->
  EditBlockWrapper
    -> EditBlock
    -> dragProps

CBE
  -> BlocksForm
    -> DragDropList
      -> EditBlockWrapper
        -> EditBlock
*/
class ColumnsBlockEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colSelections: {}, // selected block for each column
      showSidebar: false,
      activeColumn: null,
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
    // calls).
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

    return (
      <>
        <div className="columns-block">
          <Grid columns={gridSize} stackable>
            {columnList.map(([colId, column], index) => (
              <Grid.Column
                className="block-column"
                key={colId}
                {...(gridSizes[gridCols[index]] || gridCols[index])}
              >
                <div className="column-header"></div>
                <BlocksForm
                  key={colId}
                  properties={isEmpty(column) ? emptyBlocksForm() : column}
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
                >
                  {({ draginfo }, editBlock, blockProps) => (
                    <EditBlockWrapper
                      draginfo={draginfo}
                      blockProps={blockProps}
                      extraControls={
                        <>
                          <Button
                            icon
                            basic
                            onClick={() => {
                              this.setState({
                                showSidebar: true,
                                activeColumn: 1, //colId,
                                colSelections: {},
                              });
                              this.props.setSidebarTab(1);
                            }}
                          >
                            <Icon name={tuneSVG} className="" size="18px" />
                          </Button>
                        </>
                      }
                    >
                      {editBlock}
                    </EditBlockWrapper>
                  )}
                </BlocksForm>
              </Grid.Column>
            ))}
          </Grid>
        </div>
        {Object.keys(this.state.colSelections).length === 0 && (
          <SidebarPortal selected={true}>
            {this.state.activeColumn ? (
              <div>{this.state.activeColumn}</div>
            ) : (
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
            )}
          </SidebarPortal>
        )}
      </>
    );
  }
}

export default connect(
  (state, props) => {
    return {};
  },
  { setSidebarTab },
)(ColumnsBlockEdit);
// import columnSVG from '@plone/volto/icons/column.svg';
// import decorateComponentWithProps from 'decorate-component-with-props';
// import dragSVG from '@plone/volto/icons/drag.svg';
// import dotsSVG from '@plone/volto/icons/drag.svg';
