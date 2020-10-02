import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { SidebarPortal, Icon, InlineForm } from '@plone/volto/components'; // BlocksForm, Icon,
import { emptyBlocksForm } from '@plone/volto/helpers';
import { setSidebarTab } from '@plone/volto/actions';
import { connect } from 'react-redux';
import { BlocksForm } from '@eeacms/volto-blocks-form/components';
import { Button } from 'semantic-ui-react';
import { blocks } from '~/config';

import { ColumnsBlockSchema } from './schema';
import { getColumns, empty } from './utils';
import ColumnVariations from './ColumnVariations';
import EditBlockWrapper from './EditBlockWrapper';

import { COLUMNSBLOCK } from '@eeacms/volto-columns-block/constants';
import { variants } from '@eeacms/volto-columns-block/grid';
import { makeStyleSchema, getStyle } from '@eeacms/volto-columns-block/Styles';
import { settings } from '~/config';

import tuneSVG from '@plone/volto/icons/tune.svg';
import upSVG from '@plone/volto/icons/up.svg';

import './styles.less';

/*
 * not pretty, there's a lot of render props passing, to please React
 * reconciliation algos
 *

ColumnsBlockEdit -> passes EditBlockWrapper into
  -> BlocksForm -> which passes (with EditBlock) into
    -> DragDropList -> which renders them all
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

  onChangeColumnSettings = (id, value) => {
    const { data, onChangeBlock, block } = this.props;
    const { coldata } = data;
    const formData = {
      ...data,
      coldata: {
        ...coldata,
        columns: {
          ...coldata.columns,
          [this.state.activeColumn]: {
            ...coldata.columns?.[this.state.activeColumn],
            settings: {
              ...coldata.columns?.[this.state.activeColumn]?.settings,
              [id]: value,
            },
          },
        },
      },
    };
    onChangeBlock(block, formData);
  };

  onChangeColumnData = (id, value, colId) => {
    const { data, onChangeBlock, block, onChangeField } = this.props;
    const { coldata } = data;
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
  };

  getColumnsBlockSchema = () => {
    const schema = ColumnsBlockSchema();
    const { data } = this.props;
    const { gridCols = [] } = data;
    // console.log('gridcols', gridCols);
    const available_variants = variants.filter(
      ({ defaultData }) => defaultData?.gridCols?.length === gridCols.length,
    );
    schema.properties.gridCols.choices = available_variants.map(
      ({ defaultData, title }) => [defaultData?.gridCols, title],
    );
    return schema;
  };

  render() {
    const {
      block,
      data,
      onChangeBlock,
      pathname,
      selected,
      index,
    } = this.props;

    const { coldata, gridCols, gridSize } = data;
    const columnList = getColumns(coldata);

    const { gridSizes, variants, available_colors } = blocks.blocksConfig[
      COLUMNSBLOCK
    ];
    const ColumnSchema = makeStyleSchema({ available_colors });

    // TODO: we have blockHasOwnFocusManagement, so we need to implement this:
    // onKeyDown={(e) => {
    //   if (e.key === 'Enter') {
    //     this.onAddBlock(settings.defaultBlockType, index + 1);
    //     e.preventDefault();
    //   }
    // }}
    return (
      <div role="presentation" className="columns-block">
        {Object.keys(data).length === 1 ? (
          <ColumnVariations
            variants={variants}
            data={data}
            onChange={(initialData) => {
              onChangeBlock(block, {
                ...data,
                ...this.createFrom(initialData),
              });
            }}
          />
        ) : (
          <Grid columns={gridSize} className="column-grid" stackable>
            {columnList.map(([colId, column], index) => (
              <Grid.Column
                className="block-column"
                key={colId}
                {...(gridSizes[gridCols[index]] || gridCols[index])}
              >
                <div
                  style={getStyle(
                    data?.coldata?.columns?.[colId]?.settings || {},
                  )}
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
                    onChangeField={(id, value) =>
                      this.onChangeColumnData(id, value, colId)
                    }
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
                                  activeColumn: colId,
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
                </div>
              </Grid.Column>
            ))}
          </Grid>
        )}

        {Object.keys(this.state.colSelections).length === 0 ? (
          <SidebarPortal selected={true}>
            {this.state.activeColumn ? (
              <>
                <Segment>
                  <Button onClick={() => this.setState({ activeColumn: null })}>
                    <Icon name={upSVG} size="14px" />
                    Edit parent column block
                  </Button>
                </Segment>
                <InlineForm
                  schema={ColumnSchema}
                  title={`Column ${
                    columnList
                      .map(([colId]) => colId)
                      .indexOf(this.state.activeColumn) + 1
                  }`}
                  onChangeField={this.onChangeColumnSettings}
                  formData={
                    data?.coldata?.columns?.[this.state.activeColumn]
                      ?.settings || {}
                  }
                />
              </>
            ) : (
              <InlineForm
                schema={this.getColumnsBlockSchema()}
                title="Columns block"
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
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    return {};
  },
  { setSidebarTab },
)(ColumnsBlockEdit);
