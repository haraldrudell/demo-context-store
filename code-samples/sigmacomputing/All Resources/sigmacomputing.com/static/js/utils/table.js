// @flow
import invariant from 'invariant';
import {
  type Query,
  type Id,
  type Anchor,
  type ConstVal,
  type ColumnId,
  type ValueType,
  formula
} from '@sigmacomputing/sling';
import { isEqual } from 'lodash';
import * as React from 'react';

import type { Values, ValueColumn } from 'types';
import type { TableData } from 'components/table/tableData';
import { Icon } from 'widgets';
import { collapse, expand } from './ColumnActions';
import {
  getConstVal,
  getCell,
  getCount,
  setCount,
  shiftValueColumn,
  popValueColumn
} from 'utils/column';

export function getFullRowCount(table: Values): number {
  let fullRowCount = 0;
  for (const k of Object.keys(table)) {
    const c = table[k];
    if (c != null) {
      fullRowCount = Math.max(fullRowCount, c.length);
    }
  }
  return fullRowCount;
}

export function canCollapse(query: Query, levelId: Id): boolean {
  // allow collapse if our levelIdx > 0
  // and there exists a level with a lower idx that is expanded
  const levelIdx = query.getLevelIdx(levelId);
  for (let i = levelIdx - 1; i >= 0; i--) {
    if (!query.getLevel(i).isCollapsed) return true;
  }
  return false;
}

export function canExpand(query: Query, levelId: Id): boolean {
  // allow expand if our levelIdx > 0
  // and levelIdx - 1 is collapsed
  const levelIdx = query.getLevelIdx(levelId);
  return levelIdx > 0 && query.getLevel(levelIdx - 1).isCollapsed;
}

// Removes the last Row from the value and updates in-place
export function popRow(values: Values) {
  for (const id of Object.keys(values)) {
    const colValue = values[id];
    if (!colValue) continue;

    const lastIndex = colValue.length - 1;
    const count = getCount(colValue, lastIndex);
    if (count === 1) {
      popValueColumn(colValue);
    } else {
      setCount(colValue, lastIndex, count - 1);
    }
  }
}

// Removes the first Row from the value and updates in-place
export function shiftRow(values: Values) {
  for (const id of Object.keys(values)) {
    const colValue = values[id];
    if (!colValue) continue;

    const count = getCount(colValue, 0);
    if (count === 1) {
      shiftValueColumn(colValue);
    } else {
      setCount(colValue, 0, count - 1);
    }
  }
}

function getLevelKeys(query: Query, i: number): Set<Id> {
  const { keys, sortKeys = [] } = query.getGroupLevel(i);
  let ids = keys.slice();
  if (sortKeys.length > 0) {
    ids = ids.concat(sortKeys.map(x => x.column));
  }
  return new Set(ids);
}

export function isValidAnchor(query: Query, anchor: Anchor): boolean {
  if (query.levels.length === 0) return false;

  let rem = Object.keys(anchor.key).length;

  // search through each grouping level starting at the top
  // and assert that the anchor contains all of the keys + sort keys
  for (let i = query.levels.length; i > 0; i--) {
    for (const id of getLevelKeys(query, i)) {
      // key is missing
      if (!anchor.key[id]) return false;
      rem--;
    }
    if (rem === 0) return true;
  }
  return false;
}

export function mkAnchor(
  query: Query,
  tableData: TableData,
  columnId: Id,
  levelId: Id,
  flatOffset: number
): Anchor {
  const anchorKey = {};

  // Anchor on the key / sort values for the current level and any level above
  for (let i = query.getLevelIdx(levelId); i <= query.levels.length; i++) {
    for (const id of getLevelKeys(query, i)) {
      const typ = tableData.getColumnType(id);
      if (typ && typ !== 'error') {
        const valueStr = tableData.getCellValueStr(id, flatOffset);
        anchorKey[id] = formula.parseConstVal(valueStr, typ);
      }
    }
  }

  return {
    key: anchorKey,
    reference: { type: 'top' }
  };
}

type QueryAnchor = {
  query: Query,
  anchor: ?Anchor
};

export function collapseAndAnchor(
  inputQuery: Query,
  tableData: TableData,
  columnId: Id,
  levelId: Id,
  flatOffset: number
): QueryAnchor {
  const query = collapse(inputQuery, levelId);
  const anchor = mkAnchor(query, tableData, columnId, levelId, flatOffset);
  return { query, anchor };
}

export function expandAndAnchor(
  inputQuery: Query,
  tableData: TableData,
  columnId: Id,
  levelId: Id,
  flatOffset: number
): QueryAnchor {
  const query = expand(inputQuery, levelId);
  const anchor = mkAnchor(query, tableData, columnId, levelId, flatOffset);
  return { query, anchor };
}

function getValueOffsets(k: ConstVal, c: ValueColumn): Set<number> {
  const ret = new Set();
  let flatOffset = 0;

  if (c.type === 'error') return ret; // XXX: error type

  for (let i = 0, l = c.length; i < l; ++i) {
    let x = getConstVal(c, i);
    let count = getCount(c, i);
    if (isEqual(x, k)) {
      for (let j = 0; j < count; j++) {
        ret.add(flatOffset + j);
      }
    }
    flatOffset += count;
  }
  return ret;
}

function union(a: Set<number>, b: ?Set<number>): Set<number> {
  if (!b) return a;
  const r = new Set();

  for (const i of a) {
    if (b.has(i)) r.add(i);
  }
  return r;
}

export function getAnchorKeyFlatOffset(
  key: { [ColumnId]: ConstVal },
  values: Values
): ?number {
  const keyCols = Object.keys(key);
  if (keyCols.length === 0) return null;

  let offsets = null;

  for (const id of keyCols) {
    const colValue = values[id];
    if (!colValue) return null;
    offsets = union(getValueOffsets(key[id], colValue), offsets);
    if (offsets.size === 0) return null; // value not found in this col
  }

  return offsets ? offsets.values().next().value : null;
}

export function getColumnTypeIcon(type: ?ValueType) {
  switch (type) {
    case 'boolean':
      return <Icon type="type-logical" />;
    case 'datetime':
      return <Icon type="type-date" />;
    case 'variant':
      return <span>{'{ }'}</span>;
    case 'error':
      return <Icon type="warning" />;
    case 'number':
      return <span>#</span>;
    default:
      return <span style={{ fontSize: 12 }}>abc</span>;
  }
}

// convert our columnar structure into the row-oriented struct expected by vega
export function flatten(values: Values): { values: Array<Object> } {
  const keys = Object.keys(values);
  if (keys.length === 0) {
    return { values: [] };
  }

  const length = values[keys[0]].length;
  const data = [];
  for (let i = 0; i < length; ++i) {
    data.push({});
  }

  for (const id of keys) {
    const columnData = values[id];
    for (let i = 0; i < length; ++i) {
      const [value, count] = getCell(columnData, i);
      invariant(count === 1, `Expected 1 row but got repeat ${count}`);
      data[i][id] = value;
    }
  }
  return { values: data };
}

// XXX: Would be nice to hook vega directly up to our columnar data format
export function flattenAndMerge(
  tables: Array<{ table: Values }>
): { values: Array<Object> } {
  const r = tables.map(x => flatten(x.table));
  if (r.length === 1) return r[0];

  // multiple layers, merge row by row
  const ret = [];

  // XXX: this is simple but not the most efficient.  would rather convert to columnar than optimize this
  for (let i = 0; i < r.length; i++) {
    for (let j = 0; j < r[i].values.length; j++) {
      const prev = ret[j];
      const cur = r[i].values[j];
      ret[j] = {
        ...prev,
        ...cur
      };
    }
  }

  return { values: ret };
}



// WEBPACK FOOTER //
// ./src/utils/table.js