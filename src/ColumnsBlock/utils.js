import { v4 as uuid } from 'uuid';
import { emptyBlocksForm } from '@eeacms/volto-blocks-form/helpers';

export const getColumns = (coldata) => {
  return (coldata?.columns_layout?.items || []).map((id) => [
    id,
    coldata.columns?.[id],
  ]);
};

export const empty = (count) => {
  const columns = {};
  const items = [];
  for (let x = 0; x < count; x++) {
    const id = uuid();
    columns[id] = emptyBlocksForm();
    items.push(id);
  }

  return {
    columns,
    columns_layout: {
      items,
    },
  };
};
