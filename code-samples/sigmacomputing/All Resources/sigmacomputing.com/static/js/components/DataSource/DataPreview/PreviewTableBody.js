// @flow
import React, { Component } from 'react';
import { Grid } from 'react-virtualized';
import type { Format, Id } from '@sigmacomputing/sling';
import classnames from 'classnames/bind';

import type { ColumnMetadataType } from 'types/table';
import type { TableData } from 'components/table/tableData';
import { ROW_HEIGHT } from 'const/TableConstants';
import { formatCell } from 'utils/format';
import { getCell } from 'utils/column';
import fontStyles from 'styles/typography.less';
import styles from './DataPreview.less';
const cx = classnames.bind(styles);

const SCROLL_STYLE = {
  overflowX: 'scroll',
  overflowY: 'hidden'
};

type Props = {
  columnWidth: number,
  rowCount: number,
  columnCount: number,
  columns: Array<ColumnMetadataType>,
  tableData: ?TableData,
  formats: ?{ [Id]: Format },
  onScroll: ({ scrollLeft: number, scrollTop: number }) => void,
  height: number,
  width: number
};

export default class PreviewTableBody extends Component<Props> {
  grid: Grid;

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.columns !== this.props.columns) {
      this.grid.recomputeGridSize();
    }
  }

  setGridRef = (ref: Grid) => {
    this.grid = ref;
  };

  renderCell = (x: {
    rowIndex: number,
    columnIndex: number,
    key: string,
    style: {}
  }) => {
    const { columns, formats, tableData } = this.props;
    let value = null,
      rightAlign;

    if (tableData) {
      const column = columns[x.columnIndex];
      if (column) {
        const columnId = column.id;
        const typ = tableData.getColumnType(columnId);
        rightAlign = typ === 'number' || typ === 'datetime';

        const columnData = tableData.getColumnData(columnId);
        if (columnData) {
          const cell = getCell(columnData, x.rowIndex);
          const format = formats && formats[columnId];
          value = formatCell(cell, typ, format);
        }
      }
    }

    return (
      <div
        key={x.key}
        style={x.style}
        className={cx(styles.cell, { rightAlign })}
        title={value}
      >
        {value}
      </div>
    );
  };

  getColumnWidth = ({ index }: { index: number }) => {
    const { columnWidth, columns, width } = this.props;
    if (columns[index]) {
      return columnWidth;
    }

    const currentWidth = index * columnWidth;
    if (currentWidth + columnWidth > width) {
      // For the last column if there is no value we can just cut it off
      return width - currentWidth;
    }

    return columnWidth;
  };

  render() {
    const {
      columns,
      columnWidth,
      columnCount,
      rowCount,
      onScroll,
      height,
      width,
      tableData
    } = this.props;

    return (
      <Grid
        ref={this.setGridRef}
        className={fontStyles.table}
        columnWidth={this.getColumnWidth}
        estimatedColumnSize={columnWidth}
        style={SCROLL_STYLE}
        cellRenderer={this.renderCell}
        columnCount={columnCount}
        height={height}
        rowCount={rowCount}
        rowHeight={ROW_HEIGHT}
        onScroll={onScroll}
        width={width}
        tableData={tableData} // re-render when columns changes
        columns={columns} // re-render when columns changes
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/DataPreview/PreviewTableBody.js