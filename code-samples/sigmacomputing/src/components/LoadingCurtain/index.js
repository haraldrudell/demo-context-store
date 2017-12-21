// @flow
import React, { PureComponent } from 'react';

import { Spin } from 'widgets';
import logo from './sigmaverse_logo-bw.png';
import styles from './index.less';

// Don't render anything unless the load took longer than this amount of time
const WAIT_TIME = 200;

export default class LoadingCurtain extends PureComponent<
  { text?: string },
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
    const { text = 'Loading...' } = this.props;
    // We delay showing the icon + message but still want to render the curtain itself
    if (!this.state.show) return <div className={styles.curtain} />;
    return (
      <div
        className={`${styles.curtain} flex-column align-center justify-center`}
      >
        <img alt="" src={logo} width={91} height={99} />
        <div className="flex-row align-center">
          <div className={styles.message}>
            <Spin /> {text}
          </div>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/LoadingCurtain/index.js