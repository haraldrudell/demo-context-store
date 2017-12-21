// @flow

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Link from 'react-router-dom/Link';
import type { RouterHistory } from 'react-router-dom';

import { publish } from 'utils/events';
import logo from 'icons/logo_light.png';
import { signupSubmit } from 'utils/auth';
import { parseQueryString } from 'utils/url';

import SignupForm from './SignupForm';
import styles from '../LoginPage/Login.less';

type FormValues = {
  email: string,
  name: string,
  password: string,
  orgId?: string
};

export default class Signup extends Component<{
  location: Object,
  history: RouterHistory
}> {
  onSignupSubmit = (_values: FormValues) => {
    const { search } = this.props.location;

    let values = _values;
    let orgId;

    if (search) {
      // pull the orgId and from the query string if present
      const q = parseQueryString(search);
      if (q.orgId) {
        orgId = q.orgId;
        values = {
          ...values,
          orgId
        };
      }
    }

    return signupSubmit(values).then(signupError => {
      const { name, email, orgId } = values;

      publish('Signup', {
        success: !signupError,
        error: signupError,
        name,
        email,
        orgId
      });

      // NOTE: App.js renders null while it's waiting for the organizationId to load (onAuthStatusChange)
      // so this component will unmount and cannot setState on auth success
      if (!signupError) {
        // Force a redirect to the root on signup success
        this.props.history.push('/');
      }
      return signupError;
    });
  };

  render() {
    const { search } = this.props.location;
    // Default the email from the query string if available
    let initialEmail;
    if (search) {
      const p = parseQueryString(search);
      if (p.email) {
        initialEmail = p.email;
      }
    }

    return (
      <article className={styles.page}>
        <Helmet title="Sign up - Sigma" />
        <div className={styles.formContainer}>
          <img alt="" className={styles.logo} src={logo} />
          <div className={styles.logoText}>Sigma</div>
          <div className={styles.infoText}>Create an account</div>
          <SignupForm
            initialEmail={initialEmail}
            onSignup={this.onSignupSubmit}
          />
          Already have an account? <Link to="/login">Sign in</Link>
          <br />
          <Link to="/terms">Terms of Service</Link>
        </div>
      </article>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/SignupPage/Signup.js