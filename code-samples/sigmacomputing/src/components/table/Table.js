// @flow
import React, { PureComponent } from 'react';
import { ScrollSync } from 'react-virtualized';
import getScrollSize from 'scrollbar-width';
import { cloneDeep, isEqual } from 'lodash';
import type { Query } from '@sigmacomputing/sling';
import classnames from 'classnames/bind';
import invariant from 'invariant';

import { HEADER_HEIGHT, ROW_HEIGHT } from 'const/TableConstants';
import type { Selection, Id, FetchDirection } from 'types';
import type { ColumnMetadataType, ScrollPosition } from 'types/table';
import { getSelectedColumns } from 'utils/selection';
import { getCell } from 'utils/column';
import { formatCell } from 'utils/format';
import { columnRename } from 'utils/ColumnActions';
import HeadersRow from './HeadersRow';
import TableBody from './TableBody';
import { TableData } from './tableData';
import layoutHeaders from './layout';
import styles from './Table.less';
const cx = classnames.bind(styles);

type Props = {
  query: Query,
  height: number,
  width: number,
  tableData: TableData,
  selection: Selection,
  setQuery: Query => void,
  fetchNextPage: (direction: FetchDirection) => void,
  isFetchingMore: boolean
};

const AUTOWIDTH_CANVAS = window.document.createElement('canvas');
const AUTOWIDTH_FONT = '12pt sans-serif';

function getAutoWidth(
  tableData: TableData,
  query: Query,
  columnId: string
): number {
  const colData = tableData.getColumnData(columnId);
  if (colData == null) {
    return 0;
  }

  const context = AUTOWIDTH_CANVAS.getContext('2d');
  context.font = AUTOWIDTH_FONT;

  const f = query.view.formats[columnId];
  const l = Math.min(10000, colData.length);

  let maxWidth = 0;
  for (let i = 0; i < l; i++) {
    const cell = getCell(colData, i);
    const value = formatCell(cell, colData.type, f);
    if (value != null) {
      maxWidth = Math.max(maxWidth, measureText(value, context));
    }
  }
  return maxWidth;
}

function getMinWidth(query, columnId: Id): number {
  const label = query.view.labels[columnId];
  return measureText(` ${label} `);
}

function measureText(t: string, ctx: any): number {
  if (ctx == null) {
    ctx = AUTOWIDTH_CANVAS.getContext('2d');
    ctx.font = AUTOWIDTH_FONT;
  }
  return Math.ceil(ctx.measureText(t).width);
}

export default class Table extends PureComponent<
  Props,
  {
    columns: Array<ColumnMetadataType>,
    width: number,
    columnWidths: number // This is the total widths of the columns
  }
> {
  bodyRef: ?TableBody;
  headersRef: ?HeadersRow;
  getScrollPosition: () => ScrollPosition;
  forceScroll: (scroll: { scrollTop?: number, scrollLeft?: number }) => void;

  constructor(props: Props) {
    super(props);

    const { width: columnWidths, columns } = layoutHeaders(props.query);
    const width = Math.min(columnWidths + getScrollSize(), props.width);
    this.state = {
      columnWidths,
      columns,
      width
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.query !== this.props.query) {
      const { width: columnWidths, columns } = layoutHeaders(nextProps.query);
      const width = Math.min(columnWidths, nextProps.width);
      this.setState({
        columnWidths,
        width,
        columns
      });
    } else if (nextProps.width !== this.props.width) {
      const width = Math.min(
        this.state.columnWidths + getScrollSize(),
        nextProps.width
      );
      this.setState({
        width
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    // scroll the selected region into view
    this.scrollToSelected(this.props.selection, prevProps.selection);
  }

  scrollToSelected = (sel: Selection, prevSelected: Selection) => {
    if (!sel || sel === prevSelected || sel.type === 'none' || !this.bodyRef)
      return;

    if (sel.type === 'column') {
      const cols = Object.keys(sel.selectedColumns);
      if (cols.length !== 1) return;

      // selection has changed, and it's a single column.  scroll to it
      this.bodyRef.scrollColumnIntoView(cols[0]);
    } else if (sel.type === 'cell' && !isEqual(sel, prevSelected)) {
      this.bodyRef.scrollColumnIntoView(sel.columnId);
      // XXX JDF: not sure why Flow needs this check again
      if (this.bodyRef)
        this.bodyRef.scrollRowIntoView(sel.columnId, sel.flatOffset);
    }
  };

  // autosize columns if no new width is provided - triggered by doubleclicking the resize handle
  checkWidth = (columnId: Id, width: ?number) => {
    if (width) return width;

    const { width: availWidth, tableData, query } = this.props;
    const autoWidth = getAutoWidth(tableData, query, columnId);
    const minWidth = getMinWidth(query, columnId);
    if (autoWidth < minWidth) {
      return minWidth;
    } else if (autoWidth > availWidth) {
      return availWidth;
    }
    return autoWidth;
  };

  onRename = (columnId: Id, label: string) => {
    const { query, setQuery } = this.props;
    const newQuery = columnRename(query, columnId, label);
    setQuery(newQuery);
  };

  onResizeColumn = (columnId: Id, width: ?number) => {
    const { query, selection, setQuery } = this.props;
    const newQuery = cloneDeep(query);
    const selectedColumns = getSelectedColumns(selection);
    const isSelected = selectedColumns[columnId];

    if (isSelected) {
      for (const id in selectedColumns) {
        if (id) newQuery.columnUpdateWidth(id, this.checkWidth(id, width));
      }
    } else {
      newQuery.columnUpdateWidth(columnId, this.checkWidth(columnId, width));
    }

    setQuery(newQuery);
  };

  setHeadersRef = (r: ?HeadersRow) => {
    this.headersRef = r;
  };

  setBodyRef = (r: ?TableBody) => {
    this.bodyRef = r;
  };

  focus = (columnId: Id) => {
    if (this.headersRef) this.headersRef.focus(columnId);
  };

  getScrollPosition = () => {
    invariant(this.bodyRef, 'TableBody component unmounted?');
    return this.bodyRef.getScrollPosition();
  };

  forceScroll = (scroll: { scrollTop?: number, scrollLeft?: number }) => {
    if (this.bodyRef) {
      this.bodyRef.forceScroll(scroll);
    }
  };

  render() {
    const { columns, columnWidths } = this.state;

    const {
      query,
      height,
      width,
      tableData,
      selection,
      fetchNextPage,
      isFetchingMore,
      setQuery
    } = this.props;

    if (height <= 0) return null;

    const vizHeight = height - HEADER_HEIGHT;
    const fullRowCount = tableData.limit;
    const pageSize = Math.min(Math.floor(vizHeight / ROW_HEIGHT), fullRowCount);
    const needVerticalScroll = pageSize < fullRowCount;
    const scrollSize = getScrollSize();

    return (
      <div style={{ height, width }}>
        <ScrollSync>
          {({ onScroll, scrollLeft }) => (
            <div>
              <div className={cx('container')}>
                <HeadersRow
                  ref={this.setHeadersRef}
                  width={needVerticalScroll ? width - scrollSize : width}
                  columns={columns}
                  labels={query.view.labels}
                  scrollLeft={scrollLeft}
                  selectedColumns={getSelectedColumns(selection)}
                  onRename={this.onRename}
                  onResizeColumn={this.onResizeColumn}
                  columnWidths={columnWidths}
                  setQuery={setQuery}
                />
                <TableBody
                  ref={this.setBodyRef}
                  columns={columns}
                  height={vizHeight}
                  width={width}
                  tableData={tableData}
                  onScroll={onScroll}
                  selection={selection}
                  totalWidth={columnWidths}
                  formats={query.view.formats}
                  fetchNextPage={fetchNextPage}
                  isFetchingMore={isFetchingMore}
                />
              </div>
            </div>
          )}
        </ScrollSync>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/Table.js