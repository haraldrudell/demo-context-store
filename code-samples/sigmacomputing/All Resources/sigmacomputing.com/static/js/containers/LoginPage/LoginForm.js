// @flow
import * as React from 'react';
import Link from 'react-router-dom/Link';

import { Button, Form, Input } from 'widgets';

const FormItem = Form.Item;

class LoginForm extends React.Component<
  {
    form: Form,
    onLogin: (email: string, password: string) => Promise<Object>
  },
  {
    isLoading: boolean,
    loginError: Object
  }
> {
  state = {
    isLoading: false,
    loginError: {}
  };

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.isLoading) {
      this.setState({
        isLoading: true
      });
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.onLogin(values.email, values.password).then(loginError => {
            if (loginError) {
              this.setState({
                isLoading: false,
                loginError
              });
            }
          });
        } else {
          const { getFieldError } = this.props.form;
          this.setState({
            isLoading: false,
            loginError: {
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
    const { isLoading, loginError = {} } = this.state;

    const emailError =
      loginError.email || (isFieldTouched('email') && getFieldError('email'));
    const passwordError =
      loginError.password ||
      (isFieldTouched('password') && getFieldError('password'));

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <FormItem
          label={<b>Email</b>}
          validateStatus={emailError ? 'error' : ''}
          help={emailError || ''}
        >
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }]
          })(<Input />)}
        </FormItem>
        <FormItem
          label={<b>Password</b>}
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(<Input type="password" />)}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            width="100%"
          >
            Sign In
          </Button>
        </FormItem>
        <Link to="/password_reset">Forgot Password?</Link>
      </Form>
    );
  }
}

export default Form.create()(LoginForm);



// WEBPACK FOOTER //
// ./src/containers/LoginPage/LoginForm.js