// @flow

import React, { PureComponent } from 'react';

import { Button, Modal } from 'widgets';
import styles from './index.less';

const AUTH_MODAL_TITLE = 'Authorize Sigma for Google BigQuery';
const BIG_QUERY_SCOPE = 'https://www.googleapis.com/auth/bigquery';
const BIG_QUERY_OPTS = {
  prompt: 'consent',
  ux_mode: 'popup',
  scope: BIG_QUERY_SCOPE,
  fetch_basic_profile: false
};

const CLIENT_ID =
  '977800229534-7f1ojf7m1v0qbl6tqrtkps9hbd6mko96.apps.googleusercontent.com';

const LOADER = new Promise((res, rej) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = false;
  script.src = 'https://apis.google.com/js/api.js';

  script.onload = () => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2
        .init({
          client_id: CLIENT_ID,
          scope: BIG_QUERY_SCOPE
        })
        .then(
          () => {
            const auth = window.gapi.auth2.getAuthInstance();
            // if the user isn't signed in, then complete loading
            if (!auth.isSignedIn.get()) {
              return res();
            }
            // if the user is signed in, force an auth token reload
            auth.currentUser
              .get()
              .reloadAuthResponse()
              .then(() => {
                return res();
              });
          },
          err => {
            rej(err);
          }
        );
    });
  };

  const first = document.getElementsByTagName('script')[0];
  if (first && first.parentNode) {
    first.parentNode.insertBefore(script, first);
  }
});

function googleIsAuthorized(): boolean {
  if (!(window.gapi && window.gapi.auth2)) {
    return false;
  }

  const auth = window.gapi.auth2.getAuthInstance();
  if (!auth.isSignedIn.get()) {
    return false;
  }

  const user = auth.currentUser.get();
  if (!user.hasGrantedScopes(BIG_QUERY_SCOPE)) {
    return false;
  }

  return true;
}

function googleSignIn(force?: boolean): Promise<?string> {
  return LOADER.then(() => {
    if (force || !googleIsAuthorized()) {
      const auth = window.gapi.auth2.getAuthInstance();
      return auth.signIn(BIG_QUERY_OPTS);
    } else {
      return Promise.resolve(googleAccessToken());
    }
  });
}

function googleDisconnect(): Promise<null> {
  return LOADER.then(() => {
    const auth = window.gapi.auth2.getAuthInstance();
    if (!auth) {
      return null;
    }

    const user = auth.currentUser.get();
    if (user) {
      user.disconnect();
    }

    return null;
  });
}

// NOTE: this is only valid after calling googleSignIn()
function googleAccessToken(): ?string {
  if (!(window.gapi && window.gapi.auth2)) {
    return null;
  }

  const auth = window.gapi.auth2.getAuthInstance();
  if (!auth) {
    return null;
  }

  const user = auth.currentUser.get();
  if (!user) {
    return null;
  } else if (!user.hasGrantedScopes(BIG_QUERY_SCOPE)) {
    return null;
  }
  return user.getAuthResponse(true).access_token;
}

type GoogleOAuthProps = {
  active: boolean,
  onComplete: ?(?string) => void,
  wrapClassName?: string
};

type GoogleOAuthState = {
  visible: boolean,
  onComplete: (?string) => void
};

export class GoogleOAuthFlow extends PureComponent<
  GoogleOAuthProps,
  GoogleOAuthState
> {
  constructor(props: GoogleOAuthProps) {
    super(props);
    this.state = {
      visible: false,
      onComplete: this.defaultOnComplete
    };
  }

  componentDidMount() {
    if (this.props.active) {
      this.activate(this.props);
    } else {
      this.deactivate();
    }
  }

  componentWillReceiveProps(next: GoogleOAuthProps) {
    if (!next.active) {
      return this.deactivate();
    }

    // transition to being active
    if (next.active !== this.props.active) {
      this.activate(next);
    }
  }

  activate(next: GoogleOAuthProps) {
    const onComplete = next.onComplete || this.defaultOnComplete;

    // skip the popup if we're authorized
    if (googleIsAuthorized()) {
      return onComplete(googleAccessToken());
    }

    this.setState({
      visible: true,
      onComplete
    });
  }

  deactivate() {
    this.setState({
      visible: false,
      onComplete: this.defaultOnComplete
    });
  }

  authorize = () => {
    googleSignIn()
      .then(token => {
        this.onComplete(token);
      })
      .catch(() => {
        this.onComplete(null);
      });
  };

  cancel = () => {
    this.onComplete(null);
  };

  onComplete(token: ?string) {
    const onComplete = this.state.onComplete;
    this.setState({
      visible: false,
      onComplete: this.defaultOnComplete
    });

    onComplete(token);
  }

  // eslint-disable-next-line no-unused-vars
  defaultOnComplete(token: ?string) {
    throw new Error('Google OAuth: missing onComplete handler');
  }

  render() {
    const { wrapClassName } = this.props;
    const { visible } = this.state;
    return (
      <Modal
        title={AUTH_MODAL_TITLE}
        visible={visible}
        footer={null}
        closable={false}
        maskClosable={false}
        wrapClassName={wrapClassName}
      >
        <div className={styles.container}>
          <div className={styles.buttons}>
            <Button type="primary" onClick={this.authorize}>
              {'Authorize Sigma'}
            </Button>
            <Button type="secondary" onClick={this.cancel}>
              {'Cancel'}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default {
  googleSignIn,
  googleDisconnect,
  googleAccessToken
};



// WEBPACK FOOTER //
// ./src/utils/oauth2/index.js