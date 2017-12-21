// @flow

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Redirect from 'react-router-dom/Redirect';

import { publish } from 'utils/events';
import logo from 'icons/logo_light.png';
import { loginSubmit } from 'utils/auth';

import LoginForm from './LoginForm';
import styles from './Login.less';

export default class Login extends Component<
  { location: Object },
  { redirectToReferrer: boolean }
> {
  state = {
    redirectToReferrer: false
  };

  onLoginSubmit = (email: string, password: string) =>
    loginSubmit(email, password).then(loginError => {
      if (!loginError) {
        this.setState({
          redirectToReferrer: true
        });
      }
      publish('Login', { success: !loginError, error: loginError, email });
      return loginError;
    });

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <article className={styles.page}>
        <Helmet title="Sign in - Sigma" />
        <div className={styles.formContainer}>
          <img alt="" className={styles.logo} src={logo} />
          <div className={styles.logoText}>Sigma</div>
          <div className={styles.infoText}>Welcome Back!</div>
          <LoginForm onLogin={this.onLoginSubmit} />
        </div>
      </article>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/LoginPage/Login.js