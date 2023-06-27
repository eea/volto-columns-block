import config from '@plone/volto/registry';

import {
  getColumns,
  hasColumns,
  forEachColumn,
  columnIsEmpty,
  empty,
  defaultNewColumn,
} from './utils';

describe('getColumns', () => {
  it('should return an array of column IDs and their corresponding data', () => {
    const data = {
      blocks_layout: {
        items: ['1', '2'],
      },
      blocks: {
        '1': { name: 'First' },
        '2': { name: 'Second' },
      },
    };
    expect(getColumns(data)).toEqual([
      ['1', { name: 'First' }],
      ['2', { name: 'Second' }],
    ]);
  });

  it('should return an array of column IDs and their corresponding data', () => {
    const data = {
      blocks_layout: {
        items: undefined,
      },
      blocks: {
        '1': { name: 'First' },
        '2': { name: 'Second' },
      },
    };
    expect(getColumns(data)).toEqual([]);
  });
});

describe('hasColumns', () => {
  it('should return true if data has columns', () => {
    const data = {
      blocks_layout: {
        items: ['1', '2'],
      },
    };
    expect(hasColumns(data)).toBe(true);
  });

  it('should return false if data does not have columns', () => {
    const data = {};
    expect(hasColumns(data)).toBe(false);
  });
});

describe('forEachColumn', () => {
  it('should call callback for each column', () => {
    const data = {
      blocks_layout: {
        items: ['1', '2'],
      },
      blocks: {
        '1': { name: 'First' },
        '2': { name: 'Second' },
      },
    };
    const callback = jest.fn();
    forEachColumn(data, callback);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('columnIsEmpty', () => {
  it('should return true if column is empty', () => {
    const data = {};
    expect(columnIsEmpty(data)).toBe(true);
  });

  it('should return false if column is not empty', () => {
    const data = {
      blocks_layout: {
        items: ['1'],
      },
    };
    expect(columnIsEmpty(data)).toBe(false);
  });
});

describe('empty', () => {
  it('should return data for specified number of empty columns', () => {
    const result = empty(2);
    expect(Object.keys(result.blocks)).toHaveLength(2);
    expect(result.blocks_layout.items).toHaveLength(2);
  });
});

describe('defaultNewColumn', () => {
  it('should return data for new column with default block type', () => {
    const result = defaultNewColumn();
    const [id] = Object.keys(result.blocks);
    expect(result.blocks[id]['@type']).toEqual(
      config.settings.defaultBlockType,
    );
    expect(result.blocks_layout.items).toEqual([id]);
  });
});
