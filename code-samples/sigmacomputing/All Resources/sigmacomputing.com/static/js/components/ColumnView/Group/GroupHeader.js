// @flow

import React, { PureComponent } from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames/bind';
import type { LevelId } from '@sigmacomputing/sling';

import ItemTypes from 'const/ItemTypes';
import { Box, CollapseButton, Flex, Icon, IconButton } from 'widgets';
import styles from './TreeGroup.less';
const cx = classnames.bind(styles);

function collect(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

export class GroupHeader extends PureComponent<{
  addColumn: LevelId => void,
  collapseLevel: LevelId => void,
  hideLevel: (LevelId, boolean) => void,
  isCollapsed: boolean,
  isLevelHidden: boolean,
  levelId: LevelId
}> {
  addColumn = () => {
    const { addColumn, levelId } = this.props;
    addColumn(levelId);
  };

  hideLevel = () => {
    const { hideLevel, isLevelHidden, levelId } = this.props;
    hideLevel(levelId, !isLevelHidden);
  };

  collapseLevel = () => {
    const { collapseLevel, levelId } = this.props;
    collapseLevel(levelId);
  };

  render() {
    const { isCollapsed, levelId } = this.props;
    return (
      <Flex
        className={cx('header')}
        font="header6"
        mx={-2}
        justify="flex-end"
        align="center"
      >
        <CollapseButton
          isCollapsed={isCollapsed}
          mr={2}
          onClick={this.collapseLevel}
        />
        {levelId === 'global' && (
          <Box mr={2}>
            <Icon mx={2} size="16px" type="sigma-letter" />
            TOTALS
          </Box>
        )}
        <Box className={cx('line')} flexGrow={true} mr={2} />
        {!isCollapsed && <IconButton onClick={this.addColumn} type="plus" />}
      </Flex>
    );
  }
}

function HeaderDropzone({ connectDropTarget, ...props }) {
  return connectDropTarget(
    <div>
      <GroupHeader {...props} />
    </div>
  );
}

export default DropTarget(
  [ItemTypes.COLUMN_HEADER, ItemTypes.COLUMN],
  {},
  collect
)(HeaderDropzone);



// WEBPACK FOOTER //
// ./src/components/ColumnView/Group/GroupHeader.js