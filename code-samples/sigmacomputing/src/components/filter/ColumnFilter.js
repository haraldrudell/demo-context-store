// @flow
import React, { PureComponent } from 'react';
import type { Query, ValueType } from '@sigmacomputing/sling';
import { css } from 'emotion';

import type { Id, ColumnFilterType } from 'types';
import { setValueFilter, setRangeFilter } from 'utils/ColumnActions';
import FilterTitle from './FilterTitle';
import BooleanFetcher from './BooleanFetcher';
import TopkFetcher from './TopkFetcher';
import RangeFetcher from './RangeFetcher';

const RANGE_FILTER_TYPES = ['topk', 'range'];
const TOPK_FILTER_TYPES = ['topk'];

type Props = {
  query: Query,
  connectionId: string,
  setQuery: Query => void,
  columnId: Id,
  columnType: ?ValueType,
  deleteFilter: (columnId: Id) => void
};

const containerStyles = css`
  width: 268px;
  margin: 2px 0;
  background: white;
`;

function getFilterTypes(columnType) {
  if (columnType === 'datetime' || columnType === 'number') {
    return RANGE_FILTER_TYPES;
  }
  return TOPK_FILTER_TYPES;
}

function getColumnFilterType(filter) {
  return filter.type === 'range' ? 'range' : 'topk';
}

export default class ColumnFilter extends PureComponent<Props> {
  onDeleteFilter = () => {
    const { columnId, deleteFilter } = this.props;
    deleteFilter(columnId);
  };

  setActiveFilterType = (filterType: ColumnFilterType) => {
    const { query, setQuery, columnId } = this.props;
    if (filterType === 'range') {
      setQuery(setRangeFilter(query, columnId));
    } else {
      setQuery(setValueFilter(query, columnId));
    }
  };

  render() {
    const { query, setQuery, columnType, columnId, connectionId } = this.props;

    if (columnType === 'error') {
      // XXX JDF: this case doesn't work right now, just bail out
      return (
        <div className={containerStyles}>
          This column is broken. Please fix the formula or delete the filter.
        </div>
      );
    }

    if (!query.columns[columnId].filter) return null;

    let Fetcher;
    if (columnType === 'boolean') {
      Fetcher = BooleanFetcher;
    } else {
      const activeFilterType = getColumnFilterType(
        query.columns[columnId].filter
      );
      Fetcher = activeFilterType === 'range' ? RangeFetcher : TopkFetcher;
    }

    return (
      <div className={containerStyles}>
        <FilterTitle
          filterTypes={getFilterTypes(columnType)}
          onDelete={this.onDeleteFilter}
          setFilterType={this.setActiveFilterType}
          title={query.view.labels[columnId]}
        />
        <Fetcher
          query={query}
          connectionId={connectionId}
          setQuery={setQuery}
          selectedColumn={columnId}
          columnType={columnType || 'text'}
          format={query.view.formats[columnId]}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/ColumnFilter.js