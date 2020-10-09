import { v4 as uuid } from 'uuid';
import { emptyBlocksForm } from '@eeacms/volto-blocks-form/helpers';
import { settings } from '~/config';

export const getColumns = (data) => {
  return (data?.blocks_layout?.items || []).map((id) => [
    id,
    data.blocks?.[id],
  ]);
};

export const empty = (count) => {
  const blocks = {};
  const items = [];
  for (let x = 0; x < count; x++) {
    const id = uuid();
    blocks[id] = emptyBlocksForm();
    items.push(id);
  }

  return {
    blocks,
    blocks_layout: {
      items,
    },
  };
};

export const defaultNewColumn = () => {
  const id = uuid();
  return {
    blocks: { [id]: { '@type': settings.defaultBlockType } },
    blocks_layout: {
      items: [id],
    },
  };
};
