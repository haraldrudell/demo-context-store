// @flow
import React, { PureComponent } from 'react';
import { newInput, Query } from '@sigmacomputing/sling';
import { cloneDeep } from 'lodash';

import type { RouterHistory } from 'react-router-dom';
import type { DbConnectionType, Id } from 'types';
import { makeCancelable, type CancelablePromise } from 'utils/promise';
import { createWorkbook, loadWorkbook } from 'api/workbook';
import { encodeWorksheetUrl } from 'utils/url';
import {
  handleApiError,
  describe,
  describeQuery,
  describeComposed
} from 'utils/apiCaller';
import DataSourceFetcher from 'components/DataSource';
import styles from 'containers/WorkbookPage/Workbook.less';
import invariant from 'invariant';

const DATA_SOURCE_HEADER = 'Add a Data Source';
const SQL_DEFAULT_WS_TITLE = 'New Worksheet from SQL';

type Props = {
  connections: Array<DbConnectionType>,
  currentFolder?: Id,
  defaultConnectionId: ?Id,
  history: RouterHistory,
  onSelectConnection: Id => void
};

export default class NewWorkbookForm extends PureComponent<
  Props,
  {
    connections: { [string]: DbConnectionType },
    currentConnectionId: ?Id,
    error: string,
    query: ?Query,
    deletedColumns: { [key: string]: boolean },
    wsTitle: string
  }
> {
  describePromise: CancelablePromise;

  constructor(props: Props) {
    super(props);

    const connections = {};
    for (const c of this.props.connections) {
      connections[c.id] = c;
    }

    let currentConnectionId = this.props.defaultConnectionId;
    if (currentConnectionId == null && this.props.connections.length > 0) {
      currentConnectionId = this.props.connections[0].id;
    }

    this.state = {
      connections: connections,
      currentConnectionId,
      query: null,
      deletedColumns: {},
      wsTitle: '',
      error: ''
    };
  }

  createWorkbook = (title: string) => {
    const { history, currentFolder } = this.props;
    const {
      connections,
      currentConnectionId,
      deletedColumns,
      query
    } = this.state;
    invariant(currentConnectionId != null, `currentConnectionId must be set`);
    invariant(query, 'Query undefined when creating Worksheet');

    const newQuery = cloneDeep(query);

    const connection = connections[currentConnectionId];

    Object.keys(deletedColumns).forEach(columnId => {
      if (deletedColumns[columnId]) {
        const levelId = newQuery.findColumnLevel(columnId);
        newQuery.deleteColumn(columnId, levelId);
      }
    });

    return createWorkbook(
      {
        title,
        connectionId: connection.id,
        connectionType: connection.type
      },
      newQuery,
      currentFolder
    ).then(workbookId => {
      history.push(encodeWorksheetUrl(workbookId, title));
    });
  };

  handleError = (
    e: { isCanceled: boolean, error: ?{ message: string } },
    ignoreError?: boolean
  ) => {
    if (!e.isCanceled) {
      if (e.error && e.error.message) {
        this.setState({
          error: e.error.message
        });
      } else {
        this.setState({
          error: 'Unknown Error: Please contact Sigma support!'
        });
      }

      if (!ignoreError) {
        handleApiError('Describe Failure', e);
      }
    }
  };

  onSelectConnection = (connectionId: Id) => {
    this.setState({ currentConnectionId: connectionId });
    this.props.onSelectConnection(connectionId);
  };

  onCreateWorksheet = () => {
    const { query } = this.state;
    invariant(query, 'Query undefined when creating Worksheet');

    let title = SQL_DEFAULT_WS_TITLE;
    switch (query.input.type) {
      case 'customSQL':
        break;
      case 'external':
        title = query.input.table.name;
        break;
      case 'subQuery':
        title = `${this.state.wsTitle} Link`;
        break;
      default:
        invariant(false, `Invalid InputType ${query.input.type}`);
    }

    this.createWorkbook(title);
  };

  onSelectTable = (scope: Array<string>, tableName: string) => {
    const { currentConnectionId } = this.state;
    invariant(currentConnectionId != null, `currentConnectionId must be set`);

    this.resetQuery();
    this.describePromise = makeCancelable(
      describe(scope, tableName, 'table', currentConnectionId)
    );

    return this.describePromise.promise
      .then(({ table }) => {
        this.setState({
          query: new Query(newInput(table))
        });
      })
      .catch(this.handleError);
  };

  resetQuery = () => {
    if (this.describePromise) {
      this.describePromise.cancel();
    }
    this.setState({
      query: null,
      error: '',
      deletedColumns: {}
    });
  };

  toggleColumn = (columnIds: Array<string>) => {
    const { deletedColumns } = this.state;
    const newDeletedColumns = cloneDeep(deletedColumns);

    columnIds.forEach(columnId => {
      newDeletedColumns[columnId] = !newDeletedColumns[columnId];
    });
    this.setState({
      deletedColumns: newDeletedColumns
    });
  };

  onSetSql = (sql: string) => {
    const { currentConnectionId } = this.state;
    invariant(currentConnectionId != null, `currentConnectionId must be set`);

    let definition = sql;
    if (definition.endsWith(';')) {
      // Remove a trailing semi-colon from the SQL
      definition = definition.substring(0, definition.length - 1);
    }

    this.resetQuery();
    this.describePromise = makeCancelable(
      describeQuery(definition, currentConnectionId)
    );

    return this.describePromise.promise
      .then(({ table: { columns } }) => {
        this.setState({
          // XXX: This should probably have an Query API to create an input
          query: new Query({
            type: 'customSQL',
            definition,
            columns,
            id: Query.genId()
          })
        });
      })
      .catch(e => {
        return this.handleError(e, e.error && e.error.code === 400);
      });
  };

  onSelectWorksheet = (sourceId: string) => {
    this.resetQuery();

    this.describePromise = makeCancelable(loadWorkbook(sourceId));
    return this.describePromise.promise
      .then(source => {
        const connectionId = source.connection.id;
        this.props.onSelectConnection(connectionId);
        this.setState({
          currentConnectionId: connectionId
        });

        this.describePromise = makeCancelable(
          describeComposed(sourceId, connectionId)
        );

        return this.describePromise.promise
          .then(({ columns }) => {
            this.setState({
              query: new Query({
                type: 'subQuery',
                wsId: sourceId,
                columns,
                id: Query.genId()
              }),
              wsTitle: source.title
            });
          })
          .catch(this.handleError);
      })
      .catch(this.handleError);
  };

  render() {
    const {
      connections,
      currentConnectionId,
      error,
      query,
      deletedColumns
    } = this.state;

    const currentConnection =
      currentConnectionId != null ? connections[currentConnectionId] : null;

    return (
      <div className={styles.emptyTab}>
        <div className={styles.tableListContainer}>
          <DataSourceFetcher
            onSelectTable={this.onSelectTable}
            onSelectWorksheet={this.onSelectWorksheet}
            header={DATA_SOURCE_HEADER}
            selectedConnection={currentConnection}
            connections={connections}
            selectConnection={this.onSelectConnection}
            onSetSql={this.onSetSql}
            query={query}
            error={error}
            resetQuery={this.resetQuery}
            deletedColumns={deletedColumns}
            toggleColumn={this.toggleColumn}
            onApply={this.onCreateWorksheet}
          />
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/library/NewWorkbookForm.js