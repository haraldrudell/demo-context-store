// @flow
import * as React from 'react';

import { Button, Form, Input } from 'widgets';
import { validateEmail, validatePassword } from 'utils/auth';

const FormItem = Form.Item;

class SignupForm extends React.Component<
  {
    initialEmail: ?string,
    form: Form,
    onSignup: ({
      name: string,
      email: string,
      password: string
    }) => Promise<Object>
  },
  {
    isLoading: boolean,
    signupError: Object
  }
> {
  state = {
    isLoading: false,
    signupError: {}
  };

  checkEmail = (rule, email, cb) => {
    const { initialEmail } = this.props;
    if (initialEmail && email !== initialEmail)
      // XXX JDF: our form should prevent changing the email in this case, but
      // our form components need more love
      cb(
        `You must sign up with the address you were invited with: ${initialEmail}`
      );
    else if (email) {
      const error = validateEmail(email);
      if (error) cb(error.email);
      else cb();
    } else {
      cb();
    }
  };

  checkPassword = (rule, value, cb) => {
    const error = validatePassword(value);
    if (value && error) {
      cb(error.password);
    } else {
      cb();
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.isLoading) {
      this.setState({
        isLoading: true
      });
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.onSignup(values).then(signupError => {
            if (signupError) {
              this.setState({
                isLoading: false,
                signupError
              });
            }
          });
        } else {
          const { getFieldError } = this.props.form;
          this.setState({
            isLoading: false,
            signupError: {
              email: getFieldError('email'),
              password: getFieldError('password')
            }
          });
        }
      });
    }
  };

  render() {
    const {
      isFieldTouched,
      getFieldDecorator,
      getFieldError
    } = this.props.form;
    const { isLoading, signupError = {} } = this.state;

    const nameError = isFieldTouched('name') && getFieldError('name');
    const emailError =
      signupError.email || (isFieldTouched('email') && getFieldError('email'));
    const passwordError =
      signupError.password ||
      (isFieldTouched('password') && getFieldError('password'));

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <FormItem
          label={<b>Your Name</b>}
          validateStatus={nameError ? 'error' : ''}
          help={nameError || ''}
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please enter your name!' }]
          })(<Input placeholder="John Doe" />)}
        </FormItem>
        <FormItem
          label={<b>Email</b>}
          validateStatus={emailError ? 'error' : ''}
          help={emailError || ''}
        >
          {getFieldDecorator('email', {
            initialValue: this.props.initialEmail,

            rules: [
              { required: true, message: 'Please input your email!' },
              { validator: this.checkEmail }
            ]
          })(<Input placeholder="data.enthusiast@gmail.com" />)}
        </FormItem>
        <FormItem
          label={<b>Password</b>}
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}
        >
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Please input your password!' },
              { validator: this.checkPassword }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            width="100%"
          >
            Create Account
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(SignupForm);



// WEBPACK FOOTER //
// ./src/containers/SignupPage/SignupForm.js