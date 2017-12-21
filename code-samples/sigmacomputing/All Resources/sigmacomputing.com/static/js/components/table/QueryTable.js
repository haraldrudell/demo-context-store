// @flow
import React, { PureComponent } from 'react';
import { AutoSizer } from 'react-virtualized';
import invariant from 'invariant';
import { cloneDeep } from 'lodash';
import type { Query, Anchor } from '@sigmacomputing/sling';

import type { Selection, Id, ColumnTypes, FetchDirection } from 'types';
import type { ScrollPosition } from 'types/table';
import {
  isColumnSelected,
  selectColumns,
  deselectColumns,
  getSelectedColumns,
  mkColSelection,
  mkCellSelection
} from 'utils/selection';
import { mkAnchor } from 'utils/table';
import Table from './Table';
import ColumnContextMenu from './ColumnContextMenu';
import CellContextMenu from './CellContextMenu';
import { handleKey } from './handleKey';
import type { TableData } from './tableData';
import styles from './Table.less';

type Props = {
  query: Query,
  columnTypes: ColumnTypes,
  setQuery: Query => void,
  selection: Selection,
  setSelection: Selection => void,
  setAnchor: (?Anchor) => void,
  tableData: TableData,
  setQuery: Query => void,
  fetchNextPage: (direction: FetchDirection) => void,
  isFetchingMore: boolean
};

type Coord =
  | {| type: 'header', columnId: Id, levelId: Id |}
  | {| type: 'header-menu', columnId: Id, levelId: Id |}
  | {|
      type: 'cell',
      columnId: Id,
      levelId: Id,
      flatOffset: number
    |};

function getCoords(evt): ?Coord {
  let e = evt.target;
  while (e && e instanceof HTMLElement) {
    if (e.dataset && e.dataset.type) {
      const dataset = (e.dataset: any);
      return {
        type: dataset.type,
        columnId: dataset.columnid,
        levelId: dataset.levelid,
        flatOffset: parseInt(dataset.flatoffset, 10)
      };
    }
    e = e.parentElement;
  }
  return null;
}

// If you left-click on the dropdown, we want to position the menu
// relative to the icon (evt.target) not the click
function positionMenu(evt) {
  const { bottom, left, right } = evt.target.getBoundingClientRect();

  return {
    ...evt,
    clientX: (left + right) / 2,
    clientY: bottom
  };
}

export default class QueryTable extends PureComponent<Props> {
  columnmenu: ?ColumnContextMenu;
  cellMenu: ?CellContextMenu;
  tableRef: ?Table;
  getScrollPosition: () => ScrollPosition;
  forceScroll: (scroll: { scrollTop?: number, scrollLeft?: number }) => void;

  getScrollPosition = () => {
    invariant(this.tableRef, 'Table component unmounted?');
    return this.tableRef.getScrollPosition();
  };

  forceScroll = (scroll: { scrollTop?: number, scrollLeft?: number }) => {
    if (this.tableRef) {
      this.tableRef.forceScroll(scroll);
    }
  };

  onKeyDown = (e: KeyboardEvent) => {
    const { selection, query, tableData } = this.props;
    const {
      selection: newSelection,
      query: newQuery,
      anchor: newAnchor
    } = handleKey(e.key, selection, query, tableData);
    if (newSelection !== selection) {
      this.props.setSelection(newSelection);
    }
    if (newQuery !== query) {
      this.props.setQuery(newQuery);
    }
    if (newAnchor !== undefined) {
      this.props.setAnchor(newAnchor);
    }
  };

  openColumnMenu = (evt: SyntheticMouseEvent<>, columnId: Id, levelId: Id) => {
    const { selection, setSelection } = this.props;
    if (!isColumnSelected(selection, columnId)) {
      setSelection(mkColSelection(columnId));
    }
    if (this.columnmenu) this.columnmenu.onContextMenu(evt, columnId, levelId);
  };

  openCellMenu = (
    evt: SyntheticMouseEvent<>,
    columnId: Id,
    levelId: Id,
    flatOffset: number
  ) => {
    const { selection, setSelection } = this.props;

    // select this cell if not already selected
    if (
      !selection ||
      selection.type !== 'cell' ||
      selection.columnId !== columnId ||
      selection.levelId !== levelId ||
      selection.flatOffset !== flatOffset
    ) {
      setSelection(mkCellSelection(columnId, levelId, flatOffset));
    }

    if (this.cellMenu) {
      this.cellMenu.onContextMenu(evt, columnId, levelId, flatOffset);
    }
  };

  collapseLevel = (levelId: Id) => {
    const { query, selection, setQuery, tableData } = this.props;
    const newQuery = cloneDeep(query);

    if (
      selection.type === 'cell' &&
      selection.levelId !== 'base' &&
      selection.levelId !== 'global'
    ) {
      const anchor = mkAnchor(
        newQuery,
        tableData,
        selection.columnId,
        selection.levelId,
        selection.flatOffset
      );
      this.props.setAnchor(anchor);
    }

    newQuery.levelCollapseToggle(levelId);
    setQuery(newQuery);
  };

  onClick = (evt: SyntheticInputEvent<>) => {
    evt.stopPropagation();
    const { selection, query, setSelection } = this.props;
    const x = getCoords(evt);
    if (!x) return;
    if (x.type === 'header-menu') {
      // $FlowFixMe -- flow has issues with spread + exact object types.
      this.openColumnMenu(positionMenu(evt), x.columnId, x.levelId);
    } else if (x.type === 'cell') {
      setSelection(mkCellSelection(x.columnId, x.levelId, x.flatOffset));
    } else if (x.type === 'levelCollapser') {
      this.collapseLevel(x.levelId);
    } else {
      const newSelection = selectColumns(evt, selection, x.columnId, query);
      setSelection(newSelection);
    }
  };

  onContextMenu = (evt: SyntheticMouseEvent<>) => {
    evt.preventDefault();
    const x = getCoords(evt);
    if (!x) return;
    if (x.type === 'cell') {
      this.openCellMenu(evt, x.columnId, x.levelId, x.flatOffset);
    } else {
      this.openColumnMenu(evt, x.columnId, x.levelId);
    }
  };

  setCellMenuRef = (r: ?CellContextMenu) => {
    this.cellMenu = r;
  };

  setColumnMenuRef = (r: ?ColumnContextMenu) => {
    this.columnmenu = r;
  };

  deselectColumns = (toDeselect: Array<Id>) => {
    const { selection, setSelection } = this.props;
    const newSelection = deselectColumns(selection, toDeselect);
    setSelection(newSelection);
  };

  setTableRef = (r: ?Table) => {
    this.tableRef = r;
  };

  onRename = (columnId: Id) => {
    if (this.tableRef) {
      this.tableRef.focus(columnId);
    }
  };

  render() {
    const {
      query,
      selection,
      setSelection,
      setQuery,
      setAnchor,
      tableData,
      fetchNextPage,
      isFetchingMore,
      columnTypes
    } = this.props;
    const selectedColumns = getSelectedColumns(selection);

    return (
      <div
        className="flex-row flex-item"
        onClick={this.onClick}
        onContextMenu={this.onContextMenu}
        onKeyDown={this.onKeyDown}
        tabIndex="0"
      >
        <div className={styles.sizer}>
          <AutoSizer>
            {({ height, width }) => (
              <Table
                ref={this.setTableRef}
                query={query}
                height={height}
                width={width}
                tableData={tableData}
                selection={selection}
                setQuery={setQuery}
                fetchNextPage={fetchNextPage}
                isFetchingMore={isFetchingMore}
              />
            )}
          </AutoSizer>
        </div>
        <ColumnContextMenu
          ref={this.setColumnMenuRef}
          query={query}
          setQuery={setQuery}
          selectColumns={setSelection}
          deselectColumns={this.deselectColumns}
          selectedColumns={selectedColumns}
          columnTypes={columnTypes}
          onRename={this.onRename}
        />
        <CellContextMenu
          ref={this.setCellMenuRef}
          query={query}
          setQuery={setQuery}
          setAnchor={setAnchor}
          tableData={tableData}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/QueryTable.js