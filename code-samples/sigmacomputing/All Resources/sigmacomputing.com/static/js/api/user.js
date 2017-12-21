// @flow
import invariant from 'invariant';
import gql from 'graphql-tag';

import { getCurrentUserId, validateEmail } from 'utils/auth';
import type { User } from 'types';
import { getApiClient } from './client';

export const OrgMemberFragment = gql`
  fragment OrgMemberFragment on OrgMember {
    userId
    name
    email
    isAdmin
  }
`;

export const GetMemberQuery = gql`
  query GetUser($userId: UserID!) {
    organization {
      member(id: $userId) {
        ...OrgMemberFragment
      }
    }
  }
  ${OrgMemberFragment}
`;

type OrgMember = {|
  userId: string,
  name: string,
  email: string,
  isAdmin: boolean
|};

export function mapMemberToUser({
  userId,
  name,
  email,
  isAdmin
}: OrgMember): User {
  return {
    id: userId,
    displayName: name,
    email,
    role: isAdmin ? 'owner' : 'member'
  };
}

export function getUserInfo(
  userId: string = getCurrentUserId()
): Promise<User> {
  return getApiClient()
    .query({
      query: GetMemberQuery,
      variables: { userId }
    })
    .then(({ data }) => {
      const { member } = data.organization;
      if (!member) return null;
      return mapMemberToUser(member);
    });
}

export function createIdentity(name: string, email: string): Promise<void> {
  invariant(
    validateEmail(email) == null,
    'email address has not been validated'
  );

  return getApiClient()
    .mutate({
      mutation: gql`
        mutation CreateIdentity($req: CreateIdentityReq!) {
          createIdentity(req: $req) {
            identity {
              email
            }
          }
        }
      `,
      variables: { req: { name, email } }
    })
    .then(() => {});
}



// WEBPACK FOOTER //
// ./src/api/user.js