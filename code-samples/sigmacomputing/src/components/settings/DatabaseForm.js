// @flow

import * as React from 'react';

import { Form, Input, InputNumber } from 'widgets';
import type { Connection } from 'types/connection';
import { CONN_IP, PG_PORT, REDSHIFT_PORT } from 'const/DbConstants';

const FormItem = Form.Item;

type Props = {
  connection?: Connection,
  form: Form
};

export default function DatabaseForm(props: Props) {
  const { form, connection } = props;
  const { database, host, user, port } = connection || {};
  const { getFieldValue, getFieldDecorator, getFieldError } = form;
  const userError = getFieldError('user');
  const passwordError = getFieldError('password');
  const databaseError = getFieldError('database');
  const hostError = getFieldError('host');
  const portError = getFieldError('port');
  const isPostgres = getFieldValue('type') === 'postgres';
  const databaseName = isPostgres ? 'Postgres' : 'Redshift';
  const defaultPort = isPostgres ? PG_PORT : REDSHIFT_PORT;

  return [
    <FormItem
      key="user"
      label={<b>{`${databaseName} Username`}</b>}
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
      label={<b>{`${databaseName} Password`}</b>}
      validateStatus={passwordError ? 'error' : ''}
      help={passwordError || ''}
    >
      {getFieldDecorator('password', {
        initialValue: '',
        rules: [{ required: true, message: 'Password required!' }]
      })(<Input type="password" autoComplete="off" />)}
    </FormItem>,
    <FormItem
      key="database"
      label={<b>Database</b>}
      validateStatus={databaseError ? 'error' : ''}
      help={databaseError || ''}
    >
      {getFieldDecorator('database', {
        initialValue: database,
        rules: [{ required: true, message: 'Database required!' }]
      })(<Input />)}
    </FormItem>,
    <FormItem
      key="host"
      label={<b>Host</b>}
      validateStatus={hostError ? 'error' : ''}
      help={hostError || ''}
      extra={CONN_IP}
    >
      {getFieldDecorator('host', {
        initialValue: host,
        rules: [{ required: true, message: 'Host required!' }]
      })(<Input />)}
    </FormItem>,
    <FormItem
      key="port"
      label={<b>Port</b>}
      validateStatus={portError ? 'error' : ''}
      help={portError || ''}
    >
      {getFieldDecorator('port', {
        initialValue: port || defaultPort,
        rules: [{ type: 'integer' }]
      })(<InputNumber style={{ width: '100%' }} />)}
    </FormItem>
  ];
}



// WEBPACK FOOTER //
// ./src/components/settings/DatabaseForm.js