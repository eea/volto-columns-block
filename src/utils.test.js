import { v4 as uuid } from 'uuid';
import { getBlocks } from '@plone/volto/helpers/Blocks/Blocks';
import config from '@plone/volto/registry';
import { cloneData } from './utils';

jest.mock('@plone/volto/helpers/Blocks/Blocks', () => ({
  getBlocks: jest.fn(),
  getBlocksFieldname: jest.fn(() => 'blocks'),
  getBlocksLayoutFieldname: jest.fn(() => 'blocks_layout'),
  hasBlocksData: jest.fn((block) => !!block.blocks),
}));

describe('cloneData', () => {
  it('should clone the blockData with calling cloneData directly', () => {
    const blockId = uuid();
    const mockBlockData = {
      data: {
        '@type': 'columns',
        blocks: {
          [blockId]: {
            '@type': 'test',
          },
        },
        blocks_layout: {
          items: [blockId],
        },
      },
    };

    getBlocks.mockReturnValue([[blockId, mockBlockData.data.blocks[blockId]]]);

    const [id, clonedBlockData] = cloneData(mockBlockData);
    const clonedBlockId = clonedBlockData.data.blocks_layout.items[0];
    const clonedBlock = clonedBlockData.data.blocks[clonedBlockId];
    expect(clonedBlock).toBeDefined();
    expect(clonedBlockId).not.toEqual(blockId);
    expect(clonedBlock).toEqual(mockBlockData.data.blocks[blockId]);
    expect(id).not.toBeNull();
  });

  it('should clone the blockData with calling cloneData from block config', () => {
    const blockId = uuid();
    const mockBlockData = {
      data: {
        '@type': 'columns',
        blocks: {
          [blockId]: {
            '@type': 'test',
            blocks: {},
          },
        },
        blocks_layout: {
          items: [blockId],
        },
      },
    };

    getBlocks.mockReturnValue([[blockId, mockBlockData.data.blocks[blockId]]]);

    config.blocks.blocksConfig = {
      test: {
        cloneData: jest.fn(() => [
          'test_uuid',
          mockBlockData.data.blocks[blockId],
        ]),
      },
    };
    const [id, clonedBlockData] = cloneData(mockBlockData);
    expect(id).not.toEqual('test_uuid');
    expect(clonedBlockData.data.blocks['test_uuid']).toEqual(
      mockBlockData.data.blocks[blockId],
    );
  });
});
