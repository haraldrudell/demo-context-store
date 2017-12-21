// @flow
import React, { PureComponent } from 'react';
import { formula } from '@sigmacomputing/sling';
import type {
  ColumnId,
  ConstVal,
  Format,
  Query,
  ValueType
} from '@sigmacomputing/sling';

import { setRangeFilter } from 'utils/ColumnActions';
import { makeCancelable, type CancelablePromise } from 'utils/promise';
import {
  fetchNumericRange,
  fetchDatetimeRange,
  needsEval,
  handleApiError
} from 'utils/apiCaller';
import { MAX_BARS } from 'const/FilterConstants';
import type { Bin } from './RangeHistogram';
import RangeFilter from './RangeFilter';

type Props = {
  query: Query,
  connectionId: string,
  setQuery: Query => void,
  selectedColumn: ColumnId,
  format?: Format,
  columnType: ValueType
};

type Result = {|
  binStart: number,
  binEnd: number,
  bins: Array<Bin>,
  // XXX JDF: these values aren't used yet for display
  nullPreCount: number,
  nullPostCount: number
|};

const EMPTY_BIN = {
  preCount: 0,
  postCount: 0
};

const EMPTY_RESULT = {};

function fromConstNum(v: ?ConstVal): ?number {
  return v == null || v.type !== 'number' ? null : formula.toNum(v);
}

function fromConstDate(v: ?ConstVal): ?number {
  return v == null || v.type !== 'datetime' ? null : +new Date(v.val);
}

function toConstNum(v: ?number): ?ConstVal {
  return v == null ? null : formula.numVal(v);
}

function toConstDate(v: ?number): ?ConstVal {
  return v == null ? null : formula.datetimeVal(new Date(v).toISOString());
}

function scaleVal(v: string, ty: ValueType): number {
  const num = +v;
  if (ty === 'datetime')
    // The backend returns unix seconds, so convert to millis.
    return num * 1000;
  return num;
}

function getSelection(query, selectedColumn, columnType) {
  const filter = query.columns[selectedColumn].filter;
  if (!filter || filter.type !== 'range')
    throw new Error('Invalid filter for range');

  if (columnType === 'number') {
    return [fromConstNum(filter.low), fromConstNum(filter.high)];
  } else {
    return [fromConstDate(filter.low), fromConstDate(filter.high)];
  }
}

function getNullSetting(query, selectedColumn) {
  const filter = query.columns[selectedColumn].filter;
  if (!filter || filter.type !== 'range')
    throw new Error('Invalid filter for range');
  return Boolean(filter.includeNulls);
}

export default class RangeFetcher extends PureComponent<
  Props,
  {|
    includeNulls: boolean,
    result: ?Result,
    selection: [?number, ?number]
  |}
> {
  fetchPromise: ?CancelablePromise;

  constructor(props: Props) {
    super(props);

    const { query, selectedColumn, columnType } = props;
    this.state = {
      includeNulls: getNullSetting(query, selectedColumn),
      result: null,
      selection: getSelection(query, selectedColumn, columnType)
    };
  }

  componentDidMount() {
    const { query, selectedColumn, columnType } = this.props;
    this.fetchPromise = this.fetch(query, selectedColumn, columnType);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { query, selectedColumn, columnType } = nextProps;
    if (selectedColumn !== this.props.selectedColumn) {
      // clear the query result so we don't show values from another column
      this.setState({ result: null });
    }

    if (
      selectedColumn !== this.props.selectedColumn ||
      query !== this.props.query
    ) {
      this.setState({
        includeNulls: getNullSetting(query, selectedColumn),
        selection: getSelection(query, selectedColumn, columnType)
      });
    }

    // If the column or query changes, then we need to re-fetch
    if (
      selectedColumn !== this.props.selectedColumn ||
      needsEval(query, this.props.query)
    ) {
      if (this.fetchPromise) this.fetchPromise.cancel();
      this.fetchPromise = this.fetch(query, selectedColumn, columnType);
    }
  }

  componentWillUnmount() {
    if (this.fetchPromise) this.fetchPromise.cancel();
  }

  handleResult = (result: any) => {
    if (result._sigzero.cells.length === 0) {
      this.setState({
        // XXX JDF: these values should make more sense
        result: {
          binStart: 0,
          binEnd: 10,
          bins: [],
          nullPreCount: 0,
          nullPostCount: 0
        }
      });
      return;
    }

    const { columnType } = this.props;

    const binStart = scaleVal(result._sigzero.cells[0][0], columnType);
    const binWidth = scaleVal(result._sigdelta.cells[0][0], columnType);

    let countBins = result._sigpre.cells.length;
    let nullPreCount = 0;
    let nullPostCount = 0;
    if (result._sigmax.cells[countBins - 1][0] === null) {
      // The last bin here contains the null count.
      countBins--;
      nullPreCount = +result._sigpre.cells[countBins][0];
      nullPostCount = +result._sigpost.cells[countBins][0];
    }

    const bins = [];
    for (let i = 0; i < countBins; i++) {
      const binIdx = result._sigbin.cells[i][0];
      while (binIdx > bins.length) {
        // The backend doesn't return empty bins, so we need to insert them.
        // `result._sigbin` contains the index of each bin, so we can use that
        // to identify gaps.
        bins.push(EMPTY_BIN);
      }

      const preCount = +result._sigpre.cells[i][0];
      const postCount = +result._sigpost.cells[i][0];
      if (
        i > 0 &&
        i === countBins - 1 &&
        result._sigmin.cells[i][0] === result._sigmax.cells[i][0]
      ) {
        // If the last bin contains a single point then we need to merge it
        // with the previous bin to avoid showing that there's a "false max"
        // `binWidth` too high.
        bins[bins.length - 1].preCount += preCount;
        bins[bins.length - 1].postCount += postCount;
      } else {
        bins.push({ preCount, postCount });
      }
    }

    const sigMaxIn = result._sigmax.cells[countBins - 1][0];
    const sigMax =
      columnType === 'datetime' ? +new Date(sigMaxIn + 'Z') : +sigMaxIn;
    const binEnd = Math.max(binStart + bins.length * binWidth, sigMax);

    this.setState({
      result: { binStart, binEnd, bins, nullPreCount, nullPostCount }
    });
  };

  fetch = (query: Query, selectedColumn: ColumnId, type: string) => {
    const { connectionId } = this.props;
    const fetchCall =
      type === 'number' ? fetchNumericRange : fetchDatetimeRange;
    const cancelablePromise = makeCancelable(
      fetchCall(query, selectedColumn, MAX_BARS, connectionId)
    );
    cancelablePromise.promise
      .then(v => {
        this.handleResult(v.table);
      })
      .catch(e => {
        if (!e.isCanceled) {
          handleApiError('Range Fetch Failure', e);
        }
      });
    return cancelablePromise;
  };

  onSelect = (lo: ?number, hi: ?number) => {
    this.update(lo, hi, this.state.includeNulls);
  };

  onToggleNulls = () => {
    const { includeNulls, selection } = this.state;
    this.update(selection[0], selection[1], !includeNulls);
  };

  update(lo: ?number, hi: ?number, includeNulls: boolean) {
    const { query, selectedColumn, setQuery, columnType } = this.props;
    let low, high;
    if (columnType === 'datetime') {
      low = toConstDate(lo);
      high = toConstDate(hi);
    } else {
      low = toConstNum(lo);
      high = toConstNum(hi);
    }
    setQuery(setRangeFilter(query, selectedColumn, low, high, includeNulls));
  }

  render() {
    const { columnType } = this.props;
    const { includeNulls, selection } = this.state;

    // We want the filter to render and allow interaction before the fetch returns
    const result = this.state.result || EMPTY_RESULT;

    if (columnType !== 'number' && columnType !== 'datetime')
      throw new Error(`Invalid columnType for RangeFilter: ${columnType}`);

    return (
      <RangeFilter
        binStart={result.binStart}
        binEnd={result.binEnd}
        bins={result.bins}
        columnType={columnType}
        includeNulls={includeNulls}
        nullCount={result.nullPreCount}
        onSelect={this.onSelect}
        onToggleNulls={this.onToggleNulls}
        selection={selection}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/RangeFetcher.js