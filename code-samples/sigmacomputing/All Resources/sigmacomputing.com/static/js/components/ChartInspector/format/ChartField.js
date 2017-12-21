// @flow
import * as React from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import type { ColumnId, ValueType } from '@sigmacomputing/sling';

import type { BinDef, FuncDef } from 'utils/chart/Chart';
import { IconButton, Popup, Flex, Text } from 'widgets';
import ItemTypes from 'const/ItemTypes';

function getLabel(func = 'none', bin = 'none', col) {
  let label = col;
  if (bin !== 'none') label = `${bin} (${label})`;
  if (func !== 'none') label = `${func} (${label})`;
  return label;
}

export const Chiclet = ({
  index,
  isOver,
  ...rest
}: {
  index: number,
  isOver: boolean
}) => (
  <Flex
    css={`
      height: 30px;
      box-shadow: inset 1px 1px 0 0 #fff;
    `}
    align="center"
    bt={index === 0 ? 0 : 1}
    borderColor="darkBlue4"
    opacity={isOver ? 0.4 : 1}
    p={2}
    {...rest}
  />
);

class ChartField extends React.Component<{
  id?: ColumnId,
  connectDragSource: (React.Element<any>) => any,
  connectDragPreview: Image => any,
  isDragging: boolean,
  func?: FuncDef,
  bin?: BinDef,
  menu: React.Element<*>,
  isOver: boolean,
  index: number,
  label: string,
  removeField: () => void,
  onUpdateFunc?: (index: number, func?: FuncDef) => void,
  type?: ValueType
}> {
  div: ?HTMLElement;

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage());
  }

  setRef = ref => {
    this.div = ref;
  };

  onMenuAction = (e: { key: FuncDef }) => {
    const { onUpdateFunc, index } = this.props;

    const func = e.key !== 'none' ? e.key : undefined;
    if (onUpdateFunc) {
      onUpdateFunc(index, func);
    }
  };

  render() {
    const {
      connectDragSource,
      func,
      bin,
      index,
      label,
      menu,
      isOver,
      removeField
    } = this.props;
    const mLabel = getLabel(func, bin, label);

    return connectDragSource(
      <div ref={this.setRef}>
        <Chiclet bg="darkBlue6" index={index} isOver={isOver}>
          <Popup
            popupPlacement="bottom-start"
            target={
              <Flex
                css={`
                height: 18px;
                width: 18px;
              `}
                align="center"
                b={1}
                bg="darkBlue6"
                borderColor="darkBlue4"
                borderRadius="2px"
                justify="center"
                mr={2}
              >
                <IconButton size="10px" type="caret-down" />
              </Flex>
            }
          >
            {menu}
          </Popup>
          <Flex flexGrow justify="center">
            <Text font="header5" truncate>
              {mLabel}
            </Text>
          </Flex>
          <IconButton ml={2} size="10px" type="close" onClick={removeField} />
        </Chiclet>
      </div>
    );
  }
}

const sourceEvents = {
  beginDrag(props, monitor, component: any) {
    const width = component.div.getBoundingClientRect().width;
    const { id, label, func, bin, type } = props;

    return {
      id,
      type: ItemTypes.TREE_COLUMN,
      width,
      label: getLabel(func, bin, label),
      columnType: type,
      func
    };
  },

  endDrag(props, monitor) {
    if (monitor.getDropResult()) {
      props.removeField();
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

export default DragSource(ItemTypes.CHART, sourceEvents, dragCollect)(
  ChartField
);



// WEBPACK FOOTER //
// ./src/components/ChartInspector/format/ChartField.js