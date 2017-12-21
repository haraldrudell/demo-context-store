// @flow

import * as React from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames/bind';
import type { Query } from '@sigmacomputing/sling';

import { Text } from 'widgets';
import ItemTypes from 'const/ItemTypes';
import { isCopyDrag } from 'utils/dnd';
import styles from './TreeColumn.less';
const cx = classnames.bind(styles);

export function ColumnPlaceholder(props: { isOver: boolean, text: string }) {
  const { isOver, text } = props;

  return (
    <Text font="bodySmall">
      <div
        className={`${cx('column', 'placeholder', {
          isOver
        })} flex-row align-center`}
      >
        {text}
      </div>
    </Text>
  );
}

class ColumnDropzone extends React.PureComponent<{
  connectDropTarget: (React.Element<any>) => ?React.Element<any>,
  canDrop: boolean,
  isOver: boolean,
  text: string,
  canMoveColumn: (any, any) => boolean,
  moveColumn: (any, any, boolean) => Query
}> {
  render() {
    const { connectDropTarget, canDrop, isOver, text } = this.props;
    const isActive = isOver && canDrop;

    return connectDropTarget(
      <div>
        <ColumnPlaceholder isOver={isActive} text={text} />
      </div>
    );
  }
}

function collectCol(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
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
)(ColumnDropzone);



// WEBPACK FOOTER //
// ./src/components/ColumnView/Column/ColumnDropzone.js