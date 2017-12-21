// @flow
import React, { PureComponent } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import invariant from 'invariant';
import { css } from 'react-emotion';

import type { SelectionDef } from './ToolbarPlugin';
import zindex from 'styles/zindex';

const rootStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  pointer-events: none;
`;

const HIDDEN = {
  position: 'absolute',
  visibility: 'hidden',
  left: '-999em'
};

const PADDING = 8;

function position(selection: ?SelectionDef, toolbar: ?HTMLElement) {
  if (!selection || !toolbar) return HIDDEN;

  const { from, to } = selection;
  const t = toolbar.getBoundingClientRect();

  const top = from.top - t.height - PADDING;

  // find an approximately centered position
  /// note when multiple lines to.left might be < from.left
  let left = Math.max((from.left + to.left) / 2, from.left + 3);
  left -= t.width / 2;

  // don't go off left side of the viewport
  if (left < PADDING) left = PADDING;

  // don't go off right side of the viewport
  const maxLeft = window.innerWidth - t.width - PADDING;
  left = Math.min(maxLeft, left);

  return {
    position: 'absolute',
    pointerEvents: 'all',
    zIndex: zindex.zindexPopover,
    top,
    left,
    height: t.height,
    width: t.width
  };
}

type Props = {
  selection: ?SelectionDef,
  children?: any
};

type State = {
  posStyle: Object
};

export default class ToolbarPositioner extends PureComponent<Props, State> {
  toolbar: ?HTMLElement;
  _root: ?HTMLElement;

  setToolbarRef = (toolbar: ?HTMLElement) => (this.toolbar = toolbar);

  constructor(props: Props) {
    super(props);
    this.state = {
      posStyle: HIDDEN
    };
  }

  componentDidMount() {
    const root = (this._root = document.createElement('div'));
    root.className = rootStyle;
    invariant(document.body, `No document.body?`);
    document.body.appendChild(root);
    this.renderChildren();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.selection !== this.props.selection) {
      this.setState({
        posStyle: position(nextProps.selection, this.toolbar)
      });
    }
  }

  componentDidUpdate() {
    this.renderChildren();
  }

  componentWillUnmount() {
    const { _root } = this;
    if (_root) {
      unmountComponentAtNode(_root);
      invariant(document.body, `No document.body?`);
      document.body.removeChild(_root);
    }
  }

  renderChildren() {
    const { posStyle } = this.state;
    const { children } = this.props;
    render(
      <div ref={this.setToolbarRef} style={posStyle}>
        {children}
      </div>,
      this._root
    );
  }

  render() {
    return null;
  }
}



// WEBPACK FOOTER //
// ./src/components/TextTile/ToolbarPositioner.js