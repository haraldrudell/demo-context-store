// @flow

import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import type {
  ColumnId,
  LevelId,
  ValueType,
  SortKey
} from '@sigmacomputing/sling';

import { Box, Flex, Icon, IconButton, Text } from 'widgets';
import { getColumnTypeIcon } from 'utils/table';
import Label from 'components/widgets/Label';
import styles from './TreeColumn.less';
const cx = classnames.bind(styles);

type Props = {
  className?: string,
  label: string,
  isHidden: boolean,
  isSource: boolean,
  onClick?: (SyntheticInputEvent<>, ColumnId, LevelId) => void,
  onContextMenu?: (SyntheticMouseEvent<>) => void,
  id: ColumnId,
  levelId: LevelId,
  isSelected?: boolean,
  type?: ?ValueType,
  sortState?: ?SortKey,
  columnRename?: (id: ColumnId, label: string) => void
};

export default class TreeColumn extends PureComponent<
  Props,
  { isMenuShown: boolean }
> {
  static defaultProps = {
    className: ''
  };

  menu: HTMLElement;

  setMenuRef = (r: HTMLElement) => {
    this.menu = r;
  };

  onClick = (evt: SyntheticInputEvent<>) => {
    const { onClick, id, levelId } = this.props;
    if (onClick) onClick(evt, id, levelId);
  };

  onRename = (label: string) => {
    if (this.props.columnRename) {
      this.props.columnRename(this.props.id, label);
    }
  };

  render() {
    const {
      className = '',
      isHidden,
      isSource,
      label,
      type,
      sortState,
      onContextMenu
    } = this.props;

    return (
      <Flex
        align="center"
        className={cx('column', { isHidden }, className)}
        font="header5"
        onClick={this.onClick}
      >
        <div className={cx('typeIcon')}>{getColumnTypeIcon(type)}</div>
        <Box flexGrow>
          <Text font="header5" truncate>
            <Label
              label={label}
              onRename={this.onRename}
              inputClassName={cx('input')}
            />
          </Text>
        </Box>
        <Flex align="center">
          {isSource && <Icon mr={1} type="key" />}
          {sortState && (
            <Icon mr={1} type={sortState.isAsc ? 'sort-asc' : 'sort-desc'} />
          )}
          {onContextMenu && (
            <IconButton type="caret-down" onClick={onContextMenu} />
          )}
        </Flex>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ColumnView/Column/TreeColumn.js