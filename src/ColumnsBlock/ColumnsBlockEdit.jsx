import React from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';
import { Grid, Segment } from 'semantic-ui-react';
import { isEmpty, without } from 'lodash';
import { SidebarPortal, BlocksToolbar, Icon } from '@plone/volto/components'; // BlocksForm, Icon,
import { BlockDataForm } from '@plone/volto/components';
import {
  emptyBlocksForm,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import { setSidebarTab } from '@plone/volto/actions';
import { connect } from 'react-redux';
import { BlocksForm } from '@plone/volto/components';
import { Button } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import cx from 'classnames';

import { ColumnsBlockSchema } from './schema';
import {
  getColumns,
  empty,
  defaultNewColumn,
  hasColumns,
  forEachColumn,
  columnIsEmpty,
} from './utils';
import ColumnVariations from './ColumnVariations';
import EditBlockWrapper from './EditBlockWrapper';

import { COLUMNSBLOCK } from '@eeacms/volto-columns-block/constants';
import { makeStyleSchema, getStyle } from '../Styles';

import tuneSVG from '@plone/volto/icons/column.svg';
import upSVG from '@plone/volto/icons/up.svg';
import eraserSVG from './icons/eraser.svg';
import '../less/columns.less';

const messages = defineMessages({
  labelColumn: {
    id: 'Column',
    defaultMessage: 'Column',
  },
  labelColumnsBlock: {
    id: 'Columns block',
    defaultMessage: 'Columns block',
  },
  labelToColSettings: {
    id: 'Go to Column settings',
    defaultMessage: 'Go to Column settings',
  },
});

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
      multiSelected: [],
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
      data: empty(gridCols.length),
      gridSize,
      gridCols,
    };
  };

  handleKeyDown = (
    e,
    index,
    block,
    node,
    {
      disableEnter = false,
      disableArrowUp = false,
      disableArrowDown = false,
    } = {},
  ) => {
    const hasblockActive = Object.keys(this.state.colSelections).length > 0;
    if (e.key === 'ArrowUp' && !disableArrowUp && !hasblockActive) {
      this.props.onFocusPreviousBlock(block, node);
      e.preventDefault();
    }
    if (e.key === 'ArrowDown' && !disableArrowDown && !hasblockActive) {
      this.props.onFocusNextBlock(block, node);
      e.preventDefault();
    }
    if (e.key === 'Enter' && !disableEnter && !hasblockActive) {
      this.props.onAddBlock(config.settings.defaultBlockType, index + 1);
      e.preventDefault();
    }
  };

  onChangeColumnSettings = (id, value) => {
    const { data, onChangeBlock, block } = this.props;
    const coldata = data.data;
    const formData = {
      ...data,
      data: {
        ...coldata,
        blocks: {
          ...coldata.blocks,
          [this.state.activeColumn]: {
            ...coldata.blocks?.[this.state.activeColumn],
            settings: {
              ...coldata.blocks?.[this.state.activeColumn]?.settings,
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
    const coldata = data.data;
    // special handling of blocks and blocks_layout
    if (['blocks', 'blocks_layout'].indexOf(id) > -1) {
      this.blocksState[id] = value;
      onChangeBlock(block, {
        ...data,
        data: {
          ...coldata,
          blocks: {
            ...coldata.blocks,
            [colId]: {
              ...coldata.blocks?.[colId],
              ...this.blocksState,
            },
          },
        },
      });
    } else {
      onChangeField(id, value);
    }
  };

  deleteColumnStyle = () => {
    const colId = this.state.activeColumn;
    const { onChangeBlock, block, data } = this.props;
    const coldata = data.data;
    onChangeBlock(block, {
      ...data,
      data: {
        ...coldata,
        blocks: {
          ...coldata.blocks,
          [colId]: {
            ...coldata.blocks?.[colId],
            settings: {},
          },
        },
      },
    });
  };

  onSelectBlock = (
    id,
    colId,
    colData,
    activeBlock,
    isMultipleSelection,
    event,
  ) => {
    let newMultiSelected = [];
    let selected = id;

    if (isMultipleSelection) {
      selected = null;
      const blocksLayoutFieldname = getBlocksLayoutFieldname(colData);

      const blocks_layout = colData[blocksLayoutFieldname].items;

      if (event.shiftKey) {
        const anchor =
          this.state.multiSelected.length > 0
            ? blocks_layout.indexOf(this.state.multiSelected[0])
            : blocks_layout.indexOf(activeBlock);
        const focus = blocks_layout.indexOf(id);

        if (anchor === focus) {
          newMultiSelected = [id];
        } else if (focus > anchor) {
          newMultiSelected = [...blocks_layout.slice(anchor, focus + 1)];
        } else {
          newMultiSelected = [...blocks_layout.slice(focus, anchor + 1)];
        }
      }

      if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
        if (this.state.multiSelected.includes(id)) {
          selected = null;
          newMultiSelected = without(this.state.multiSelected, id);
        } else {
          newMultiSelected = [...(this.state.multiSelected || []), id];
        }
      }
    }

    this.setState({
      multiSelected: newMultiSelected,
      colSelections: {
        // this invalidates selection in all other columns
        [colId]: selected,
      },
    });
  };

  getColumnsBlockSchema = () => {
    const variants = config.blocks.blocksConfig?.[COLUMNSBLOCK]?.variants || [];
    const schema = ColumnsBlockSchema(this.props.intl);
    const { data } = this.props;
    const { blocks_layout = {} } = data.data || {};
    const nrOfColumns = (blocks_layout?.items || []).length;
    const available_variants = variants.filter(
      ({ defaultData }) => defaultData?.gridCols?.length === nrOfColumns,
    );

    schema.properties.gridCols.choices = available_variants.map(
      ({ defaultData, title }) => [defaultData?.gridCols, title],
    );
    return schema;
  };

  componentDidUpdate(prevProps) {
    const variants = config.blocks.blocksConfig?.[COLUMNSBLOCK]?.variants || [];
    const cols = this.props.data.data?.blocks_layout?.items || [];
    const prevCols = prevProps.data.data?.blocks_layout?.items || [];

    const colNumChanged = cols.length !== prevCols.length;
    const initialLayoutSelection = prevCols.length === 0;
    const shouldUpdateLayout = colNumChanged && !initialLayoutSelection;

    if (shouldUpdateLayout) {
      const available_variants = variants.filter(
        ({ defaultData }) => defaultData?.gridCols?.length === cols.length,
      );
      const variant = available_variants?.[0];
      if (variant) {
        return this.props.onChangeBlock(this.props.block, {
          ...this.props.data,
          gridSize: variant.defaultData.gridSize,
          gridCols: variant.defaultData.gridCols,
        });
      }
    }

    const { block, onChangeBlock, data } = this.props;

    // fill empty columns
    if (hasColumns(data.data)) {
      forEachColumn(data.data, ([colId, colData]) => {
        if (columnIsEmpty(colData)) {
          const newData = {
            ...data,
            data: {
              ...data.data,
              blocks: {
                ...data.data.blocks,
                [colId]: defaultNewColumn(),
              },
            },
          };
          onChangeBlock(block, newData);
        }
      });
    }
  }

  render() {
    const {
      block,
      data,
      onChangeBlock,
      pathname,
      selected,
      manage,
    } = this.props;

    const metadata = this.props.metadata || this.props.properties;
    const { gridCols, gridSize } = data;
    const coldata = data.data;
    const columnList = getColumns(coldata);
    const selectedCol =
      Object.keys(this.state.colSelections).length > 0
        ? Object.keys(this.state.colSelections)[0]
        : null;
    const selectedColData = coldata?.blocks?.[selectedCol] || null;
    const selectedBlock = this.state.colSelections[selectedCol];

    const {
      gridSizes,
      variants,
      available_colors,
    } = config.blocks.blocksConfig[COLUMNSBLOCK];
    const ColumnSchema = makeStyleSchema({ available_colors }, this.props.intl);
    const isInitialized = data?.data && Object.keys(data?.data).length > 0;

    return (
      <div
        role="presentation"
        className="columns-block"
        onKeyDown={(e) => {
          this.handleKeyDown(
            e,
            this.props.index,
            this.props.block,
            this.props.blockNode.current,
          );
        }}
        // The tabIndex is required for the keyboard navigation
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        tabIndex={-1}
      >
        {data.coldata ? 'old style columns block, safe to remove it' : ''}
        {!isInitialized ? (
          <ColumnVariations
            variants={variants.filter((variant) => variant.common)}
            onChange={(initialData) => {
              onChangeBlock(block, {
                ...data,
                ...this.createFrom(initialData),
              });
            }}
          />
        ) : (
          <>
            <div
              className="columns-header"
              onClick={() => {
                this.setState({
                  showSidebar: true,
                  colSelections: {},
                });
                this.props.setSidebarTab(1);
              }}
              aria-hidden="true"
            >
              {data.title || (
                <FormattedMessage
                  id="Columns block"
                  defaultMessage="Columns block"
                />
              )}
            </div>
            <Grid columns={gridSize} className="column-grid" stackable>
              {columnList.map(([colId, column], index) => (
                <Grid.Column
                  className={cx(
                    'block-column',
                    data?.data?.blocks?.[colId]?.settings?.column_class,
                  )}
                  key={colId}
                  {...(gridSizes[gridCols[index]] || gridCols[index])}
                  {...getStyle(data?.data?.blocks?.[colId]?.settings || {})}
                >
                  <BlocksForm
                    key={colId}
                    title={data?.placeholder}
                    description={data?.instructions?.data}
                    manage={manage}
                    allowedBlocks={data?.allowedBlocks}
                    metadata={metadata}
                    properties={{
                      ...metadata,
                      ...(isEmpty(column) ? emptyBlocksForm() : column),
                    }}
                    disableEvents={true}
                    selectedBlock={
                      selected ? this.state.colSelections[colId] : null
                    }
                    onSelectBlock={(id, selected, e) => {
                      const isMultipleSelection = e
                        ? e.shiftKey || e.ctrlKey || e.metaKey
                        : false;
                      this.onSelectBlock(
                        id,
                        colId,
                        selectedColData,
                        selectedBlock,
                        selectedCol !== colId || selectedBlock === id
                          ? false
                          : isMultipleSelection,
                        e,
                      );
                    }}
                    onChangeFormData={(newFormData) => {
                      onChangeBlock(block, {
                        ...data,
                        data: {
                          ...coldata,
                          blocks: {
                            ...coldata.blocks,
                            [colId]: {
                              ...coldata.blocks?.[colId],
                              blocks: newFormData.blocks,
                              blocks_layout: newFormData.blocks_layout,
                            },
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
                            {!data?.readOnlySettings && (
                              <Button
                                icon
                                basic
                                title={this.props.intl.formatMessage(
                                  messages.labelToColSettings,
                                )}
                                onClick={() => {
                                  this.setState({
                                    showSidebar: true,
                                    activeColumn: colId,
                                    colSelections: {},
                                  });
                                  this.props.setSidebarTab(1);
                                }}
                              >
                                <Icon name={tuneSVG} className="" size="19px" />
                              </Button>
                            )}
                          </>
                        }
                        multiSelected={this.state.multiSelected.includes(
                          blockProps.block,
                        )}
                      >
                        {editBlock}
                      </EditBlockWrapper>
                    )}
                  </BlocksForm>
                </Grid.Column>
              ))}
            </Grid>
          </>
        )}

        {selected && selectedColData ? (
          <BlocksToolbar
            formData={selectedColData}
            selectedBlock={selectedBlock}
            selectedBlocks={this.state.multiSelected}
            onChangeBlocks={(newBlockData) => {
              onChangeBlock(block, {
                ...data,
                data: {
                  ...coldata,
                  blocks: {
                    ...coldata.blocks,
                    [selectedCol]: { ...selectedColData, ...newBlockData },
                  },
                },
              });
            }}
            onSetSelectedBlocks={(blockIds) => {
              this.setState({ multiSelected: blockIds });
            }}
            onSelectBlock={this.onSelectBlock}
          />
        ) : (
          ''
        )}

        {Object.keys(this.state.colSelections).length === 0 &&
        !data?.readOnlySettings ? (
          <SidebarPortal selected={selected}>
            {this.state.activeColumn ? (
              <>
                <Segment
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button onClick={() => this.setState({ activeColumn: null })}>
                    <Icon name={upSVG} size="14px" />
                    <FormattedMessage
                      id="Edit parent columns block"
                      defaultMessage="Edit parent columns block"
                    />
                  </Button>
                  <button
                    onClick={this.deleteColumnStyle}
                    style={{ cursor: 'pointer' }}
                  >
                    <Icon
                      name={eraserSVG}
                      size="24px"
                      title="Delete column style"
                    />
                  </button>
                </Segment>
                <BlockDataForm
                  schema={ColumnSchema}
                  title={`${this.props.intl.formatMessage(
                    messages.labelColumn,
                  )} ${
                    columnList
                      .map(([colId]) => colId)
                      .indexOf(this.state.activeColumn) + 1
                  }`}
                  onChangeField={this.onChangeColumnSettings}
                  formData={
                    data?.data?.blocks?.[this.state.activeColumn]?.settings ||
                    {}
                  }
                />
              </>
            ) : (
              <BlockDataForm
                schema={this.getColumnsBlockSchema()}
                title={this.props.intl.formatMessage(
                  messages.labelColumnsBlock,
                )}
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

export default compose(
  injectIntl,
  connect(
    (state, props) => {
      return {};
    },
    { setSidebarTab },
  ),
)(ColumnsBlockEdit);
