// @flow

import React, { PureComponent } from 'react';
import type { SortKey } from '@sigmacomputing/sling';
import type { LabelBindings, ColumnTypes } from 'types';
import { Flex, Box } from 'widgets';
import classnames from 'classnames/bind';

import styles from './ColumnMultiSortList.less';
import ColumnMultiSortListItem from './ColumnMultiSortListItem';

const cx = classnames.bind(styles);

type Props = {
  sortKeys: Array<SortKey>,
  labels: LabelBindings,
  columns: Array<string>,
  removeSortKey: (id: string) => void,
  updateSortKey: (sortKeyIndex: number, payload: SortKey) => void,
  columnTypes: ColumnTypes
};

export default class ColumnMultiSortList extends PureComponent<Props> {
  render() {
    const {
      sortKeys,
      labels,
      columns,
      removeSortKey,
      updateSortKey,
      columnTypes
    } = this.props;

    return (
      <Flex column>
        <Box className={cx('flex-row', 'label-row')} font="bodyMedium">
          <div className="flex-item">Field Name</div>
          <div className={cx('flex-item', 'last')}>Sort Order</div>
        </Box>
        <div className={cx('list')}>
          {sortKeys.map(data => (
            <ColumnMultiSortListItem
              key={data.column}
              labels={labels}
              sortKeys={sortKeys}
              sortKey={data}
              columns={columns}
              removeSortKey={removeSortKey}
              updateSortKey={updateSortKey}
              columnType={columnTypes[data.column]}
            />
          ))}
        </div>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ColumnMultiSorter/ColumnMultiSortList.js