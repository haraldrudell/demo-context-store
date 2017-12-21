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
import { GroupHeader } from './GroupHeader';

type Props = {
  columnOrder: Array<ColumnId>,
  columns: { [ColumnId]: Column },
  labels: { [ColumnId]: string },
  levelId: LevelId,
  isCollapsed: boolean,
  selectedColumns: SelectedColumns,
  addFormulaColumn: LevelId => void,
  canMoveColumn: (Object, Object) => boolean,
  collapseLevel: LevelId => void,
  endDrag: Query => void,
  hideLevel: (LevelId, boolean) => void,
  moveColumn: (Object, Object, boolean) => Query,
  onClick: (SyntheticInputEvent<>, ColumnId, LevelId) => void,
  onContextMenu: (SyntheticMouseEvent<>, ColumnId, LevelId) => void,
  columnTypes?: ColumnTypes,
  sortKeys: Array<SortKey>,
  columnRename: (id: ColumnId, label: string) => void
};

export default function Aggregates(props: Props) {
  const {
    addFormulaColumn,
    canMoveColumn,
    collapseLevel,
    columnOrder,
    columns,
    endDrag,
    hideLevel,
    isCollapsed,
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

  const sortStates = sortKeys.reduce((result, key) => {
    result[key.column] = key;
    return result;
  }, {});
  return (
    <div>
      <GroupHeader
        addColumn={addFormulaColumn}
        collapseLevel={collapseLevel}
        hideLevel={hideLevel}
        isCollapsed={isCollapsed}
        isLevelHidden={false}
        levelId={levelId}
      />
      <Collapsible open={!isCollapsed}>
        <Box px={2}>
          {columnOrder.length === 0 && (
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
      </Collapsible>
    </div>
  );
}



// WEBPACK FOOTER //
// ./src/components/ColumnView/Group/Aggregates.js