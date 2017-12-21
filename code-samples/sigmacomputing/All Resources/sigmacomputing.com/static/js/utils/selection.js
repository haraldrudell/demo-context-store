// @flow
import type { Id, Selection, SelectedColumns } from 'types';
import type { Query } from '@sigmacomputing/sling';
import newColumnIterator from './iterator';

// XXX: temporary conversion function
function m(ids: Array<Id>): SelectedColumns {
  const r = {};
  ids.forEach(id => {
    r[id] = true;
  });
  return r;
}

export const EMPTY_SELECTION = { type: 'none' };

export function mkColSelection(id: Id): Selection {
  return {
    type: 'column',
    selectedColumns: { [id]: true },
    rangeAnchor: id
  };
}

export function mkCellSelection(columnId: Id, levelId: Id, flatOffset: number) {
  return {
    type: 'cell',
    columnId,
    levelId,
    flatOffset
  };
}

function selectWithMetaKey(
  selectedColumns: Array<Id>,
  columnId: Id
): Selection {
  if (!selectedColumns.includes(columnId)) {
    return {
      type: 'column',
      selectedColumns: m(selectedColumns.concat(columnId)),
      rangeAnchor: columnId
    };
  }
  return {
    type: 'column',
    selectedColumns: m(selectedColumns.filter(id => id !== columnId)),
    rangeAnchor: undefined
  };
}

function selectWithShiftKey(
  columnId: Id,
  query: Query,
  rangeAnchor?: ?Id
): Selection {
  if (!rangeAnchor || rangeAnchor === columnId) {
    return mkColSelection(columnId);
  }

  const newSelection = [];
  let inRange = false;
  let columnIterator = newColumnIterator(query);
  let column = columnIterator.next();

  while (!column.done) {
    if (
      column.value.columnId === columnId ||
      column.value.columnId === rangeAnchor
    ) {
      newSelection.push(column.value.columnId);
      inRange = !inRange;
    } else if (inRange) {
      newSelection.push(column.value.columnId);
    }
    column = columnIterator.next();
  }

  return {
    type: 'column',
    selectedColumns: m(newSelection),
    rangeAnchor
  };
}

export function selectColumns(
  evt: SyntheticInputEvent<>,
  selection: Selection,
  columnId: Id,
  query: Query
): Selection {
  if (selection && selection.selectedColumns) {
    if (evt.metaKey) {
      const selectedColumns = Object.keys(selection.selectedColumns);
      return selectWithMetaKey(selectedColumns, columnId);
    } else if (evt.shiftKey) {
      return selectWithShiftKey(columnId, query, selection.rangeAnchor);
    }
  }
  // If no other columns are selected
  return mkColSelection(columnId);
}

export function deselectColumns(
  selection: Selection,
  toDeselect: Array<Id>
): Selection {
  if (selection.type !== 'column') return selection;
  const selectedColumns = selection.selectedColumns || {};
  const newSelection = [];
  let anchor = selection.rangeAnchor;

  for (const columnId in selectedColumns) {
    if (!toDeselect.includes(columnId)) {
      newSelection.push(columnId);
    } else if (anchor === columnId) {
      anchor = undefined;
    }
  }

  if (newSelection.length === 0) return EMPTY_SELECTION;

  return {
    type: 'column',
    selectedColumns: m(newSelection),
    rangeAnchor: anchor
  };
}

// If there is a single column selected, this returns the id
// in all other cases, null is returned
export function getSingleSelectedColumnId(selection: Selection) {
  if (selection.type !== 'column') return null;
  const selectedColumnIds = Object.keys(selection.selectedColumns || {});
  return selectedColumnIds.length === 1 ? selectedColumnIds[0] : null;
}

export function isColumnSelected(selection: Selection, columnId: Id): boolean {
  return Boolean(
    selection &&
      selection.type === 'column' &&
      selection.selectedColumns[columnId]
  );
}

const EMPTY_COLUMNS = {};

export function getSelectedColumns(s: Selection): SelectedColumns {
  return s.type === 'column' ? s.selectedColumns : EMPTY_COLUMNS;
}



// WEBPACK FOOTER //
// ./src/utils/selection.js