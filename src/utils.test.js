import { v4 as uuid } from 'uuid';
import { getBlocks } from '@plone/volto/helpers/Blocks/Blocks';
import config from '@plone/volto/registry';
import { cloneData } from './utils';

jest.mock(
  'uuid',
  () => {
    let nextId = 0;
    return { v4: jest.fn(() => `generated-${++nextId}`) };
  },
  { virtual: true },
);

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

  it('recursively regenerates structural IDs without mutating the source', () => {
    const outerBlockId = uuid();
    const innerBlockId = uuid();
    const innerBlock = {
      '@type': 'inner',
      blocks: {
        [innerBlockId]: { '@type': 'leaf' },
      },
      blocks_layout: { items: [innerBlockId] },
    };
    const mockBlockData = {
      data: {
        '@type': 'columns',
        blocks: {
          [outerBlockId]: innerBlock,
        },
        blocks_layout: {
          items: [outerBlockId],
        },
      },
    };
    const sourceSnapshot = JSON.parse(JSON.stringify(mockBlockData));

    getBlocks
      .mockReturnValueOnce([[outerBlockId, innerBlock]])
      .mockReturnValueOnce([[innerBlockId, innerBlock.blocks[innerBlockId]]]);

    const [id, clonedBlockData] = cloneData(mockBlockData);
    const newOuterId = clonedBlockData.data.blocks_layout.items[0];
    const newOuterBlock = clonedBlockData.data.blocks[newOuterId];
    const newInnerId = newOuterBlock.blocks_layout.items[0];
    const originalIds = [outerBlockId, innerBlockId];
    const clonedIds = [id, newOuterId, newInnerId];

    clonedIds.forEach((clonedId) =>
      expect(originalIds).not.toContain(clonedId),
    );
    expect(new Set(clonedIds).size).toBe(clonedIds.length);
    expect(newOuterBlock.blocks[newInnerId]).toEqual(
      innerBlock.blocks[innerBlockId],
    );
    expect(mockBlockData).toEqual(sourceSnapshot);
  });
});
