// @flow

import * as React from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import type { Query } from '@sigmacomputing/sling';

import type { Id } from 'types';
import ItemTypes from 'const/ItemTypes';

const sourceEvents = {
  beginDrag(props, monitor, component: any) {
    const { id, label, levelId } = props;
    const width = component.column.getBoundingClientRect().width;
    return {
      id,
      levelId,
      label,
      width,
      type: ItemTypes.COLUMN_HEADER
    };
  },

  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      const { query } = monitor.getDropResult();
      if (query) {
        props.setQuery(query);
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
  id: Id,
  label: string,
  levelId: Id,
  header: React.Node,
  setQuery: Query => void
};

class DraggableColumnHeader extends React.PureComponent<
  Column & {
    connectDragSource: (React.Element<any>) => any,
    connectDragPreview: any => any
  }
> {
  column: any;

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage());
  }

  setColumnRef = ref => {
    this.column = ref;
  };

  render() {
    const { connectDragSource, header } = this.props;

    return connectDragSource(<div ref={this.setColumnRef}>{header}</div>);
  }
}

export default DragSource(ItemTypes.COLUMN_HEADER, sourceEvents, dragCollect)(
  DraggableColumnHeader
);



// WEBPACK FOOTER //
// ./src/components/table/DraggableColumnHeader.js