// @flow
import React, { PureComponent } from 'react';
import { cloneDeep, startCase } from 'lodash';
import {
  type Id,
  formula,
  type Relationship as RelationshipType,
  Query,
  inputGetColumns,
  inputGetName
} from '@sigmacomputing/sling';
import classnames from 'classnames/bind';

import type { DbConnectionType } from 'types';
import { Collapsible, Icon, IconButton, Text } from 'widgets';
import Relationship from './Relationship';
import RelationshipFetcher from './RelationshipFetcher';
import styles from './SourceInspector.less';
const cx = classnames.bind(styles);

type Props = {
  sourceLabel: string,
  query: Query,
  setQuery: Query => void,
  workbookId: Id,
  connection: DbConnectionType,
  sourcesOpen: boolean,
  onToggleSources: () => void
};

export default class SourceInspector extends PureComponent<
  Props,
  {
    showEditor: boolean,
    currentEditId: ?Id,
    currentRelationship: ?Id
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showEditor: false,
      currentEditId: null,
      currentRelationship: null
    };
  }

  addRelationship = (
    relationship: RelationshipType,
    deletedInputColumn: { [key: string]: boolean }
  ) => {
    const { query, setQuery } = this.props;
    const newQuery = cloneDeep(query);
    newQuery.addRelationship(relationship);

    const target = relationship.target;
    inputGetColumns(target).forEach(column => {
      // We only add columns that are not deleted
      if (!deletedInputColumn[column.name]) {
        const newColumnId = newQuery.addFormulaColumn(0);
        const relationshipRef = formula.nameRef([
          column.name,
          relationship.target.id
        ]);
        newQuery.setColumnFormula(newColumnId, relationshipRef);
        newQuery.columnLabelSet(newColumnId, startCase(column.name));
      }
    });
    setQuery(newQuery);
  };

  onRenameRelationship = (sourceId: Id, newLabel: string) => {
    const { query, setQuery } = this.props;
    const newQuery = cloneDeep(query);
    newQuery.setRelationshipName(sourceId, newLabel);
    setQuery(newQuery);
  };

  editRelationship = (relationship: RelationshipType) => {
    const { query, setQuery } = this.props;
    const { currentEditId } = this.state;
    if (!currentEditId) {
      throw new Error('Editing a unknown relationship');
    }

    const newQuery = cloneDeep(query);
    newQuery.setRelationshipKeys(
      currentEditId,
      relationship.sourceKeys,
      relationship.targetKeys
    );
    setQuery(newQuery);
  };

  onAddColumn = (inputId: string, columnName: string) => {
    const { query, setQuery } = this.props;
    const newQuery = cloneDeep(query);

    const newColumnId = newQuery.addFormulaColumn(0);
    const relationshipRef = formula.nameRef([columnName, inputId]);
    newQuery.setColumnFormula(newColumnId, relationshipRef);
    const columnLabel =
      inputId === newQuery.input.id
        ? startCase(columnName)
        : `${newQuery.getRelationship(inputId).name} ${startCase(columnName)}`;
    newQuery.columnLabelSet(newColumnId, columnLabel);
    setQuery(newQuery);
    // TODO: Select new Column
  };

  addSource = () => {
    this.setState({ showEditor: true });
  };

  deleteSource = (id: Id) => {
    const { query, setQuery } = this.props;
    const newQuery = cloneDeep(query);

    newQuery.deleteRelationship(id);
    setQuery(newQuery);
  };

  editSource = (id: Id) => {
    this.setState({
      showEditor: true,
      currentEditId: id
    });
  };

  closeEditor = () => {
    this.setState({ showEditor: false, currentEditId: null });
  };

  setCurrentRelationship = (id: ?Id) => {
    this.setState({
      currentRelationship: id
    });
  };

  renderModal() {
    const {
      onToggleSources,
      sourceLabel,
      query,
      query: { input, relationships },
      workbookId,
      connection
    } = this.props;
    const { showEditor, currentEditId, currentRelationship } = this.state;

    return (
      <div className={cx('modal')}>
        <div className={cx('container')}>
          <div
            className={cx(
              'header',
              'flex-row',
              'justify-space',
              'align-center'
            )}
          >
            <Text font="header4">Sources</Text>
            <IconButton type="close" onClick={onToggleSources} />
          </div>
          <div className={cx('relationshipContainer')}>
            <div>
              <Relationship
                name={`${inputGetName(input)} (Primary)`}
                target={input}
                onAddColumn={this.onAddColumn}
                setCurrentRelationship={this.setCurrentRelationship}
                currentRelationship={currentRelationship}
              />
            </div>
            <div>
              {relationships.map((relationship, i) => (
                <Relationship
                  key={i}
                  {...relationship}
                  onAddColumn={this.onAddColumn}
                  onDelete={this.deleteSource}
                  onEdit={this.editSource}
                  onRename={this.onRenameRelationship}
                  setCurrentRelationship={this.setCurrentRelationship}
                  currentRelationship={currentRelationship}
                />
              ))}
            </div>
          </div>
        </div>
        <RelationshipFetcher
          showEditor={showEditor}
          closeEditor={this.closeEditor}
          sourceLabel={sourceLabel}
          query={query}
          addRelationship={this.addRelationship}
          editRelationship={this.editRelationship}
          relationshipId={currentEditId}
          workbookId={workbookId}
          connection={connection}
        />
      </div>
    );
  }

  render() {
    const { onToggleSources, sourcesOpen } = this.props;

    const button = sourcesOpen ? (
      <Text font="header5">
        <div
          className={cx('flex-row align-center justify-end', 'footer')}
          onClick={this.addSource}
        >
          <Icon mr={2} type="plus" />
          <span>Join Data</span>
        </div>
      </Text>
    ) : (
      <div
        className={cx('flex-column align-center justify-center', 'footer')}
        onClick={onToggleSources}
      >
        <Text font="header5">Show Sources</Text>
      </div>
    );

    return (
      <div>
        <Collapsible open={sourcesOpen}>{this.renderModal()}</Collapsible>
        {button}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/inspector/source/SourceInspector.js