// @flow
import React, { PureComponent } from 'react';
import type { Format } from '@sigmacomputing/sling';
import classnames from 'classnames/bind';

import type { Selection } from 'types';
import type { ColumnMetadataType } from 'types/table';
import { ROW_HEIGHT } from 'const/TableConstants';
import { formatCell } from 'utils/format';
import { EMPTY_VALUE_CELL, getCell } from 'utils/column';
import EmptyColumn from './EmptyColumn';
import type { TableData } from './tableData';
import Cell from './Cell';
import styles from './Cell.less';

type Props = {
  column: ColumnMetadataType,
  tableData: TableData,
  format: ?Format,
  height: number,
  isLastInLevel: boolean,
  selection: Selection,
  scrollTop: number
};

const cx = classnames.bind(styles);

export default class Column extends PureComponent<Props> {
  renderVisibleCells = () => {
    const {
      height,
      scrollTop,
      tableData,
      column,
      format,
      isLastInLevel,
      selection
    } = this.props;

    const cells = [];
    const { id: columnId, levelId, isLevelCollapsed } = column;

    if (isLevelCollapsed) {
      return (
        <EmptyColumn
          height={Math.min(height, tableData.limit * ROW_HEIGHT)}
          scrollTop={scrollTop}
          isLevelCollapsed
          isLastInLevel={isLastInLevel}
        />
      );
    }

    const { cellTop, dataRange, flatRange } = tableData.getVisibleRange(
      columnId,
      scrollTop,
      height
    );
    const [startIndex, endIndex] = dataRange;

    if (startIndex === 0 && endIndex === 0) {
      // no data to render (eg new empty formula)
      return (
        <EmptyColumn
          height={Math.min(height, tableData.limit * ROW_HEIGHT)}
          scrollTop={scrollTop}
          isLastInLevel={isLastInLevel}
        />
      );
    }

    const typ = tableData.getColumnType(columnId);
    const rightAlign = typ === 'number' || typ === 'datetime';
    const isColumnSelected = Boolean(
      selection.type === 'column' && selection.selectedColumns[columnId]
    );

    // true if there's a cell in this column that is selected
    const hasCellSelection = Boolean(
      selection.type === 'cell' && selection.columnId === columnId
    );

    if (cellTop > 0) {
      // add a single div to take the height of the unrendered cells above the viewport
      cells.push(<div key={-1} style={{ width: '100%', height: cellTop }} />);
    }

    let flatOffset = flatRange[0];
    const columnData = tableData.getColumnData(columnId);

    // Render the cells in the dataRange
    for (let i = startIndex; i < endIndex; i++) {
      const cell = columnData ? getCell(columnData, i) : EMPTY_VALUE_CELL;
      const [, count, multi] = cell;

      let style;
      let cellClass;
      const height = ROW_HEIGHT * count;

      if (count > 1) {
        // Don't let the wrapper's height go beyond the 'show more' button
        style = { height };
        cellClass = styles.stickyCell;
      }

      const renderedValue = formatCell(cell, typ, format);

      const isCellSelected =
        hasCellSelection &&
        selection.type === 'cell' &&
        selection.flatOffset >= flatOffset &&
        selection.flatOffset < flatOffset + count;

      let renderedCell = (
        <Cell
          key={i}
          columnId={columnId}
          isSelected={isColumnSelected || isCellSelected}
          isLastInLevel={isLastInLevel}
          isMulti={multi}
          levelId={levelId}
          flatOffset={flatOffset}
          noBorders={count > 1}
          rightAlign={rightAlign}
          className={cellClass}
          value={renderedValue}
        />
      );

      // if our value spans multiple rows then wrap it in a div
      // so that it can stick within the full range
      if (count > 1) {
        renderedCell = (
          <div
            key={i}
            style={style}
            className={cx('cellWrapper', {
              isLastInLevel,
              isSelected: isColumnSelected || isCellSelected
            })}
            data-type="cell"
            data-columnId={columnId}
            data-levelId={levelId}
            data-flatOffset={flatOffset}
          >
            {renderedCell}
            {isCellSelected && <div className={styles.selectedBorder} />}
          </div>
        );
      } else if (isCellSelected) {
        renderedCell = (
          <div key={i} style={{ position: 'relative' }}>
            {renderedCell}
            <div className={styles.selectedBorder} />
          </div>
        );
      }
      cells.push(renderedCell);
      flatOffset += count;
    }

    return cells;
  };

  render() {
    const { column } = this.props;
    return (
      <div style={{ width: column.width }}>{this.renderVisibleCells()}</div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/Column.js