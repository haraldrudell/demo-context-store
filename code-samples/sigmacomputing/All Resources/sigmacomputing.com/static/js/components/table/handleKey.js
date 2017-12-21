// @flow
import type { Query, Anchor } from '@sigmacomputing/sling';

import type { Selection } from 'types';
import {
  canCollapse,
  canExpand,
  collapseAndAnchor,
  expandAndAnchor
} from 'utils/table';
import layoutColumns from './layout';
import type { TableData } from './tableData';

type KeyResult = {
  query: Query,
  selection: Selection,
  anchor?: ?Anchor
};

export function isArrowKey(key: string): boolean {
  switch (key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft':
      return true;
    default:
      return false;
  }
}

function selectColumn({ id }): Selection {
  return {
    type: 'column',
    selectedColumns: { [id]: true },
    rangeAnchor: id
  };
}

function handleArrow(
  key: string,
  selection: Selection,
  query: Query,
  tableData: TableData
): Selection {
  const { columns } = layoutColumns(query);

  if (
    selection.type === 'column' &&
    Object.keys(selection.selectedColumns).length === 1
  ) {
    const { selectedColumns = {} } = selection;
    const idx = columns.findIndex(x => selectedColumns[x.id]);
    if (key === 'ArrowRight' && idx >= 0 && idx < columns.length - 1) {
      // select next column
      return selectColumn(columns[idx + 1]);
    } else if (key === 'ArrowLeft' && idx > 0) {
      // select previous column
      return selectColumn(columns[idx - 1]);
    }
  } else if (selection.type === 'cell') {
    const { columnId, flatOffset } = selection;

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      const newOffset =
        key === 'ArrowUp'
          ? tableData.getFlatOffsetBefore(columnId, flatOffset)
          : tableData.getFlatOffsetAfter(columnId, flatOffset);

      if (newOffset !== null) {
        return { ...selection, flatOffset: newOffset };
      }
    } else {
      const idx = columns.findIndex(x => x.id === columnId);
      if (key === 'ArrowRight' && idx >= 0 && idx < columns.length - 1) {
        return { ...selection, columnId: columns[idx + 1].id };
      } else if (key === 'ArrowLeft' && idx > 0) {
        return { ...selection, columnId: columns[idx - 1].id };
      }
    }
  }

  // no selection change
  return selection;
}

export function handleKey(
  key: string,
  selection: Selection,
  query: Query,
  tableData: TableData
): KeyResult {
  if (isArrowKey(key)) {
    return {
      query: query,
      selection: handleArrow(key, selection, query, tableData)
    };
  } else if (key === 'Escape' && selection.type !== 'none') {
    return { query, selection: { type: 'none' } };
  } else if ((key === '+' || key === '-') && selection.type === 'cell') {
    const { columnId, levelId, flatOffset } = selection;
    // TODO: preserve selection across collapse / expand
    if (key === '+' && canExpand(query, levelId)) {
      const r = expandAndAnchor(
        query,
        tableData,
        columnId,
        levelId,
        flatOffset
      );
      return { query: r.query, selection, anchor: r.anchor };
    } else if (key === '-' && canCollapse(query, levelId)) {
      const r = collapseAndAnchor(
        query,
        tableData,
        columnId,
        levelId,
        flatOffset
      );
      return { query: r.query, selection, anchor: r.anchor };
    }
  }

  // no change
  return { query, selection };
}



// WEBPACK FOOTER //
// ./src/components/table/handleKey.js