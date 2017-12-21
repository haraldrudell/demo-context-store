// @flow
import gql from 'graphql-tag';
import invariant from 'invariant';

import type { Id, DbConnectionType } from 'types';
import type { Connection, ConnectionFormType } from 'types/connection';
import { publish } from 'utils/events';
import { getApiClient } from './client';

export const DEFAULT_CONNECTION_ID: string =
  '00000000-0000-0000-0000-000000000000';

export const ConnectionFragment = gql`
  fragment ConnectionFragment on Connection {
    connectionId
    isSample
    isPrivate
    name
    type
    createdBy {
      userId
    }
  }
`;

export function mapConnection(connection: Object): DbConnectionType {
  const {
    connectionId,
    isSample,
    isPrivate,
    createdBy,
    name,
    type
  } = connection;
  return {
    id: connectionId,
    label: name,
    isPrivate,
    createdBy: createdBy.userId,
    isSample,
    type
  };
}

export function listAllConnections(): Promise<Array<DbConnectionType>> {
  return getApiClient()
    .query({
      query: gql`
        query ListUserConnections {
          organization {
            connections {
              ...ConnectionFragment
            }
          }
        }
        ${ConnectionFragment}
      `
    })
    .then(({ data }) => {
      const { connections } = data.organization;
      return connections.map(mapConnection);
    });
}

export function createConnection(
  con: ConnectionFormType
): Promise<DbConnectionType> {
  const { label, type, password, ...details } = con;

  // $FlowFixMe
  details.password = {
    type: 'plain',
    value: password
  };

  const connection = {
    name: label,
    isPrivate: false,
    details,
    type
  };

  return getApiClient()
    .mutate({
      mutation: gql`
        mutation CreateConnection($req: CreateConnectionReq!) {
          createConnection(req: $req) {
            connection {
              ...ConnectionFragment
            }
          }
        }
        ${ConnectionFragment}
      `,
      variables: { req: connection }
    })
    .then(({ data }) => {
      const { connectionId, name, type } = data.createConnection.connection;

      publish('CreateDBConnection', { type });
      return {
        id: connectionId,
        meta: {
          label: name,
          type: type
        }
      };
    });
}

export function updateConnection(
  cid: Id,
  con: ConnectionFormType
): Promise<{}> {
  const { label, type, password, isPrivate, ...details } = con;

  // $FlowFixMe
  details.password = {
    type: 'plain',
    value: password
  };

  const connection = {
    connectionId: cid,
    name: label,
    isPrivate,
    details,
    type
  };

  return getApiClient()
    .mutate({
      mutation: gql`
        mutation UpdateConnection($req: UpdateConnectionReq!) {
          updateConnection(req: $req) {
            connection {
              ...ConnectionFragment
            }
          }
        }
        ${ConnectionFragment}
      `,
      variables: { req: connection }
    })
    .then(() => void 0);
}

export function loadConnection(cid: Id): Promise<DbConnectionType> {
  if (isDefaultConnection(cid)) {
    return Promise.resolve({
      id: DEFAULT_CONNECTION_ID,
      label: 'Sigma Sample Database',
      type: 'snowflake',
      isPrivate: false,
      isSample: true
    });
  }

  return getApiClient()
    .query({
      query: gql`
        query LookupConnection($cid: UUID!) {
          organization {
            connection(id: $cid) {
              ...ConnectionFragment
            }
          }
        }
        ${ConnectionFragment}
      `,
      variables: { cid }
    })
    .then(({ data }) => mapConnection(data.organization.connection));
}

export const ConnectionDetailsFragment = gql`
  fragment ConnectionDetailsFragment on Connection {
    ...ConnectionFragment
    details
  }
  ${ConnectionFragment}
`;

export function loadFullConnection(cid: Id): Promise<Connection> {
  invariant(
    !isDefaultConnection(cid),
    'should not ask for details of default connection'
  );

  return getApiClient()
    .query({
      query: gql`
        query LookupConnection($cid: UUID!) {
          organization {
            connection(id: $cid) {
              ...ConnectionDetailsFragment
            }
          }
        }
        ${ConnectionDetailsFragment}
      `,
      variables: { cid }
    })
    .then(({ data }) => {
      const {
        connectionId,
        isPrivate,
        name,
        type,
        details
      } = data.organization.connection;
      return Object.assign(
        {
          id: connectionId,
          isPrivate,
          label: name,
          type
        },
        details
      );
    });
}

function isDefaultConnection(cid: ?Id): boolean {
  return (
    cid == null ||
    cid === DEFAULT_CONNECTION_ID ||
    cid === 'SIGMA SAMPLE DATABASE'
  );
}



// WEBPACK FOOTER //
// ./src/api/connection.js