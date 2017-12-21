// @flow
import * as React from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames/bind';
import type { Query } from '@sigmacomputing/sling';

import ItemTypes from 'const/ItemTypes';
import { isCopyDrag } from 'utils/dnd';
import styles from './TreeColumn.less';
const cx = classnames.bind(styles);

class ColumnMoveDropTarget extends React.PureComponent<{
  connectDropTarget: (React.Element<any>) => any,
  canMoveColumn: (Object, Object) => boolean,
  moveColumn: (Object, Object, boolean) => Query,
  canDrop: boolean,
  isGroupKey: boolean, // This is used by moveUtils in moveColumn/canMoveColumn
  isOver: boolean,
  isTop: boolean,
  isLast: boolean
}> {
  render() {
    const { connectDropTarget, canDrop, isOver, isTop, isLast } = this.props;
    const isActive = isOver && canDrop;

    return connectDropTarget(
      <div className={cx('moveDropzone', { isActive, canDrop, isTop, isLast })}>
        {!isTop && !isLast && <div className={cx('moveLine')} />}
      </div>
    );
  }
}

function collectCol(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

const keyTarget = {
  canDrop(props, monitor) {
    const fromProps = monitor.getItem();
    return props.canMoveColumn(fromProps, props);
  },

  drop(props, monitor) {
    const fromProps = monitor.getItem();
    return {
      query: props.moveColumn(fromProps, props, isCopyDrag())
    };
  }
};

export default DropTarget(
  [ItemTypes.COLUMN_HEADER, ItemTypes.COLUMN],
  keyTarget,
  collectCol
)(ColumnMoveDropTarget);



// WEBPACK FOOTER //
// ./src/components/ColumnView/Column/ColumnMoveDropTarget.js