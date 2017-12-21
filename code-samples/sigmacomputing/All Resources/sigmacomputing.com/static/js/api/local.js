// @flow

import gql from 'graphql-tag';
import { withClientState } from 'apollo-link-state';

import { getApiClient } from './client';

const LastConnectionQuery = gql`
  query GetLastConnectionId {
    lastConnectionId @client
  }
`;

export const LocalLink = withClientState({
  Query: {
    // provide an initial state
    lastConnectionId: () => null
  },
  Mutation: {
    // update values in the store on mutations
    updateLastConnectionId: (
      _: any,
      { connectionId }: { connectionId: ?string },
      { cache }: Object
    ) => {
      const data = { lastConnectionId: connectionId };

      cache.writeQuery({
        query: LastConnectionQuery,
        data
      });

      return {
        ...data,
        __typename: 'LastConnectionId'
      };
    }
  }
});

export function updateLastConnectionId(connectionId: string): Promise<{}> {
  return getApiClient()
    .mutate({
      mutation: gql`
        mutation UpdateLastConnectionId($connectionId: String) {
          updateLastConnectionId(connectionId: $connectionId) @client {
            lastConnectionId @client
          }
        }
      `,
      variables: { connectionId }
    })
    .then(() => {});
}



// WEBPACK FOOTER //
// ./src/api/local.js