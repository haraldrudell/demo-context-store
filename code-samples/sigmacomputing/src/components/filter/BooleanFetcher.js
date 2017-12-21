// @flow
import React, { PureComponent } from 'react';
import type {
  ColumnId,
  Query,
  PrimitiveType,
  Format
} from '@sigmacomputing/sling';

import { Box } from 'widgets';
import { makeCancelable, type CancelablePromise } from 'utils/promise';
import { fetchTopK, needsEval, handleApiError } from 'utils/apiCaller';
import { getData } from 'utils/column';
import { onToggleNulls, onSelectTopKValue } from 'utils/filters';
import BooleanFilter from 'components/filter/BooleanFilter';

type Props = {
  query: Query,
  connectionId: string,
  setQuery: Query => void,
  selectedColumn: ColumnId,
  columnType: PrimitiveType,
  format?: Format
};

type State = {
  trueCount: ?number,
  falseCount: ?number,
  nullCount: ?number,
  trueSelected: boolean,
  falseSelected: boolean,
  nullSelected: boolean
};

export default class BooleanFetcher extends PureComponent<Props, State> {
  topKPromise: ?CancelablePromise;

  constructor(props: Props) {
    super(props);
    const selected = this.getBooleanSelections(
      props.query,
      props.selectedColumn
    );
    this.state = {
      trueCount: null,
      falseCount: null,
      nullCount: null,
      trueSelected: selected.true,
      falseSelected: selected.false,
      nullSelected: selected.null
    };
  }

  componentDidMount() {
    const { query, selectedColumn } = this.props;
    this.fetch(query, selectedColumn);
  }

  componentWillUnmount() {
    if (this.topKPromise) {
      this.topKPromise.cancel();
      this.topKPromise = null;
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (needsEval(nextProps.query, this.props.query)) {
      const selected = this.getBooleanSelections(
        nextProps.query,
        nextProps.selectedColumn
      );
      this.setState({
        trueSelected: selected.true,
        falseSelected: selected.false,
        nullSelected: selected.null
      });
    }
  }

  componentWillUpdate(nextProps: Props) {
    if (
      nextProps.selectedColumn !== this.props.selectedColumn ||
      needsEval(nextProps.query, this.props.query)
    ) {
      this.fetch(nextProps.query, nextProps.selectedColumn);
    }
  }

  getBooleanSelections = (query: Query, selectedColumn: string) => {
    const filter = query.columns[selectedColumn].filter;
    const filterValues = filter && filter.values ? filter.values : [];
    return {
      true: filterValues.findIndex(v => v.val != null && v.val === true) !== -1,
      false:
        filterValues.findIndex(v => v.val != null && v.val === false) !== -1,
      null: filterValues.findIndex(v => v.type === 'null') !== -1
    };
  };

  getBooleanCounts = (result: any) => {
    const { _sigdim, _sigfilter_group_exclude } = result;

    // Do not rely on the backend providing these in the same order forever.
    const counts = {};
    for (let i = 0; i < _sigdim.length; i++) {
      const val = getData(_sigdim, i);
      const count = getData(_sigfilter_group_exclude, i);
      counts[String(val)] = count;
    }

    return counts;
  };

  fetch = (query: Query, selectedColumn: ColumnId) => {
    const { connectionId } = this.props;

    if (this.topKPromise) {
      this.topKPromise.cancel();
    }

    // searchTerm is '' to disallow search
    this.topKPromise = makeCancelable(
      fetchTopK(query, selectedColumn, '', connectionId)
    );

    this.topKPromise.promise
      .then(v => {
        const result = v.table;
        const counts = this.getBooleanCounts(result);
        this.setState({
          trueCount: counts.true,
          falseCount: counts.false,
          nullCount: counts.null
        });
      })
      .catch(e => {
        if (!e.isCanceled) {
          handleApiError('TopK (Boolean) Fetch Failure', e);
        }
      });
  };

  onSelect = (valueStr: string) => {
    const { selectedColumn, columnType, query, setQuery } = this.props;
    onSelectTopKValue(valueStr, selectedColumn, columnType, query, setQuery);
  };

  onToggleNulls = () => {
    const { query, selectedColumn, setQuery } = this.props;
    onToggleNulls(query, selectedColumn, setQuery);
  };

  render() {
    const {
      trueCount,
      falseCount,
      nullCount,
      trueSelected,
      falseSelected,
      nullSelected
    } = this.state;

    return (
      <Box p={3}>
        <BooleanFilter
          trueCount={trueCount}
          falseCount={falseCount}
          nullCount={nullCount}
          trueSelected={trueSelected}
          falseSelected={falseSelected}
          nullSelected={nullSelected}
          onSelect={this.onSelect}
          onToggleNulls={this.onToggleNulls}
        />
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/BooleanFetcher.js