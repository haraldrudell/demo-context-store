// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import invariant from 'invariant';

import { Box, Button, Flex, Text } from 'widgets';
import Loading from 'components/widgets/Loading';
import { ConnectionFragment, mapConnection } from 'api/connection';
import { getCurrentUserId } from 'utils/auth';
import { names as sortNames } from 'utils/sort';

import ConnectionBlock from './ConnectionBlock';

type Props = {
  data: {
    loading: boolean,
    organization: ?{
      connections: Array<Object>
    }
  }
};

class Settings extends Component<Props> {
  render() {
    const { loading, organization } = this.props.data;
    if (loading) {
      return <Loading text="Loading..." />;
    }

    invariant(organization != null, 'Missing connections data');
    const connections = organization.connections.map(mapConnection);

    const currentUserId = getCurrentUserId();

    const allConns = connections.sort(sortNames(true, 'label'));
    const orgConns = allConns.filter(c => !c.isPrivate);
    const myConns = allConns.filter(c => c.isPrivate);

    return (
      <div>
        <Flex justify="flex-end" my={2}>
          <Link to="/settings/connections/new">
            <Button type="primary">Create Connection</Button>
          </Link>
        </Flex>
        {orgConns.length > 0 && (
          <div>
            <Text font="header4">Shared Connections</Text>
            <Box
              b={2}
              bg="white"
              borderColor="darkBlue4"
              borderRadius={4}
              mb={4}
              mt={3}
            >
              {orgConns.map(c => {
                return (
                  <ConnectionBlock
                    key={c.id}
                    label={c.label}
                    id={c.id}
                    type={c.type}
                    canEdit={!c.isSample && c.createdBy === currentUserId}
                  />
                );
              })}
            </Box>
          </div>
        )}
        {myConns.length > 0 && (
          <div>
            <Text font="header4">Private Connections</Text>
            <Box
              b={2}
              bg="white"
              borderColor="darkBlue4"
              borderRadius={4}
              my={3}
            >
              {myConns.map(c => {
                return (
                  <ConnectionBlock
                    key={c.id}
                    label={c.label}
                    id={c.id}
                    type={c.type}
                    canEdit={true}
                  />
                );
              })}
            </Box>
          </div>
        )}
      </div>
    );
  }
}

const ConnectionsQuery = gql`
  query ListConnections {
    organization {
      connections {
        ...ConnectionFragment
      }
    }
  }
  ${ConnectionFragment}
`;

export default graphql(ConnectionsQuery)(Settings);



// WEBPACK FOOTER //
// ./src/containers/Settings/Connections/index.js