import React from 'react';
import { Icon, BlockChooser } from '@plone/volto/components';
import { blockHasValue } from '@plone/volto/helpers';
import { blocks } from '~/config';
import { Button } from 'semantic-ui-react';
import includes from 'lodash/includes';
import isBoolean from 'lodash/isBoolean';
import { defineMessages, injectIntl } from 'react-intl';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';

import dragSVG from '@plone/volto/icons/drag.svg';
import addSVG from '@plone/volto/icons/circle-plus.svg';
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

class EditBlockWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewBlockOpened: false,
    };
  }

  componentDidMount() {
    console.log('mount editblockwrapper', this.props.blockProps.block);
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (
      this.blockNode.current &&
      doesNodeContainClick(this.blockNode.current, e)
    )
      return;

    if (this.state.addNewBlockOpened) {
      this.setState({
        addNewBlockOpened: false,
      });
      return true;
    }
  };

  blockNode = React.createRef();

  render() {
    const { intl, blockProps, draginfo, extraControls, children } = this.props;

    const {
      allowedBlocks,
      block,
      data,
      onDeleteBlock,
      onMutateBlock,
      selected,
    } = blockProps;
    const type = data['@type'];
    const { disableNewBlocks } = data;

    // const visible = selected && blockHasValue(block) && !block.fixed;
    // visibility: visible ? 'visible' : 'hidden',

    const required = isBoolean(data.required)
      ? data.required
      : includes(blocks.requiredBlocks, type);

    return (
      <div ref={this.blockNode}>
        <div
          ref={draginfo?.innerRef}
          {...(selected ? draginfo?.draggableProps : null)}
          className={`block-editor-${data['@type']}`}
        >
          {!selected && (
            <div
              style={{
                display: 'none',
                // keep react-beautiful-dnd happy
              }}
              {...draginfo.dragHandleProps}
            ></div>
          )}
          {selected && (
            <div className="block-toolbar">
              <div
                style={{
                  display: 'inline-block',
                }}
                {...draginfo.dragHandleProps}
                className="drag handle wrapper-column-block"
              >
                <Button icon basic title="Drag and drop">
                  <Icon name={dragSVG} size="19px" />
                </Button>
              </div>

              {extraControls}

              {!disableNewBlocks && !blockHasValue(data) && (
                <Button
                  icon
                  basic
                  title="Add block"
                  onClick={() => {
                    this.setState({
                      addNewBlockOpened: !this.state.addNewBlockOpened,
                    });
                  }}
                  className="column-block-add-button"
                >
                  <Icon name={addSVG} className="" size="19px" />
                </Button>
              )}
              {!required && (
                <Button
                  icon
                  basic
                  title="Remove block"
                  onClick={() => onDeleteBlock(block)}
                  className="delete-button-column-block"
                  aria-label={intl.formatMessage(messages.delete)}
                >
                  <Icon name={trashSVG} size="19px" />
                </Button>
              )}
              {this.state.addNewBlockOpened && (
                <BlockChooser
                  onMutateBlock={(id, value) => {
                    this.setState({ addNewBlockOpened: false });
                    onMutateBlock(id, value);
                  }}
                  currentBlock={block}
                  allowedBlocks={allowedBlocks}
                />
              )}
            </div>
          )}

          <div className={`ui drag block inner ${type}`}>{children}</div>
        </div>
      </div>
    );
  }
}

export default injectIntl(EditBlockWrapper);
