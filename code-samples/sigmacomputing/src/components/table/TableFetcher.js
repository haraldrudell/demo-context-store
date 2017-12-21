// @flow
import React, { PureComponent } from 'react';
import Raven from 'raven-js';
import { Query, type Anchor } from '@sigmacomputing/sling';
import invariant from 'invariant';

import { isProd } from 'env';
import type {
  Id,
  Selection,
  Values,
  ColumnTypes,
  Status,
  FetchDirection
} from 'types';
import { LaserBeam } from 'widgets';
import StatusBar from 'components/StatusBar';
import Loading from 'components/widgets/Loading';
import { FETCH_SIZE, ROW_HEIGHT } from 'const/TableConstants';
import { makeCancelable, type CancelablePromise } from 'utils/promise';
import { evalQuery, needsEval, handleApiError } from 'utils/apiCaller';
import {
  popRow,
  shiftRow,
  getFullRowCount,
  getAnchorKeyFlatOffset,
  isValidAnchor
} from 'utils/table';
import RowCountFetcher from 'components/RowCount';
import ShowSql from 'components/ShowSql';
import { TableData } from './tableData';
import { mkTableData } from './fetchUtil';
import QueryTable from './QueryTable';
import SelectionValidator from './SelectionValidator';

const DEFAULT_ERROR_MESSAGE = 'Unable to Evaluate Request';
const QUERY_TIMEOUT = 'Database query has timed out';
const ERROR_MESSAGE_MAP = {
  '400': 'Invalid Query',
  '401': 'Unauthorized User',
  '500': 'Server Error',
  // 502 and 504 are timeouts from the nginx proxy.  For now, we just interprete those as query timeouts
  '502': QUERY_TIMEOUT,
  '504': QUERY_TIMEOUT
};

type Props = {
  connectionId: Id,
  query: Query,
  columnTypes: ColumnTypes,
  selection: Selection,
  setSelection: Selection => void,
  setQuery: Query => void
};

type LoadAction = 'SELECT_ANCHOR' | 'SCROLL_PREV_PAGE';

type State = {
  status: ?Status,
  tableData: ?TableData,
  anchor: ?Anchor
};

const LOADING_STATUS = { type: 'loading' };
const ANCHOR_FETCH_START = -(FETCH_SIZE / 2) - 1; // start fetching at -501 when we have an anchor

export default class TableFetcher extends PureComponent<Props, State> {
  fetchPromise: ?CancelablePromise;
  tableRef: ?QueryTable;
  lastValue: ?Values;
  loadAction: ?LoadAction;

  constructor(props: Props) {
    super(props);
    this.state = {
      status: null,
      tableData: undefined,
      anchor: null
    };
  }

  componentDidMount() {
    const { query, connectionId } = this.props;
    this.fetchValue(
      query,
      null,
      0,
      FETCH_SIZE + 1,
      connectionId,
      this.onNewLoad
    );
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (
      nextState.anchor !== this.state.anchor ||
      needsEval(nextProps.query, this.props.query)
    ) {
      let { anchor } = nextState;

      if (anchor && !isValidAnchor(nextProps.query, anchor)) {
        // query and anchor are no longer compatible.  kill the anchor
        anchor = null;
        this.setState({ anchor });
      }

      if (this.fetchPromise) {
        this.fetchPromise.cancel();
      }
      let offset = 0;
      let limit = FETCH_SIZE + 1;
      if (anchor) {
        // if we're anchored then fetch [-501, 501] so we have rows surrounding the anchor
        offset = ANCHOR_FETCH_START;
        limit = FETCH_SIZE + 2;
      }

      // re-load
      this.fetchValue(
        nextProps.query,
        anchor,
        offset,
        limit,
        nextProps.connectionId,
        this.onNewLoad
      );
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { selection } = this.props;
    const { tableData, anchor } = this.state;
    if (tableData && tableData !== prevState.tableData) {
      // table loaded a new value or fetched more
      const { loadAction, lastValue, tableRef } = this;
      if (
        loadAction === 'SELECT_ANCHOR' &&
        lastValue &&
        anchor &&
        selection.type === 'cell'
      ) {
        // We expanded / collapsed so migrate the selection to scroll the
        // expanded / collapsed cell into view
        const flatOffset = getAnchorKeyFlatOffset(anchor.key, lastValue);
        if (flatOffset !== null && flatOffset !== undefined) {
          this.props.setSelection({
            ...selection,
            flatOffset
          });
        }
      } else if (loadAction === 'SCROLL_PREV_PAGE' && lastValue && tableRef) {
        const { scrollTop } = tableRef.getScrollPosition();
        const flatCount = getFullRowCount(lastValue);
        tableRef.forceScroll({
          scrollTop: scrollTop + flatCount * ROW_HEIGHT
        });
      }
      this.loadAction = null;
      this.lastValue = null;
    }
  }

  onNewLoad = (query: Query, anchor: ?Anchor, offset: number, v: Values) => {
    const fullRowCount = getFullRowCount(v);
    const tableData = mkTableData(v, anchor, offset, fullRowCount);
    this.setState({
      status: null,
      tableData
    });
  };

  fetchValue = (
    query: Query,
    _anchor: ?Anchor,
    offset: number,
    limit: number,
    connectionId: string,
    onFetch: (query: Query, anchor: ?Anchor, offset: number, v: Values) => void
  ) => {
    if (this.fetchPromise) {
      this.fetchPromise.cancel();
      this.fetchPromise = null;
    }
    let anchor = _anchor;
    if (anchor) {
      // If we're anchored on a column that is no longer in the query, then we need to clear the anchor
      for (const colId of Object.keys(anchor.key)) {
        if (!query.columns[colId]) {
          anchor = null;
          this.setState({ anchor });
          break;
        }
      }
    }
    const p = makeCancelable(
      evalQuery(query, offset, limit, anchor, connectionId)
    );
    this.setState({ status: LOADING_STATUS });

    p.promise
      .then(v => {
        // fetch is complete, remove loading state
        this.fetchPromise = null;
        this.lastValue = v.table;
        onFetch(query, anchor, offset, v.table);
      })
      .catch(e => {
        this.fetchPromise = null;
        if (!e.isCanceled) {
          // fetch is complete, set error state
          // TODO -- we should pop a sad sigma banner for the non-api case
          handleApiError('Eval Failure', e);
          const { error, isJSON } = e;
          const { code, message } = error;
          const info = ERROR_MESSAGE_MAP[code];

          if (isProd && !info) {
            // XXX KT: I want to log message codes that we don't have
            // So we make sure we give the appropriate message for each
            Raven.captureMessage(`Missing appropriate message for ${code}`, {
              extra: {
                info: e.error
              }
            });
          }

          this.setState({
            status: {
              type: 'error',
              message: isJSON ? message : '',
              info: info || DEFAULT_ERROR_MESSAGE
            }
          });
        }
      });

    this.fetchPromise = p;
  };

  componentWillUnmount() {
    if (this.fetchPromise) {
      this.fetchPromise.cancel();
      this.fetchPromise = null;
    }
  }

  fetchNextPage = (direction: FetchDirection) => {
    const { query, connectionId } = this.props;
    const { status, tableData, anchor } = this.state;

    invariant(
      tableData &&
        ((direction === 'next' && tableData.hasNext) ||
          (direction === 'prev' && tableData.hasPrev)),
      `fetchNextPage called with bad state: ${direction}`
    );

    if (status && status.type === 'loading') {
      // already loading. bail
      return;
    }

    let offset;

    if (direction === 'next') {
      offset = tableData.offset + tableData.limit;
    } else {
      // if offset is -500, then we want to fetch -1501, LIMIT 1001
      // the first row tells us if there are more
      offset = tableData.offset - FETCH_SIZE - 1;

      // If we're fetching backward, we'll be prepending rows
      // so we need to adjust scrollTop to preserve our viewport position
      this.loadAction = 'SCROLL_PREV_PAGE';
    }

    // load next page
    this.fetchValue(
      query,
      anchor,
      offset,
      FETCH_SIZE + 1,
      connectionId,
      this.onNextPage
    );
  };

  onNextPage = (query: Query, anchor: ?Anchor, _offset: number, v: Values) => {
    const { tableData } = this.state;
    invariant(tableData, 'TableData never fetched');
    let hasMore = false;
    let limit = getFullRowCount(v);
    let offset = _offset;
    if (limit > FETCH_SIZE) {
      if (offset < 0) {
        // when we're prepending, the extra row is the first not the last
        shiftRow(v);
        offset++;
      } else {
        popRow(v);
      }
      hasMore = true;
      limit = FETCH_SIZE;
    }
    const mergedData = tableData.merge(query, v, offset, limit, hasMore);

    this.setState({
      status: null,
      tableData: mergedData
    });
  };

  setAnchor = (anchor: ?Anchor) => {
    this.loadAction = 'SELECT_ANCHOR';
    this.setState({ anchor });
  };

  setTableRef = (r: ?QueryTable) => {
    this.tableRef = r;
  };

  render() {
    const { tableData, status } = this.state;
    const {
      query,
      connectionId,
      selection,
      setQuery,
      setSelection,
      columnTypes
    } = this.props;

    let body;
    if (tableData) {
      body = (
        <SelectionValidator
          selection={selection}
          tableData={tableData}
          setSelection={setSelection}
        >
          <QueryTable
            ref={this.setTableRef}
            query={query}
            tableData={tableData}
            selection={selection}
            setQuery={setQuery}
            setSelection={setSelection}
            setAnchor={this.setAnchor}
            fetchNextPage={this.fetchNextPage}
            isFetchingMore={Boolean(status && status.type === 'loading')}
            columnTypes={columnTypes}
          />
        </SelectionValidator>
      );
    } else {
      body = <Loading text="Loading Table" />;
    }

    return (
      <div className="flex-column flex-item">
        <LaserBeam show={Boolean(status && status.type === 'loading')} />
        {body}
        <StatusBar
          rowCount={
            <RowCountFetcher query={query} connectionId={connectionId} />
          }
          showSql={<ShowSql query={query} connectionId={connectionId} />}
          status={status}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/TableFetcher.js