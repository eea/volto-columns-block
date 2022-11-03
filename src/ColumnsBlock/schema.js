import { defineMessages } from 'react-intl';
import { cloneDeep } from 'lodash';

import config from '@plone/volto/registry';

import imageFitSVG from '@eeacms/volto-columns-block/ColumnsBlock/icons/image-narrow.svg';
import imageWideSVG from '@plone/volto/icons/image-wide.svg';
import imageFullSVG from '@plone/volto/icons/image-full.svg';
import { COLUMNSBLOCK } from '../constants';

const ALIGN_INFO_MAP = {
  narrow_width: [imageFitSVG, 'Narrow width'],
  container_width: [imageFitSVG, 'Container width'],
  wide_width: [imageWideSVG, 'Wide width'],
  full: [imageFullSVG, 'Full width'],
};

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

export const addStylingFieldsetSchemaEnhancer = ({ schema }) => {
  const applied = schema.fieldsets[0].fields.includes('styling');
  const enableStyling = config.blocks.blocksConfig[COLUMNSBLOCK].enableStyling;

  if (!applied && enableStyling) {
    const resSchema = cloneDeep(schema);

    resSchema.fieldsets.push({
      id: 'styling',
      fields: ['styles'],
      title: 'Styling',
    });
    resSchema.properties.styles = {
      widget: 'object',
      title: 'Styling',
      schema: {
        fieldsets: [
          {
            id: 'default',
            title: 'Default',
            fields: ['size'],
          },
        ],
        properties: {
          size: {
            widget: 'style_align',
            title: 'Section size',
            actions: Object.keys(ALIGN_INFO_MAP),
            actionsInfoMap: ALIGN_INFO_MAP,
          },
        },
        required: [],
      },
    };
    return resSchema;
  }

  return schema;
};
