// @flow
import { type ColumnId, Query, type ValueType } from '@sigmacomputing/sling';
import invariant from 'invariant';

import { ROW_HEIGHT } from 'const/TableConstants';
import type { ValueColumn, Values } from 'types';
import { getCount, getData, mergeValueColumns } from 'utils/column';
import { formatValue } from 'utils/format';
import layoutColumns from './layout';

export type CellPosition = {
  dataIndex: number,
  flatIndex: number,
  repeatCount: number
};

const EMPTY_POSITION = { dataIndex: 0, flatIndex: 0, repeatCount: 0 };

export type VisibleRange = {
  cellTop: number,
  dataRange: Array<number>,
  flatRange: Array<number>
};

const EMPTY_RANGE = { cellTop: 0, dataRange: [0, 0], flatRange: [0, 0] };

function appendValues(
  query: Query,
  first: { [ColumnId]: ValueColumn },
  second: { [ColumnId]: ValueColumn }
): Values {
  // compute which columns are not at the base level since they might have values that repeat and span the
  // old and new data
  const groupedCols = {};

  layoutColumns(query).columns.forEach(({ id, levelId }) => {
    if (query.getLevelIdx(levelId) > 0) groupedCols[id] = true;
  });

  const ret = {};

  for (const id of Object.keys(first)) {
    const prevData = first[id];
    const toMerge = second[id];

    if (!toMerge) {
      throw new Error(`Missing column data for ${id}`);
    }

    ret[id] = mergeValueColumns(prevData, toMerge, groupedCols[id]);
  }
  return ret;
}

export class TableData {
  offset: number;
  limit: number;
  hasPrev: boolean;
  hasNext: boolean;
  values: Values;

  constructor(
    values: Values,
    offset: number,
    limit: number,
    hasPrev: boolean,
    hasNext: boolean
  ) {
    this.offset = offset;
    this.limit = limit;
    this.hasPrev = hasPrev;
    this.hasNext = hasNext;
    this.values = values;
  }

  merge(
    query: Query,
    values: Values,
    offset: number,
    limit: number,
    hasMore: boolean
  ) {
    let hasPrev = this.hasPrev;
    let hasNext = this.hasNext;
    let v;

    if (offset < 0) {
      hasPrev = hasMore;
      v = appendValues(query, values, this.values);
    } else {
      invariant(hasNext, `Appending data but hasNext was false: ${offset}`);
      invariant(
        offset === this.limit + this.offset,
        `Bad append ${offset} ${this.limit} ${this.offset}`
      );
      hasNext = hasMore;
      v = appendValues(query, this.values, values);
    }
    return new TableData(
      v,
      Math.min(offset, this.offset),
      this.limit + limit,
      hasPrev,
      hasNext
    );
  }

  getColumnData(columnId: ColumnId): ?ValueColumn {
    return this.values[columnId];
  }

  getColumnType(columnId: ColumnId): ?ValueType {
    const v = this.getColumnData(columnId);
    return v ? v.type : null;
  }

  _getCellPosition(columnId: ColumnId, flatOffset: number): ?CellPosition {
    const colData = this.getColumnData(columnId);
    if (!colData || colData.length === 0) return EMPTY_POSITION;

    let flatIndex = 0;

    for (let i = 0; i < colData.length; i++) {
      const count = getCount(colData, i);
      if (flatOffset >= flatIndex && flatOffset < flatIndex + count) {
        return {
          dataIndex: i,
          flatIndex,
          repeatCount: count
        };
      }
      flatIndex += count;
    }
    return null;
  }

  isValidCellPosition(columnId: ColumnId, flatOffset: number): boolean {
    return Boolean(this._getCellPosition(columnId, flatOffset));
  }

  getCellPosition(columnId: ColumnId, flatOffset: number): CellPosition {
    const p = this._getCellPosition(columnId, flatOffset);
    if (p) return p;
    throw new Error(`Invalid flatOffset: ${flatOffset}`);
  }

  getVisibleRange(
    columnId: ColumnId,
    _scrollTop: number,
    height: number
  ): VisibleRange {
    let cellTop;
    let dataRange;
    let flatRange;
    let flatIndex = 0;
    // constrain scrollTop within total Height
    const scrollTop = Math.max(
      0,
      Math.min(_scrollTop, this.limit * ROW_HEIGHT - height)
    );
    const vizEnd = scrollTop + height;
    const colData = this.getColumnData(columnId);
    if (!colData || colData.length === 0) return EMPTY_RANGE;

    let lastIndex = colData.length;
    let y = 0;

    for (let i = 0; i < colData.length; i++) {
      const count = getCount(colData, i);
      const rowHeight = ROW_HEIGHT * count;
      const yEnd = y + rowHeight;
      if (yEnd <= scrollTop) {
        // row ends before visible range
        y += rowHeight;
        flatIndex += count;
      } else if (y >= vizEnd) {
        // row starts after visible range.  we're done
        lastIndex = i;
        break;
      } else {
        if (cellTop === undefined) {
          // starting the rendered range
          cellTop = y;
          dataRange = [i];
          flatRange = [flatIndex];
        }
        flatIndex += count;
        y += rowHeight;
      }
    }

    if (
      dataRange === undefined ||
      flatRange === undefined ||
      cellTop === undefined
    ) {
      throw new Error('Invalid visible range');
    }

    // set the end of the ranges
    dataRange[1] = lastIndex;
    flatRange[1] = flatIndex;
    return { cellTop, dataRange, flatRange };
  }

  getCellValueStr(columnId: ColumnId, flatOffset: number): ?string {
    const { dataIndex } = this.getCellPosition(columnId, flatOffset);
    const colData = this.getColumnData(columnId);
    if (!colData || colData.length < dataIndex) return null;

    const data = getData(colData, dataIndex);
    return data != null ? formatValue(data) : null;
  }

  getFlatOffsetBefore(columnId: ColumnId, flatOffset: number): ?number {
    const { flatIndex } = this.getCellPosition(columnId, flatOffset);
    return flatIndex === 0 ? null : flatIndex - 1;
  }

  getFlatOffsetAfter(columnId: ColumnId, flatOffset: number): ?number {
    const { flatIndex, dataIndex, repeatCount } = this.getCellPosition(
      columnId,
      flatOffset
    );
    const colData = this.getColumnData(columnId);
    if (!colData || colData.length === 0) return null;
    return dataIndex === colData.length - 1 ? null : flatIndex + repeatCount;
  }
}



// WEBPACK FOOTER //
// ./src/components/table/tableData.js