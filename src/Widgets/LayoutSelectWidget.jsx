/**
 * LayoutSelectWidget component.
 * @module volto-columns-block/Widgets/LayoutSelectWidget
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import loadable from '@loadable/component';

import { FormFieldWrapper } from '@plone/volto/components';

import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

const Select = loadable(() => import('react-select'));

/**
 * SelectWidget component class.
 * @function SelectWidget
 * @returns {string} Markup of the component.
 */
export class LayoutSelectWidget extends Component {
  state = {
    selectedOption: null,
  };

  componentDidMount() {
    this.setState({
      selectedOption: {
        value: this.props.value,
        label: this.props.choices.find((x) => x[0] === this.props.value)?.[1],
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        selectedOption: {
          value: this.props.value,
          label: this.props.choices.find((x) => x[0] === this.props.value)?.[1],
        },
      });
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { id, choices, value, onChange } = this.props;

    console.log('value', value);

    return (
      <FormFieldWrapper {...this.props}>
        <Select
          id={`field-${id}`}
          key={this.props.choices}
          name={id}
          value={this.state.selectedOption}
          isDisabled={this.props.isDisabled}
          className="react-select-container"
          classNamePrefix="react-select"
          options={choices.map((x) => {
            return { value: x[0], label: x[1] };
          })}
          styles={customSelectStyles}
          theme={selectTheme}
          components={{ DropdownIndicator, Option }}
          onChange={(data) => {
            this.setState({ selectedOption: data });
            return onChange?.(id, data.value);
          }}
        />
      </FormFieldWrapper>
    );
  }
}

export default compose(injectIntl)(LayoutSelectWidget);
