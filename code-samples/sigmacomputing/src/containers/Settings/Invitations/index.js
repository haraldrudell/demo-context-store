// @flow
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { graphql, compose } from 'react-apollo';
import invariant from 'invariant';

import { Alert } from 'widgets';
import Loading from 'components/widgets/Loading';
import {
  deleteInvite,
  resendInvite,
  ListInvitesQuery,
  mapPendingInvitation
} from 'api/invite';
import { GetMemberQuery } from 'api/user';
import { getCurrentUserId } from 'utils/auth';
import Invitations from './Invitations';

type Props = {
  memberData: {
    loading: boolean,
    member: ?Object
  },
  invitesData: {
    loading: boolean,
    pendingInvites: ?Array<Object>
  }
};

class Settings extends PureComponent<Props> {
  alert: ?HTMLElement;

  onResendInvite = (email: string) => {
    if (this.alert) ReactDOM.unmountComponentAtNode(this.alert);
    resendInvite(email).then(() => {
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
  };

  setAlertRef = (r: ?HTMLElement) => {
    this.alert = r;
  };

  render() {
    const { memberData, invitesData } = this.props;
    const loading = memberData.loading || invitesData.loading;
    if (loading) {
      return <Loading text="Loading Invitations" />;
    }

    invariant(memberData.member != null, 'Missing user data');
    invariant(invitesData.pendingInvites != null, 'Missing invitations data');
    if (!memberData.member.isAdmin) {
      //TODO Need a better page for this
      return <div>Only Organization Administrators may send invitations</div>;
    }

    const pendingInvites = invitesData.pendingInvites.map(mapPendingInvitation);
    return (
      <div>
        <div ref={this.setAlertRef} />
        <Invitations
          pendingInvites={pendingInvites}
          onDeleteInvite={deleteInvite}
          onResendInvite={this.onResendInvite}
        />
      </div>
    );
  }
}

export default compose(
  graphql(GetMemberQuery, {
    name: 'memberQuery',
    options: () => ({ variables: { userId: getCurrentUserId() } }),
    props: ({ memberQuery }) => {
      const loading = memberQuery.loading;
      const member = memberQuery.organization
        ? memberQuery.organization.member
        : null;
      return { memberData: { loading, member } };
    }
  }),
  graphql(ListInvitesQuery, {
    name: 'invitesQuery',
    props: ({ invitesQuery }) => {
      const loading = invitesQuery.loading;
      const pendingInvites = invitesQuery.organization
        ? invitesQuery.organization.pendingInvites
        : null;
      return { invitesData: { loading, pendingInvites } };
    }
  })
)(Settings);



// WEBPACK FOOTER //
// ./src/containers/Settings/Invitations/index.js