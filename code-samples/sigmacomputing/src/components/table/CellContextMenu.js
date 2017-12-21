// @flow
import React, { PureComponent } from 'react';
import type { Query, Anchor } from '@sigmacomputing/sling';
import { formula } from '@sigmacomputing/sling';

import { Menu, Popup } from 'widgets';
import type { Id } from 'types';
import {
  canCollapse,
  canExpand,
  collapseAndAnchor,
  expandAndAnchor
} from 'utils/table';
import { includeFilter, excludeFilter } from 'utils/ColumnActions';
import { getData } from 'utils/column';
import { formatValue } from 'utils/format';

import type { TableData } from './tableData';

const { MenuItem, MenuDivider } = Menu;

type Props = {
  query: Query,
  setQuery: Query => void,
  setAnchor: (?Anchor) => void,
  tableData: TableData
};

type ContextCell = {|
  clientX: number,
  clientY: number,
  columnId: Id,
  levelId: Id,
  flatOffset: number
|};

type State = {
  ctx: ?ContextCell
};

export default class CellContextMenu extends PureComponent<Props, State> {
  willOpen: boolean;
  popup: ?Popup;

  constructor(props: Props) {
    super(props);
    this.state = {
      ctx: undefined
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.tableData !== this.props.tableData && this.state.ctx) {
      const { columnId, flatOffset } = this.state.ctx;
      if (!nextProps.tableData.isValidCellPosition(columnId, flatOffset)) {
        // menu is open on a cell that no longer exists.  clear it
        this.setState({ ctx: null });
      }
    }
  }

  onContextMenu = (
    evt: SyntheticMouseEvent<>,
    columnId: Id,
    levelId: Id,
    flatOffset: number
  ) => {
    this.setState({
      ctx: {
        clientX: evt.clientX,
        clientY: evt.clientY,
        columnId,
        levelId,
        flatOffset
      }
    });
    if (this.popup) this.popup.setTarget(evt);
  };

  setPopupRef = (r: ?Popup) => {
    this.popup = r;
  };

  onMenuAction = (action: string) => {
    const { tableData } = this.props;
    const { ctx } = this.state;

    if (!ctx) return;
    const { columnId, levelId, flatOffset } = ctx;

    const typ = tableData.getColumnType(columnId);
    if (!typ || typ === 'error') return;

    const valueStr = tableData.getCellValueStr(columnId, flatOffset);
    const val = formula.parseConstVal(valueStr, typ);

    let query;
    switch (action) {
      case 'include':
        query = includeFilter(this.props.query, columnId, val);
        break;
      case 'exclude':
        query = excludeFilter(this.props.query, columnId, val);
        break;
      case 'collapse': {
        const r = collapseAndAnchor(
          this.props.query,
          tableData,
          columnId,
          levelId,
          flatOffset
        );
        this.props.setAnchor(r.anchor);
        query = r.query;
        break;
      }
      case 'expand': {
        const r = expandAndAnchor(
          this.props.query,
          tableData,
          columnId,
          levelId,
          flatOffset
        );
        this.props.setAnchor(r.anchor);
        query = r.query;
        break;
      }
      default:
        throw new Error(`Unexpected key: ${action}`);
    }
    this.setState({ ctx: undefined });
    this.props.setQuery(query);
  };

  render() {
    const { tableData, query } = this.props;
    const { ctx } = this.state;
    if (!ctx) return null;
    const { columnId, levelId, flatOffset } = ctx;
    const columnType = tableData.getColumnType(columnId);
    if (columnType === 'error') return null;
    const columnData = tableData.getColumnData(columnId);
    const valueStr =
      columnData != null ? getData(columnData, flatOffset) : null;
    const format = query.view.formats[columnId];

    const v =
      valueStr != null ? formatValue(valueStr, columnType, format) : 'Null';

    const collapse = canCollapse(query, levelId);
    const expand = canExpand(query, levelId);

    const menu = (
      <Menu onMenuItemClick={this.onMenuAction}>
        <MenuItem
          id="include"
          name={
            <span>
              Include <b>{v}</b>
            </span>
          }
        />
        <MenuItem
          id="exclude"
          name={
            <span>
              Exclude <b>{v}</b>
            </span>
          }
        />
        {(collapse || expand) && <MenuDivider />}
        {collapse && <MenuItem id="collapse" name="Collapse" />}
        {expand && <MenuItem id="expand" name="Expand" />}
      </Menu>
    );
    if (!menu) return null;
    return (
      <Popup ref={this.setPopupRef} width="150px">
        {menu}
      </Popup>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/CellContextMenu.js