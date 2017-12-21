// @flow
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { type RouterHistory } from 'react-router-dom';
import { Formik, type FormikActions } from 'formik';

import colors from 'styles/colors';
import { publish } from 'utils/events';
import logo from 'icons/logo_light.png';
import { resetPassword } from 'utils/auth';
import { Box, Button, Input, Text } from 'widgets';

type formValue = { email: string };

export default class ForgotPassword extends Component<
  { history: RouterHistory },
  { emailSent: boolean }
> {
  state = {
    emailSent: false
  };

  returnLogin = () => {
    this.props.history.push('/login');
  };

  renderSentEmail() {
    return (
      <Box>
        <Text font="bodyMedium" my={3}>
          Check your email for a link to reset your password. If it doesn&apos;t
          appear within a few minutes, check your spam folder.
        </Text>
        <Button width="100%" type="secondary" onClick={this.returnLogin}>
          Return to login
        </Button>
      </Box>
    );
  }

  validateForm(values: formValue) {
    let errors = {};
    if (!values.email) {
      errors.email = 'Required';
    }

    return errors;
  }

  handleSubmit = (
    values: formValue,
    { setSubmitting, setErrors }: FormikActions<*>
  ) => {
    resetPassword(values.email)
      .then(() => {
        this.setState({
          emailSent: true
        });
        publish('ResetPassword', { email: values.email });
      })
      .catch(err => {
        setSubmitting(false);
        if (err.code === 'auth/invalid-email') {
          setErrors({ email: 'Invalid email' });
        } else if (err.code === 'auth/user-not-found') {
          setErrors({
            email: 'User with this email address not found'
          });
        } else {
          setErrors({
            email: err.message
          });
        }
        publish('ResetPassword', {
          email: values.email,
          error: err.message
        });
      });
  };

  renderReset() {
    return (
      <Box>
        <Text font="bodyMedium" my={3}>
          Enter your email address and we will send you a link to reset your
          password.
        </Text>
        <Formik
          validate={this.validateForm}
          onSubmit={this.handleSubmit}
          render={this.renderForm}
        />
      </Box>
    );
  }

  renderForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  }: any) => (
    // XXX JDF: formik type checking not right here
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        name="email"
        style={
          touched.email && errors.email
            ? { borderColor: colors.red, boxShadow: 'none' }
            : null
        }
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
      />
      {touched.email &&
        errors.email && (
          <Text font="bodyMedium" color={colors.red}>
            {errors.email}
          </Text>
        )}
      <Button
        disabled={isSubmitting}
        width="100%"
        mt={3}
        onClick={handleSubmit}
      >
        Send password reset email
      </Button>
    </form>
  );

  render() {
    return (
      <Box
        bg="darkBlue6"
        css={`
          height: 100vh;
          overflow: hidden;
        `}
      >
        <Helmet title="Forgot your password? - Sigma" />
        <Box
          p={3}
          width="300px"
          borderRadius="5px"
          bg="white"
          css={`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 2px 11px 0 rgba(147, 147, 147, 0.5);
          `}
        >
          <img
            alt=""
            css={`
              position: absolute;
              top: 0;
              right: 50%;
              transform: translate(50%, -50%);
            `}
            src={logo}
          />
          <Text align="center" font="header2">
            Sigma
          </Text>
          <Text align="center" font="header3">
            Reset your password
          </Text>
          {this.state.emailSent ? this.renderSentEmail() : this.renderReset()}
        </Box>
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/ForgotPassword/ForgotPassword.js