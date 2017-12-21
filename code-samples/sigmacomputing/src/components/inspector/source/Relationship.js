// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import { inputGetColumns, type Input } from '@sigmacomputing/sling';

import AutosizeInput from 'components/widgets/AutosizeInput';
import { Box, CollapseButton, IconButton } from 'widgets';
import ExternalTable from './ExternalTable';
import styles from './Relationship.less';
const cx = classnames.bind(styles);

type Props = {
  name: string,
  target: Input,
  onAddColumn: (string, string) => void,
  onEdit?: string => void,
  onRename?: (string, string) => void,
  onDelete?: string => void,
  setCurrentRelationship: (?string) => void,
  currentRelationship?: ?string
};

export default class Relationship extends PureComponent<
  Props,
  {
    isCollapsed: boolean
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isCollapsed: true
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      !this.state.isCollapsed &&
      nextProps.currentRelationship !== this.props.target.id
    ) {
      this.setState({ isCollapsed: true });
    }
  }

  toggleCollapsed = () => {
    const { setCurrentRelationship, target } = this.props;
    const isCollapsed = !this.state.isCollapsed;

    this.setState({ isCollapsed });

    if (isCollapsed) {
      setCurrentRelationship();
    } else {
      setCurrentRelationship(target.id);
    }
  };

  onEdit = () => {
    const { onEdit, target } = this.props;
    if (onEdit) {
      onEdit(target.id);
    }
  };

  onDelete = () => {
    const { onDelete, target } = this.props;
    if (onDelete) {
      onDelete(target.id);
    }
  };

  onRename = (newName: string) => {
    const { onRename, target } = this.props;
    if (onRename) {
      onRename(target.id, newName);
    }
  };

  render() {
    const {
      name,
      target,
      onAddColumn,
      onEdit,
      onDelete,
      onRename
    } = this.props;
    const { isCollapsed } = this.state;

    return (
      <Box font="bodyMedium">
        <div className={cx('flex-row align-center', 'relationship')}>
          <CollapseButton
            isCollapsed={isCollapsed}
            mr={1}
            onClick={this.toggleCollapsed}
          />
          <div className="flex-item">
            {onRename ? (
              <AutosizeInput
                className={cx('tableName')}
                initialValue={name}
                onUpdate={this.onRename}
              />
            ) : (
              name
            )}
          </div>
          <div className={cx('flex-row align-center', 'buttons')}>
            {onEdit && <IconButton mr={2} onClick={this.onEdit} type="edit" />}
            {onDelete && <IconButton onClick={this.onDelete} type="trash" />}
          </div>
        </div>
        {!isCollapsed && (
          <ExternalTable
            inputId={target.id}
            columns={inputGetColumns(target)}
            onAddColumn={onAddColumn}
          />
        )}
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/inspector/source/Relationship.js