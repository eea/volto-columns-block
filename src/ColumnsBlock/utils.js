import { v4 as uuid } from 'uuid';
import { emptyBlocksForm } from '@plone/volto/helpers/Blocks/Blocks';
import config from '@plone/volto/registry';

export const getColumns = (data) => {
  return (data?.blocks_layout?.items || []).map((id) => [
    id,
    data.blocks?.[id],
  ]);
};

export const hasColumns = (data) => {
  return data?.blocks_layout?.items?.length > 0;
};

export const forEachColumn = (data, callback) => {
  getColumns(data).forEach(callback);
};

export const columnIsEmpty = (colData) => {
  return !(colData?.blocks_layout?.items?.length > 0);
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
    blocks: { [id]: { '@type': config.settings.defaultBlockType } },
    blocks_layout: {
      items: [id],
    },
  };
};

// Fill an emptied column right away, keeping its settings. Filling it later,
// after the empty column was saved, adds an undo history entry that every
// undo lands on and refills, so undo gets stuck.
export const fillEmptyColumn = (colData) =>
  columnIsEmpty(colData) ? { ...colData, ...defaultNewColumn() } : colData;
