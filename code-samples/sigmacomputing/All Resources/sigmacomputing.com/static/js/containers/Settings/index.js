// @flow
import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Settings from './Settings';
import Error404 from 'containers/Error404';
import NewConnection from 'containers/Connection/NewConnection';
import EditConnection from 'containers/Connection/EditConnection';

export default function SettingsPage() {
  return (
    <Switch>
      <Redirect exact from="/settings" to="/settings/account" />
      <Route exact path="/settings/account" component={Settings} />
      <Route exact path="/settings/organizations" component={Settings} />
      <Route exact path="/settings/invitations" component={Settings} />
      <Route exact path="/settings/connections" component={Settings} />
      <Route exact path="/settings/connections/new" component={NewConnection} />
      <Route
        exact
        path="/settings/connections/:connectionId"
        component={EditConnection}
      />
      <Route component={Error404} />
    </Switch>
  );
}



// WEBPACK FOOTER //
// ./src/containers/Settings/index.js