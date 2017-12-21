// @flow
import { formula } from '@sigmacomputing/sling';
import type { ColumnId, LevelId, Query } from '@sigmacomputing/sling';

import { captureException } from 'utils/errors';
import { publish } from 'utils/events';
import { mkColSelection } from 'utils/selection';
import type { Selection } from 'types';

export function canCreateGroup(
  query: Query,
  fromLevelId: LevelId,
  fromColumnId: ColumnId,
  toLevelId: LevelId
): boolean {
  const toLevelIdx = query.getLevelIdx(toLevelId);
  const fromLevelIdx = query.getLevelIdx(fromLevelId);

  if (fromLevelIdx === toLevelIdx || fromLevelIdx - 1 === toLevelIdx) {
    if (query.columns[fromColumnId].isGrouped) {
      const fromGroup = query.getGroupLevel(fromLevelId);
      if (fromGroup.keys.length === 1) {
        // Creating a new group directly above or below the current group has
        // no effect. It looks like we're moving the group up or down, but the
        // result looks the same as what we started with.
        return false;
      }
    }
  }

  const sourceLevelId = query.findColumnLevel(fromColumnId);
  const sourceLevelIdx = query.getLevelIdx(sourceLevelId);
  // Cannot create a key below where the column is defined
  if (toLevelIdx < sourceLevelIdx) {
    return false;
  }

  return true;
}

function removeKey(query, fromLevelId, fromColumnId, toLevelId) {
  const fromGroup = query.getGroupLevel(fromLevelId);
  if (fromGroup.keys.length === 1) {
    if (fromGroup.columns.length > 0) {
      // TODO: Need to check if we move the columns to a level where its key exist
      // we should probably remove that key

      // Since we're going to delete the group we should move all the columns with the key
      query.moveColumns(fromGroup.columns, fromLevelId, toLevelId);
    }

    query.deleteGroup(fromLevelId);
  } else {
    query.dropGroupKeys([fromColumnId], fromLevelId);
  }
}

export function createGroup(
  query: Query,
  fromLevelId: LevelId,
  fromColumnId: ColumnId,
  toLevelId: LevelId
) {
  try {
    const { columns } = query;
    if (columns[fromColumnId].isGrouped) {
      removeKey(query, fromLevelId, fromColumnId, toLevelId);
    }
    query.createGroup([fromColumnId], toLevelId);
  } catch (e) {
    captureException(e, {
      query,
      fromLevelId,
      fromColumnId,
      toLevelId
    });
  }
}

export function canMoveColumn(
  query: Query,
  fromProps: Object,
  toProps: Object
): boolean {
  const {
    id: fromColumnId,
    levelId: fromLevelId,
    isGroupKey: dragIsKey
  } = fromProps;
  const {
    id: toColumnId,
    levelId: toLevelId,
    isGroupKey: targetIsKey
  } = toProps;

  // Cannot move to same location
  if (fromColumnId === toColumnId && toLevelId === fromLevelId) {
    return false;
  }

  if (dragIsKey && query.levelIdxIsGroup(fromLevelId)) {
    const fromLevel = query.getGroupLevel(fromLevelId);
    const index = fromLevel.keys.indexOf(fromColumnId);
    const beforeColumnId = fromLevel.keys[index - 1];
    // Cannot move to same location
    // We check TargetIsKey to determine if we're dragging to top of the aggregate section
    if (
      beforeColumnId === toColumnId &&
      toLevelId === fromLevelId &&
      targetIsKey
    ) {
      return false;
    }

    // Cannot move KeyColumn to Non-Key on the same level if its the only key
    if (
      !targetIsKey &&
      fromLevel.keys.length === 1 &&
      toLevelId === fromLevelId
    ) {
      return false;
    }
  } else {
    const fromLevel = query.getLevel(fromLevelId);
    const index = fromLevel.columns.indexOf(fromColumnId);
    const beforeColumnId = fromLevel.columns[index - 1];
    // Cannot move to same location
    if (beforeColumnId === toColumnId && toLevelId === fromLevelId) {
      return false;
    }
  }

  const toLevelIdx = query.getLevelIdx(toLevelId);
  const fromSourceLevelId = query.findColumnLevel(fromColumnId);
  const fromSourceLevelIdx = query.getLevelIdx(fromSourceLevelId);
  // We cannot add a key to a group below where the column is defined
  if (targetIsKey && toLevelIdx <= fromSourceLevelIdx) {
    return false;
  }

  return true;
}

function moveLevel(
  query: Query,
  _fromLevelId: LevelId,
  fromColumnId: ColumnId,
  toLevelId: LevelId,
  targetIsKey: boolean
) {
  let fromLevelId = _fromLevelId;
  if (query.columns[fromColumnId].isGrouped) {
    removeKey(query, fromLevelId, fromColumnId, toLevelId);
    // If fromColumnId is the only grouping key we have destroyed fromLevelId.
    fromLevelId = undefined;
  }

  try {
    // Since we removed the key the toLevelIdx could have changed
    if (targetIsKey) {
      query.addGroupKeys([fromColumnId], toLevelId);
    } else {
      const toLevelIdx = query.getLevelIdx(toLevelId);
      const fromSourceLevelId = query.findColumnLevel(fromColumnId);
      const fromSourceLevelIdx = query.getLevelIdx(fromSourceLevelId);
      if (toLevelIdx !== fromSourceLevelIdx) {
        query.moveColumns([fromColumnId], fromSourceLevelIdx, toLevelIdx);
      }
    }
  } catch (e) {
    captureException(e, {
      query,
      fromLevelId,
      fromColumnId,
      toLevelId,
      targetIsKey
    });
  }
}

export function moveColumn(query: Query, fromProps: Object, toProps: Object) {
  const {
    id: fromColumnId,
    levelId: fromLevelId,
    isGroupKey: dragIsKey
  } = fromProps;
  const {
    id: toColumnId,
    levelId: toLevelId,
    isGroupKey: targetIsKey
  } = toProps;

  // We aren't at the same group so move to that group or we are moving current key to non key
  if (fromLevelId !== toLevelId || (dragIsKey && !targetIsKey)) {
    moveLevel(query, fromLevelId, fromColumnId, toLevelId, targetIsKey);
  }

  try {
    if (targetIsKey) {
      query.reorderGroupKeys(toLevelId, [fromColumnId], toColumnId);
    } else {
      query.reorderColumns(toLevelId, [fromColumnId], toColumnId);
    }
  } catch (e) {
    captureException(e, {
      query,
      toLevelId,
      fromColumnId,
      toColumnId
    });
  }
}

function copyColumnPrep(
  query: Query,
  fromProps: Object,
  toProps: Object,
  fromColType: ?string,
  newGroup?: boolean
) {
  const moveUp =
    newGroup ||
    query.getLevelIdx(toProps.levelId) > query.getLevelIdx(fromProps.levelId);
  let label;
  let newFormula;

  if (moveUp) {
    const operation = fromColType === 'number' ? 'Sum' : 'Count';
    const args = [formula.nameRef([fromProps.id, undefined])];
    newFormula = formula.callOp(operation, args);
    label = `${fromProps.label} - ${operation}`;
  } else {
    label = fromProps.label;
    newFormula = formula.nameRef([fromProps.id, undefined]);
  }
  return { label, newFormula };
}

export function copyColumn(
  query: Query,
  fromProps: Object,
  toProps: Object,
  fromColType: ?string,
  onSelectColumns: Selection => void
) {
  publish('Column/Duplicate');
  const toLevelId = toProps.levelId;
  const { label, newFormula } = copyColumnPrep(
    query,
    fromProps,
    toProps,
    fromColType
  );
  const newColumnId = query.addFormulaColumn(toLevelId, label, newFormula);
  query.reorderColumns(toLevelId, [newColumnId], toProps.id);
  onSelectColumns(mkColSelection(newColumnId));
  return query;
}



// WEBPACK FOOTER //
// ./src/components/ColumnView/moveUtils.js