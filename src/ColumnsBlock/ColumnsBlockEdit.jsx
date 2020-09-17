import React from 'react';
import { Grid } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { SidebarPortal, InlineForm, BlocksForm } from '@plone/volto/components';
import { emptyBlocksForm } from '@plone/volto/helpers';

import { ColumnsBlockSchema } from './schema';
import { getColumns, empty } from './utils';

import './styles.less';

const ColumnsBlockEdit = (props) => {
  const {
    block,
    data,
    onChangeBlock,
    onChangeField,
    pathname,
    selected,
  } = props;

  React.useEffect(() => {
    if (!data.coldata) {
      onChangeBlock(block, { ...data, coldata: empty() });
    }
  });

  const [colSelections, setColSelections] = React.useState({});

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
                  selectedBlock={selected ? colSelections[colId] : null}
                  onSelectBlock={(id) =>
                    setColSelections({
                      // this invalidates selection in all other columns
                      [colId]: id,
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
                    if (['blocks', 'blocks_layout'].indexOf(id) > -1) {
                      onChangeBlock(block, {
                        ...data,
                        coldata: {
                          ...coldata,
                          columns: {
                            ...coldata.columns,
                            [colId]: {
                              ...coldata.columns?.[colId],
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
};

export default ColumnsBlockEdit;
