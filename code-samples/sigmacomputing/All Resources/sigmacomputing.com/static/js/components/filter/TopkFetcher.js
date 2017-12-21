// @flow
import React, { PureComponent } from 'react';
import { formula } from '@sigmacomputing/sling';
import type {
  ColumnId,
  ConstVal,
  Query,
  PrimitiveType,
  Format
} from '@sigmacomputing/sling';
import { isEqual } from 'lodash';
import invariant from 'invariant';

import { Box } from 'widgets';
import { formatValue } from 'utils/format';
import { makeCancelable, type CancelablePromise } from 'utils/promise';
import { fetchTopK, needsEval, handleApiError } from 'utils/apiCaller';
import { setValueFilter } from 'utils/ColumnActions';
import { getData } from 'utils/column';
import {
  onToggleNulls,
  onSelectTopKValue,
  getNullSetting
} from 'utils/filters';
import NullFilter from './NullFilter';
import TextValueFilter from './TextValueFilter';
import type { ValueDesc } from 'components/filter/ValueFilter';

type Props = {
  query: Query,
  connectionId: string,
  setQuery: Query => void,
  selectedColumn: ColumnId,
  columnType: PrimitiveType,
  format?: Format
};

type State = {
  searchTerm: ?string,
  topValues: ?Array<ValueDesc>,
  searchValues: ?Array<ValueDesc>,
  selectedValues: Array<ValueDesc>
};

export default class TopkFetcher extends PureComponent<Props, State> {
  topKPromise: ?CancelablePromise;

  constructor(props: Props) {
    super(props);
    this.state = {
      searchTerm: null,
      topValues: null,
      searchValues: null,
      selectedValues: this.getSelectedValues(props.query, props.selectedColumn)
    };
  }

  componentDidMount() {
    const { query, selectedColumn } = this.props;
    this.fetch(query, selectedColumn, this.state.searchTerm);
  }

  componentWillUnmount() {
    if (this.topKPromise) {
      this.topKPromise.cancel();
      this.topKPromise = null;
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (needsEval(nextProps.query, this.props.query)) {
      this.setState({
        selectedValues: this.getSelectedValues(
          nextProps.query,
          nextProps.selectedColumn
        )
      });
    }
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (
      nextProps.selectedColumn !== this.props.selectedColumn ||
      needsEval(nextProps.query, this.props.query) ||
      nextState.searchTerm !== this.state.searchTerm
    ) {
      this.fetch(
        nextProps.query,
        nextProps.selectedColumn,
        nextState.searchTerm
      );
    }
  }

  getTopValues = (filterValues: Array<ConstVal>, result: any) => {
    const { _sigdim, _sigfilter_group_exclude } = result;
    const { type } = _sigdim;
    const maxValue = Math.max(..._sigfilter_group_exclude.data);
    const topValues = [];
    for (let i = 0; i < _sigdim.length; i++) {
      const val = getData(_sigdim, i);
      if (val != null) {
        const count = getData(_sigfilter_group_exclude, i);
        const label = formatValue(val, type);
        if (label && typeof count === 'number') {
          topValues.push({
            label,
            count,
            percent: count / maxValue,
            isSelected: Boolean(
              filterValues.find(
                value => value.val !== undefined && value.val === val
              )
            )
          });
        }
      }
    }

    return topValues;
  };

  getSelectedValues = (query: Query, selectedColumn: ColumnId) => {
    const { columnType } = this.props;
    const { filter } = query.columns[selectedColumn];
    const values = filter && filter.values ? filter.values : [];
    const selectedValues = [];

    values.forEach(value => {
      if (value.val !== undefined) {
        const label = formatValue(value.val, columnType);
        if (label) {
          selectedValues.push({
            label,
            count: null,
            percent: 0
          });
        }
      }
    });

    return selectedValues;
  };

  fetch = (query: Query, selectedColumn: ColumnId, searchTerm: ?string) => {
    const { connectionId } = this.props;
    const filter = query.columns[selectedColumn].filter;
    const filterValues = filter && filter.values ? filter.values : [];

    if (this.topKPromise) {
      this.topKPromise.cancel();
    }

    this.topKPromise = makeCancelable(
      fetchTopK(query, selectedColumn, searchTerm || '', connectionId)
    );

    this.topKPromise.promise
      .then(v => {
        const result = v.table;
        const values = this.getTopValues(filterValues, result);
        if (!searchTerm) {
          this.setState({ topValues: values });
        } else {
          this.setState({ searchValues: values });
        }
      })
      .catch(e => {
        if (!e.isCanceled) {
          handleApiError('TopK Fetch Failure', e);
        }
      });
  };

  onSearch = (searchTerm: string) => {
    this.setState({ searchTerm: searchTerm === '' ? null : searchTerm });
  };

  onSearchClear = () => {
    this.setState({ searchTerm: null });
  };

  onSelect = (valueStr: string) => {
    const { selectedColumn, columnType, query, setQuery } = this.props;
    onSelectTopKValue(valueStr, selectedColumn, columnType, query, setQuery);
  };

  onRemove = (valueStr: string) => {
    const { selectedColumn, columnType, query, setQuery } = this.props;
    const { filter } = query.columns[selectedColumn];
    if (!filter) return;

    const values = filter.values || [];
    const v = formula.parseConstVal(valueStr, columnType);
    const newValues = values.filter(x => !isEqual(x, v));

    setQuery(
      setValueFilter(
        query,
        selectedColumn,
        filter.type === 'include',
        newValues
      )
    );
  };

  onToggleNulls = () => {
    const { query, selectedColumn, setQuery } = this.props;
    onToggleNulls(query, selectedColumn, setQuery);
  };

  handleSetInclude = (isInclude: boolean) => {
    const { selectedColumn, query, setQuery } = this.props;
    const { filter } = query.columns[selectedColumn];

    if (!filter) return;
    const values = filter.values || [];

    setQuery(setValueFilter(query, selectedColumn, isInclude, values));
  };

  render() {
    const { searchTerm, topValues, searchValues, selectedValues } = this.state;
    const { selectedColumn, query, columnType } = this.props;
    const filter = query.columns[selectedColumn].filter;
    invariant(
      filter &&
        (filter.type === 'include' || filter.type === 'exclude') &&
        filter.values,
      'Bad filter in TopkFetcher'
    );

    const includeNulls = getNullSetting(query, selectedColumn);
    // XXX JDF: null count NYI
    const nullFilter = (
      <NullFilter
        count={null}
        includeNulls={includeNulls}
        onChange={this.onToggleNulls}
      />
    );

    return (
      <div>
        <Box px={3}>
          <TextValueFilter
            isInclude={filter.type === 'include'}
            onRemove={this.onRemove}
            onSearch={columnType === 'text' ? this.onSearch : undefined}
            onSearchClear={this.onSearchClear}
            onSelect={this.onSelect}
            onSetInclude={this.handleSetInclude}
            searchTerm={searchTerm}
            selectedValues={selectedValues}
            searchValues={searchValues}
            topValues={topValues}
          />
        </Box>
        {nullFilter}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/TopkFetcher.js