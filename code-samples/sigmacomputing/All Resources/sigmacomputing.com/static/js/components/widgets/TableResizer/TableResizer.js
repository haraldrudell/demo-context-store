// @flow
import React, { PureComponent } from 'react';
import { throttle } from 'lodash';
import classnames from 'classnames/bind';

import styles from './TableResizer.less';
const cx = classnames.bind(styles);

const THROTTLE_MS = 100;

type Props = {
  id: string,
  axis: string,
  height?: number,
  size: number,
  minSize: number, // don't update the size with anything < minSize
  maxSize?: number, // don't update the size with anything > maxSize
  snapSize?: number, // round size updates to multiple of this size
  onResize: (newSize: ?number, id: ?string) => void
};

type Event = {
  pageX: number,
  pageY: number,
  preventDefault: () => void,
  stopPropagation: () => void
};

export default class TableResizer extends PureComponent<
  Props,
  {
    adjustedSize: number,
    mouseDown: boolean,
    mouseDownPosition: number,
    initialSize: number
  }
> {
  throttledMove: (e: Event) => void;

  static defaultProps = {
    height: 0
  };

  constructor(props: Props) {
    super(props);

    this.throttledMove = throttle(this.onMouseMove, THROTTLE_MS);
    this.state = {
      adjustedSize: 0,
      mouseDown: false,
      initialSize: props.size,
      mouseDownPosition: 0
    };
  }

  toggleListener = (bind: boolean) => {
    const moveCb =
      this.props.axis === 'y' ? this.throttledMove : this.onMouseMove;
    const method = bind ? 'addEventListener' : 'removeEventListener';
    // $FlowFixMe
    document[method]('mousemove', moveCb, true);
    // $FlowFixMe
    document[method]('mouseup', this.onMouseUp, true);
  };

  componentWillUnmount() {
    this.toggleListener(false);
  }

  pos(e: Event) {
    return this.props.axis === 'x' ? e.pageX : e.pageY;
  }

  onClick = (e: Event) => {
    e.stopPropagation(); // Prevent deselecting/selecting
  };

  onMouseDown = (e: Event) => {
    e.preventDefault(); // prevents a drag of another component (eg headers) while resizing
    this.toggleListener(true);

    this.setState({
      mouseDown: true,
      adjustedSize: this.props.size,
      mouseDownPosition: this.pos(e),
      initialSize: this.props.size
    });
  };

  onMouseUp = () => {
    this.toggleListener(false);
    this.props.onResize(this.state.adjustedSize, this.props.id);
    this.setState({ mouseDown: false });
  };

  onMouseMove = (e: Event) => {
    e.preventDefault(); // prevents a drag of another component (eg headers) while resizing
    const { minSize, maxSize, snapSize, axis } = this.props;

    const delta = this.pos(e) - this.state.mouseDownPosition;
    let newSize = this.state.initialSize + delta;

    if (snapSize) {
      newSize = Math.round(newSize / snapSize) * snapSize;
    }

    if (minSize) newSize = Math.max(minSize, newSize);
    if (maxSize) newSize = Math.min(maxSize, newSize);

    if (newSize >= 0 && newSize !== this.state.adjustedSize) {
      this.setState({ adjustedSize: newSize });

      // we want to immediately update the table height as the resizer is dragged ('y' axis)
      // but we do not want to update the column width until an onMouseUp event ('x' axis)
      if (axis === 'y') this.props.onResize(newSize);
    }
  };

  onAutoResize = () => {
    const { axis, onResize, id } = this.props;
    const newSize = undefined; // resize with no newsize for auto-resize
    if (axis === 'x') onResize(newSize, id);
  };

  getStyles = () => {
    const { height, size, axis } = this.props;
    const style = {};
    if (axis === 'x') {
      style.height = height;
      if (this.state.mouseDown) style.right = size - this.state.adjustedSize;
    }
    return style;
  };

  render() {
    const style = this.getStyles();

    return (
      <div
        className={cx('handle', {
          isActive: this.state.mouseDown,
          isHorizontal: this.props.axis === 'x',
          isVertical: this.props.axis === 'y'
        })}
        style={style}
        onMouseDown={this.onMouseDown}
        onDoubleClick={this.onAutoResize}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/widgets/TableResizer/TableResizer.js