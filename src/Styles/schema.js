import { defineMessages } from 'react-intl';

const messages = defineMessages({
  labelStyling: {
    id: 'Styling',
    defaultMessage: 'Styling',
  },
  labelStyle: {
    id: 'Style',
    defaultMessage: 'Style',
  },
  labelAdvanced: {
    id: 'Advanced',
    defaultMessage: 'Advanced',
  },
  labelBackgroundColor: {
    id: 'Background color',
    defaultMessage: 'Background color',
  },
  labelVerticalAlign: {
    id: 'Vertical align',
    defaultMessage: 'Vertical align',
  },
  labelBottom: {
    id: 'Bottom',
    defaultMessage: 'Bottom',
  },
  labelMiddle: {
    id: 'Middle',
    defaultMessage: 'Middle',
  },
  labelTop: {
    id: 'Top',
    defaultMessage: 'Top',
  },
  labelPadding: {
    id: 'Padding',
    defaultMessage: 'Padding',
  },
  labelColumnClass: {
    id: 'Custom CSS class',
    defaultMessage: 'Custom CSS class',
  },
  descrColumnClass: {
    id: 'A custom CSS class, aplicable to this column',
    defaultMessage: 'A custom CSS class, aplicable to this column',
  },
});

export const StyleSchema = (intl) => ({
  title: intl.formatMessage(messages.labelStyling),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.labelStyle),
      fields: ['grid_vertical_align'],
    },
    {
      id: 'styling',
      title: intl.formatMessage(messages.labelStyling),
      fields: ['backgroundColor', 'padding'],
    },
    {
      id: 'advanced',
      title: intl.formatMessage(messages.labelAdvanced),
      fields: ['column_class'],
    },
  ],
  properties: {
    backgroundColor: {
      title: intl.formatMessage(messages.labelBackgroundColor),
      type: 'color',
      widget: 'simple_color_picker',
    },
    grid_vertical_align: {
      title: intl.formatMessage(messages.labelVerticalAlign),
      choices: [
        ['bottom', intl.formatMessage(messages.labelBottom)],
        ['middle', intl.formatMessage(messages.labelMiddle)],
        ['top', intl.formatMessage(messages.labelTop)],
      ],
    },
    padding: {
      title: intl.formatMessage(messages.labelPadding),
      widget: 'quad_size',
    },
    column_class: {
      title: intl.formatMessage(messages.labelColumnClass),
      description: intl.formatMessage(messages.descrColumnClass),
    },
  },
  required: [],
});

export const TextSettingsSchema = {
  title: 'Text settings',
  fieldsets: [
    {
      id: 'text_settings',
      title: 'Text settings',
      fields: ['grid_column_align_text', 'grid_column_text_color'],
    },
  ],
  properties: {
    grid_column_align_text: {
      title: 'Text align',
      widget: 'align',
    },
    grid_column_text_color: {
      title: 'Text color',
      widget: 'color_picker',
    },
  },
  required: [],
};

export const AdvancedSettingsSchema = {
  title: 'Advanced settings',
  fieldsets: [
    {
      id: 'advanced_fullcontrol',
      title: 'Advanced settings',
      fields: [
        'grid_column_margin',
        'grid_column_padding',
        // 'grid_column_inline_style',
      ],
    },
  ],
  properties: {
    grid_column_margin: {
      title: 'Margin',
      widget: 'textarea',
    },
    grid_column_padding: {
      title: 'Padding',
      widget: 'textarea',
    },
    // grid_column_inline_style: {
    //   title: 'Inline style',
    //   widget: 'json_text',
    // },
  },
  required: [],
};
