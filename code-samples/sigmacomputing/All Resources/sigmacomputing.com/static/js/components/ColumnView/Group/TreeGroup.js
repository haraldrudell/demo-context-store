// @flow

import * as React from 'react';
import type {
  Query,
  ColumnId,
  Column,
  LevelId,
  SortKey
} from '@sigmacomputing/sling';

import { Box, Collapsible } from 'widgets';
import type { SelectedColumns, ColumnTypes } from 'types';
import ColumnDropzone from '../Column/ColumnDropzone';
import DraggableColumn from '../Column/DraggableColumn';
import GroupDropTarget from './GroupDropTarget';
import KeyGroup from './KeyGroup';

type Props = {
  columnOrder: Array<ColumnId>,
  columns: { [ColumnId]: Column },
  labels: { [ColumnId]: string },
  levelId: LevelId,
  keys?: Array<ColumnId>,
  isCollapsed: boolean,
  hasOnlyBaseLevel: boolean,
  selectedColumns: SelectedColumns,
  addFormulaColumn: LevelId => void,
  canCreateGroup: (LevelId, ColumnId, LevelId) => boolean,
  canMoveColumn: (Object, Object) => boolean,
  collapseLevel: LevelId => void,
  createGroup: (LevelId, ColumnId, LevelId) => Query,
  endDrag: Query => void,
  hideLevel: (LevelId, boolean) => void,
  moveColumn: (Object, Object, boolean) => Query,
  onClick: (SyntheticInputEvent<>, ColumnId, LevelId) => void,
  onContextMenu: (SyntheticMouseEvent<>, ColumnId, LevelId) => void,
  columnTypes?: ColumnTypes,
  sortKeys: Array<SortKey>,
  columnRename: (id: ColumnId, label: string) => void
};

export default function TreeGroup(props: Props) {
  const {
    addFormulaColumn,
    canCreateGroup,
    canMoveColumn,
    collapseLevel,
    columnOrder,
    columns,
    createGroup,
    endDrag,
    hideLevel,
    isCollapsed,
    hasOnlyBaseLevel,
    keys,
    labels,
    levelId,
    moveColumn,
    onClick,
    onContextMenu,
    selectedColumns,
    columnTypes = {},
    sortKeys,
    columnRename
  } = props;

  const isKeysHidden =
    !keys || keys.every(columnId => columns[columnId].isHidden);
  const isColumnHidden = columnOrder.every(
    columnId => columns[columnId].isGrouped || columns[columnId].isHidden
  );
  const isLevelHidden = isKeysHidden && isColumnHidden;
  const sortStates = sortKeys.reduce((result, key) => {
    result[key.column] = key;
    return result;
  }, {});
  return (
    <div>
      <GroupDropTarget
        alwaysShow={hasOnlyBaseLevel}
        addColumn={addFormulaColumn}
        canCreateGroup={canCreateGroup}
        collapseLevel={collapseLevel}
        createGroup={createGroup}
        hideLevel={hideLevel}
        isCollapsed={isCollapsed}
        isLevelHidden={isLevelHidden}
        levelId={levelId}
      />
      <Collapsible open={!isCollapsed}>
        <div>
          {keys && (
            <KeyGroup>
              <ul>
                {keys.map((columnId, i) => (
                  <DraggableColumn
                    key={columnId}
                    id={columnId}
                    isTop={i === 0}
                    isLast={i === keys.length - 1}
                    levelId={levelId}
                    label={labels[columnId]}
                    isGroupKey
                    isSource={false}
                    isHidden={columns[columnId].isHidden}
                    isSelected={Boolean(selectedColumns[columnId])}
                    canMoveColumn={canMoveColumn}
                    endDrag={endDrag}
                    moveColumn={moveColumn}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    type={columnTypes[columnId]}
                    sortState={sortStates[columnId]}
                    columnRename={columnRename}
                  />
                ))}
              </ul>
            </KeyGroup>
          )}
          <Box px={2}>
            {keys &&
              columnOrder.length === 0 && (
                <ColumnDropzone
                  canMoveColumn={canMoveColumn}
                  moveColumn={moveColumn}
                  levelId={levelId}
                  text="Drop Calculation Here"
                />
              )}
            {columnOrder.length > 0 && (
              <ul>
                {columnOrder.map((columnId, i) => (
                  <DraggableColumn
                    key={columnId}
                    id={columnId}
                    isTop={i === 0}
                    isLast={i === columnOrder.length - 1}
                    levelId={levelId}
                    isHidden={
                      columns[columnId].isGrouped || columns[columnId].isHidden
                    }
                    isGroupKey={false}
                    isSelected={Boolean(selectedColumns[columnId])}
                    isSource={columns[columnId].isGrouped}
                    label={labels[columnId]}
                    canMoveColumn={canMoveColumn}
                    endDrag={endDrag}
                    moveColumn={moveColumn}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    type={columnTypes[columnId]}
                    sortState={sortStates[columnId]}
                    columnRename={columnRename}
                  />
                ))}
              </ul>
            )}
          </Box>
        </div>
      </Collapsible>
    </div>
  );
}



// WEBPACK FOOTER //
// ./src/components/ColumnView/Group/TreeGroup.js