// @flow
import React, { PureComponent } from 'react';
import {
  type Id,
  type Relationship,
  type Input,
  newInput,
  Query
} from '@sigmacomputing/sling';
import classnames from 'classnames/bind';
import { cloneDeep } from 'lodash';

import type { DbConnectionType } from 'types';
import { makeCancelable, type CancelablePromise } from 'utils/promise';
import { describe, describeComposed, handleApiError } from 'utils/apiCaller';
import DataSourceFetcher from 'components/DataSource';
import RelationshipEditor from './RelationshipEditor';
import styles from './RelationshipFetcher.less';
const cx = classnames.bind(styles);

const JOIN_HEADER = 'Join Data';

type Props = {
  sourceLabel: string,
  query: Query,
  addRelationship: (Relationship, { [key: string]: boolean }) => void,
  editRelationship: Relationship => void,
  relationshipId: ?Id,
  showEditor: boolean,
  closeEditor: () => void,
  workbookId: Id,
  connection: DbConnectionType
};

export default class RelationshipFetcher extends PureComponent<
  Props,
  {
    joinQuery: ?Query,
    deletedColumns: { [key: string]: boolean },
    targetInput: ?Input,
    error: string
  }
> {
  editor: ?RelationshipEditor;
  fetchPromise: ?CancelablePromise;
  loadWorkbookPromise: ?CancelablePromise;

  constructor(props: Props) {
    super(props);

    this.state = {
      deletedColumns: {},
      joinQuery: null,
      targetInput: null,
      error: ''
    };
  }

  componentWillUnmount() {
    if (this.fetchPromise) {
      this.fetchPromise.cancel();
    }
    if (this.loadWorkbookPromise) {
      this.loadWorkbookPromise.cancel();
    }
  }

  handleError = (e: { isCanceled: boolean, error: ?{ message: string } }) => {
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
      handleApiError('Describe Failure in Join', e);
    }
  };

  onSelectTable = (scope: Array<string>, name: string) => {
    this.resetQuery();
    if (scope && name) {
      const connectionId = this.props.connection.id;
      this.fetchPromise = makeCancelable(
        describe(scope, name, 'table', connectionId)
      );
      return this.fetchPromise.promise
        .then(({ table }) => {
          const input = newInput(table);
          const query = new Query(input);
          this.setState({
            joinQuery: query
          });
        })
        .catch(this.handleError);
    } else {
      throw new Error('Missing scope/name');
    }
  };

  createFromComposed = (wsId: Id) => {
    const connectionId = this.props.connection.id;

    this.resetQuery();
    this.loadWorkbookPromise = makeCancelable(
      describeComposed(wsId, connectionId)
    );

    return this.loadWorkbookPromise.promise
      .then(({ columns }) => {
        const input = {
          type: 'subQuery',
          wsId,
          columns,
          id: Query.genId()
        };
        const query = new Query(input);
        this.setState({
          joinQuery: query
        });
      })
      .catch(this.handleError);
  };

  resetQuery = () => {
    this.setState({
      joinQuery: null,
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

  setEditor = (r: ?RelationshipEditor) => {
    this.editor = r;
  };

  addBinding = () => {
    if (this.editor) this.editor.addBinding();
  };

  onNext = () => {
    const { joinQuery } = this.state;

    if (joinQuery) {
      this.setState({
        targetInput: joinQuery.input
      });
    }
  };

  onSubmit = () => {
    if (!this.editor) return;

    const { addRelationship, editRelationship, relationshipId } = this.props;
    const { deletedColumns, joinQuery } = this.state;
    const relationship = this.editor.getRelationship();

    if (relationshipId) {
      editRelationship(relationship);
    } else {
      const deletedInputColumn = {};
      Object.keys(deletedColumns).forEach(columnId => {
        if (deletedColumns[columnId] && joinQuery) {
          const column = joinQuery.columns[columnId];
          if (column.def.def.type === 'nameRef') {
            const inputColumnId = column.def.def.id;
            deletedInputColumn[inputColumnId] = true;
          }
        }
      });
      addRelationship(relationship, deletedInputColumn);
    }
    this.onClose();
  };

  onBack = () => {
    this.setState({
      targetInput: null
    });
  };

  onClose = () => {
    if (this.fetchPromise) {
      this.fetchPromise.cancel();
    }
    this.setState({
      targetInput: null
    });
    this.props.closeEditor();
  };

  render() {
    const {
      sourceLabel,
      query,
      relationshipId,
      showEditor,
      workbookId,
      connection
    } = this.props;
    if (!showEditor) return null;
    const { targetInput, joinQuery, deletedColumns, error } = this.state;
    const isEditingLink = targetInput || relationshipId;

    const input = query.input;
    const lastScope = input.type === 'external' ? input.table.scope : null;

    const connections = {};
    connections[connection.id] = connection;

    return (
      <div>
        <div className={cx('backdrop')} />
        <div className={cx('modal')}>
          {isEditingLink && (
            <RelationshipEditor
              ref={this.setEditor}
              sourceLabel={sourceLabel}
              targetInput={targetInput}
              relationship={
                relationshipId ? query.getRelationship(relationshipId) : null
              }
              query={query}
              header={JOIN_HEADER}
              onClose={this.onClose}
              onBack={this.onBack}
              onSubmit={this.onSubmit}
              addBinding={this.addBinding}
            />
          )}
          {!relationshipId && (
            <div className={cx({ isHidden: isEditingLink })}>
              <DataSourceFetcher
                lastScope={lastScope}
                hasNext
                onApply={this.onNext}
                workbookId={workbookId}
                query={joinQuery}
                resetQuery={this.resetQuery}
                toggleColumn={this.toggleColumn}
                deletedColumns={deletedColumns}
                error={error}
                header={JOIN_HEADER}
                onSelectTable={this.onSelectTable}
                onSelectWorksheet={this.createFromComposed}
                onClose={this.onClose}
                selectedConnection={connection}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/inspector/source/RelationshipFetcher.js