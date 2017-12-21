// @flow
import gql from 'graphql-tag';

import type { PendingInvitation } from 'types';
import { getApiClient } from './client';
import { publish } from 'utils/events';

export const inviteFragment = gql`
  fragment InviteStub on PendingInvite {
    email
    createdBy
    updatedAt
  }
`;

export const ListInvitesQuery = gql`
  query ListInvites {
    organization {
      pendingInvites {
        ...InviteStub
      }
    }
  }
  ${inviteFragment}
`;

export function mapPendingInvitation(
  pendingInvitation: Object
): PendingInvitation {
  const { email, createdBy, updatedAt } = pendingInvitation;
  return {
    email,
    fromUserId: createdBy,
    sentAt: new Date(updatedAt)
  };
}

export function sendInvite(email: string): Promise<void> {
  publish('SentInvite', { email });
  return getApiClient()
    .mutate({
      mutation: gql`
        mutation SendInvite($req: InviteByEmailReq!) {
          inviteByEmail(req: $req) {
            pendingInvite {
              ...InviteStub
            }
          }
        }
        ${inviteFragment}
      `,
      variables: { req: { email } },
      update: (store, { data: { inviteByEmail } }) => {
        const pendingInvite = inviteByEmail.pendingInvite;
        const data = store.readQuery({ query: ListInvitesQuery });
        data.organization.pendingInvites.push(pendingInvite);
        store.writeQuery({ query: ListInvitesQuery, data });
      }
    })
    .then(() => {});
}

export function resendInvite(email: string): Promise<void> {
  return getApiClient()
    .mutate({
      mutation: gql`
        mutation ResendInvite($req: ResendInviteReq!) {
          resendInvite(req: $req) {
            pendingInvite {
              ...InviteStub
            }
          }
        }
        ${inviteFragment}
      `,
      variables: { req: { email } }
    })
    .then(() => {});
}

export function deleteInvite(email: string): Promise<void> {
  return getApiClient()
    .mutate({
      mutation: gql`
        mutation DeleteInvite($req: RevokeInviteReq!) {
          revokeInvite(req: $req) {
            success
          }
        }
      `,
      variables: { req: { email } },
      update: store => {
        const data = store.readQuery({ query: ListInvitesQuery });
        data.organization.pendingInvites = data.organization.pendingInvites.filter(
          invite => invite.email !== email
        );
        store.writeQuery({ query: ListInvitesQuery, data });
      }
    })
    .then(() => {});
}

export function acceptInvite(organizationId: string): Promise<void> {
  return getApiClient()
    .mutate({
      mutation: gql`
        mutation AcceptInvite($req: ResolveInviteReq!) {
          resolveInvite(req: $req) {
            member {
              userId
            }
          }
        }
      `,
      variables: { req: { organizationId } }
    })
    .then(() => {});
}



// WEBPACK FOOTER //
// ./src/api/invite.js