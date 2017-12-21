// @flow

import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import type { ColumnId, LevelId, Query } from '@sigmacomputing/sling';

import type { Selection, ColumnTypes } from 'types';
import {
  isColumnSelected,
  selectColumns,
  deselectColumns,
  getSelectedColumns,
  mkColSelection
} from 'utils/selection';
import ColumnContextMenu from 'components/table/ColumnContextMenu';
import { addColumn, columnRename } from 'utils/ColumnActions';
import { Box } from 'widgets';
import TreeGroup from './Group/TreeGroup';
import Aggregates from './Group/Aggregates';
import {
  canCreateGroup,
  createGroup,
  canMoveColumn,
  moveColumn,
  copyColumn
} from './moveUtils';

export default class ColumnView extends Component<{
  query: Query,
  selection: Selection,
  setSelection: Selection => void,
  setQuery: Object => void,
  columnTypes: ColumnTypes
}> {
  menu: ?ColumnContextMenu;

  selectColumns = (s: Selection) => {
    const { setSelection } = this.props;
    setSelection(s);
  };

  addFormulaColumn = (levelId: LevelId) => {
    const { query, setQuery } = this.props;
    setQuery(
      addColumn(
        query,
        levelId,
        this.selectColumns,
        [] /* selected column ids */
      )
    );
  };

  deselectColumns = (toDeselect: Array<ColumnId>) => {
    const { selection } = this.props;
    const newSelection = deselectColumns(selection, toDeselect);
    this.selectColumns(newSelection);
  };

  hideLevel = (levelId: LevelId, isHidden: boolean) => {
    const { query, setQuery } = this.props;
    const { columns } = query;
    const level = query.getLevel(levelId);
    const groupLevel =
      !query.levelIdxIsBase(levelId) && query.getGroupLevel(levelId);
    const newQuery = cloneDeep(query);

    if (groupLevel && groupLevel.keys) {
      groupLevel.keys.forEach(columnId => {
        const column = columns[columnId];
        if (column.isHidden !== isHidden) {
          newQuery.columnHideToggle(columnId);
        }
      });
    }

    level.columns.forEach(columnId => {
      const column = columns[columnId];
      // Toggle hidden only if not grouped
      if (column.isHidden !== isHidden && !column.isGrouped) {
        newQuery.columnHideToggle(columnId);
      }
    });

    setQuery(newQuery);
    this.deselectColumns(level.columns);
  };

  collapseLevel = (levelId: LevelId) => {
    const { query, setQuery } = this.props;
    const newQuery = cloneDeep(query);
    newQuery.levelToggleHide(levelId);
    setQuery(newQuery);
  };

  canMoveColumn = (fromProps: Object, toProps: Object) => {
    const { query } = this.props;
    return canMoveColumn(query, fromProps, toProps);
  };

  moveColumn = (fromProps: Object, toProps: Object, makeCopy: boolean) => {
    const { query, columnTypes, setSelection } = this.props;
    const newQuery = cloneDeep(query);
    if (makeCopy && !toProps.isGroupKey) {
      const columnType = columnTypes[fromProps.id];
      copyColumn(newQuery, fromProps, toProps, columnType, setSelection);
    } else {
      moveColumn(newQuery, fromProps, toProps);
    }
    return newQuery;
  };

  canCreateGroup = (
    fromLevelId: LevelId,
    fromColumnId: ColumnId,
    toLevelId: LevelId
  ) => {
    const { query } = this.props;
    return canCreateGroup(query, fromLevelId, fromColumnId, toLevelId);
  };

  createGroup = (
    fromLevelId: LevelId,
    fromColumnId: ColumnId,
    toLevelId: LevelId
  ) => {
    const { query } = this.props;
    const newQuery = cloneDeep(query);
    createGroup(newQuery, fromLevelId, fromColumnId, toLevelId);
    return newQuery;
  };

  onColumnClick = (e: SyntheticInputEvent<>, columnId: ColumnId) => {
    const { selection, query } = this.props;

    if (!isColumnSelected(selection, columnId)) {
      const newSelection = selectColumns(e, selection, columnId, query);
      this.selectColumns(newSelection);
    }
  };

  endDrag = (newQuery: Query) => {
    const { setQuery } = this.props;
    // XXX: We want to setQuery only after we finish dragging
    // ReactDnD seems to call canDrop everytime the structure changes
    setQuery(newQuery);
  };

  setMenuRef = (r: ?ColumnContextMenu) => {
    this.menu = r;
  };

  onContextMenu = (
    e: SyntheticMouseEvent<>,
    columnId: ColumnId,
    levelId: LevelId
  ) => {
    const { selection, query } = this.props;

    const selectedColumns = getSelectedColumns(selection);

    if (
      !selectedColumns[columnId] &&
      (!query.columns[columnId].isHidden || levelId)
    ) {
      this.selectColumns(mkColSelection(columnId));
    }
    if (this.menu) this.menu.onContextMenu(e, columnId, levelId);
  };

  columnRename = (columnId: ColumnId, label: string) => {
    const { query, setQuery } = this.props;
    const newQuery = columnRename(query, columnId, label);
    setQuery(newQuery);
  };

  render() {
    const { selection, query, setQuery, columnTypes } = this.props;
    const { columns, levels, base, view, global } = query;
    const selectedColumns = getSelectedColumns(selection);
    const collapseStatus = view.levelHidden || {};

    return (
      <Box
        css={`
          position: relative;
          overflow-y: auto;
        `}
        flexGrow
        p={3}
      >
        <Aggregates // Global Group
          columns={columns}
          columnOrder={global.columns}
          isCollapsed={collapseStatus[global.id]}
          levelId={global.id}
          sortKeys={global.sortKeys}
          labels={view.labels}
          selectedColumns={selectedColumns}
          addFormulaColumn={this.addFormulaColumn}
          canMoveColumn={this.canMoveColumn}
          collapseLevel={this.collapseLevel}
          endDrag={this.endDrag}
          hideLevel={this.hideLevel}
          moveColumn={this.moveColumn}
          onClick={this.onColumnClick}
          onContextMenu={this.onContextMenu}
          columnTypes={columnTypes}
          columnRename={this.columnRename}
        />
        {levels
          .slice()
          .reverse()
          .map(group => (
            <TreeGroup
              key={group.id}
              columns={columns}
              labels={view.labels}
              levelId={group.id}
              isCollapsed={collapseStatus[group.id]}
              columnOrder={group.columns}
              keys={group.keys}
              hasOnlyBaseLevel={false}
              selectedColumns={selectedColumns}
              sortKeys={group.sortKeys}
              addFormulaColumn={this.addFormulaColumn}
              canCreateGroup={this.canCreateGroup}
              canMoveColumn={this.canMoveColumn}
              collapseLevel={this.collapseLevel}
              createGroup={this.createGroup}
              endDrag={this.endDrag}
              hideLevel={this.hideLevel}
              moveColumn={this.moveColumn}
              onClick={this.onColumnClick}
              onContextMenu={this.onContextMenu}
              columnTypes={columnTypes}
              columnRename={this.columnRename}
            />
          ))}
        <TreeGroup // Base Group
          columns={columns}
          columnOrder={base.columns}
          isCollapsed={collapseStatus[base.id]}
          levelId={base.id}
          sortKeys={base.sortKeys}
          labels={view.labels}
          hasOnlyBaseLevel={levels.length === 0}
          selectedColumns={selectedColumns}
          addFormulaColumn={this.addFormulaColumn}
          canCreateGroup={this.canCreateGroup}
          canMoveColumn={this.canMoveColumn}
          collapseLevel={this.collapseLevel}
          createGroup={this.createGroup}
          endDrag={this.endDrag}
          hideLevel={this.hideLevel}
          moveColumn={this.moveColumn}
          onClick={this.onColumnClick}
          onContextMenu={this.onContextMenu}
          columnTypes={columnTypes}
          columnRename={this.columnRename}
        />
        <ColumnContextMenu
          ref={this.setMenuRef}
          query={query}
          setQuery={setQuery}
          selectColumns={this.selectColumns}
          selectedColumns={selectedColumns}
          deselectColumns={this.deselectColumns}
          columnTypes={columnTypes}
        />
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ColumnView/index.js