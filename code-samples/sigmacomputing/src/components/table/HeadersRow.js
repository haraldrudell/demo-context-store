// @flow
import React, { PureComponent } from 'react';
import { Grid } from 'react-virtualized';
import classnames from 'classnames/bind';
import type { Query } from '@sigmacomputing/sling';

import TableResizer from 'components/widgets/TableResizer/TableResizer';
import {
  HEADER_HEIGHT,
  DEFAULT_COL_WIDTH,
  MIN_COL_WIDTH
} from 'const/TableConstants';
import type { LabelBindings, SelectedColumns, Id } from 'types';
import type { ColumnMetadataType } from 'types/table';
import type Label from 'components/widgets/Label';
import Header from './Header';
import DraggableColumnHeader from './DraggableColumnHeader';
import styles from './Header.less';
const cx = classnames.bind(styles);

const SCROLL_STYLE = {
  overflowX: 'hidden',
  overflowY: 'hidden'
};

type Props = {
  width: number,
  columns: Array<ColumnMetadataType>,
  labels: LabelBindings,
  onRename?: (id: string, label: string) => void,
  scrollLeft?: number,
  selectedColumns: SelectedColumns,
  onResizeColumn: (id: string, width: ?number) => void,
  columnWidths: number,
  setQuery: Query => void
};

type gridRef = { recomputeGridSize: () => void };

export default class HeadersRow extends PureComponent<Props> {
  grid: ?gridRef;
  headerRefs: { [string]: ?Label } = {};

  static defaultProps = {
    scrollLeft: 0,
    selectedColumns: {}
  };

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.columnWidths !== this.props.columnWidths ||
      nextProps.columns !== this.props.columns
    ) {
      if (this.grid) this.grid.recomputeGridSize();
    }
  }

  setGridRef = (ref: ?gridRef) => {
    this.grid = ref;
  };

  setHeaderRef = (id: string, ref: ?Label) => {
    this.headerRefs[id] = ref;
  };

  focus = (columnId: Id) => {
    if (this.headerRefs[columnId]) this.headerRefs[columnId].focus();
  };

  onResizeCol = (newWidth: ?number, columnId: ?string) => {
    if (columnId) this.props.onResizeColumn(columnId, newWidth);
  };

  renderHeader = (x: { columnIndex: number, key: string, style: {} }) => {
    const { columns, selectedColumns, onResizeColumn, setQuery } = this.props;
    if (columns.length === x.columnIndex) {
      return <div key={x.key} className={cx('scrollHeader')} style={x.style} />;
    }

    const h = columns[x.columnIndex];
    const isSelected = Boolean(selectedColumns[h.id]);
    const colWidth = h.width ? h.width : DEFAULT_COL_WIDTH;
    const label = this.props.labels[h.id];
    const i = x.columnIndex;
    const isLastInLevel =
      i < columns.length - 1 && columns[i].levelId !== columns[i + 1].levelId;
    const isFirstInLevel =
      i === 0 || columns[i].levelId !== columns[i - 1].levelId;

    const header = (
      <Header
        id={h.id}
        width={colWidth}
        label={label}
        isFirstInLevel={isFirstInLevel}
        isLastInLevel={isLastInLevel}
        isLevelCollapsed={h.isLevelCollapsed}
        isSelected={isSelected}
        levelId={h.levelId}
        onRename={this.props.onRename}
        onResizeColumn={onResizeColumn}
        setHeaderRef={this.setHeaderRef}
      />
    );

    return (
      <div key={x.key} style={x.style}>
        <DraggableColumnHeader
          key={x.key}
          id={h.id}
          levelId={h.levelId}
          label={label}
          header={header}
          setQuery={setQuery}
        />
        <TableResizer
          id={h.id}
          height={HEADER_HEIGHT}
          size={colWidth}
          minSize={MIN_COL_WIDTH}
          onResize={this.onResizeCol}
          axis={'x'}
        />
      </div>
    );
  };

  getColumnWidth = (x: { index: number }) => {
    const { columns, width } = this.props;
    if (columns.length === x.index) {
      // if the total column width is < the visible width, then render a column that soaks up the extra space
      return Math.max(0, width - columns.reduce((sum, c) => sum + c.width, 0));
    }
    return columns[x.index].width;
  };

  render() {
    const { columns, width, selectedColumns, labels } = this.props;

    return (
      <Grid
        ref={this.setGridRef}
        className={cx('container')}
        style={SCROLL_STYLE}
        cellRenderer={this.renderHeader}
        columnCount={columns.length + 1}
        columnWidth={this.getColumnWidth}
        estimatedColumnSize={DEFAULT_COL_WIDTH}
        height={HEADER_HEIGHT}
        labels={labels} // re-render on label changes
        rowCount={1}
        rowHeight={HEADER_HEIGHT}
        scrollLeft={this.props.scrollLeft}
        selectedColumns={selectedColumns} // re-render when selectedColumns changes
        width={width}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/HeadersRow.js