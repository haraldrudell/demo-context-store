// @flow
import React, { PureComponent } from 'react';
import {
  type Relationship,
  type Input,
  type Query,
  inputGetColumns,
  inputGetName
} from '@sigmacomputing/sling';
import classnames from 'classnames/bind';

import type { SourceColumn } from 'types';
import { Box, Button, Icon, IconButton, Text } from 'widgets';
import BindingEditor from 'components/inspector/source/BindingEditor';
import styles from './RelationshipEditor.less';
const cx = classnames.bind(styles);

type Props = {
  query: Query,
  sourceLabel: string,
  relationship: ?Relationship,
  targetInput: ?Input,
  header: string,
  onClose: () => void,
  onBack: () => void,
  onSubmit: () => void,
  addBinding: () => void
};

function pickDefaultTargetColumn(sourceLabel = '', targetColumns) {
  // this is dumb but effective
  // if there's a name match, use it.  otherwise just start with the first column
  const fromLabel = sourceLabel.toLowerCase();

  let idx = targetColumns.findIndex(x => x.name.toLowerCase() === fromLabel);
  if (idx === -1) idx = 0; // no name match, use first column
  return targetColumns[idx].name;
}

export default class RelationshipEditor extends PureComponent<
  Props,
  {
    sourceLabel: string,
    sourceColumns: Array<SourceColumn>,
    targetInput: Input,
    bindings: Array<{ source: string, target: string }>
  }
> {
  constructor(props: Props) {
    super(props);

    const { relationship, sourceLabel, targetInput } = props;
    // Relationship target has to be an external table
    if (relationship && relationship.target.type === 'external') {
      const bindings = [];
      for (let i = 0; i < relationship.sourceKeys.length; i++) {
        bindings.push({
          source: relationship.sourceKeys[i][1],
          target: relationship.targetKeys[i]
        });
      }

      this.state = {
        targetInput: relationship.target,
        sourceLabel: this.getSourceLabel(relationship.sourceKeys[0][0]),
        sourceColumns: this.getSourceColumns(relationship.sourceKeys[0][0]),
        bindings
      };
    } else if (targetInput) {
      const sourceColumns = this.getSourceColumns(null);

      this.state = {
        sourceColumns,
        sourceLabel,
        targetInput,
        bindings: [
          {
            source: sourceColumns[0].name,
            target: pickDefaultTargetColumn(
              sourceColumns[0].label,
              inputGetColumns(targetInput)
            )
          }
        ]
      };
    } else {
      throw new Error('No target table');
    }
  }

  getSourceLabel = (inputId: ?string) => {
    const { query, sourceLabel } = this.props;
    if (inputId === null || inputId === query.input.id) {
      return sourceLabel;
    }

    if (inputId) {
      const relationship = query.getRelationship(inputId);
      return relationship.name;
    }
    throw new Error(`Undefined inputId`);
  };

  getSourceColumns = (inputId: ?string) => {
    const { query } = this.props;
    if (inputId === null) {
      const columns = Object.keys(query.columns).map(columnId => {
        return {
          name: columnId,
          label: query.view.labels[columnId]
        };
      });

      // Source is current Query
      return columns;
    } else if (inputId === query.root) {
      return inputGetColumns(query.input).map(column => {
        return {
          label: column.name,
          name: column.name
        };
      });
    }

    if (inputId) {
      const { target } = query.getRelationship(inputId);
      // join target has to be an external table
      if (target.type === 'external') {
        return target.table.columns.map(column => {
          return {
            label: column.name,
            name: column.name
          };
        });
      }
      throw new Error(`Bad Join Target type: ${target.type}`);
    }

    throw new Error(`Undefined inputId`);
  };

  getRelationship = (): Relationship => {
    const { relationship } = this.props;
    const { bindings, targetInput } = this.state;
    const source = relationship ? relationship.sourceKeys[0][0] : null;

    return {
      name: inputGetName(targetInput),
      sourceKeys: bindings.map(b => [source, b.source]),
      target: targetInput,
      targetKeys: bindings.map(b => b.target)
    };
  };

  addBinding = () => {
    const { bindings, sourceColumns, targetInput } = this.state;

    if (targetInput) {
      let srcIndex = 0;
      // If there is an existing binding, default the new source binding
      // to be the column after the last one used
      if (bindings.length > 0) {
        const lastName = bindings[bindings.length - 1].source;
        const lastIdx = sourceColumns.findIndex(x => x.name === lastName);
        if (lastIdx !== -1 && lastIdx + 1 < sourceColumns.length) {
          srcIndex = lastIdx + 1;
        }
      }

      const srcLabel = sourceColumns[srcIndex].label;
      this.setState({
        bindings: [
          ...bindings,
          {
            source: sourceColumns[srcIndex].name,
            target: pickDefaultTargetColumn(
              srcLabel,
              inputGetColumns(targetInput)
            )
          }
        ]
      });
    }
  };

  deleteBinding = (index: number) => {
    const { bindings } = this.state;

    this.setState({
      bindings: [...bindings.slice(0, index), ...bindings.slice(index + 1)]
    });
  };

  updateBinding = (where: string, index: number, columnId: string) => {
    const { bindings, targetInput } = this.state;
    const { query } = this.props;
    const previousBinding = { ...bindings[index] };
    previousBinding[where] = columnId;
    if (where === 'source' && targetInput) {
      // source binding changed, pick a name matching target if available
      const srcLabel = query.view.labels[columnId];
      if (srcLabel) {
        previousBinding['target'] = pickDefaultTargetColumn(
          srcLabel,
          inputGetColumns(targetInput)
        );
      }
    }

    this.setState({
      bindings: [
        ...bindings.slice(0, index),
        previousBinding,
        ...bindings.slice(index + 1)
      ]
    });
  };

  render() {
    const {
      header,
      onClose,
      onBack,
      onSubmit,
      addBinding,
      relationship
    } = this.props;
    const { sourceColumns, sourceLabel, targetInput } = this.state;

    return (
      <div className={styles.editor}>
        <Box className={styles.header} font="header3">
          {header || 'Join Data'}
          <IconButton onClick={onClose} type="close" />
        </Box>
        <div className={styles.body}>
          <Text font="bodyMedium">
            {/* TODO: Fix this description from the design... */}
            Relationships determine how data from secondary data sources are
            joined with primary data sources.
          </Text>
          <Box className={cx('flex-row', 'text')} font="header5">
            <div className="flex-item">Primary Table</div>
            <div className={styles.separator} />
            <div className="flex-item">Joining Table</div>
          </Box>
          <div className="flex-row align-center">
            <Box className={cx('flex-item', 'source')} font="header5">
              {sourceLabel}
            </Box>
            <Icon mx="10px" type="connection" />
            <Box className={cx('flex-item', 'source')} font="header5">
              {inputGetName(targetInput)}
            </Box>
          </div>
          <BindingEditor
            bindings={this.state.bindings}
            deleteBinding={this.deleteBinding}
            updateBinding={this.updateBinding}
            sourceColumns={sourceColumns}
            targetColumns={inputGetColumns(targetInput)}
          />
        </div>
        <div className={cx('footer', 'flex-row', 'align-center')}>
          <a onClick={addBinding}>
            <Text font="header5">+ Add New Link</Text>
          </a>
          <div className="flex-item" />
          {relationship ? (
            <Button key="cancel" type="secondary" onClick={onClose}>
              Cancel
            </Button>
          ) : (
            <Button key="back" type="secondary" onClick={onBack}>
              Back
            </Button>
          )}
          <Button key="submit" type="primary" onClick={onSubmit}>
            Apply
          </Button>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/inspector/source/RelationshipEditor.js