export const StyleSchema = () => ({
  title: 'Styling',
  fieldsets: [
    {
      id: 'default',
      title: 'Style',
      fields: ['backgroundColor'],
    },
  ],
  properties: {
    backgroundColor: {
      title: 'Background color',
      type: 'color',
      widget: 'simple_color_picker',
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
