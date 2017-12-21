// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';

import type {
  ConnectionType,
  ConnectionFormType,
  ValidationResponse
} from 'types/connection';
import { Box, Button, Flex, Icon, Spin, Text, Tooltip } from 'widgets';
import { makeCancelable, type CancelablePromise } from 'utils/promise';
import { getIcon } from 'utils/connection';
import styles from './ConnectionValidation.less';
import { GoogleOAuthFlow } from 'utils/oauth2';

const cx = classnames.bind(styles);

type Props = {
  connection: ConnectionFormType,
  validate: (connection: ConnectionFormType) => Promise<ValidationResponse>,
  onCancel: () => void,
  onReturnEdit: () => void,
  onSubmit: (connection: ConnectionFormType) => Promise<*>,
  onSuccess: () => void
};

type State = {
  validation: ?ValidationResponse,
  isSaving: boolean,
  fetchGoogleToken: boolean,
  onFetchGoogleToken: ?(?string) => void
};

function wasSuccess(validation: ?ValidationResponse): boolean {
  if (!validation) return false;

  const keys = Object.keys(validation);
  if (keys.length === 0) return false;
  for (const k of keys) {
    if (k === 'errorMsg') {
      if (validation[k]) return false;
    } else if (!validation[k]) return false;
  }
  return true;
}

export default class ConnectionValidation extends PureComponent<Props, State> {
  validatePromise: ?CancelablePromise;

  constructor(props: Props) {
    super(props);
    this.state = {
      isSaving: false,
      validation: null,
      fetchGoogleToken: false,
      onFetchGoogleToken: null
    };
  }

  componentDidMount() {
    if (this.props.connection.type !== 'bigQuery') {
      this.validatePromise = makeCancelable(
        this.props.validate(this.props.connection)
      );
    } else {
      this.validatePromise = makeCancelable(
        new Promise((res, rej) => {
          // eslint-disable-next-line no-unused-vars
          const handler = token => {
            this.setState({
              fetchGoogleToken: false,
              onFetchGoogleToken: null
            });
            this.props.validate(this.props.connection).then(res, rej);
          };

          this.setState({
            fetchGoogleToken: true,
            onFetchGoogleToken: handler
          });
        })
      );
    }

    this.validatePromise.promise
      .then(validation => {
        this.setState({ validation });
      })
      .catch(e => {
        this.validatePromise = null;
        if (!e.isCanceled) {
          this.setState({
            validation: {
              connectToHost: false,
              connectToDb: false,
              loginToDb: false,
              executeQuery: false,
              errorMsg: (e.error && e.error.message) || e.toString()
            }
          });
        }
      });
  }

  componentWillUnmount() {
    if (this.validatePromise) {
      this.validatePromise.cancel();
      this.validatePromise = null;
    }
  }

  onSubmit = () => {
    this.setState({ isSaving: true });
    this.props
      .onSubmit(this.props.connection)
      .then(() => {
        this.setState({ isSaving: false });
        this.props.onSuccess();
      })
      .catch(() => this.setState({ isSaving: false }));
  };

  renderItem = (title: string, status: ?boolean) => {
    let icon;
    if (status === undefined) {
      icon = (
        <span className={cx('icon')}>
          <Spin />
        </span>
      );
    } else if (status) {
      icon = <Icon color="greenAccent" mr={4} type="check" />;
    } else {
      icon = <Icon color="redAccent" mr={4} type="close" />;
    }

    return (
      <Flex align="center" font="header3" mt={4}>
        {icon}
        {title}
      </Flex>
    );
  };

  render() {
    const { onCancel, onReturnEdit, connection } = this.props;
    const { label } = connection;
    // $FlowFixMe
    const type: ConnectionType = connection.type;
    const { isSaving, fetchGoogleToken, onFetchGoogleToken } = this.state;

    let actions;
    if (this.state.validation !== null) {
      const isSuccess = wasSuccess(this.state.validation);
      // validation call is complete
      actions = (
        <Flex mt={4}>
          <Button mr={4} type="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={isSuccess ? this.onSubmit : onReturnEdit}
            loading={isSaving}
          >
            {isSuccess ? 'Save Connection' : 'Edit Connection'}
          </Button>
        </Flex>
      );
    }

    const validation = this.state.validation || {};
    return (
      <div>
        <GoogleOAuthFlow
          active={fetchGoogleToken}
          onComplete={onFetchGoogleToken}
        />
        <div className={cx(styles.container, 'flex-row', 'justify-space')}>
          <div className="flex-item flex-column align-center">
            <div
              className={cx(styles.connectionBlock, 'flex-row align-center')}
            >
              <img
                className={styles.connectionIcon}
                alt={type}
                src={getIcon(type)}
              />
              <Text font="header3">{label}</Text>
            </div>
          </div>
          <div className={cx(styles.rightBox, 'flex-item')}>
            {this.renderItem('Connecting to Host', validation.connectToHost)}
            {this.renderItem('Connecting to Database', validation.connectToDb)}
            {this.renderItem('Login to Database', validation.loginToDb)}
            {this.renderItem('Running Test Query', validation.executeQuery)}
            {validation.errorMsg && (
              <Box mt={4}>
                <Tooltip
                  trigger="hover"
                  placement="top"
                  title={validation.errorMsg}
                >
                  <a>
                    <Text font="header3">
                      <Icon color="redAccent" mr={4} type="warning" />
                      Error Detail
                    </Text>
                  </a>
                </Tooltip>
              </Box>
            )}
            {actions}
          </div>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/settings/ConnectionValidation.js