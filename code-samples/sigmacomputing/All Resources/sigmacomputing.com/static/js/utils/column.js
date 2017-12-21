// @flow
import moment from 'moment-strftime';
import invariant from 'invariant';

import {
  TY_LOGICAL,
  TY_NUMBER,
  TY_TEXT,
  TY_DATE,
  formula
} from '@sigmacomputing/sling';

import type { ConstVal, ValueType } from '@sigmacomputing/sling';

import type {
  BooleanColumn,
  NumberColumn,
  TextColumn,
  DatetimeColumn,
  VariantColumn,
  ValueColumn,
  ValueColumnCell,
  ValueColumnData
} from 'types';

const MODE_INVALID = 0;
const MODE_VALUE = 1;
const MODE_NULL = 2;
const MODE_MULTI = 3;

export const EMPTY_VALUE_CELL: ValueColumnCell = [null, 1, false];

export type ApiCell = [?string, ?number, ?number];

export type ApiColumn = {|
  typ: ValueType,
  cells: Array<ApiCell>
|};

export function fromApiColumn(c: ApiColumn): ValueColumn {
  switch (c.typ) {
    case 'boolean':
      return mkBooleanColumn(c.cells);
    case 'number':
      return mkNumberColumn(c.cells);
    case 'datetime':
      return mkDatetimeColumn(c.cells);
    case 'variant':
      return mkVariantColumn(c.cells);
    case 'error':
    case 'text':
      return mkTextColumn(c.cells);
    default:
      throw new Error(`Unexpected type: ${c.typ}`);
  }
}

function mkBooleanColumn(cells: Array<ApiCell>): BooleanColumn {
  const l = cells.length;
  const c = {
    type: 'boolean',
    data: new Uint8Array(l),
    mode: new Uint8Array(l),
    count: new Uint32Array(l),
    length: l
  };

  for (let i = 0; i < l; ++i) {
    const [val, count, multi] = cells[i];
    c.count[i] = count || 1;

    if (multi === 1) {
      c.mode[i] = MODE_MULTI;
    } else if (val === 'true') {
      c.mode[i] = MODE_VALUE;
      c.data[i] = 1;
    } else if (val === 'false') {
      c.mode[i] = MODE_VALUE;
      c.data[i] = 0;
    } else {
      c.mode[i] = MODE_NULL;
    }
  }
  return c;
}

function mkNumberColumn(cells: Array<ApiCell>): NumberColumn {
  const l = cells.length;
  const c = {
    type: 'number',
    data: new Float64Array(l),
    mode: new Uint8Array(l),
    count: new Uint32Array(l),
    length: l
  };

  for (var i = 0; i < l; ++i) {
    const [val, count, multi] = cells[i];
    c.count[i] = count || 1;

    if (multi === 1) {
      c.mode[i] = MODE_MULTI;
    } else {
      const n = parseFloat(val);
      if (isNaN(n)) {
        c.mode[i] = MODE_NULL;
      } else {
        c.mode[i] = MODE_VALUE;
        c.data[i] = n;
      }
    }
  }
  return c;
}

function mkTextColumn(cells: Array<ApiCell>): TextColumn {
  const l = cells.length;
  const c = {
    type: 'text',
    data: new Array(l),
    mode: new Uint8Array(l),
    count: new Uint32Array(l),
    length: l
  };

  for (var i = 0; i < l; ++i) {
    const [val, count, multi] = cells[i];
    c.count[i] = count || 1;

    if (multi === 1) {
      c.mode[i] = MODE_MULTI;
    } else if (val == null) {
      c.mode[i] = MODE_NULL;
    } else {
      c.mode[i] = MODE_VALUE;
      c.data[i] = val;
    }
  }
  return c;
}

function mkDatetimeColumn(cells: Array<ApiCell>): DatetimeColumn {
  const l = cells.length;
  const c = {
    type: 'datetime',
    data: new Float64Array(l),
    mode: new Uint8Array(l),
    count: new Uint32Array(l),
    length: l
  };

  for (var i = 0; i < l; ++i) {
    const [val, count, multi] = cells[i];
    c.count[i] = count || 1;

    if (multi === 1) {
      c.mode[i] = MODE_MULTI;
    } else {
      const m = moment.utc(val);
      if (m.isValid()) {
        c.mode[i] = MODE_VALUE;
        c.data[i] = m.valueOf();
      } else {
        c.mode[i] = MODE_NULL;
      }
    }
  }
  return c;
}

function mkVariantColumn(cells: Array<ApiCell>): VariantColumn {
  const l = cells.length;
  const c = {
    type: 'variant',
    data: new Array(0), // Not used
    mode: new Uint8Array(l),
    count: new Uint32Array(l),
    length: l
  };
  for (var i = 0; i < l; ++i) {
    const [, count, multi] = cells[i];
    c.count[i] = count || 1;

    if (multi === 1) {
      c.mode[i] = MODE_MULTI;
    } else {
      c.mode[i] = MODE_NULL; // Never a value, for now
    }
  }
  return c;
}

export function getCell(c: ValueColumn, i: number): ValueColumnCell {
  return [getData(c, i), getCount(c, i), getMulti(c, i)];
}

export function getData(c: ValueColumn, i: number): ?ValueColumnData {
  const mode = c.mode[i];
  invariant(mode !== MODE_INVALID, 'mode is invalid');

  if (mode === MODE_VALUE) {
    const data = c.data[i];
    if (c.type === TY_LOGICAL) {
      return !!data; // the serialized value should be truthy
    } else {
      return data;
    }
  } else {
    return null;
  }
}

export function getConstVal(c: ValueColumn, i: number): ConstVal {
  const data = getData(c, i);
  if (data == null) {
    return formula.nullVal();
  }

  if (typeof data === 'boolean') {
    invariant(c.type === TY_LOGICAL, 'expected type: logical');
    return formula.boolVal(data);
  } else if (typeof data === 'string') {
    invariant(c.type === TY_TEXT, 'expected type: text');
    return formula.strVal(data);
  } else if (typeof data === 'number') {
    if (c.type === TY_NUMBER) {
      return formula.numVal(data);
    } else if (c.type === TY_DATE) {
      const d = new Date(data); // expected to be millis
      return formula.datetimeVal(d.toISOString());
    }
  }

  throw new Error(`Unexpected value and type ${data}:${c.type}`);
}

export function getCount(c: ValueColumn, i: number): number {
  const count = c.count[i];
  invariant(count !== 0, 'count cannot be zero');
  return count;
}

export function setCount(c: ValueColumn, i: number, v: number) {
  invariant(v !== 0, 'count cannot be zero');
  c.count[i] = v;
}

export function getMulti(c: ValueColumn, i: number): boolean {
  const mode = c.mode[i];
  invariant(mode !== MODE_INVALID, 'mode is invalid');
  return c.mode[i] === MODE_MULTI;
}

// remove the last row in-place
export function popValueColumn(c: ValueColumn) {
  c.length -= 1;
  c.data = (c.data.slice(0, c.length): any);
  c.mode = (c.mode.slice(0, c.length): any);
  c.count = (c.count.slice(0, c.length): any);
}

// remove the first row in-place
export function shiftValueColumn(c: ValueColumn) {
  c.length -= 1;
  c.data = (c.data.slice(1): any);
  c.mode = (c.mode.slice(1): any);
  c.count = (c.count.slice(1): any);
}

export function mergeValueColumns(
  prevData: ValueColumn,
  toMerge: ValueColumn,
  grouped: boolean
): ValueColumn {
  if (prevData.type !== toMerge.type) {
    throw new Error(
      `Unable to merge mismatched types ${prevData.type} != ${toMerge.type}`
    );
  }

  const mergeLast =
    grouped && getData(toMerge, 0) === getData(prevData, prevData.length - 1);
  const totLength = prevData.length + toMerge.length;
  const arrLength = totLength - (mergeLast ? 1 : 0);

  const mode = new Uint8Array(arrLength);
  const count = new Uint32Array(arrLength);

  let data = null;
  switch (prevData.type) {
    case 'boolean':
      data = new Uint8Array(arrLength);
      break;
    case 'number':
    case 'datetime':
      data = new Float64Array(arrLength);
      break;
    case 'text':
      data = new Array(arrLength);
      break;
    default:
      throw new Error(`Unexpected column type ${prevData.type}`);
  }

  const c: ValueColumn = ({
    type: prevData.type,
    data: data,
    mode: mode,
    count: count,
    length: count.length
  }: any);

  for (let i = 0; i < totLength; ++i) {
    if (i < prevData.length) {
      c.mode[i] = prevData.mode[i];
      c.count[i] = prevData.count[i];
      c.data[i] = (prevData.data[i]: any);
    } else {
      const iMerge = i - prevData.length;

      // check the mode and update the count
      if (iMerge === 0 && mergeLast) {
        invariant(
          c.mode[i - 1] === toMerge.mode[0],
          'found mismatched modes when merging rows'
        );
        c.count[i - 1] += toMerge.count[0];
      } else {
        const j = mergeLast ? i - 1 : i;
        c.mode[j] = toMerge.mode[iMerge];
        c.count[j] = toMerge.count[iMerge];
        c.data[j] = (toMerge.data[iMerge]: any);
      }
    }
  }
  return c;
}



// WEBPACK FOOTER //
// ./src/utils/column.js