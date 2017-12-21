// @flow
import * as React from 'react';
import { Formik, type FormikActions } from 'formik';
import invariant from 'invariant';

import { publish } from 'utils/events';
import colors from 'styles/colors';
import { getUserInfo } from 'api/user';
import { updatePassword, validatePassword } from 'utils/auth';
import { makeCancelable, type CancelablePromise } from 'utils/promise';
import { Box, Button, Divider, Input, Text } from 'widgets';

type FormValues = { oldPass: string, newPass: string, confirmPass: string };

const Key = ({ children }: { children: React.Node }) => (
  <td>
    <Box font="header4" pr={4} pb={3}>
      {children}
    </Box>
  </td>
);

const Value = ({ children }: { children: React.Node }) => (
  <td>
    <Box font="bodyMedium" pb={3}>
      {children}
    </Box>
  </td>
);

export default class Account extends React.PureComponent<
  {},
  {
    user: ?Object
  }
> {
  fetchPromise: CancelablePromise;

  constructor(props: {}) {
    super(props);

    this.state = {
      user: null
    };
  }

  componentWillMount() {
    this.fetchPromise = makeCancelable(getUserInfo());
    this.fetchPromise.promise.then(user => {
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    this.fetchPromise.cancel();
  }

  validateForm = (values: FormValues) => {
    // same as above, but feel free to move this into a class method now.
    let errors = {};
    if (!values.oldPass) {
      errors.oldPass = 'Required';
    }
    if (!values.newPass) {
      errors.newPass = 'Required';
    } else {
      const validateErr = validatePassword(values.newPass);
      if (validateErr) {
        errors.newPass = validateErr.password;
      }
    }

    if (!values.confirmPass) {
      errors.confirmPass = 'Required';
    }

    if (values.newPass !== values.confirmPass) {
      errors.confirmPass = 'Password does not match';
    }

    return errors;
  };

  handleSubmit = (
    values: FormValues,
    { setSubmitting, resetForm, setErrors }: FormikActions<*>
  ) => {
    const { user } = this.state;
    invariant(user, 'User should be defined');
    updatePassword(user.email, values.oldPass, values.newPass)
      .then(() => {
        resetForm({});
        setSubmitting(false);
        publish('ChangePassword', {
          email: user.email,
          success: true
        });
      })
      .catch(err => {
        setSubmitting(false);
        if (err.code === 'auth/wrong-password') {
          return setErrors({ oldPass: 'Incorrect password' });
        }

        publish('ChangePassword', {
          email: user.email,
          success: false,
          error: err.message
        });
        return setErrors({ newPass: err.message });
      });
  };

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
      <Box width="440px" css={`max-width: 100%;`}>
        <Box font="header4">Old password</Box>
        <Input
          type="password"
          name="oldPass"
          style={
            touched.oldPass && errors.oldPass
              ? { borderColor: colors.red, boxShadow: 'none' }
              : null
          }
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.oldPass}
        />
      </Box>
      {touched.oldPass &&
        errors.oldPass && (
          <Text font="bodyMedium" color={colors.red}>
            {errors.oldPass}
          </Text>
        )}
      <Box width="440px" css={`max-width: 100%;`} mt={3}>
        <Box font="header4">New password</Box>
        <Input
          type="password"
          name="newPass"
          style={
            touched.newPass && errors.newPass
              ? { borderColor: colors.red, boxShadow: 'none' }
              : null
          }
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.newPass}
        />
      </Box>
      {touched.newPass &&
        errors.newPass && (
          <Text font="bodyMedium" color={colors.red}>
            {errors.newPass}
          </Text>
        )}
      <Box width="440px" css={`max-width: 100%;`} mt={3}>
        <Box font="header4">Confirm new password</Box>
        <Input
          type="password"
          name="confirmPass"
          style={
            touched.confirmPass && errors.confirmPass
              ? { borderColor: colors.red, boxShadow: 'none' }
              : null
          }
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.confirmPass}
        />
      </Box>
      {touched.confirmPass &&
        errors.confirmPass && (
          <Text font="bodyMedium" color={colors.red}>
            {errors.confirmPass}
          </Text>
        )}
      <Box mt={3}>
        <Button disabled={isSubmitting} onClick={handleSubmit}>
          Update Password
        </Button>
      </Box>
    </form>
  );

  render() {
    const { user } = this.state;
    if (!user) {
      return null;
    }

    const { displayName, email } = user;

    return (
      <div>
        <Box font="header3">Profile</Box>
        <Divider />
        <table>
          <tbody>
            <tr>
              <Key>Name</Key>
              <Value>{displayName}</Value>
            </tr>
            <tr>
              <Key>Email</Key>
              <Value>{email}</Value>
            </tr>
          </tbody>
        </table>
        <Box font="header3" mt={2}>
          Change Password
        </Box>
        <Divider />
        <Formik
          validate={this.validateForm}
          onSubmit={this.handleSubmit}
          render={this.renderForm}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Settings/Account/index.js