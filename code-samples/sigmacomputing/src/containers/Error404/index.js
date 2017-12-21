// @flow
import React, { Component } from 'react';

import img from './404.png';
import styles from './index.less';

export default class Error404 extends Component<{
  staticContext?: Object
}> {
  componentWillMount() {
    const { staticContext } = this.props;
    if (staticContext) {
      staticContext.missed = true;
    }
  }

  render() {
    return (
      <div className={`${styles.page} container`}>
        <img src={img} alt="" className={styles.image} />
        <div className={styles.title}> Not Found </div>
        <div className={styles.description}>
          &nbsp;The planet you’re looking for does not exist.&nbsp;
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Error404/index.js