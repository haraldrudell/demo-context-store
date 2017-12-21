// @flow

import * as React from 'react';

import { Form, Input } from 'widgets';
import type { Connection } from 'types/connection';
import { CONN_IP } from 'const/DbConstants';

const FormItem = Form.Item;

type Props = {
  connection?: Connection,
  form: Form
};

export default function BigQueryForm(props: Props) {
  const { form, connection } = props;
  const { projectId } = connection || {};
  const { getFieldDecorator, getFieldError } = form;
  const projectIdError = getFieldError('projectId');

  return [
    <FormItem
      key="projectId"
      label={<b>Billing Project Id</b>}
      validateStatus={projectIdError ? 'error' : ''}
      help={projectIdError || ''}
      extra={CONN_IP}
    >
      {getFieldDecorator('projectId', {
        initialValue: projectId,
        rules: [{ required: true, message: 'Project Id required!' }]
      })(<Input autoComplete="off" />)}
    </FormItem>
  ];
}



// WEBPACK FOOTER //
// ./src/components/settings/BigQueryForm.js