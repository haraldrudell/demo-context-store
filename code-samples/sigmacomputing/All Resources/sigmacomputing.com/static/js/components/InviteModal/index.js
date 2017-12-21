// @flow
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Alert, Button, Form, Input, Modal, Text, TextSpan } from 'widgets';
import type { PendingInvitation } from 'types';
import { sendInvite } from 'api/invite';
import { validateEmail } from 'utils/auth';

const FormItem = Form.Item;

type Props = {
  form: Form,
  visible: boolean,
  onClose: () => void,
  pendingInvites: Array<PendingInvitation>
};

class InviteModal extends PureComponent<Props> {
  alert: ?HTMLElement;

  setAlertRef = (r: ?HTMLElement) => {
    this.alert = r;
  };

  sendInvite = (email: string) => {
    const { pendingInvites } = this.props;
    const alreadySent = pendingInvites.some(invite => invite.email === email);
    if (this.alert) ReactDOM.unmountComponentAtNode(this.alert);

    if (alreadySent) {
      if (this.alert) {
        ReactDOM.render(
          <Alert
            banner
            message="An invite has already been sent to this email address"
            type="error"
            closable
            showIcon
          />,
          this.alert
        );
      }
    } else {
      sendInvite(email).then(() => {
        if (this.alert) {
          ReactDOM.render(
            <Alert
              banner
              message="Invite Sent"
              type="success"
              closable
              showIcon
            />,
            this.alert
          );
        }
      });
    }
  };

  checkEmail = (rule, value, cb) => {
    const error = validateEmail(value);
    if (value && error) {
      cb(error.email);
    } else {
      cb();
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.sendInvite(values.email);
      }
    });
  };

  renderContent() {
    return (
      <div>
        <div ref={this.setAlertRef} />
        <Text font="bodyMedium" mt={3} mb={3}>
          Invite a person at your company to Sigma by entering their email
          address
        </Text>
        <div className="flex-row">
          <div className="flex-item">{this.renderForm()}</div>
          <div className="flex-item">
            <Text font="bodyMedium" opacity={0.5} pl={3} mb={3}>
              New team members will be added to<br />the team with the User
              role. You can<br /> change these settings later.
            </Text>
          </div>
        </div>
      </div>
    );
  }

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldError } = form;
    const emailError = getFieldError('email');

    return (
      <Form>
        <FormItem
          key="email"
          validateStatus={emailError ? 'error' : ''}
          help={emailError || ''}
        >
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: 'Email required!' },
              { validator: this.checkEmail }
            ]
          })(<Input placeholder="email address" />)}
        </FormItem>
      </Form>
    );
  }

  renderFooter() {
    const { onClose } = this.props;

    return [
      <Button key="cancel" type="secondary" onClick={onClose}>
        Cancel
      </Button>,
      <Button
        key="confirm"
        type="primary"
        htmlType="submit"
        onClick={this.handleSubmit}
      >
        Send Invite
      </Button>
    ];
  }

  render() {
    const { visible, onClose } = this.props;

    return (
      <Modal
        visible={visible}
        onClose={onClose}
        title={<TextSpan font="header3">Invite a Team Member</TextSpan>}
        footer={this.renderFooter()}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default Form.create()(InviteModal);



// WEBPACK FOOTER //
// ./src/components/InviteModal/index.js