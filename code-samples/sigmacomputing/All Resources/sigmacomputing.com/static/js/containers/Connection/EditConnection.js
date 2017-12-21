// @flow
import React, { PureComponent } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import invariant from 'invariant';

import { ConnectionDetailsFragment, updateConnection } from 'api/connection';
import type { Connection, ConnectionFormType } from 'types/connection';
import LoadingCurtain from 'components/LoadingCurtain';
import { decodeId } from 'utils/uuid62';
import UpdateConnection from './UpdateConnection';

type Props = {
  connection: ?Connection,
  loading: boolean
};

class EditConnection extends PureComponent<Props> {
  updateConnection = (con: ConnectionFormType) => {
    const { connection } = this.props;
    invariant(connection != null, 'Missing connection');

    return updateConnection(connection.id, con);
  };

  render() {
    const { loading, connection } = this.props;
    if (loading) {
      // still loading
      return <LoadingCurtain text="Loading Database Connection" />;
    }

    invariant(connection != null, 'Missing connection');
    return (
      <UpdateConnection
        submitText="Update Connection"
        title="Edit Connection"
        updateConnection={this.updateConnection}
        connection={connection}
      />
    );
  }
}

const ConnectionDetailsQuery = gql`
  query ConnectionDetails($connectionId: UUID!) {
    organization {
      connection(id: $connectionId) {
        ...ConnectionDetailsFragment
      }
    }
  }
  ${ConnectionDetailsFragment}
`;

const Page = graphql(ConnectionDetailsQuery, {
  options: ({ match: { params } }) => ({
    variables: {
      connectionId: decodeId(params.connectionId)
    }
  }),
  props: ({ data: { loading, organization } }) => {
    let connection = null;
    if (!loading) {
      const {
        connectionId,
        isPrivate,
        name,
        type,
        details
      } = organization.connection;
      connection = Object.assign(
        {
          id: connectionId,
          isPrivate,
          label: name,
          type
        },
        details
      );
    }

    return { connection, loading };
  }
})(EditConnection);

export default Page;



// WEBPACK FOOTER //
// ./src/containers/Connection/EditConnection.js