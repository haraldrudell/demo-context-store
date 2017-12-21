// @flow

import React, { PureComponent } from 'react';

import { Button, Form, Radio, Input } from 'widgets';
import type { Connection, ConnectionFormType } from 'types/connection';
import SnowflakeForm from './SnowflakeForm';
import DatabaseForm from './DatabaseForm';
import BigQueryForm from './BigQueryForm';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const DEFAULT_CONNECTION = {
  type: 'snowflake',
  label: '',
  isPrivate: null
};

class ConnectionForm extends PureComponent<{
  connection?: Connection,
  form: Form,
  updateConnection: ConnectionFormType => void,
  submitText?: string
}> {
  getConnectionForm() {
    const { connection, form } = this.props;
    const type = connection ? connection.type : '';

    switch (form.getFieldValue('type') || type) {
      case 'snowflake':
        return SnowflakeForm({ connection, form });
      case 'bigQuery':
        return BigQueryForm({ connection, form });
      case 'postgres':
      case 'redshift':
        return DatabaseForm({ connection, form });
      default:
        throw new Error(`No valid type for ${type}`);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // databases apparently aren't cool with extra whitespace
        // so we trim all string keys
        const vals = { ...values };
        for (const k of Object.keys(vals)) {
          const v = vals[k];
          if (v && typeof v === 'string') {
            vals[k] = v.trim();
          }
        }
        this.props.updateConnection(vals);
      }
    });
  };

  render() {
    const { form, connection, submitText = 'Update Connection' } = this.props;
    const { getFieldDecorator, getFieldError } = form;
    const labelError = getFieldError('label');
    const typeError = getFieldError('type');
    const { type, label } = connection || DEFAULT_CONNECTION;

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <FormItem
          label={<b>Connection Type</b>}
          validateStatus={typeError ? 'error' : ''}
          help={typeError || ''}
        >
          {getFieldDecorator('type', {
            initialValue: type,
            rules: [
              { required: true, message: 'Please select a connection type!' }
            ]
          })(
            <RadioGroup>
              <Radio value="snowflake">Snowflake</Radio>
              <Radio value="bigQuery">BigQuery</Radio>
              <Radio value="postgres">Postgres</Radio>
              <Radio value="redshift">Redshift</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          key="label"
          label={<b>Name</b>}
          validateStatus={labelError ? 'error' : ''}
          help={labelError || ''}
        >
          {getFieldDecorator('label', {
            initialValue: label,
            rules: [{ required: true, message: 'Name required!' }]
          })(<Input />)}
        </FormItem>
        {this.getConnectionForm()}
        <FormItem>
          <Button type="primary" htmlType="submit">
            {submitText}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(ConnectionForm);



// WEBPACK FOOTER //
// ./src/components/settings/ConnectionForm.js