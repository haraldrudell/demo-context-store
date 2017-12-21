// @flow
import React, { PureComponent } from 'react';
import moment from 'moment';
import classnames from 'classnames/bind';

import { Button, Text } from 'widgets';
import type { PendingInvitation } from 'types';
import InviteModal from 'components/InviteModal';
import InviteMenu from './InviteMenu';
import styles from './Invitations.less';

const cx = classnames.bind(styles);

type Props = {
  pendingInvites: Array<PendingInvitation>,
  onDeleteInvite: (email: string) => Promise<void>,
  onResendInvite: (email: string) => void
};

type State = {
  showInviteModal: boolean
};

export default class Invitations extends PureComponent<Props, State> {
  constructor() {
    super();
    this.state = {
      showInviteModal: false
    };
  }

  showInviteModal = () => {
    this.setState({ showInviteModal: true });
  };

  hideInviteModal = () => {
    this.setState({ showInviteModal: false });
  };

  render() {
    const { pendingInvites = [], onDeleteInvite, onResendInvite } = this.props;

    const { showInviteModal } = this.state;

    let invites;
    if (pendingInvites.length > 0) {
      invites = (
        <div>
          <Text font="header4">Pending Invitations</Text>
          {pendingInvites.map(({ email, sentAt }) => (
            <div
              className={cx(
                'flex-row',
                'align-center',
                'justify-space',
                styles.pending
              )}
              key={email}
            >
              <div className="flex-row align-center">
                <InviteMenu
                  email={email}
                  onDeleteInvite={onDeleteInvite}
                  onResendInvite={onResendInvite}
                />
                <Text font="header5">{email}</Text>
              </div>
              {moment(sentAt).fromNow()}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <InviteModal
          visible={showInviteModal}
          onClose={this.hideInviteModal}
          pendingInvites={pendingInvites}
        />
        <div
          className={cx(
            'flex-row',
            'align-center',
            'justify-space',
            styles.invite
          )}
        >
          <Text font="bodyMedium">
            Invite other users at your company to join Sigma.
          </Text>
          <Button type="primary" onClick={this.showInviteModal}>
            Invite Users
          </Button>
        </div>
        {invites}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Settings/Invitations/Invitations.js