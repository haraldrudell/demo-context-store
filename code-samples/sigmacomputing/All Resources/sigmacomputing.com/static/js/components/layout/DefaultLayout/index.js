// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'widgets';
import UserMenu from 'components/nav/UserMenu';
import styles from './index.less';

export default class Layout extends React.Component<{
  children?: React.Node,
  isRoot?: boolean,
  previousRoute?: {
    path: string,
    label: string
  },
  title?: string
}> {
  render() {
    const {
      children,
      isRoot,
      previousRoute = { path: '/', label: 'Home' }
    } = this.props;

    return (
      <div className={`${styles.page} flex-column`}>
        <div className={`${styles.header} flex-row align-center`}>
          {!isRoot && (
            <Link to={previousRoute.path}>
              <Icon type="caret-left" /> Back to {previousRoute.label}
            </Link>
          )}
          <div className="flex-item" />
          <UserMenu />
        </div>
        <main role="main" className={`${styles.content} flex-item`}>
          {children}
        </main>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/layout/DefaultLayout/index.js