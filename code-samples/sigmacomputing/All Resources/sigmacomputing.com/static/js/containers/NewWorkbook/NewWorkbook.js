// @flow
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import type { RouterHistory, Location } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import invariant from 'invariant';

import { captureException } from 'utils/errors';
import { ConnectionFragment, mapConnection } from 'api/connection';
import { updateLastConnectionId } from 'api/local';
import Layout from 'components/layout';
import type { Id } from 'types';
import LoadingCurtain from 'components/LoadingCurtain';
import NewWorkbookForm from 'components/library/NewWorkbookForm';

class NewWorkbook extends Component<{
  data: {
    lastConnectionId: ?Id,
    loading: boolean,
    organization: ?{
      connections: Array<Object>
    }
  },
  history: RouterHistory,
  location: Location
}> {
  onSelectConnection = (connectionId: Id) => {
    // XXX KT: Eventually should display this error. For now I want to just
    // capture exception first to see what kind of error/message to display
    updateLastConnectionId(connectionId).catch(captureException);
  };

  render() {
    const { lastConnectionId, loading, organization } = this.props.data;
    if (loading) return <LoadingCurtain text="Loading Database Connections" />;

    invariant(organization != null, 'Missing connections');

    const connections = organization.connections.map(mapConnection);

    const { history, location } = this.props;
    const currentFolder = location.state
      ? location.state.currentFolder
      : undefined;

    return (
      <Layout>
        <Helmet title="New Worksheet - Sigma" />
        <NewWorkbookForm
          connections={connections}
          currentFolder={currentFolder}
          defaultConnectionId={lastConnectionId}
          onSelectConnection={this.onSelectConnection}
          history={history}
        />
      </Layout>
    );
  }
}

const ConnectionsQuery = gql`
  query ListNewWsConnections {
    organization {
      connections {
        ...ConnectionFragment
      }
    }
    lastConnectionId @client
  }
  ${ConnectionFragment}
`;

export default graphql(ConnectionsQuery)(NewWorkbook);



// WEBPACK FOOTER //
// ./src/containers/NewWorkbook/NewWorkbook.js