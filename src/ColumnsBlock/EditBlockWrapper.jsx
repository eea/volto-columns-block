import React from 'react';
import { Icon } from '@plone/volto/components';
import { blockHasValue } from '@plone/volto/helpers';
import dragSVG from '@plone/volto/icons/drag.svg';
import { blocks } from '~/config';
import { Button } from 'semantic-ui-react';
import includes from 'lodash/includes';
import isBoolean from 'lodash/isBoolean';
import { defineMessages, injectIntl } from 'react-intl';

import trashSVG from '@plone/volto/icons/delete.svg';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
  delete: {
    id: 'delete',
    defaultMessage: 'delete',
  },
});

const EditBlockWrapper = (props) => {
  const {
    draginfo,
    block,
    selected,
    children,
    blockId,
    onDeleteBlock,
    intl,
  } = props;
  console.log('block', block);
  const type = block['@type'];
  const visible = selected && blockHasValue(block) && !block.fixed;

  const required = isBoolean(block.required)
    ? block.required
    : includes(blocks.requiredBlocks, type);

  return (
    <div
      ref={draginfo.innerRef}
      {...draginfo.draggableProps}
      className={`block-editor-${block['@type']}`}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            visibility: visible ? 'visible' : 'hidden',
            display: 'inline-block',
          }}
          {...draginfo.dragHandleProps}
          className="drag handle wrapper"
        >
          <Icon name={dragSVG} size="18px" />
        </div>

        {selected && !required && (
          <Button
            icon
            basic
            onClick={() => onDeleteBlock(blockId)}
            className="delete-button"
            aria-label={intl.formatMessage(messages.delete)}
          >
            <Icon name={trashSVG} size="18px" />
          </Button>
        )}
      </div>
      <div className={`ui drag block inner ${type}`}>{children}</div>
    </div>
  );
};

export default injectIntl(EditBlockWrapper);
