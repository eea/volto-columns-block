import React from 'react';
import { v4 as uuid } from 'uuid';
import { omit, without } from 'lodash';
import move from 'lodash-move';
import { DragDropList, Icon, FormFieldWrapper } from '@plone/volto/components';
import { emptyBlocksForm } from '@plone/volto/helpers';

import dragSVG from '@plone/volto/icons/drag.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import plusSVG from '@plone/volto/icons/circle-plus.svg';

export function moveColumn(formData, source, destination) {
  return {
    ...formData,
    columns_layout: {
      items: move(formData.columns_layout?.items, source, destination),
    },
  };
}

const empty = () => {
  return [uuid(), emptyBlocksForm()];
};

const ColumnsWidget = (props) => {
  const { value = {}, id, onChange } = props;
  const { columns = {} } = value;
  const columnsList = (value.columns_layout?.items || []).map((id) => [
    id,
    columns[id],
  ]);
  return (
    <FormFieldWrapper
      {...props}
      draggable={false}
      className="drag-drop-list-widget"
    >
      <div className="columns-area">
        <DragDropList
          childList={columnsList}
          onMoveItem={(result) => {
            const { source, destination } = result;
            if (!destination) {
              return;
            }
            const newFormData = moveColumn(
              value,
              source.index,
              destination.index,
            );
            onChange(id, newFormData);
            return true;
          }}
          renderChild={(child, childId, index, draginfo) => (
            <div ref={draginfo.innerRef} {...draginfo.draggableProps}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    visibility: 'visible',
                    display: 'inline-block',
                  }}
                  {...draginfo.dragHandleProps}
                  className="drag handle wrapper"
                >
                  <Icon name={dragSVG} size="18px" />
                </div>
                <div className="column-area">
                  <div className="label">Column {index}</div>
                  <button
                    onClick={() => {
                      const newFormData = {
                        ...value,
                        columns: omit({ ...value.columns }, [childId]),
                        columns_layout: {
                          ...value.columns_layout,
                          items: without(
                            [...value.columns_layout?.items],
                            childId,
                          ),
                        },
                      };
                      onChange(id, newFormData);
                    }}
                  >
                    <Icon name={trashSVG} size="18px" />
                  </button>
                </div>
              </div>
            </div>
          )}
        />
        <button
          onClick={() => {
            const [newId, newData] = empty();
            onChange(id, {
              ...value,
              columns: {
                ...value.columns,
                [newId]: newData,
              },
              columns_layout: {
                ...value.columns_layout,
                items: [...value.columns_layout?.items, newId],
              },
            });
          }}
        >
          <Icon name={plusSVG} size="18px" />
        </button>
      </div>
    </FormFieldWrapper>
  );
};

export default ColumnsWidget;
