import { v4 as uuid } from 'uuid';
import { cloneColumnsBlockData } from './utils';
import { getBlocks } from '@plone/volto/helpers';
import config from '@plone/volto/registry';

jest.mock('@plone/volto/helpers', () => ({
  getBlocks: jest.fn(),
  getBlocksFieldname: jest.fn(() => 'blocks'),
  getBlocksLayoutFieldname: jest.fn(() => 'blocks_layout'),
}));

describe('cloneColumnsBlockData', () => {
  it('', () => {
    const mockBlockData = {
      data: {
        '@type': 'columns',
        blocks: {
          block1: {
            '@type': 'test',
          },
        },
        blocks_layout: {
          items: ['block1'],
        },
      },
    };

    getBlocks.mockReturnValue([['block1', mockBlockData.data.blocks.block1]]);
    config.blocks.blocksConfig = {
      test: {},
    };
    const [id, clonedBlockData] = cloneColumnsBlockData(mockBlockData);
    expect(clonedBlockData.data.blocks.block1).toEqual(
      mockBlockData.data.blocks.block1,
    );
  });

  it('', () => {
    const mockBlockData = {
      data: {
        '@type': 'columns',
        blocks: {
          block1: {
            '@type': 'test',
            blocks: {},
          },
        },
        blocks_layout: {
          items: ['block1'],
        },
      },
    };

    getBlocks.mockReturnValue([['block1', mockBlockData.data.blocks.block1]]);
    config.blocks.blocksConfig = {
      test: {
        cloneData: jest.fn(() => [
          'test_uuid',
          mockBlockData.data.blocks.block1,
        ]),
      },
    };
    const [id, clonedBlockData] = cloneColumnsBlockData(mockBlockData);
    expect(id).not.toEqual('test_uuid');
    expect(clonedBlockData.data.blocks.block1).toEqual(
      mockBlockData.data.blocks.block1,
    );
    expect(clonedBlockData.data.blocks['test_uuid']).toEqual(
      mockBlockData.data.blocks.block1,
    );
  });
});
