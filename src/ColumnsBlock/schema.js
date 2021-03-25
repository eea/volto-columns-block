export const ColumnSchema = {
  title: 'Column',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['column_title'],
    },
  ],
  properties: {
    column_title: {
      title: 'Column title',
    },
  },
  required: [],
};

export const ColumnsBlockSchema = () => ({
  title: 'Columns block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'data', 'gridCols'],
    },
  ],
  properties: {
    title: {
      title: 'Title',
      description: 'Columns block friendly name',
      type: 'string',
    },
    data: {
      title: 'Columns',
      type: 'columns',
      schema: ColumnSchema,
    },
    gridCols: {
      title: 'Layout',
      widget: 'layout_select',
      choices: [],
    },
  },
  required: [],
});
