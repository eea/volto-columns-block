import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Field, FormFieldWrapper } from '@plone/volto/components';
import { Grid } from 'semantic-ui-react';
import { Slider } from './Slider';

const messages = defineMessages({
  labelUnit: {
    id: 'Unit',
    defaultMessage: 'Unit',
  },
  labelPercentage: {
    id: 'Percentage',
    defaultMessage: 'Percentage',
  },
  labelSize: {
    id: 'Size',
    defaultMessage: 'Size',
  },
  labelCustomize: {
    id: 'Customize',
    defaultMessage: 'Customize',
  },
});

const getFields = (intl) => {
  return {
    unitField: {
      title: intl.formatMessage(messages.labelUnit),
      columns: 2,
      placeholder: intl.formatMessage(messages.labelUnit),
      defaultValue: 'px',
      choices: [
        ['px', 'px'],
        ['%', 'percentage'],
        ['em', 'em'],
        ['rem', 'rem'],
      ],
    },
  };
};

const getMax = (unit) => {
  switch (unit) {
    case '%':
      return 100;
    case 'px':
      return 100;
    case 'em':
      return 24;
    case 'rem':
      return 24;
    default:
      return 10;
  }
};

const QuadSizeWidget = (props) => {
  const intl = useIntl();
  const {
    value = {},
    id,
    onChange,
    sliderSettings = {
      max: 12,
      min: 0,
      step: 1,
      start: 0,
    },
  } = props;
  const {
    top = 0,
    right = 0,
    bottom = 0,
    left = 0,
    unit = 'px',
    unlock = false,
  } = value;
  const settings = {
    ...sliderSettings,
    max: getMax(unit),
  };
  const fields = getFields(intl);

  return (
    <FormFieldWrapper {...props}>
      <Field
        columns={2}
        id={`${id}-unit`}
        {...fields.unitField}
        onChange={(fid, val) => onChange(id, { ...value, unit: val })}
        value={value.unit || 'px'}
      />

      {unlock ? (
        <Grid columns={2}>
          <Grid.Column width={3}></Grid.Column>
          <Grid.Column width={6}>
            <Slider
              settings={{
                onChange: (val) => onChange(id, { ...value, top: val }),
                ...settings,
              }}
              value={top}
              extra={<strong>{top}</strong>}
            />
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
          <Grid.Column>
            <Slider
              settings={{
                onChange: (val) => onChange(id, { ...value, left: val }),
                ...settings,
              }}
              value={left}
              extra={<strong>{left}</strong>}
            />
          </Grid.Column>
          <Grid.Column>
            <Slider
              settings={{
                onChange: (val) => onChange(id, { ...value, right: val }),
                ...settings,
              }}
              value={right}
              extra={<strong>{right}</strong>}
            />
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
          <Grid.Column width={6}>
            <Slider
              settings={{
                onChange: (val) => onChange(id, { ...value, bottom: val }),
                ...settings,
              }}
              extra={<strong>{bottom}</strong>}
              value={bottom}
            />
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid>
      ) : (
        <Field
          id={`${id}-slider`}
          settings={settings}
          onChange={(fid, val) => {
            onChange(id, {
              ...value,
              top: val,
              left: val,
              bottom: val,
              right: val,
            });
          }}
          value={top}
          title={intl.formatMessage(messages.labelSize)}
          widget="slider"
          columns={2}
        />
      )}

      <Field
        id={`${id}-lockSize`}
        onChange={(fid, val) => onChange(id, { ...value, unlock: val })}
        value={unlock}
        title={intl.formatMessage(messages.labelCustomize)}
        type="boolean"
        columns={1}
      />
    </FormFieldWrapper>
  );
};

export default QuadSizeWidget;
