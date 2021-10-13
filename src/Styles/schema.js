export const StyleSchema = () => ({
  title: 'Styling',
  fieldsets: [
    {
      id: 'default',
      title: 'Style',
      fields: ['grid_vertical_align'],
    },
    {
      id: 'styling',
      title: 'Styling',
      fields: ['backgroundColor', 'padding'],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      fields: ['column_class'],
    },
  ],
  properties: {
    backgroundColor: {
      title: 'Background color',
      type: 'color',
      widget: 'simple_color_picker',
    },
    grid_vertical_align: {
      title: 'Vertical align',
      choices: [
        ['bottom', 'Bottom'],
        ['middle', 'Middle'],
        ['top', 'Top'],
      ],
    },
    padding: {
      title: 'Padding',
      widget: 'quad_size',
    },
    column_class: {
      title: 'Custom CSS Class',
      description: 'A custom CSS class, aplicable to this column',
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
