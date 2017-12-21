// @flow

import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';

import ItemTypes from 'const/ItemTypes';
import TreeColumn from 'components/ColumnView/Column/TreeColumn';
import styles from './index.less';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0
};

class DragPreviewColumn extends Component<{
  item: Object,
  itemType: string,
  currentOffset: Object,
  isDragging: boolean
}> {
  getItemStyles() {
    const { currentOffset, item } = this.props;
    if (!currentOffset) {
      return {
        display: 'none'
      };
    }

    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
      width: item.width
    };
  }

  renderItem(type, item) {
    // Since Table Columns and Tree Columns share the same DnD type we need to check item.type
    // See TreeColumn: beginDrag for item props
    if (item.type === ItemTypes.TREE_COLUMN) {
      return (
        <TreeColumn
          className={styles.previewTreeColumn}
          isHidden={item.isHidden}
          isSource={item.isSource}
          label={item.label}
          type={item.columnType}
          id={item.id}
          levelId={item.levelId}
        />
      );
    } else if (item.type === ItemTypes.COLUMN_HEADER) {
      return <div className={styles.previewColumnHeader}>{item.label}</div>;
    }
    return null;
  }

  render() {
    const { item, itemType, isDragging } = this.props;

    if (!isDragging) {
      return null;
    }

    const columnPreview = this.renderItem(itemType, item);
    if (!columnPreview) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={this.getItemStyles()}>{columnPreview}</div>
      </div>
    );
  }
}

export default DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))(DragPreviewColumn);



// WEBPACK FOOTER //
// ./src/components/widgets/DragPreviewColumn/index.js