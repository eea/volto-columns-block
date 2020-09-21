import React from 'react';
import { Grid } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { BlocksForm, SidebarPortal, InlineForm } from '@plone/volto/components'; // BlocksForm
import { emptyBlocksForm } from '@plone/volto/helpers';

// import  from BlocksForm '../futurevolto/BlocksForm';
import { ColumnsBlockSchema } from './schema';
import { getColumns, empty } from './utils';

import './styles.less';

class ColumnsBlockEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colSelections: {},
    };
    this.blocksState = {};
  }

  render() {
    const {
      block,
      data,
      onChangeBlock,
      onChangeField,
      pathname,
      selected,
    } = this.props;

    // React.useEffect(() => {
    //   if (!data.coldata) {
    //     // TODO: this is a hack that causes volto-slate to lose focus
    //     onChangeBlock(block, { ...data, coldata: empty() });
    //   }
    // });

    const { coldata = empty() } = data;
    const columnList = getColumns(coldata);

    return (
      <>
        <div className="columns-block">
          {/* {<h3>{data.block_title}</h3>} */}
          <Grid columns={columnList.length}>
            {columnList.map(([colId, column], index) => {
              return (
                <Grid.Column className="block-column" key={colId}>
                  {/* <h4>{`Column ${index}`}</h4> */}
                  <BlocksForm
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
                                [id]: value,
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
      </>
    );
  }
}

export default ColumnsBlockEdit;
