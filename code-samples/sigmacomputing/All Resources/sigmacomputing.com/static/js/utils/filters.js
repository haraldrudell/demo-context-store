// @flow
import type { Query, ConstVal, PrimitiveType } from '@sigmacomputing/sling';
import { formula } from '@sigmacomputing/sling';
import { isEqual } from 'lodash';

import { setValueFilter } from 'utils/ColumnActions';

export function getNullSetting(query: Query, selectedColumn: string): boolean {
  const filter = query.columns[selectedColumn].filter;
  if (!filter) throw new Error('No matching filter');
  if (filter.type === 'exclude') {
    return Boolean(!filter.values.find((val: ConstVal) => val.type === 'null'));
  } else if (filter.type === 'include') {
    return Boolean(filter.values.find((val: ConstVal) => val.type === 'null'));
  }
  throw new Error('Invalid filter for values');
}

function inValues(values, valueStr, columnType) {
  const v = formula.parseConstVal(valueStr, columnType);
  for (let i = 0; i < values.length; i++) {
    if (isEqual(values[i], v)) return true;
  }
  return false;
}

// for TopK and Boolean Filters
export function onToggleNulls(
  query: Query,
  selectedColumn: string,
  setQuery: Query => void
) {
  const filter = query.columns[selectedColumn].filter;
  if (!filter || (filter.type !== 'include' && filter.type !== 'exclude'))
    throw new Error('Invalid filter for values');

  const includeNulls = !getNullSetting(query, selectedColumn);
  const addNull = includeNulls
    ? filter.type === 'include'
    : filter.type === 'exclude';
  const newValues = addNull
    ? filter.values.concat([formula.nullVal()])
    : filter.values.filter(val => val.type !== 'null');
  setQuery(
    setValueFilter(query, selectedColumn, filter.type === 'include', newValues)
  );
}

// for TopK and Boolean Filters
export function onSelectTopKValue(
  valueStr: string,
  selectedColumn: string,
  columnType: PrimitiveType,
  query: Query,
  setQuery: Query => void
) {
  const { filter } = query.columns[selectedColumn];
  if (!filter) return;

  const values = filter.values || [];
  const v = formula.parseConstVal(valueStr, columnType);

  const newValues = inValues(values, valueStr, columnType)
    ? // value was previously in the include / exclude list.  toggling removes it
      values.filter(x => !isEqual(x, v))
    : values.concat([v]);
  setQuery(
    setValueFilter(query, selectedColumn, filter.type === 'include', newValues)
  );
}



// WEBPACK FOOTER //
// ./src/utils/filters.js