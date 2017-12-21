// @flow
import React, { Component } from 'react';
import { type Query } from '@sigmacomputing/sling';
import { ScrollSync } from 'react-virtualized';
import getScrollSize from 'scrollbar-width';

import { Flex, Spin } from 'widgets';
import type { ColumnMetadataType } from 'types/table';
import type { TableData } from 'components/table/tableData';
import { HEADER_HEIGHT, ROW_HEIGHT } from 'const/TableConstants';
import { getFullRowCount } from 'utils/table';
import layoutHeaders from 'components/table/layout';
import { mkTableData } from 'components/table/fetchUtil';
import PreviewHeadersRow from './PreviewHeadersRow';
import PreviewTableBody from './PreviewTableBody';
import styles from './DataPreview.less';

const COL_WIDTH = 100;
export const ROW_LIMIT = 6;

type Props = {
  query: ?Query,
  deletedColumns: { [key: string]: boolean },
  width: number,
  data: ?{ table: Object },
  isLoading: boolean
};

function getNewState(props) {
  const { data, deletedColumns, query } = props;

  let columns = [],
    tableData;

  if (query) {
    columns = columns = layoutHeaders(query).columns.filter(
      c => !deletedColumns[c.id]
    );
  }

  if (query && data) {
    const tableValue = data.table;
    const fullRowCount = getFullRowCount(tableValue);
    tableData = mkTableData(tableValue, null, 0, fullRowCount);
  }

  return {
    columns,
    tableData
  };
}

export default class DataPreview extends Component<
  Props,
  {
    tableData: ?TableData,
    columns: Array<ColumnMetadataType>
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = getNewState(props);
  }

  componentWillUpdate(nextProps: Props) {
    if (
      nextProps.deletedColumns !== this.props.deletedColumns ||
      nextProps.query !== this.props.query ||
      nextProps.data !== this.props.data
    ) {
      this.setState(getNewState(nextProps));
    }
  }

  render() {
    const { query, width, isLoading } = this.props;
    const { tableData, columns } = this.state;

    const BODY_HEIGHT = ROW_HEIGHT * 6 + getScrollSize();
    const TOTAL_HEIGHT = HEADER_HEIGHT + BODY_HEIGHT;
    const minColumns = Math.ceil(width / COL_WIDTH);
    const columnCount = columns
      ? Math.max(columns.length, minColumns)
      : minColumns;

    return (
      <div style={{ height: TOTAL_HEIGHT, width, position: 'relative' }}>
        <ScrollSync>
          {({ onScroll, scrollLeft }) => (
            <div className={styles.container}>
              <PreviewHeadersRow
                width={width}
                columns={columns}
                labels={query ? query.view.labels : null}
                scrollLeft={scrollLeft}
                columnCount={columnCount}
                columnWidth={COL_WIDTH}
              />
              <PreviewTableBody
                formats={query ? query.view.formats : null}
                tableData={tableData}
                onScroll={onScroll}
                columns={columns}
                rowCount={ROW_LIMIT}
                columnCount={columnCount}
                columnWidth={COL_WIDTH}
                height={BODY_HEIGHT}
                width={Math.min(width)}
              />
              <div className={styles.borderRight} />
            </div>
          )}
        </ScrollSync>
        {isLoading && (
          <Flex
            justify="center"
            align="center"
            className={styles.loaderContainer}
          >
            <Spin />
          </Flex>
        )}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/DataPreview/index.js