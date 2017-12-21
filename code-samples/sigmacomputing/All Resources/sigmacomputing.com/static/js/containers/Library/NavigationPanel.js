// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { Box, Flex, Text } from 'widgets';
import { OrgMemberFragment } from 'api/user';

const Tab = ({
  isActive,
  title,
  to
}: {
  isActive: boolean,
  title: string,
  to: string
}) => (
  <Link to={to}>
    <Box
      bl={4}
      borderColor={isActive ? 'blue' : 'transparent'}
      color={isActive ? 'blue' : 'darkBlue2'}
      mb={2}
      pl={4}
      py={1}
    >
      {title}
    </Box>
  </Link>
);

class NavigationPanel extends Component<{
  pathname: string,
  data: {
    organization: ?{
      name: string,
      members: Array<Object>
    }
  }
}> {
  renderMembers(orgName: string, members: Array<Object>) {
    const membersText = members.length === 1 ? 'member' : 'members';
    return (
      <Box m={4}>
        <Box font="bodyLarge" color="darkBlue2">
          {`${orgName}`}
        </Box>
        <Link to="/settings/organizations">
          <Text
            font="bodyMedium"
            py={1}
          >{`${members.length} ${membersText}`}</Text>
        </Link>
      </Box>
    );
  }

  render() {
    const { pathname, data } = this.props;

    return (
      <Flex column justify="space-between" width="220px">
        <Box pt={1}>
          <Tab isActive={pathname === '/'} title="Home" to="/" />
          {/*
          <Tab
            isActive={pathname === '/ws/shared'}
            title="Shared with Me"
            to="/ws/shared"
          />
          <Tab isActive={pathname === '/recent'} title="Recent" to="/recent" />
          */}
        </Box>
        {data.organization != null &&
          this.renderMembers(data.organization.name, data.organization.members)}
      </Flex>
    );
  }
}

const OrgOverviewQuery = gql`
  query GetOrgOverview {
    organization {
      name
      members {
        ...OrgMemberFragment
      }
    }
  }
  ${OrgMemberFragment}
`;

export default graphql(OrgOverviewQuery)(NavigationPanel);



// WEBPACK FOOTER //
// ./src/containers/Library/NavigationPanel.js