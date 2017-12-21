// @flow
import * as React from 'react';

import type { DbConnectionType, Id } from 'types';
import type { TableObject } from 'types/table';
import type { QuerySource } from 'types/workbook';
import { makeCancelable, type CancelablePromise } from 'utils/promise';
import { list, handleApiError } from 'utils/apiCaller';

function cmp(t1 = {}, t2 = {}) {
  const a = (t1.name || '').toLowerCase();
  const b = (t2.name || '').toLowerCase();
  if (a < b) return -1;
  else if (a > b) return 1;
  return 0;
}

type Props = {
  selectedConnection: ?{ id: Id, label: string },
  workbookId?: Id,
  connections: { [string]: DbConnectionType },
  selectConnection?: Id => Promise<?Id>,
  onSelectTable: (Array<string>, string) => Promise<*>,
  resetQuery: () => void
};

type State = {
  listError: string,

  source: QuerySource,
  namePattern: ?string,
  listResult: ?Array<?Array<TableObject>>,
  selectedScope: Array<string>, // database / schema etc selected by the user
  scopes: Array<string> // scope hierarchy for this database connection eg ['schema']
};

export default function HoCFetcher(
  WrappedDataSource: React.ComponentType<any>
) {
  return class DataSource extends React.PureComponent<Props, State> {
    listPromise: ?CancelablePromise;

    constructor(props: Props) {
      super(props);

      this.state = {
        listError: '',
        source: 'table',
        namePattern: null,
        selectedScope: [],
        listResult: undefined,
        scopes: []
      };
    }

    componentWillMount() {
      this.fetchListResult();
    }

    componentWillUnmount() {
      if (this.listPromise) {
        this.listPromise.cancel();
        this.listPromise = null;
      }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
      // Composing Worksheets should not rely on scoping or list results
      // so we can ignore this
      if (this.state.source !== 'query') {
        if (prevProps.selectedConnection !== this.props.selectedConnection) {
          this.setDatabaseScope();
        } else if (
          prevState.namePattern !== this.state.namePattern ||
          prevState.selectedScope !== this.state.selectedScope
        ) {
          this.fetchListResult(this.state.namePattern);
        }
      } else {
        if (this.listPromise) {
          // We should remove errors if switching to compose worksheet
          this.listPromise.cancel();
        }
        this.setState({
          listError: ''
        });
      }
    }

    setDatabaseScope = () => {
      this.props.resetQuery();
      this.setState({
        selectedScope: [],
        scopes: [],
        listResult: undefined,
        namePattern: null // TODO: Add Name Pattern Later
      });
    };

    fetchListResult(namePattern: ?string) {
      if (this.listPromise) {
        this.listPromise.cancel();
      }
      this.setState({
        listError: ''
      });

      const { selectedConnection } = this.props;
      let { selectedScope, source, scopes } = this.state;

      // We don't need to fetch if we don't have a selected connection
      // XXX: SQL doesn't use Scopes so we don't do anything here
      if (!selectedConnection || source !== 'table') {
        return;
      }

      // Note: selectedScope.length > scopes.length means we have table selected
      if (selectedScope.length > scopes.length) {
        return this.onSelectTable();
      }

      this.listPromise = makeCancelable(
        list('table', selectedScope, namePattern, selectedConnection.id)
      );

      this.listPromise.promise
        .then(x => {
          const { objects, scopes } = x;

          const r = this.state.listResult || [];
          const items = objects.sort(cmp);
          r[selectedScope.length] = items;
          let newSelectedScope = this.state.selectedScope || [];

          if (
            items.length > 0 &&
            source !== 'sql' &&
            (selectedScope.length < scopes.length || items.length === 1)
          ) {
            // selectedScope.length < scopes.length means that this is loading
            // the table scopes so we shouldn't auto-select unless it was the
            // only table
            newSelectedScope = newSelectedScope.slice();

            // We try to determine if there is a public schema if there is we
            // will select that since most users' data is in public
            const item = items.find(item => item.name === 'public') || items[0];
            newSelectedScope[newSelectedScope.length] = item.name;
          }

          this.setState({
            selectedScope: newSelectedScope,
            scopes: scopes,
            listResult: r
          });
        })
        .catch(e => {
          if (!e.isCanceled) {
            this.setState({
              listError: e.error.message
            });
            handleApiError('List Failure', e);
          }
        });
    }

    onSelectTable = () => {
      const { listResult, selectedScope } = this.state;
      const tableName = selectedScope[selectedScope.length - 1];

      if (listResult) {
        const result = listResult[listResult.length - 1];
        if (result) {
          const table = result.find(t => t.name === tableName);
          if (table) {
            return this.props.onSelectTable(table.scope, table.name);
          }
        }
      }
      throw new Error('ListResult undefined when selecting table');
    };

    setSource = (source: QuerySource) => {
      this.setState({
        source
      });
      this.setDatabaseScope();
    };

    setSelectedScope = (selectedScope: Array<string>) => {
      this.props.resetQuery();
      const listResult = this.state.listResult || [];
      const r = listResult.slice(0, selectedScope.length);
      this.setState({ selectedScope, listResult: r });
    };

    render() {
      const {
        source,
        selectedScope,
        listResult,
        scopes,
        listError
      } = this.state;
      return (
        <WrappedDataSource
          {...this.props}
          listError={listError}
          source={source}
          setSource={this.setSource}
          selectedScope={selectedScope}
          setSelectedScope={this.setSelectedScope}
          listResult={listResult}
          scopes={scopes}
        />
      );
    }
  };
}



// WEBPACK FOOTER //
// ./src/components/DataSource/DataSourceFetcher.js