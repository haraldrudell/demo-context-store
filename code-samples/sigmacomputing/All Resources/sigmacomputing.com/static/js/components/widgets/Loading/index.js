// @flow
import React, { PureComponent } from 'react';
import { Spin } from 'widgets';

// Don't render anything unless the load took longer than this amount of time
const WAIT_TIME = 200;

export default class Loading extends PureComponent<
  {
    text?: string,
    height?: string,
    width?: string
  },
  { show: boolean }
> {
  timer: ?number;
  state = {
    show: false
  };

  showIt = () => this.setState({ show: true });

  componentDidMount() {
    this.timer = setTimeout(this.showIt, WAIT_TIME);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  render() {
    const { height = '100%', width = '100%', text } = this.props;
    if (!this.state.show)
      return <div css={`height: ${height}; width: ${width};`} />;
    return (
      <div css={`height: ${height}; width: ${width}; position: relative;`}>
        <div
          css={`
            display: inline-block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          `}
        >
          <Spin /> {text}
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/widgets/Loading/index.js