import { v4 as uuid } from 'uuid';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  getBlocks,
} from '@plone/volto/helpers';
import { blocks } from '~/config';

const columnConfig = {
  cloneData(blockData) {
    // console.log('column', blockData);
    return cloneFormData(blockData);
  },
};

function cloneFormData(formData) {
  const formBlocks = getBlocks(formData);

  const cloneWithIds = formBlocks
    .filter(([id, blockData]) => {
      return blockData.blocks ? true : !!blockData['@type']; // support "columns"
    })
    .map(([id, blockData]) => {
      const blockConfig =
        blocks.blocksConfig[blockData['@type']] || columnConfig;
      return blockConfig.cloneData
        ? blockConfig.cloneData(blockData)
        : [uuid(), blockData];
    })
    .filter((info) => !!info); // some blocks may refuse to be copied

  const blocksFieldname = getBlocksFieldname(formData);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);

  const newBlockData = {
    [blocksFieldname]: {
      ...formData[blocksFieldname],
      ...Object.assign(
        {},
        ...cloneWithIds.map(([id, data]) => ({ [id]: data })),
      ),
    },
    [blocksLayoutFieldname]: {
      ...formData[blocksLayoutFieldname],
      items: [...cloneWithIds.map(([id]) => id)],
    },
  };
  return [uuid(), newBlockData];
}

export function cloneColumnsBlockData(blockData) {
  const columnsData = blockData.data;
  const cloneWithIds = cloneFormData(columnsData);

  const [id, newBlockData] = cloneWithIds;
  return [
    id,
    {
      ...blockData,
      data: newBlockData,
    },
  ];
}
