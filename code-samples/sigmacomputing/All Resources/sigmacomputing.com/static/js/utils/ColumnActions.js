// @flow
import { cloneDeep } from 'lodash';
import invariant from 'invariant';
import { formula, Query } from '@sigmacomputing/sling';
import type {
  Format,
  Formula,
  ColumnId,
  Id,
  LevelId,
  LevelIdx,
  ValueType,
  ConstVal
} from '@sigmacomputing/sling';

import type { ColumnFilterType, SelectedColumns, Selection } from 'types';
import { publish } from 'utils/events';
import newColumnIterator from 'utils/iterator';
import { mkColSelection } from 'utils/selection';

type SelectColumns = Selection => void;
type DeselectColumns = (Array<Id>) => void;
type SortKeys = Array<{|
  column: string,
  isAsc: boolean
|}>;

export function columnFormat(
  inputQuery: Query,
  selectedColumns: SelectedColumns,
  fmt: Format
) {
  publish('Column/Format');
  const query = cloneDeep(inputQuery);
  Object.keys(selectedColumns).forEach(colId => {
    query.columnFormatSet(colId, fmt);
  });
  return query;
}

function asc(column) {
  return { column, isAsc: true };
}

function desc(column) {
  return { column, isAsc: false };
}

function findLowestColumn(columnIds: Array<Id>, query: Query) {
  let columnIterator = newColumnIterator(query, true);
  let column = columnIterator.next();

  while (!column.done) {
    if (columnIds.includes(column.value.columnId)) {
      return column.value;
    } else {
      column = columnIterator.next();
    }
  }
  return;
}

function _addColumn(
  newColumnId: Id,
  query: Query,
  levelIdx: LevelIdx,
  onSelectColumns: SelectColumns,
  columnId: ?Id,
  prefix?: string = 'New Column'
): Query {
  publish('AddColumn');
  const level = query.getLevel(levelIdx);

  query.columnLabelSet(newColumnId, prefix);
  if (columnId) {
    // if they added from a group key column, just make it the first computed column
    const afterId = level.columns.includes(columnId) ? columnId : undefined;
    // move the new column to be after the referenced column
    query.reorderColumns(levelIdx, [newColumnId], afterId);
  }
  // select the newly added column
  onSelectColumns(mkColSelection(newColumnId));
  return query;
}

export function addColumn(
  inputQuery: Query,
  levelIdx: LevelIdx,
  onSelectColumns: SelectColumns,
  columnIds: Array<Id>
): Query {
  const query = cloneDeep(inputQuery);
  let newColumnId;

  // if user clicked plus button (no columns selected)
  if (!columnIds.length) {
    newColumnId = query.addFormulaColumn(levelIdx);
    return _addColumn(newColumnId, query, levelIdx, onSelectColumns, null);
  }

  const lowestSelectedColumn = findLowestColumn(columnIds, query);
  invariant(
    lowestSelectedColumn,
    'Could not determine lowest selected column in selected column ids'
  );
  newColumnId = query.addFormulaColumn(lowestSelectedColumn.levelId);
  return _addColumn(
    newColumnId,
    query,
    lowestSelectedColumn.levelId,
    onSelectColumns,
    lowestSelectedColumn.columnId
  );
}

export function duplicateColumn(
  inputQuery: Query,
  levelIdx: LevelIdx,
  onSelectColumns: SelectColumns,
  columnId: Id
): Query {
  let query = cloneDeep(inputQuery);
  const newColumnId = query.addFormulaColumn(levelIdx);

  const label = query.view.labels[columnId];
  query = _addColumn(
    newColumnId,
    query,
    levelIdx,
    onSelectColumns,
    columnId,
    label
  );

  const { def } = query.getColumn(columnId);
  query.getColumn(newColumnId).def = cloneDeep(def);

  return query;
}

export function deleteColumn(inputQuery: Query, columnIds: Array<Id>): Query {
  publish('DeleteColumn');
  const query = cloneDeep(inputQuery);
  columnIds.forEach(colId => {
    const column = findLowestColumn([colId], query);
    invariant(column, 'Could not find this column in the worksheet');
    query.deleteColumn(colId, column.levelId);
  });
  return query;
}

export function hideColumn(
  inputQuery: Query,
  columnIds: Array<Id>,
  onDeselectColumns: DeselectColumns
): Query {
  publish('HideColumn');
  const query = cloneDeep(inputQuery);
  columnIds.forEach(colId => {
    query.columnHideToggle(colId);
  });
  onDeselectColumns(columnIds);
  return query;
}

export function setFormula(
  inputQuery: Query,
  columnId: ColumnId,
  formula: Formula
): Query {
  const query = cloneDeep(inputQuery);
  query.setColumnFormula(columnId, formula);
  return query;
}

export function addFilter(
  inputQuery: Query,
  colType: ?ValueType,
  columnId: Id
): Query {
  if (colType === 'number' || colType === 'datetime') {
    return setRangeFilter(inputQuery, columnId);
  } else {
    return setValueFilter(inputQuery, columnId);
  }
}

export function setRangeFilter(
  inputQuery: Query,
  columnId: ColumnId,
  min: ?ConstVal,
  max: ?ConstVal,
  includeNulls: boolean = true
): Query {
  publish('FilterColumn');
  const query = cloneDeep(inputQuery);
  query.setRangeFilter(columnId, min, max, includeNulls);
  return query;
}

export function setValueFilter(
  inputQuery: Query,
  columnId: ColumnId,
  include: boolean = false,
  values: Array<ConstVal> = []
): Query {
  publish('FilterColumn');
  const query = cloneDeep(inputQuery);
  if (include) {
    query.setIncludeFilter(columnId, values);
  } else {
    query.setExcludeFilter(columnId, values);
  }
  return query;
}

export function deleteFilter(inputQuery: Query, columnId: ColumnId): Query {
  const query = cloneDeep(inputQuery);
  query.clearFilter(columnId);
  return query;
}

export function filter(
  inputQuery: Query,
  colType: ?ValueType,
  columnId: Id,
  newFilterType: ?ColumnFilterType
): Query {
  publish('FilterColumn');
  const query = cloneDeep(inputQuery);
  if (
    newFilterType === 'range' ||
    (!newFilterType && (colType === 'number' || colType === 'datetime'))
  ) {
    // min and max will be reset from NumericRange; we need the fetched range to determine them
    query.setRangeFilter(
      columnId,
      undefined,
      undefined,
      true // include nulls
    );
  } else {
    query.setExcludeFilter(columnId, []);
  }
  return query;
}

export function sortColumnAsc(
  inputQuery: Query,
  levelIdx: LevelIdx,
  columnId: Id
): Query {
  publish('SortColumnAsc');
  const query = cloneDeep(inputQuery);
  query.setLevelSort(levelIdx, [asc(columnId)]);
  return query;
}

export function sortColumnDesc(
  inputQuery: Query,
  levelIdx: LevelIdx,
  columnId: Id
): Query {
  publish('SortColumnDesc');
  const query = cloneDeep(inputQuery);
  query.setLevelSort(levelIdx, [desc(columnId)]);
  return query;
}

export function multiSort(
  inputQuery: Query,
  levelIdx: LevelIdx,
  sortKeys: SortKeys
): Query {
  publish('MultiSort');
  const query = cloneDeep(inputQuery);
  query.setLevelSort(levelIdx, sortKeys);
  return query;
}

export function addDateModifiedColumn(
  inputQuery: Query,
  columnId: Id,
  levelIdx: LevelIdx,
  selectColumns: SelectColumns,
  part: string,
  operation: string,
  fmt?: Format
): Query {
  publish('AddModifiedDateColumn');
  const query = cloneDeep(inputQuery);
  const label = query.view.labels[columnId];
  const prefix = label && `${label} - ${part}`;

  const newColumnId = query.addFormulaColumn(levelIdx);
  const newQuery = _addColumn(
    newColumnId,
    query,
    levelIdx,
    selectColumns,
    columnId,
    prefix
  );

  const args = [
    formula.literal(formula.strVal(part)),
    formula.nameRef([columnId, undefined])
  ];

  const newFormula = formula.callOp(operation, args);
  if (newColumnId && newFormula) {
    newQuery.setColumnFormula(newColumnId, newFormula);
  }
  if (newColumnId && fmt && fmt.type === 'datetime') {
    newQuery.columnFormatSet(newColumnId, fmt);
  }
  return newQuery;
}

export function addAggregateColumn(
  inputQuery: Query,
  columnId: Id,
  levelId: LevelIdx,
  selectColumns: SelectColumns,
  op: string
) {
  publish('AddAggregateColumn');
  const query = cloneDeep(inputQuery);

  const label = query.view.labels[columnId];
  const opName = `${op.charAt(0).toUpperCase()}${op.slice(1)}`;
  const prefix = label && `${label} - ${opName}`;

  const curLevelIdx = query.getLevelIdx(levelId);
  const levelAbove = query.getLevel(curLevelIdx + 1);
  const newColumnId = query.addFormulaColumn(levelAbove.id);
  const newQuery = _addColumn(
    newColumnId,
    query,
    levelAbove.id,
    selectColumns,
    columnId,
    prefix
  );

  const args = [formula.nameRef([columnId, undefined])];
  const newFormula = formula.callOp(op, args);

  if (newColumnId && newFormula) {
    newQuery.setColumnFormula(newColumnId, newFormula);
  }
  return newQuery;
}

function _valFilter(
  include: boolean,
  inputQuery: Query,
  columnId: Id,
  val: ConstVal
) {
  publish('FilterColumn');
  const query = cloneDeep(inputQuery);
  if (include) {
    query.setIncludeFilter(columnId, [val]);
  } else {
    query.setExcludeFilter(columnId, [val]);
  }
  return query;
}

export function includeFilter(inputQuery: Query, columnId: Id, val: ConstVal) {
  return _valFilter(true, inputQuery, columnId, val);
}

export function excludeFilter(inputQuery: Query, columnId: Id, val: ConstVal) {
  return _valFilter(false, inputQuery, columnId, val);
}

export function collapse(inputQuery: Query, levelId: LevelId) {
  publish('Collapse');
  const query = cloneDeep(inputQuery);

  // collapse any lower level that is currently expanded
  const levelIdx = query.getLevelIdx(levelId);
  for (let i = levelIdx - 1; i >= 0; i--) {
    if (!query.getLevel(i).isCollapsed) {
      query.levelCollapseToggle(i);
    }
  }
  return query;
}

export function expand(inputQuery: Query, levelId: LevelId) {
  publish('Expand');
  const query = cloneDeep(inputQuery);

  // Expand the level below
  const levelIdx = query.getLevelIdx(levelId);

  const childLevel = query.getLevel(levelIdx - 1);
  if (childLevel.isCollapsed) {
    query.levelCollapseToggle(levelIdx - 1);
  }
  return query;
}

export function columnRename(inputQuery: Query, columnId: Id, label: string) {
  publish('RenameColumn');
  const query = cloneDeep(inputQuery);
  query.columnLabelSet(columnId, label);
  return query;
}



// WEBPACK FOOTER //
// ./src/utils/ColumnActions.js