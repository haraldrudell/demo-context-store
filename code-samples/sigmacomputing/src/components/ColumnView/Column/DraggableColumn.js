// @flow

import * as React from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import classnames from 'classnames/bind';
import type {
  ColumnId,
  LevelId,
  Query,
  ValueType,
  SortKey
} from '@sigmacomputing/sling';

import ItemTypes from 'const/ItemTypes';
import TreeColumn from './TreeColumn';
import ColumnMoveDropTarget from './ColumnMoveDropTarget';
import styles from './TreeColumn.less';
const cx = classnames.bind(styles);

const sourceEvents = {
  // Determine if we can drag this item
  canDrag(props) {
    return !props.isSource; // We can't change where the source column goes at the moment
  },

  // Lets monitor.getItem() give details on the dragged item by what we return here
  beginDrag(props, monitor, component: any) {
    const { id, levelId, label, isHidden, isSource, type } = props;
    const width = component.column.getBoundingClientRect().width;
    const item = {
      id,
      type: ItemTypes.TREE_COLUMN,
      label,
      levelId,
      isHidden,
      columnType: type,
      isSource,
      width
    };
    return item;
  },

  // Let isDragging know if we're dragging the correct item
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  },

  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      const { query } = monitor.getDropResult();
      if (query) {
        props.endDrag(query);
      }
    }
  }
};

function dragCollect(connect, monitor) {
  return {
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

type Column = {
  id: string,
  label: string,
  isHidden: boolean
};

class DraggableColumn extends React.PureComponent<
  Column & {
    connectDragSource: (React.Element<any>) => any,
    connectDragPreview: Image => any,
    isTop: boolean,
    isLast: boolean,
    isDragging: boolean,
    isGroupKey: boolean,
    isSelected: boolean,
    isSource: boolean,
    endDrag: Query => void,
    levelId: LevelId,
    moveColumn: (Object, Object, boolean) => Query,
    canMoveColumn: (Object, Object) => boolean,
    onContextMenu: (SyntheticMouseEvent<>, ColumnId, LevelId) => void,
    onClick: (SyntheticInputEvent<>, ColumnId, LevelId) => void,
    type?: ?ValueType,
    sortState: ?SortKey,
    columnRename: (id: ColumnId, label: string) => void
  }
> {
  column: ?HTMLElement;

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage());
  }

  setColumnRef = ref => {
    this.column = ref;
  };

  onContextMenu = (e: SyntheticMouseEvent<>) => {
    e.preventDefault();

    const { id, levelId, onContextMenu } = this.props;
    onContextMenu(e, id, levelId);
  };

  render() {
    const {
      canMoveColumn,
      connectDragSource,
      id,
      isTop,
      isLast,
      isDragging,
      isGroupKey,
      isHidden,
      isSelected,
      isSource,
      label,
      levelId,
      moveColumn,
      onClick,
      type,
      sortState,
      columnRename
    } = this.props;
    return connectDragSource(
      <li
        className={cx('dragColumn', {
          isDragging,
          isSelected,
          isSelectable: !isHidden || isSource
        })}
        onContextMenu={this.onContextMenu}
        ref={this.setColumnRef}
      >
        {isTop && (
          <ColumnMoveDropTarget
            canMoveColumn={canMoveColumn}
            isGroupKey={isGroupKey}
            isTop={isTop}
            isLast={false}
            levelId={levelId}
            moveColumn={moveColumn}
          />
        )}
        <TreeColumn
          isHidden={isHidden}
          label={label}
          isSource={isSource}
          onClick={onClick}
          isSelected={isSelected}
          id={id}
          levelId={levelId}
          onContextMenu={this.onContextMenu}
          type={type}
          sortState={sortState}
          columnRename={columnRename}
        />
        <ColumnMoveDropTarget
          id={id}
          canMoveColumn={canMoveColumn}
          isTop={false}
          isGroupKey={isGroupKey}
          isLast={isLast && isGroupKey}
          levelId={levelId}
          moveColumn={moveColumn}
        />
      </li>
    );
  }
}

export default DragSource(ItemTypes.COLUMN, sourceEvents, dragCollect)(
  DraggableColumn
);



// WEBPACK FOOTER //
// ./src/components/ColumnView/Column/DraggableColumn.js