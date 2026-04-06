import React from 'react';

import { v4 as uuid } from 'uuid';
import omit from 'lodash/omit';
import without from 'lodash/without';
import { defineMessages, FormattedMessage } from 'react-intl';
import move from 'lodash-move';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import DragDropList from '@plone/volto/components/manage/DragDropList/DragDropList';
import { FormFieldWrapper } from '@plone/volto/components/manage/Widgets';
import { emptyBlocksForm } from '@plone/volto/helpers/Blocks/Blocks';

import dragSVG from '@plone/volto/icons/drag.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import plusSVG from '@plone/volto/icons/circle-plus.svg';
import pencilSVG from '@plone/volto/icons/pencil.svg';

export function moveColumn(formData, source, destination) {
  return {
    ...formData,
    blocks_layout: {
      items: move(formData.blocks_layout?.items, source, destination),
    },
  };
}
const messages = defineMessages({
  labelToColSettings: {
    id: 'Go to Column settings',
    defaultMessage: 'Go to Column settings',
  },
});

const empty = () => {
  return [uuid(), emptyBlocksForm()];
};

const ColumnsWidget = (props) => {
  const { value = {}, id, onChange, maxSize = 4, blockData = {} } = props;
  const { setActiveColumn = () => {} } = blockData || {};

  const openColumnSettings = (colId) => {
    setActiveColumn(colId);
  };

  const { blocks = {} } = value;
  const columnsList = (value.blocks_layout?.items || []).map((id) => [
    id,
    blocks[id],
  ]);

  const showAdd = value.blocks_layout?.items?.length < maxSize;
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
        >
          {(dragProps) => {
            const { childId, index, draginfo } = dragProps;
            return (
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
                    <div className="label">
                      <FormattedMessage id="Column" defaultMessage="Column" />{' '}
                      {index + 1}
                    </div>
                    {value.blocks_layout?.items?.length > 1 ? (
                      <>
                        <button
                          title={props.intl.formatMessage(
                            messages.labelToColSettings,
                          )}
                          aria-label={props.intl.formatMessage(
                            messages.labelToColSettings,
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openColumnSettings(childId);
                          }}
                        >
                          <Icon name={pencilSVG} size="19px" />
                        </button>
                        <button
                          onClick={() => {
                            const newFormData = {
                              ...value,
                              blocks: omit({ ...value.blocks }, [childId]),
                              blocks_layout: {
                                ...value.blocks_layout,
                                items: without(
                                  [...(value.blocks_layout?.items || [])],
                                  childId,
                                ),
                              },
                            };
                            onChange(id, newFormData);
                          }}
                        >
                          <Icon name={trashSVG} size="18px" />
                        </button>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        </DragDropList>
        {showAdd ? (
          <button
            onClick={() => {
              const [newId, newData] = empty();
              onChange(id, {
                ...value,
                blocks: {
                  ...value.blocks,
                  [newId]: newData,
                },
                blocks_layout: {
                  ...value.blocks_layout,
                  items: [...(value.blocks_layout?.items || []), newId],
                },
              });
            }}
          >
            <Icon name={plusSVG} size="18px" />
          </button>
        ) : (
          ''
        )}
      </div>
    </FormFieldWrapper>
  );
};

export default ColumnsWidget;
