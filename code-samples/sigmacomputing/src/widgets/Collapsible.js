// @flow

import React, { PureComponent } from 'react';
import Measure from 'react-measure';
import { css } from 'react-emotion';

import { COLLAPSE_MS, collapseHeight } from 'styles/transitions';

type Props = {
  children: any,
  smoothChanges: boolean,
  open: boolean
};

type OPEN_STATE = 'OPEN' | 'CLOSED' | 'CHANGING';

const baseStyle = css`
  overflow-y: hidden;
`;

export default class Collapsible extends PureComponent<
  Props,
  {|
    currentState: OPEN_STATE,
    height: ?number
  |}
> {
  static defaultProps = {
    open: true,
    smoothChanges: false
  };

  changeTimer: ?number;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentState: this.props.open ? 'OPEN' : 'CLOSED',
      // We set height initially set to null to avoid an initial animation.
      height: null
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.open !== nextProps.open) {
      clearTimeout(this.changeTimer);

      if (nextProps.open && this.state.height === null) {
        this.setState({ height: 0 });
      }

      const { currentState } = this.state;
      this.setState({ currentState: 'CHANGING' });

      this.changeTimer = setTimeout(() => {
        if (currentState === 'OPEN') {
          this.setState({
            currentState: 'CLOSED',
            // Set height to 0 to force open to renanimate.
            height: 0
          });
        } else if (currentState === 'CLOSED') {
          this.setState({
            currentState: 'OPEN'
          });
        }
      }, COLLAPSE_MS);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.changeTimer);
  }

  onResize = (rect: { bounds: { height: number } }) => {
    this.setState({ height: rect.bounds.height });
  };

  render() {
    const { currentState, height } = this.state;
    if (currentState === 'CLOSED') return null;

    const { children, open, smoothChanges } = this.props;
    const doAnimate = smoothChanges || currentState === 'CHANGING';
    const cls = `${baseStyle} ${doAnimate ? collapseHeight : ''}`;

    return (
      <Measure bounds onResize={this.onResize}>
        {({ measureRef }) => (
          <div className={cls} style={{ height: open ? height : 0 }}>
            <div ref={measureRef}>{children}</div>
          </div>
        )}
      </Measure>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Collapsible.js