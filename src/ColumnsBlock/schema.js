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
      fields: ['data', 'gridCols'], //  'nrColumns', 'block_title'
    },
  ],
  properties: {
    block_title: {
      title: 'Block title',
      default: 'Columns',
    },
    data: {
      title: 'Columns',
      type: 'columns',
      schema: ColumnSchema,
    },
    gridCols: {
      title: 'Layout',
      choices: [],
    },
  },
  required: ['title'],
});
