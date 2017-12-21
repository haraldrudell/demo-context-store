// @flow
import React, { Component } from 'react';
import { Grid } from 'react-virtualized';

import { Flex, Text } from 'widgets';
import type { LabelBindings } from 'types';
import { HEADER_HEIGHT } from 'const/TableConstants';
import type { ColumnMetadataType } from 'types/table';

const SCROLL_STYLE = {
  overflowX: 'hidden',
  overflowY: 'hidden'
};

type Props = {
  columns: Array<ColumnMetadataType>,
  labels: ?LabelBindings,
  width: number,
  columnWidth: number,
  columnCount: number,
  scrollLeft: number
};

export default class PreviewHeadersRow extends Component<Props> {
  grid: Grid;

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.columns !== this.props.columns) {
      this.grid.recomputeGridSize();
    }
  }

  setGridRef = (ref: Grid) => {
    this.grid = ref;
  };

  renderHeader = (x: { columnIndex: number, key: string, style: {} }) => {
    const { columns, labels } = this.props;
    const column = columns[x.columnIndex];
    const label = column && labels ? labels[columns[x.columnIndex].id] : '';
    return (
      <Flex
        align="center"
        bg="darkBlue6"
        by={1}
        br={1}
        borderColor="darkBlue5"
        justify="center"
        key={x.key}
        style={x.style}
        title={label}
      >
        <Text truncate>{label}</Text>
      </Flex>
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
    const { columns, columnCount, scrollLeft, width } = this.props;

    return (
      <Text font="header6">
        <Grid
          ref={this.setGridRef}
          columnWidth={this.getColumnWidth}
          style={SCROLL_STYLE}
          cellRenderer={this.renderHeader}
          columnCount={columnCount}
          height={HEADER_HEIGHT}
          rowCount={1}
          rowHeight={HEADER_HEIGHT}
          scrollLeft={scrollLeft}
          width={width}
          columns={columns} // re-render when columns changes
        />
      </Text>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/DataPreview/PreviewHeadersRow.js