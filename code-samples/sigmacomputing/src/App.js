// @flow

import React, { Component } from 'react';
import {
  Route,
  Switch,
  withRouter,
  type RouterHistory
} from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import * as firebase from 'firebase/app';
import HTML5Backend from 'react-dnd-html5-backend';
import Raven from 'raven-js';
import invariant from 'invariant';

import 'styles/globals.css';

import { isProd, isStaging } from 'env';
import { loginOrg, logoutOrg, signupPromise } from 'utils/auth';
import { DASHBOARD_PATH, WORKSHEET_PATH, FOLDER_PATH } from 'utils/url';
import { setUserContext } from 'utils/events';
import PrivateRoute from 'components/router/PrivateRoute';
import DragPreviewColumn from 'components/widgets/DragPreviewColumn';
import TermsOfService from 'containers/Terms/TermsOfService';
import Library from 'containers/Library';
import AboutPage from 'containers/AboutPage';
import CareerPage from 'containers/CareerPage';
import HelpPage from 'containers/HelpPage';
import LandingPage from 'containers/LandingPage';
import LoginPage from 'containers/LoginPage';
import ForgotPassword from 'containers/ForgotPassword';
import SignupPage from 'containers/SignupPage';
import WorkbookPage from 'containers/WorkbookPage';
import Storyboard from 'containers/Storyboard';
import NewWorkbook from 'containers/NewWorkbook';
import Dashboard from 'containers/Dashboard';
import Settings from 'containers/Settings';
import Error404 from 'containers/Error404';
import BrowserSupport from 'components/BrowserSupport';

class App extends Component<
  {
    history: RouterHistory
  },
  {
    authed: boolean,
    isLoading: boolean
  }
> {
  constructor(props) {
    super(props);

    this.state = {
      authed: false,
      isLoading: true
    };
  }

  setupUserContext = user => {
    invariant(user, 'user was not set');
    loginOrg(user).then(({ uid, email, organizationId }) => {
      Raven.setUserContext({ uid, email, organizationId });
      setUserContext(uid, email, organizationId);
      this.setState({ authed: true, isLoading: false });
    });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ isLoading: true });
        // If we're in the middle of signup, wait for the signup to complete before reading from firebase
        if (signupPromise) {
          return signupPromise.then(() => {
            return this.setupUserContext(user);
          });
        }
        return this.setupUserContext(user);
      } else {
        logoutOrg();
        Raven.setUserContext();
        setUserContext();
        this.setState({ authed: false, isLoading: false });
      }
    });

    if (window.analytics) {
      this.props.history.listen(a => window.analytics.page(a.pathname));
    }
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    return (
      <div>
        <BrowserSupport />
        <Switch>
          <PrivateRoute
            exact
            path="/"
            component={Library}
            publicComponent={LandingPage}
          />
          {(!isProd || isStaging) && (
            <PrivateRoute path="/story" component={Storyboard} />
          )}

          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/careers" component={CareerPage} />
          <Route exact path="/help" component={HelpPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/password_reset" component={ForgotPassword} />
          <Route exact path="/signup" component={SignupPage} />
          <Route exact path="/terms" component={TermsOfService} />

          <PrivateRoute exact path="/new" component={NewWorkbook} />
          <PrivateRoute exact path="/newdash" component={Dashboard} />
          <PrivateRoute path="/settings" component={Settings} />
          <PrivateRoute exact path={WORKSHEET_PATH} component={WorkbookPage} />
          <PrivateRoute exact path={DASHBOARD_PATH} component={Dashboard} />
          <PrivateRoute exact path={FOLDER_PATH} component={Library} />

          <Route component={Error404} />
        </Switch>
        <DragPreviewColumn />
      </div>
    );
  }
}

export default withRouter(DragDropContext(HTML5Backend)(App));



// WEBPACK FOOTER //
// ./src/App.js