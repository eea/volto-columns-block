import { defineMessages } from 'react-intl';

const messages = defineMessages({
  labelColumn: {
    id: 'Column',
    defaultMessage: 'Column',
  },
  labelDefault: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  labelColumnTitle: {
    id: 'Column title',
    defaultMessage: 'Column title',
  },
  labelColumnsBlock: {
    id: 'Columns block',
    defaultMessage: 'Columns block',
  },
  labelTitle: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  descrTitle: {
    id: 'Columns block friendly name',
    defaultMessage: 'Columns block friendly name',
  },
  labelColumns: {
    id: 'Columns',
    defaultMessage: 'Columns',
  },
  labelLayout: {
    id: 'Layout',
    defaultMessage: 'Layout',
  },
});

export const ColumnSchema = (intl) => ({
  title: intl.formatMessage(messages.labelColumn),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.labelDefault),
      fields: ['column_title'],
    },
  ],
  properties: {
    column_title: {
      title: intl.formatMessage(messages.labelColumnTitle),
    },
  },
  required: [],
});

export const ColumnsBlockSchema = (intl) => ({
  title: intl.formatMessage(messages.labelColumnsBlock),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.labelDefault),
      fields: ['title', 'data', 'gridCols'],
    },
  ],
  properties: {
    title: {
      title: intl.formatMessage(messages.labelTitle),
      description: intl.formatMessage(messages.descrTitle),
      type: 'string',
    },
    data: {
      title: intl.formatMessage(messages.labelColumns),
      type: 'columns',
      schema: ColumnSchema(intl),
    },
    gridCols: {
      title: intl.formatMessage(messages.labelLayout),
      widget: 'layout_select',
      choices: [],
    },
  },
  required: [],
});
