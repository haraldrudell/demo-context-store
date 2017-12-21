// @flow

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import type { RouterHistory, Match } from 'react-router-dom';

import { Tabs, Text } from 'widgets';
import Layout from 'components/layout';
import Account from 'containers/Settings/Account';
import Organization from 'containers/Settings/Organizations';
import Connections from 'containers/Settings/Connections';
import Invitations from 'containers/Settings/Invitations';
import styles from './Settings.less';

const { TabPane } = Tabs;

export default class Settings extends Component<{|
  history: RouterHistory,
  match: Match
|}> {
  onTabClick = (key: string) => {
    this.props.history.push(key);
  };

  render() {
    const { path } = this.props.match;

    return (
      <Layout>
        <Helmet title="Settings - Sigma" />
        <div className="g_container">
          <Text font="header2">Settings</Text>
          <Tabs
            className={styles.tabs}
            defaultActiveKey={path}
            onTabClick={this.onTabClick}
          >
            <TabPane tab="Account" key="/settings/account" />
            <TabPane tab="Organization" key="/settings/organizations" />
            <TabPane tab="Invitations" key="/settings/invitations" />
            <TabPane tab="Connections" key="/settings/connections" />
          </Tabs>
          <Switch>
            <Route path="/settings/account" component={Account} />
            <Route path="/settings/organizations" component={Organization} />
            <Route path="/settings/invitations" component={Invitations} />
            <Route path="/settings/connections" component={Connections} />
          </Switch>
        </div>
      </Layout>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Settings/Settings.js