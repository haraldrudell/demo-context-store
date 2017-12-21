// @flow

import * as React from 'react';

import { Form, Input } from 'widgets';
import type { Connection } from 'types/connection';
import { CONN_IP } from 'const/DbConstants';

const FormItem = Form.Item;

export default function SnowflakeForm(props: {
  connection?: Connection,
  form: Form
}) {
  const { connection, form } = props;
  const { warehouse, server, user, role } = connection || {};
  const { getFieldDecorator, getFieldError } = form;

  const userError = getFieldError('user');
  const passwordError = getFieldError('password');
  const roleError = getFieldError('role');
  const warehouseError = getFieldError('warehouse');
  const serverError = getFieldError('server');

  return [
    <FormItem
      key="user"
      label={<b>Snowflake Username</b>}
      validateStatus={userError ? 'error' : ''}
      help={userError || ''}
    >
      {getFieldDecorator('user', {
        initialValue: user,
        rules: [{ required: true, message: 'Username required!' }]
      })(<Input autoComplete="off" />)}
    </FormItem>,
    <FormItem
      key="password"
      label={<b>Snowflake Password</b>}
      validateStatus={passwordError ? 'error' : ''}
      help={passwordError || ''}
    >
      {getFieldDecorator('password', {
        initialValue: '',
        rules: [{ required: true, message: 'Password required!' }]
      })(<Input type="password" autoComplete="off" />)}
    </FormItem>,
    <FormItem
      key="role"
      label={<b>Snowflake Role</b>}
      validateStatus={roleError ? 'error' : ''}
      help={roleError || ''}
    >
      {getFieldDecorator('role', {
        initialValue: role
      })(<Input placeholder="Optional" />)}
    </FormItem>,
    <FormItem
      key="warehouse"
      label={<b>Data Warehouse</b>}
      validateStatus={warehouseError ? 'error' : ''}
      help={warehouseError || ''}
    >
      {getFieldDecorator('warehouse', {
        initialValue: warehouse,
        rules: [{ required: true, message: 'Data warehouse required!' }]
      })(<Input />)}
    </FormItem>,
    <FormItem
      key="server"
      label={<b>Server</b>}
      validateStatus={serverError ? 'error' : ''}
      help={serverError || ''}
      extra={CONN_IP}
    >
      {getFieldDecorator('server', {
        initialValue: server,
        rules: [{ required: true, message: 'Host required!' }]
      })(<Input placeholder="***.snowflakecomputing.com" />)}
    </FormItem>
  ];
}



// WEBPACK FOOTER //
// ./src/components/settings/SnowflakeForm.js