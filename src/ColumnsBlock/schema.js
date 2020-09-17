export const ColumnsBlockSchema = {
  title: 'Columns block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['block_title', 'coldata'], //  'nrColumns'
    },
  ],
  properties: {
    block_title: {
      title: 'Block title',
      default: 'Columns',
    },
    coldata: {
      title: 'Columns',
      type: 'columns',
    },
  },
  required: ['title'],
};
