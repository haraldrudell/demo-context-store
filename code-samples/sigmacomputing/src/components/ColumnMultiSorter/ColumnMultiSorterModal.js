// @flow
import React, { Component } from 'react';
import type { Query, SortKey } from '@sigmacomputing/sling';
import type { ColumnTypes } from 'types';
import { Modal, TextSpan, Flex, Button, IconButton } from 'widgets';

import * as actions from 'utils/ColumnActions';
import ColumnMultiSortList from './ColumnMultiSortList';

type Props = {
  onClose: () => void,
  visible: boolean,
  query: Query,
  levelId: ?string,
  setQuery: Query => void,
  columnTypes: ColumnTypes
};

type State = {
  sortKeys: Array<SortKey>
};

export default class ColumnMultiSorterModal extends Component<Props, State> {
  state: State = {
    sortKeys: []
  };

  componentDidMount() {
    const { query, levelId } = this.props;
    const levelIdx = levelId || 0;
    const isBase = query.levelIdxIsBase(levelIdx);
    const level = isBase
      ? query.getLevel(levelIdx)
      : query.getGroupLevel(levelIdx);

    this.setState({
      sortKeys: level.sortKeys.length
        ? level.sortKeys
        : [{ column: '', isAsc: true }]
    });
  }

  clearSorts = () => {
    this.setState({
      sortKeys: [
        {
          column: '',
          isAsc: true
        }
      ]
    });
  };

  addSortKey = () => {
    this.setState(prevState => {
      return {
        sortKeys: prevState.sortKeys.concat({
          column: '',
          isAsc: true
        })
      };
    });
  };

  removeSortKey = (id: string) => {
    this.setState(prevState => ({
      sortKeys: prevState.sortKeys.filter(sortKey => sortKey.column !== id)
    }));
  };

  updateSortKey = (sortKeyIndex: number, payload: SortKey) => {
    this.setState(prevState => ({
      sortKeys: prevState.sortKeys.map((sortKey, index) => {
        return index === sortKeyIndex ? payload : sortKey;
      })
    }));
  };

  applySort = () => {
    const { onClose, query, levelId, setQuery } = this.props;
    const { sortKeys } = this.state;

    // Get rid of sort keys in the "select" state
    const filteredSortKeys = sortKeys.filter(key => key.column !== '');

    const levelIdx = levelId || 0;
    const newQuery = actions.multiSort(query, levelIdx, filteredSortKeys);
    setQuery(newQuery);
    onClose();
  };

  renderFooter(canAddSortKey: ?boolean) {
    const { onClose } = this.props;
    return (
      <Flex align="center" justify="space-between">
        <Flex justify="flex-start" font="bodyMedium">
          <IconButton
            type="add"
            size="14px"
            onClick={this.addSortKey}
            disabled={!canAddSortKey}
            color={canAddSortKey ? 'blue' : 'darkBlue3'}
          >
            <TextSpan ml={1}>Add New</TextSpan>
          </IconButton>
        </Flex>
        <Flex justify="flex-end">
          <Button key="cancel" type="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button key="confirm" type="primary" ml={2} onClick={this.applySort}>
            Apply
          </Button>
        </Flex>
      </Flex>
    );
  }

  render() {
    const { onClose, visible, query, levelId, columnTypes } = this.props;
    const levelIdx = levelId || 0;
    const isBase = query.levelIdxIsBase(levelIdx);
    const sortKeys = this.state.sortKeys;
    const labels = query.view.labels;
    let level;
    let keys;

    if (isBase) {
      level = query.getLevel(levelIdx);
      keys = [];
    } else {
      level = query.getGroupLevel(levelIdx);
      keys = level.keys;
    }

    const columns = level.columns.filter(
      id => !query.columns[id].isGrouped && columnTypes[id] !== 'error'
    );

    // can sort by keys and/or columns in the group
    const sortOptions = columns.concat(keys);
    // don't let user add new sort key if an empty one already exists
    const emptySortKey = sortKeys.find(key => key.column === '');
    const canAddSortKey =
      !emptySortKey && sortKeys.length !== sortOptions.length;
    // disable clear if already in cleared state
    const canClear = sortKeys.length > 1 || !emptySortKey;

    return (
      <Modal
        visible={visible}
        onClose={onClose}
        title={
          <TextSpan font="header3" color="darkBlue2">
            Sort
          </TextSpan>
        }
        footer={this.renderFooter(canAddSortKey)}
        width="400px"
      >
        <Flex column>
          <Flex justify="flex-end">
            <Button
              disabled={!canClear}
              onClick={this.clearSorts}
              color={canClear ? 'blue' : 'darkBlue3'}
              font="bodyMedium"
              type="transparent"
              px={0}
              py={0}
              mr={4}
            >
              Clear
            </Button>
          </Flex>
          <ColumnMultiSortList
            sortKeys={sortKeys}
            labels={labels}
            columns={sortOptions}
            removeSortKey={this.removeSortKey}
            updateSortKey={this.updateSortKey}
            columnTypes={columnTypes}
          />
        </Flex>
      </Modal>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ColumnMultiSorter/ColumnMultiSorterModal.js