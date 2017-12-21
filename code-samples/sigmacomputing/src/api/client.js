// @flow

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { getToken } from 'utils/auth';
import { getEndpointBase } from 'utils/apiCaller';
import { isProd } from 'env';
import { LocalLink } from './local';

let ApiClient: ?ApolloClient = null;

const withToken = setContext(() =>
  getToken().then(token => {
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : null
      }
    };
  })
);

const link = ApolloLink.from([
  LocalLink,
  withToken,
  new HttpLink({ uri: `${getEndpointBase('v2')}/graphql` })
]);

// We map each object to a type that uniquely identifies it in the cache. We
// presume that we're only tracking objects for a single organization at a
// time.
const idMap = {
  // We should only have one of these objects.
  Organization: () => 'Organization',
  Me: () => 'Me',
  Identity: () => 'Identity',

  OrgMember: object => object.userId,
  PendingInvite: object => object.email,
  Connection: object => object.connectionId,

  Folder: object => object.inodeId,
  Worksheet: object => object.inodeId,
  Dashboard: object => object.inodeId
};

function dataIdFromObject(object) {
  const mapper = idMap[object.__typename];
  if (!mapper) {
    // console.log('No match for', object.__typename);
    return null;
  }

  const id = mapper(object);
  if (!isProd && !id) {
    // eslint-disable-next-line no-console
    console.warn(`Missing id for object ${object.__typename}`);
  }
  return id;
}

export function getApiClient(): ApolloClient {
  if (!ApiClient) {
    ApiClient = new ApolloClient({
      link,
      cache: new InMemoryCache({
        dataIdFromObject,
        fragmentMatcher: {
          // XXX JDF: This fragmentMatcher stuff is a bit of a mystery to me.
          // Reading through the code for apollo-cache-inmemory suggests this
          // is what they're looking for, but I'm still unclear what fragments
          // are in this context, since they're not the same as GraphQL's well
          // known fragments.
          match(idValue, typeCondition, context) {
            const obj = context.store.get(idValue.id);
            if (!obj) return false;
            const { __typename: typename } = obj;
            if (typename === typeCondition) return true;

            // We return true if `typename` implements `typeCondition`.
            if (
              typeCondition === 'Inode' &&
              (typename === 'Folder' ||
                typename === 'Worksheet' ||
                typename === 'Dashboard')
            )
              return true;

            return false;
          }
        }
      })
    });
  }

  return ApiClient;
}



// WEBPACK FOOTER //
// ./src/api/client.js