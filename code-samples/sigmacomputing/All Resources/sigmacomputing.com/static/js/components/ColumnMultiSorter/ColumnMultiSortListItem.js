// @flow

import React, { PureComponent } from 'react';
import type { SortKey, ValueType } from '@sigmacomputing/sling';
import type { LabelBindings } from 'types';
import { IconButton, Flex, ComboBox, Menu } from 'widgets';
const { MenuItem } = Menu;

type Props = {
  labels: LabelBindings,
  sortKeys: Array<SortKey>,
  sortKey: SortKey,
  columns: Array<string>,
  removeSortKey: (id: string) => void,
  updateSortKey: (sortKeyIndex: number, payload: SortKey) => void,
  columnType: ?ValueType
};

export default class ColumnMultiSortListItem extends PureComponent<Props> {
  setColumnSelection = (id: string) => {
    const { updateSortKey, sortKeys, sortKey } = this.props;
    const index = sortKeys.findIndex(key => key.column === sortKey.column);
    updateSortKey(index, { column: id, isAsc: sortKey.isAsc });
  };

  setOrderSelection = (id: string) => {
    const { updateSortKey, sortKeys, sortKey } = this.props;
    const index = sortKeys.findIndex(key => key.column === sortKey.column);
    updateSortKey(index, { column: sortKey.column, isAsc: id === 'asc' });
  };

  removeSortKey = () => {
    const { removeSortKey, sortKey } = this.props;
    removeSortKey(sortKey.column);
  };

  renderColumnList = () => {
    const { labels, columns, sortKeys, sortKey } = this.props;
    const usedColumns = sortKeys.map(element => element.column);

    // the selected column and columns that aren't already being used
    const allowedColumns = columns.filter(
      column =>
        column === sortKey.column ||
        !usedColumns.find(usedColumn => usedColumn === column)
    );
    return allowedColumns.map(id => {
      return <MenuItem id={id} key={id} name={labels[id]} />;
    });
  };

  renderSortOrderList = () => {
    const { columnType } = this.props;
    switch (columnType) {
      case 'datetime':
        return [
          <MenuItem id="asc" key="asc" name="Oldest to newest" />,
          <MenuItem id="desc" key="desc" name="Newest to oldest" />
        ];
      case 'number':
        return [
          <MenuItem id="asc" key="asc" name="Smallest to largest" />,
          <MenuItem id="desc" key="desc" name="Largest to smallest" />
        ];
      default:
        return [
          <MenuItem id="asc" key="asc" name="A to Z" iconType="sort_az" />,
          <MenuItem id="desc" key="desc" name="Z to A" iconType="sort_za" />
        ];
    }
  };

  render() {
    const { sortKey, sortKeys } = this.props;
    // user can't remove the first row
    const deleteDisabled = sortKey.column === sortKeys[0].column;

    return (
      <Flex
        align="center"
        justify="space-between"
        font="header5"
        color="darkBlue2"
        mb={3}
      >
        <ComboBox
          selected={sortKey.column}
          setSelection={this.setColumnSelection}
          doNotLayer={true}
          width="160px"
          placeholder="Select"
        >
          {this.renderColumnList()}
        </ComboBox>
        <ComboBox
          selected={sortKey.isAsc ? 'asc' : 'desc'}
          setSelection={this.setOrderSelection}
          doNotLayer={true}
          width="160px"
        >
          {this.renderSortOrderList()}
        </ComboBox>
        <IconButton
          disabled={deleteDisabled}
          opacity={deleteDisabled ? 0 : 1}
          type="close"
          size="12px"
          onClick={this.removeSortKey}
        />
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ColumnMultiSorter/ColumnMultiSortListItem.js