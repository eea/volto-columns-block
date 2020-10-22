/**
 * LayoutSelectWidget component.
 * @module volto-columns-block/Widgets/LayoutSelectWidget
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';

import loadable from '@loadable/component';

import { isEqual } from 'lodash';
import { variants } from '../grid';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import {
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import checkSVG from '@plone/volto/icons/check.svg';

const ReactSelectLib = loadable.lib(() => import('react-select'));

const gridColsAreEqual = (gridCols1, gridCols2) => {
  return isEqual(gridCols1, gridCols2);
};

const variantToGridCols = (v) => {
  return v.defaultData.gridCols;
};

export const Option = (props) => {
  return (
    <ReactSelectLib>
      {({ components }) => {
        return (
          <components.Option {...props}>
            <Icon
              name={
                variants.find((v) =>
                  gridColsAreEqual(variantToGridCols(v), props.value),
                ).icon
              }
              size="24px"
            />
            <div>{props.label}</div>
            {props.isFocused && !props.isSelected && (
              <Icon name={checkSVG} size="24px" color="#b8c6c8" />
            )}
            {props.isSelected && <Icon name={checkSVG} size="24px" color="#007bc1" />}
          </components.Option>
        );
      }}
    </ReactSelectLib>
  );
};

const SingleValue = (props) => {
  const { children, className, cx, getStyles, isDisabled, innerProps } = props;

  const variant = variants.find((v) =>
    gridColsAreEqual(variantToGridCols(v), props.data.value),
  );

  const icon = variant?.icon;

  return (
    <div
      style={getStyles('singleValue', props)}
      className={cx(
        {
          'single-value': true,
          'single-value--is-disabled': isDisabled,
        },
        className,
      )}
      {...innerProps}
    >
      {icon && (
        <Icon
          name={icon}
          size="24px"
          className="layout-select-widget-selection-icon"
        />
      )}
      {children}
    </div>
  );
};

/**
 * LayoutSelectWidget component class.
 * @function LayoutSelectWidget
 * @returns {string} Markup of the component.
 */
export class LayoutSelectWidget extends Component {
  state = {
    selectedOption: null,
  };

  updateSelectedOption = () => {
    this.setState({
      selectedOption: {
        value: this.props.value,
        label: this.props.choices.find((x) =>
          isEqual(x[0], this.props.value),
        )?.[1],
      },
    });
  };

  componentDidMount() {
    this.updateSelectedOption();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.value, this.props.value)) {
      this.updateSelectedOption();
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { id, choices, onChange } = this.props;

    return (
      <FormFieldWrapper {...this.props}>
        <ReactSelectLib>
          {({ default: Select }) => {
            return (
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
                components={{ DropdownIndicator, Option, SingleValue }}
                onChange={(data) => {
                  this.setState({ selectedOption: data });
                  return onChange?.(id, data.value);
                }}
              />
            );
          }}
        </ReactSelectLib>
      </FormFieldWrapper>
    );
  }
}

export default compose(injectIntl)(LayoutSelectWidget);
