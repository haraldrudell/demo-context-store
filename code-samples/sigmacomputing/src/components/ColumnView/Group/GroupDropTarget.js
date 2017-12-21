// @flow

import * as React from 'react';
import { DropTarget } from 'react-dnd';

import type { Query, ColumnId, LevelId } from '@sigmacomputing/sling';

import ItemTypes from 'const/ItemTypes';
import KeyGroup from './KeyGroup';
import GroupHeaderDropzone, { GroupHeader } from './GroupHeader';

const keyTarget = {
  canDrop(props, monitor) {
    const { id: fromColumnId, levelId: fromLevelId } = monitor.getItem();
    const { canCreateGroup, levelId: toLevelId } = props;

    return canCreateGroup(fromLevelId, fromColumnId, toLevelId);
  },

  drop(props, monitor) {
    const { id: fromColumnId, levelId: fromLevelId } = monitor.getItem();
    const { createGroup, levelId: toLevelId } = props;

    return {
      query: createGroup(fromLevelId, fromColumnId, toLevelId)
    };
  }
};

function collectCol(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    isOverCurrent: monitor.isOver({ shallow: true })
  };
}

/**
 * This components helps show a new group when the user hovers over this area
 */
class GroupDropTarget extends React.Component<
  {
    alwaysShow: boolean,
    addColumn: LevelId => void,
    canDrop: boolean,
    collapseLevel: LevelId => void,
    connectDropTarget: (React.Element<any>) => ?React.Element<any>,
    canCreateGroup: (LevelId, ColumnId, LevelId) => boolean,
    createGroup: (LevelId, ColumnId, LevelId) => Query,
    hideLevel: (LevelId, boolean) => void,
    isCollapsed: boolean,
    isLevelHidden: boolean,
    isOver: boolean,
    isOverCurrent: boolean,
    levelId: string
  },
  {
    isActive: boolean
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isOver !== this.props.isOver &&
      (!nextProps.isOver || nextProps.canDrop)
    ) {
      this.setState({
        isActive: nextProps.isOver
      });
    } else if (!nextProps.isOverCurrent && nextProps.isOver) {
      this.setState({
        isActive: false
      });
    }
  }

  render() {
    const {
      alwaysShow,
      connectDropTarget,
      addColumn,
      collapseLevel,
      hideLevel,
      isCollapsed,
      isLevelHidden,
      isOver,
      levelId
    } = this.props;
    const { isActive } = this.state;
    return connectDropTarget(
      <div>
        {(alwaysShow || isActive) && (
          <div>
            <GroupHeader
              addColumn={addColumn}
              collapseLevel={collapseLevel}
              hideLevel={hideLevel}
              isCollapsed={false}
              isLevelHidden={false}
              levelId={levelId}
            />
            <KeyGroup isOver={isOver} />
          </div>
        )}
        {/* This GroupHeader is a Dropzone to remove hijack the canDrop */}
        <GroupHeaderDropzone
          addColumn={addColumn}
          collapseLevel={collapseLevel}
          hideLevel={hideLevel}
          isCollapsed={isCollapsed}
          isLevelHidden={isLevelHidden}
          levelId={levelId}
        />
      </div>
    );
  }
}

export default DropTarget(
  [ItemTypes.COLUMN_HEADER, ItemTypes.COLUMN],
  keyTarget,
  collectCol
)(GroupDropTarget);



// WEBPACK FOOTER //
// ./src/components/ColumnView/Group/GroupDropTarget.js