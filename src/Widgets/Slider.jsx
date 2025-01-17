// Copied from MIT-licensed https://github.com/iozbeyli/react-semantic-ui-range

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import { FormFieldWrapper } from '@plone/volto/components';

import styles from './range.css.js';
import './range.css';

function isNumeric(str) {
  if (typeof str != 'string') return false; // we only process strings!
  return !isNaN(str);
}

export class Slider extends Component {
  constructor(props) {
    super(props);
    let value = this.props.value
      ? this.props.value
      : props.multiple
      ? [...props.settings.start]
      : props.settings.start;
    this.state = {
      value: value,
      position: props.multiple ? [] : 0,
      numberOfKnobs: props.multiple ? value.length : 1,
      offset: 10,
      precision: 0,
      mouseDown: false,
      showNumericInput: false,
    };
    this.determinePosition = this.determinePosition.bind(this);
    this.rangeMouseUp = this.rangeMouseUp.bind(this);
    this.refresh = this.refresh.bind(this);
    this.handleKnobClick = this.handleKnobClick.bind(this);
  }

  componentDidMount() {
    this.determinePrecision();
    const value = this.props.value ? this.props.value : this.state.value;
    this.setValuesAndPositions(value, false);
    window.addEventListener('mouseup', this.rangeMouseUp);
    window.addEventListener('resize', this.refresh);
  }

  refresh() {
    const value = this.props.value ? this.props.value : this.state.value;
    this.setValuesAndPositions(value, false);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const isValueUnset =
      nextProps.value === null || nextProps.value === undefined;

    if (!isValueUnset && nextProps.value !== this.state.value) {
      if (this.props.multiple) {
        const different = this.isDifferentArrays(
          nextProps.value,
          this.state.value,
        );
        if (different) {
          this.setValuesAndPositions(nextProps.value, true);
        }
      } else {
        this.setValuesAndPositions(nextProps.value, true);
      }
    }
  }

  componentWillUnmount() {
    this.inner = undefined;
    this.innerLeft = undefined;
    this.innerRight = undefined;
    window.removeEventListener('mouseup', this.rangeMouseUp);
    window.removeEventListener('resize', this.refresh);
  }

  setValuesAndPositions(value, triggeredByUser) {
    if (this.props.multiple) {
      this.setState((prevState) => {
        const positions = [...prevState.position];
        value.forEach((val, i) => {
          this.setValue(val, triggeredByUser, i);
          positions[i] = this.determinePosition(val);
        });
        return { position: positions };
      });
    } else {
      this.setValue(value, triggeredByUser);
      this.setState({
        position: this.determinePosition(value),
      });
    }
  }

  isDifferentArrays(a, b) {
    let different = false;
    a.some((val, i) => {
      if (val !== b[i]) {
        different = true;
        return true;
      }
      return false;
    });
    return different;
  }

  determinePosition(value) {
    const trackLeft = ReactDOM.findDOMNode(this.track).getBoundingClientRect()
      .left;
    const innerLeft = ReactDOM.findDOMNode(this.inner).getBoundingClientRect()
      .left;
    const ratio =
      (value - this.props.settings.min) /
      (this.props.settings.max - this.props.settings.min);
    const position =
      Math.round(ratio * this.inner.offsetWidth) +
      trackLeft -
      innerLeft -
      this.state.offset;
    return position;
  }

  determinePrecision() {
    let split = String(this.props.settings.step).split('.');
    let decimalPlaces;
    if (split.length === 2) {
      decimalPlaces = split[1].length;
    } else {
      decimalPlaces = 0;
    }
    this.setState({
      precision: Math.pow(10, decimalPlaces),
    });
  }

  determineValue(startPos, endPos, currentPos) {
    let ratio = (currentPos - startPos) / (endPos - startPos);
    let range = this.props.settings.max - this.props.settings.min;
    let difference =
      Math.round((ratio * range) / this.props.settings.step) *
      this.props.settings.step;
    // Use precision to avoid ugly Javascript floating point rounding issues
    // (like 35 * .01 = 0.35000000000000003)
    difference =
      Math.round(difference * this.state.precision) / this.state.precision;
    return difference + this.props.settings.min;
  }

  determineKnob(position, value) {
    if (!this.props.multiple) {
      return 0;
    }
    if (position <= this.state.position[0]) {
      return 0;
    }
    if (position >= this.state.position[this.state.numberOfKnobs - 1]) {
      return this.state.numberOfKnobs - 1;
    }
    let index = 0;

    for (let i = 0; i < this.state.numberOfKnobs - 1; i++) {
      if (
        position >= this.state.position[i] &&
        position < this.state.position[i + 1]
      ) {
        const distanceToSecond = Math.abs(
          position - this.state.position[i + 1],
        );
        const distanceToFirst = Math.abs(position - this.state.position[i]);
        if (distanceToSecond <= distanceToFirst) {
          return i + 1;
        } else {
          return i;
        }
      }
    }
    return index;
  }

  setValue(value, triggeredByUser, knobIndex) {
    if (typeof triggeredByUser === 'undefined') {
      triggeredByUser = true;
    }
    const currentValue = this.props.multiple
      ? this.state.value[knobIndex]
      : this.state.value;
    if (currentValue !== value) {
      let newValue = [];
      if (this.props.multiple) {
        newValue = [...this.state.value];
        newValue[knobIndex] = value;
        this.setState({
          value: newValue,
        });
      } else {
        newValue = value;
        this.setState({
          value: value,
        });
      }
      if (this.props.settings.onChange) {
        this.props.settings.onChange(newValue, {
          triggeredByUser: triggeredByUser,
        });
      }
    }
  }

  setValuePosition(value, triggeredByUser, knobIndex) {
    if (this.props.multiple) {
      this.setState((prevState) => {
        const positions = [...prevState.position];
        positions[knobIndex] = this.determinePosition(value);
        this.setValue(value, triggeredByUser, knobIndex);
        return { position: positions };
      });
    } else {
      this.setValue(value, triggeredByUser);
      this.setState({
        position: this.determinePosition(value),
      });
    }
  }

  setPosition(position, knobIndex) {
    if (this.props.multiple) {
      this.setState((prevState) => {
        const newPosition = [...prevState.position];
        newPosition[knobIndex] = position;
        return { position: newPosition };
      });
    } else {
      this.setState({
        position: position,
      });
    }
  }

  rangeMouseDown(isTouch, e) {
    e.stopPropagation();
    if (!this.props.disabled) {
      if (!isTouch) {
        e.preventDefault();
      }

      this.setState({
        mouseDown: true,
      });
      let innerBoundingClientRect = ReactDOM.findDOMNode(
        this.inner,
      ).getBoundingClientRect();
      this.innerLeft = innerBoundingClientRect.left;
      this.innerRight = this.innerLeft + this.inner.offsetWidth;
      this.rangeMouse(isTouch, e);
    }
  }

  rangeMouse(isTouch, e) {
    let pageX;
    let event = isTouch ? e.touches[0] : e;
    if (event.pageX) {
      pageX = event.pageX;
    } else {
      // eslint-disable-next-line
      console.log('PageX undefined');
    }
    let value = this.determineValue(this.innerLeft, this.innerRight, pageX);
    if (pageX >= this.innerLeft && pageX <= this.innerRight) {
      if (
        value >= this.props.settings.min &&
        value <= this.props.settings.max
      ) {
        const position = pageX - this.innerLeft - this.state.offset;
        const knobIndex = this.props.multiple
          ? this.determineKnob(position)
          : undefined;
        if (this.props.discrete) {
          this.setValuePosition(value, false, knobIndex);
        } else {
          this.setPosition(position, knobIndex);
          this.setValue(value, undefined, knobIndex);
        }
      }
    }
  }

  rangeMouseMove(isTouch, e) {
    e.stopPropagation();
    if (!isTouch) {
      e.preventDefault();
    }
    if (this.state.mouseDown) {
      this.rangeMouse(isTouch, e);
    }
  }

  rangeMouseUp() {
    this.setState({
      mouseDown: false,
    });
  }

  handleKnobClick(e) {
    if (e.detail > 1 && !this.state.showNumericInput) {
      this.setState({ showNumericInput: true });
    }
  }

  render() {
    return (
      <div className="slider-widget-wrapper">
        {this.state.showNumericInput ? (
          <input
            defaultValue={this.props.value}
            onKeyDown={(e) => {
              // TODO: handle multiple knobs
              if (e.key === 'Enter' && isNumeric(e.target.value)) {
                const value = e.target.value;
                this.setState({ showNumericInput: false }, () => {
                  this.props.settings.onChange(parseInt(value));
                });
              }
            }}
          />
        ) : (
          <div
            tabIndex="-1"
            role="button"
            onMouseDown={(event) => this.rangeMouseDown(false, event)}
            onMouseMove={(event) => this.rangeMouseMove(false, event)}
            onMouseUp={(event) => this.rangeMouseUp(false, event)}
            onTouchEnd={(event) => this.rangeMouseUp(true, event)}
            onTouchMove={(event) => this.rangeMouseMove(true, event)}
            onTouchStart={(event) => this.rangeMouseDown(true, event)}
            style={{
              ...styles.range,
              ...(this.props.disabled ? styles.disabled : {}),
              ...(this.props.style ? this.props.style : {}),
            }}
          >
            <div
              className="semantic_ui_range_inner"
              ref={(inner) => {
                this.inner = inner;
              }}
              style={{
                ...styles.inner,
                ...(this.props.style && this.props.style.inner
                  ? this.props.style.inner
                  : {}),
              }}
            >
              <div
                className="slider-track"
                ref={(track) => {
                  this.track = track;
                }}
                style={{
                  ...styles.track,
                  ...(this.props.inverted ? styles.invertedTrack : {}),
                  ...(this.props.style && this.props.style.track
                    ? this.props.style.track
                    : {}),
                }}
              />
              <div
                className="slider-track-active"
                ref={(trackFill) => {
                  this.trackFill = trackFill;
                }}
                style={{
                  ...styles.trackFill,
                  ...(this.props.inverted ? styles.invertedTrackFill : {}),
                  ...styles[
                    this.props.inverted
                      ? 'inverted-' + this.props.color
                      : this.props.color
                  ],
                  ...(this.props.style && this.props.style.trackFill
                    ? this.props.style.trackFill
                    : {}),
                  ...(this.props.disabled ? styles.disabledTrackFill : {}),
                  ...(this.props.style && this.props.style.disabledTrackFill
                    ? this.props.style.disabledTrackFill
                    : {}),
                  ...{ width: this.state.position + this.state.offset + 'px' },
                  ...(this.props.multiple && this.state.position.length > 0
                    ? {
                        left: this.state.position[0],
                        width:
                          this.state.position[this.state.numberOfKnobs - 1] -
                          this.state.position[0],
                      }
                    : {}),
                }}
              />

              {this.props.multiple ? (
                this.state.position.map((pos, i) => (
                  <div
                    className="slider-knob multiple"
                    key={i}
                    style={{
                      ...styles.knob,
                      ...(this.props.style && this.props.style.knob
                        ? this.props.style.knob
                        : {}),
                      ...{ left: pos + 'px' },
                    }}
                  />
                ))
              ) : (
                <div
                  tabIndex="-1"
                  role="button"
                  className="slider-knob single"
                  onKeyDown={this.handleKnobKeydown}
                  onClick={this.handleKnobClick}
                  style={{
                    ...styles.knob,
                    ...(this.props.style && this.props.style.knob
                      ? this.props.style.knob
                      : {}),
                    ...{ left: this.state.position + 'px' },
                  }}
                >
                  {this.props.extra}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

Slider.defaultProps = {
  color: 'red',
  settings: {
    min: 0,
    max: 10,
    step: 1,
    start: 0,
  },
};

Slider.propTypes = {
  color: PropTypes.string,
  disabled: PropTypes.bool,
  discrete: PropTypes.bool,
  inverted: PropTypes.bool,
  multiple: PropTypes.bool,
  settings: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    start: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number),
    ]),
    onChange: PropTypes.func,
  }),
};

const SliderWidget = (props) => {
  const { id, onChange, value, settings = {}, ...rest } = props;
  return (
    <FormFieldWrapper {...props}>
      <Slider
        {...rest}
        settings={{
          ...settings,
          onChange: (value) => {
            onChange(id, value);
          },
        }}
        value={value}
        extra={<strong style={{ fontSize: 'x-small' }}>{value}</strong>}
      />
    </FormFieldWrapper>
  );
};

export default SliderWidget;
