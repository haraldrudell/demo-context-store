// @flow
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import invariant from 'invariant';

import type { Connection, ConnectionFormType } from 'types/connection';
import { Alert } from 'widgets';
import ConnectionForm from 'components/settings/ConnectionForm';
import ConnectionValidation from 'components/settings/ConnectionValidation';
import Layout from 'components/layout';
import { checkDbConnection } from 'utils/apiCaller';
import styles from './NewConnection.less';

const PREV_ROUTE = { path: '/settings/connections', label: 'Settings' };

type Props = {
  connection?: Connection,
  submitText: string,
  title: string,
  updateConnection: ConnectionFormType => Promise<*>
};

type Stage = 'edit' | 'validate';

type State = {
  stage: Stage,
  pendingConnection: ?ConnectionFormType // set after edit while we wait for validation
};

export default class UpdateConnection extends PureComponent<Props, State> {
  alert: ?HTMLElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      stage: 'edit',
      pendingConnection: null
    };
  }

  onMoveToValidate = (pendingConnection: ConnectionFormType) =>
    this.setState({ stage: 'validate', pendingConnection });

  onReturnEdit = () => this.setState({ stage: 'edit' });

  onValidate = (pendingConnection: ConnectionFormType) => {
    const spec = {
      ...pendingConnection,
      password: {
        type: 'plain',
        value: pendingConnection.password
      }
    };
    return checkDbConnection(spec);
  };

  onCancel = () => {
    window.location = '/settings/connections';
  };

  onSuccess = () => {
    // let the user see the save worked and then redirect back to the list
    window.setTimeout(() => (window.location = '/settings/connections'), 1000);
  };

  onSubmit = (connectionInfo: ConnectionFormType) =>
    this.props
      .updateConnection(connectionInfo)
      .then(() => {
        ReactDOM.unmountComponentAtNode(this.alert);
        ReactDOM.render(
          <Alert
            banner
            message="Connection updated successfully"
            type="success"
            closable
            showIcon
          />,
          this.alert
        );
      })
      .catch(e => {
        ReactDOM.unmountComponentAtNode(this.alert);
        ReactDOM.render(
          <Alert
            banner
            message="Could not connect to database. Please verify that the info is correct."
            type="error"
            closable
            showIcon
          />,
          this.alert
        );
        return Promise.reject(e);
      });

  setAlertRef = (r: ?HTMLElement) => {
    this.alert = r;
  };

  render() {
    const { submitText, title, connection } = this.props;
    const { pendingConnection, stage } = this.state;

    let body;
    if (stage === 'edit') {
      body = (
        <div className={styles.content}>
          <ConnectionForm
            submitText={submitText}
            updateConnection={this.onMoveToValidate}
            connection={pendingConnection || connection}
          />
        </div>
      );
    } else {
      invariant(
        pendingConnection,
        'Stage is validate but no pendingConnection'
      );
      body = (
        <ConnectionValidation
          connection={pendingConnection}
          validate={this.onValidate}
          onCancel={this.onCancel}
          onReturnEdit={this.onReturnEdit}
          onSubmit={this.onSubmit}
          onSuccess={this.onSuccess}
        />
      );
    }

    return (
      <Layout previousRoute={PREV_ROUTE}>
        <Helmet title={title} />
        <div ref={this.setAlertRef} />
        {body}
      </Layout>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Connection/UpdateConnection.js